// Only the two ad loaders observed on 7movies; never player/API/Cloudflare URLs.
(function(){
  var pref=cineHubPlatform.ads;
  if(!pref||!pref.scripts||sessionStorage.getItem(pref.key)!==pref.value)return;
  function blocked(node){
    if(!node||node.tagName!=='SCRIPT'||!node.src)return false;
    var url;try{url=new URL(node.src,location.href);}catch(_){return false;}
    return pref.scripts.some(function(rule){
      return rule.charAt(0)==='/'?url.origin===location.origin&&url.pathname===rule:url.href.indexOf(rule)===0;
    });
  }
  ['appendChild','insertBefore','replaceChild'].forEach(function(name){
    var original=Node.prototype[name];
    Node.prototype[name]=function(node){if(blocked(node))return name==='replaceChild'?arguments[1]:node;return original.apply(this,arguments);};
  });
})();
