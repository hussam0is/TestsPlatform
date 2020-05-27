const {Job}= require('./job.js')

var start = new Date()

async function foo() {
    let jobName = "Hello world 2"
    let job = new Job(jobName, 'www.ws.com');
    await job.getData();
    console.log(job);
    console.log("test result: ", job.builds[99].test_result)
    const end = new Date() - start;
    console.info('Execution time in seconds: %ds', end/1000)
}
foo()


