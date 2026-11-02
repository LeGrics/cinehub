import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {makeNativeBundle} from '../scripts/native-bundle.mjs';
const bundle=await makeNativeBundle();
function context({host='www.movy.sx',frame=false,setting=null}={}){
  const store=new Map(setting===null?[]:[['ads-enabled-session',setting]]),listeners={},styles=[];
  const document={readyState:'loading',getElementById:()=>null,createElement:()=>({}),documentElement:{appendChild:s=>styles.push(s)},addEventListener:(type,fn)=>{listeners[type]=fn;}};
  const window={addEventListener(){}};window.top=frame?{}:window;
  const scope={window,document,location:{protocol:'https:',hostname:host},sessionStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,v)}};
  return{scope,store,listeners,styles};
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
