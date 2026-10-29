/* BFP task-first workspace. Independently authored; synthetic demonstration only. */
(() => {
'use strict';
const labels={home:'Home',driver:'Record an off-site visit',mobile:'Saved off-site visits',market:'Market monthly totals',clients:'Client reporting',packs:'Annual school totals',food:'Receive & send food',rescue:'Grocery Rescue',inventory:'Inventory & month end',imports:'Import totals',engagement:'Community engagement',financials:'Monthly financials',grants:'Grants & follow-ups',overview:'Activity overview',geography:'Geographic reach',reports:'Reports & exports',history:'Trends & comparisons',board:'Board report',team:'Team access'};
const descriptions={driver:'Bus, truck or Mini Market: enter a visit where it happens.',mobile:'Find, view, correct or export saved service visits.',market:'Review monthly totals imported from PantrySoft.',clients:'Read imported client-service summaries.',packs:'Enter the four annual school-program figures.',food:'Record incoming food, partner transfers and donor thanks.',rescue:'Review food recorded as Grocery Rescue.',inventory:'Count stock, review movements and finish the month.',imports:'Bring reviewed reporting totals into the workspace.',engagement:'Enter monthly community and communication measures.',financials:'Enter a monthly financial summary.',grants:'Track applications, awards, deadlines and next steps.',overview:'Review the separate demonstration activity ledger.',geography:'Review example community reach.',reports:'Find reports and download their source data.',history:'Compare recorded months and review missing sources.',board:'Review the monthly sources, add notes and prepare a packet.',team:'Preview team members and their assigned workspaces.'};
const groups=[['Services',['driver','mobile','market','clients','packs']],['Food & inventory',['food','rescue','inventory']],['Reports',['board','history','geography','overview','reports']],['Office',['engagement','financials','grants','imports','team']]];
const keywords={driver:'driver app mobile bus truck mini market service family initials',mobile:'saved records search edit correct export clients',food:'donations donor receive outgoing send transfer food drive letter thank you',inventory:'warehouse physical count close month reconciliation adjustment',imports:'upload csv spreadsheet pantrysoft historical data',packs:'pantry packs DSD schools annual totes',financials:'money revenue expenses budget donations accounting',grants:'funding grantor deadline award follow up',engagement:'social media website google newsletter groups volunteers hours',board:'board report print pdf leadership notes monthly',team:'staff roles permissions sign in'};
const noteKey='bfp-demo-period-notes-v1';
const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const store=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const readableDate=d=>d?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(d+'T12:00:00')):'Choose a date';
let mobileSection='visits',inventorySection='count',routeSync=false,lastView=view,findQuery='',lastNotePeriod='';
const legacyNotes={...data.notes},legacyNotePeriod=reportPeriodKey();
views.forEach(v=>{v[2]=labels[v[0]]||v[2]});
Object.entries(labels).forEach(([key,label])=>{if(meta[key]){meta[key][0]=label;meta[key][1]=descriptions[key]||'Choose what you need to do.'}});
const allowed=id=>allowedView(id)&&id!=='mini';
const taskButton=(id,title,detail,extra='')=>'<button type="button" class="task-choice" data-view="'+id+'" '+extra+'><span class="task-symbol">'+iconFor(id)+'</span><span><strong>'+esc(title||labels[id])+'</strong><small>'+esc(detail||descriptions[id]||'')+'</small></span><span aria-hidden="true">→</span></button>';
function home(){
 const tasks=[['driver','Record a service visit','Bus, truck and Mini Market'],['food','Receive or send food','Receipts, transfers and donor thanks'],['mobile','Find a saved visit','Search, review or correct a record'],['market','Review Market totals','Monthly PantrySoft reporting'],['inventory','Finish the month','Counts, movements and review'],['board','Prepare a board report','Sources, commentary and a clear packet']].filter(t=>allowed(t[0]));
 const month=$('#to').value.slice(0,7),checks=[['imports','Market import',marketAggregates().some(x=>x.month===month&&x.location==='bountiful')],['financials','Financial summary',financeRecords().some(x=>x.month===month&&x.location==='bountiful')],['inventory','Inventory count',physicalCounts().some(x=>x.month===month&&validPhysicalCount(x))]].filter(x=>allowed(x[0]));
 const entered=checks.filter(x=>x[2]).length;
 return '<section class="studio-hero"><div class="studio-hero-copy"><p class="eyebrow">BOUNTIFUL FOOD PANTRY</p><h1>Your day at the pantry.<br><span>A little easier.</span></h1><p>Services, food operations and reporting. A clear place for everything, and a simple next step.</p><div class="studio-hero-tags"><span>People first</span><span>One shared purpose</span></div><svg class="studio-sprig" viewBox="0 0 180 180" fill="none" aria-hidden="true"><path d="M30 165C70 115 89 61 124 15M68 111C12 101 14 56 14 56C55 53 80 77 68 111ZM88 79C83 28 130 18 130 18C146 54 122 81 88 79ZM45 143C68 104 121 124 121 124C109 160 72 172 45 143Z" stroke="currentColor" stroke-width="2"/></svg></div><div class="studio-month-card"><div class="studio-card-top"><span class="eyebrow">MONTHLY ESSENTIALS</span><span class="studio-source-count">'+entered+' / '+checks.length+'</span></div><label for="homeReportingMonth">Working month<input type="month" id="homeReportingMonth" value="'+esc(month)+'"></label><div class="studio-source-list">'+checks.map(([id,label,done])=>'<button type="button" data-view="'+id+'"><span class="studio-source-dot '+(done?'complete':'')+'" aria-hidden="true">'+(done?'✓':'')+'</span><span><strong>'+label+'</strong><small>'+(done?'Entered':'Needed')+'</small></span><span aria-hidden="true">→</span></button>').join('')+'</div><small class="studio-source-note">Source presence is a starting point. Figures still need staff review.</small></div></section><section class="studio-tasks" aria-labelledby="common-tasks"><div class="studio-section-title"><div><p class="eyebrow">EVERYDAY WORK</p><h2 id="common-tasks">What would you like to do?</h2></div><span>Choose a task to get started</span></div><div class="task-grid">'+tasks.map(t=>taskButton(...t)).join('')+'</div></section><section class="studio-volunteer-invite"><span class="task-symbol">'+iconFor('team')+'</span><div><p class="eyebrow">EXPLORE WHAT’S POSSIBLE</p><h2>A home for your volunteer community.</h2><p>Meet the optional Volunteer Hub: people, schedules, service hours and a thoughtful thank-you.</p></div><a href="volunteers/" class="studio-link-button">Explore Volunteer Hub <span aria-hidden="true">↗</span></a></section><section class="all-workspaces"><div class="studio-section-title"><div><p class="eyebrow">YOUR WORKSPACE</p><h2>Everything in one place</h2></div></div><div class="workspace-directory">'+groups.map(([title,ids])=>{const permitted=ids.filter(allowed);return permitted.length?'<section class="directory-group"><h3>'+title+'</h3>'+permitted.map(id=>'<button type="button" data-view="'+id+'"><strong>'+esc(labels[id])+'</strong><small>'+esc(descriptions[id])+'</small><span aria-hidden="true">→</span></button>').join('')+'</section>':''}).join('')+'</div></section>';
}
function placeHomePanels(){if(view!=='home')return;const hero=$('.studio-hero'),month=$('.studio-month-card'),tasks=$('.studio-tasks');if(!hero||!month||!tasks)return;if(matchMedia('(max-width:600px)').matches){if(month.parentElement===hero)tasks.after(month)}else if(month.parentElement!==hero)hero.append(month)}
window.addEventListener('resize',placeHomePanels);
function nav(){
 return '<button type="button" class="nav-home '+(view==='home'?'active':'')+'" data-view="home">'+iconFor('home')+'<span>Home</span></button>'+groups.map(([title,ids])=>{const permitted=ids.filter(id=>allowed(id)&&!['reports','overview'].includes(id));return permitted.length?'<details class="nav-group" '+(permitted.includes(view)?'open':'')+'><summary>'+title+'</summary>'+permitted.map(id=>'<button type="button" data-view="'+id+'" '+(id===view?'aria-current="page" class="active"':'')+'>'+iconFor(id)+'<span>'+esc(labels[id])+'</span></button>').join('')+'</details>':''}).join('');
}
function installHeader(){
 const header=document.querySelector('.shell > header'),role=$('#demoRole').closest('label'),location=$('#location').closest('label');
 const settings=document.createElement('details');settings.id='demoSettings';settings.className='demo-settings';settings.innerHTML='<summary>Demo settings</summary><div class="demo-settings-fields"></div>';
 settings.querySelector('div').append(role,location);
 header.replaceChildren();header.innerHTML='<button type="button" id="workspaceMenu" aria-label="Open navigation menu" aria-controls="workspaceAside" aria-expanded="false">☰ <span>Menu</span></button><button type="button" class="header-home" data-view="home" aria-label="Bountiful Food Pantry home"><img src="logo.png" alt=""><span>Bountiful Food Pantry<small>Operations demo</small></span></button><div class="task-finder"><label for="taskFinder">Find a task</label><input type="search" id="taskFinder" placeholder="Try grants, saved visits, donations…" autocomplete="off" aria-controls="taskResults" aria-expanded="false"><div id="taskResults" hidden aria-label="Task search results"></div></div>';
 header.append(settings);
 const aside=document.querySelector('body > aside');aside.id='workspaceAside';aside.querySelector('.workspace').textContent='YOUR WORKSPACE';const closeMenu=document.createElement('button');closeMenu.type='button';closeMenu.id='closeWorkspaceMenu';closeMenu.textContent='Close menu ×';aside.querySelector('.logo').after(closeMenu);closeMenu.onclick=()=>toggleMenu(false);
 const overlay=document.createElement('button');overlay.id='menuOverlay';overlay.type='button';overlay.setAttribute('aria-label','Close navigation menu');overlay.hidden=true;document.body.append(overlay);
 const notice=document.createElement('div');notice.id='workspaceNotice';notice.innerHTML='<span>Demo · Fictional information only</span><span>Saved on this browser, not shared with other devices.</span>';header.after(notice);
 const status=document.createElement('div');status.id='saveNotice';status.hidden=true;status.setAttribute('role','status');notice.after(status);
 const from=$('#from').closest('label'),to=$('#to').closest('label'),period=$('.filterbar'),periodStatus=$('#periodStatus');
 period.replaceChildren();period.innerHTML='<div class="period-month"><label for="workspaceMonth">Reporting month</label><div><button type="button" data-month-step="-1" aria-label="Previous reporting month">‹</button><input id="workspaceMonth" type="month" aria-label="Reporting month"><button type="button" data-month-step="1" aria-label="Next reporting month">›</button></div></div><details id="customDates"><summary>Choose other dates</summary><div class="custom-date-fields"></div></details>';
 period.querySelector('.custom-date-fields').append(from,to);period.append(periodStatus);
 $('#workspaceMonth').onchange=e=>setMonth(e.target.value);
 $('#taskFinder').oninput=e=>{findQuery=e.target.value;showFindResults()};
 $('#taskFinder').onkeydown=e=>{if(e.key==='Escape'){findQuery='';e.target.value='';showFindResults()}if(e.key==='ArrowDown'){$('#taskResults button')?.focus();e.preventDefault()}};
 $('#workspaceMenu').onclick=()=>toggleMenu(!document.body.classList.contains('workspace-menu-open'));
 overlay.onclick=()=>toggleMenu(false);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
 document.addEventListener('click',e=>{if(!e.target.closest('.task-finder')){$('#taskResults').hidden=true;$('#taskFinder').setAttribute('aria-expanded','false')}});
 window.addEventListener('resize',syncMenu);
}
function syncMenu(){const aside=$('#workspaceAside'),narrow=matchMedia('(max-width:900px)').matches,open=document.body.classList.contains('workspace-menu-open');aside.inert=narrow&&!open;document.querySelector('.shell').inert=narrow&&open;$('#workspaceMenu').setAttribute('aria-expanded',String(narrow&&open));$('#workspaceMenu').setAttribute('aria-label',narrow&&open?'Close navigation menu':'Open navigation menu');$('#menuOverlay').hidden=!narrow||!open}
function toggleMenu(open){document.body.classList.toggle('workspace-menu-open',open);syncMenu();if(open){$('#workspaceAside button')?.focus()}else if(document.activeElement?.closest('#workspaceAside'))$('#workspaceMenu').focus()}
function setMonth(month){if(!/^\d{4}-\d{2}$/.test(month))return;const [y,m]=month.split('-').map(Number);$('#from').value=month+'-01';$('#to').value=month+'-'+String(new Date(y,m,0).getDate()).padStart(2,'0');render()}
function showFindResults(){
 const q=findQuery.trim().toLowerCase(),box=$('#taskResults');if(!q){box.hidden=true;$('#taskFinder').setAttribute('aria-expanded','false');return}
 const hits=Object.keys(labels).filter(id=>id!=='home'&&allowed(id)&&q.split(/\s+/).every(term=>[id,labels[id],descriptions[id],keywords[id]].join(' ').toLowerCase().includes(term)||term.length>3&&[id,labels[id],descriptions[id],keywords[id]].join(' ').toLowerCase().includes(term.replace(/s$/,'')))).slice(0,8);
 box.innerHTML=hits.length?hits.map(id=>'<button type="button" data-view="'+id+'"><strong>'+esc(labels[id])+'</strong><small>'+esc(descriptions[id])+'</small></button>').join(''):'<p>No matching task. Try “food”, “visits”, “monthly” or “grants”.</p>';box.hidden=false;$('#taskFinder').setAttribute('aria-expanded','true');
}
function mobileWorkspace(s){
 const tabs=[['visits','Saved visits'],['totals','Program totals'],['truck','Truck weights'],['history','Historical summaries']];
 let body='';
 if(mobileSection==='visits')body=offsiteVisitLedger()+'<div id="offsiteDetail"></div>';
 if(mobileSection==='totals')body='<div class="task-grid">'+['Mobile Bus','Mobile Truck','Mini Market'].map(program=>{const rows=s.v.filter(x=>x.program===program);return '<section class="card"><h2>'+program+'</h2>'+table(['Measure','Recorded total'],[['Household visits',fmt(rows.length)],['Person-visits',fmt(rows.reduce((n,x)=>n+Number(x.size||0),0))]])+'<button type="button" data-record="'+program+'">Record '+program+' visit</button></section>'}).join('')+'</div>'+offsiteLocations(s.v.filter(x=>x.program!=='Market'));
 if(mobileSection==='truck')body=truckPanel()+'<details class="advanced-review"><summary>Compare truck runs with service records</summary>'+offsiteReconciliationPanel()+'</details>';
 if(mobileSection==='history')body=offsiteMonthlySummary();
 return '<div class="workspace-actions"><button type="button" class="primary" data-view="driver">Record a new visit</button><p>Saved visits are below. Choose another section for totals or truck weights.</p></div><div class="workspace-tabs" role="group" aria-label="Off-site workspace">'+tabs.map(([id,label])=>'<button type="button" data-mobile-section="'+id+'" aria-pressed="'+(id===mobileSection)+'">'+label+'</button>').join('')+'</div>'+body;
}
function driverWorkspace(){
 return '<section class="card driver-entry"><h2>Which service are you recording?</h2><p>The form is the same for all three programs.</p><div class="driver-choices">'+['Mobile Bus','Mobile Truck','Mini Market'].map(program=>'<button type="button" class="task-choice" data-record="'+program+'"><span class="task-symbol">'+iconFor('mobile')+'</span><span><strong>'+program+'</strong><small>Record a visit</small></span><span aria-hidden="true">→</span></button>').join('')+'</div></section><div class="workspace-actions"><button type="button" data-view="mobile">View saved visits</button><small>Internet is needed to open this demo. Records stay on this browser.</small></div>';
}
function reportSources(){
 const months=reportingMonths(),valid=monthCoverage().ok,market=marketAggregates().filter(x=>x.location==='bountiful'&&months.includes(x.month)),complete=valid&&months.every(m=>market.some(x=>x.month===m)),sum=k=>market.reduce((n,x)=>n+Number(x[k]||0),0);
 return {months,valid,market,complete,sum};
}
function reportHub(){
 return '<section class="task-welcome"><h2>Which report do you need?</h2><p>Each report uses the dates and location selected above.</p></section><div class="task-grid">'+[['board','Board packet','Review sources, add commentary and print'],['history','Trends and comparisons','Monthly, prior-year and financial comparisons'],['market','Market monthly summary','Imported PantrySoft figures'],['mobile','Off-site visits','Find and export individual service records'],['food','Food and donor reports','Receipts, transfers, food drives and thanks'],['inventory','Inventory and month-end','Physical counts and recorded movements'],['financials','Monthly financials','Monthly manual summaries and corrections'],['geography','Geographic reach','Example community reporting'],['engagement','Community measures','Monthly outreach and communication totals']].filter(x=>allowed(x[0])).map(t=>taskButton(...t)).join('')+'</div>';
}
function notesForPeriod(){
 if(view!=='board')return;
 const key=reportPeriodKey(),all=parse(noteKey,{});
 if(lastNotePeriod!==key){data.notes=all[key]?{...all[key]}:key===legacyNotePeriod?{...legacyNotes}:{director:'',client:'',operations:'',capital:''};lastNotePeriod=key}
}
function annualBlock(){
 const year=$('#to').value.slice(0,4),a=annualPackRecords().find(x=>x.year===year);
 return '<h3>Annual school-program totals · '+esc(year)+'</h3>'+table(['Measure','Annual total'],[['DSD packs',a?fmt(a.dsd_packs):'Not entered'],['Davis County packs, including charter schools',a?fmt(a.davis_packs):'Not entered'],['Principal pantry totes in DSD',a?fmt(a.principal_totes):'Not entered'],['DSD schools served',a?fmt(a.dsd_schools):'Not entered']])+'<p class="report-caption">Annual context; not added to monthly service visits.</p>';
}
const programOptionsKey='bfp-demo-board-programs-v1';
function currentPrograms(){return Object.assign({'Mobile Bus':true,'Mobile Truck':true,'Mini Market':true},parse(programOptionsKey,{})[reportPeriodKey()]||{})}
const baseCustomize=boardCustomizePanel;
boardCustomizePanel=function(){const selected=currentPrograms();return baseCustomize()+'<section class="card no-print"><h2>Off-site programs in this packet</h2><p class="muted">Choose the programs you want the board to see for this period. Excluding a program keeps its saved history available in Services.</p><form id="boardProgramsForm" class="planning-form">'+Object.keys(selected).map(program=>'<label><input type="checkbox" name="'+program+'" '+(selected[program]?'checked':'')+'> '+program+'</label>').join('')+'<button type="submit" class="primary">Save program choices</button></form></section>'};
document.addEventListener('submit',e=>{if(e.target.getAttribute('id')!=='boardProgramsForm')return;e.preventDefault();const all=parse(programOptionsKey,{});all[reportPeriodKey()]=Object.fromEntries(['Mobile Bus','Mobile Truck','Mini Market'].map(program=>[program,e.target.elements.namedItem(program).checked]));store(programOptionsKey,all);render();toast('Program choices saved for this packet.');});
// Use the imported monthly source for Market; keep other programs separate.
board=function(s){
 const range=readableDate($('#from').value)+' – '+readableDate($('#to').value),src=reportSources(),offsite=s.v.filter(x=>x.program!=='Market');
 const mark=title=>'<div class="report-masthead"><div class="report-brand"><img src="logo.png" alt="Bountiful Food Pantry"><div><strong>BOUNTIFUL FOOD PANTRY</strong><span>'+title+'</span></div></div><span class="report-demo">SYNTHETIC DEMO</span></div>';
 const page=(title,body,n)=>'<section class="report-page">'+mark(title)+'<div class="report-page-title"><h2>'+title+'</h2><p>'+esc(range)+' · Bountiful</p></div>'+body+'<div class="report-footer"><span>Fictional demonstration · Source review required</span><strong>'+n+' / 4</strong></div></section>';
 const market=printableMarketPrimarySummary().replace('These values are not added to the daily demonstration service totals elsewhere in the packet.','Market totals remain separate from off-site records.');
 const service=table(['Off-site program','Household visits','Person-visits'],['Mobile Bus','Mobile Truck','Mini Market'].filter(program=>currentPrograms()[program]).map(program=>{const rows=offsite.filter(x=>x.program===program);return [program,fmt(rows.length),fmt(rows.reduce((n,x)=>n+Number(x.size||0),0))]}));
 const finances=financeForPeriod(),financialComplete=src.valid&&src.months.every(m=>finances.some(x=>x.month===m)),finSum=k=>finances.reduce((n,x)=>n+Number(x[k]||0),0);
 const fin=financialComplete?table(['Monthly financial summary','Amount'],[['Revenue',money(finSum('revenue'))],['Donations (included in revenue)',money(finSum('donations'))],['Expenses',money(finSum('expenses'))],['Net revenue less expenses',money(finSum('revenue')-finSum('expenses'))],['Expense budget',money(finSum('budget'))]]):'<p>Financial source coverage is incomplete for this period. Open Monthly financials to enter or review each month.</p>';
 const engagement=engagementRecords().filter(x=>src.months.includes(x.month));
 const community=src.valid&&engagement.length?table(['Month','Community measure','Recorded value'],engagement.map(x=>[esc(x.month),esc(engagementMeasures.find(m=>m[0]===x.measure)?.[1]||x.measure),fmt(x.value)])):'<p>Monthly community and volunteer summaries have not been entered for this period.</p>';
 const note=(key,label)=>'<section class="report-note"><h3>'+label+'</h3><p>'+esc(data.notes[key]||'Not entered for this reporting period.')+'</p></section>';
 const impact=market+'<h3>Off-site service records</h3>'+service+'<p class="report-caption">Visit counts include repeat service. No combined unique-household figure is calculated across these sources. Off-site figures come from saved visit records within the selected dates.</p>';
 const operations='<h3>Food received and transfers</h3>'+table(['Recorded movement','Pounds'],[['Food received',fmt(s.incoming)],['Grocery Rescue (included in received)',fmt(s.rescue)],['Partner transfers',fmt(scope(data.outgoing).reduce((n,x)=>n+Number(x.pounds||0),0))]])+'<p class="report-caption">Movements are not a physical inventory balance. Truck loads, returns and distribution require separate review. Mobile Bus household weights are not tracked.</p>'+annualBlock()+'<h3>Manual monthly financial summary</h3>'+fin+'<p class="report-caption">Manual, unaudited summary. Grant awards are not added to revenue. Donations are already included in revenue.</p>';
 const narrative=note('director','Director’s perspective')+note('client','Client services')+note('operations','Operations')+note('capital','Capital campaign')+'<h3>Community and volunteer contribution</h3>'+community+'<p class="report-caption">Community measures cover whole recorded months. Monthly summaries are separate from the proposed volunteer-management add-on. No undated volunteer-hour estimate is included.</p>';
 const sources=table(['Source','Use in this packet'],[['PantrySoft monthly aggregate import','Market totals; full calendar months only'],['Saved off-site visit records','Bus, Truck and Mini Market visits'],['Food receipt and transfer records','Food movements; not inventory balance'],['Annual school-program summary','Annual context; not monthly service'],['Manual monthly financials','Revenue, expenses and budget'],['Monthly community measures','Engagement and volunteer summaries']])+'<h3>Source coverage</h3>'+table(['Check','Status','Detail'],boardReadiness().checks.map(x=>[esc(x[0]),x[1]?'Available':'Needs review',esc(x[2])]))+'<p>All figures and narratives are fictional. Data is saved in this browser only. Source presence does not verify accuracy, approve a report or lock a month. Northern Davis is planned and excluded.</p>';
 return '<article class="paper board-brief">'+page('Service & community impact',impact,1)+page('Food, school programs & finances',operations,2)+page('Leadership notes & community measures',narrative,3)+page('Reporting sources & review',sources,4)+'</article>';
};
function readableTables(){
 document.querySelectorAll('#content .table-wrap').forEach(w=>{w.tabIndex=0;w.setAttribute('role','region');w.setAttribute('aria-label','Report table. Scroll horizontally for more columns.');if(!w.closest('#offsiteRows')&&!w.previousElementSibling?.classList.contains('table-scroll-hint')){const hint=document.createElement('p');hint.className='table-scroll-hint';hint.textContent='More columns may be available. Swipe across the table to see them.';w.before(hint)}});
 const t=document.querySelector('#offsiteRows table');if(t){const headers=[...t.querySelectorAll('th')].map(x=>x.textContent);t.querySelectorAll('tbody tr').forEach(row=>[...row.cells].forEach((cell,i)=>{if(cell.colSpan===1)cell.dataset.column=headers[i]||''}))}
}
function friendlyTimes(){
 document.querySelectorAll('#content td').forEach(el=>{const text=el.textContent.trim();if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:/.test(text)&&!el.children.length){const date=new Date(text);if(!isNaN(date))el.textContent=new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Denver'}).format(date)+' (Mountain time)'}});
}
function boardInputSummary(){
 const section=[...document.querySelectorAll('#content section')].find(el=>el.querySelector('h2')?.textContent==='2. Confirm report inputs');
 if(!section)return;
 const source=reportSources();section.innerHTML='<h2>2. Review report sources</h2><p>Market reporting uses imported monthly totals. Off-site service uses saved visit records. The packet keeps those sources separate.</p>'+table(['Source','Coverage'],[['Market monthly totals',source.complete?'All selected months have imports':'Missing or incomplete; review imports'],['Manual financial summaries',financeForPeriod().length+' month(s) entered'],['Annual school totals',annualPackRecords().some(x=>x.year===$('#to').value.slice(0,4))?'Available for selected year':'Not entered'],['Community & volunteer summaries','Review dated monthly measures']])+'<div class="workspace-actions"><button data-view="imports">Review imports</button><button data-view="financials">Monthly financials</button><button data-view="engagement">Community measures</button></div><p class="muted">Missing figures are shown as unavailable. Daily Market estimates and undated volunteer hours are excluded from the packet.</p>';
}
boardPacketRows=function(){
 const from=$('#from').value,to=$('#to').value,period=from+' to '+to,src=reportSources(),rows=[['section','metric','period_or_month','location','value','source','note']];
 for(const x of src.market)for(const key of ['duplicated_households','unduplicated_households','duplicated_individuals','unduplicated_individuals','new_clients','outside_davis_percent','market_shifts'])rows.push(['Market',key,x.month,x.location,x[key],'Monthly aggregate import',src.valid?'Monthly unique counts are not summed across months':'Whole-month figures; selected dates are partial']);
 if(!src.complete)rows.push(['Source coverage','Market totals',period,'bountiful','Incomplete','Monthly aggregate import','Missing monthly sources; do not substitute daily estimates']);
 for(const program of ['Mobile Bus','Mobile Truck','Mini Market'].filter(program=>currentPrograms()[program])){const visits=stats().v.filter(x=>x.program===program);rows.push(['Off-site',program+' household visits',period,'bountiful',visits.length,'Saved visits','Includes repeat visits'],['Off-site',program+' person-visits',period,'bountiful',visits.reduce((n,x)=>n+Number(x.size||0),0),'Saved visits','Not distinct people'])}
 const totals=stats();for(const [label,value] of [['Food received',totals.incoming],['Grocery Rescue included in received',totals.rescue],['Partner transfers',scope(data.outgoing).reduce((n,x)=>n+Number(x.pounds||0),0)]])rows.push(['Food',label,period,'bountiful',value,'Recorded food movements','Pounds; not an inventory balance']);
 for(const x of financeForPeriod())for(const key of ['revenue','donations','expenses','budget'])rows.push(['Financials',key,x.month,x.location,x[key],'Manual monthly summary',key==='donations'?'Included in revenue':'Unaudited']);
 for(const x of annualPackRecords().filter(x=>x.year===to.slice(0,4)))for(const key of ['dsd_packs','davis_packs','principal_totes','dsd_schools'])rows.push(['Annual school totals',key,x.year,'bountiful',x[key],'Manual annual summary','Annual context; not monthly service']);
 for(const x of engagementRecords().filter(x=>src.months.includes(x.month)))rows.push(['Community',x.measure,x.month,'bountiful',x.value,'Manual monthly measure',x.notes||'']);
 return rows;
};
function inventoryTabs(){
 const content=$('#content'),children=[...content.children];
 const tabs=document.createElement('div');tabs.className='workspace-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Month-end steps');
 tabs.innerHTML=[['count','1. Count stock'],['movements','2. Review movements'],['review','3. Review requests'],['finish','4. Finish month']].map(([id,name])=>'<button type="button" data-inventory-section="'+id+'" aria-pressed="'+(inventorySection===id)+'">'+name+'</button>').join('');
 content.prepend(tabs);
 children.forEach(el=>{
  const h=el.querySelector('h2')?.textContent||'';
  let section='movements';
  if(/count tools|inventory reconciliation|Count →/.test(h))section='count';
  else if(/adjustment approval|evidence register|data-quality|exception review/.test(h))section='review';
  else if(/Month-end source status|Month-end workspace|core monthly sources|Select one full/.test(h))section='finish';
  el.hidden=section!==inventorySection;
 });
}
function foodNavigation(){
 const nav=$('.food-workspace-nav');if(!nav)return;
 const select=document.createElement('select');select.id='foodWorkspaceSelect';select.setAttribute('aria-label','Food workspace');
 [...nav.querySelectorAll('button')].forEach(b=>{const o=document.createElement('option');o.value=b.dataset.foodSection;o.textContent=b.textContent;o.selected=o.value===activeFoodSection;select.append(o)});
 const label=document.createElement('label');label.className='food-workspace-chooser';label.textContent='Food workspace';label.append(select);nav.before(label);nav.hidden=true;
 select.onchange=e=>{activeFoodSection=e.target.value;render()};
}
function importNavigation(){
 const content=$('#content'),cards=[...content.querySelectorAll('section.card')].filter(el=>el.querySelector('[data-import]'));
 if(!cards.length)return;
 const label=document.createElement('label');label.className='import-source-picker';label.textContent='What would you like to import?';const sel=document.createElement('select');sel.id='workspaceImportSource';
 cards.forEach(card=>{const b=card.querySelector('[data-import]'),option=document.createElement('option');option.value=b.dataset.import;option.textContent=card.querySelector('h2')?.textContent||'';option.selected=selectedImport===option.value;sel.append(option);card.hidden=true});
 label.append(sel);cards[0].parentElement.before(label);
 sel.onchange=e=>{selectedImport=e.target.value;stagedImport=null;render()};
}
function sampleImportAction(){
 const template=$('#aggregateTemplate');if(!template)return;
 const b=document.createElement('button');b.type='button';b.id='tryFictionalImport';b.textContent='Try a fictional sample';template.after(b);
 b.onclick=()=>{const month=$('#to').value.slice(0,7),sample='month,location,duplicated_households,unduplicated_households,duplicated_individuals,unduplicated_individuals,new_clients,outside_davis_percent,market_shifts\n'+month+',bountiful,100,80,400,300,10,5,20';stageAggregate(new File([sample],'fictional-market-'+month+'.csv',{type:'text/csv'}))};
}
function improveMissingFigures(){
 if(!['financials','engagement'].includes(view))return;
 const rows=view==='financials'?financeForPeriod():engagementRecords().filter(x=>x.month>=$('#from').value.slice(0,7)&&x.month<=$('#to').value.slice(0,7));
 if(!rows.length)$('#content').querySelectorAll('.metric .value').forEach(el=>{el.textContent='Not entered';el.classList.add('unavailable-value')});
}
const baseRender=render;
render=function(){
 notesForPeriod();baseRender();
 document.body.classList.add('task-workspace');document.body.dataset.workspace=view;
 $('#nav').innerHTML=nav();
 $('#mainAction').hidden=true;
 $('.filterbar').hidden=['home','driver','team','grants'].includes(view)||demoRole==='volunteer';
 $('#workspaceMonth').value=$('#to').value.slice(0,7);
 const custom=$('#from').value.slice(0,7)!==$('#to').value.slice(0,7)||$('#from').value.slice(-2)!=='01';$('#customDates').open=custom;
 $('#periodStatus').textContent=$('#from').value>$('#to').value?'Choose an end date after the start date':readableDate($('#from').value)+' – '+readableDate($('#to').value);
 if($('#location').value!=='north'&&demoRole!=='volunteer'&&$('#from').value<=$('#to').value){
  if(view==='home'){$('#content').innerHTML=home();const month=$('#homeReportingMonth');if(month)month.onchange=e=>setMonth(e.target.value);placeHomePanels()}
  if(view==='mobile'){$('#content').innerHTML=mobileWorkspace(stats());offsiteReportActions()}
  if(view==='driver')$('#content').innerHTML=driverWorkspace();
  if(view==='reports')$('#content').innerHTML=reportHub();
  if(view==='inventory')inventoryTabs();
  if(view==='food')foodNavigation();
  if(view==='imports'){importNavigation();sampleImportAction()}
  if(view==='packs'){[...$('#content').querySelectorAll('section')].find(el=>el.querySelector('h2')?.textContent==='Separate demo completion activity')?.remove()}
  improveMissingFigures();
 }
 if(view==='home'){$('#title').textContent='Home';$('#subtitle').textContent=''}
 if(view!==lastView){
  if(!routeSync&&location.hash.slice(1)!==view)history.pushState({workspace:view},'', '#'+view);
  lastView=view;toggleMenu(false);findQuery='';$('#taskFinder').value='';$('#taskResults').hidden=true;$('#taskFinder').setAttribute('aria-expanded','false');
 }
 if(view==='board'&&!preview)boardInputSummary();
 friendlyTimes();readableTables();
 if(view==='board'&&preview){const names=['impact','operations','narrative','sources'];$('#content').querySelectorAll('.board-brief > .report-page').forEach((page,i)=>{page.dataset.reportSection=names[i];page.hidden=currentBoardOptions()[names[i]]===false})}
 syncMenu();
};
offsiteReportActions=function(){
 const select=$('#offsiteProgramFilter');if(select)select.onchange=e=>{offsiteFilters.program=e.target.value;render()};
 ['offsiteLocationFilter','offsiteSearch'].forEach((id,i)=>{const input=$('#'+id);if(!input)return;let timer;input.oninput=()=>{clearTimeout(timer);const value=input.value,start=input.selectionStart;timer=setTimeout(()=>{if(view!=='mobile')return;offsiteFilters[i?'search':'location']=value;render();const next=$('#'+id);next?.focus({preventScroll:true});if(next?.setSelectionRange)next.setSelectionRange(start,start)},180)};});
};
let toastTimer;
toast=function(message){
 clearTimeout(toastTimer);const box=$('#toast');box.textContent=message;box.style.display='block';toastTimer=setTimeout(()=>box.style.display='none',6500);
 const modal=$('#modal');
 if(modal.open){let feedback=$('#entryFeedback');if(!feedback){feedback=document.createElement('p');feedback.id='entryFeedback';feedback.setAttribute('role','alert');$('#entry').append(feedback)}feedback.textContent=message;feedback.scrollIntoView({block:'nearest'})}
 const notice=$('#saveNotice');notice.textContent=message;notice.hidden=false;
};
const baseOpenEntry=openEntry;
openEntry=function(...args){$('#entryFeedback')?.remove();baseOpenEntry(...args);const donor=$('#fields [name="partner"]');if(donor&&args[0]==='food'){const names=[...new Set([...data.food.map(x=>x.partner),...donorDirectory().map(x=>x.name)].filter(Boolean))];const list=document.createElement('datalist');list.id='knownFoodDonors';names.forEach(name=>{const option=document.createElement('option');option.value=name;list.append(option)});donor.setAttribute('list',list.id);donor.placeholder='Choose a name, or enter a new donor';donor.after(list)}const stop=$('#fields [name="stop"]');if(stop){const stops=[...new Set(data.visits.filter(x=>x.program===args[1]&&x.stop).map(x=>x.stop))];const list=document.createElement('datalist');list.id='knownServiceStops';stops.forEach(value=>{const o=document.createElement('option');o.value=value;list.append(o)});stop.setAttribute('list',list.id);stop.after(list)}};
document.addEventListener('invalid',e=>{if(e.target.closest('#entry'))toast(e.target.validationMessage)},true);
document.addEventListener('input',e=>{if(e.target.dataset.note){const all=parse(noteKey,{});all[reportPeriodKey()]={...data.notes,[e.target.dataset.note]:e.target.value};store(noteKey,all)}});
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.foodSection)render();
 if(b.dataset.offsiteView)friendlyTimes();
 if(b.dataset.mobileSection){mobileSection=b.dataset.mobileSection;render()}
 if(b.dataset.inventorySection){inventorySection=b.dataset.inventorySection;render()}
 if(b.dataset.monthStep){const [y,m]=$('#workspaceMonth').value.split('-').map(Number),d=new Date(y,m-1+Number(b.dataset.monthStep),1);setMonth(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'))}
 if(b.dataset.view){toggleMenu(false);$('#taskResults').hidden=true}
});
window.addEventListener('popstate',()=>{const id=location.hash.slice(1)||'home';if(!meta[id])return;routeSync=true;view=allowedView(id)?id:'home';preview=false;render();routeSync=false;window.scrollTo(0,0)});
installHeader();
const initial=location.hash.slice(1);if(initial&&meta[initial]&&allowedView(initial)){view=initial;lastView=initial}
render();
})();

