const lessons = (() => {
  const list=[];
  function add(id,title,group,week,task,concept,headers,rows,answers,plot,source){
    const base={};[headers,...rows].forEach((row,i)=>row.forEach((v,j)=>{if(v!==null && v!=='')base[GridMath.cols[j]+(i+1)]=v;}));
    list.push({id,title,group,week,task,concept,base,answers,plot,source,rows:Math.max(rows.length+1,...Object.keys(answers).map(r=>+r.slice(1)))});
  }
  const inter='Interpolasi', integ='Integral numerik', deriv='Turunan numerik',sys='Sistem nonlinier';
  function gregory(back){
    const a={},rows=[[90,30],[100,41],[110,49],[120,55],[130,68],[],['Target x',121],['h'],['s'],['f(121)']];
    for(let j=2;j<=5;j++)for(let i=2;i<=6;i++){
      if(back?i<j+1:i>7-j)continue;
      const p=GridMath.cols[j-1];a[GridMath.cols[j]+i]=back?'='+p+i+'-'+p+(i-1):'='+p+(i+1)+'-'+p+i;
    }
    const r=back?6:2,sign=back?'+':'-';
    a.B9='=A3-A2';a.B10='=(B8-A'+r+')/B9';
    a.B11='=B'+r+'+B10*C'+r+'+B10*(B10'+sign+'1)*D'+r+'/2+B10*(B10'+sign+'1)*(B10'+sign+'2)*E'+r+'/6+B10*(B10'+sign+'1)*(B10'+sign+'2)*(B10'+sign+'3)*F'+r+'/24';
    add('greg-'+(back?'back':'forward'),'Newton–Gregory '+(back?'mundur':'maju'),inter,9,'Taksir f(121) dari lima titik. Susun tabel beda sampai orde empat, lalu hitung h, s, dan nilai interpolasi.',
      'Jarak x seragam. Kurangkan dua nilai bertetangga, lalu ulangi pada kolom berikutnya. '+(back?'Mulai polinom dari baris terakhir. Gunakan s=(x−xₙ)/h dengan faktor s, s+1, s+2.':'Mulai polinom dari baris pertama. Gunakan s=(x−x₀)/h dengan faktor s, s−1, s−2.'),['x','f(x)','Beda 1','Beda 2','Beda 3','Beda 4'],rows,a,{x:'A',y:'B',from:2,to:6,kind:'inter',target:'B8',result:'B11'},'Week 9 · Kuis interpolasi');
  }
  gregory(true);gregory(false);
  function lagrange(d){
    const ans={};
    for(let i=2;i<=4;i++){
      const [j,k]=[2,3,4].filter(n=>n!==i);
      const den='((A'+i+'-A'+j+')*(A'+i+'-A'+k+'))';
      ans['C'+i]=d?'=(2*$B$6-A'+j+'-A'+k+')/'+den:'=($B$6-A'+j+')*($B$6-A'+k+')/'+den;
      ans['D'+i]='=B'+i+'*C'+i;
    }ans.B7='=SUM(D2:D4)';
    add(d?'lag-d':'lag',d?'Turunan Lagrange':'Lagrange',d?deriv:inter,d?11:10,d?'Hitung turunan pertama pada x=3. Susun turunan ketiga basis Lagrange, lalu jumlahkan kontribusinya.':'Taksir f(3) dari titik (1,2), (2,5), dan (4,11). Isi bobot tiap titik dan jumlahkan kontribusinya.',
      d?'Untuk tiga titik, turunan pembilang (x−xⱼ)(x−xₖ) ialah 2x−xⱼ−xₖ. Penyebutnya konstan. Jumlahkan yᵢL′ᵢ.':'Setiap Lᵢ adalah hasil kali (x−xⱼ)/(xᵢ−xⱼ) untuk semua j selain i. Ketiga bobot berjumlah satu. Kunci sel target memakai $B$6.',
      ['x','f(x)',d?'L′ᵢ':'Lᵢ','Kontribusi'],[[1,2],[2,5],[4,11],[],['Target x',3],[d?'Turunan':'f(3)']],ans,{x:'A',y:'B',from:2,to:4,kind:d?'deriv':'inter',target:'B6',result:'B7'},'Week '+(d?'11':'10')+' · Latihan basis Lagrange');
  }lagrange(false);lagrange(true);
  for(const back of [false,true]){
    const n=back?5:2,sg=back?'+':'-',a={},data=[[-2,2.6],[3,1.3],[8,4],[13,5.9],[],['Target x',back?12:-1],['h'],['s'],['Turunan']];
    for(let j=2;j<=4;j++)for(let i=2;i<=5;i++){if(back?i<j+1:i>6-j)continue;const p=GridMath.cols[j-1];a[GridMath.cols[j]+i]=back?'='+p+i+'-'+p+(i-1):'='+p+(i+1)+'-'+p+i;}
    a.B8='=A3-A2';a.B9='=(B7-A'+n+')/B8';a.B10='=(C'+n+'+(2*B9'+sg+'1)*D'+n+'/2+(3*B9^2'+sg+'6*B9+2)*E'+n+'/6)/B8';
    add('der-'+n,'Turunan Gregory '+(back?'mundur':'maju'),deriv,11,'Hitung turunan pertama pada x='+(back?'12':'−1')+' dengan Gregory orde tiga. Lengkapi tabel beda, h, s, dan turunan.','Turunkan polinom Gregory terhadap s. Karena s=(x−x acuan)/h, kalikan hasil turunan terhadap s dengan 1/h.',['x','f(x)','Beda 1','Beda 2','Beda 3'],data,a,{x:'A',y:'B',from:2,to:5,kind:'deriv',target:'B7',result:'B10'},'Week 11 · Data contoh turunan');
  }
  for(const method of ['Trapesium','Simpson 1/3','Simpson 3/8']){
    const trap=method==='Trapesium',third=method==='Simpson 1/3';
    const weights=trap?[1,2,2,2,2,2,1]:third?[1,4,2,4,2,4,1]:[1,3,3,2,3,3,1];
    const rows=weights.map((w,i)=>[1+i*.5,null,w]);rows.push([],['h'],['Integral'],['I eksak',37.13037],['Galat %']);
    const a={};for(let i=2;i<=8;i++){a['B'+i]='=A'+i+'^2*LN(2*A'+i+')';a['D'+i]='=B'+i+'*C'+i;}
    a.B10='=A3-A2';a.B11='='+ (trap?'B10/2':third?'B10/3':'3*B10/8')+'*SUM(D2:D8)';a.B13='=ABS((B12-B11)/B12)*100';
    add(trap?'trap':third?'s13':'s38',method,integ,'13–14','Aproksimasi integral x² ln(2x) pada [1,4] dengan enam segmen. Hitung nilai fungsi, kontribusi berbobot, integral, dan galat relatif (%).',
      (trap?'Hubungkan tiap dua titik dengan garis dan jumlahkan luas trapesium. Faktor akhirnya h/2.':third?'Pasangkan dua segmen untuk interpolasi kuadratik. Jumlah segmen harus genap. Faktor akhirnya h/3.':'Kelompokkan tiga segmen untuk interpolasi kubik. Jumlah segmen harus kelipatan tiga. Faktor akhirnya 3h/8.')+' Jika h berubah, pisahkan bagian yang seragam sebelum menjumlahkan.', ['x','f(x)','Bobot','Bobot × f'],rows,a,{x:'A',y:'B',from:2,to:8,kind:'area'},'Week 13–14 · Kuis integral komposit');
  }
  for(const newton of [false,true]){
    const rows=[[0,2,.25]],a={};
    for(let i=3;i<=12;i++){const p=i-1;rows.push([i-2]);
      if(newton){
        a['D'+p]='=B'+p+'^2-8*B'+p+'-C'+p+'+0.5';a['E'+p]='=B'+p+'^2+2*C'+p+'^2-6*C'+p+'-4';
        a['F'+p]='=(2*B'+p+'-8)*(4*C'+p+'-6)+2*B'+p;
        a['B'+i]='=B'+p+'-((4*C'+p+'-6)*D'+p+'+E'+p+')/F'+p;
        a['C'+i]='=C'+p+'-((2*B'+p+'-8)*E'+p+'-2*B'+p+'*D'+p+')/F'+p;
      }else{a['B'+i]='=(B'+p+'^2-C'+p+'+0.5)/8';a['C'+i]='=(B'+p+'^2+2*C'+p+'^2-4)/6';}
    }
    add(newton?'newton':'fixed',newton?'Newton & Jacobian':'Iterasi satu titik',sys,8,'Selesaikan x²−8x−y=−0.5 dan x²+2y²−6y=4 dari (2,0.25). Isi tabel hingga iterasi ke-10.',
      newton?'Susun F₁ dan F₂ dengan ruas kanan nol. Jacobian memiliki baris (2x−8,−1) dan (2x,4y−6). Gunakan x baru = x lama − J⁻¹F. Periksa determinan sebelum membagi.':'Susun x baru=(x²−y+0.5)/8 dan y baru=(x²+2y²−4)/6. Hitung keduanya dari baris lama. Syarat cukup kontraksi ialah jumlah nilai absolut turunan parsial setiap baris g kurang dari satu pada daerah iterasi yang dipetakan ke dirinya.',newton?['k','x','y','F₁','F₂','det J']:['k','x','y'],rows,a,{x:'A',y:'B',y2:'C',from:2,to:12,kind:'iter'},'Week 8 · Sistem persamaan nonlinier');
  }
  for(const mode of ['Biseksi','Regula falsi','Secant','Newton–Raphson','Titik tetap']){
    const bracket=['Biseksi','Regula falsi'].includes(mode),sec=mode==='Secant';
    const f=x=>'('+x+'^2-2)', a={},rows=[[0,1,...(bracket||sec?[2]:[])]];
    for(let i=2;i<=8;i++){const p=i-1;if(i>2){rows.push([i-2]);if(bracket){a['B'+i]='=IF('+f('B'+p)+'*'+f('D'+p)+'<=0,B'+p+',D'+p+')';a['C'+i]='=IF('+f('B'+p)+'*'+f('D'+p)+'<=0,D'+p+',C'+p+')';}else if(sec){a['B'+i]='=C'+p;a['C'+i]='=D'+p;}else a['B'+i]='=C'+p;}
      const b='B'+i,c='C'+i;
      if(bracket||sec)a['D'+i]=mode==='Biseksi'?'=('+b+'+'+c+')/2':'='+c+'-'+f(c)+'*('+c+'-'+b+')/('+f(c)+'-'+f(b)+')';
      else a[c]=mode==='Titik tetap'?'=('+b+'+2/'+b+')/2':'='+b+'-'+f(b)+'/(2*'+b+')';
    }
    add(mode,mode,'Akar persamaan',mode==='Biseksi'?2:['Regula falsi','Secant'].includes(mode)?3:4,'Dekati akar positif f(x)=x²−2. Hitung taksiran di setiap baris, mulai dari data awal yang disediakan.',
      mode==='Biseksi'?'Bagi selang menjadi dua. Pertahankan setengah selang yang memuat perubahan tanda.':mode==='Regula falsi'?'Gunakan potongan garis sekan dengan sumbu x. Pertahankan selang yang mengapit perubahan tanda.':sec?'Gunakan dua taksiran terbaru untuk menarik garis sekan. Periksa penyebut selisih nilai fungsi.':mode==='Titik tetap'?'Gunakan g(x)=(x+2/x)/2. Iterasi mengikuti x baru=g(x lama).':'Hitung x baru=x−f(x)/f′(x), dengan f′(x)=2x.',bracket?['k','Bawah','Atas','Taksiran']:sec?['k','x lama','x kini','Taksiran']:['k','x kini','Taksiran'],rows,a,{x:'A',y:bracket||sec?'D':'C',from:2,to:8,kind:'iter'},'Pengulangan · Metode akar persamaan');
  }
  for(const gs of [false,true]){
    const rows=[[0,0,0]],a={};for(let i=3;i<=10;i++){const p=i-1;rows.push([i-2]);a['B'+i]='=(9-C'+p+')/4';a['C'+i]='=(7-B'+(gs?i:p)+')/3';}
    add(gs?'gs':'jacobi',gs?'Gauss–Seidel':'Jacobi','Sistem linier','6–7','Dekati solusi 4x+y=9 dan x+3y=7 dari (0,0) selama delapan iterasi.',gs?'Perbarui x terlebih dahulu. Gunakan x yang baru saat menghitung y di baris yang sama.':'Hitung x dan y dari nilai pada baris sebelumnya. Dominasi diagonal pada sistem ini mendukung konvergensi.',['k','x','y'],rows,a,{x:'A',y:'B',y2:'C',from:2,to:10,kind:'iter'},'Week 6–7 · Latihan SPL');
  }
  const xs=[1,2,3,4,5,6,7,9,11,13,15,17,19];
  const ys=[1.10517,2.44281,4.04958,5.96730,8.24361,10.93271,14.09627,22.13643,33.04583,47.70086,67.22534,93.05711,127.03199];
  const mixedRows=xs.map((x,i)=>[x,ys[i]]), mixed={};
  mixedRows.push([],['Bagian','h','Trapesium','Simp. 1/3','Simp. 3/8'],['[1,7]'],['[7,19]'],['Integral'],['Galat |E|'],['Eksak',701.19588]);
  for(const [r,start] of [[17,2],[18,8]]){
    mixed['B'+r]='=A'+(start+1)+'-A'+start;
    for(const [c,f,w] of [['C','B'+r+'/2',[1,2,2,2,2,2,1]],['D','B'+r+'/3',[1,4,2,4,2,4,1]],['E','3*B'+r+'/8',[1,3,3,2,3,3,1]]]){
      mixed[c+r]='='+f+'*('+w.map((v,i)=>(v===1?'':v+'*')+'B'+(start+i)).join('+')+')';
    }
  }
  for(const c of ['C','D','E']){mixed[c+'19']='=SUM('+c+'17:'+c+'18)';mixed[c+'20']='=ABS($B$21-'+c+'19)';}
  add('mixed','Integral dua interval',integ,'13–14','Gunakan data x exp(0.1x) dari kuis untuk menghitung integral [1,19]. Bandingkan tiga metode dan cari galat mutlak masing-masing.',
    'Pada [1,7] ada enam segmen dengan h=1. Pada [7,19] ada enam segmen dengan h=2. Hitung pendekatan tiap bagian dan jumlahkan. Titik x=7 menjadi ujung kedua bagian.', ['x','f(x)'],mixedRows,mixed,{x:'A',y:'B',from:2,to:14,kind:'area'},'Week 13–14 · Kuis integral dari tabel');
  return list;
})();
