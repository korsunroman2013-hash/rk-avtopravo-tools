const form=document.getElementById("generator"),wrap=document.getElementById("outputWrap"),output=document.getElementById("output");
function filename(){return "Заявление_в_МРЭО"}
form.addEventListener("submit",e=>{e.preventDefault();
 const purpose=document.getElementById("purpose").value;
 let request="Прошу провести регистрационные действия в отношении транспортного средства, сведения о котором указаны ниже.";
 if(purpose==="accept")request="Прошу принять представленные документы, рассмотреть настоящее заявление и принять решение по существу.";
 if(purpose==="written")request="Прошу рассмотреть вопрос о совершении регистрационных действий. В случае отказа прошу предоставить письменное решение с указанием фактических и правовых оснований.";
 const line="____________________________________________";
 const lines=["В: "+line,"","от: "+line,"Ф.И.О.: "+line,"адрес: "+line,line,"телефон: "+line,"","ЗАЯВЛЕНИЕ","",request,"","Данные транспортного средства:","Марка, модель: "+line,"Год выпуска: "+line,"VIN (номер кузова / шасси): "+line,"Государственный регистрационный знак (при наличии): "+line,"","Имеющиеся документы: "+line,line,"","Дополнительные обстоятельства: "+line,line,"","Прошу сообщить о принятом решении в установленном порядке.","","Дата: ____________     Подпись: ____________ / __________________________ /"];
 output.textContent=lines.join("\n");wrap.hidden=false;wrap.scrollIntoView({behavior:"smooth"});
});
document.getElementById("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(output.textContent);document.getElementById("copyStatus").textContent="Текст скопирован."}catch(e){document.getElementById("copyStatus").textContent="Не удалось скопировать автоматически. Выделите текст вручную."}});
document.getElementById("download").addEventListener("click",()=>{if(!output.textContent)return;const body=output.textContent.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");const doc='<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:"Times New Roman";font-size:12pt;line-height:1.5;margin:2cm}</style></head><body>'+body+'</body></html>';const blob=new Blob(["\ufeff",doc],{type:"application/msword"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename()+".doc";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
document.getElementById("print").addEventListener("click",()=>{if(output.textContent)window.print()});
document.getElementById("clear").addEventListener("click",()=>{form.reset();wrap.hidden=true;document.getElementById("copyStatus").textContent="";window.scrollTo({top:0,behavior:"smooth"})});