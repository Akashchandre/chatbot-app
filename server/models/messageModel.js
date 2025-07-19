const db = require('../db');

exports.addMessage = async (chatId, role, content) => {
  const res = await db.query(
    'INSERT INTO messages(chat_id, role, content) VALUES($1, $2, $3) RETURNING *',
    [chatId, role, content]
  );
  return res.rows[0];
};

exports.getMessagesByChat = async (chatId) => {
  const res = await db.query(
    'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC',
    [chatId]
  );
  return res.rows;
};
