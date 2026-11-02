(function(){
  'use strict';
  var buttons=[].slice.call(document.querySelectorAll('[data-platform]')),status=document.getElementById('status');
  buttons.forEach(function(button){button.onclick=function(){
    var platform=window.CineHubPlatforms.find(function(item){return item.id===button.getAttribute('data-platform');});
    if(!platform)return;
    status.textContent='Ouverture de '+platform.name+'…';
    try{localStorage.setItem('cinehub.lastPlatform',platform.id);}catch(_){}
    try{window.location.assign(platform.home);}catch(_){status.textContent='Ouverture impossible. Essaie une autre plateforme.';button.focus();}
  };});
  document.addEventListener('keydown',function(e){
    var key=({37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown'})[e.keyCode]||e.key;
    if(!/^Arrow/.test(key))return;
    var next=window.MovyNav.closest(buttons,document.activeElement,key);
    if(next){e.preventDefault();next.focus();}
  });
  var last;try{last=localStorage.getItem('cinehub.lastPlatform');}catch(_){}
  var initial=buttons.find(function(button){return button.getAttribute('data-platform')===last;})||buttons[0];
  if(initial)initial.focus();
})();
