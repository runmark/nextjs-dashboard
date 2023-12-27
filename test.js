"use strict";

let count = 0;
let oldParseInt = parseInt;

global.parseInt = function () {
    count += 1;
    return oldParseInt.apply(null, arguments);
}

parseInt('10');
parseInt('20');
parseInt('30');
console.log('count = ' + count);