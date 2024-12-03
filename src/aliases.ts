/*
 * Alias entry interface.
 * Represents the shape of an alias in state.
 */
export interface Alias {
  name: string;
  uri: AliasUri;
}

/*
 * Alias uri interface.
 * Represents the shape of the uri properties of an alias in state.
 */
export interface AliasUri {
  fsPath: string;
  path: string;
}
