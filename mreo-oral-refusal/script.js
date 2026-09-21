document.getElementById("generator").addEventListener("submit",function(event){
  event.preventDefault();
  const mreo=document.getElementById("mreo").value.trim();
  const lastName=document.getElementById("lastName").value.trim();
  const firstName=document.getElementById("firstName").value.trim();
  const middleName=document.getElementById("middleName").value.trim();
  const address=document.getElementById("address").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const fio=[lastName,firstName,middleName].filter(Boolean).join(" ");
  const text=`В ${mreo}

от ${fio}
адрес места жительства: ${address}${phone?"\nтелефон: "+phone:""}

ЗАЯВЛЕНИЕ

Руководствуясь Федеральным законом от 02.05.2006 № 59-ФЗ «О порядке рассмотрения обращений граждан Российской Федерации» и статьёй 33 Конституции Российской Федерации, обращаюсь к Вам о нижеследующем.

[Продолжение заявления будет добавлено после согласования следующих граф генератора.]`;
  document.getElementById("documentText").textContent=text;
  const result=document.getElementById("result");
  result.hidden=false;
  result.scrollIntoView({behavior:"smooth",block:"nearest"});
});