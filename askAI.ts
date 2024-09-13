import OpenAI from "openai";
import fs from "fs";
import { loading } from "./touchbar";
import { clipboard, TouchBar } from "electron";
import { refreshTouchBar } from "./main";
import { apiKey } from "./api-key.json";
const openai = new OpenAI({ apiKey });

export default async function askAI(
  prompt: string,
  context: string[],
  shortResponse: boolean,
  win: Electron.BrowserWindow
) {
  // DEV ONLY

  // fs.writeFileSync("./last-prompt.json", JSON.stringify({ prompt, context }));

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
        content: `Tu est un élève de terminale au lycée, tu dois répondre a une question lors d'une évaluation.${
          shortResponse
            ? " Répond a cette question en une phrase seulement et en allant droit au but."
            : " Répond a cette question en allant droit au but."
        }`,
      },
      {
        role: "user",
        content: promptContent,
      },
    ],
  });

  console.log(completion);

  win.setTouchBar(
    new TouchBar({
      items: [
        new TouchBar.TouchBarSpacer({ size: "flexible" }),
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
        new TouchBar.TouchBarSpacer({ size: "flexible" }),
      ],
    })
  );
}
