(() => {
  const button = document.getElementById('feedback-send');
  const app = document.getElementById('app');
  const status = document.getElementById('feedback-status');
  const input = document.getElementById('feedback-text');
  const clicks = [];
  let lastChoice = '';
  let sending = false;
  if (location.origin !== 'https://tools.rk-avtopravo.ru') {
    button.hidden = true;
    document.getElementById('feedback-direct-info').textContent =
      'Прямая отправка доступна на tools.rk-avtopravo.ru. Здесь можно скопировать отзыв для ВК.';
    return;
  }
  app.addEventListener('click', (event) => {
    const selected = event.target.closest('button');
    if (!selected) return;
    const marker = app.querySelector('.step-code b') || app.querySelector('.step-marker');
    lastChoice = selected.textContent.trim().slice(0, 500);
    clicks.push((marker ? marker.textContent.trim() : '') + ': ' + lastChoice);
    if (clicks.length > 30) clicks.shift();
  }, true);
  button.addEventListener('click', async () => {
    if (sending) return;
    const note = input.value.trim();
    if (!note) {
      status.textContent = 'Сначала напишите отзыв.';
      input.focus();
      return;
    }
    const marker = app.querySelector('.step-code b') || app.querySelector('.step-marker');
    const started = app.style.display !== 'none';
    const heading = started ? app.querySelector('h2') : null;
    const payload = {
      note,
      step: started && marker ? marker.textContent.trim().slice(0, 200) : 'Введение',
      title: heading ? heading.textContent.trim().slice(0, 1000) : 'Введение',
      type: document.getElementById('feedback-type').value,
      path: clicks.length ? ('История нажатий (включая возвраты):\n' + clicks.join('\n')).slice(-6000) : '',
      choice: lastChoice
    };
    sending = true;
    button.disabled = true;
    status.textContent = 'Отправляем отзыв…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 50000);
    try {
      const response = await fetch('/api/feedback.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-Navigator-Feedback': '1'},
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || 'Не удалось подтвердить сохранение.');
      }
      status.textContent = 'Отзыв сохранён. Спасибо! Номер: ' + result.id;
      if (input.value.trim() === note) input.value = '';
    } catch (error) {
      status.textContent = (error.name === 'AbortError'
        ? 'Ответ сервера не получен; отзыв мог сохраниться.'
        : error.message) + ' Текст оставлен в форме. При необходимости отправьте его через ВК.';
    } finally {
      clearTimeout(timer);
      sending = false;
      button.disabled = false;
    }
  });
})();
