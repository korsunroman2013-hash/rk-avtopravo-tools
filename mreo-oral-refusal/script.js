const form=document.getElementById("generator");
const holderBlock=document.getElementById("holderBlock"),inheritanceBlock=document.getElementById("inheritanceBlock");
document.querySelectorAll('input[name="vehicleStatus"]').forEach(el=>el.addEventListener("change",()=>{
 const holder=document.querySelector('input[name="vehicleStatus"]:checked')?.value==="holder";
 holderBlock.hidden=!holder;
 if(!holder){inheritanceBlock.hidden=true;document.querySelectorAll('input[name="holderBasis"],input[name="inheritanceBasis"]').forEach(x=>x.checked=false)}
}));
document.querySelectorAll('input[name="holderBasis"]').forEach(el=>el.addEventListener("change",()=>{
 inheritanceBlock.hidden=document.querySelector('input[name="holderBasis"]:checked')?.value!=="inheritance";
 if(inheritanceBlock.hidden)document.querySelectorAll('input[name="inheritanceBasis"]').forEach(x=>x.checked=false);
}));
form.addEventListener("submit",function(event){
 event.preventDefault();
 const status=document.querySelector('input[name="vehicleStatus"]:checked')?.value;
 let basis="";
 if(status==="holder"){
  const selected=document.querySelector('input[name="holderBasis"]:checked');
  if(!selected){alert("Выберите основание владения транспортным средством.");return}
  const v=selected.value;
  if(v==="sale")basis='Основание владения: договор купли-продажи № ____________ от «___» __________ 20___ г.';
  if(v==="gift")basis='Основание владения: договор дарения № ____________ от «___» __________ 20___ г.';
  if(v==="registration")basis='Основание владения: свидетельство о регистрации транспортного средства, оформленное на другое лицо; сделка с собственником не оформлялась.';
  if(v==="other")basis='Основание владения: ______________________________\nНаименование документа: ______________________________\n№ ____________ от «___» __________ 20___ г.';
  if(v==="inheritance"){
   const inh=document.querySelector('input[name="inheritanceBasis"]:checked');
   if(!inh){alert("Выберите документ, подтверждающий наследование.");return}
   basis=inh.value==="certificate"
    ?'Основание владения: свидетельство о праве на наследство № ____________ от «___» __________ 20___ г.'
    :'Основание владения: решение ______________________________ суда по делу № ____________ от «___» __________ 20___ г., вступившее в законную силу «___» __________ 20___ г.';
  }
 }
 const line="____________________________________________";
 const statusText=status==="owner"?"Собственник по свидетельству о регистрации транспортного средства":"Владелец — не являюсь собственником по свидетельству о регистрации транспортного средства";
 const text=`В: ${line}

от: ${line}
Ф.И.О.: ${line}
адрес места жительства: ${line}
${line}
телефон: ${line}

ЗАЯВЛЕНИЕ

Руководствуясь Федеральным законом от 02.05.2006 № 59-ФЗ «О порядке рассмотрения обращений граждан Российской Федерации» и статьёй 33 Конституции Российской Федерации, обращаюсь к Вам о нижеследующем.

Данные транспортного средства:

Марка, модель: ${line}
VIN (номер кузова / шасси): ${line}
Год выпуска: ${line}
Государственный регистрационный знак (при наличии): ${line}
Серия и номер свидетельства о регистрации / техпаспорта: ${line}
Кем выдан документ: ${line}
Дата выдачи документа: ${line}

Статус заявителя: ${statusText}${basis?"\n"+basis:""}

[Продолжение заявления будет добавлено после согласования следующих вопросов генератора.]`;
 document.getElementById("documentText").textContent=text;
 const result=document.getElementById("result");result.hidden=false;result.scrollIntoView({behavior:"smooth",block:"nearest"});
});