var jenkins = require('./JenkinsAPI');

var username;
var password;


jenkins.connectJenkins(username, password);
console.log(jenkins.toString() + " from " );
