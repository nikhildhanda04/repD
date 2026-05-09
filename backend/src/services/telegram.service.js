const BASE_URL = "https://api.telegram.org/bot";

export async function verifyBot(botToken) {
  const res = await fetch(`${BASE_URL}${botToken}/getMe`);
  return res.json();
}

export async function getChatInfo(botToken, chatId) {
  const res = await fetch(
    `${BASE_URL}${botToken}/getChat?chat_id=${chatId}`
  );
  return res.json();
}

export async function sendMessage(botToken, chatId, text, { parseMode = "Markdown", replyToMessageId } = {}) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
  };

  if (replyToMessageId) {
    body.reply_parameters = { message_id: replyToMessageId };
  }

  const res = await fetch(`${BASE_URL}${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getUpdates(botToken, chatId, { limit = 100, offset } = {}) {
  let url = `${BASE_URL}${botToken}/getUpdates?limit=${limit}&allowed_updates=${encodeURIComponent(JSON.stringify(["message"]))}`;
  if (offset !== undefined && offset !== null) {
    url += `&offset=${offset}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (!data.ok) {
    return { ok: false, error: data.description, updates: [] };
  }

  const updates = data.result
    .filter(
      (update) =>
        update.message && String(update.message.chat.id) === String(chatId)
    )
    .map((update) => ({
      updateId: update.update_id,
      messageId: update.message.message_id,
      from: {
        id: update.message.from.id,
        firstName: update.message.from.first_name,
        lastName: update.message.from.last_name || null,
        username: update.message.from.username || null,
        isBot: update.message.from.is_bot,
      },
      text: update.message.text || null,
      date: new Date(update.message.date * 1000).toISOString(),
      chat: {
        id: update.message.chat.id,
        title: update.message.chat.title || null,
        type: update.message.chat.type,
      },
    }));

  const maxUpdateId =
    data.result.length > 0
      ? Math.max(...data.result.map((u) => u.update_id))
      : null;

  return { ok: true, updates, maxUpdateId };
}
