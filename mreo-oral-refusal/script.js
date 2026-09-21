document.getElementById("generator").addEventListener("submit",function(event){
 event.preventDefault();
 const status=document.querySelector('input[name="vehicleStatus"]:checked').value;
 const statusText=status==="owner"
  ?"Собственник по свидетельству о регистрации транспортного средства"
  :"Владелец — не являюсь собственником по свидетельству о регистрации транспортного средства";
 const line="____________________________________________";
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

Статус заявителя: ${statusText}

[Продолжение заявления будет добавлено после согласования следующих вопросов генератора.]`;
 document.getElementById("documentText").textContent=text;
 const result=document.getElementById("result");result.hidden=false;result.scrollIntoView({behavior:"smooth",block:"nearest"});
});