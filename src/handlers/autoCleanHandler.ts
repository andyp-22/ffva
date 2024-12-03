import { Disposable, workspace } from "vscode";
import { DoAutoCleanConfigProperty } from "../commands/autoCleanConfigCommand";
import { setErrorStatus } from "../statusBarHelpers";
import { state } from "../extension";
import * as extl from "../extensionLogger";

/*
 * EventHandler: Listens for FileDeleteEvent events and attempts to automatically clean-up associated aliases for deleted files.
 */
export function autoCleanHandler() {
  return workspace.onDidDeleteFiles(async (fileDeleteEvent) => {
    const logger = new extl.ExtensionLogger(
      extl.ActionTypes.Handler,
      "FileDeleteEventHandler",
      "autoCleanHandler"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      // Check whether or not the feature is enabled.
      const featureEnabled = workspace
        .getConfiguration()
        .get<boolean>(DoAutoCleanConfigProperty, false);

      if (featureEnabled) {
        logger.log("Processing event...");
        const aliases = state.getAliases();
        if (aliases) {
          fileDeleteEvent.files.forEach((file) => {
            let alias = state.getAliasByUri(file);
            if (alias !== undefined) {
              state.removeAlias(alias);
              logger.log(`Removed alias: ${alias.name}`);
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
