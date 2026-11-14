// A closed rounded arrow solid. Surface intersections, normals and refraction are
// evaluated in 3D; no image, height map or texture is used to form the object.
window.createGlassVolume = host => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha:true, antialias:true, premultipliedAlpha:false });
  if (!gl) return null;
  function compile(type, source) {
    const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;
  }
  try {
    const program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,`attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,`
      precision highp float;
      uniform vec2 resolution,angle;
      float solid(vec3 p){
        vec2 v[7];v[0]=vec2(-.075,.82);v[1]=vec2(.075,.82);v[2]=vec2(.075,-.38);
        v[3]=vec2(.25,-.38);v[4]=vec2(0.,-.82);v[5]=vec2(-.25,-.38);v[6]=vec2(-.075,-.38);
        float d=10.;bool inside=false;
        for(int i=0;i<7;i++){
          vec2 a=v[i],b=v[0];if(i<6)b=v[i+1];
          vec2 e=b-a,q=p.xy-a;vec2 near=q-e*clamp(dot(q,e)/dot(e,e),0.,1.);
          d=min(d,dot(near,near));
          if((a.y>p.y)!=(b.y>p.y)){if(p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}
        }
        float shape=sqrt(d)*(inside?-1.:1.);
        vec2 w=vec2(shape+.06,abs(p.z)-.05);
        return min(max(w.x,w.y),0.)+length(max(w,0.))-.06;
      }
      vec3 normalAt(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(solid(p+e.xyy)-solid(p-e.xyy),solid(p+e.yxy)-solid(p-e.yxy),solid(p+e.yyx)-solid(p-e.yyx)));}
      vec3 studio(vec3 d){
        vec3 color=vec3(.94,.955,.965);
        float dark=pow(max(dot(d,normalize(vec3(-1.,.25,.2))),0.),12.);
        float side=pow(max(dot(d,normalize(vec3(.9,-.2,-.25))),0.),22.);
        color-=vec3(.62)*dark+vec3(.38)*side;
        float backPanel=exp(-pow((d.y+.12)/.16,2.))*smoothstep(.25,.85,-d.z);
        color-=vec3(.3)*backPanel;
        color+=vec3(.24)*pow(max(dot(d,normalize(vec3(.25,.9,1.))),0.),38.);
        return clamp(color,0.,1.);
      }
      void main(){
        float a=angle.x,b=angle.y;
        mat3 ry=mat3(cos(a),0.,-sin(a),0.,1.,0.,sin(a),0.,cos(a));
        mat3 rx=mat3(1.,0.,0.,0.,cos(b),sin(b),0.,-sin(b),cos(b));
        mat3 rotation=rx*ry;
        mat3 inverse=mat3(rotation[0][0],rotation[1][0],rotation[2][0],rotation[0][1],rotation[1][1],rotation[2][1],rotation[0][2],rotation[1][2],rotation[2][2]);
        vec2 uv=gl_FragCoord.xy/resolution*2.-1.;uv.x*=resolution.x/resolution.y;
        vec3 ro=inverse*vec3(0.,0.,3.5),rd=inverse*normalize(vec3(uv*1.05,-3.5));
        float travel=2.3,d=1.;vec3 p=ro;
        for(int i=0;i<72;i++){p=ro+rd*travel;d=solid(p);if(d<.0008||travel>4.8)break;travel+=max(d,.0005);}
        if(d>.002||travel>4.8){gl_FragColor=vec4(0.);return;}
        vec3 n=normalAt(p),internal=refract(rd,n,1./1.46);
        vec3 exitPoint=p+internal*.006;float thickness=.006;
        for(int i=0;i<48;i++){float stepSize=max(abs(solid(exitPoint)),.001);exitPoint+=internal*stepSize;thickness+=stepSize;if(solid(exitPoint)>.0003)break;}
        vec3 exitNormal=normalAt(exitPoint),outgoing=refract(internal,-exitNormal,1.46);
        if(length(outgoing)<.1)outgoing=reflect(internal,-exitNormal);
        float facing=clamp(dot(-rd,n),0.,1.),fresnel=.045+.955*pow(1.-facing,5.);
        vec3 transmitted=studio(rotation*outgoing)*exp(-thickness*vec3(.12,.075,.045));
        vec3 reflected=studio(rotation*reflect(rd,n));
        vec3 color=mix(transmitted,reflected,.12+fresnel*.88);
        vec3 worldNormal=rotation*n;
        float highlight=pow(max(dot(reflect(-normalize(vec3(-.4,.8,1.)),worldNormal),vec3(0.,0.,1.)),0.),90.);
        color+=highlight*.4;
        color=mix(vec3(1.),color,.8);
        gl_FragColor=vec4(clamp(color,0.,1.),1.);
      }`));
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
    canvas.width=180;canvas.height=360;gl.viewport(0,0,180,360);
    gl.uniform2f(gl.getUniformLocation(program,'resolution'),180,360);
    const angle=gl.getUniformLocation(program,'angle');
    canvas.setAttribute('aria-hidden','true');host.append(canvas);host.classList.add('has-volume');
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();host.classList.remove('has-volume');});
    return (x,y)=>{
      if(gl.isContextLost())return;
      gl.uniform2f(angle,-.4+x*.5,.16-y*.28);
      gl.drawArrays(gl.TRIANGLES,0,6);
    };
  } catch(error) { host.dataset.renderer='fallback';return null; }
};
