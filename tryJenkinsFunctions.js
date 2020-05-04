//this code must copied t
const jenkinsModule = require('./JenkinsFunctions');
const tryToGetData = require('./tryTogetData');
/*
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};*/

const username1 = 'admin';
const password = 'de713ff17ffd4bdfb3fee76eb6718942';

let jenkinsUser1 = jenkinsModule.connectJenkinsUser(username1, password);

let jobName = "Hello world 2";

// get all jobs in Jenkins Homepage:
const jobsDataPromise = new Promise((resolve, reject) =>
 jenkinsModule.getExistedJobsData(jenkinsUser1, function (jobs) {
    resolve(jobs);
}))

// get all builds for a specific job:
const allBuildsInJobPromise = new Promise((resolve, reject) =>
    jenkinsModule.get_all_builds(jenkinsUser1, jobName, function (data) {
        resolve(data);
    }))

/*
jobsDataPromise.then(jobs => {
    console.log("here are all jobs for ", username1, "\n", jobs);
    // call send_build_report.js functions here with argument jobs
})*/

allBuildsInJobPromise.then(data => {
    // we can get latest build info beside many useful builds status for this job (jobName)
    //console.log("here are all builds data for a specific Job: \n", data);
    // call send_build_report.js functions here with argument data
})

const allDataPromise = new Promise((resolve, reject)=>{
    jobsDataPromise.then(jobs => {
        //console.log("here are all jobs for ", username1, "\n", jobs);
        // call send_build_report.js functions here with argument jobs
        let allJobsData = {};
        var allBuildsInJobPromise;
        for (let job in jobs){
            if(jobs.hasOwnProperty(job)){
                    // To Do: get Dates from each url
                    allBuildsInJobPromise = new Promise((resolve, reject) =>
                    jenkinsModule.get_all_builds(jenkinsUser1, job.toString(), function (jobDic) {
                        resolve(jobDic);
                    })).then(jobDic=>{allJobsData[job]=jobDic;})
            }
            else{console.log("no keys in jobs Dic")}
        }
        allBuildsInJobPromise.then(jobDic=> {
            tryToGetData.export_all_jobs(allJobsData);
        })
    })
})

   /* getJSON('http://localhost:8080/job/'+jobName+'/lastBuild/api/json?tree=timestamp', // getting timestamp did not success
        function(err, data) {
            if (err !== null) {
               console.log('Something went wrong: ' + err);
            } else {
                console.log('Your query count: ' + data.query.count);
            }
    });
    var credentials = new NetworkCredential("****", "*****");
    var handler = new HttpClientHandler { Credentials = credentials, AllowAutoRedirect = true };

    HttpClient.client = new HttpClient(handler);
    client.DefaultRequestHeaders.Add("User-Agent","Mozilla/5.0 (Windows; U; Windows NT 6.1; de; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12");
    var responseString = await.client.GetStringAsync("https://mobility.gap.com/MobileAppProvider/resources/gapresources/v1/buildings");*/



