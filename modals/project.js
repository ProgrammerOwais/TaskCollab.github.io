import { Schema, models, model } from "mongoose";

const projectScheme = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  teamMembers: {
    type: Number,
    required: true,
  },
  task: {
    type: Array,
    taskItems: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        required: false,
        default: false,
      },
      completion: {
        type: Boolean,
        required: false,
        default: false,
      },
      activeUser: {
        type: String,
        required: false,
        default: "",
      },

      dueDate: {
        type: String,
        required: false,
      },
      startingDate: {
        type: Date,
        default: Date.now,
      },
    },

    default: [],
  },
  users: {
    type: Array,
    usersItems: [
      {
        name: String,
        email: String,
      },
    ],
  },
  invitedUsers: {
    type: Array,
    usersItems: [
      {
        email: String,
      },
    ],
  },
  chatData: {
    type: Array,
    chatItems: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      data: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  },
});

const Project = models.Project || model("Project", projectScheme);
export default Project;
