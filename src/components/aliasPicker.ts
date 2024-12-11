import { window, QuickPickItem, Disposable } from "vscode";
import { Alias } from "../aliases";

/*
 * Class which implements the QuickPickItem interface, used to render Alias items in a QuickPick menu.
 */
export class AliasPickItem implements QuickPickItem {
  label: string;
  description: string;

  constructor(public alias: Alias) {
    this.label = alias.name;
    this.description = alias.uri.path;
  }
}

/*
 * Function to allow the user to search for and/or select an alias from a dynamic QuickPick menu.
 */
export async function pickAlias(aliases: Alias[]): Promise<Alias | undefined> {
  const disposables: Disposable[] = [];
  try {
    return await new Promise<Alias | undefined>((resolve) => {
      const input = window.createQuickPick<AliasPickItem>();
      input.title = "Find File Via Alias";
      input.placeholder = aliases.length ? "Search for an alias, or select one below" : "No aliases configured";

      // Map the alias entries to AliasItem QuickPickItems.
      let aliasItems = aliases.map((alias) => new AliasPickItem(alias));

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
          const filtered = aliases.filter((alias) =>
            alias.name.startsWith(value)
          );

          // If the filtered array is falsy or empty, set the input items to an empty array.
          if (!filtered || !filtered.length) {
            input.items = [];
          }

          // If the length of the filtered array is not equal to the length of the input items array, set the input items to the updated filtered items.
          // This will dynamically update the input items displayed in the QuickPick menu as the user types.
          if (filtered.length !== input.items.length) {
            input.items = filtered.map((entry) => new AliasPickItem(entry));
          }

          // End of control-flow for onDidChangeValue event, set the 'busy' status back to 'false'.
          input.busy = false;
        }),
        input.onDidChangeSelection((items) => {
          const item = items[0];
          if (item instanceof AliasPickItem) {
            resolve(item.alias);
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
