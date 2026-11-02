import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../app/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{
  try{const pathname=new URL(req.url,'http://localhost').pathname;const target=path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));
    if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const data=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(data);
  }catch(_){res.writeHead(404);res.end('Not found');}
}).listen(8790,'127.0.0.1',()=>console.log('Prévisualisation : http://127.0.0.1:8790'));
