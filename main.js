const {Job} = require('./Job.js')

const start = new Date();

async function foo() {
    let jobName = "Hello world 2"
    let job = new Job(jobName, 'www.ws.com');
    await job.updateData();
    job.showBuilds()
    job.showTests()
    await job.deleteFirstNBuilds(20)
    job.showBuilds()
    job.showTests()
    console.log(job.tests)
    console.log("--------------------------------------------------------------------------------------------------")
    console.log(job.builds)
    const end = new Date() - start;
    console.info('Execution time: %ds', end / 1000)
}

foo()


