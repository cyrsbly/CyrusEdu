import fetch from "node-fetch";

const config = {
  name: "grammar",
  aliases: ['check'],
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

const userCooldowns = {}; // Add a new object to store user-level cooldowns

async function onCall({ message, getLang, args }) {
  const userID = message.authorID; // Change threadID to userID to track user-level cooldowns

  // Check if the user has exceeded the daily limit of 10 calls
  if (userCooldowns[userID] && userCooldowns[userID].calls >= 10) {
    message.reply(`🚫 You have exceeded the maximum daily usage limit of 10 calls for this command.`);
    return;
  }

  // Check if the user is on cooldown, based on their first call of the day
  const today = new Date().toLocaleDateString();
  if (userCooldowns[userID] && userCooldowns[userID].date === today && userCooldowns[userID].time > Date.now()) {
    const remainingSeconds = Math.ceil((userCooldowns[userID].time - Date.now()) / 1000);
    message.reply(`⌛ This command is on cooldown for ${remainingSeconds} more second(s) for you today.`);
    return;
  }

  // Set the user's cooldown
  userCooldowns[userID] = {
    date: today,
    calls: (userCooldowns[userID] ? userCooldowns[userID].calls + 1 : 1),
    time: Date.now() + (5 * 1000), // Set the cooldown to 5 seconds
  };

  try {
    const query = encodeURIComponent(args.join(' '));
    message.reply(getLang("processing"));
    const response = await fetch(`https://api.heckerman06.repl.co/api/other/openai-chat?newprompt=Fix my grammar and only send the correct sentence: ${query}`);
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
