import fetch from "node-fetch";

const config = {
  name: "bard",
  aliases: [],
  description: "Get a response from the OpenAI chatbot",
  usage: "ask {query}",
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
  const userID = message.authorID; // Add userID to the variables

  // Check if the user is on cooldown
  if (userCooldowns[userID] && userCooldowns[userID] > Date.now()) {
      const remainingSeconds = Math.ceil((userCooldowns[userID] - Date.now()) / 1000);
      message.reply(`⌛ This command is on cooldown for ${remainingSeconds} more second(s) for you.\n✅ Remove this cooldown by availing my private bot.\nℹ️ Mention Cyrus for more info.`);
      return;
  }

  // Set the user cooldown
  userCooldowns[userID] = Date.now() + 900 * 1000; // Set the cooldown to 120 seconds
  
  try {
    const query = encodeURIComponent(args.join(' ')); // only encode the text for URL
    message.reply(getLang("processing")); // Send a message if the prompt is currently processing
    const response = await fetch(`https://api.heckerman06.repl.co/api/other/bard-ai?prompt=${query}&token=XQjSIodG8KPMtR8Pva3-LA5ChPW7u1ZlvfpEEP47ImvrgMIBTbBsjQ4z70pyPc6Ps_f-4A.`);
    const data = await response.json();
    const content = data.content2; // only send the "result" from api
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
