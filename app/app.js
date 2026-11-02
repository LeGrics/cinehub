(function(){
  'use strict';
  var launch=document.getElementById('direct'),status=document.getElementById('status');
  function openMovy(){
    status.textContent='Ouverture de Movy…';
    try{window.location.replace('https://www.movy.sx/fr');}
    catch(_){status.textContent='Ouverture impossible. Réessaie dans un instant.';launch.hidden=false;launch.focus();}
  }
  launch.onclick=openMovy;
  window.setTimeout(function(){launch.hidden=false;},4000);
  openMovy();
})();
