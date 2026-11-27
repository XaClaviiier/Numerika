'use strict';
const $=id=>document.getElementById(id), cols=GridMath.cols;
const paths={book:'M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v15h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3z M12 6v15',search:'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',grid:'M3 4h18v16H3z M3 10h18 M9 4v16',keys:'M2 6h20v12H2z M6 10h1m3 0h1m3 0h1m3 0h1M8 14h8',target:'M21 12a9 9 0 1 1-9-9 M17 12a5 5 0 1 1-5-5 M12 12l8-8',export:'M12 3v11m-4-4 4 4 4-4 M4 15v5h16v-5',check:'M4 12l5 5L20 6',curve:'M3 19V5 M3 19h18 M5 16c5 0 5-11 9-11s3 6 7 6',layers:'M3 8l9-5 9 5-9 5z M3 12l9 5 9-5 M3 16l9 5 9-5',area:'M3 20V4m0 16h18 M5 17l4-8 4 4 6-9v13z',cross:'M3 12h18 M12 3v18 M5 18l13-13'};
function icon(k){return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[k]+'"/></svg>';}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const groups=['UTS','UAS'];
const symbols=['book','layers'];
const key='numerika.workbook.v1';let saved;
try{saved=JSON.parse(localStorage.getItem(key))||{};}catch{saved={};}
saved.works??={};saved.passed??={};
saved.sets??={};
let original=lessons.find(l=>l.id===saved.lesson)||lessons[0],setIndex=saved.sets[original.id]||0;
let lesson=practiceSet(original,setIndex),mode=saved.mode==='exam'?'exam':'guide',openGroup=termOf(lesson);
let stage='intro',exampleStep=0,inspectRow=lesson.plot.from;
let addr,changes,data,read,feedback={},tab='steps',clipboard=null,history=[],formOriginal='',plotPoints=[];
function keyFor(){return lesson.id+'@'+mode+(setIndex?'@'+setIndex:'');}
function passedLesson(id){return ['guide','exam'].some(m=>['','@1','@2'].some(s=>saved.passed[id+'@'+m+s]));}
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
function reveal(element,delay=0){
  element.getAnimations().filter(a=>a.id==='content-change').forEach(a=>a.cancel());
  if(reduceMotion.matches)return;
  element.animate([{opacity:.55,transform:'translateY(5px)'},{opacity:1,transform:'none'}],
    {id:'content-change',duration:200,delay,fill:'backwards',easing:'cubic-bezier(.23,1,.32,1)'});
}
function drawer(open){
  const sidebar=$('sidebar');
  sidebar.classList.toggle('open',open);
  $('openNav').setAttribute('aria-expanded',String(open));
  document.querySelector('main').inert=open;
  if(open)$('closeNav').focus({preventScroll:true});
  else if(sidebar.contains(document.activeElement)&&matchMedia('(max-width: 840px)').matches)$('openNav').focus({preventScroll:true});
}
function persist(){try{localStorage.setItem(key,JSON.stringify(saved));$('save').textContent='✓  Tersimpan lokal';}catch{$('save').textContent='Sesi ini saja';}}
function init(){
  changes=saved.works[keyFor()]??={};data={...lesson.base,...changes};read=GridMath.sheet(data);history=[];feedback={};addr=Object.keys(lesson.answers)[0];tab='steps';
  saved.lesson=lesson.id;saved.mode=mode;persist();
  $('title').textContent=lesson.title;$('week').textContent='Week '+lesson.week;$('crumb').textContent=termOf(lesson)+' / '+lesson.group;$('source').textContent=lesson.source;$('setChoice').value=setIndex;document.title=lesson.title+' · Numerika';
  for(const m of ['guide','exam']){$(m).classList.toggle('active',mode===m);$(m).setAttribute('aria-pressed',String(mode===m));}$('concept').disabled=mode==='exam';
  drawer(false);updateNav();updateStudy();render();status();
}
function selectLesson(l){
  commit();original=l;setIndex=saved.sets[l.id]||0;lesson=practiceSet(l,setIndex);openGroup=termOf(l);
  stage='intro';exampleStep=0;inspectRow=lesson.plot.from;init();$('dialog').close();
  window.scrollTo(0,0);document.querySelector('.gridScroll').scrollTo(0,0);
  reveal(document.querySelector('.heading'));reveal(document.querySelector('.overview'),35);
}
function updateNav(){
  const nav=$('nav');
  if(!nav.childElementCount)groups.forEach((g,i)=>{
    const b=document.createElement('button');b.className='group';b.dataset.group=g;
    b.innerHTML=icon(symbols[i])+'<span>'+g+' · Week '+(i?'8–14':'1–7')+'</span><span class="arr" aria-hidden="true">›</span>';
    b.onclick=()=>{openGroup=openGroup===g?'':g;updateNav();};
    const panel=document.createElement('div');panel.className='navPanel';panel.id='module-'+i;b.setAttribute('aria-controls',panel.id);
    const clip=document.createElement('div');clip.className='navClip';
    const sub=document.createElement('div');sub.className='subnav';
    let lastWeek=null;
    lessons.filter(l=>termOf(l)===g).forEach(l=>{
      if(lastWeek!==l.week){sub.append(studyElement('div','Week '+l.week+(l.week===5?' · Pengayaan':''),'weekLabel'));lastWeek=l.week;}
      const item=document.createElement('button');item.className='lesson';item.dataset.lesson=l.id;item.dataset.title=l.title;
      item.onclick=()=>selectLesson(l);sub.append(item);
    });
    clip.append(sub);panel.append(clip);nav.append(b,panel);
  });
  nav.querySelectorAll('.group').forEach(b=>{
    const expanded=b.dataset.group===openGroup,panel=b.nextElementSibling;
    b.classList.toggle('current',b.dataset.group===termOf(lesson));b.setAttribute('aria-expanded',String(expanded));
    panel.classList.toggle('expanded',expanded);panel.inert=!expanded;
  });
  nav.querySelectorAll('.lesson').forEach(item=>{
    const id=item.dataset.lesson;item.classList.toggle('sel',id===lesson.id);
    item.textContent=(passedLesson(id)?'✓  ':'')+item.dataset.title;
  });
  const count=lessons.filter(l=>passedLesson(l.id)).length;
  $('count').textContent=count+' / '+lessons.length;$('overall').max=lessons.length;$('overall').value=count;
}
function status(message){const ids=Object.keys(lesson.answers);$('status').textContent=message||ids.filter(r=>String(data[r]??'').startsWith('=')).length+' dari '+ids.length+' sel latihan berisi rumus';}
function change(batch){
  if(!Object.keys(batch).some(r=>String(data[r]??'')!==String(batch[r])))return;
  history.push({...changes});if(history.length>60)history.shift();Object.assign(changes,batch);
  refreshAfterEdit();
}
function refreshAfterEdit(){data={...lesson.base,...changes};read=GridMath.sheet(data);feedback={};delete saved.passed[keyFor()];persist();updateNav();render();status();}
function commit(){if($('formula').value!==formOriginal)change({[addr]:$('formula').value.trim()});}
function format(v){return typeof v==='number'?String(Number(v.toFixed(7))):v;}
function render(){
  const grid=$('grid'),nCols=Math.min(8,Math.max(6,...Object.keys(data).map(r=>cols.indexOf(r[0])+1))),nRows=Math.min(24,Math.max(12,lesson.rows,...Object.keys(data).map(r=>+r.slice(1))));
  grid.replaceChildren();const head=grid.createTHead().insertRow();
  for(const h of ['◩',...cols.slice(0,nCols)]){const e=document.createElement('th');e.textContent=h;head.append(e);}
  const body=grid.createTBody();
  for(let r=1;r<=nRows;r++){const row=body.insertRow(),th=document.createElement('th');th.textContent=r;row.append(th);
    for(const c of cols.slice(0,nCols)){
      const id=c+r,td=row.insertCell(),value=read(id);td.dataset.ref=id;
      td.textContent=format(value);td.title=id+'  '+String(data[id]??'');td.setAttribute('aria-label',id+' '+td.textContent);
      td.className=[typeof value==='string'&&value!==''?'label':'',id in lesson.answers?'target':'',id===addr?'selected':'',feedback[id]||''].join(' ');
    }
  }
  syncSelection();drawChart();$('undo').disabled=!history.length;
}
function syncSelection(){
  $('grid').querySelector('.selected')?.classList.remove('selected');$('grid').querySelector('[data-ref="'+addr+'"]')?.classList.add('selected');
  $('address').textContent=addr;$('formula').value=formOriginal=String(data[addr]??'');coach();
}
function select(id,focus=true){if(!id)return;commit();addr=id;syncSelection();if(focus)$('grid').focus({preventScroll:true});}
function move(dx,dy){
  const id=cols[cols.indexOf(addr[0])+dx]+(+addr.slice(1)+dy);
  if(!$('grid').querySelector('[data-ref="'+id+'"]'))return $('grid').focus({preventScroll:true});
  select(id);
  const scroll=$('grid').parentElement,box=scroll.getBoundingClientRect(),cell=$('grid').querySelector('.selected').getBoundingClientRect();
  const top=box.top+$('grid').tHead.offsetHeight;
  const vertical=cell.top<top?cell.top-top:Math.max(0,cell.bottom-box.top-scroll.clientHeight);
  const horizontal=cell.left<box.left?cell.left-box.left:Math.max(0,cell.right-box.left-scroll.clientWidth);
  if(vertical||horizontal)scroll.scrollBy({top:vertical,left:horizontal,behavior:'instant'});
}
function coach(){
  $('steps').classList.toggle('active',tab==='steps');$('concept').classList.toggle('active',tab==='concept');
  const el=$('coachBody');el.replaceChildren();const add=(tag,t)=>{const e=document.createElement(tag);e.textContent=t;el.append(e);return e;};
  if(mode==='exam'){add('h3','Latihan mandiri');add('p','Isi sel berwarna dengan rumus, lalu periksa hasilmu. Pekerjaan mode ini disimpan terpisah.');return;}
  if(tab==='concept'){add('h3',lesson.group);add('p',lesson.concept);add('p',lesson.source);return;}
  const target=Object.hasOwn(lesson.answers,addr);
  add('h3',target?'Kerjakan sel '+addr:'Sel '+addr);
  if(!target){add('p','Pilih sel berwarna ungu untuk melihat petunjuk perhitungan.');}
  else{
    const label=data[addr[0]+'1']||addr[0],rowName=data['A'+addr.slice(1)];
    const col=addr[0],r=+addr.slice(1);let hint='Hitung '+(typeof rowName==='string'?rowName:label)+' dengan merujuk sel pada tabel.';
    if((lesson.id.startsWith('greg-')||lesson.id.startsWith('der-'))&&col>='C'){
      const prev=cols[cols.indexOf(col)-1],back=lesson.title.endsWith('mundur');
      hint='Kurangkan '+prev+(back?r-1:r)+' dari '+prev+(back?r:r+1)+'. Tulis tanda =, klik sel pertama, ketik tanda minus lalu klik sel kedua.';
    }else if(label==='Lᵢ'||label==='L′ᵢ'){hint='Gunakan dua titik selain titik pada baris ini. Kunci target dengan $B$6 agar tetap saat disalin. '+(label==='L′ᵢ'?'Turunkan pembilang, lalu bagi dengan penyebut basis.':'Kalikan dua faktor (target − titik lain)/(titik baris ini − titik lain).');}
    else if(label==='Kontribusi')hint='Kalikan nilai fungsi pada kolom B dengan bobot pada kolom C di baris yang sama.';
    else if(rowName==='h')hint='Hitung x kedua dikurangi x pertama. Gunakan alamat kedua sel x agar hasil mengikuti perubahan data.';
    else if(rowName==='s')hint='Kurangkan titik acuan dari target x. Letakkan pengurangan di dalam tanda kurung, lalu bagi dengan sel h.';
    else if(rowName==='Galat %')hint='Hitung selisih nilai eksak dan pendekatan, bagi dengan nilai eksak, lalu gunakan ABS dan kalikan 100.';
    else if(lesson.plot.kind==='iter')hint='Perhatikan indeks k. '+lesson.concept;
    else if(lesson.plot.kind==='area'&&col==='B'&&r>=2&&r<=8&&lesson.id!=='mixed')hint='Kuadratkan x dengan ^2. Kalikan hasilnya dengan logaritma natural 2x menggunakan LN.';
    add('p',hint);
    if(feedback[addr]==='bad'&&data[addr]){
      const expected=GridMath.sheet({...data,...lesson.answers})(addr);
      add('p','Sel ini menghasilkan '+format(read(addr))+'. Dengan data saat ini, hasil acuannya '+format(expected)+'. Bandingkan alamat sel dan urutan operasi.');
    }
    const details=document.createElement('details'),s=document.createElement('summary');s.textContent='Lihat contoh rumus';const c=document.createElement('code');c.textContent=lesson.answers[addr];details.append(s,c);el.append(details);
  }
  const next=document.createElement('button');next.className='btn';next.textContent='Sel latihan berikutnya';next.onclick=()=>{const refs=Object.keys(lesson.answers);select(refs[(refs.indexOf(addr)+1)%refs.length]);$('grid').querySelector('.selected')?.scrollIntoView({block:'nearest',inline:'nearest'});};el.append(next);
}
$('grid').onmousedown=e=>{
  const td=e.target.closest('[data-ref]'),input=$('formula');
  if(!td||document.activeElement!==input)return;
  e.preventDefault();
  const before=input.value.slice(0,input.selectionStart);
  if(before.startsWith('=')&&/[=+*/^(,:;<>-]\s*$/.test(before)){
    input.setRangeText(td.dataset.ref,input.selectionStart,input.selectionEnd,'end');
    td.dataset.inserted='yes';
  }else select(td.dataset.ref);
};
$('grid').onclick=e=>{const td=e.target.closest('[data-ref]');if(!td)return;if(td.dataset.inserted){delete td.dataset.inserted;return;}select(td.dataset.ref);};
$('grid').ondblclick=()=>{$('formula').focus();$('formula').select();};
$('grid').onkeydown=e=>{
  if(e.ctrlKey||e.metaKey){if(e.key.toLowerCase()==='d'){e.preventDefault();const row=+addr.slice(1);if(row>1)change({[addr]:GridMath.shift(data[addr[0]+(row-1)]??'',0,1)});}else if(e.key.toLowerCase()==='z'){e.preventDefault();$('undo').click();}return;}
  const dirs={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowDown:[0,1],ArrowUp:[0,-1],Tab:[e.shiftKey?-1:1,0],Enter:[0,e.shiftKey?-1:1]};
  if(dirs[e.key]){e.preventDefault();move(...dirs[e.key]);return;}
  if(e.key==='F2'){e.preventDefault();$('formula').focus();return;}
  if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();change({[addr]:''});return;}
  if(e.key.length===1&&!e.altKey){e.preventDefault();$('formula').focus();$('formula').value=e.key;}
};
$('grid').oncopy=e=>{const raw=String(data[addr]??'');e.clipboardData.setData('text/plain',raw);e.clipboardData.setData('application/x-numerika',JSON.stringify({addr,raw}));clipboard={addr,raw};e.preventDefault();};
$('grid').onpaste=e=>{e.preventDefault();const raw=e.clipboardData.getData('text/plain').replace(/\r/g,'');const source=e.clipboardData.getData('application/x-numerika');
  if(source&&clipboard&&raw===clipboard.raw){change({[addr]:GridMath.shift(raw,cols.indexOf(addr[0])-cols.indexOf(clipboard.addr[0]),+addr.slice(1)-Number(clipboard.addr.slice(1)))});return;}
  const batch={};raw.replace(/\n$/,'').split('\n').slice(0,24).forEach((row,i)=>row.split('\t').slice(0,8).forEach((v,j)=>{const c=cols[cols.indexOf(addr[0])+j],r=Number(addr.slice(1))+i;if(c&&r<=24)batch[c+r]=v;}));change(batch);
};
$('formula').onkeydown=e=>{if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();commit();move(e.key==='Tab'?(e.shiftKey?-1:1):0,e.key==='Enter'?(e.shiftKey?-1:1):0);}
  if(e.key==='F4'){e.preventDefault();const input=e.target,pos=input.selectionEnd;const ref=/\$?([A-H])\$?(\d+)$/i.exec(input.value.slice(0,pos));if(ref){const [raw,col,row]=ref, forms=[col+row,'$'+col+'$'+row,col+'$'+row,'$'+col+row];input.setRangeText(forms[(forms.indexOf(raw)+1)%4],pos-raw.length,pos,'end');}}
  if(e.key==='Escape'){syncSelection();$('grid').focus();}
};
$('formula').onblur=commit;
$('fill').onclick=()=>{commit();const value=data[addr];if(!String(value??'').startsWith('=')){status('Ketik rumus pada sel aktif sebelum mengisi ke bawah.');return;}
  const batch={},r=+addr.slice(1);for(let j=r+1;j<=24;j++){const id=addr[0]+j;if(!(id in lesson.answers))break;batch[id]=GridMath.shift(value,0,j-r);}
  if(Object.keys(batch).length)change(batch);else status('Tidak ada sel latihan berurutan di bawah sel ini.');
};
$('undo').onclick=()=>{if(history.length){changes=saved.works[keyFor()]=history.pop();refreshAfterEdit();}};
$('check').onclick=()=>{
  commit();const expected=GridMath.sheet({...data,...lesson.answers}),refs=Object.keys(lesson.answers);let ok=0;const wrong=[];
  for(const r of refs){const a=read(r),b=expected(r);const pass=String(data[r]??'').startsWith('=')&&typeof a==='number'&&typeof b==='number'&&Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(b));feedback[r]=pass?'good':'bad';if(pass)ok++;else wrong.push(r);}
  if(!wrong.length)saved.passed[keyFor()]=true;else delete saved.passed[keyFor()];
  persist();updateNav();if(wrong.length)addr=wrong[0];render();status(wrong.length?ok+' / '+refs.length+' benar. '+(data[addr]?'Cek referensi dan operasi pada ':'Mulai dengan rumus di ')+addr+'.':'Selesai. Semua '+ok+' rumus benar. Pilih paket lain untuk mencoba angka baru.');
};
function modal(title){$('dialogTitle').textContent=title;$('dialogBody').replaceChildren();$('dialog').showModal();return $('dialogBody');}
$('close').onclick=()=>$('dialog').close();
$('search').onclick=()=>{const body=modal('Cari latihan'),input=document.createElement('input'),list=document.createElement('div');input.placeholder='Nama metode atau minggu';input.setAttribute('aria-label','Cari metode');body.append(input,list);
  const find=()=>{list.replaceChildren();const hit=lessons.filter(l=>(termOf(l)+' '+l.title+' '+l.group+' Week '+l.week).toLowerCase().includes(input.value.toLowerCase()));for(const l of hit){const b=document.createElement('button');b.className='result';b.textContent=l.title+' · '+termOf(l)+' · Week '+l.week;b.onclick=()=>selectLesson(l);list.append(b);}if(!hit.length)list.textContent='Latihan tidak ditemukan.';};input.oninput=find;find();input.focus();};
$('help').onclick=()=>{modal('Mengetik di lembar Excel').innerHTML='<p>Pilih sel ungu, ketik <code>=B3-B2</code>, lalu tekan Enter. Klik dua kali atau tekan F2 untuk menyunting rumus lama. Angka memakai titik desimal.</p><p>Tab dan tombol panah memindahkan pilihan. Ctrl+C dan Ctrl+V menyalin sel. Saat ditempel, referensi relatif bergeser. <code>$B$8</code> mengunci kolom dan baris.</p><p><b>Isi ke bawah</b> menyalin rumus aktif ke sel latihan berurutan di bawahnya. Ctrl+D menyalin dari satu sel di atas. Tempel blok dari Excel memakai Ctrl+V.</p><p>Gunakan operator + − * / ^, perbandingan, SUM, PRODUCT, IF, ABS, ROUND, MIN, MAX, SIN, COS, SQRT, EXP dan LN. Rentang seperti <code>SUM(B2:B6)</code> didukung. Pisahkan argumen dengan koma atau titik koma.</p><p><b>Ekspor Excel</b> menyimpan sel dan rumus saat ini. Di Excel, tab Latihan berisi lembar kerja dan tab Soal berisi instruksi.</p>';};
$('reset').onclick=()=>{const b=modal('Ulangi latihan ini?');b.innerHTML='<p>Jawaban pada metode dan mode aktif akan dikosongkan.</p><button class="primary">Ulangi latihan</button>';b.querySelector('button').onclick=()=>{saved.works[keyFor()]={};delete saved.passed[keyFor()];$('dialog').close();init();};};
$('export').onclick=()=>{commit();const blob=ExcelFile.build(lesson,data,mode==='guide'),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Numerika - '+lesson.title.replace(/[\\/]/g,'-')+'.xlsx';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);};
for(const m of ['guide','exam'])$(m).onclick=()=>{if(mode!==m){commit();mode=m;init();}};
for(const b of $('stages').children)b.onclick=()=>goStage(b.dataset.stage);
$('setChoice').onchange=e=>{commit();setIndex=Number(e.target.value);saved.sets[original.id]=setIndex;lesson=practiceSet(original,setIndex);exampleStep=0;inspectRow=lesson.plot.from;init();};
$('inspect').oninput=e=>{inspectRow=Number(e.target.value);drawChart();};
for(const t of ['steps','concept'])$(t).onclick=()=>{if(tab!==t){tab=t;coach();reveal($('coachBody'));}};
$('openNav').onclick=()=>drawer(true);$('closeNav').onclick=$('navShade').onclick=()=>drawer(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('dialog').open&&$('sidebar').classList.contains('open'))drawer(false);});
matchMedia('(max-width: 840px)').addEventListener('change',()=>drawer(false));
document.addEventListener('keydown',e=>{if(e.key==='/'&&!$('dialog').open&&document.activeElement!==$('formula')&&document.activeElement!==$('grid')){e.preventDefault();$('search').click();}});
function drawChart(){
  const cv=$('chart'),ctx=cv.getContext('2d'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h||!ctx)return;
  const dpr=window.devicePixelRatio||1;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx.scale(dpr,dpr);
  const p=lesson.plot,demo=stage!=='practice',value=demo?GridMath.sheet({...lesson.base,...lesson.answers}):read;
  const points=c=>{const a=[];for(let i=p.from;i<=p.to;i++){const x=value(p.x+i),y=value(c+i);if(Number.isFinite(x)&&Number.isFinite(y))a.push([x,y]);}return a;};
  const a=points(p.y),b=p.y2?points(p.y2):[],third=p.y3?points(p.y3):[];plotPoints=a;
  const labels={measure:'Acuan dan hasil ukur',round:'Galat potong dan bulat',error:'Galat per langkah',tolerance:'Galat dan toleransi',contribution:'Sumbangan galat energi',area:'Luas di bawah kurva',iter:'Riwayat iterasi'};
  $('chartName').textContent=(demo?'Contoh · ':'')+(labels[p.kind]||'Kurva data');
  const seriesNames=[p.y,p.y2,p.y3].filter(Boolean).map(c=>lesson.base[c+'1']);
  $('legend').textContent=seriesNames.join(' · ');
  if(demo)$('inspectLabel').textContent='Baris '+inspectRow+' · '+seriesNames.map((name,i)=>name+' = '+format(value([p.y,p.y2,p.y3][i]+inspectRow))).join(' · ');
  if(demo&&(lesson.group==='Akar persamaan'||lesson.id==='review5')){
    drawRootExample(ctx,w,h,value);plotPoints=[];return;
  }
  if(p.kind==='contribution'){
    const vals=[value('E2'),value('E3')],limit=Math.max(1,...vals.filter(Number.isFinite));
    vals.forEach((v,i)=>{const y=20+44*i;ctx.font='12px Poppins';ctx.fillStyle='#efebff';ctx.fillText((i?'Tinggi':'Massa')+' · '+(Number.isFinite(v)?format(v)+' J':'isi E'+(i+2)),12,y);if(Number.isFinite(v)){ctx.fillStyle=i?'#76dccd':'#c6b4ff';ctx.fillRect(12,y+8,(w-30)*v/limit,10);}});
    cv.setAttribute('aria-label','Sumbangan ketidakpastian energi, massa dan tinggi: '+vals.join(', ')+' joule');return;
  }
  if(!a.length){ctx.fillStyle='#d2ceea';ctx.font='13px Poppins, sans-serif';ctx.fillText('Isi kolom '+p.y+' untuk menggambar grafik.',12,h/2);return;}
  const xx=a.concat(b,third).map(t=>t[0]),yy=a.concat(b,third).map(t=>t[1]);let xmin=Math.min(...xx),xmax=Math.max(...xx),ymin=Math.min(...yy),ymax=Math.max(...yy);
  if(p.kind==='area')ymin=Math.min(0,ymin);if(xmax===xmin)xmax=xmin+1;if(ymax===ymin)ymax=ymin+1;
  const l=36,r=w-15,t=12,bot=h-24,sx=x=>l+(x-xmin)*(r-l)/(xmax-xmin),sy=y=>bot-(y-ymin)*(bot-t)/(ymax-ymin);
  ctx.font='10px Poppins, sans-serif';ctx.lineWidth=1;ctx.fillStyle='#c5c4db';ctx.strokeStyle='#42435c';
  for(let i=0;i<=4;i++){const y=t+i*(bot-t)/4;ctx.beginPath();ctx.moveTo(l,y);ctx.lineTo(r,y);ctx.stroke();ctx.fillText(String(Number((ymax-i*(ymax-ymin)/4).toFixed(2))),0,y+3);}
  for(let i=0;i<=4;i++){const x=l+i*(r-l)/4;ctx.beginPath();ctx.moveTo(x,t);ctx.lineTo(x,bot);ctx.stroke();ctx.fillText(String(Number((xmin+i*(xmax-xmin)/4).toFixed(2))),x-7,bot+15);}
  const path=pts=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(sx(x),sy(y)):ctx.moveTo(sx(x),sy(y)));};
  function series(pts,color){if(!pts.length)return;path(pts);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();for(const [x,y] of pts){ctx.beginPath();ctx.arc(sx(x),sy(y),3.5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}}
  if(p.kind==='area'){
    const span=lesson.id==='s13'?2:lesson.id==='s38'?3:1;
    ctx.save();ctx.beginPath();ctx.rect(l,t,r-l,bot-t);ctx.clip();
    for(let k=0;k+span<a.length;k+=span){
      const nodes=a.slice(k,k+span+1),left=nodes[0][0],right=nodes.at(-1)[0];
      if(new Set(nodes.map(v=>v[0])).size!==nodes.length)continue;
      const top=Array.from({length:25},(_,i)=>{const x=left+(right-left)*i/24;const y=nodes.reduce((s,[xi,yi],j)=>s+yi*nodes.reduce((v,[xk],m)=>j===m?v:v*(x-xk)/(xi-xk),1),0);return [x,y];});
      path(top);ctx.strokeStyle='#c6b4ff';ctx.stroke();ctx.lineTo(sx(right),sy(0));ctx.lineTo(sx(left),sy(0));ctx.closePath();ctx.fillStyle=(k/span)%2?'#8c82dc55':'#bba6fb77';ctx.fill();
    }ctx.restore();
  }
  if((p.kind==='inter'||p.kind==='deriv')&&a.length>1&&new Set(a.map(v=>v[0])).size===a.length){
    const curve=Array.from({length:100},(_,k)=>{const x=xmin+(xmax-xmin)*k/99;return [x,a.reduce((s,[xi,yi],i)=>s+yi*a.reduce((v,[xj],j)=>i===j?v:v*(x-xj)/(xi-xj),1),0)];});
    ctx.save();ctx.beginPath();ctx.rect(l,t,r-l,bot-t);ctx.clip();path(curve);ctx.strokeStyle='#c6b4ff';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    a.forEach(point=>series([point],'#c6b4ff'));
  }else if(p.kind==='area')a.forEach(point=>series([point],'#c6b4ff'));else series(a,'#c6b4ff');
  series(b,'#76dccd');series(third,'#f1b776');
  if(demo){const xy=a[inspectRow-p.from];if(xy){ctx.beginPath();ctx.arc(sx(xy[0]),sy(xy[1]),6,0,Math.PI*2);ctx.strokeStyle='white';ctx.stroke();}}
  if(p.target){const x=value(p.target),y=value(p.result);
    if(Number.isFinite(x)&&x>=xmin&&x<=xmax){ctx.strokeStyle='#76dccd';ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(sx(x),t);ctx.lineTo(sx(x),bot);ctx.stroke();ctx.setLineDash([]);
      if(p.kind==='inter'&&Number.isFinite(y)&&y>=ymin&&y<=ymax){ctx.fillStyle='#76dccd';ctx.beginPath();ctx.arc(sx(x),sy(y),5,0,2*Math.PI);ctx.fill();}
      if(p.kind==='deriv'&&Number.isFinite(y)&&a.length>1){const value=a.reduce((total,[xi,yi],i)=>total+yi*a.reduce((v,[xj],j)=>i===j?v:v*(x-xj)/(xi-xj),1),0);ctx.save();ctx.beginPath();ctx.rect(l,t,r-l,bot-t);ctx.clip();path([[xmin,value+y*(xmin-x)],[xmax,value+y*(xmax-x)]]);ctx.stroke();ctx.restore();}
    }
  }
  cv.setAttribute('aria-label',$('chartName').textContent+'. '+a.map(v=>v.join(', ')).join(' | '));
}
$('chart').onmousemove=e=>{if(!plotPoints.length)return;const cv=$('chart'),x=(e.offsetX-36)/Math.max(1,cv.clientWidth-51);const values=plotPoints.map(p=>p[0]);const goal=Math.min(...values)+x*(Math.max(...values)-Math.min(...values));const p=plotPoints.reduce((a,b)=>Math.abs(a[0]-goal)<Math.abs(b[0]-goal)?a:b);cv.title=p[0]+' · '+format(p[1]);};
init();document.fonts.ready.then(drawChart);window.addEventListener('resize',drawChart);

