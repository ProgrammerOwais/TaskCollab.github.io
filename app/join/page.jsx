"use client";
import { useContext } from "react";
import ProjectContext from "@/components/ProjectContext";
import { useSession } from "next-auth/react";
import ProjectList from "@/components/ProjectList";

const Join = () => {
  const { data: session } = useSession();

  // get the projects data from ProjectContext
  const { projects, updateProjects } = useContext(ProjectContext);
  // if user is not logged In
  let projectExists = false;

  if (!session?.user) {
    return (
      <h1 className="text-3xl w-10/12 text-center mx-auto text-slate-700 dark:text-gray-200 my-5">
        {" "}
        Sorry😌, Sign In than come back...
      </h1>
    );
  }
  return (
    <div className="w-[95%] min-h-[500px] mt-5 lg:max-w-[1200px] mx-auto  ">
      <h1 className="text-3xl font-bold mb-4 text-slate-700 dark:text-gray-200">
        Joined Projects
      </h1>
      <p className="text-slate-600 md:w-9/12 dark:text-slate-500 text-[16px] sm:text-xl">
        Welcome to this joined Ventures ! Immerse yourself in a world of shared
        projects where you contribute your expertise and talent. Join forces
        with like-minded individuals, working together to achieve remarkable
        outcomes.
      </p>

      <hr className="border-slate-500 my-3 md:my-5" />
      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
        {/*  display only those projects which you are joined or yours */}
        {projects
          ? projects.map((project, index) => {
              let handleMember = false;
              // if these are your own projects
              if (project.creator.email === session?.user?.email) {
                projectExists = true;
                return (
                  <>
                    <ProjectList
                      key={index}
                      project={project}
                      projects={projects}
                      setProjects={updateProjects}
                      session={session}
                    />
                  </>
                );
              } else {
                {
                  project.users.map((user) => {
                    if (user.email === session?.user?.email) {
                      handleMember = true;
                    }
                  });
                }
                //  if you are the users/members  of other projects
                if (handleMember) {
                  projectExists = true;
                  return (
                    <ProjectList
                      key={index}
                      project={project}
                      projects={projects}
                      setProjects={updateProjects}
                      session={session}
                      join={true}
                    />
                  );
                }
              }
            })
          : ""}
        {!projectExists && (
          <p className="text-slate-600 md:w-9/12 dark:text-slate-300 text-[16px] sm:text-xl">
            Yet You didn't join any Project 🥱
          </p>
        )}
      </div>
    </div>
  );
};

export default Join;
