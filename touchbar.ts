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

function setPrompt() {
  prompt = clipboard.readText();
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
    label: "Add to context",
  });

  const clearContextButton = new TouchBar.TouchBarButton({
    click() {
      context = [];
      refreshTouchBar(win);
    },
    label: "Clear context",
  });

  const setPromptButton = new TouchBar.TouchBarButton({
    click: setPrompt,
    label: "Set prompt",
  });

  const askAIButton = new TouchBar.TouchBarButton({
    click: () => askAI(prompt, context, win),
    label: "Ask",
  });

  const loadLastPromptButton = new TouchBar.TouchBarButton({
    click() {
      const lastPromptData = fs.readFileSync("./last-prompt.json", "utf-8");
      const lastPrompt = JSON.parse(lastPromptData);
      context = lastPrompt.context;
      prompt = lastPrompt.prompt;

      refreshTouchBar(win);
    },
    label: "Load last prompt",
  });

  // const showContextButton = new TouchBar.TouchBarPopover({
  //   showCloseButton: true,
  //   label: "Show context",
  //   items: new TouchBar({
  //     items: context.map(
  //       (c) => new TouchBar.TouchBarLabel({ label: c, textColor: "#fff" })
  //     ),
  //   }),
  // });
  return {
    items: [
      new TouchBar.TouchBarLabel({
        label: `${context.length} context${context.length > 1 ? "s" : ""}`,
      }),
      addToContextButton,
      clearContextButton,
      setPromptButton,
      loadLastPromptButton,
      askAIButton,
    ],
  };
}

// Give me 5 names that i can give to my baby
