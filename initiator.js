const { addService } = require("./services/service");

const args = process.argv.slice(2);
const jobName = args.pop();

const allJobs = [
  {
    name: "globalMetricsLatest",
    url: "/v1/global-metrics/quotes/latest",
  },
];

allJobs.forEach((job) => {
  if (job.name === jobName) {
    addService(job.url);
  }
});
