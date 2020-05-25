console.log("start running application")

const fs = require('fs');
const sendEmail = require('./send_build_report')
const report = require('./reports')
const email = require("./send_build_report");
recipients = ['avil2101@gmail.com'];

// if your jenkins call is async then call this function after you received the result from jenkins
// for example: jenkins.getAllBuilds((builds) => sendEmail.sendEmailAllBuilds(recipients, builds))
sendEmail.sendEmailAllBuilds(recipients, fs.readFileSync('all_build_report.json', 'utf8'))
sendEmail.sendBuildDetails(recipients, fs.readFileSync('build_details.json', 'utf8'));

//synchronously (blocking)
// replace sync function read from file with your sync call to jenkins to receive all builds
report.reportAllBuildsEvery2Weeks(recipients, () => fs.readFileSync('all_build_report.json', 'utf8'))

//asynchronously (non-blocking)
//replace async function read from file with your async call to jenkins to receive all builds
report.renEvery2Weeks(() => fs.readFile('all_build_report.json', 'utf8', (err, builds) => email.sendEmailAllBuilds(recipients, builds)))

console.log("app running successfully")

