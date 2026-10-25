// One coherent image pass at glass edges; media outside the glass stays native.
(() => {
  const roots = '#home-editorial, .film-image, #orbit, #note-reading-content, #project-content';
  const selector = roots.split(', ').flatMap(root => [`${root} img`, `${root} video:not([controls])`]).join(', ');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const surface = document.createElement('canvas');
  surface.className = 'edge-glass-canvas';
  surface.setAttribute('aria-hidden', 'true');
  document.body.append(surface);
  const gl = surface.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) { surface.remove(); return; }
  const vertex = `
    attribute vec2 aPosition;
    void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
  `;
  const fragment = `
    precision highp float;
    uniform sampler2D uImage;
    uniform vec4 uCanvas;
    uniform vec4 uFrame;
    uniform vec2 uBands;
    uniform vec2 uOrigin;
    uniform vec2 uAxisX;
    uniform vec2 uAxisY;
    uniform vec2 uSize;
    uniform vec4 uUv;
    uniform vec4 uMaterial;
    uniform vec4 uOptics;
    uniform vec4 uControl;
    float bend(float t) {
      t = clamp(t, 0.0, 1.0);
      return 1.0 - sqrt(max(0.0, 1.0 - t * t));
    }
    void main() {
      vec2 screen = vec2(gl_FragCoord.x / uCanvas.z, uCanvas.y - gl_FragCoord.y / uCanvas.w);
      if (uControl.z > 0.0 && screen.x >= uControl.x && screen.x <= uControl.x + uControl.z && screen.y >= uControl.y && screen.y <= uControl.y + uControl.w) discard;
      vec2 end = uFrame.xy + uFrame.zw;
      vec2 center = uOrigin + (uAxisX + uAxisY) * 0.5;
      float top = bend((uFrame.y + uBands.y - screen.y) / uBands.y);
      float bottom = bend((screen.y - end.y + uBands.y) / uBands.y);
      float left = bend((uFrame.x + uBands.x - screen.x) / uBands.x);
      float right = bend((screen.x - end.x + uBands.x) / uBands.x);
      float by = max(top, bottom), bx = max(left, right);
      vec2 source = screen;
      source.y += (top - bottom) * uOptics.y;
      source.x = center.x + (source.x - center.x) * (1.0 - by * uOptics.z);
      source.x += (left - right) * uOptics.x;
      source.y = center.y + (source.y - center.y) * (1.0 - bx * uOptics.w);
      // Never displace a pixel by more than six percent of this media item.
      source = screen + clamp(source - screen, -uSize * 0.06, uSize * 0.06);
      vec2 delta = source - uOrigin;
      float det = uAxisX.x * uAxisY.y - uAxisX.y * uAxisY.x;
      vec2 local = vec2(delta.x * uAxisY.y - delta.y * uAxisY.x,
                       uAxisX.x * delta.y - uAxisX.y * delta.x) / det;
      // Warp the mask too: the original rectangular quad must not clip the flare.
      vec2 q = abs((local - 0.5) * uSize) - uSize * 0.5 + uMaterial.w;
      float distance = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - uMaterial.w;
      float alpha = 1.0 - smoothstep(-0.75, 0.75, distance);
      if (alpha < 0.001) discard;
      local = clamp(local, 0.0, 1.0);
      vec2 uv = vec2(mix(uUv.x, uUv.z, local.x), 1.0 - mix(uUv.y, uUv.w, local.y));
      vec4 color = texture2D(uImage, uv);
      if (uMaterial.x > 0.1) {
        vec2 d = vec2(uMaterial.x) / uSize;
        color *= 0.24;
        color += (texture2D(uImage, uv + vec2(d.x, 0.0)) + texture2D(uImage, uv - vec2(d.x, 0.0))
                + texture2D(uImage, uv + vec2(0.0, d.y)) + texture2D(uImage, uv - vec2(0.0, d.y))) * 0.12;
        color += (texture2D(uImage, uv + d) + texture2D(uImage, uv - d)
                + texture2D(uImage, uv + vec2(d.x, -d.y)) + texture2D(uImage, uv + vec2(-d.x, d.y))) * 0.07;
      }
      float gray = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
      color.rgb = mix(vec3(gray), color.rgb, uMaterial.y);
      color.rgb += max(bx, by) * 0.006;
      gl_FragColor = vec4(color.rgb, color.a * alpha * uMaterial.z);
    }
  `;
  let program;
  try {
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
  } catch (error) { console.warn('Edge glass:', error); surface.remove(); return; }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['uImage', 'uCanvas', 'uFrame', 'uBands', 'uOrigin', 'uAxisX', 'uAxisY', 'uSize', 'uUv', 'uMaterial', 'uOptics', 'uControl'].map(name => [name, gl.getUniformLocation(program, name)]));
  const textures = new Map();
  let frame = 0, animateUntil = 0, stopped = false;
  const showOriginals = () => {
    document.documentElement.classList.remove('edge-glass-active');
    document.querySelectorAll('.edge-glass-source').forEach(media => media.classList.remove('edge-glass-source'));
  };
  function refresh(duration = 0) {
    if (stopped) return;
    animateUntil = Math.max(animateUntil, performance.now() + duration);
    if (!frame) frame = requestAnimationFrame(render);
  }
  window.edgeGlassRefresh = () => refresh(80);
  function renderNow() {
    if (stopped) return;
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    render();
  }
  window.edgeGlassRenderNow = renderNow;
  surface.addEventListener('webglcontextlost', event => {
    event.preventDefault(); stopped = true;
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    showOriginals(); surface.hidden = true;
  });
  function bounds(media, style, screenWidth, screenHeight) {
    const box = media.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) return null;
    const orbit = media.closest('.orbit-note');
    let angle = 0;
    if (orbit) {
      angle = Number(orbit.style.transform.match(/rotate\((-?[\d.]+)deg\)/)?.[1] || 0) * Math.PI / 180;
      const stack = media.closest('.stack-photo');
      if (stack) {
        const transform = getComputedStyle(stack).transform;
        if (transform !== 'none') { const m = new DOMMatrix(transform); angle += Math.atan2(m.b, m.a); }
      }
    }
    const c = Math.cos(angle), s = Math.sin(angle), ac = Math.abs(c), as = Math.abs(s);
    const denominator = ac * ac - as * as;
    let width = orbit ? Math.max(1, (box.width * ac - box.height * as) / denominator) : box.width;
    let height = orbit ? Math.max(1, (box.height * ac - box.width * as) / denominator) : box.height;
    const naturalWidth = media.naturalWidth || media.videoWidth;
    const naturalHeight = media.naturalHeight || media.videoHeight;
    if (!naturalWidth || !naturalHeight) return null;
    const aspect = naturalWidth / naturalHeight, boxAspect = width / height;
    const uv = [0, 0, 1, 1];
    if (style.objectFit === 'cover') {
      if (aspect > boxAspect) { const visible = boxAspect / aspect; uv[0] = (1 - visible) / 2; uv[2] = 1 - uv[0]; }
      else { const visible = aspect / boxAspect; uv[1] = (1 - visible) / 2; uv[3] = 1 - uv[1]; }
    } else if (style.objectFit === 'contain') {
      if (aspect > boxAspect) height = width / aspect;
      else width = height * aspect;
    }
    const centerX = box.left + box.width / 2, centerY = box.top + box.height / 2;
    const axisX = [width * c, width * s], axisY = [-height * s, height * c];
    const origin = [centerX - (axisX[0] + axisY[0]) / 2, centerY - (axisX[1] + axisY[1]) / 2];
    let view = { left: 0, top: 0, right: screenWidth, bottom: screenHeight };
    const clip = media.closest('#archive-stage, .film-window, .home-collection-pin');
    if (clip) {
      const r = clip.getBoundingClientRect();
      view = { left: Math.max(0, r.left), top: Math.max(0, r.top), right: Math.min(screenWidth, r.right), bottom: Math.min(screenHeight, r.bottom) };
    }
    const viewWidth = view.right - view.left, viewHeight = view.bottom - view.top;
    if (viewWidth < 2 || viewHeight < 2) return null;
    const optics = [Math.min(10, width * 0.04, viewWidth * 0.02), Math.min(14, height * 0.05, viewHeight * 0.025), Math.min(0.04, 16 / width), Math.min(0.04, 12 / height)];
    const bands = [Math.min(38, viewWidth * 0.08, width * 0.14), Math.min(52, viewHeight * 0.08, height * 0.16)];
    const expansion = Math.min(26, Math.max(width, height) * 0.08) + 4;
    const meetsGlass = box.left < view.left + bands[0] || box.right > view.right - bands[0]
      || box.top < view.top + bands[1] || box.bottom > view.bottom - bands[1];
    if (!meetsGlass) return null;
    const scissor = {
      left:Math.max(view.left,box.left-expansion),top:Math.max(view.top,box.top-expansion),
      right:Math.min(view.right,box.right+expansion),bottom:Math.min(view.bottom,box.bottom+expansion)
    };
    if (scissor.right <= scissor.left || scissor.bottom <= scissor.top) return null;
    // Render the complete photo with one sampling transform. Mixing a native
    // centre with separate edge strips produces visible joins and double edges.
    return { origin, axisX, axisY, width, height, uv, view, viewWidth, viewHeight, optics, bands, scissor };
  }
  function textureFor(media, style) {
    const video = media instanceof HTMLVideoElement;
    if (video ? media.readyState < 2 : !media.complete) return null;
    let entry = textures.get(media);
    if (!entry) {
      entry = { texture: gl.createTexture(), source: '', time: -1, opacity: Number(style.opacity) };
      textures.set(media, entry);
      gl.bindTexture(gl.TEXTURE_2D, entry.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    const source = media.currentSrc || media.src;
    gl.bindTexture(gl.TEXTURE_2D, entry.texture);
    if (entry.source !== source || (video && entry.time !== media.currentTime)) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, media); }
      catch { media.classList.remove('edge-glass-source'); return null; }
      entry.source = source;
      entry.time = video ? media.currentTime : -1;
    }
    media.classList.add('edge-glass-source');
    return entry;
  }
  function render() {
    frame = 0;
    if (stopped) return;
    try {
      const note = document.querySelector('#note-reading:not([hidden])');
      const host = note || (document.body.dataset.page === 'archive' ? document.querySelector('.archive-space') : null) || document.body;
      if (surface.parentElement !== host) host.append(surface);
      const width = innerWidth, height = innerHeight, ratio = Math.min(devicePixelRatio || 1, 1.5);
      if (surface.width !== Math.round(width * ratio) || surface.height !== Math.round(height * ratio)) {
        surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      }
      // Match DOM CSS pixels exactly, including scrollbar gutters, browser zoom
      // and fractional DPR. The rounded backing dimensions can have two scales.
      if (surface.style.width !== `${width}px`) surface.style.width = `${width}px`;
      if (surface.style.height !== `${height}px`) surface.style.height = `${height}px`;
      const scaleX = surface.width / width, scaleY = surface.height / height;
      gl.viewport(0, 0, surface.width, surface.height);
      gl.disable(gl.SCISSOR_TEST);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      for (const [media, entry] of textures) if (!media.isConnected) { gl.deleteTexture(entry.texture); textures.delete(media); }
      if (reduced.matches || document.hidden || (!note && document.querySelector('#project:not([hidden]) [data-edge-glass="off"]'))) { showOriginals(); return; }
      document.documentElement.classList.add('edge-glass-active');
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.SCISSOR_TEST);
      gl.uniform4f(U.uCanvas, width, height, scaleX, scaleY);
      gl.uniform1i(U.uImage, 0);
      const mediaList = [...document.querySelectorAll(selector)].filter(media => {
        if (media.closest('[hidden], [inert], [data-edge-glass="off"]')) return false;
        if (note && !note.contains(media)) return false;
        const row = media.closest('.home-project-row');
        return !row || row.classList.contains('is-open');
      }).sort((a, b) => Number(a.closest('.orbit-note')?.style.zIndex || 0) - Number(b.closest('.orbit-note')?.style.zIndex || 0));
      const replaced = new Set();
      let playing = false;
      for (const media of mediaList) {
        const visibleBox = media.getBoundingClientRect();
        if (visibleBox.bottom < -32 || visibleBox.top > height + 32 || visibleBox.right < -32 || visibleBox.left > width + 32) continue;
        const style = getComputedStyle(media);
        if (style.visibility === 'hidden' || style.display === 'none') continue;
        const fold = media.closest('.home-row-panel');
        if (fold && (Number(getComputedStyle(fold).opacity) < 0.9999 || fold.offsetHeight + 1 < fold.firstElementChild.offsetHeight)) continue;
        const geometry = bounds(media, style, width, height);
        if (!geometry) continue;
        const entry = textureFor(media, style);
        if (!entry) continue;
        let opacity = entry.opacity;
        for (let parent = media.parentElement; parent && parent !== host; parent = parent.parentElement) opacity *= Number(getComputedStyle(parent).opacity);
        if (opacity < 0.001) continue;
        const filter = style.filter;
        const blur = Number(filter.match(/blur\(([\d.]+)px\)/)?.[1] || 0);
        const saturation = Number(filter.match(/saturate\(([\d.]+)\)/)?.[1] || 1) * (1 - Number(filter.match(/grayscale\(([\d.]+)\)/)?.[1] || 0));
        const g = geometry;
        gl.uniform4f(U.uFrame, g.view.left, g.view.top, g.viewWidth, g.viewHeight);
        gl.uniform2fv(U.uBands, g.bands);
        gl.uniform2fv(U.uOrigin, g.origin); gl.uniform2fv(U.uAxisX, g.axisX); gl.uniform2fv(U.uAxisY, g.axisY);
        gl.uniform2f(U.uSize, g.width, g.height); gl.uniform4fv(U.uUv, g.uv);
        gl.uniform4f(U.uMaterial, blur, saturation, opacity, Math.min(parseFloat(style.borderTopLeftRadius) || 0, g.width / 2, g.height / 2));
        const owner = media.closest('.home-feature-image, .home-row-image, .film-image, .orbit-note');
        const control = owner?.querySelector('.home-view, .locked-mark > span');
        if (control && Number(getComputedStyle(control).opacity) > 0.01) {
          const h = control.getBoundingClientRect();
          gl.uniform4f(U.uControl, h.left, h.top, h.width, h.height);
        } else gl.uniform4f(U.uControl, 0, 0, 0, 0);
        gl.uniform4fv(U.uOptics, g.optics);
        const r = g.scissor;
        const x0 = Math.max(0, Math.floor(r.left * scaleX)), y0 = Math.max(0, Math.floor((height - r.bottom) * scaleY));
        gl.scissor(x0, y0, Math.ceil(r.right * scaleX) - x0, Math.ceil((height - r.top) * scaleY) - y0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        replaced.add(media);
        if (media instanceof HTMLVideoElement && !media.paused && !media.ended) playing = true;
      }
      // Never leave both the original and its refracted copy visible together.
      document.querySelectorAll('.edge-glass-source').forEach(media => {
        if (!replaced.has(media)) media.classList.remove('edge-glass-source');
      });
      if (playing || performance.now() < animateUntil) refresh();
    } catch (error) {
      stopped = true; showOriginals(); surface.hidden = true;
      console.warn('Edge glass fell back to the original media:', error);
    }
  }
  const resize = new ResizeObserver(() => refresh(200));
  document.querySelectorAll(roots).forEach(root => resize.observe(root));
  new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' || record.addedNodes.length || record.removedNodes.length)) refresh(1000);
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'inert'] });
  document.addEventListener('scroll', () => { renderNow(); refresh(60); }, { capture: true, passive: true });
  window.addEventListener('resize', () => refresh(500), { passive: true });
  window.addEventListener('hashchange', () => refresh(1000));
  document.addEventListener('click', () => refresh(1100), true);
  document.addEventListener('pointerover', () => refresh(180), { passive: true });
  document.addEventListener('pointerout', () => refresh(180), { passive: true });
  document.addEventListener('pointerup', () => refresh(450), { passive: true });
  for (const event of ['load', 'loadeddata', 'play', 'pause', 'seeked', 'transitionend']) document.addEventListener(event, () => refresh(500), true);
  document.addEventListener('visibilitychange', () => refresh(500));
  reduced.addEventListener('change', () => refresh(500));
  refresh(1500);
})();
