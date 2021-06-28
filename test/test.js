const Clone = require('../lib/clone');

console.log( Clone(
{
    foo: 'bar',
    bar: [ 'foo', new Date() ],
    now: new Date()
}));