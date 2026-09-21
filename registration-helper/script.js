document.getElementById("helper").addEventListener("submit", function (event) {
  event.preventDefault();

  const region = document.getElementById("region").value;
  const date = document.getElementById("date").value;
  const docs = document.getElementById("docs").value;
  const owner = document.getElementById("owner").value;
  const result = document.getElementById("result");

  let heading = "Нужна дополнительная проверка";
  let text = "По введённым данным нельзя делать окончательный юридический вывод автоматически.";

  if (date === "before" && owner === "me") {
    heading = "Ситуация подходит для дальнейшей проверки по специальному порядку";
    text = "Дата регистрации и сведения о собственнике позволяют перейти к следующему этапу проверки условий перерегистрации. Необходимо сопоставить документы автомобиля с действующими нормативными требованиями.";
  } else if (date === "after") {
    heading = "Требуется отдельный правовой анализ";
    text = "Регистрация после 31.12.2025 выделена в прототипе как отдельная ситуация. Необходимо проверить происхождение автомобиля, способ его перемещения на территорию РФ и применимые правила.";
  } else if (owner !== "me") {
    heading = "Сначала нужно проверить право собственности";
    text = "Собственник по документам отличается от заявителя либо не определён. Для дальнейшего вывода необходимо установить документы, подтверждающие переход права собственности.";
  }

  result.innerHTML = `<h2>${heading}</h2>
    <p><strong>Регистрация:</strong> ${region}</p>
    <p><strong>Документы:</strong> ${docs}</p>
    <p>${text}</p>
    <p><strong>Следующий шаг:</strong> проверить конкретный комплект документов и актуальную редакцию правил.</p>`;
  result.hidden = false;
  result.scrollIntoView({behavior:"smooth", block:"nearest"});
});