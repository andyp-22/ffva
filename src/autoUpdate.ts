import { commands,  window, workspace, ConfigurationTarget, FileRenameEvent, Disposable } from "vscode";
import { setInfoStatus, setErrorStatus } from "./helpers";
import { getConfiguredAliases, updateConfiguredAliases, AliasEntry } from "./aliases";
import { DoAutoUpdateConfigProperty, ConfigAutoUpdateCommand } from "./constants";
import * as extl from "./logger";

/*
 * Command: Allows the user to enable or disable the automatic update of alias entries on FileRenameEvent events.
 */
export function autoUpdateConfigCommand() {
  return commands.registerCommand(
    ConfigAutoUpdateCommand,
    async () => {
      const logger = new extl.ExtensionLogger(
        extl.ActionTypes.Command,
        ConfigAutoUpdateCommand,
        "autoUpdateConfigCommand"
      );
      logger.beginExecutionLog();
      const statusItems: Disposable[] = [];
      try {
        // Let the user choose which configuration to update.
        const target = await window.showQuickPick(
          [
            {
              label: "User",
              description: "User Settings",
              target: ConfigurationTarget.Global,
            },
            {
              label: "Workspace",
              description: "Workspace Settings",
              target: ConfigurationTarget.Workspace,
            },
          ],
          { placeHolder: "Select the settings to update" }
        );

        // Let the user choose the boolean value to set.
        const value = await window.showQuickPick(
          [
            {
              label: "Enable",
              description:
                "Enable automatic updates of aliases when renaming or moving files",
              target: true,
            },
            {
              label: "Disable",
              description:
                "Disable automatic updates of aliases when renaming or moving files",
              target: false,
            },
          ],
          {
            placeHolder: `Select Enable or Disable to toggle the "autoUpdateOnFileRename" feature on or off`,
          }
        );
        if (target && value) {
          await workspace
            .getConfiguration()
            .update(
              DoAutoUpdateConfigProperty,
              value.target,
              target.target
            );
          logger.log(
            `Successfully updated configuration (${target.target} = ${value.target})`
          );
          statusItems.push(
            setInfoStatus("Successfully updated configuration.")
          );
        } else {
          logger.log(
            "Required values for 'value' and/or 'target' were undefined."
          );
        }
      } catch (x) {
        logger.log(
          "An error occurred whilst trying to update the configuration.",
          x
        );
        statusItems.push(
          setErrorStatus(
            "An error occurred whilst trying to update the configuration."
          )
        );
      } finally {
        logger.endExecutionLog();
      }
    }
  );
}

/*
 * EventHandler: Listens for FileRenameEvent events and attempts to automatically update associated alias entries for changed files.
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
        logger.log("Feature enabled. Processing event...");
        const aliases = getConfiguredAliases();
        if (aliases) {
          // Check event for files with alias entries that need to be updated.
          if (anyUpdatesRequired(aliases, fileRenameEvent)) {
            logger.log("Found aliases requiring updating.");

            // Update the alias entries.
            const updatedAliases: AliasEntry[] = updateStaleAliases(
              aliases,
              fileRenameEvent
            );

            // Update configuration with the updated alias entries array.
            await updateConfiguredAliases(updatedAliases);
          } else {
            logger.log("No aliases require updating.");
          }
        } else {
          logger.log("No aliases found, nothing to update.");
        }
      } else {
        logger.log("Feature disabled. Nothing to process.");
      }
    } catch (x) {
      logger.log("An error occurred whilst trying to process the event.", x);
      statusItems.push(
        setErrorStatus("An error occurred whilst trying to process the event")
      );
    } finally {
      logger.endExecutionLog();
    }
  });
}

/*
 * Checks whether the FileRenameEvent contains changes to any files with an associated alias.
 */
function anyUpdatesRequired(
  entries: AliasEntry[],
  event: FileRenameEvent
): boolean {
  return entries.some((entry) => {
    // Check equality using the fspath, as this is what we're interested in.
    return event.files.some((file) => entry.uri.fsPath === file.oldUri.fsPath);
  });
}

/*
 * Maps all of the alias entries, updating the uri for any entries associated with a file from the event, and returns the updated array.
 */
function updateStaleAliases(
  entries: AliasEntry[],
  event: FileRenameEvent
): AliasEntry[] {
  entries = entries.map((entry) => {
    event.files.forEach((file) => {
      // Again, check equality using the uri.fspath property.
      // However, update the entry by replacing the whole uri object.
      if (entry.uri.fsPath === file.oldUri.fsPath) {
        entry.uri = { fsPath: file.newUri.fsPath, path: file.newUri.path };
      }
    });
    return entry;
  });
  return entries;
}
