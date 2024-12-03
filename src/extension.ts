import { ExtensionContext } from "vscode";
import { AliasesState } from "./aliasesState";
import { createAliasCommand } from "./commands/createAliasCommand";
import { removeAliasCommand } from "./commands/removeAliasCommand";
import { purgeAliasesCommand } from "./commands/purgeAliasesCommand";
import { findFileViaAliasCommand } from "./commands/findFileViaAliasCommand";
import { autoCleanConfigCommand } from "./commands/autoCleanConfigCommand";
import { autoUpdateConfigCommand } from "./commands/autoUpdateConfigCommand";
import { autoCleanHandler } from "./handlers/autoCleanHandler";
import { autoUpdateHandler } from "./handlers/autoUpdateHandler";

export function activate(context: ExtensionContext) {
  console.log("[Extension] FFVA (Find File Via Alias) is now active!");

  // Create a new AliasesState and assign it to `state` for export.
  state = new AliasesState(context.workspaceState);

  // Create and register autoCleanOnFileDelete disposables.
  const disposableautoCleanConfigCommand = autoCleanConfigCommand();
  context.subscriptions.push(disposableautoCleanConfigCommand);
  const disposableautoCleanHandler = autoCleanHandler();
  context.subscriptions.push(disposableautoCleanHandler);

  // Create and register AutoUpdateOnFileRename disposables.
  const disposableAutoUpdateConfigCommand = autoUpdateConfigCommand();
  context.subscriptions.push(disposableAutoUpdateConfigCommand);
  const disposableAutoUpdateHandler = autoUpdateHandler();
  context.subscriptions.push(disposableAutoUpdateHandler);

  // Create and register CreateAliasCommand disposable.
  const disposableCreateAliasCommand = createAliasCommand();
  context.subscriptions.push(disposableCreateAliasCommand);
  
  // Create and register RemoveAliasCommand disposable.
  const disposableRemoveAliasCommand = removeAliasCommand();
  context.subscriptions.push(disposableRemoveAliasCommand);
  
  // Create and register PurgeAliasesCommand disposable.
  const disposablePurgeAliasesCommand = purgeAliasesCommand();
  context.subscriptions.push(disposablePurgeAliasesCommand);
  
  // Create and register FindFileViaAliasCommand disposable.
  const disposableFindFileViaAliasCommand = findFileViaAliasCommand();
  context.subscriptions.push(disposableFindFileViaAliasCommand);
}

// Export the AliasesState to provide indirect access to the `context.workspaceState` from importing modules.
export let state: AliasesState;

export function deactivate() {
  console.log("[Extension] FFVA (Find File Via Alias) is now deactivated!");
}
