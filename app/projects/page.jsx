"use client";
import { useContext } from "react";
import ProjectContext from "@/components/ProjectContext";
import { useSession } from "next-auth/react";
import ProjectList from "@/components/ProjectList";

const Projects = () => {
  const { data: session } = useSession();
  // get the projects data from ProjectContext
  const { projects, updateProjects } = useContext(ProjectContext);
  let projectExists = false;

  // if user is not logged In
  if (!session?.user) {
    return (
      <h1 className="text-3xl text-center mx-auto my-5">
        {" "}
        Sorry😌, Sign In than come back...
      </h1>
    );
  }
  return (
    <div className="w-[95%] min-h-[500px] mt-5 lg:max-w-[1200px] mx-auto ">
      <h1 className="text-3xl font-bold mb-4 text-slate-700 dark:text-gray-200">
        Explore Your Projects
      </h1>
      <p className="text-slate-600 md:w-9/12 dark:text-slate-500 text-[16px] sm:text-xl">
        Welcome to the Project page! Dive into your world of projects, where
        creativity meets efficiency. Manage, collaborate, and conquer with ease.
        Organize your team, track progress, and watch your vision unfold.
      </p>

      <hr className="border-slate-500 my-3 md:my-5" />
      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
        {/* // only display those projects which are yours */}
        {projects
          ? projects.map((project) => {
              if (project?.creator?.email === session?.user?.email) {
                projectExists = true;
                return (
                  <ProjectList
                    project={project}
                    projects={projects}
                    setProjects={updateProjects}
                    session={session}
                  />
                );
              }
            })
          : ""}
        {!projectExists && (
          <p className="text-slate-600 md:w-9/12 dark:text-slate-300 text-[16px] sm:text-xl">
            Yet You didn't create any Project 😴
          </p>
        )}
      </div>
    </div>
  );
};

export default Projects;
