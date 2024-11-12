/*
 * Extension logger helper class which wraps patterns for creating consistent
 * console log outputs, for use inside event handlers and commands.
 *
 * This is merely a convenience for me (the developer), so that all console logs
 * from my extension are consistently descriptive :)
 */
export class ExtensionLogger {
  actionType: ActionTypes; // Indicates whether the instantiating function/method is a Command or EventHandler.
  actionName: string; // The name of the Command or Event.
  actionMethod: string; // The name of the function/method which instantiated this ExtensionLogger.

  constructor(
    actionType: ActionTypes,
    actionName: string,
    actionMethod: string
  ) {
    this.actionType = actionType;
    this.actionName = actionName;
    this.actionMethod = actionMethod;
  }

  beginExecutionLog() {
    console.log(`[FFVA] [${this.actionType}=${this.actionMethod}] Begin executing: ${this.actionName}`);
  }

  log(message: string, ...optionalParams: any[]) {
    const text = "[FFVA]" + " " + message;
    console.log(text, optionalParams);
  }

  endExecutionLog() {
    console.log(`[FFVA] [${this.actionType}=${this.actionMethod}] Finished executing: ${this.actionName}`);
  }
}

export enum ActionTypes {
  Command = "Command", // Used to identify functions/methods which process a command.
  Handler = "EventHandler", // Used to identify functions/methods which handle an event.
}
