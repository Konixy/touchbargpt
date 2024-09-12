import {
  BrowserWindow,
  TouchBar,
  TouchBarConstructorOptions,
  clipboard,
} from "electron";
import { refreshTouchBar } from "./main";
import askAI from "./askAI";
import fs from "fs";

let context: string[] = [];
let prompt = "";

function addToContext(win: BrowserWindow) {
  context.push(clipboard.readText());
  refreshTouchBar(win);
}

function setPrompt(win) {
  prompt = clipboard.readText();
  refreshTouchBar(win);
}

export function loading(win: BrowserWindow) {
  win.setTouchBar(
    new TouchBar({
      items: [new TouchBar.TouchBarLabel({ label: "Loading..." })],
    })
  );
}

export function createTouchbar(win: BrowserWindow): TouchBarConstructorOptions {
  const addToContextButton = new TouchBar.TouchBarButton({
    click: () => addToContext(win),
    label: "Add",
  });

  const clearButton = new TouchBar.TouchBarButton({
    click() {
      context = [];
      prompt = "";
      refreshTouchBar(win);
    },
    label: "Clear",
    enabled: context.length > 0 || prompt !== "",
  });

  const setPromptButton = new TouchBar.TouchBarButton({
    click: () => setPrompt(win),
    label: "Set prompt",
  });

  const askAIButton = new TouchBar.TouchBarPopover({
    label: "Ask",
    showCloseButton: true,
    items: new TouchBar({
      items: [
        new TouchBar.TouchBarSpacer({ size: "flexible" }),
        new TouchBar.TouchBarButton({
          label: "Normal response",
          enabled: prompt !== "",
          click: () => askAI(prompt, context, false, win),
        }),
        new TouchBar.TouchBarButton({
          label: "Short response",
          enabled: prompt !== "",
          click: () => askAI(prompt, context, true, win),
        }),
        new TouchBar.TouchBarSpacer({ size: "flexible" }),
      ],
    }),
  });

  // DEV ONLY

  // const loadLastPromptButton = new TouchBar.TouchBarButton({
  //   click() {
  //     try {
  //       const lastPromptData = fs.readFileSync("./last-prompt.json", "utf-8");
  //       const lastPrompt = JSON.parse(lastPromptData);
  //       context = lastPrompt.context;
  //       prompt = lastPrompt.prompt;
  //     } catch (err) {
  //       console.log(err);
  //     }

  //     refreshTouchBar(win);
  //   },
  //   label: "Load last prompt",
  // });

  return {
    items: [
      new TouchBar.TouchBarLabel({
        label: `${context.length} context${context.length > 1 ? "s" : ""}`,
      }),
      new TouchBar.TouchBarSpacer({ size: "flexible" }),
      addToContextButton,
      clearButton,
      setPromptButton,
      // loadLastPromptButton,
      new TouchBar.TouchBarSpacer({ size: "flexible" }),
      prompt && prompt !== ""
        ? askAIButton
        : new TouchBar.TouchBarButton({ label: "Ask", enabled: false }),
    ],
  };
}
