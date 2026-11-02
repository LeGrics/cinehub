import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {makeNativeBundle} from '../scripts/native-bundle.mjs';
const bundle=await makeNativeBundle();
function context({host='www.movy.sx',frame=false,setting=null,title=''}={}){
  const store=new Map(setting===null?[]:[['ads-enabled-session',setting]]),listeners={},styles=[];
  const local=new Map();
  const document={title,readyState:'complete',getElementById:()=>null,createElement:()=>({}),documentElement:{appendChild:s=>styles.push(s)},addEventListener:(type,fn)=>{listeners[type]=fn;}};
  // Keep controller initialization deferred; the storage/bootstrap contract is tested here.
  document.readyState='loading';
  const window={addEventListener(){}};window.top=frame?{}:window;
  const reloads=[];
  class Node {appendChild(n){return n;}insertBefore(n){return n;}replaceChild(n){return n;}}
  const scope={Node,URL,window,document,location:{protocol:'https:',hostname:host,href:'https://'+host+'/',origin:'https://'+host,reload:()=>reloads.push(true)},sessionStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,v)},localStorage:{getItem:k=>local.has(k)?local.get(k):null,setItem:(k,v)=>local.set(k,v)}};
  return{scope,store,local,listeners,styles,reloads};
}
test('native script defaults the real Movy session to ads off and contains autonomous controls',()=>{
  const ctx=context();vm.runInNewContext(bundle,ctx.scope);assert.equal(ctx.store.get('ads-enabled-session'),'false');assert.equal(ctx.styles.length,1);assert.ok(ctx.listeners.DOMContentLoaded);assert.equal(ctx.scope.window.__movyTvInstalled,true);
});
test('native script preserves a deliberate ad preference for the current session',()=>{
  const ctx=context({setting:'true'});vm.runInNewContext(bundle,ctx.scope);assert.equal(ctx.store.get('ads-enabled-session'),'true');
});
test('native script leaves external sites and embedded players untouched',()=>{
  for(const options of [{host:'example.org'},{frame:true}]){const ctx=context(options);vm.runInNewContext(bundle,ctx.scope);assert.equal(ctx.store.size,0);assert.equal(ctx.styles.length,0);assert.equal(ctx.scope.window.__movyTvInstalled,undefined);}
});
test('native artifact uses the documented webOS userscript entry and has no PC origin',()=>{
  assert.ok(bundle.includes('movy-tv-scroll'));assert.ok(!/https?:\/\/(?:192\.168\.|10\.)/.test(bundle));assert.ok(!bundle.includes('/__tv/'));new vm.Script(bundle);
});
test('Cinejoy uses its own native local preference rather than the Movy key',()=>{
  const ctx=context({host:'cinejoy.pk'});vm.runInNewContext(bundle,ctx.scope);assert.equal(ctx.local.get('addies'),'false');assert.equal(ctx.store.has('ads-enabled-session'),false);assert.equal(ctx.styles.length,1);
});
test('7movies uses its verified native session ad-free preference',()=>{
  const ctx=context({host:'7movies.ac'});vm.runInNewContext(bundle,ctx.scope);assert.equal(ctx.store.get('cinrift_ad_free'),'true');assert.equal(ctx.store.has('ads-enabled-session'),false);
  assert.equal(ctx.reloads.length,1);assert.equal(ctx.styles.length,0);
  vm.runInNewContext(bundle,ctx.scope);assert.equal(ctx.reloads.length,1);assert.equal(ctx.styles.length,1);
});
