import { connectToDB } from "@/utils/database";
import Project from "@/modals/project";
// get the specific project through itd id
export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const id = params.id;
    const projectwithId = await Project.findOne({ _id: id }).populate(
      "creator"
    );
    if (!projectwithId) {
      return new Response("the project with given id is not found", {
        status: 204,
      });
    }
    return new Response(JSON.stringify(projectwithId), { status: 201 });
  } catch (error) {
    console.log("the error while getting the post , ", error);
    return new Response("the error while getting the post , ", { status: 500 });
  }
};

// update the specific project through id
export const PATCH = async (req, { params }) => {
  const { users, task, index, chatData } = await req.json();
  try {
    await connectToDB();
    const projectExist = await Project.findById(params.id).populate("creator");
    if (!projectExist) {
      return new Response("the project with given id is not found", {
        status: 204,
      });
    }
    if (users) {
      projectExist.users = users;
    }
    // changes the tasks items
    if (task && index !== false) {
      projectExist.task[index] = task;
    }
    // modify the tasks i.e delete the task
    if (task && index === false) {
      projectExist.task = task;
    }
    if (chatData) {
      projectExist.chatData = chatData;
    }
    // (projectExist.users = users), (projectExist.task[index] = task);
    await projectExist.save();
    return new Response(JSON.stringify(projectExist), {
      status: 201,
    });
  } catch (error) {
    console.log("the error while updating the post , ", error);
    return new Response("the error while updating the post , ", {
      status: 500,
    });
  }
};
// delete the specific project through id
export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    await Project.findByIdAndRemove(params.id);
    return new Response("the project is successfully deleted", { status: 200 });
  } catch (error) {
    console.log("the error while deleting  the post , ", error);
    return new Response("the error while deleting the post , ", {
      status: 500,
    });
  }
};
