var { execute } = require("@asterics/node-util");

function gitwd(location) {
  return location ? `--git-dir=${location}/.git --work-tree=${location}` : "";
}

function ensureGitSubmodule({ name, destination, reference, branch = "master", fatality = false }, verbose = false) {
  let localReference = reference ? `--reference ${destination}` : "";

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

module.exports = { ensureGitSubmodule, checkoutSubmodule };
