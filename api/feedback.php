<?php
declare(strict_types=1);
// Timeweb only. Credentials remain outside public_html.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $code, array $data): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
function googleRequest(string $url, ?string $body = null, array $headers = []): array {
    $c = curl_init($url);
    curl_setopt_array($c, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 8, CURLOPT_HTTPHEADER => $headers,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
    ]);
    if ($body !== null) {
        curl_setopt($c, CURLOPT_POST, true);
        curl_setopt($c, CURLOPT_POSTFIELDS, $body);
    }
    $raw = curl_exec($c);
    $status = curl_getinfo($c, CURLINFO_HTTP_CODE);
    curl_close($c);
    if ($raw === false || $status < 200 || $status >= 300) {
        throw new RuntimeException('Google request failed');
    }
    return json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
}
function b64(string $value): string {
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}
function field(array $data, string $key, int $limit): string {
    $value = $data[$key] ?? '';
    if (!is_string($value) || !mb_check_encoding($value, 'UTF-8') ||
        mb_strlen($value, 'UTF-8') > $limit) {
        reply(400, ['ok'=>false, 'message'=>'Проверьте поля отзыва.']);
    }
    return trim($value);
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok'=>false, 'message'=>'Используйте кнопку отправки в Навигаторе.']);
}
if (($_SERVER['HTTP_ORIGIN'] ?? '') !== 'https://tools.rk-avtopravo.ru' ||
    ($_SERVER['HTTP_X_NAVIGATOR_FEEDBACK'] ?? '') !== '1' ||
    !str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
    reply(403, ['ok'=>false, 'message'=>'Отправьте отзыв со страницы Навигатора.']);
}
try {
    $raw = file_get_contents('php://input', false, null, 0, 20001);
    if ($raw === false || strlen($raw) > 20000) {
        reply(413, ['ok'=>false, 'message'=>'Отзыв слишком длинный.']);
    }
    $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
    if (!is_array($data)) { reply(400, ['ok'=>false, 'message'=>'Неверный формат отзыва.']); }
    $note = field($data, 'note', 3000);
    $step = field($data, 'step', 200);
    $title = field($data, 'title', 1000);
    $type = field($data, 'type', 100);
    $path = field($data, 'path', 6000);
    $choice = field($data, 'choice', 500);
    if ($note === '' || !in_array($type, [
        'Ошибка перехода','Непонятный вопрос','Нет подходящего ответа',
        'Предложение или общее впечатление'
    ], true)) {
        reply(400, ['ok'=>false, 'message'=>'Напишите отзыв и выберите его тип.']);
    }
    $private = dirname(__DIR__, 2).'/private';
    // Shared quota avoids persisting visitor IP addresses.
    $lock = fopen($private.'/feedback-rate.json', 'c+');
    if (!$lock || !flock($lock, LOCK_EX)) { throw new RuntimeException('Rate storage unavailable'); }
    chmod($private.'/feedback-rate.json', 0600);
    $rate = json_decode(stream_get_contents($lock), true) ?: [];
    $minute = intdiv(time(), 60);
    $count = ($rate['minute'] ?? -1) === $minute ? (int)($rate['count'] ?? 0) : 0;
    if ($count >= 20) {
        flock($lock, LOCK_UN); fclose($lock);
        header('Retry-After: 60');
        reply(429, ['ok'=>false, 'message'=>'Слишком много отправок. Повторите через минуту.']);
    }
    rewind($lock); ftruncate($lock, 0);
    fwrite($lock, json_encode(['minute'=>$minute, 'count'=>$count+1]));
    fflush($lock); flock($lock, LOCK_UN); fclose($lock);
    $key = json_decode(file_get_contents($private.'/google-service-account.json'), true, 512, JSON_THROW_ON_ERROR);
    $now = time();
    $jwt = b64(json_encode(['alg'=>'RS256','typ'=>'JWT'])).'.'.b64(json_encode([
        'iss'=>$key['client_email'],
        'scope'=>'https://www.googleapis.com/auth/spreadsheets',
        'aud'=>'https://oauth2.googleapis.com/token', 'iat'=>$now, 'exp'=>$now+3600
    ]));
    if (!openssl_sign($jwt, $signature, $key['private_key'], OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('Signing failed');
    }
    $token = googleRequest('https://oauth2.googleapis.com/token', http_build_query([
        'grant_type'=>'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion'=>$jwt.'.'.b64($signature)
    ]));
    $id = 'FB-'.gmdate('Ymd-His').'-'.bin2hex(random_bytes(4));
    $row = [$id, (new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow')))->format('Y-m-d H:i:s'),
        $step, $path, $choice, $note, 'Новый', '', '', '', '',
        'Тип: '.$type.'; Вопрос: '.$title.'; Версия: 20261003-feedback-2'];
    $range = rawurlencode("'Обратная связь Навигатора'!A:L");
    $result = googleRequest(
        'https://sheets.googleapis.com/v4/spreadsheets/1uYollpw8-lto59zm0MdHkxk9s0V9NlbSDqe0Oiz1_BQ/values/'.$range.':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS',
        json_encode(['majorDimension'=>'ROWS','values'=>[$row]], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
        ['Authorization: Bearer '.$token['access_token'], 'Content-Type: application/json']
    );
    if (($result['updates']['updatedRows'] ?? 0) !== 1) { throw new RuntimeException('Append unconfirmed'); }
    reply(200, ['ok'=>true, 'id'=>$id]);
} catch (JsonException $e) {
    reply(400, ['ok'=>false, 'message'=>'Неверный формат данных.']);
} catch (Throwable $e) {
    reply(503, ['ok'=>false, 'message'=>'Не удалось подтвердить сохранение. Вы можете отправить отзыв через ВК.']);
}
