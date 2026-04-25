const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	selectRepo: () => ipcRenderer.invoke("select-repo"),
	loadNotes: (repoPath) => ipcRenderer.invoke("load-notes", repoPath),
	closeWindow: () => ipcRenderer.send("window-close"),
	minimizeWindow: () => ipcRenderer.send("window-minimize"),
});
