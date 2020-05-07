// https://nodejs.org/api/process.html#process_process_platform
const PLATFORMS = [
  "aix",
  "darwin",
  "linux",
  "freebsd",
  "openbsd",
  "sunos",
  "win32",
  "android",
  "_"
];

function getTask(step, platform) {
  if (step[platform]) {
    return step[platform];
  } else if (step["_"]) {
    return step["_"];
  } else {
    throw new Error(
      `Function for current platform ("${platform}") is not defined!`
    );
  }
}

function pick(...procedure) {
  const platform = process.platform;

  const getNextProcedure = () => {
    const step = procedure.shift();

    if (!step) {
      return Promise.reject(new Error(`No suitable job for "${platform}"`));
    }

    if (!Object.keys(step).every(a => PLATFORMS.includes(a))) {
      return Promise.reject(
        new Error(
          `Task should be defined as object with keys: ${PLATFORMS.join(", ")}`
        )
      );
    }

    const job = getTask(step, platform);

    if (typeof job !== "function") {
      return Promise.reject(
        new Error("Job has to be a function which returns value or Promise")
      );
    }

    let task;
    try {
      task = job();
    } catch (e) {
      task = Promise.reject(e);
    }

    if (!(task instanceof Promise)) {
      task = Promise.resolve(task);
    }

    return task.catch(e => getNextProcedure());
  };

  return getNextProcedure();
}

module.exports = pick;
