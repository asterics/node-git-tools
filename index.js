//
// @asterics/git-tools
// git-tools is a collection of methods to manipulate local git repositories
//
// Copyright (C) 2019  Alijs Sabic <sabic@technikum-wien.at>
// https://github.com/sabicalija/node-git-tools.git

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
var fs = require("fs");
var path = require("path");
var { execute } = require("@asterics/node-utils");

function mapDirectoryStats(dirPath, dirName) {
  let p = `${dirPath}/${dirName}`;
  return { path: p, stat: fs.statSync(p) };
}

function isLocalRepositoryPath(dirPath) {
  let rGitFolder = /.git$/,
    folders = fs
      .readdirSync(dirPath)
      .map(e => mapDirectoryStats(dirPath, e))
      .filter(e => e.stat.isDirectory() && rGitFolder.test(e.path));
  return folders.length > 0;
}

function gitLocalPath(from, name) {
  let auto = /^auto:/,
    remote = /^remote/,
    resultPath;

  /* auto */
  if (auto.test(name)) {
    name = name.replace(auto, "");

    let searchPath = from,
      parentDirs = searchPath.split("/").length,
      rSearch = new RegExp("/" + name + "$");

    for (let i = 0; i < parentDirs; i++) {
      let search = fs
        .readdirSync(searchPath)
        .map(e => mapDirectoryStats(searchPath, e))
        .filter(e => e.stat.isDirectory())
        .filter(e => rSearch.test(e.path))
        .filter(e => isLocalRepositoryPath(e.path));
      if (search.length > 0) {
        resultPath = search[0].path;
        break;
      }
      /* Jump to parent directory */
      searchPath = path.join(searchPath, "..");
    }
    /* remote */
  } else if (remote.test(name)) {
    resultPath = "";
    /* path */
  } else if (path.isAbsolute(name)) {
    resultPath = name;
  }

  return resultPath;
}

function gitwd(location) {
  return location ? `--git-dir=${location}/.git --work-tree=${location}` : "";
}

function ensureGitSubmodule({ name, destination, reference = "", branch = "master", fatality = false }, verbose = false) {
  let localReference = reference ? `--reference ${reference}` : "";

  let commands = {
    submodule: `git submodule update --init ${localReference} ${destination}`,
    checkout: `git ${gitwd(destination)} checkout ${branch}`,
    sync: `git ${gitwd(destination)} pull origin ${branch}`
  };

  /* clone repository */
  execute({
    cmd: commands["submodule"],
    success: `submodule '${name}' cloned`,
    error: `failed cloning submodule '${name}'`,
    fatality,
    verbose
  });

  /* checkout branch/tag */
  execute({
    cmd: commands["checkout"],
    success: `submodule '${name}' checked out at '${branch}'`,
    error: `failed checking out submodule '${name}' at '${branch}'`,
    fatality,
    verbose
  });

  /* synchronize with remote origin */
  execute({
    cmd: commands["sync"],
    success: `synchronized with remote origin '${branch}'`,
    error: `failed pulling from remote origin '${branch}'`,
    fatality,
    verbose
  });
}

function checkoutSubmodule({ name, destination, reference, branch = "master", fatality = false }, verbose = false) {
  let commands = {
    checkout: `git ${gitwd(destination)} checkout ${branch}`
  };

  /* checkout branch */
  execute({
    cmd: commands["checkout"],
    success: `checked out ${name} at '${branch}'`,
    error: `failed checking out '${name}' at '${branch}'`,
    fatality,
    verbose
  });
}

module.exports = { gitLocalPath, ensureGitSubmodule, checkoutSubmodule };
