document.getElementById("generator").addEventListener("submit",function(event){
 event.preventDefault();
 const v=id=>document.getElementById(id).value.trim();
 const status=document.querySelector('input[name="vehicleStatus"]:checked').value;
 const fio=[v("lastName"),v("firstName"),v("middleName")].filter(Boolean).join(" ");
 const statusText=status==="owner"?"Собственник по свидетельству о регистрации транспортного средства":"Владелец — не являюсь собственником по свидетельству о регистрации транспортного средства";
 const lines=[
  "В "+v("mreo"),"", "от "+fio, "адрес места жительства: "+v("address")
 ];
 if(v("phone")) lines.push("телефон: "+v("phone"));
 lines.push("","ЗАЯВЛЕНИЕ","","Руководствуясь Федеральным законом от 02.05.2006 № 59-ФЗ «О порядке рассмотрения обращений граждан Российской Федерации» и статьёй 33 Конституции Российской Федерации, обращаюсь к Вам о нижеследующем.","","Данные транспортного средства:","Марка, модель: "+v("vehicle"),"VIN (номер кузова / шасси): "+v("vin"),"Год выпуска: "+v("year"));
 if(v("plate")) lines.push("Государственный регистрационный знак: "+v("plate"));
 if(v("regDoc")) lines.push("Свидетельство о регистрации / техпаспорт: "+v("regDoc"));
 if(v("regIssuer")) lines.push("Кем выдан документ: "+v("regIssuer"));
 if(v("regDate")) lines.push("Дата выдачи документа: "+v("regDate"));
 lines.push("Статус заявителя: "+statusText,"","[Продолжение заявления будет добавлено после согласования следующих граф генератора.]");
 document.getElementById("documentText").textContent=lines.join("\n");
 const result=document.getElementById("result"); result.hidden=false; result.scrollIntoView({behavior:"smooth",block:"nearest"});
});