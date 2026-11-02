import {readFile,mkdir,writeFile} from 'node:fs/promises';
export async function makeNativeBundle(){
  const root=new URL('../',import.meta.url);
  const [nav,controller,css,platforms]=await Promise.all(['app/navigation.js','native/controller.js','native/tv.css','app/platforms.js'].map(p=>readFile(new URL(p,root),'utf8')));
  const prefix=`(function(){\n'use strict';\nif(location.protocol!=='https:'||window.top!==window)return;\n${platforms}\nvar cineHubPlatform=window.CineHubPlatforms.find(function(p){return p.hosts.indexOf(location.hostname)>=0;});\nif(!cineHubPlatform)return;\nfunction start(){\nif(/just a moment|un instant|attention required/i.test(document.title||'')||document.getElementById('challenge-error-text'))return;\ntry{var pref=cineHubPlatform.ads;if(pref){var storage=pref.storage==='local'?localStorage:sessionStorage;if(storage.getItem(pref.key)===null)storage.setItem(pref.key,pref.value);}}catch(_){}\nfunction style(){if(document.getElementById('movy-tv-native-style'))return;var s=document.createElement('style');s.id='movy-tv-native-style';s.textContent=${JSON.stringify(css)};(document.head||document.documentElement).appendChild(s);}\nstyle();\n`;
  const bundle=prefix+nav+'\n'+controller+'\n}\nif(cineHubPlatform.defer&&document.readyState===\'loading\')document.addEventListener(\'DOMContentLoaded\',start);else start();\n})();\n';
  const dir=new URL('app/webOSUserScripts/',root);await mkdir(dir,{recursive:true});await writeFile(new URL('userScript.js',dir),bundle);
  return bundle;
}
