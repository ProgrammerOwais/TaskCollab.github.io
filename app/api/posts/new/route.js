import { connectToDB } from "@/utils/database";
import Project from "@/modals/project";
// create a new project
export const POST = async (req, res) => {
  const {
    projectName,
    projectDescription,
    projectType,
    teamMembers,
    task,
    chatData,
    users,
    invitedUsers,
    userId,
  } = await req.json();
  try {
    await connectToDB();

    if (
      !projectName ||
      !projectType ||
      !teamMembers ||
      !projectDescription ||
      !task.length
    ) {
      console.log("the data is: ", projectName, projectType, task);
      return new Response("make sure to put all the requested data", {
        status: 400,
      });
    }

    // Validate the input data (optional)

    // Create a new project instance based on the provided schema
    const newProject = await new Project({
      creator: userId,
      projectName,
      projectType,
      projectDescription,
      teamMembers,
      task,
      chatData: chatData,
      users,
      invitedUsers,
    });

    // Save the new project to the database
    await newProject.save();

    return new Response("the data is successfully submitted", { status: 201 });
  } catch (error) {
    return new Response("Failed to save the project data.", { status: 500 });
    // console.log("the error is: ", error);
    // return res.status(500).json({ error: "Failed to save the project data." });
  }
};
