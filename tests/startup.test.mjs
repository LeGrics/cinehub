import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),platforms=require('../app/platforms.js');
const source=readFileSync(new URL('../app/app.js',import.meta.url),'utf8');
function setup({last=null,fail=false}={}){
  const calls=[],status={},store=new Map(last?[['cinehub.lastPlatform',last]]:[]),listeners={};
  const document={getElementById:()=>status,addEventListener:(type,fn)=>{listeners[type]=fn;}};
  const buttons=platforms.map(platform=>({id:platform.id,getAttribute:()=>platform.id,focus(){document.activeElement=this;}}));
  document.querySelectorAll=()=>buttons;
  const window={CineHubPlatforms:platforms,location:{assign:url=>{if(fail)throw new Error('blocked');calls.push(url);}}};
  vm.runInNewContext(source,{window,document,localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)}});
  return{calls,buttons,document,status,store,listeners};
}
test('opening the app shows four choices without opening a platform automatically',()=>{
  const ctx=setup();assert.equal(ctx.buttons.length,4);assert.deepEqual(ctx.calls,[]);assert.equal(ctx.document.activeElement.id,'movy');
});
test('every platform tile opens its exact HTTPS homepage directly',()=>{
  const ctx=setup();ctx.buttons.forEach(button=>button.onclick());assert.deepEqual(ctx.calls,platforms.map(p=>p.home));
});
test('last platform restores focus without forcing navigation',()=>{
  const ctx=setup({last:'cinejoy'});assert.equal(ctx.document.activeElement.id,'cinejoy');assert.deepEqual(ctx.calls,[]);
});
test('a rejected navigation keeps the selected tile usable',()=>{
  const ctx=setup({fail:true});ctx.buttons[2].onclick();assert.match(ctx.status.textContent,/autre plateforme/);assert.equal(ctx.document.activeElement.id,'7movies');
});
