import { commands, ConfigurationTarget, window, workspace, Disposable } from "vscode";
import { setErrorStatus, setInfoStatus } from "../statusBarHelpers";
import * as extl from "../extensionLogger";

// Auto-update Constants
export const DoAutoUpdateConfigProperty = "ffva.config.doAutoUpdate";
export const ConfigAutoUpdateCommand = "extension.configAutoUpdate";

/*
 * Command: Allows the user to enable or disable the automatic update of aliases on FileRenameEvent events.
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
              description: "Enable automatic updates of aliases when renaming or moving files",
              target: true,
            },
            {
              label: "Disable",
              description: "Disable automatic updates of aliases when renaming or moving files",
              target: false,
            },
          ],
          { placeHolder: `Select Enable or Disable to toggle the "autoUpdateOnFileRename" feature on or off` }
        );

        if (target && value) {
          await workspace
            .getConfiguration()
            .update(
              DoAutoUpdateConfigProperty,
              value.target,
              target.target
            );

          logger.log(`Successfully updated configuration (${target.target} = ${value.target})`);
          statusItems.push(setInfoStatus("Successfully updated configuration."));
        }
        else {
          logger.log("Required values for 'value' and/or 'target' were undefined.");
        }
      }
      catch (x) {
        logger.log("An error occurred whilst trying to update the configuration.", x);
        statusItems.push(setErrorStatus("An error occurred whilst trying to update the configuration."));
      }
      finally {
        logger.endExecutionLog();
      }
    }
  );
}
