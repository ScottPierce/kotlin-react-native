(function (_, Kotlin) {
  'use strict';
  var println = Kotlin.kotlin.io.println_s8jyv4$;
  var RuntimeException_init = Kotlin.kotlin.RuntimeException_init_pdl1vj$;
  function main() {
    println('Main Test');
    throw RuntimeException_init('Can I trace kotlin exceptions?');
  }
  var package$dev = _.dev || (_.dev = {});
  var package$scottpierce = package$dev.scottpierce || (package$dev.scottpierce = {});
  var package$btw = package$scottpierce.btw || (package$scottpierce.btw = {});
  package$btw.main = main;
  main();
  return _;
}(module.exports, require('kotlin')));

//# sourceMappingURL=react-native-kotlin.js.map
