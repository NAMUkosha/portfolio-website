(() => {
  const value = name => getComputedStyle(document.documentElement).getPropertyValue(`--ds-${name}`).trim();
  window.WenjiaMotion = Object.freeze({
    duration: role => {const raw=value(`dur-${role}`);const n=parseFloat(raw);return Number.isFinite(n)?n*(raw.endsWith('ms')?1:1000):0;},
    easing: () => value('ease-out')
  });
  function clean(node){
    if(node.nodeType===Node.TEXT_NODE){if(/[↗↖↘↙➚➘]/.test(node.data))node.data=node.data.replace(/\s*[↗↖↘↙➚➘]/g,'');return;}
    if(node.nodeType!==Node.ELEMENT_NODE||node.matches('script,style,svg'))return;
    [...node.childNodes].forEach(clean);
  }
  addEventListener('DOMContentLoaded',()=>{
    clean(document.body);
    new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(clean))).observe(document.body,{childList:true,subtree:true});
  },{once:true});
})();
