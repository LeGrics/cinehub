import {deflateSync} from 'node:zlib';
import {writeFile} from 'node:fs/promises';
function crc32(data){let c=0xffffffff;for(const b of data){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function chunk(name,data){const body=Buffer.concat([Buffer.from(name),data]),len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(body));return Buffer.concat([len,body,crc]);}
export function png(size){
  const rows=Buffer.alloc((1+size*4)*size);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const nx=x/size,ny=y/size,i=y*(1+size*4)+1+x*4;
    const play=nx>.35&&nx<.74&&Math.abs(ny-.5)<(.74-nx)*.7;
    rows.set(play?[189,246,146,255]:[17,30,40,255],i);
  }
  const header=Buffer.alloc(13);header.writeUInt32BE(size);header.writeUInt32BE(size,4);header[8]=8;header[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);
}
export async function makeIcons(){await writeFile(new URL('../app/icon.png',import.meta.url),png(80));await writeFile(new URL('../app/largeIcon.png',import.meta.url),png(130));}
