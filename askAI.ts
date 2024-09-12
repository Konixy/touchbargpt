import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import { loading } from "./touchbar";
import { clipboard, TouchBar } from "electron";
import { refreshTouchBar } from "./main";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function askAI(
  prompt: string,
  context: string[],
  win: Electron.BrowserWindow
) {
  fs.writeFileSync("./last-prompt.json", JSON.stringify({ prompt, context }));

  const promptContent = `La question est : ${prompt}${
    context.length > 0
      ? `\n\nDocuments et contextes sur lequels s'appuyer pour répondre a la question :\n\n${context.join(
          "\n\n"
        )}`
      : ""
  }`;

  loading(win);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Tu est un professeur de lycée, et un élève. Provide response as minimal as possible and in juste one sentence.",
      },
      {
        role: "user",
        content: promptContent,
      },
    ],
  });

  // const delay = new Promise((resolve) =>
  //   setTimeout(() => {
  //     resolve(null);
  //   }, 1000)
  // );

  // await delay;

  console.log(completion);

  win.setTouchBar(
    new TouchBar({
      items: [
        new TouchBar.TouchBarButton({
          label: "Go back to main menu",
          click() {
            refreshTouchBar(win);
          },
        }),
        new TouchBar.TouchBarButton({
          label: "Copy response",
          click() {
            clipboard.writeText(completion.choices[0].message.content || "");
          },
        }),
      ],
    })
  );
}
