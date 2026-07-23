import { Queue } from "bullmq";

const jobsQueue = new Queue("jobs", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});

export default jobsQueue;