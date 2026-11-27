// Jalankan dengan Node dari folder mana pun untuk memperbarui workbook offline.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({ Blob, TextEncoder });
const source = ['engine', 'lessons', 'practice', 'study', 'excel']
  .map(name => fs.readFileSync(path.join(__dirname, name + '.js'), 'utf8')).join('\n');
vm.runInContext(source, context);
async function generate() {
  for (const term of ['UTS', 'UAS']) {
    context.term = term;
    const blob = vm.runInContext(`(() => {
      const pack = lessons.filter(l => termOf(l) === term).flatMap(l =>
        [0,1,2].map(i => {
          const exercise = practiceSet(l,i);
          const result = GridMath.sheet({...exercise.base,...exercise.answers});
          for (const cell of Object.keys(exercise.answers))
            if (!Number.isFinite(result(cell))) throw Error(l.title+' paket '+i+' sel '+cell+' '+result(cell));
          const note=noteFor(l.id), reference=note[5].split(' ')[0];
          return {...exercise, title:'ABC'[i]+' · '+l.title,
            concept:exercise.concept+' Contoh '+reference+' '+exercise.answers[reference]+' memberi '+Number(result(reference).toFixed(6))+'.'};
        })
      );
      return ExcelFile.build(pack[0],pack[0].base,true,pack);
    })()`, context);
    fs.writeFileSync(path.join(__dirname,'Latihan '+term+'.xlsx'), Buffer.from(await blob.arrayBuffer()));
  }
}
generate().catch(error=>{console.error(error);process.exitCode=1;});
