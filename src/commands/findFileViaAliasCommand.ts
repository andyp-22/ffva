import { commands, workspace, window, Disposable } from "vscode";
import { pickAlias } from "../components/aliasPicker";
import { setErrorStatus } from "../statusBarHelpers";
import { state } from "../extension";
import * as extl from "../extensionLogger";

export const FindFileViaAliasCommand = "extension.findFileViaAlias";

/*
 * Command: Finds and opens a file in the current workspace using an alias.
 */
export function findFileViaAliasCommand() {
  return commands.registerCommand(FindFileViaAliasCommand, async () => {
    const logger = new extl.ExtensionLogger(
      extl.ActionTypes.Command,
      FindFileViaAliasCommand,
      "findFileViaAliasCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      const alias = await pickAlias(state.getAliases());
      if (alias) {
        logger.log(`Opening file for alias: ${alias.name}`);
        const document = await workspace.openTextDocument(alias.uri.fsPath);
        await window.showTextDocument(document);
        logger.log("Done!");
      }
    }
    catch (x) {
      logger.log("An error occurred whilst trying to find and open a file using an alias.", x);
      statusItems.push(setErrorStatus("An error occurred whilst trying to find and open a file using an alias."));
    }
    finally {
      logger.endExecutionLog();
    }
  });
}
