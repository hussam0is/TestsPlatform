const jenkinsHandling = require('./jenkins_handling');
const {Build} = require('./build.js')

exports.Job = class Job {
    jobName
    url
    latest_build
    builds
    config_xml
    constructor(jobName, url) {
        this.jobName = jobName;
        this.url = url;
    }

    async getBuilds() {
        this.builds = []
        let builds = await jenkinsHandling.get_builds_in_job(this.jobName)
        for (let i = 0; i < builds.length; i++) {
            this.builds[i] = new Build(builds[i][0], this.jobName);
            await this.builds[i].getData()
        }
    }

    get_latest_build() {
        this.latest_build = this.builds[this.builds.length-1]
    }
    async get_config_xmlB(){
        this.config_xml = await jenkinsHandling.getConfigXML(this.jobName)
        console.log("this is the configuration xml of job ", this.jobName+":")
        console.log(this.config_xml)
    }
    async getData() {
        await this.getBuilds();
        this.get_latest_build();
        await this.get_config_xmlB();
    }
}




