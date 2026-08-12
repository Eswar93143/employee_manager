const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // status: {
    //   type: String,
    //   enum: [
    //     "planning",
    //     "not_started",
    //     "in_progress",
    //     "on_hold",
    //     "completed",
    //     "cancelled"
    //   ],
    //   default: "planning"
    // },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },

    projectManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    expectedEndDate: {
      type: Date,
      required: true
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);