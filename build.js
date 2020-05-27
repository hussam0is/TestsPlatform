const jenkinsHandling = require('./jenkins_handling')
exports.Build =  class Build {
    buildId
    JobName
    timestamp
    duration
    result
    consoleOutput
    test_result
    constructor(buildId, JobName) {
        this.buildId = buildId;
        this.JobName = JobName
    }
    async getConsoleOutput(){
      //  this.consoleOutput = await jenkinsHandling.getConsoleOutput(this.JobName, this.buildId);
    }
    async getTestResult(){
        this.test_result = await jenkinsHandling.test_result(this.JobName, this.buildId)
    }
    async getBuildInfo(){
        let build_info = await jenkinsHandling.buildInfo(this.JobName, this.buildId).catch(err => console.log(err))
        this.timestamp = build_info['timestamp']
        this.duration = build_info['duration']
        this.result = build_info['result']
    }
    async getData(){
        await this.getBuildInfo()
        await this.getConsoleOutput()
    }
}
