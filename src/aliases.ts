import { workspace, ConfigurationTarget, QuickPickItem } from "vscode";
import { AliasesConfigProperty } from "./constants";

/*
 * Alias entry interface.
 * Represents the structure of an alias entry in configuration.
 */
export interface AliasEntry {
  alias: string;
  uri: AliasUri;
}

/*
 * Alias uri interface.
 * Represents the structure of the uri properties of an alias entry in configuration.
 */
export interface AliasUri {
  fsPath: string;
  path: string;
}

/*
 * Class implementing the QuickPickItem interface, to render AliasEntry items in QuickPick menus.
 */
export class AliasItem implements QuickPickItem {
  label: string;
  description: string;

  constructor(public entry: AliasEntry) {
    this.label = entry.alias;
    this.description = entry.uri.path;
  }
}

/*
 * Helper function to wrap retrieving the alias entries array from configuration.
 */
export function getConfiguredAliases(): AliasEntry[] {
  const aliases = workspace
    .getConfiguration()
    .get<AliasEntry[]>(AliasesConfigProperty, []);
  console.log("[FFVA] Successfully retrieved alias entries from configuration");
  return aliases;
}

/*
 * Helper function to wrap updating the alias entries array in configuration.
 */
export async function updateConfiguredAliases(
  updates: AliasEntry[]
): Promise<void> {
  try {
    await workspace
      .getConfiguration()
      .update(
        AliasesConfigProperty,
        updates,
        ConfigurationTarget.Workspace
      );
    console.log("[FFVA] Successfully updated alias entries in configuration.");
  } catch (x) {
    console.log(
      "[FFVA] An error occurred whilst trying to update alias entries in configuration.",
      x
    );
  }
}
