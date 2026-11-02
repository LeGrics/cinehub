import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app/app.js',import.meta.url),'utf8');
test('launch opens Movy without a click and replaces the transition history entry',()=>{
  const calls=[],button={hidden:true},status={};
  vm.runInNewContext(source,{document:{getElementById:id=>id==='direct'?button:status},window:{setTimeout(){},location:{replace:url=>calls.push(url)}}});
  assert.deepEqual(calls,['https://www.movy.sx/fr']);assert.equal(button.hidden,true);
});
test('a rejected navigation keeps a usable retry button',()=>{
  let attempts=0,focused=false;const button={hidden:true,focus(){focused=true;}},status={};
  vm.runInNewContext(source,{document:{getElementById:id=>id==='direct'?button:status},window:{setTimeout(){},location:{replace(){attempts++;throw new Error('blocked');}}}});
  assert.equal(button.hidden,false);assert.equal(focused,true);button.onclick();assert.equal(attempts,2);
});
