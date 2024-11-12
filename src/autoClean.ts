import { Disposable, ConfigurationTarget, FileDeleteEvent, commands, window, workspace } from "vscode";
import { setInfoStatus, setWarningStatus, setErrorStatus } from "./helpers";
import { getConfiguredAliases, updateConfiguredAliases, AliasEntry } from "./aliases";
import { DoAutoCleanConfigProperty, ConfigAutoCleanCommand } from "./constants";
import * as extl from "./logger";

/*
 * Command: Allows the user to enable or disable the automatic clean up of alias entries on FileDeleteEvent events.
 */
export function autoCleanConfigCommand() {
  return commands.registerCommand(
    ConfigAutoCleanCommand,
    async () => {
      const logger = new extl.ExtensionLogger(
        extl.ActionTypes.Command,
        ConfigAutoCleanCommand,
        "autoCleanConfigCommand"
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
          { placeHolder: "Select the settings to update." }
        );

        // Let the user choose the boolean value to set.
        const value = await window.showQuickPick(
          [
            {
              label: "Enable",
              description:
                "Enable automatic clean-up of aliases when deleting files.",
              target: true,
            },
            {
              label: "Disable",
              description:
                "Disable automatic clean-up of aliases when deleting files.",
              target: false,
            },
          ],
          {
            placeHolder: `Select Enable or Disable to toggle the "autoCleanOnFileDelete" feature on or off.`,
          }
        );

        if (target && value) {
          await workspace
            .getConfiguration()
            .update(
              DoAutoCleanConfigProperty,
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
 * EventHandler: Listens for FileDeleteEvent events and attempts to automatically clean-up associated alias entries for deleted files.
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
        const aliases = getConfiguredAliases();

        if (aliases) {
          // Check event for files with alias entries that need to be cleaned up.
          if (anyCleanupRequired(aliases, fileDeleteEvent)) {
            logger.log("Found aliases which require cleaning-up.");
            // Clean up the alias entries.
            const cleanedAliases: AliasEntry[] = cleanupStaleAliases(
              aliases,
              fileDeleteEvent
            );
            if (cleanedAliases.length !== aliases.length) {
              // Update the configuration with the cleaned up alias entries array.
              await updateConfiguredAliases(cleanedAliases);
            } else {
              logger.log(
                "Aliases requiring clean-up were found, but the filtered array did not change in length; The configuration may contain stale aliases."
              );
              statusItems.push(
                setWarningStatus(
                  "Automatic alias clean-up was unsuccessful; The configuration may contain stale aliases."
                )
              );
            }
          } else {
            logger.log("No aliases require cleaning-up.");
          }
        } else {
          logger.log("No aliases found, nothing to clean-up.");
        }
      } else {
        logger.log("Feature disabled, nothing to process.");
      }
    } catch (x) {
      logger.log("An error occurred whilst trying to process the event.", x);
    } finally {
      logger.endExecutionLog();
    }
  });
}

/*
 * Checks whether the FileDeleteEvent contains any files with an associated alias.
 */
function anyCleanupRequired(
  entries: AliasEntry[],
  event: FileDeleteEvent
): boolean {
  return entries.some((entry) => {
    // Check equality using the fspath, as this is what we're interested in.
    return event.files.some((file) => entry.uri.fsPath === file.fsPath);
  });
}

/*
 * Filters all of the alias entries associated with a file from the event, and returns the filtered array.
 */
function cleanupStaleAliases(
  entries: AliasEntry[],
  event: FileDeleteEvent
): AliasEntry[] {
  entries = entries.filter((entry) => {
    // Again, check equality using the uri.fspath property.
    // However, there's no need to update the uri object as the whole entry will be filtered from the array.
    return !event.files.some((file) => entry.uri.fsPath === file.fsPath);
  });
  return entries;
}
