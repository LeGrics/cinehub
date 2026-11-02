(function(root){
  'use strict';
  function closest(items, active, key) {
    if (!items.length) return null;
    if (!active || items.indexOf(active) < 0) return items[0];
    var a=active.getBoundingClientRect(), ax=a.x+a.width/2, ay=a.y+a.height/2;
    var best=null, score=Infinity;
    items.forEach(function(el){
      if(el===active)return;
      var b=el.getBoundingClientRect(), dx=b.x+b.width/2-ax, dy=b.y+b.height/2-ay;
      var primary=key==='ArrowRight'?dx:key==='ArrowLeft'?-dx:key==='ArrowDown'?dy:-dy;
      var secondary=key==='ArrowRight'||key==='ArrowLeft'?Math.abs(dy):Math.abs(dx);
      if(primary>2){var s=primary+secondary*3;if(s<score){score=s;best=el;}}
    });
    return best;
  }
  root.MovyNav={closest:closest};
  if(typeof module!=='undefined')module.exports=root.MovyNav;
})(typeof window==='undefined'?globalThis:window);
