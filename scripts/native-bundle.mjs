import {readFile,mkdir,writeFile} from 'node:fs/promises';
export async function makeNativeBundle(){
  const root=new URL('../',import.meta.url);
  const [nav,controller,css]=await Promise.all(['app/navigation.js','native/controller.js','native/tv.css'].map(p=>readFile(new URL(p,root),'utf8')));
  const prefix=`(function(){\n'use strict';\nif(location.protocol!=='https:'||!['www.movy.sx','movy.sx'].includes(location.hostname)||window.top!==window)return;\ntry{if(sessionStorage.getItem('ads-enabled-session')===null)sessionStorage.setItem('ads-enabled-session','false');}catch(_){}\nfunction style(){if(document.getElementById('movy-tv-native-style'))return;var s=document.createElement('style');s.id='movy-tv-native-style';s.textContent=${JSON.stringify(css)};(document.head||document.documentElement).appendChild(s);}\nstyle();\n`;
  const bundle=prefix+nav+'\n'+controller+'\n})();\n';
  const dir=new URL('app/webOSUserScripts/',root);await mkdir(dir,{recursive:true});await writeFile(new URL('userScript.js',dir),bundle);
  return bundle;
}
