import Project from "@/modals/project";
import { connectToDB } from "@/utils/database";
// only show me the users logged in projects
export const GET = async (req, { params }) => {
  await connectToDB();
  try {
    const userProjects = await Project.find({
      creator: params.id,
    }).populate("creator");
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
