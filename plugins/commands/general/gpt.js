import fetch from "node-fetch";

const config = {
  name: "gpt",
  aliases: ['ai'],
  description: "Get a response from the OpenAI chatbot",
  usage: "ask {query}",
  cooldown: 900,
  permissions: [0],
  credits: "",
  extra: {}
};

const langData = {
  "en_US": {
    "error": "An error occurred while fetching the response. Please try again later.",
    "processing": "⏳ Please wait...",
  }
};

const userCooldowns = {}; // Add a new object to store user-level cooldowns

async function onCall({ message, getLang, args }) {
  const userID = message.authorID; // Change threadID to userID to track user-level cooldowns

  // Check if the user is on cooldown
  if (userCooldowns[userID] && userCooldowns[userID] > Date.now()) {
    const remainingSeconds = Math.ceil((userCooldowns[userID] - Date.now()) / 1000);
      message.reply(`⌛ This command is on cooldown for ${remainingSeconds} more second(s) for you.\n✅ Remove this cooldown by availing my private bot.\nℹ️ Mention Cyrus for more info.`);
    return;
  }

  // Set the user's cooldown
  userCooldowns[userID] = Date.now() + 900 * 1000; // Set the cooldown to 900 seconds, which is 15 minutes
  
  try {
    const query = encodeURIComponent(args.join(' '));
    message.reply(getLang("processing"));
    const response = await fetch(`https://api.heckerman06.repl.co/api/other/openai-chat?newprompt=${query}`);
    const data = await response.json();
    let content = data.content.replace("[DONE]", "");
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
};
