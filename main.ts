// Modules to control application life and create native browser window
import { app, BrowserWindow, TouchBar } from "electron";
import * as Electron from "electron";
import path from "node:path";
import touchbarConfig from "./touchbar.json";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    transparent: true,
    frame: false,
  });

  // mainWindow.hide();

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  app.setName("Word");
  // createWindow()

  // app.on('activate', function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // })

  const win = createWindow();

  const touchbar = resolveTouchBar();

  win.setTouchBar(touchbar);
});

type Item = {
  name: string;
  content: string;
};

function resolveItem(item: Item) {
  const popover = new TouchBar.TouchBarPopover({
    label: item.name,
    showCloseButton: true,
    items: new TouchBar({
      items: [new TouchBar.TouchBarLabel({ label: item.content })],
    }),
  });
  return popover;
}

function resolveTouchBar() {
  const items: (Electron.TouchBarPopover | Electron.TouchBarButton)[] = [
    new TouchBar.TouchBarButton({
      icon: "./app/close-icon.png",
      iconPosition: "overlay",
      click() {
        app.quit();
      },
    }),
  ];

  touchbarConfig.forEach((e) => {
    const item = resolveItem(e);
    items.push(item);
  });

  const touchbar = new TouchBar({ items });
  return touchbar;
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
