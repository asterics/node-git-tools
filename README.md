
# git-tools

git-tools is a collection of methods to manipulate local git repositories and perform git repository-related functionality.

## Install

Install git-tools with npm:

    npm install --save-dev @asterics/git-tools

Install with yarn:

    yarn add @asterics/git-tools --dev

## Introduction

Most of the exported functions depend on [`@asterics/node-utils`](https://www.npmjs.com/package/@asterics/node-utils) and [`git`](https://git-scm.com/). 

<!-- `ShellJS` is a portable implementation of the Unix shell for Windows, Linux and OS X. -->

<!-- Most of the exported functions operate on a plain object with following properties:

    {
        name : "Repository",
        destination: "external/repository",
        reference: "/path/to/repository",
        branch: "master",
        fatality: "false"
    } -->

## API Reference

### gitLocalPath( from, name )

Get path to git repository `name` starting `from` in all parent directories.

Available parameters:

* `from`: Path to start search from.
* `name`: Name of folder containing git repository.

Returns:

Local path to git repository. "" (empty string) if not available.

### checkoutSubmodule( { name, destination, branch, fatality }, verbose )

Check out git submodule.

Available properties:

* `name`: Name of submodule.
* `destination`: Path to submodule.
* `[branch]`: Branch to check out (default: "master").
* `[fatality]`: Abort program on error (default: false).
* `[verbose]`: Verbose logging (default: false).

### ensureGitSubmodule( { name, destination, reference, branch, fatality }, verbose )

Clone git submodule.

Available properties:

* `name`: Name of submodule.
* `destination`: Path to submodule.
* `[reference]`: Local reference to git repository of submodule (default: "").
* `[branch]`: Branch to check out (default: "master").
* `[fatality]`: Abort program on error (default: false).
* `[verbose]`: Verbose logging (default: false).