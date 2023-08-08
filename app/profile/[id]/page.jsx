"use client";
import { useContext } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ProjectList from "@/components/ProjectList";
import ProjectContext from "@/components/ProjectContext";

const Profile = ({ params }) => {
  const headings = [
    "Software Engineer at Tech 📊",
    "Frontend Developer at WebTech Solutions 🌐",
    "Cybersecurity Specialist at ShieldSec 🛡️",
    "AI Researcher at Future Labs 🤖",
    "Cloud Architect at CloudMasters ☁️",
    "UX/UI Designer at PixelCraft Studios 🎨",
    "Full-Stack Engineer at CodeCrafters 💻",
    "Blockchain Developer at CryptoTech Labs ⛓️",
    "Network Engineer at ConnectNet Solutions 🌐",
    "Mobile App Developer at AppGenius 📱",
  ];

  // get teh project data from ProjectContext
  const { projects, updateProjects } = useContext(ProjectContext);

  const { data: session } = useSession();

  // if the user is not logged In
  if (!session?.user) {
    return (
      <h1 className="text-3xl text-center mx-auto my-5">
        {" "}
        Sorry😌, Sign In than come back...
      </h1>
    );
  }

  return (
    <>
      {
        <section className="flexCenter flex-col w-[95%] lg:max-w-[1200px]   mx-auto paddings my-4">
          {/* if its his own profile  */}
          {session?.user?.id === params.id ? (
            <>
              <section
                className="flexBetween max-lg:flex-col
       w-[95%] sm:w-full mx-auto p-2 md:p-0"
              >
                <div className="flex items-center justify-center md:items-start flex-col gap-4 md:gap-10  text-slate-700 dark:text-gray-200">
                  <Image
                    src={session?.user?.image}
                    width={100}
                    height={100}
                    className="rounded-full"
                    alt="user image"
                  />
                  <p className="text-2xl sm:text-3xl md:text-4xl  font-bold capitalize">
                    {session?.user?.name}
                  </p>
                  <p className="text-xl text-center md:text-left  lg:text-4xl md:text-3xl font-extrabold md:max-w-lg">
                    {headings[Math.floor(Math.random() * headings.length)]}
                  </p>
                  <div className="flex justify-between items-center gap-5  flex-wrap">
                    <Link href={`mailto:${session?.user?.email}`}>
                      <button type="button" className="btnStyle">
                        Get Hired
                      </button>
                    </Link>
                    <button type="button" className=" btnStyle">
                      Follow
                    </button>
                  </div>{" "}
                </div>
              </section>

              <hr className="border-slate-500   my-4 " />
              <section className="py-2 my-4  ">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-700 text-center sm:text-left dark:text-gray-200">
                  My Projects
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start  gap-4">
                  {/* show only yours projects  */}
                  {projects
                    ? projects.map(
                        (project) =>
                          project?.creator?.email === session?.user?.email && (
                            <ProjectList
                              project={project}
                              projects={projects}
                              setProjects={updateProjects}
                              session={session}
                              join={false}
                            />
                          )
                      )
                    : ""}
                </div>
              </section>
              <hr className="border-slate-500 border my-4" />

              <section className="py-2 my-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center sm:text-left text-slate-700 dark:text-gray-200">
                  Collaborative Projects
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  {/* display only those projects which you are joined & 
                  not the owner of the projects  */}
                  {projects
                    ? projects.map((project, index) => {
                        let handleMember = false;
                        // if you are not the owner of this project
                        if (project?.creator?.email !== session?.user?.email) {
                          // but you are the member of this project
                          project.users.map((member) => {
                            if (member.email === session?.user?.email) {
                              handleMember = true;
                            }
                          });

                          return (
                            // if you are the member of this project, display it
                            <>
                              {handleMember === true ? (
                                <ProjectList
                                  key={index}
                                  project={project}
                                  setProjects={updateProjects}
                                  session={session}
                                  join={true}
                                />
                              ) : (
                                ""
                              )}
                            </>
                          );
                        }
                      })
                    : ""}
                </div>
              </section>
            </>
          ) : (
            // if its someone else profile
            <>
              <section
                className="flexBetween max-lg:flex-col
             w-[95%] sm:w-full mx-auto p-2 md:p-0"
              >
                <div className="flex items-center justify-center md:items-start flex-col gap-4 md:gap-10  text-slate-700 dark:text-gray-200">
                  {/* // check if the user of this id is exist, 
                  if it exists then display its detail */}
                  {projects?.find(
                    (project) => project.creator._id === params.id
                  ) === undefined ? (
                    <h2>No such user exists</h2>
                  ) : (
                    <>
                      <Image
                        src={
                          projects.find(
                            (project) => project.creator._id === params.id
                          ).creator.image
                        }
                        width={100}
                        height={100}
                        className="rounded-full"
                        alt="user image"
                      />
                      <p className="text-2xl sm:text-3xl md:text-4xl  font-bold capitalize">
                        {
                          projects.find(
                            (project) => project.creator._id === params.id
                          ).creator.username
                        }
                      </p>
                      <p className="text-xl text-center md:text-left  lg:text-4xl md:text-3xl font-extrabold md:max-w-lg">
                        {headings[Math.floor(Math.random() * headings.length)]}
                      </p>
                      <div className="flex justify-between items-center gap-5  flex-wrap">
                        <Link
                          href={`mailto:${
                            projects.find(
                              (project) => project.creator._id === params.id
                            ).creator.email
                          }`}
                        >
                          <button type="button" className="btnStyle">
                            Get Hired
                          </button>
                        </Link>
                        <button type="button" className=" btnStyle">
                          Follow
                        </button>
                      </div>{" "}
                    </>
                  )}
                </div>
              </section>

              <hr className="border-slate-500   my-4 " />
              <section className="py-2 my-4  ">
                <h2 className="text-2xl capitalize md:text-3xl font-bold mb-4 text-slate-700 text-center sm:text-left dark:text-gray-200">
                  His Projects
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start  gap-4">
                  {projects?.find(
                    (project) => project.creator._id === params.id
                  ) === undefined ? (
                    <h2>
                      Yet This user didn't create any project didn't create any
                      project
                    </h2>
                  ) : (
                    projects
                      // only display those projects which are his own
                      .filter((data) => data.creator._id === params.id)
                      .map((userProject, index) => (
                        <ProjectList
                          key={index}
                          project={userProject}
                          setProjects={updateProjects}
                          session={session}
                          join={false}
                        />
                      ))
                  )}
                </div>
              </section>
              <hr className="border-slate-500 border my-4" />

              <section className="py-2 my-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center sm:text-left text-slate-700 dark:text-gray-200">
                  Joined Projects
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  {/* display those projects which are joined by user but not his
                  own */}
                  {projects
                    ? projects.map((project, index) => {
                        let handleMember = false;
                        if (
                          project?.creator?.email !==
                          (projects.find(
                            (data) => data.creator._id === params.id
                          ) === undefined
                            ? project?.creator?.email
                            : projects.find(
                                (data) => data.creator._id === params.id
                              ).creator?.email)
                        ) {
                          project.users.map((member) => {
                            if (
                              member.email ===
                              projects.find(
                                (data) => data.creator._id === params.id
                              ).creator?.email
                            ) {
                              handleMember = true;
                            }
                          });

                          return (
                            <>
                              {handleMember === true ? (
                                <ProjectList
                                  key={index}
                                  project={project}
                                  setProjects={updateProjects}
                                  session={session}
                                  join={true}
                                />
                              ) : (
                                ""
                              )}
                            </>
                          );
                        }
                      })
                    : ""}
                </div>
              </section>
            </>
          )}
        </section>
      }
    </>
  );
};

export default Profile;
