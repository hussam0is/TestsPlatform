var jenkinsapi = require('jenkins-api');
const jenkinsAPI = require('./jenkins_API');
const username = 'admin';
const password = 'de713ff17ffd4bdfb3fee76eb6718942';

function connectJenkinsUser(username, password) {
    return require('jenkins')({
        baseUrl: 'http://' + username + ':' + password + '@localhost:8080',
        crumbIssuer: true
    })
}

let jenkinsUser1 = connectJenkinsUser(username, password);
let jenkinsUser2 = jenkinsapi.init("http://" + username + ":" + password + "@localhost:8080");
//console.log(jenkinsUser1)
console.log(jenkinsUser2) // all functions in the api


exports.get_builds_in_job = function (jobName) {
    return new Promise((resolve, reject) => {
        jenkinsUser1.job.get(jobName, function (err, data) {
            if (err) {
                return console.log(err);
            }
            let jobList = [];
            for (let i = 0; i < data['builds'].length; i++) {
                if (data['builds'][i]['number'] != null) {
                    jobList[i] = [data['builds'][i]['number']]
                }
            }
            if (jobList.length > 99) {
                jobList = jobList.slice(jobList.length - 100, jobList.length)
            }
            jobList = jobList.reverse()
            console.log("got the latest #" + jobList.length + " builds in job " + '\'' + jobName + '\'.')
            resolve(jobList);
        });
    }).catch(err => {
        console.log(err)
    });
}
exports.get_ALl_jobs = function () {
    return new Promise((resolve, reject) => {
        jenkinsUser1.info(function (err, data) {
            if (err) {
                reject(err)
            } else {
                let jobs = {};
                data["jobs"].forEach(element => jobs[element.name] = [element.url, element.color]);
                // must get more data from the URL
                resolve(jobs)
            }
        })
    })
};

exports.getConsoleOutput = function (jobName, buildNumber) {
    return new Promise((resolve, reject) => {
        jenkinsUser1.build.log(jobName, buildNumber, function (err, data) {
            if (err) {
                reject(err)
                throw err;
            }
            resolve(data)
        });
    }).catch(err => {
        console.log(err)
        console.log("error getting data from build.log at jenkins_API.js")
    })
}
exports.getConfigXML = function (jobName) {
    return new Promise((resolve, reject) => {
        jenkinsUser2.get_config_xml(jobName, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    }).catch(err => console.log(err))
}

exports.test_result = function (jobName, buildId) {
    return new Promise((resolve, reject) => {
        jenkinsUser2.test_result(jobName, buildId, function (err, data) {
            if (err) {
                // console.log(err)
                resolve("not-a-test");
            }
            resolve(data)
        });
    })
}
exports.buildInfo = function (jobName, buildId) {
    return new Promise((resolve, reject) => {
        jenkinsUser2.build_info(jobName, buildId, function (err, data) {
            if (err) {
                reject(err)
                return console.log(err)
            }
            resolve(data)
        })
    })
}
