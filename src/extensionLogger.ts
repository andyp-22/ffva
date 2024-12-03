/*
 * Extension logger helper class which wraps patterns for creating consistent
 * console log outputs, for use inside of event handlers and commands.
 *
 * This logging helper class is largely a convenience to myself (the developer)
 * 
 *                                                                          :)
 */
export class ExtensionLogger {
  private actionType: ActionTypes; // The type of action being processed by the module which created this ExtensionLogger instance.
  private actionName: string; // The name of the Command or Event being processed.
  private actionMethod: string; // The name signature of the module which created this ExtensionLogger instance.

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
  Command = "Command", // Used to denote modules which process commands.
  Handler = "EventHandler", // Used to denote modules which handle events.
}
