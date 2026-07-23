import mongoose from "mongoose";

const jobPayloadSchema = new mongoose.Schema(
  {
    jobType: {
      type: String,
      required: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "job_payloads",
  }
);

export default mongoose.model("JobPayload", jobPayloadSchema);