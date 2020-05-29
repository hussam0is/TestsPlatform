const jenkinsAPI = require('jenkins-api');
const username = 'admin';
const password = '************';
const token = '11198feb1a0d516c53113b7b5966db23a4'

function connectJenkinsUser(username, token) {
    return require('jenkins')({
        baseUrl: 'http://' + username + ':' + token + '@localhost:8080',
        crumbIssuer: true
    })
}

let jenkinsUser1 = connectJenkinsUser(username, token);
let jenkinsUser2 = jenkinsAPI.init("http://" + username + ":" + token + "@localhost:8080");
exports.jenkinsUser2 = jenkinsUser2
exports.jenkinsUser1 = jenkinsUser1
//console.log(jenkinsUser1)
//console.log(jenkinsUser2) // all functions in the api


exports.get_builds_and_tests = function (jobName) {
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
            console.log("got the latest #" + jobList.length + " builds and tests in job " + '\'' + jobName + '\'.')
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
                return
            }
            resolve(data)
        });
    }).catch(err => {
        console.log(err)
        console.log("error getting data from build.log at jenkins_handling.js")
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

exports.test_result = function (jobName, Id) {
    return new Promise((resolve, reject) => {
        jenkinsUser2.test_result(jobName, Id, function (err, data) {
            if (err) {
                // console.log(err)
                resolve(false);
                return
            }
            resolve(true)
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

exports.deleteBuild = function (jobName, buildId) {
return new Promise((resolve, reject) => {
    jenkinsUser2.delete_build(jobName, buildId,function (err, data) {
        if (err){
            console.log("Failed to delete build number: "+buildId+", in job: "+jobName)
            return reject(err)
        }
        console.log("Successfully deleted build number: "+buildId+", in job: "+jobName)
        resolve(data)
    })
}).catch(err=> console.log(err))
}
