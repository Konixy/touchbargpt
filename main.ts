// Modules to control application life and create native browser window
import { app, BrowserWindow, TouchBar } from "electron";
import * as Electron from "electron";
import { createTouchbar } from "./touchbar";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    transparent: true,
    frame: false,
  });

  return mainWindow;
}

app.whenReady().then(() => {
  app.setName("Word");

  const win = createWindow();

  refreshTouchBar(win);
});

export function refreshTouchBar(win: BrowserWindow) {
  win.setTouchBar(
    new TouchBar({
      items: [
        new TouchBar.TouchBarGroup({
          items: new TouchBar(createTouchbar(win)),
        }),
      ],
    })
  );
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
