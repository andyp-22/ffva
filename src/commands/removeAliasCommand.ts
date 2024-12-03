import { commands, Disposable } from "vscode";
import { pickAlias } from "../components/aliasPicker";
import { setInfoStatus, setErrorStatus } from "../statusBarHelpers";
import { state } from "../extension";
import * as extl from "../extensionLogger";

export const RemoveAliasCommand = "extension.removeAlias";

/*
 * Command: Removes an existing alias from state for the current workspace.
 */
export function removeAliasCommand() {
  return commands.registerCommand(RemoveAliasCommand, async () => {
    const logger = new extl.ExtensionLogger(
      extl.ActionTypes.Command,
      RemoveAliasCommand,
      "removeAliasCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      const aliases = state.getAliases();
      const alias = await pickAlias(aliases);
      if (alias) {
        logger.log(`Removing alias: ${alias.name}`);
        state.removeAlias(alias);
        logger.log("Done!");
        statusItems.push(setInfoStatus("Successfully removed existing alias!"));
      }
    }
    catch (x) {
      logger.log("An error occurred whilst trying to remove an existing alias from state.", x);
      statusItems.push(setErrorStatus("An error occurred whilst trying to remove an existing alias."));
    }
    finally {
      logger.endExecutionLog();
    }
  });
}
