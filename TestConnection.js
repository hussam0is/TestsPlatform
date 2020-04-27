//var jenkinsAPI = require('./JenkinsAPI');
//var jenkinsapi = require('jenkins-api');
//var jenkins = jenkinsapi.init("http://admin:de713ff17ffd4bdfb3fee76eb6718942@jenkins.yoursite.com");
//connect jenkins user




var jenkins = require('jenkins')({
    baseUrl: 'http://admin:de713ff17ffd4bdfb3fee76eb6718942@localhost:8080',
    crumbIssuer: true
});


// Jenkins User Data: Build Name, Build URL, Color and more
const allJobs = {}; // {jobName : url ...}

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
/*
jenkins.build.log("Hello world 2", 5, function(err, data) {
    if (err) throw err;

    console.log('log', data);
});*/

jenkins.job.build("Hello world 2", function(err, data) {
    console.log("build job:")
    if (err) throw err;
    console.log('queue item number', data);
});
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

/*

jenkins.build.get("Hello world 2", 7, function(err, data) { // ("Hello world 1" == job name, 1 == build number)
    if (err) throw err;
    console.log('build', data);
});
*/
