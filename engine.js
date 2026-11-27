/* Rumus yang dipakai dalam latihan, tanpa menjalankan kode dari sel. */
const GridMath = (() => {
  const cols = 'ABCDEFGH';
  const token = /\s*(\$?[A-H]\$?[1-9]\d*(?![A-Z0-9])|[A-Z][A-Z0-9.]*|(?:\d+(?:\.\d*)?|\.\d+)(?:E[+-]?\d+)?|<>|>=|<=|[=<>:+*/^(),;%-])/iy;
  const cell = /^\$?([A-H])\$?([1-9]\d*)$/i;
  const functions = {SUM:a=>a.reduce((s,v)=>s+v,0),ABS:a=>Math.abs(a[0]),SIN:a=>Math.sin(a[0]),COS:a=>Math.cos(a[0]),EXP:a=>Math.exp(a[0]),LN:a=>Math.log(a[0]),SQRT:a=>Math.sqrt(a[0]),MIN:a=>Math.min(...a),MAX:a=>Math.max(...a),PRODUCT:a=>a.reduce((s,v)=>s*v,1),ROUND:([x,n])=>Math.sign(x)*Math.round(Math.abs(x)*10**n)/10**n, IF:([p,a,b])=>p?a:b};
  functions.TRUNC=([x,n=0])=>Math.trunc(x*10**n)/10**n;
  function sheet(data) {
    const cache = new Map(), trail = new Set();
    function read(ref) {
      ref = ref.replaceAll('$','').toUpperCase();
      if (cache.has(ref)) return cache.get(ref);
      if (trail.has(ref)) throw Error('#CIRC!');
      if (!cell.test(ref) || Number(ref.slice(1))>24) throw Error('#REF!');
      const raw = data[ref] ?? '';
      if (raw==='') return '';
      if (!String(raw).startsWith('=')) return isFinite(raw) ? Number(raw) : raw;
      trail.add(ref);
      try {const value=parse(raw.slice(1)); cache.set(ref,value); return value;}
      finally {trail.delete(ref);}
    }
    function parse(source) {
      const ts=[]; let pos=0;
      source=source.trim().toUpperCase();
      while(pos<source.length){
        token.lastIndex=pos; const m=token.exec(source);
        if(!m) throw Error('#FORMULA!');
        ts.push(m[1]); pos=token.lastIndex;
      }
      let i=0;
      const take=t=>ts[i]===t && (++i>0);
      const need=t=>{if(!take(t))throw Error('#FORMULA!');};
      function number(v){if(typeof v==='number')return v;if(v==='')return 0;throw Error('#VALUE!');}
      function atom(){
        if(take('(')){const v=compare();need(')');return v;}
        const t=ts[i++]; if(!t)throw Error('#FORMULA!');
        if(cell.test(t))return number(read(t));
        if(!Number.isNaN(Number(t)))return Number(t);
        if(!Object.hasOwn(functions,t))throw Error('#NAME?');
        need('(');
        if(t==='IF'){
          const parts=[];let start=i,depth=0;
          for(;i<ts.length;i++){
            const current=ts[i];
            if(current===')'&&depth===0){parts.push(ts.slice(start,i).join(''));i++;break;}
            if((current===','||current===';')&&depth===0){parts.push(ts.slice(start,i).join(''));start=i+1;}
            if(current==='(')depth++;
            if(current===')')depth--;
          }
          if(parts.length!==3||parts.some(part=>!part))throw Error('#FORMULA!');
          return parse(parts[parse(parts[0])?1:2]);
        }
        const args=[];
        do{
          if(cell.test(ts[i]) && ts[i+1]===':'){
            const first=ts[i++].replaceAll('$',''); i++;
            const last=ts[i++]; if(!cell.test(last))throw Error('#REF!');
            const to=last.replaceAll('$','');
            const ys=[+first.slice(1),+to.slice(1)].sort((a,b)=>a-b);
            if(ys[1]>24)throw Error('#REF!');
            const xs=[cols.indexOf(first[0]),cols.indexOf(to[0])].sort((a,b)=>a-b);
            for(let y=ys[0];y<=ys[1];y++)for(let x=xs[0];x<=xs[1];x++){const v=read(cols[x]+y);if(typeof v==='number')args.push(v);}
          }else args.push(compare());
        }while(take(',')||take(';'));
        need(')');
        if((t==='ROUND'&&args.length!==2)||(['SIN','COS','ABS','EXP','LN','SQRT'].includes(t)&&args.length!==1))throw Error('#FORMULA!');
        return functions[t](args);
      }
      function unary(){if(take('-'))return -unary();if(take('+'))return unary();let v=atom();while(take('%'))v/=100;return v;}
      function power(){let v=unary();while(take('^'))v=v**unary();return v;}
      function product(){let v=power();while(ts[i]==='*'||ts[i]==='/'){const op=ts[i++],b=power();if(op==='/'&&b===0)throw Error('#DIV/0!');v=op==='*'?v*b:v/b;}return v;}
      function sum(){let v=product();while(ts[i]==='+'||ts[i]==='-'){const op=ts[i++],b=product();v=op==='+'?v+b:v-b;}return v;}
      function compare(){const a=sum(),op=ts[i];if(!['>','<','=','<>','>=','<='].includes(op))return a;i++;const b=sum();return Number(({'>':a>b,'<':a<b,'=':a===b,'<>':a!==b,'>=':a>=b,'<=':a<=b})[op]);}
      const result=compare();if(i!==ts.length)throw Error('#FORMULA!');if(!Number.isFinite(result))throw Error('#NUM!');return result;
    }
    return ref=>{try{return read(ref);}catch(e){return e.message;}};
  }
  function shift(formula,dx,dy){
    if(!String(formula).startsWith('='))return formula;
    return formula.replace(/(\$?)([A-H])(\$?)([1-9]\d*)\b/gi,(_,cx,col,cy,row)=>{
      const c=cols.indexOf(col.toUpperCase())+(cx?0:dx),r=Number(row)+(cy?0:dy);
      return c<0||c>=cols.length||r<1||r>24?'#REF!':cx+cols[c]+cy+r;
    });
  }
  return {sheet,shift,cols};
})();

