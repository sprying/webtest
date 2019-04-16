"use strict";

function* foo() {
  let x = yield 3;
  let y = x.toUpperCase();
  yield y;
  yield 5;
}

var it = foo();

console.log(it.next()); // { value:3, done:false }

try {
  console.log(it.next(42));
} catch (err) {
  console.log(err);
  console.log(it.next());
}
