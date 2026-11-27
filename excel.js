// Minimal OOXML workbook with editable formulas, two sheets and a stored ZIP archive.
const ExcelFile=(()=>{
  const enc=new TextEncoder();
  const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function zip(files){
    const parts=[],directory=[];let offset=0;
    function header(size){const buffer=new Uint8Array(size),dv=new DataView(buffer.buffer);return {buffer,u16:(p,n)=>dv.setUint16(p,n,true),u32:(p,n)=>dv.setUint32(p,n,true)};}
    for(const [path,value] of Object.entries(files)){
      const name=enc.encode(path),data=enc.encode(value);let crc=-1;
      for(const b of data){crc^=b;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^-1)>>>0;
      const l=header(30);l.u32(0,0x04034b50);l.u16(4,20);l.u16(12,33);l.u32(14,crc);l.u32(18,data.length);l.u32(22,data.length);l.u16(26,name.length);
      const c=header(46);c.u32(0,0x02014b50);c.u16(4,20);c.u16(6,20);c.u16(14,33);c.u32(16,crc);c.u32(20,data.length);c.u32(24,data.length);c.u16(28,name.length);c.u32(42,offset);
      parts.push(l.buffer,name,data);directory.push(c.buffer,name);offset+=30+name.length+data.length;
    }
    const end=header(22),count=Object.keys(files).length;end.u32(0,0x06054b50);end.u16(8,count);end.u16(10,count);end.u32(12,directory.reduce((s,b)=>s+b.length,0));end.u32(16,offset);
    return new Blob([...parts,...directory,end.buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  const main='http://schemas.openxmlformats.org/spreadsheetml/2006/main', rel='http://schemas.openxmlformats.org/officeDocument/2006/relationships',pkg='http://schemas.openxmlformats.org/package/2006/relationships';
  function worksheet(data,width=17,targets={}){
    const read=GridMath.sheet(data);let rows='';
    const last=Math.max(24,...Object.keys(data).map(k=>+k.slice(1)));
    for(let r=1;r<=last;r++){let cells='';
      for(const col of GridMath.cols){
        const key=col+r,v=data[key],style=r===1?'1':Object.hasOwn(targets,key)?'2':'0';
        if(v==null||v===''){if(style==='2')cells+='<c r="'+key+'" s="2"/>';continue;}
        const node='<c r="'+key+'" s="'+style+'"';
        if(String(v).startsWith('=')){const val=read(key);cells+=node+(typeof val==='number'?'><f>':' t="e"><f>')+xml(v.slice(1).replaceAll(';',','))+'</f><v>'+xml(typeof val==='number'?val:'#VALUE!')+'</v></c>';}
        else if(typeof v==='number'||String(v).trim()!==''&&Number.isFinite(Number(v)))cells+=node+'><v>'+Number(v)+'</v></c>';
        else cells+=node+' t="inlineStr"><is><t>'+xml(v)+'</t></is></c>';
      }if(cells)rows+='<row r="'+r+'">'+cells+'</row>';
    }
    return '<worksheet xmlns="'+main+'"><cols><col min="1" max="8" width="'+width+'" customWidth="1"/></cols><sheetData>'+rows+'</sheetData></worksheet>';
  }
  function build(lesson,data,guided,pack){
    const type='application/vnd.openxmlformats-officedocument.spreadsheetml.';
    const guide={A1:lesson.title,A2:lesson.task,A4:'Sel latihan',A5:Object.keys(lesson.answers).join(', '),A7:'Sumber',A8:lesson.source};
    if(guided){guide.A10='Konsep';guide.A11=lesson.concept;}
    const styles='<styleSheet xmlns="'+main+'"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'+['FFDAD5FA','FFF1EDFF'].map(c=>'<fill><patternFill patternType="solid"><fgColor rgb="'+c+'"/><bgColor indexed="64"/></patternFill></fill>').join('')+'</fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="3"><xf xfId="0"/><xf xfId="0" fillId="2" applyFill="1"/><xf xfId="0" fillId="3" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
    const files={'[Content_Types].xml':'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'+[['xl/workbook.xml','sheet.main'],['xl/styles.xml','styles'],['xl/worksheets/sheet1.xml','worksheet'],['xl/worksheets/sheet2.xml','worksheet']].map(([p,t])=>'<Override PartName="/'+p+'" ContentType="'+type+t+'+xml"/>').join('')+'</Types>',
    '_rels/.rels':'<Relationships xmlns="'+pkg+'"><Relationship Id="rId1" Type="'+rel+'/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml':'<workbook xmlns="'+main+'" xmlns:r="'+rel+'"><sheets><sheet name="Latihan" sheetId="1" r:id="rId1"/><sheet name="Soal" sheetId="2" r:id="rId2"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>',
    'xl/_rels/workbook.xml.rels':'<Relationships xmlns="'+pkg+'">'+['worksheets/sheet1.xml','worksheets/sheet2.xml','styles.xml'].map((p,i)=>'<Relationship Id="rId'+(i+1)+'" Type="'+rel+'/'+(i<2?'worksheet':'styles')+'" Target="'+p+'"/>').join('')+'</Relationships>',
    'xl/styles.xml':styles,'xl/worksheets/sheet1.xml':worksheet(data,17,lesson.answers),'xl/worksheets/sheet2.xml':worksheet(guide,100)};
    if(pack){
      const names=pack.map(l=>l.title.replace(/[\\/]/g,'-').slice(0,31));
      const index={A1:'Lembar latihan',B1:'Soal',C1:'Sumber',D1:'Cara berlatih',D2:'Pilih tab metode di bawah. Isi sel ungu dengan rumus Excel.',D3:'Lihat petunjuk dan hasil acuan di bawah tiap tabel.'};
      pack.forEach((l,i)=>{index['A'+(i+2)]=names[i];index['B'+(i+2)]=l.task;index['C'+(i+2)]=l.source;});
      const sheets=[['Mulai',worksheet(index,38)],...pack.map((l,i)=>{
        const solved=GridMath.sheet({...l.base,...l.answers}),last=Object.keys(l.answers).at(-1);
        const d={...l.base,A26:l.task,A28:l.concept,A30:'Cek hasil '+last,B30:Number(solved(last).toFixed(7))};
        return [names[i],worksheet(d,18,l.answers)];
      })];
      const typeDoc=files['[Content_Types].xml'].replace(/<Override PartName="\/xl\/worksheets[^>]+\/>/g,'');
      files['[Content_Types].xml']=typeDoc.replace('</Types>',sheets.map((_,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="'+type+'worksheet+xml"/>').join('')+'</Types>');
      files['xl/workbook.xml']='<workbook xmlns="'+main+'" xmlns:r="'+rel+'"><sheets>'+sheets.map(([name],i)=>'<sheet name="'+xml(name)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join('')+'</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>';
      files['xl/_rels/workbook.xml.rels']='<Relationships xmlns="'+pkg+'">'+sheets.map((_,i)=>'<Relationship Id="rId'+(i+1)+'" Type="'+rel+'/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+'<Relationship Id="rStyle" Type="'+rel+'/styles" Target="styles.xml"/></Relationships>';
      sheets.forEach(([,body],i)=>files['xl/worksheets/sheet'+(i+1)+'.xml']=body);
    }return zip(files);
  }return {build};
})();
