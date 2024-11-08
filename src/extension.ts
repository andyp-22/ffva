import { ExtensionContext } from "vscode";
import * as ac from "./autoClean";
import * as au from "./autoUpdate";
import * as ffva from "./findFileViaAlias";

export function activate(context: ExtensionContext) {
  console.log("[Extension] FFVA (Find File Via Alias) is now active!");

  // Create and register autoCleanOnFileDelete disposables.
  const disposableautoCleanConfigCommand = ac.autoCleanConfigCommand();
  const disposableautoCleanHandler = ac.autoCleanHandler();
  context.subscriptions.push(disposableautoCleanConfigCommand);
  context.subscriptions.push(disposableautoCleanHandler);

  // Create and register AutoUpdateOnFileRename disposables.
  const disposableAutoUpdateConfigCommand = au.autoUpdateConfigCommand();
  const disposableAutoUpdateHandler = au.autoUpdateHandler();
  context.subscriptions.push(disposableAutoUpdateConfigCommand);
  context.subscriptions.push(disposableAutoUpdateHandler);

  // Create and register FindFileViaAlias disposables.
  const disposableNewAliasCommand = ffva.createAliasCommand();
  const disposableRemoveAliasCommand = ffva.removeAliasCommand();
  const disposablePurgeAliasesCommand = ffva.purgeAliasesCommand();
  const disposableFindFileViaAliasCommand = ffva.findFileViaAliasCommand();
  context.subscriptions.push(disposableNewAliasCommand);
  context.subscriptions.push(disposableRemoveAliasCommand);
  context.subscriptions.push(disposablePurgeAliasesCommand);
  context.subscriptions.push(disposableFindFileViaAliasCommand);
}

export function deactivate() {
  console.log("[Extension] FFVA (Find File Via Alias) is now deactivated!");
}
