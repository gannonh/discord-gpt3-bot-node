import { Events } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
console.log("Open IA API: ", process.env.OPENAI_API_KEY);

export const name = Events.MessageCreate;
export async function execute(message) {
  console.log("MessageCreate event executed");
  console.log("message.content: ", message.content);
  console.log("message.author: ", message.author);
  
}
