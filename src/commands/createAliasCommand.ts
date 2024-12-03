import { commands, window, Disposable } from "vscode";
import { setInfoStatus, setErrorStatus } from "../statusBarHelpers";
import { inputAliasName } from "../components/aliasNameInput";
import { Alias } from "../aliases";
import { state } from "../extension";
import * as extl from "../extensionLogger";

export const CreateAliasCommand = "extension.createAlias";

/*
 * Command: Adds a new alias into state for the current workspace.
 * The new alias will be associated with the currently active document in the text-editor window.
 */
export function createAliasCommand() {
  return commands.registerCommand(CreateAliasCommand, async () => {
    const logger = new extl.ExtensionLogger(
      extl.ActionTypes.Command,
      CreateAliasCommand,
      "createAliasCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      // Get alias from user input.
      const result = await inputAliasName();
      if (result) {
        const uri = window.activeTextEditor?.document.uri;
        if (uri) {
          logger.log(`Creating alias for file: ${uri.path}`);
          const alias: Alias = {
            name: result,
            uri: { fsPath: uri.fsPath, path: uri.path },
          };
          state.setAlias(alias);
          logger.log("Created new alias:", alias);
          statusItems.push(setInfoStatus("Successfully created new alias!"));
        }
        else {
          logger.log("No valid active document found to create an alias for.");
          statusItems.push(setErrorStatus("No valid active document found; Please open a document you wish to create an alias for, and try again."));
        }
      }
    }
    catch (x) {
      logger.log("An error occurred whilst trying to create a new alias.", x);
      statusItems.push(setErrorStatus("An error occurred whilst trying to create a new alias."));
    }
    finally {
      logger.endExecutionLog();
    }
  });
}
