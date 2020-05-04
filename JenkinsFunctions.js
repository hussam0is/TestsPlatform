//var jenkinsAPI = require('./JenkinsAPI');
//var jenkinsapi = require('jenkins-api');
//var jenkins = jenkinsapi.init("http://admin:de713ff17ffd4bdfb3fee76eb6718942@jenkins.yoursite.com");
//connect jenkins user
var fs = require('fs');
var allJobs = {}
var GlobalContainer;

exports.connectJenkinsUser=function(username,password){
    return require('jenkins')({
        baseUrl: 'http://' + username + ':' + password + '@localhost:8080',
        crumbIssuer: true
    })
};

exports.getExistedJobsData = function  (jenkinsUser, callback) {
    new Promise((resolve, reject) => {
        jenkinsUser.info(function (err, data) {
            if (err) {
                reject(err)
            } else {
                let jobs={};
               // console.log(data);
                data["jobs"].forEach(element => jobs[element.name] = [element.url, element.color]);
                resolve(jobs)
            }
        });
    }).then(data => {callback(data);}).catch(err => {console.log(err)})
    };
// "Hello world 2"
exports.get_all_builds= function(jenkinsUser, jobName, callback){
    jenkinsUser.job.get(jobName, function(err, data) {
    if (err){
        return console.log(err);
    }
    //console.log(data);
    let jobDic={};
    data["builds"].forEach(element => jobDic[element.number] = [element.url]); // jobDic = {18: 'Url1', 19:'Url2'}
    callback(jobDic);
    });
};


/*
exports.getJobData = function(jobName, ){
jenkins.build.get(jobName, 7, function(err, data) { // ("Hello world 1" == job name, 1 == build number)
    if (err) throw err;
    console.log('build', data);
});
};
*/


/*
jenkins.info(function(err, data) {
    if (err) throw err;
    console.log('info', data);
    console.log("here are  all the jobs:");
    data["jobs"].forEach(element => console.log(element.name));
    data["jobs"].forEach(element => allJobs[element.name] = [element.url, element.color]);
    console.log(allJobs);
    console.log("--------------------------");
    // get build informtion:

    console.log("#####################################");
    // console output:

});

jenkins.job.build("Hello world 2", function(err, data) {
    console.log("build job:")
    if (err) throw err;
    console.log('queue item number', data);
});
//some functions we may use:

// delete job
jenkins.job.destroy('example', function(err) {
    if (err) throw err;
});
// disable job
jenkins.job.disable('example', function(err) {
    if (err) throw err;
});
// enable job
jenkins.job.enable('example', function(err) {
    if (err) throw err;
});
//Check job exists.
jenkins.job.exists('example', function(err, exists) {
    if (err) throw err;

    console.log('exists', exists);
});

jenkins.build.get("Hello world 2", 7, function(err, data) { // ("Hello world 1" == job name, 1 == build number)
    if (err) throw err;
    console.log('build', data);
});
*/
