"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import ProjectContext from "@/components/ProjectContext";
import Loader from "@/components/Loader";

import { useSearchParams } from "next/navigation";

const EditProjectData = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // get the project data from ProjectContext
  // const { projects, updateProjects } = useContext(ProjectContext);
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const [invitedUsers, setinvitedUsers] = useState("");
  // set the form data properties
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "open source",
    projectDescription: "",
    teamMembers: "",
    task: [
      {
        name: "",
        description: "",
        status: false,
        completion: false,
        activeUser: "",
        dueDate: "",
        startingDate: "",
      },
    ],
    users: [],
    invitedUsers: [],
  });

  // let project = projects?.filter((data) => data._id === id);

  useEffect(() => {
    // get the project data from api & set into the project form data
    const fetchPostData = async () => {
      const res = await fetch(`/api/posts/${id}/post`);
      const data = await res.json();
      setFormData(data);
    };
    if (id) {
      fetchPostData();
    }
  }, [session?.user]);

  // Any of input changes, make changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  //  set the input values of invited users field (private projects)
  const handleUserChange = (event) => {
    setinvitedUsers((prev) => (prev = event.target.value));
  };
  // as you enter the key, add the invited users email in the project (private projects)
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      let updatedInvitedUser = [...formData.invitedUsers];
      updatedInvitedUser.push(event.target.value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        invitedUsers: updatedInvitedUser,
      }));
      setinvitedUsers(() => "");
    }
  };
  // delete the invited users (private proejcts)
  const delUsers = (index) => {
    const updatedUsers = [...formData.invitedUsers];
    updatedUsers.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      invitedUsers: updatedUsers,
    }));
  };
  // set the input values in task input fields
  const handleTaskInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTask = [...formData.task];
    updatedTask[index][name] = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      task: updatedTask,
    }));
  };
  // add new task in the project
  const handleAddTask = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      task: [
        ...prevFormData.task,
        {
          name: "",
          description: "",
          status: false,
          completion: false,
          activeUser: "",
          dueDate: "",
          startingDate: "",
        },
      ],
    }));
  };
  // submit updated data
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // check if any of the necessary field is empty
      if (
        !formData.projectName ||
        !formData.projectDescription ||
        !formData.teamMembers
      ) {
        alert("Make sure to fill all the * fields ");
        return;
      }
      let isTaksDataEmpty = false;
      formData.task.map((data) => {
        if (!data.name || !data.description) {
          isTaksDataEmpty = true;
        }
      });
      if (isTaksDataEmpty) {
        alert("Make sure to fill all the * fields ");
        return;
      }
      setSubmitting(true);
      const res = await fetch(`/api/posts/update/${formData._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          projectName: formData.projectName,
          projectDescription: formData.projectDescription,
          projectType: formData.projectType,
          teamMembers: formData.teamMembers,
          task: formData.task,
          users: formData.users,
          invitedUsers: formData.invitedUsers,
          userId: session?.user?.id,
        }),
      });
      if (res.ok) {
        alert("you data is successfully updated");
        // let updatedData = projects?.map((data) => {
        //   if (data._id === id) {
        //     return formData;
        //   }
        //   return data;
        // });
        // updateProjects(updatedData);
        setFormData(
          (prevForm) =>
            (prevForm = {
              projectName: "",
              projectType: "open source",
              projectDescription: "",
              teamMembers: "",
              task: [
                {
                  name: "",
                  description: "",
                  status: false,
                  completion: false,
                  activeUser: "",
                  dueDate: "",
                  startingDate: "",
                },
              ],
              users: [],
              invitedUsers: [],
            })
        );
        router.push("/");
      }
    } catch (error) {
      console.error("Error while submitting the data:", error);
    } finally {
      setSubmitting(false);
    }
  };
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
      {formData ? (
        <form
          onSubmit={handleSubmit}
          className="max-w-[90%] md:max-w-md mx-auto mt-12 bg-white rounded-lg p-3 md:p-6 shadow-md text-slate-600 dark:text-blue-300 dark:bg-slate-800 dark:border-2 dark:border-slate-700 dark:shadow-inner dark:shadow-slate-700"
        >
          <div>
            <label htmlFor="projectName" className="block pb-1 mt-2">
              Project Name <span className="text-red-500">*</span> :
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData?.projectName}
              onChange={handleInputChange}
              className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
              required={true}
            />
          </div>
          <div>
            <label htmlFor="projectDescription" className="block pb-1 mt-2">
              Project Description <span className="text-red-500">*</span> :
            </label>
            <input
              type="text"
              id="projectDescription"
              name="projectDescription"
              value={formData?.projectDescription}
              onChange={handleInputChange}
              className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
              required={true}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="projectType" className="block pb-1 mt-2">
              Project Type:
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="openSource"
                name="projectType"
                value="open source"
                checked={formData?.projectType === "open source"}
                onChange={handleInputChange}
                className="mr-1"
                required={formData?.projectType !== "" ? true : false}
              />
              <label htmlFor="openSource" className="mr-4">
                Open Source
              </label>
              <input
                type="radio"
                id="private"
                name="projectType"
                value="private"
                checked={formData?.projectType === "private"}
                onChange={handleInputChange}
                className="mr-1"
                required={formData?.projectType !== "" ? true : false}
              />
              <label htmlFor="private" className="mr-4">
                Private
              </label>
            </div>
          </div>
          {formData?.projectType === "private" ? (
            <div className="mt-4">
              <label htmlFor="invitedMembers" className="block pb-1 mt-2">
                Add Project Members Email{" "}
                <span className="text-red-500">*</span> :
              </label>
              <input
                type="email"
                id="invitedMembers"
                name="invitedMembers"
                value={invitedUsers}
                onChange={handleUserChange}
                placeholder="Users which will work on this project"
                className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
                onKeyDown={handleKeyPress}
                required={false}
              />
              <p className="p-2 pl-4 m-2 text-[14px] flex flex-wrap gap-3 bg-slate-300 rounded-xl [word-spacing:8px]">
                {formData?.invitedUsers.map((user, index) => (
                  <span
                    key={index}
                    className="relative p-2 px-4 border-bottom bg-slate-200 border-gray-200 rounded-2xl dark:bg-slate-600 dark:text-gray-200"
                  >
                    {user}{" "}
                    <span
                      onClick={() => delUsers(index)}
                      className="absolute -top-1   right-[7px] cursor-pointer text-[14px] text-red-500"
                    >
                      x
                    </span>
                  </span>
                ))}
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="mt-4">
            <label htmlFor="teamMembers" className="block pb-1 mt-2">
              Numbers of Team Members <span className="text-red-500">*</span> :
            </label>
            <input
              type="number"
              id="teamMembers"
              name="teamMembers"
              value={formData?.teamMembers}
              onChange={handleInputChange}
              className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
              required={true}
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-bold">Tasks:</h3>
            {formData?.task?.map((taskData, index) => (
              <div key={index} className="mt-2 md:mt-4 ml-2 w-11/12">
                {/* task name */}

                <h3 className="text-xl">Task: {index + 1}</h3>
                <label htmlFor={`name${index}`} className="block pb-1 mt-2">
                  Task Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={`name${index}`}
                  name="name"
                  value={taskData.name}
                  placeholder="Task Name"
                  onChange={(event) => handleTaskInputChange(index, event)}
                  className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
                  required={true}
                />
                {/* task description */}

                <label
                  htmlFor={`description${index}`}
                  className="block pb-1 mt-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={`description${index}`}
                  name="description"
                  value={taskData.description}
                  placeholder="Task Description"
                  onChange={(event) => handleTaskInputChange(index, event)}
                  className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
                  required={true}
                />
                <label htmlFor={`dueDate${index}`} className="block pb-1 mt-2">
                  Task Due Date (optional)
                </label>
                <input
                  type="date"
                  id={`dueDate${index}`}
                  name="dueDate"
                  value={taskData.dueDate}
                  placeholder="Due date [optional]"
                  onChange={(event) => handleTaskInputChange(index, event)}
                  className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
                />
                <hr className="border border-purple-300 dark:border-blue-300 mt-3" />
                {/* Add more task fields as needed */}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTask}
              className="mt-4 bg-blue-500 active:bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting ? true : false}
            className={`mt-4  ${
              submitting
                ? "bg-green-400 hover:bg-green-400"
                : "bg-green-500 hover:bg-green-600"
            }  text-white py-2 px-4 rounded `}
          >
            {submitting ? "Submitting" : "Submit"}
          </button>
        </form>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default EditProjectData;
