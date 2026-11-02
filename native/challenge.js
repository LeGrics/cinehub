// A way out of a blocked site, without changing or attempting its verification.
function cineHubChallengeNotice(){
  if(!document.body||document.getElementById('cinehub-challenge-notice'))return;
  var box=document.createElement('aside');box.id='cinehub-challenge-notice';
  box.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;z-index:2147483647;padding:18px;background:#10202b;color:white;font:20px Arial;border:2px solid #bdf692;border-radius:12px';
  var message=document.createElement('p');message.textContent='CinéHub · Vérification du site : accès non garanti sur TV. Choisir une autre plateforme :';box.appendChild(message);
  var links=[];
  window.CineHubPlatforms.filter(function(p){return p.id!==cineHubPlatform.id;}).forEach(function(p){
    var a=document.createElement('a');a.href=p.home;a.textContent=p.name;
    a.style.cssText='display:inline-block;color:white;padding:12px 24px;margin-right:14px;border:2px solid #bdf692;border-radius:8px';
    a.addEventListener('keydown',function(e){var at=links.indexOf(a),key=e.keyCode;if(key===37||key===39){e.preventDefault();links[(at+(key===37?links.length-1:1))%links.length].focus();}});
    box.appendChild(a);links.push(a);
  });
  document.body.appendChild(box);
}
