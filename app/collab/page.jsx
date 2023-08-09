"use client";
import { useContext, useEffect, useState } from "react";
import ProjectContext from "@/components/ProjectContext";
import { useSession } from "next-auth/react";
import ProjectList from "@/components/ProjectList";
import Loader from "@/components/Loader";

const Collab = () => {
  const { data: session } = useSession();
  // get the projects data from ProjectContext
  // const { projects, updateProjects } = useContext(ProjectContext);
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/posts", { cache: "no-store" });
      const data = await res.json();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  let projectExists = false;

  // if user is not logged In
  if (!session?.user) {
    return (
      <h1 className="text-3xl w-10/12  text-slate-700 dark:text-gray-200 text-center mx-auto my-5">
        {" "}
        Sorry😌, Sign In than come back...
      </h1>
    );
  }
  return (
    <div className="w-[95%] min-h-[500px] mt-5  lg:max-w-[1200px] mx-auto ">
      <h1 className="text-3xl font-bold mb-4 text-slate-700 dark:text-gray-200">
        Start Join Project
      </h1>
      <p className="text-slate-600 md:w-9/12 dark:text-slate-500 text-[16px] sm:text-xl">
        Explore untapped projects on this page. Join initiatives initiated by
        others and contribute your expertise. Unleash your creativity,
        collaborate with visionaries, and shape the future of these ventures.
      </p>

      <hr className="border-slate-500 my-3 md:my-5" />
      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
        {/* display those projects which are not yours & you are not yet joined them as a member  */}
        {projects ? (
          projects.map((project, index) => {
            let handleMember = true;
            if (project.creator.email !== session?.user?.email) {
              project.users.map((user) => {
                if (user.email === session?.user?.email) {
                  handleMember = false;
                }
              });
              if (handleMember) {
                projectExists = true;
              }
              return (
                <>
                  {handleMember ? (
                    <ProjectList
                      key={index}
                      project={project}
                      projects={projects}
                      setProjects={setProjects}
                      session={session}
                    />
                  ) : (
                    ""
                  )}
                </>
              );
            }
          })
        ) : (
          <Loader />
        )}
        {!projectExists && (
          <p className="text-slate-600 md:w-9/12 dark:text-slate-300 text-[16px] sm:text-xl">
            Yet there is no projects available to collaborate, check later 😊
          </p>
        )}
      </div>
    </div>
  );
};

export default Collab;
