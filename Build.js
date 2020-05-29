const jenkinsHandling = require('./jenkins_handling')
exports.Build =  class Build {  // Build or Test
    Id
    jobName
    timestamp
    duration
    result
    consoleOutput
    constructor(Id, jobName) {
        this.Id = Id;
        this.jobName = jobName
    }
    async getConsoleOutput(){
        this.consoleOutput = await jenkinsHandling.getConsoleOutput(this.jobName, this.Id);
    }
    async getResults(){
        let build_info = await jenkinsHandling.buildInfo(this.jobName, this.Id).catch(err => console.log(err))
        this.timestamp = build_info['timestamp']
        this.duration = build_info['duration']
        this.result = build_info['result']
    }
    async updateBuildData(){
        this.getResults().then()
        //this.getConsoleOutput().then()

    }
}
