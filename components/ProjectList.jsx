import Link from "next/link";
import React from "react";
import EditProject from "./EditProject";
import Image from "next/image";

const ProjectList = ({ project, projects, setProjects, session, join }) => {
  return (
    <div className="bg-gray-200 p-6 pt-10 text-slate-700 dark:text-gray-300 dark:bg-slate-800 dark:border-2 dark:border-slate-700 dark:shadow-inner dark:shadow-slate-700    rounded-2xl w-10/12 md:w-5/12 lg:w-3/12 gap-1 shadow-md relative">
      {
        // project action
        project.creator.email === session?.user?.email ? (
          <EditProject
            project={project}
            projects={projects}
            setProjects={setProjects}
          />
        ) : (
          ""
        )
      }
      <div className="flex flex-col  gap-1 tracking-wider relative">
        <Link href={`/profile/${project.creator._id}`}>
          {" "}
          <Image
            src={project.creator.image}
            width={30}
            height={30}
            className="rounded-full absolute -top-7 left-0"
            alt="profile logo"
          />
        </Link>
        <h1 className="font-bold text-purple-500 capitalize dark:text-blue-500">
          {project.projectName}
        </h1>
        <hr className="border-slate-500" />
        <p className=" h-[70px]  overflow-hidden mb-2">
          <span className="font-bold">About</span>
          <br></br> {project.projectDescription}
          ...
        </p>
        {/* <hr /> */}
        {/* <p className="font-bold">Project Description:</p>
   <p className=" h-[40px] overflow pl-2">{project.projectDescription}...</p> */}
        <p>
          {" "}
          <span className="font-bold">Type</span> {project.projectType}{" "}
        </p>
        <p className="">
          <span className="font-bold">Tasks</span> {project.task.length}
        </p>
        <p className="">
          <span className="font-bold">Admin</span> {project.creator.username}
        </p>
        <p className="">
          <span className="font-bold">Team Members</span> {project.teamMembers}
        </p>
        <hr className="border-slate-500 " />

        <Link href={`/projectDetail?id=${project._id}`} className="">
          <span className="  text-purple-600 dark:text-blue-500">
            View Full
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectList;
