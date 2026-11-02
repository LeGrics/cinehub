(function(){
  'use strict';
  if(window.__movyTvInstalled)return;window.__movyTvInstalled=true;
  var panel,dock,toastTimer,scroller,dockTimer,lastContentFocus,keyboardDock=false;
  function hideDock(){
    if(!dock||!panel.hidden)return;
    if(keyboardDock&&dock.contains(document.activeElement))return;
    if(dock.contains(document.activeElement)&&lastContentFocus&&lastContentFocus.isConnected)lastContentFocus.focus({preventScroll:true});
    dock.hidden=true;
  }
  function showDock(fromKeyboard){
    if(!dock||document.fullscreenElement)return;
    keyboardDock=!!fromKeyboard;dock.hidden=false;clearTimeout(dockTimer);
    dockTimer=setTimeout(hideDock,3500);
  }
  function installScroller(){
    // App Router replaces streamed main elements. Keep its DOM ownership intact.
    if(cineHubPlatform.scrollMode==='document'){
      document.documentElement.setAttribute('data-cinehub-document','');
      scroller=document.scrollingElement||document.documentElement;return true;
    }
    var next=null;cineHubPlatform.roots.some(function(selector){next=document.querySelector(selector);return !!next;});
    if(!next)return false;
    scroller=document.getElementById('movy-tv-scroll');
    if(!scroller){scroller=document.createElement('div');scroller.id='movy-tv-scroll';scroller.setAttribute('aria-label','Catalogue '+cineHubPlatform.name);next.setAttribute('data-cinehub-root','');next.parentNode.insertBefore(scroller,next);scroller.appendChild(next);}
    return true;
  }
  function toast(message){
    var el=document.getElementById('movy-tv-toast');
    if(!el){el=document.createElement('div');el.id='movy-tv-toast';el.setAttribute('role','status');document.body.appendChild(el);}
    el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.hidden=true;},4000);
  }
  // Best effort in the top document; scripts can overwrite this and external frames are isolated.
  window.open=function(){if(document.body)toast('Nouvelle fenêtre bloquée');return null;};
  function visible(el){var r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';}
  function items(scope){return [].slice.call(scope.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')).filter(function(el){return !el.disabled&&el.tabIndex>=0&&visible(el);});}
  function toggle(){panel.hidden=!panel.hidden;if(!panel.hidden){showDock(false);panel.querySelector('button').focus();}else{var first=lastContentFocus&&lastContentFocus.isConnected?lastContentFocus:items(document).find(function(el){return !panel.contains(el)&&!dock.contains(el);});if(first)first.focus({preventScroll:true});showDock(false);}}
  function media(){return [].slice.call(document.querySelectorAll('video')).find(visible);}
  function scrollPage(target,dx,dy){
    var root=scroller&&scroller.isConnected?scroller:document.scrollingElement||document.documentElement,el=target&&target.nodeType===1?target:null;
    while(el&&el!==root){
      var style=getComputedStyle(el),oldX=el.scrollLeft,oldY=el.scrollTop;
      if(dx&&/auto|scroll/.test(style.overflowX))el.scrollLeft+=dx;
      if(dy&&/auto|scroll/.test(style.overflowY))el.scrollTop+=dy;
      if(el.scrollTop!==oldY||el.scrollLeft!==oldX)return true;
      el=el.parentElement;
    }
    var beforeX=root.scrollLeft,beforeY=root.scrollTop;
    root.scrollLeft+=dx;root.scrollTop+=dy;
    return root.scrollLeft!==beforeX||root.scrollTop!==beforeY;
  }
  // Run before the site's document handlers, including handlers that cancel native wheel scrolling.
  window.addEventListener('wheel',function(e){
    if(panel&&!panel.hidden)return;
    if(e.ctrlKey)return;
    var unit=e.deltaMode===1?40:e.deltaMode===2?window.innerHeight*.75:1;
    if(scrollPage(e.target,e.deltaX*unit,e.deltaY*unit)){e.preventDefault();e.stopImmediatePropagation();}
  },{capture:true,passive:false});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    var url;try{url=new URL(a.href,location.href);}catch(_){return;}
    if(url.origin===location.origin){if(a.target==='_blank')a.target='_self';return;}
    if(cineHubPlatform.hosts.indexOf(url.hostname)>=0){e.preventDefault();location.assign(url.href);return;}
    e.preventDefault();e.stopImmediatePropagation();toast('Lien externe bloqué dans ce mode');
  },true);
  window.addEventListener('keydown',function(e){
    if(!panel)return;
    var code=e.keyCode,key=({37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown'})[code]||e.key,editing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if(code===403||(!editing&&key==='F2')){e.preventDefault();e.stopImmediatePropagation();toggle();return;}
    if(!panel.hidden&&(code===461||key==='Escape')){e.preventDefault();e.stopImmediatePropagation();toggle();return;}
    // Let webOS manage Back history. Do not force close the TV application.
    if(code===461||key==='Escape')return;
    if(editing)return;
    if(dock.contains(document.activeElement)&&/^Arrow/.test(key)){keyboardDock=true;clearTimeout(dockTimer);}
    if(panel.hidden&&(code===404||code===405||key==='PageDown'||key==='PageUp')){
      e.preventDefault();e.stopImmediatePropagation();scrollPage(document.activeElement,0,(code===405||key==='PageUp'?-1:1)*window.innerHeight*.7);return;
    }
    if(/^Arrow/.test(key)){
      var active=document.activeElement;
      if(active&&active.closest&&active.closest('[role="slider"],video,[data-tv-native]'))return;
      var choices=items(panel.hidden?document:panel),next=MovyNav.closest(choices,active,key);
      if(next){e.preventDefault();e.stopImmediatePropagation();next.focus();next.scrollIntoView({block:'nearest',inline:'nearest'});}
      else if(panel.hidden){e.preventDefault();e.stopImmediatePropagation();if(key==='ArrowRight'&&!dock.contains(active)){showDock(true);dock.querySelector('button').focus();}else scrollPage(active,key==='ArrowLeft'?-320:key==='ArrowRight'?320:0,key==='ArrowUp'?-400:key==='ArrowDown'?400:0);}
    }
    if(code===415||code===19||code===179){var video=media();if(video){e.preventDefault();e.stopImmediatePropagation();if(code===415||code===179&&video.paused)video.play().catch(function(){toast('Lecture refusée par le lecteur');});else video.pause();}}
  },true);
  function init(){
    if(!installScroller()){
      var observer=new MutationObserver(function(){if(installScroller())observer.disconnect();});
      observer.observe(document.body,{childList:true,subtree:true});
    }
    panel=document.createElement('div');panel.id='movy-tv-panel';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Commandes CinéHub');
    function menu(){panel.innerHTML='<strong>CinéHub · '+cineHubPlatform.name+'</strong><div><button data-action="close">Continuer</button><button data-action="platforms">Plateformes</button><button data-action="down">Descendre ↓</button><button data-action="up">Remonter ↑</button><button data-action="home">Accueil</button><button data-action="reload">Recharger</button></div><p>Molette : défiler · Flèches + OK : navigation · Pointeur au bord droit : Menu TV · Retour : historique webOS.</p>';}
    menu();
    document.body.appendChild(panel);
    panel.addEventListener('click',function(e){
      var button=e.target.closest('button');if(!button)return;var action=button.getAttribute('data-action');
      if(action==='close'){menu();toggle();}
      if(action==='up'||action==='down'){toggle();scrollPage(document.body,0,(action==='up'?-1:1)*window.innerHeight*.7);}
      if(action==='home')location.assign(cineHubPlatform.home);
      if(action==='reload')location.reload();
      if(action==='menu'){menu();panel.querySelector('button').focus();}
      if(action==='platforms'){
        panel.innerHTML='<strong>CinéHub · Choisir une plateforme</strong><div></div><button data-action="menu">Retour au menu</button>';
        var list=panel.querySelector('div');window.CineHubPlatforms.forEach(function(platform){var item=document.createElement('button');item.textContent=platform.name;item.setAttribute('data-platform',platform.id);list.appendChild(item);});panel.querySelector('button').focus();
      }
      var selected=button.getAttribute('data-platform');if(selected){var destination=window.CineHubPlatforms.find(function(platform){return platform.id===selected;});if(destination)location.assign(destination.home);}
    });
    dock=document.createElement('nav');dock.id='movy-tv-dock';dock.hidden=true;dock.setAttribute('aria-label','Commandes TV');
    dock.innerHTML='<button data-action="menu" aria-label="Ouvrir le menu TV">Menu TV</button><button data-action="up" aria-label="Remonter d’une page">↑</button><button data-action="down" aria-label="Descendre d’une page">↓</button>';
    document.body.appendChild(dock);
    window.addEventListener('mousemove',function(e){
      if(e.clientX>=window.innerWidth-90)showDock(false);
    },{passive:true});
    document.addEventListener('focusin',function(e){
      if(!dock.contains(e.target)&&!panel.contains(e.target)){lastContentFocus=e.target;keyboardDock=false;if(!dock.hidden){clearTimeout(dockTimer);dockTimer=setTimeout(hideDock,3500);}}
    });
    dock.addEventListener('click',function(e){
      showDock(false);
      var button=e.target.closest('button');if(!button)return;
      var action=button.getAttribute('data-action');
      if(action==='menu')toggle();
      else if(action==='up'||action==='down'){if(!panel.hidden)toggle();scrollPage(document.body,0,(action==='up'?-1:1)*window.innerHeight*.7);}
    });
    document.addEventListener('fullscreenchange',function(){clearTimeout(dockTimer);dock.hidden=true;if(document.fullscreenElement)panel.hidden=true;});
    toast('CinéHub · '+cineHubPlatform.name+' · menu au bord droit');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
