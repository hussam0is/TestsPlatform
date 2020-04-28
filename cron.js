var CronJob = require('cron').CronJob;
var email = require('./send_build_report');
var job = new CronJob('*/5 * * * * *', function() {
    console.log('You will see this message every 5 seconds');
    email.sendEmailAllBuilds(email.recipients, email.data);
}, null, true, 'Israel');
job.start();