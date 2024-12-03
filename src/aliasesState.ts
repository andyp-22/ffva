import { Memento } from "vscode";
import { Alias, AliasUri } from "./aliases";

export class AliasesState {
  
  private _state: Memento;
  private _aliases: Map<string, AliasUri>;

  constructor(workspaceState: Memento) {
    
    this._state = workspaceState;
    this._aliases = new Map();
    
    this._state.keys().forEach((key) => {
      const value: AliasUri | undefined = this._state.get(key);
      if (value) {
        this._aliases.set(key, value);
      }
    });
  }

  getAliases(): Alias[] {
    return Array.from(this._aliases, (alias) => { return { name: alias[0], uri: alias[1] }; });
  }

  setAlias(alias: Alias): void {
    this._state.update(alias.name, alias.uri);
    this._aliases.set(alias.name, alias.uri);
  }

  removeAlias(alias: Alias): void {
    this._state.update(alias.name, undefined);
    this._aliases.delete(alias.name);
  }

  aliasExists(name: string): boolean {
    return this._state.get(name) !== undefined;
  }

  getAliasByUri(searchUri: AliasUri): Alias | undefined {
    let alias: Alias | undefined = undefined; 
    this._aliases.forEach((uri, name) => {
      if (uri.fsPath === searchUri.fsPath) {
        alias = { name: name, uri: uri };
      }
    });

    // If above foreach does not return an alias, return undefined instead.
    return alias;
  }

  purgeAliases(): void {
    this._state.keys().forEach((key) => {
      this._state.update(key, undefined);
    });
    this._aliases = new Map();
  }
}
