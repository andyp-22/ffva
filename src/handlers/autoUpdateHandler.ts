import { workspace, Disposable } from "vscode";
import { setErrorStatus } from "../statusBarHelpers";
import { DoAutoUpdateConfigProperty } from "../commands/autoUpdateConfigCommand";
import { state } from "../extension";
import * as extl from "../extensionLogger";

/*
 * EventHandler: Listens for FileRenameEvent events and attempts to automatically update associated aliases for changed files.
 */
export function autoUpdateHandler() {
  return workspace.onDidRenameFiles(async (fileRenameEvent) => {
    const logger = new extl.ExtensionLogger(
      extl.ActionTypes.Handler,
      "FileRenameEventHandler",
      "autoUpdateHandler"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      // Check whether or not the feature is enabled.
      const featureEnabled = workspace
        .getConfiguration()
        .get<boolean>(DoAutoUpdateConfigProperty, false);
      
      if (featureEnabled) {
        logger.log("Processing event...");
        const aliases = state.getAliases();
        if (aliases) {
          fileRenameEvent.files.forEach((file) => {
            let alias = state.getAliasByUri(file.oldUri);
            if (alias !== undefined) {
              alias.uri = file.newUri;
              state.setAlias(alias);
              logger.log(`Updated alias: ${alias.name}`);
            }
          });
          logger.log("Done!");
        }
        else {
          logger.log("Nothing to process.");
        }
      }
      else {
        logger.log("Feature disabled.");
      }
    }
    catch (x) {
      logger.log("An error occurred whilst trying to process the event.", x);
      statusItems.push(setErrorStatus("An error occurred whilst trying to process the event."));
    }
    finally {
      logger.endExecutionLog();
    }
  });
}
