import { window } from 'vscode';
import { state } from '../extension';

/*
 * Function to gather a valid alias name from user input.
 */
export async function inputAliasName() {
  const result = await window.showInputBox({
    placeHolder: "Type in a name for the alias",
    validateInput: (text) => {
      return validateAliasName(text);
    },
  });
  console.log(`[FFVA] Alias name from input: ${result}`);
  return result;
}

/*
 * Function to validate the alias name text captured by user inputs.
 *  - Alias name should not be falsy, an alias requires a name.
 *  - Alias name should not exceed 12 characters in length (long aliases would defeat the purpose of this extension).
 *  - Alias name should not already exist.
 */
function validateAliasName(text: string): string | null {
  if (!text) {
    return "Alias name is required!";
  }
  else if (text.length > 12) {
    return `Name length must not exceed 12 characters! (length = ${text.length})`;
  }
  else if (state.aliasExists(text)) {
    return "An alias with this name already exists!";
  }
  else {
    return null;
  }
}
