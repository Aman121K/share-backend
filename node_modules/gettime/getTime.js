var moment = require('moment-timezone');
var arg = process.argv[2];
var now = 0;
if (arg)
    now = Number(arg);
else
    now = Date.now();
var Time = moment.tz(now, 'America/New_York').format('MMMM Do YYYY h:mm:ss a');
console.log(Time);
