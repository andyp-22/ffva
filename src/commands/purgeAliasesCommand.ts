import { commands, window, Disposable } from "vscode";
import { setInfoStatus, setErrorStatus } from "../statusBarHelpers";
import { state } from "../extension";
import * as extl from "../extensionLogger";

export const PurgeAliasesCommand = "extension.purgeAliases";

/*
 * Command: Allows the user to purge all of the aliases from state for the current workspace.
 */
export function purgeAliasesCommand() {
  return commands.registerCommand(PurgeAliasesCommand, async () => {
    const logger = new extl.ExtensionLogger(
      extl.ActionTypes.Command,
      PurgeAliasesCommand,
      "purgeAliasesCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      // Provide a warning and seek confirmation input from user before purging aliases.
      const confirm = await window.showWarningMessage("[FFVA] Are you sure you want to purge all existing aliases? WARNING: This cannot be undone.", "Confirm");
      if (confirm) {
        const result = await window.showInputBox({
          placeHolder: `Type "Confirm" to purge all existing aliases. WARNING: This cannot be undone.`,
          validateInput: (text) => { return text === "Confirm" ? null : `Type "Confirm" to purge all aliases.`; },
        });
        // Verifying that the result is truthy and equals the confirmation phrase before proceeding.
        if (result === "Confirm") {
          state.purgeAliases();
          statusItems.push(setInfoStatus("Successfully purged all aliases from configuration."));
        } else {
          logger.log("Confirmation unsuccessful. Aborting purge operation.");
        }
      }
    }
    catch (x) {
      logger.log("An error occurred whilst trying to purge all aliases from configuration.", x);
      statusItems.push(setErrorStatus("An error occurred whilst trying to purge all aliases."));
    }
    finally {
      logger.endExecutionLog();
    }
  });
}
