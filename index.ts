import { config } from 'dotenv';
config();

import { Fint } from "./src";
import * as process from 'process';

if (!process.env.TOKEN) throw new Error("Bot token is required");
const token: string = process.env.TOKEN;

const bot = new Fint(token);

bot.start();

bot.hears("salom", (msg: { chat: { id: number }, text: string }, ctx: Fint) => {
    ctx.sendMessage(msg.chat.id, "Xayr")
});