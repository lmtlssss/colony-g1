import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const cliPath=process.argv[2];
const output=process.argv[3]||path.join(here,"colony-benchmark-replay.json");
if(!cliPath) throw Error("Usage: node benchmark22.mjs <speedrunpapi@0.3.2/bin/speedrunpapi.mjs> [output.json]");
const packageJson=JSON.parse(fs.readFileSync(path.resolve(cliPath,"../../package.json"),"utf8"));
if(packageJson.name!=="speedrunpapi"||packageJson.version!=="0.3.2") throw Error("Version must be speedrunpapi@0.3.2");
const manifest=JSON.parse(fs.readFileSync(path.join(here,"manifest.json"),"utf8"));
if(manifest.rows.length!==22) throw Error("Expected exactly 22 replay circuits");
let source=fs.readFileSync(cliPath,"utf8").replace(/^#![^\n]*\n/,"");
const at=source.lastIndexOf("\nmain().catch(");
if(at<0) throw Error("Expected CLI entry point absent");
source=source.slice(0,at)+"\nexport {scanAny};\n";
const {scanAny}=await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));
function median(numbers){const s=[...numbers].sort((a,b)=>a-b);const mid=s.length/2;return s.length%2?s[Math.floor(mid)]:(s[mid-1]+s[mid])/2;}
function round(value,digits=9){return Number(value.toFixed(digits));}
const warmups=100,samples=750,rows=[],checks=[];
for(const record of manifest.rows){
  const filename=path.resolve(root,record.file);
  if(!filename.startsWith(root+path.sep))throw Error("Fixture outside corpus");
  const checksum="sha256:"+createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
  if(checksum!==record.sha256)throw Error("Source checksum mismatch: "+record.id);
  let first=scanAny(filename);
  if(first.verdict!==record.expected_verdict)throw Error("Verdict mismatch: "+record.id+" "+first.verdict);
  for(let i=0;i<warmups;i++)scanAny(filename);
  const samplesMs=[];
  for(let i=0;i<samples;i++){
    const current=scanAny(filename);
    if(current.verdict!==record.expected_verdict)throw Error("Unstable verdict: "+record.id);
    samplesMs.push(current.time_ms);
  }
  const time=median(samplesMs);
  if(!(time>0))throw Error("Unmeasurable timing: "+record.id);
  const ratio=record.picus_ms/time;
  rows.push({id:record.id,picus:record.picus_verdict,colony:record.expected_verdict,
    picus_ms:record.picus_ms,colony_ms:round(time,9),speedup:round(ratio,1),
    source_checksum:checksum});
  checks.push({id:record.id,verdict:record.expected_verdict,source_checksum:checksum,ok:true});
  console.log(record.id+" "+record.expected_verdict+" "+Math.round(ratio).toLocaleString("en-US")+"×");
}
const speedups=rows.map(r=>r.speedup);
const summary={n:rows.length,agree:checks.filter(x=>x.ok).length,picus_recorded_verdicts:21,picus_sha_timeout_ms:180000,min:round(Math.min(...speedups),1),
  median:round(median(speedups),1),max:round(Math.max(...speedups),1)};
const replay={source:"G1 controlled 22-circuit replay / pinned speedrunpapi 0.3.2",generated_at:new Date().toISOString(),
  reported_reference:{source:"Operator's independent 22-case publish bundle report, 2026-11-08",n:22,min:260880,median:10500000,max:1512668983},
  method:{colony:"core analyzer warmed "+warmups+" calls, median of "+samples+" measured calls; excludes file I/O and classification",
    picus:"historical Picus solver wall-time corpus; SHA Picus 180-second timeout represents a lower-bound ratio",
    node:process.version,platform:os.platform(),architecture:os.arch()},
  summary,rows};
fs.writeFileSync(output,JSON.stringify(replay,null,2)+"\n");
console.log(JSON.stringify({summary,output,checksums_match:checks.length,verdicts_match:checks.length},null,2));
