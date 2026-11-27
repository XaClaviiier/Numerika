// New material follows the same spreadsheet contract as the original workbooks.
function uts(id,title,week,task,concept,headers,rows,answers,plot,source){
  const base={};
  [headers,...rows].forEach((row,i)=>row.forEach((v,j)=>{base[GridMath.cols[j]+(i+1)]=v;}));
  return {id,title,week,group:week===1?'Dasar metode numerik':week===5?'Pengayaan akar':'Sistem linier',task,concept,base,answers,plot,source,rows:rows.length+1};
}
function foundations(v){
  const list=[], source='Week 1 · Pendahuluan dan latihan kesalahan pendekatan';
  const add=(...args)=>list.push(uts(args[0],args[1],1,...args.slice(2),source));
  const actual=[12.5,20,8][v],approx=[12.3,19.6,7.85][v];
  add('error','Akurasi dan galat','Bandingkan tiga pengukuran terhadap panjang acuan. Hitung selisih bertanda, jarak mutlak, dan persentasenya.',
    'Akurasi menjawab “seberapa dekat dengan acuan?”. Presisi menjawab “seberapa rapat hasil pengukuran berulang?”. Hasil bisa berdekatan tetapi sama-sama jauh dari acuan. Galat mutlak adalah jarak, sedangkan galat relatif membandingkan jarak itu dengan nilai sejati.',
    ['Ukur ke','Acuan (cm)','Ukur (cm)','Selisih','Galat mutlak','Galat (%)'],[[1,actual,approx],[2,actual,approx+.02],[3,actual,approx-.01]],
    Object.fromEntries([2,3,4].flatMap(r=>[['D'+r,'=B'+r+'-C'+r],['E'+r,'=ABS(D'+r+')'],['F'+r,'=E'+r+'/ABS(B'+r+')*100']])),
    {x:'A',y:'B',y2:'C',from:2,to:4,kind:'measure'});
  add('rounding','Angka signifikan dan pembulatan','Potong dan bulatkan ketiga nilai sesuai kolom desimal. Bandingkan jarak setiap hasil dari nilai awal.',
    'Pada 0.000450, digit 4, 5, dan nol terakhir menyatakan tiga angka signifikan. Angka desimal menghitung posisi setelah titik. TRUNC membuang digit sisanya. ROUND melihat digit berikutnya. Untuk kasus tepat separuh, slide memakai aturan genap terdekat. Data latihan ini menghindari kasus seri.',
    ['Nomor','Nilai awal','Desimal','Potong','Bulatkan','Galat potong','Galat bulat'],[3.14159265,2.71828183,1.41421356].map((x,i)=>[i+1,x,4-v]),
    Object.fromEntries([2,3,4].flatMap(r=>[['D'+r,'=TRUNC(B'+r+',C'+r+')'],['E'+r,'=ROUND(B'+r+',C'+r+')'],['F'+r,'=ABS(B'+r+'-D'+r+')'],['G'+r,'=ABS(B'+r+'-E'+r+')']])),
    {x:'A',y:'F',y2:'G',from:2,to:4,kind:'round'});
  const x=[.2,.5,.8][v],series={};
  for(let r=2;r<=5;r++){
    series['B'+r]=r===2?'=$B$7^0':'=B'+(r-1)+'*$B$7/A'+r;
    series['C'+r]=r===2?'=B2':'=C'+(r-1)+'+B'+r;
    series['D'+r]='=ABS(EXP($B$7)-C'+r+')';
  }
  add('maclaurin','Deret Maclaurin','Dekati exp('+x+') sampai orde 3. Tambahkan satu suku per baris dan amati perubahan galat.',
    'Mulai dengan 1, lalu tambahkan x, x²/2, dan x³/6. Jarak dari jumlah sementara ke exp(x) adalah galat pemotongan. Grafik menunjukkan apa yang terjadi saat satu suku lagi disertakan.',
    ['Orde','Suku baru','Jumlah','Galat mutlak'],[[0],[1],[2],[3],[],['x',x]],series,{x:'A',y:'D',from:2,to:5,kind:'error'});
  add('propagate','Propagasi galat','Perkirakan energi potensial mgh. Hitung sumbangan ketidakpastian massa dan tinggi dengan pendekatan orde pertama.',
    'Perubahan kecil pada massa atau tinggi mengubah energi. Kalikan sensitivitas terhadap setiap masukan dengan ketidakpastiannya. Jumlahkan kedua sumbangan mutlak untuk memperkirakan galat maksimum orde pertama.',
    ['Sumber','Nilai','± ukur','Sensitivitas','± energi'],[['Massa (kg)',[10,8,5][v],.2],['Tinggi (m)',[5,4,2][v],.1],['g (m/s²)',9.81],[],['Energi (J)'],['± energi (J)'],['Relatif (%)']],
    {D2:'=B4*B3',E2:'=ABS(D2*C2)',D3:'=B4*B2',E3:'=ABS(D3*C3)',B6:'=B2*B3*B4',B7:'=SUM(E2:E3)',B8:'=B7/ABS(B6)*100'},
    {x:'B',y:'E',from:2,to:3,kind:'contribution'});
  const scale=[1,2,.5][v];
  add('stop','Kapan iterasi berhenti?','Hitung perubahan relatif setiap pasangan iterasi. Isi 1 untuk berhenti dan 0 untuk lanjut.',
    'Ketika nilai sejati belum diketahui, ukur perubahan dari taksiran lama ke yang baru. Bagi dengan besar taksiran baru. Untuk n digit signifikan, bandingkan persentasenya dengan 0.5 × 10^(2−n)%.',
    ['k','Lama','Baru','Galat (%)','Toleransi (%)','Berhenti?'],[[1,2.4*scale,2.4512*scale],[2,2.4512*scale,2.4515*scale],[3,2.4515*scale,2.45151*scale],[],['Digit',[4,3,2][v]]],
    Object.fromEntries([2,3,4].flatMap(r=>[['D'+r,'=ABS((C'+r+'-B'+r+')/C'+r+')*100'],['E'+r,'=0.5*10^(2-$B$6)'],['F'+r,'=IF(D'+r+'<E'+r+',1,0)']])),
    {x:'A',y:'D',y2:'E',from:2,to:4,kind:'tolerance'});
  return list;
}
function reviewRoot(v){
  const c=[2,2.5,3][v],rows=[[1,1,2]],a={},f=x=>'('+x+'^3-'+x+'-$B$9)';
  for(let r=2;r<=6;r++){
    const p=r-1;if(r>2){rows.push([r-1]);a['B'+r]='=IF('+f('B'+p)+'*E'+p+'<=0,B'+p+',D'+p+')';a['C'+r]='=IF('+f('B'+p)+'*E'+p+'<=0,D'+p+',C'+p+')';}
    a['D'+r]='=(B'+r+'+C'+r+')/2';a['E'+r]='='+f('D'+r);a['F'+r]='=(C'+r+'-B'+r+')/2';
  }
  rows.push([],[],['Parameter c',c]);
  return uts('review5','Biseksi dan batas galat',5,'Persempit selang [1,2] untuk f(x)=x³−x−'+c+'. Hitung titik tengah, residu, dan batas jarak ke akar selama lima iterasi.',
    'Untuk fungsi kontinu yang berganti tanda, akar berada di dalam selang. Dari titik tengah, jarak terjauh ke akar adalah setengah lebar selang. Residu mengukur tinggi kurva, sedangkan batas galat mengukur jarak mendatar.',
    ['Iterasi','Bawah','Atas','Tengah','Residu','Batas galat'],rows,a,{x:'A',y:'F',from:2,to:6,kind:'error'},'Week 5 · Pengayaan dari biseksi Week 2 dan latihan essay');
}
function spl3(gs,v){
  const rhs=[[-1,2,3],[2,5,-1],[5,1,4]][v],rows=[[0,0,0,0]],a={};
  for(let r=3;r<=12;r++){
    rows.push([r-2]);const p=r-1,u=gs?r:p;
    a['B'+r]='=($B$14+2*C'+p+'-3*D'+p+')/5';
    a['C'+r]='=($C$14+3*B'+u+'-D'+p+')/9';
    a['D'+r]='=($D$14-2*B'+u+'+C'+u+')/(-7)';
    a['E'+r]='=MAX(ABS(5*B'+r+'-2*C'+r+'+3*D'+r+'-$B$14),ABS(-3*B'+r+'+9*C'+r+'+D'+r+'-$C$14),ABS(2*B'+r+'-C'+r+'-7*D'+r+'-$D$14))';
  }
  rows.push([],['Ruas kanan',...rhs]);
  return uts(gs?'gs3':'jacobi3',(gs?'Gauss–Seidel':'Jacobi')+' tiga variabel','6–7',
    'Selesaikan 5x−2y+3z='+rhs[0]+', −3x+9y+z='+rhs[1]+' dan 2x−y−7z='+rhs[2]+'. Mulai dari nol, lalu periksa residu terbesar setelah tiap iterasi.',
    (gs?'Pakai x baru saat mencari y, lalu pakai x dan y baru saat mencari z.':'Gunakan x, y, z dari baris sebelumnya untuk ketiga pembaruan.')+' Masukkan hasil ke ketiga persamaan awal. Residu terbesar menunjukkan seberapa jauh persamaan yang paling meleset.',
    ['k','x','y','z','Maks |residu|'],rows,a,{x:'A',y:'B',y2:'C',from:2,to:12,kind:'iter'},'Week 6–7 · Workbook Jacobi–Gauss');
}
function termOf(l){return parseInt(l.week,10)<=7?'UTS':'UAS';}
function practiceSet(original,v){
  if(!v)return original;
  if(original.week===1)return foundations(v).find(l=>l.id===original.id);
  if(original.id==='review5')return reviewRoot(v);
  if(['gs3','jacobi3'].includes(original.id))return spl3(original.id==='gs3',v);
  const l={...original,base:{...original.base},answers:{...original.answers}},b=l.base,id=l.id;
  if(l.group==='Akar persamaan'){
    if(v===1){
      const week4=l.week===4;
      const f=x=>week4?'('+x+'-SQRT('+x+')-SIN('+x+'))':'('+x+'^3+5*'+x+'^2-10)';
      b.B2=week4?2:1;
      for(const [ref,old] of Object.entries(l.answers)){
        const r=Number(ref.slice(1)),col=ref[0],bx='B'+r,cx='C'+r;
        let formula=old.replace(/\(([BCD]\d+)\^2-2\)/g,(_,x)=>f(x));
        if(id==='Secant'&&col==='D')formula='=IF('+f(bx)+'='+f(cx)+','+cx+','+formula.slice(1)+')';
        if(week4&&col==='C')formula=id==='Titik tetap'?'=SQRT('+bx+')+SIN('+bx+')':'='+bx+'-'+f(bx)+'/(1-1/(2*SQRT('+bx+'))-COS('+bx+'))';
        l.answers[ref]=formula;
      }
      l.task=week4?'Cari akar x−√x−sin(x)=0 dari x awal 2. Gunakan radian dan hitung taksiran setiap baris.':'Cari akar x³+5x²−10=0 dari dua titik awal 1 dan 2. Hitung taksiran setiap baris.';
      if(id==='Titik tetap')l.concept='Pakai g(x)=√x+sin(x). Pada grafik, ikuti garis dari tebakan ke kurva g, lalu kembali ke diagonal y=x. Di sekitar akar, |g′(x)|<1 membantu iterasi mendekat.';
      if(id==='Newton–Raphson')l.concept='Taksiran baru adalah potongan garis singgung dengan sumbu x. Gunakan turunan 1−1/(2√x)−cos(x), lalu hitung x−f(x)/f′(x).';
      l.source='Week '+l.week+' · Contoh pada slide kuliah';return l;
    }
    const c=v===1?3:5,lo=v===1?1:2;b.B2=lo;if(b.C2!==undefined)b.C2=lo+1;
    for(const [ref,formula] of Object.entries(l.answers)){
      let next=formula.replaceAll('^2-2','^2-'+c);
      if(id==='Titik tetap')next=next.replace('+2/','+'+c+'/');
      if(id==='Secant'&&ref[0]==='D'){const r=ref.slice(1);next='=IF(B'+r+'=C'+r+',C'+r+','+next.slice(1)+')';}
      l.answers[ref]=next;
    }
    l.task=l.task.replace('x²−2','x²−'+c);l.concept=l.concept.replace('x+2/x','x+'+c+'/x');
  }else if(l.group==='Sistem nonlinier'||['gs','jacobi'].includes(id)){
    b.B2=v===1?1:.5;b.C2=v===1?.1:.3;l.task=l.task.replace(/dari \([^)]*\)/,'dari ('+b.B2+', '+b.C2+')');
  }else if(l.plot.kind==='inter'||l.plot.kind==='deriv'){
    for(let r=l.plot.from;r<=l.plot.to;r++)b['B'+r]=Number((b['B'+r]+v*(r-1)**2/2).toFixed(5));
    if(id==='lag')l.task='Taksir f(3) dari ketiga titik pada tabel. Hitung bobot tiap titik dan jumlahkan kontribusinya.';
  }else if(id==='mixed'){
    const k=v+1;for(let r=2;r<=14;r++)b['B'+r]=Number((k*b['B'+r]).toFixed(5));
    b.B21=Number((k*b.B21).toFixed(5));l.task=l.task.replace('data x exp','data '+k+'x exp');
  }else if(l.group==='Integral numerik'){
    const start=v===1?1:2,end=v===1?3:5;
    for(let j=0;j<=6;j++)b['A'+(j+2)]=start+j*(end-start)/6;
    const F=x=>x**3*(Math.log(2*x)/3-1/9);
    b.B12=Number((F(end)-F(start)).toFixed(5));l.task=l.task.replace('[1,4]','['+start+','+end+']');
  }
  l.source+=' · Variasi latihan';return l;
}
lessons.push(...foundations(0),reviewRoot(0),spl3(false,0),spl3(true,0));
for(const l of lessons.filter(l=>l.group==='Akar persamaan')){
  l.source='Week '+l.week+' · Latihan dasar dari '+({2:'slide biseksi',3:'slide regula falsi dan secant',4:'slide titik tetap dan Newton–Raphson'})[l.week];
}
lessons.sort((a,b)=>parseInt(a.week,10)-parseInt(b.week,10));
