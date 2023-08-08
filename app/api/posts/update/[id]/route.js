import { connectToDB } from "@/utils/database";
import Project from "@/modals/project";
// update the project with all details
export const PATCH = async (req, { params }) => {
  const {
    projectName,
    projectDescription,
    projectType,
    teamMembers,
    task,
    invitedUsers,
  } = await req.json();
  try {
    await connectToDB();
    if (
      !projectName ||
      !projectDescription ||
      !projectType ||
      !teamMembers ||
      !task
    ) {
      return new Response("Make sure to include all the data", {
        status: 400,
      });
    }

    const projectExist = await Project.findById(params.id).populate("creator");
    if (!projectExist) {
      return new Response("the project with given id is not found", {
        status: 204,
      });
    }

    (projectExist.projectName = projectName),
      (projectExist.projectType = projectType),
      (projectExist.projectDescription = projectDescription),
      (projectExist.teamMembers = teamMembers),
      (projectExist.task = task);
    projectExist.invitedUsers = invitedUsers;

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
