// Short prediction prompts and a worked path through each method.
const studyNotes={
  error:['Perhatikan garis acuan dan tiga hasil ukur.','Jika tiga pengukuran berdekatan tetapi semuanya jauh dari acuan, apa yang tinggi?','Presisi','Akurasi','Jarak antarhasil menentukan presisi. Jarak setiap hasil ke acuan menentukan akurasi.','D2 E2 F2'],
  rounding:['Bandingkan dua galat untuk setiap bilangan.','Pada 0.000450, berapa digit signifikan?','3 digit','6 digit','Nol di depan 4 menunjukkan posisi desimal. Nol terakhir menyatakan ketelitian pengukuran.','D2 E2 F2 G2'],
  maclaurin:['Ikuti galat saat orde bertambah.','Apa yang ditambahkan dari orde 2 ke orde 3 untuk exp(x)?','x³/6','x³/3','Suku ketiga memakai 3! = 3 × 2 × 1 = 6.','B3 B4 B5 C5 D5'],
  propagate:['Bandingkan sumbangan massa dan tinggi pada ketidakpastian energi.','Jika ketidakpastian massa menjadi dua kali lipat, bagaimana sumbangan galat dari massa?','Dua kali lipat','Empat kali lipat','Untuk energi mgh, sumbangan dari massa adalah |gh| × Δm.','D2 E2 E3 B7 B8'],
  stop:['Cari saat kurva galat turun melewati toleransi.','Untuk galat relatif pendekatan, apa penyebutnya?','Besar taksiran baru','Besar taksiran lama','Perubahan diukur relatif terhadap nilai iterasi terbaru.','D2 E2 F2 F4'],
  Biseksi:['Ikuti taksiran tengah tiap selang.','Untuk fungsi kontinu, bagian mana yang dipertahankan setelah membagi selang?','Bagian dengan perubahan tanda','Bagian dengan nilai x terbesar','Jika tanda fungsi pada dua ujung berbeda, sedikitnya satu akar berada di antaranya.','D2 B3 C3 D3'],
  'Regula falsi':['Amati taksiran akar dari dua ujung selang.','Apa yang menentukan taksiran baru?','Potongan garis sekan dengan sumbu x','Titik tengah selang','Hubungkan dua nilai fungsi. Letak potongan garis dengan sumbu x menggunakan informasi kedua tingginya.','D2 B3 C3 D3'],
  Secant:['Ikuti perubahan titik potong garis sekan.','Pasangan mana yang dipakai pada langkah berikutnya?','Dua taksiran terbaru','Dua batas awal selamanya','Garis sekan diperbarui dari dua taksiran terakhir.','D2 B3 C3 D3'],
  'Newton–Raphson':['Amati cara nilai x bergerak menuju akar.','Apa yang terjadi bila turunan di tebakan sama dengan nol?','Langkah Newton tidak terdefinisi','Akar pasti sudah ditemukan','Rumus membagi f(x) dengan turunannya. Garis singgung mendatar tidak memberi potongan unik dengan sumbu x.','C2 B3 C3'],
  'Titik tetap':['Ikuti urutan x baru = g(x lama).','Apa yang terjadi tepat di titik tetap?','g(x) sama dengan x','g(x) selalu nol','Di titik tetap, pembaruan mengembalikan angka yang sama.','C2 B3 C3'],
  review5:['Perhatikan batas galat setelah tiap pembagian selang.','Jika lebar selang menjadi setengah, bagaimana batas galat titik tengah?','Turun menjadi setengah','Tetap sama','Akar terletak di dalam selang, sehingga jarak dari tengah paling besar setengah lebar selang.','D2 E2 F2 F3'],
  jacobi:['Bandingkan pembaruan nilai tiap variabel.','Untuk y baru pada Jacobi, nilai x mana yang dipakai?','x dari baris sebelumnya','x yang baru dihitung','Seluruh komponen pada iterasi Jacobi membaca tebakan yang sama.','B3 C3 B4'],
  gs:['Bandingkan pembaruan nilai tiap variabel.','Untuk y baru pada Gauss–Seidel, nilai x mana yang dipakai?','x terbaru pada baris ini','x dari baris sebelumnya','Setelah sebuah komponen diperbarui, nilainya langsung dipakai untuk komponen berikutnya.','B3 C3 B4'],
  fixed:['Amati apakah kedua taksiran mulai menetap.','Untuk iterasi satu titik pada soal ini, kedua rumus membaca baris mana?','Baris sebelumnya','Baris berikutnya','Pasangan baru dihitung dari pasangan lama yang sama.','B3 C3 B4'],
  newton:['Ikuti koreksi pada x dan y.','Apa yang ada di dalam matriks Jacobian?','Turunan parsial tiap persamaan','Nilai akar di semua titik','Jacobian menyatakan perubahan lokal kedua persamaan terhadap kedua variabel.','D2 E2 F2 B3 C3'],
  'greg-back':['Perhatikan ujung kanan tabel dan posisi target.','Untuk Gregory mundur, s diukur dari titik mana?','Titik terakhir','Titik pertama','Acuan mundur adalah x terakhir. Susun koefisien dari beda pada baris terakhir.','C3 D4 B9 B10 B11'],
  'greg-forward':['Perhatikan ujung kiri tabel dan posisi target.','Untuk Gregory maju, koefisien beda diambil dari baris mana?','Baris pertama tabel beda','Baris terakhir tabel beda','Titik acuannya x pertama dan faktor berikutnya s−1, s−2, dan seterusnya.','C2 D2 B9 B10 B11'],
  lag:['Ikuti kurva yang melewati semua titik data.','Berapa jumlah seluruh bobot Lagrange di x target?','1','0','Fungsi konstan 1 diwakili tepat oleh interpolasi. Karena itu jumlah bobotnya satu.','C2 D2 D3 B7'],
  'lag-d':['Bandingkan kurva dengan garis singgung di target.','Apa yang diwakili kemiringan garis singgung?','Turunan pertama','Nilai fungsi','Kemiringan menyatakan laju perubahan nilai fungsi terhadap x.','C2 C3 D3 B7'],
  derivative:['Perhatikan kemiringan garis singgung di x target.','Setelah menurunkan terhadap s, apa langkah untuk memperoleh turunan terhadap x?','Bagi dengan h','Kalikan dengan h','Aturan rantai memberi ds/dx = 1/h.','B8 B9 B10'],
  trap:['Lihat luasan di antara dua sampel bertetangga.','Apa bentuk pendekatan di antara dua titik?','Garis lurus','Kurva kubik','Dua tinggi di ujung segmen membentuk trapesium dengan lebar h.','B2 D2 B10 B11 B13'],
  s13:['Setiap dua segmen membentuk satu bagian luas.','Berapa kelipatan jumlah segmen untuk Simpson 1/3?','2','3','Satu panel kuadratik menggunakan tiga titik atau dua segmen.','B2 D3 B10 B11 B13'],
  s38:['Setiap tiga segmen membentuk satu bagian luas.','Berapa titik untuk satu panel Simpson 3/8?','4','3','Empat titik membatasi tiga segmen sama lebar untuk pendekatan kubik.','B2 D3 B10 B11 B13'],
  mixed:['Lihat perubahan jarak antartitik di x=7.','Di mana integral perlu dibagi sebelum memakai rumus komposit?','Di x=7','Di x=13','Langkah berubah dari 1 menjadi 2 setelah x=7. Hitung tiap bagian menggunakan lebarnya sendiri.','B17 C17 B18 C19 C20']
};
function noteFor(id){
  if(id==='gs3'||id==='jacobi3'){const n=[...studyNotes[id.slice(0,-1)]];n[5]='B3 C3 D3 E3';return n;}
  return studyNotes[id]||studyNotes.derivative;
}
function studyElement(tag,text,cls){
  const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;
}
function studyButton(text,action,cls='btn'){const b=studyElement('button',text,cls);b.onclick=action;return b;}
function updateStudy(){
  const note=noteFor(lesson.id),practicing=stage==='practice',example=stage==='example';
  const panel=$('studyPanel');panel.replaceChildren();panel.hidden=practicing;
  document.querySelector('.work').hidden=!practicing;$('reset').hidden=!practicing;
  for(const b of $('stages').children)b.setAttribute('aria-pressed',String(b.dataset.stage===stage));
  $('taskLabel').textContent=practicing?'Soal latihan':example?'Contoh pengerjaan':'Pahami konsep';
  $('task').textContent=practicing?lesson.task:example?lesson.task:lesson.concept;
  $('inspectWrap').hidden=practicing;
  if(practicing)return;
  const {from,to}=lesson.plot;
  $('inspect').min=from;$('inspect').max=to;$('inspect').value=inspectRow;
  if(!example){
    panel.append(studyElement('h2',note[0]),studyElement('p',note[1]));
    const choices=studyElement('div',undefined,'choices'),explain=studyElement('p','');explain.setAttribute('role','status');
    const order=(lesson.id.length+setIndex)%2?[2,3]:[3,2];
    for(const n of order)choices.append(studyButton(note[n],()=>{explain.textContent=(n===2?'Benar. ':'Perhatikan lagi. ')+note[4];}));
    panel.append(choices,explain,studyButton('Lihat contoh hitung',()=>goStage('example'),'primary'));return;
  }
  const refs=note[5].split(' '),ref=refs[exampleStep],formula=lesson.answers[ref];
  const solved=GridMath.sheet({...lesson.base,...lesson.answers});
  const inputs=[...new Set(formula.match(/\$?[A-H]\$?\d+/g)||[])];
  const label=typeof lesson.base['A'+ref.slice(1)]==='string'&&ref[0]==='B'?lesson.base['A'+ref.slice(1)]:lesson.base[ref[0]+'1'];
  panel.append(studyElement('h2','Contoh '+(exampleStep+1)+' dari '+refs.length+' · '+(label||ref)),studyElement('p','Ikuti angka dari sel asal sampai ke hasil di '+ref+'.'));
  const flow=studyElement('div',undefined,'calcFlow');
  for(const [label,value] of [['Nilai sel asal',inputs.map(k=>k+' = '+format(solved(k))).join('   ·   ')],['Rumus Excel',formula],['Hasil '+ref,String(format(solved(ref)))]]){const tile=studyElement('div');tile.append(studyElement('small',label),studyElement('code',value));flow.append(tile);}
  if(!formula.includes(':')&&formula.length<=75){
    const numbers=formula.slice(1).replace(/\$?[A-H]\$?\d+/g,k=>{const n=solved(k);return n<0?'('+format(n)+')':String(format(n));});
    const line=studyElement('p','Dengan angkanya: ');line.append(studyElement('code',numbers+' ≈ '+format(solved(ref))));panel.append(flow,line);
  }else panel.append(flow);
  const bar=studyElement('div',undefined,'choices');
  const prev=studyButton('Sebelumnya',()=>showExample(exampleStep-1));prev.disabled=exampleStep===0;bar.append(prev);
  if(exampleStep<refs.length-1)bar.append(studyButton('Langkah berikutnya',()=>showExample(exampleStep+1)));
  bar.append(studyButton('Coba di lembar Excel',()=>goStage('practice'),'primary'));panel.append(bar);
}
function showExample(index){
  exampleStep=index;const ref=noteFor(lesson.id)[5].split(' ')[index];
  inspectRow=Math.min(lesson.plot.to,Math.max(lesson.plot.from,Number(ref.slice(1))));updateStudy();drawChart();
}
function goStage(next){
  if(stage==='practice')commit();
  stage=next;if(next==='example'){showExample(0);}else{updateStudy();drawChart();}
  if(next==='practice'){$('grid').focus({preventScroll:true});}
}
function drawRootExample(ctx,w,h,value){
  const id=lesson.id,r=inspectRow,c=id==='review5'?value('B9'):[2,3,5][setIndex];
  const fixed=id==='Titik tetap',newton=id==='Newton–Raphson';
  const lo=value('B'+r),other=value('C'+r),next=fixed||newton?other:value('D'+r);
  function f(x){
    if(id==='review5')return x**3-x-c;
    if(setIndex===1){if(fixed)return Math.sqrt(x)+Math.sin(x);if(newton)return x-Math.sqrt(x)-Math.sin(x);return x**3+5*x*x-10;}
    return fixed?(x+c/x)/2:x*x-c;
  }
  const left=Math.min(value('B2'),next,lo)*.85,right=Math.max(value('B2')+1,next,lo,fixed||newton?0:other)*1.06;
  const bottom=Math.min(0,f(left)),top=Math.max(f(right),fixed?right:0,1);
  const X=x=>22+(w-42)*(x-left)/(right-left),Y=y=>h-24-(h-36)*(y-bottom)/(top-bottom);
  function line(coords,color,width=1.5){
    ctx.beginPath();coords.forEach(([x,y],i)=>i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  line([[left,0],[right,0]],'#9a98b0');
  line(Array.from({length:90},(_,i)=>{const x=left+i*(right-left)/89;return [x,f(x)];}),'#c6b4ff',2.5);
  if(fixed){line([[left,left],[right,right]],'#76dccd');line([[lo,lo],[lo,next],[next,next]],'#f1b776',2);}
  else if(id==='Biseksi'||id==='review5'){line([[lo,0],[other,0]],'#76dccd',5);line([[next,0],[next,f(next)]],'#f1b776',2);}
  else if(newton)line([[lo,f(lo)],[next,0]],'#76dccd',2);
  else line([[lo,f(lo)],[other,f(other)],[next,0]],'#76dccd',2);
  ctx.fillStyle='#ffd49c';ctx.beginPath();ctx.arc(X(next),Y(fixed?next:0),4,0,2*Math.PI);ctx.fill();
  ctx.font='11px Poppins';ctx.fillStyle='#eae6ff';ctx.fillText('x = '+format(next),Math.min(w-100,Math.max(4,X(next)-30)),h-5);
  $('chartName').textContent=fixed?'Titik tetap · y=g(x) dan y=x':'Mencari perpotongan dengan sumbu x';
  $('legend').textContent=fixed?'Kurva dan diagonal':newton?'Kurva dan garis singgung':id==='Biseksi'||id==='review5'?'Kurva dan selang':'Kurva dan garis sekan';
  $('inspectLabel').textContent='Iterasi '+(r-1)+' · '+(fixed||newton?'x lama '+format(lo):'Dua titik '+format(lo)+' dan '+format(other))+' · Taksiran '+format(next);
  $('chart').setAttribute('aria-label',$('legend').textContent+'. '+$('inspectLabel').textContent);
}
