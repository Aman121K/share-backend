const moment = require('moment-timezone');

const arg = process.argv[2];
let now = 0;

if (arg)
  now = Number(arg);
else
  now = Date.now();

const Time = moment.tz(now,'America/New_York').format('MMMM Do YYYY h:mm:ss a');

console.log(Time);
