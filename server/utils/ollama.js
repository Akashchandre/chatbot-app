const axios = require("axios");
const activeControllers = new Map();

function stopStream(chatId) {
  const controller = activeControllers.get(chatId);
  if (controller) {
    controller.abort();
    activeControllers.delete(chatId);
  }
}

async function generateResponse(chatId, prompt, onData, onEnd, onError) {
  const controller = new AbortController();
  activeControllers.set(chatId, controller);

  try {
    const res = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "tinyllama",
        prompt,
        stream: true,
      },
      {
        responseType: "stream",
        signal: controller.signal,
      }
    );

    res.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (let line of lines) {
        const json = JSON.parse(line);
        if (json.response) onData(json.response);
        if (json.done) {
          activeControllers.delete(chatId);
          onEnd();
        }
      }
    });

    res.data.on("end", () => {
      activeControllers.delete(chatId);
      onEnd();
    });

  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Stream aborted.");
    } else {
      console.error(error.message);
    }
    activeControllers.delete(chatId);
    onError(error);
  }
}

module.exports = { generateResponse, stopStream };
