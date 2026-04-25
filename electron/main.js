const {app, BrowserWindow, ipcMain, dialog} = require("electron");
const path = require("path");
const fs = require("fs");
const { globalShortcut } = require('electron');

let mainWindow;

function createWindow() {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 340,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    // TODO: 개발 중 디버깅을 위해 DevTools 자동 실행
    // 필요 없으면 주석 처리하거나 단축키로 열도록 변경
    mainWindow.webContents.openDevTools({mode: "detach"});
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.toggleDevTools();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function walkMarkdownFiles(dir) {
  const result = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, {withFileTypes: true});

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        result.push(fullPath);
      }
    }
  }

  walk(dir);
  return result;
}

function parseMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n').map((line) => line.trim());

  const title =
      lines.find((line) => line.startsWith('# '))?.replace(/^# /, '') ||
      path.basename(filePath, '.md');

  const questionLine =
      lines.find((line) => line.startsWith('Q.')) ||
      lines.find((line) => line.startsWith('- Q.')) ||
      '';

  const summaryIndex = lines.findIndex((line) => line.includes('한 줄 요약'));
  let summary = '';

  if (summaryIndex !== -1 && lines[summaryIndex + 1]) {
    summary = lines[summaryIndex + 1];
  }

  const answerHeaderIndex = lines.findIndex(
      (line) => line === '## 답변' || line === '### 답변'
  );

  let answer = '';
  if (answerHeaderIndex !== -1) {
    const answerLines = [];
    for (let i = answerHeaderIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('## ') || line.startsWith('### ')) {
        break;
      }
      if (line) {
        answerLines.push(line);
      }
    }
    answer = answerLines.join(' ');
  }

  // ⭐ 핵심: 짧은 요약 생성
  const shortAnswer = summarizeText(answer || summary, 80);

  return {
    filePath,
    title,
    question: questionLine.replace(/^- /, ''),
    summary,
    answer,
    shortAnswer,
    content: raw,
  };
}

function summarizeText(text, maxLength = 80) {
  if (!text) {
    return '';
  }

  // 줄바꿈 제거
  let clean = text.replace(/\n/g, ' ').trim();

  // 너무 길면 자르기
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength) + '...';
  }

  return clean;
}

ipcMain.handle("select-repo", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.canceled || !result.filePaths.length) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("load-notes", async (_, repoPath) => {
  try {
    const markdownFiles = walkMarkdownFiles(repoPath);
    const notes = markdownFiles.map(parseMarkdownFile);
    return {success: true, notes};
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to load notes.",
    };
  }
});

ipcMain.on("window-close", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.on("window-minimize", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});