import Project from "@/modals/project";
import { connectToDB } from "@/utils/database";
// get all the projcts with creator info too
export const GET = async (req, res) => {
  await connectToDB();
  try {
    const userProjects = await Project.find().populate("creator");
    if (!userProjects) {
      return new Response("This user has not yet added any project", {
        status: 404,
      });
    }
    return new Response(JSON.stringify(userProjects), { status: 201 });
  } catch (error) {
    console.log("the error while getting the user projects", error);
    return new Response("the error while getting the user projects", {
      status: 500,
    });
  }
};
