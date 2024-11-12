# FFVA (Find File Via Alias)
### Extension for Visual Studio Code
Do you ever find yourself working in large or unruly repositories, and/or frequently having to locate important documents with equally large or unruly file names?? 

Introducing FFVA (Find File Via Alias), a simple extension to solve a simple problem; Define your own easy-to-remember aliases for commonly used files,
and use these aliases to quickly find and open files within a workspace!


## Features
This extension includes the following features:
* Define your own custom aliases.
  * When a new alias is created, it will be associated with the currently-active document in your editor.
* Quickly and intuitively find and open files using your custom-defined aliases.
* The ability to manage your custom-defined aliases, per-workspace.
  * Existing aliases can be removed individually, or purged all at once for the entire workspace.
* QOL features to ensure that your aliases remain intact or are cleaned-up when files change, and the freedom to toggle these features on or off per-workspace.
  * Automatic updates: When enabled, this extension will automatically update existing aliases anytime their corresponding file is renamed or moved.
  * Automatic clean-up: When enabled, this extension will automatically remove existing aliases when their corresponding file is deleted.


## Usage
This extension includes the following default command shortcuts, which aim to intuitively extend the core Visual Studio Code 'Quick Open' command that we're already familiar with.

* `ctrl + alt + p`:
  * **Command**: FindFileViaAlias
  * **Rationale**: Mimics the `ctrl + p` shortcut for 'Quick Open' for intuitive feel, with the inclusion of `alt`.
  * **Use from**: Anywhere within a valid workspace with custom-defined aliases.
  * **Result**: Opens the Visual Studio Code command palette with no input, displays all custom aliases defined within the current workspace, and allows the user to type in and/or select an alias from the dynamically updating list. Selecting an alias opens the corresponding document in the editor.
 
* `ctrl + alt + a`:
  * **Command**: CreateAlias
  * **Rationale**: Uses the same `ctrl + alt` prefix of inputs as the FindFileViaAlias shortcut, with the inclusion of `+ a` representative of 'alias'.
  * **Use from**: The document you wish to create an alias for, within any valid workspace.
  * **Result**: Opens the Visual Studio Code command palette with no input, and allows the user to type in a custom alias to associate with the currently active document. Typing in any valid input adds a new alias for the current document to the workspace settings.

 
* `ctrl + alt + d`:
  * **Command**: RemoveAlias
  * **Rationale**: Uses the same `ctrl + alt` prefix of inputs as the FindFileViaAlias shortcut, with the inclusion of `+ d` representative of 'delete'.
  * **Use from**: Anywhere within a valid workspace with custom-defined aliases.
  * **Result**: Opens the Visual Studio Code command palette with no input, and allows the user to type in and/or select an alias from the dynamically updating list. Selecting an alias removes it from the workspace settings (does NOT remove files). 

All commands implemented by this extension, including those with shortcuts above, can be found by searching for `FFVA` in the Visual Studio Code command palette (`ctrl + shift + p`).


## Extension Settings
This extension contributes the following settings through the `contributes.configuration` extension point:

* `ffva.config.aliases`: Enable/disable this extension.
* `ffva.config.autoClean...`: Enables or disables the automatic clean-up of aliases on file delete.
* `ffva.config.autoUpdate...`: Enables or disables the automatic update of aliases on file rename or move.


## Known Issues
Super clean!


## Release Notes
- v0.0.1 This extension is unreleased.


## License
Copyright (c) 2024 Andrew Parrett. All rights reserved.
Licensed under the [MIT](https://github.com/andyp-22/ffva/blob/main/LICENSE) License.
