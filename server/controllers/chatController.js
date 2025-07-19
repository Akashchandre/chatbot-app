const { createChat, getAllChats, getChatById } = require("../models/chatModel");
const { addMessage, getMessagesByChat } = require("../models/messageModel");
const { generateResponse, stopStream } = require("../utils/ollama");

exports.createChatHandler = async (req, res) => {
  const chat = await createChat(req.body.title || "New Chat");
  res.json(chat);
};

exports.getAllChatsHandler = async (req, res) => {
  const chats = await getAllChats();
  res.json(chats);
};

exports.getChatMessagesHandler = async (req, res) => {
  const messages = await getMessagesByChat(req.params.chatId);
  res.json(messages);
};

exports.sendMessageHandler = async (req, res) => {
  const { content } = req.body;
  const { chatId } = req.params;

  await addMessage(chatId, "user", content);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let buffer = "";

  generateResponse(
    chatId,
    content,
    async (chunk) => {
      buffer += chunk;
      res.write(chunk);
    },
    async () => {
      await addMessage(chatId, "assistant", buffer);
      res.end();
    },
    (err) => {
      res.write("error");
      res.end();
    }
  );
};

exports.stopGenerationHandler = (req, res) => {
  const { chatId } = req.params;
  stopStream(chatId);
  res.json({ message: "Stopped." });
};
exports.updateChatTitleHandler = async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;

  try {
    await require("../db").query(
      "UPDATE chats SET title = $1 WHERE id = $2",
      [title, chatId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating title:", err);
    res.status(500).json({ error: "Failed to update title" });
  }
};

