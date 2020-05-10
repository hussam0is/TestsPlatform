const CronJob = require('cron').CronJob;
const email = require('./send_build_report');

exports.renEvery2Weeks = function(callback) {
    const job = new CronJob('30 8 1,14 * *', function () {
        callback()
    }, null, true, 'Israel');
    job.start();
}

exports.reportAllBuildsEvery2Weeks = function (recipients, fetchAllBuilds = () => String) {
    exports.renEvery2Weeks(() => email.sendEmailAllBuilds(recipients, fetchAllBuilds()))
}