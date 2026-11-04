/* BFP shared volunteer reporting. Fictional browser-local records only. */
(function(root){
'use strict';
const KEY='bfp-standalone-volunteers-v2', SOURCE_KEY='bfp-suite-volunteer-sources-v1',TZ='America/Denver';
const read=(storage,key,fallback)=>{try{const x=JSON.parse(storage.getItem(key));return x??fallback}catch{return fallback}};
const date=t=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t));
const next=d=>{const t=new Date(d+'T12:00:00Z');t.setUTCDate(t.getUTCDate()+1);return t.toISOString().slice(0,10)};
function midnight(d){const [y,m,day]=d.split('-').map(Number),target=Date.UTC(y,m-1,day);let guess=target+7*3600000;const f=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});for(let i=0;i<3;i++){const p=Object.fromEntries(f.formatToParts(new Date(guess)).map(x=>[x.type,x.value]));guess+=target-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)}return guess}
function summary(storage,from,to,location='all'){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to)||from>to)return {valid:false,hours:null,months:[],people:null};
 if(location==='north')return {valid:false,hours:null,months:[],people:null,reason:'No Northern Davis volunteer records'};
 const db=read(storage,KEY,null),sessions=Array.isArray(db?.sessions)?db.sessions:[],prefs=read(storage,SOURCE_KEY,{}),manual=read(storage,'bfp-demo-engagement-v1',[]);
 const a=midnight(from),b=midnight(next(to)),seen=new Set(),unique=new Set(),rows=[];
 for(let cursor=from.slice(0,7)+'-01';cursor.slice(0,7)<=to.slice(0,7);){const month=cursor.slice(0,7),last=new Date(Date.UTC(+cursor.slice(0,4),+cursor.slice(5,7),0)).toISOString().slice(0,10),ma=midnight(cursor),mb=midnight(next(last));const mrows=Array.isArray(manual)?manual.filter(x=>x.month===month&&x.measure==='volunteer_hours'&&Number.isFinite(Number(x.value))&&Number(x.value)>=0):[];
 const complete=sessions.filter(s=>{const si=Number(s.adjustment?.in??s.in),so=Number(s.adjustment?.out??s.out);return s.out!=null&&Number.isFinite(si)&&Number.isFinite(so)&&so>si&&si<mb&&so>ma});
 const source=prefs[month]||((complete.length||!mrows.length)?'tracked':'manual');let hours=null,people=null;
 if(source==='manual'){if(a<=ma&&b>=mb&&mrows.length===1)hours=Number(mrows[0].value)}
 else if(db&&Array.isArray(db.sessions)){hours=0;const peopleSet=new Set();for(const s of complete){const si=Number(s.adjustment?.in??s.in),so=Number(s.adjustment?.out??s.out),start=Math.max(si,a,ma),end=Math.min(so,b,mb),id=s.id;if(typeof id!=='string'||seen.has(id+'|'+month)||end<=start)continue;seen.add(id+'|'+month);hours+=(end-start)/3600000;peopleSet.add(s.person);unique.add(s.person)}people=peopleSet.size}
 rows.push({month,source,hours,people,manualPresent:mrows.length>0,trackedPresent:complete.length>0,needsReview:hours===null});
 const d=new Date(cursor+'T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+1);cursor=d.toISOString().slice(0,10);
 }
 return {valid:rows.every(x=>x.hours!==null),hours:rows.every(x=>x.hours!==null)?rows.reduce((n,x)=>n+x.hours,0):null,people:rows.every(x=>x.source==='tracked'&&x.hours!==null)?unique.size:null,months:rows,from,to};
}
function clipSeconds(s,from,to){const a=Number(s.adjustment?.in??s.in),b=Number(s.adjustment?.out??s.out);if(s.out==null||!Number.isFinite(a)||!Number.isFinite(b)||b<=a||from>to)return 0;return Math.max(0,Math.min(b,midnight(next(to)))-Math.max(a,midnight(from)))/1000}
root.BFPVolunteerReporting={summary,midnight,date,next,clipSeconds,KEY,SOURCE_KEY};
})(typeof window!=='undefined'?window:globalThis);
