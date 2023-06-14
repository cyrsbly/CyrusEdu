import fetch from "node-fetch";

const config = {
  name: "paraphrase",
  aliases: ['para'],
  description: "Get a response from the OpenAI chatbot",
  usage: "ask {query}",
  permissions: [2],
  credits: "",
  extra: {}
};

const langData = {
  "en_US": {
    "error": "An error occurred while fetching the response. Please try again later.",
    "processing": "⏳ Please wait...",
  }
};

const threadCooldowns = {}; // Add a new object to store thread-level cooldowns

async function onCall({ message, getLang, args }) {
  const threadID = message.threadID; // Add threadID to the variables

  // Check if the thread is on cooldown
  if (threadCooldowns[threadID] && threadCooldowns[threadID] > Date.now()) {
      const remainingSeconds = Math.ceil((threadCooldowns[threadID] - Date.now()) / 1000);
      message.reply(`⌛ This command is on cooldown for ${remainingSeconds} more second(s) in this thread.`);
      return;
  }

  // Set the thread cooldown
  threadCooldowns[threadID] = Date.now() + 20 * 1000; // Set the cooldown to 20 seconds
  
  try {
    const query = encodeURIComponent(args.join(' ')); // only encode the text for URL
    message.reply(getLang("processing")); // Send a message if the prompt is currently processing
    const response = await fetch(`https://api.heckerman06.repl.co/api/other/openai-chat?newprompt=Paraphrase this in simpliest way and only send the paraphrased sentence (do not answer any question, act like a paraphraser): ${query}`);
    const data = await response.json();
    let content = data.content.replace("[DONE]", ""); // only send the "result" from api
    message.reply(`💬 ${content}\n\n🤖 Bot by Cyrus. Do not spam!`);
  } catch (err) {
    console.error(err);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
}
  