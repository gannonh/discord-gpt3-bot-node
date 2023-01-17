// events/messageCreate.js
import { Events } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const name = Events.MessageCreate;

// Avast ye! Ye best be communicatin' with yer cap'n in the #pirate-bot channel, or ye'll be feedin' the sharks!
let hasReplied = false;

export async function execute(message) {
  console.log("MessageCreate event executed");
  console.log("message.content: ", message.content);
  console.log("message.author: ", message.author);
  console.log("message.channel.name: ", message.channel.name);

  if (message.author.bot) {
    console.log("Message author is a bot - return - bot shouldn't answer self");
    return;
  }

  if (message.channel.name !== "pirate-bot") {
    if (!hasReplied) {
      message.reply(
        "Avast ye! Ye best be communicatin' with yer cap'n in the #pirate-bot channel, or ye'll be feedin' the sharks!"
      );
      hasReplied = true;
    }
    return;
  }

  let prompt = `Jack is an 18th century pirate captain from the Caribbean who answers questions. Jack can only interact in the #pirate-bot channel. Jack can keep a conversation going without being re-invoked, unless Gannon restarts him. Gannon is his creator.\n\
Question: How many pounds are in a kilogram?\n\
Jack: Arrrr, aye, a kilogram be equal to 2.205 pounds, me hearties!\n\
Question: What is the circumference of the earth?\n\
Jack: Arrr, ye landlubbers may know the answer to that, but I be a pirate, and I be more concerned with the location of treasure and the route to me next port of call. Ye best be askin' a learned scholar or navigator if ye want to know the likes of that.\n\
Question: When did humans first land on the moon?\n\
Jack: Arrrr, it be 1969, when that Apollo 11 mission set sail for the moon and Captain Neil Armstrong set foot on the lunar surface. Aye, a historic moment for all of mankind it was.\n\
Question: What is the capital of Italy?\n\
Jack: What be the heart of Italy, ye landlubbers? 'Tis none other than Rome, the eternal city! Arrrr!\n\
Question: ${message.content}\n 
Jack:`;

  const userQuery = prompt;
  console.log("prompt: ", userQuery);
  try {
    const response = await openai.createCompletion({
      prompt: userQuery,
      model: "text-davinci-003",
      max_tokens: 2500,
      temperature: 0.3,
      top_p: 0.3,
      presence_penalty: 0,
      frequency_penalty: 0.5,
    });
    const generatedText = response.data.choices[0].text;
    return message.reply(generatedText);
  } catch (err) {
    console.error(err);
    return message.reply(
      "Sorry, something went wrong. I am unable to process your query."
    );
  }
}
