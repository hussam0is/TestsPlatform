const jenkinsHandling = require('./jenkins_handling');
const {Test} = require("./TestC");
const {Build} = require('./Build.js')

exports.Job = class Job {
    jobName
    url
    latest_build
    builds
    tests
    config_xml

    constructor(jobName, url) {
        this.jobName = jobName;
        this.url = url;
    }

    showBuilds() {
        let temp = []
        this.builds.forEach(element => {
            temp.push(element.Id)
        })
        console.log(temp)
    }
    showTests() {
        let temp = []
        this.tests.forEach(element => {
            temp.push(element.Id)
        })
        console.log(temp)
    }

    async isTest(Id) {
        return await jenkinsHandling.test_result(this.jobName, Id)
    }

    async getBuildsAndTests() {
        this.builds = []
        this.tests = []
        let buildsAndTests = await jenkinsHandling.get_builds_and_tests(this.jobName)
        for (let i = 0; i < buildsAndTests.length; i++) {
            if (await this.isTest(buildsAndTests[i][0]) === true) {
                this.tests.push(new Test(buildsAndTests[i][0], this.jobName))
                await this.tests[this.tests.length-1].updateBuildData()
            } else {
                this.builds.push(new Build(buildsAndTests[i][0], this.jobName))
                await this.builds[this.builds.length-1].updateBuildData()
            }
        }
        console.log("got " + this.builds.length + " builds")
        console.log("got " + this.tests.length + " tests")
    }
    get_latest_build() {
        this.latest_build = this.builds[this.builds.length - 1]
    }

    async get_config_xmlB() {
        this.config_xml = await jenkinsHandling.getConfigXML(this.jobName)
        // console.log("this is the configuration xml of job ", this.jobName+":")
        //console.log(this.config_xml)
    }

    async updateData() {
        this.get_config_xmlB().then();
        await this.getBuildsAndTests();
        this.get_latest_build();
    }

    // delete first n builds if n < num_of_builds - 30 (keeping at least 30 builds)
    async deleteFirstNBuilds(n) {
        if (n < this.builds.length - 30) {
            for (let i = 0; i < n; i++) {
                await jenkinsHandling.deleteBuild(this.jobName, this.builds[i].Id)
            }
        }
        await this.updateData()
    }

    // delete first n tests if n < num_of_tests - 30 (keeping at least 30 tests)
    async deleteFirstNTests(n) {
        console.log(this.tests.length)
        if (n < this.tests.length - 30) {
            for (let i = 0; i < n; i++) {
                await jenkinsHandling.deleteBuild(this.jobName, this.tests[i].Id)
            }
        }
        await this.updateData()
    }
}




