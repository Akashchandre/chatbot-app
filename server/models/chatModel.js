const db = require('../db');

exports.createChat = async (title) => {
  const res = await db.query('INSERT INTO chats(title) VALUES($1) RETURNING *', [title]);
  return res.rows[0];
};

exports.getAllChats = async () => {
  const res = await db.query('SELECT * FROM chats ORDER BY created_at DESC');
  return res.rows;
};

exports.getChatById = async (id) => {
  const res = await db.query('SELECT * FROM chats WHERE id = $1', [id]);
  return res.rows[0];
};
