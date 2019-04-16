"use strict";

function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}
for(let v of logReturned(genFuncWithReturn())){
  console.log(v);
}
