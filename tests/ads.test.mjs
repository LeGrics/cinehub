import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const platforms=createRequire(import.meta.url)('../app/platforms.js');
const source=readFileSync(new URL('../native/ads.js',import.meta.url),'utf8');
function setup(off=true){
  const calls=[];class Node{appendChild(node){calls.push(node);return node;}insertBefore(node){calls.push(node);return node;}replaceChild(node){calls.push(node);return node;}}
  vm.runInNewContext(source,{Node,URL,cineHubPlatform:platforms.find(p=>p.id==='7movies'),sessionStorage:{getItem:()=>String(off)},location:{href:'https://7movies.ac/',origin:'https://7movies.ac'}});
  return{head:new Node(),calls};
}
test('7movies blocks identified ad loaders through every observed insertion path',()=>{
  const {head,calls}=setup();for(const method of ['appendChild','insertBefore','replaceChild'])for(const src of ['https://7movies.ac/r7.js?v=1','https://oa.ingangupbelt.com/sfkgkph8PPY9W/159025'])head[method]({tagName:'SCRIPT',src},{});
  assert.equal(calls.length,0);
});
test('player, framework, API and Cloudflare requests are unaffected',()=>{
  const {head,calls}=setup();for(const src of ['https://7movies.ac/_next/chunk.js','https://7movies.ac/api/player','https://challenges.cloudflare.com/turnstile/v0/api.js','https://player.example/r7.js','https://oa.ingangupbelt.com.example/script.js'])head.appendChild({tagName:'SCRIPT',src});
  head.appendChild({tagName:'IFRAME',src:'https://player.example/'});assert.equal(calls.length,6);
});
test('an explicit ads-on preference retains the native insertion behavior',()=>{
  const {head,calls}=setup(false);head.appendChild({tagName:'SCRIPT',src:'https://7movies.ac/r7.js'});assert.equal(calls.length,1);
});
