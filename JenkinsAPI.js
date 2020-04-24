exports.connectJenkins = function (username, password) {
// username/password
    var jenkinsapi = require('jenkins-api');
    var jenkins = jenkinsapi.init("http://admin:de713ff17ffd4bdfb3fee76eb6718942@jenkins.yoursite.com");
    return jenkins;
};

exports.build = function(jenkins, jobID){
    jenkins.build_with_params(jobID.toString(), function(err, data) {
        if (err){ return console.log(err); }
        console.log(data)
    });
};

exports.stopBuild = function(jenkins,jobID, buildID){
    jenkins.stop_build(jobID.toString(), buildID.toString(), function(err, data) {
        if (err){ return console.log(err); }
        console.log(data)
    });
};


/*Some functions we may use*/
/*
// all builds
jenkins.all_builds('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});

// test result/report
jenkins.test_result('job-in-jenkins', 'build-number', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});
// delete build data
jenkins.delete_build('job-in-jenkins', 'build-number', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});*/
