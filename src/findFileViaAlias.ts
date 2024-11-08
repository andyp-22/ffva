import { commands, window, workspace, Disposable } from "vscode";
import {
  ExtensionLogger,
  ActionTypes,
  setInfoStatus,
  setErrorStatus,
} from "./helpers";
import {
  getConfiguredAliases,
  updateConfiguredAliases,
  AliasEntry,
  AliasItem,
} from "./aliases";

const CreateAliasCommandName = "extension.createAlias";
const RemoveAliasCommandName = "extension.removeAlias";
const FindFileViaAliasCommandName = "extension.findFileViaAlias";
const PurgeAliasesCommandName = "extension.purgeAliases";

/*
 * Command: Adds a new alias entry into configuration for the current workspace.
 * The new alias will be associated with the file document from the currently active text-editor window.
 */
export function createAliasCommand() {
  return commands.registerCommand(CreateAliasCommandName, async () => {
    const logger = new ExtensionLogger(
      ActionTypes.Command,
      CreateAliasCommandName,
      "createAliasCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      // Get alias from user input.
      const result = await inputAliasName();
      if (result) {
        let aliases = getConfiguredAliases();
        const uri = window.activeTextEditor?.document.uri;
        if (uri) {
          logger.log("File uri found:", uri.path);

          // Add a new alias entry to the aliases array,
          // using the alias gathered from user input and the uri of the current text-editor document.
          const alias: AliasEntry = {
            alias: result,
            uri: { fsPath: uri.fsPath, path: uri.path },
          };
          aliases.push(alias);
          await updateConfiguredAliases(aliases);
          statusItems.push(
            setInfoStatus(
              "Successfully created new alias!"
            )
          );
        } else {
          logger.log(
            "No active document/text-editor found to create an alias for."
          );
          statusItems.push(
            setErrorStatus(
              "No active document/text-editor found; Please open the file you want to create an alias for, and try again."
            )
          );
        }
      }
    } catch (x) {
      logger.log("An error occurred whilst trying to create a new alias.", x);
      statusItems.push(
        setErrorStatus("An error occurred whilst trying to create a new alias.")
      );
    } finally {
      logger.endExecutionLog();
    }
  });
}

/*
 * Command: Removes an existing alias entry from configuration for the current workspace.
 */
export function removeAliasCommand() {
  return commands.registerCommand(RemoveAliasCommandName, async () => {
    const logger = new ExtensionLogger(
      ActionTypes.Command,
      RemoveAliasCommandName,
      "removeAliasCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      const aliases = getConfiguredAliases();

      // Allow the user to select an alias from a dynamic QuickPick menu.
      const alias = await pickAlias(aliases);
      if (alias) {
        const updatedAliases = aliases.filter((item) => item !== alias);
        await updateConfiguredAliases(updatedAliases);
        statusItems.push(setInfoStatus("Successfully removed existing alias!"));
      }
    } catch (x) {
      logger.log(
        "An error occurred whilst trying to remove an existing alias.",
        x
      );
      statusItems.push(
        setErrorStatus(
          "An error occurred whilst trying to remove an existing alias."
        )
      );
    } finally {
      logger.endExecutionLog();
    }
  });
}

/*
 * Function to gather a valid alias from user input.
 */
async function inputAliasName() {
  const aliases = getConfiguredAliases();
  const result = await window.showInputBox({
    placeHolder: "Type in a name for the alias",
    validateInput: (text) => {
      return validateAliasName(aliases, text);
    },
  });
  console.log(`[FFVA] Alias name from input: ${result}`);
  return result;
}

/*
 * Function to validate the alias captured by text inputs.
 *  - Alias name should not be falsy, an alias entry requires an alias value.
 *  - Alias name should not exceed 12 characters in length (long aliases would defeat the purpose of this extension).
 *  - Alias name should not already exist in the configuration.
 *
 *
 * Note:
 * Returning multiple valdiation result messages here may be redundant, as it is either unlikely or impossible to
 * fail multiple of these specific validation checks when inputting text.
 *
 *  - If the input text is falsy, its length will be less than 12.
 *  - If the input text length is greater than 12, then it won't be falsy.
 *  - Assuming the previous two conditions, if the input text matches an existing valid alias
 *    then the input text should also be neither falsy nor greater than 12.
 *
 * However, multiple of these validation conditions can be failed if an otherwise invalid alias entry
 * is manually added to the configuration, in which case the user knows what they did and brought this
 * upon themselves!
 *
 */
function validateAliasName(aliases: AliasEntry[], text: string): string | null {
  let messages: string[] = [];
  if (!text) {
    messages.push("* Alias is required");
  }
  if (text.length > 12) {
    messages.push(
      `* Length must not exceed 12 characters (length = ${text.length})`
    );
  }
  if (aliasNameExists(aliases, text)) {
    messages.push("* An entry with this alias already exists");
  }
  return messages.length !== 0 ? messages.toString() : null;
}

/*
 * Function to check if the configuration already contains an entry with this alias name.
 */
function aliasNameExists(aliases: AliasEntry[], alias: string): boolean {
  let exists: boolean = false;
  if (aliases) {
    exists = aliases.some((entry) => entry.alias === alias);
  }
  return exists;
}

/*
 * Command: Allows the user to purge all of the alias entries from the array in configuration.
 */
export function purgeAliasesCommand() {
  return commands.registerCommand(PurgeAliasesCommandName, async () => {
    const logger = new ExtensionLogger(
      ActionTypes.Command,
      PurgeAliasesCommandName,
      "purgeAliasesCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      // Provide a warning and seek confirmation input from user before purging aliases.
      const confirm = await window.showWarningMessage(
        "[FFVA] Are you sure you want to purge all existing aliases? WARNING: This cannot be undone.",
        "Confirm"
      );
      if (confirm) {
        const result = await window.showInputBox({
          placeHolder: `Type "Confirm" to purge all existing aliases. WARNING: This cannot be undone.`,
          validateInput: (text) => {
            return text === "Confirm"
              ? null
              : `Type "Confirm" to purge all aliases.`;
          },
        });
        // Verifying that result is truthy and equals the confirmation phrase before proceeding.
        if (result === "Confirm") {
          logger.log(
            "User confirmation successful. Purging all aliases from configuration."
          );
          // Update the configuration to an empty array to purge all aliases.
          await updateConfiguredAliases([]);
          statusItems.push(
            setInfoStatus("Successfully purged all aliases from configuration.")
          );
        } else {
          logger.log(
            "User confirmation unsuccessful. Aborting purge operation."
          );
        }
      }
    } catch (x) {
      logger.log(
        "An error occurred whilst trying to purge all aliases from configuration.",
        x
      );
      statusItems.push(
        setErrorStatus("An error occurred whilst trying to purge all aliases.")
      );
    } finally {
      logger.endExecutionLog();
    }
  });
}

/*
 * Command: Finds and opens a file in the current workspace using an existing alias entry.
 */
export function findFileViaAliasCommand() {
  return commands.registerCommand(FindFileViaAliasCommandName, async () => {
    const logger = new ExtensionLogger(
      ActionTypes.Command,
      FindFileViaAliasCommandName,
      "findFileViaAliasCommand"
    );
    logger.beginExecutionLog();
    const statusItems: Disposable[] = [];
    try {
      const aliases = getConfiguredAliases();
      const alias = await pickAlias(aliases);
      if (alias) {
        const document = await workspace.openTextDocument(alias.uri.fsPath);
        await window.showTextDocument(document);
      }
    } catch (x) {
      logger.log(
        "An error occurred whilst trying to find and open a file using an alias.",
        x
      );
      statusItems.push(
        setErrorStatus(
          "An error occurred whilst trying to find and open a file using an alias."
        )
      );
    } finally {
      logger.endExecutionLog();
    }
  });
}

/*
 * Function to allow the user to search for and/or select an alias from a dynamic QuickPick menu.
 */
async function pickAlias(
  aliases: AliasEntry[]
): Promise<AliasEntry | undefined> {
  const disposables: Disposable[] = [];
  try {
    return await new Promise<AliasEntry | undefined>((resolve) => {
      const input = window.createQuickPick<AliasItem>();
      input.title = "Find File Via Alias";
      input.placeholder = aliases.length
        ? "Search for an alias, or select one below"
        : "No aliases configured";

      // Map the alias entries to AliasItem QuickPickItems.
      let aliasItems = aliases.map((entry) => new AliasItem(entry));

      // Initialise input items with the whole aliasItems array.
      input.items = aliasItems;
      disposables.push(
        input.onDidChangeValue((value) => {
          // If the input value is falsy, reset the input items back to displaying the whole aliasItems array.
          if (!value) {
            input.items = aliasItems;
            return;
          }

          // The value is not falsy here, so set the 'busy' status to 'true'.
          input.busy = true;

          // Filter the input items to only display aliases that start with the input value.
          const filtered = aliases.filter((entry) =>
            entry.alias.startsWith(value)
          );

          // If the filtered array is falsy or empty, set the input items to an empty array.
          if (!filtered || !filtered.length) {
            input.items = [];
          }

          // If the length of the filtered array is not equal to the length of the input items array, set the input items to the updated filtered items.
          // This will dynamically update the input items displayed in the QuickPick menu as the user types.
          if (filtered.length !== input.items.length) {
            input.items = filtered.map((entry) => new AliasItem(entry));
          }

          // End of control-flow for onDidChangeValue event, set the 'busy' status back to 'false'.
          input.busy = false;
        }),
        input.onDidChangeSelection((items) => {
          const item = items[0];
          if (item instanceof AliasItem) {
            resolve(item.entry);
            input.hide();
          }
        }),
        input.onDidHide(() => {
          resolve(undefined);
          input.dispose();
        })
      );
      input.show();
    });
  } finally {
    disposables.forEach((d) => d.dispose());
  }
}
