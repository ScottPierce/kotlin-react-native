class Command {
  constructor() {
    this.__shouldFail = [];
  }

  run(a) {
    return () => {
      if (this.__shouldFail.includes(a)) throw a;

      return a;
    };
  }

  runAsync(a) {
    return () => {
      if (this.__shouldFail.includes(a)) {
        return Promise.reject(a);
      }

      return Promise.resolve(a);
    };
  }
}

module.exports = new Command();
