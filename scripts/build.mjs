import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {mkdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {makeIcons} from './icons.mjs';
import {makeNativeBundle} from './native-bundle.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(import.meta.url);
let cli;
try{cli=process.env.MOVY_CLI_ROOT?path.join(process.env.MOVY_CLI_ROOT,'bin','ares-package.js'):require.resolve('@webos-tools/cli/bin/ares-package.js');}
catch(_){console.error('Installe les outils LG avec npm install, puis relance npm run build.');process.exit(1);}
await makeIcons();
await makeNativeBundle();
await mkdir(path.join(root,'dist'),{recursive:true});
const metadata=JSON.parse(await readFile(path.join(root,'app','appinfo.json'),'utf8'));
const result=spawnSync(process.execPath,[cli,path.join(root,'app'),'--no-minify','--outdir',path.join(root,'dist')],{cwd:root,stdio:'inherit',env:process.env});
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
console.log('Package : '+path.join(root,'dist',metadata.id+'_'+metadata.version+'_all.ipk'));
