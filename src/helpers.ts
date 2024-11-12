import { window } from "vscode";

export function setInfoStatus(message: string) {
  return window.setStatusBarMessage(`[FFVA] [INFO] ${message}`, statusTimeout());
}

export function setWarningStatus(message: string) {
  return window.setStatusBarMessage(`[FFVA] [WARN] ${message}`, statusTimeout());
}

export function setErrorStatus(message: string) {
  return window.setStatusBarMessage(`[FFVA] [ERROR] ${message}`, statusTimeout());
}

function statusTimeout() {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(true); }, 5000)
  });
}
