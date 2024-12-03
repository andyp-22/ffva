# FFVA (Find File Via Alias)
### Extension for Visual Studio Code
Do you ever find yourself working in large or unruly repositories, and/or frequently having to locate important documents with equally large or unruly file names?? 

Introducing FFVA (Find File Via Alias), a simple extension to solve a simple problem; Define your own easy-to-remember aliases for commonly used files,
and use these aliases to quickly find and open files within a workspace!


## Features
This extension includes the following...

**Core Features**:
* Create custom aliases to files in your workspace.
* Use a custom alias to find and open the associated file within your workspace.
* Individually remove existing custom aliases for your workspace.
* Purge all existing custom aliases for your workspace.


**Optional QOL Feautres** (enabled by default):
* **Automatic updates**: When enabled, will automatically update existing aliases when their respective associated file is renamed or moved
* **Automatic clean-up**: When enabled, will automatically remove existing aliases when their respective associated file is deleted.

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

* `ffva.config.doAutoClean`: Enables or disables the automatic clean-up of aliases on file delete.
* `ffva.config.doAutoUpdate`: Enables or disables the automatic update of aliases on file rename or move.


## Known Issues
No known issues as of writing.


## Release Notes
Release notes can be found in the [CHANGELOG.md](CHANGELOG.md) file.


## License
Copyright (c) 2024 Andrew Parrett. All rights reserved.

Licensed under the [MIT License](https://github.com/andyp-22/ffva/blob/main/LICENSE).
