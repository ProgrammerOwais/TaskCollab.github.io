"use client";
import { useEffect, useState, useContext } from "react";
import ProjectContext from "@/components/ProjectContext";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
const ProjectDetails = () => {
  // get the projec data from ProjectContext
  const { projects, updateProjects } = useContext(ProjectContext);
  const searchParams = useSearchParams();
  // get the id from url
  const id = searchParams.get("id");
  const { data: session } = useSession();
  // state for showing names
  const [showNames, setShowNames] = useState(false);
  // state for checking wether you are the member or not
  const [isMember, setIsMember] = useState(false);
  const [project, setProject] = useState(null);
  const [join, setJoin] = useState(false);
  const [message, setMessage] = useState("");
  // const [chatHistory, setChatHistory] = useState([]);
  const [state, setState] = useState(false);
  const [edit, setEdit] = useState({ state: false, index: null });
  // send the message to the backend & display in message box
  const handleSendMsg = async () => {
    if (message.length === 0) {
      return alert("plz enter some data");
    }
    let currentTime = new Date();
    const updatedChat = [...project.chatData];
    updatedChat.push({
      name: session?.user?.name,
      email: session?.user?.email,
      data: message,
      time: `${currentTime.getHours()}:${currentTime.getMinutes()}`,
    });

    setProject((prevProject) => ({ ...prevProject, chatData: updatedChat }));
    setMessage("");
    await fetch(`api/posts/${id}/post`, {
      method: "PATCH",
      body: JSON.stringify({
        chatData: updatedChat,
      }),
    });
  };
  // del the message from backend & remove it from frontend
  const handleDelMsg = async (index) => {
    const updatedChat = [...project.chatData];
    if (updatedChat[index].email === session?.user?.email) {
      try {
        updatedChat.splice(index, 1);
        setProject((prevProject) => ({
          ...prevProject,
          chatData: updatedChat,
        }));
        await fetch(`api/posts/${id}/post`, {
          method: "PATCH",
          body: JSON.stringify({
            chatData: updatedChat,
          }),
        });
      } catch (error) {
        console.log("the error while deleting the chat : ", error);
      }
    } else {
      alert("sorry you can't delete it");
    }
  };
  const handleEditMsg = async (index) => {
    try {
      let updatedChat = [...project.chatData];
      updatedChat[index].data = message;
      setMessage("");
      setEdit({ state: false, index: null });
      setProject((prevProject) => ({ ...prevProject, chatData: updatedChat }));
      setMessage("");
      await fetch(`api/posts/${id}/post`, {
        method: "PATCH",
        body: JSON.stringify({
          chatData: updatedChat,
        }),
      });
    } catch (error) {
      console.log("the error while editin the msg : ", error);
    }
  };

  // make the member of this project
  const joinUser = async () => {
    setJoin(true);
    try {
      const updatedUsers = [...project.users];
      updatedUsers.push({
        name: session?.user?.name,
        email: session?.user?.email,
      });

      await fetch(`api/posts/${id}/post`, {
        method: "PATCH",
        body: JSON.stringify({
          users: updatedUsers,
        }),
      });
      setProject((preProject) => ({ ...preProject, users: updatedUsers }));
      // also make these changes happen in temporary stored projects data
      let updatedData = projects?.map((data) => {
        if (data._id === id) {
          return { ...data, users: updatedUsers };
        }
        return data;
      });
      updateProjects(updatedData);
      setIsMember(() => true);
    } catch (error) {
      console.log("the error while joining the user : ", error);
    } finally {
      setJoin(false);
    }
  };
  // set task to users
  const setTaskToUser = async (index) => {
    setJoin(true);
    try {
      const updatedTask = [...project.task];
      updatedTask[index].activeUser = session?.user?.name;
      updatedTask[index].status = true;
      updatedTask[index].startingDate = new Date().toISOString().slice(0, 10);
      setProject((prevProject) => ({ ...prevProject, task: updatedTask }));
      const res = await fetch(`api/posts/${id}/post`, {
        method: "PATCH",
        body: JSON.stringify({
          task: updatedTask[index],
          index: index,
        }),
      });
      const data = await res.json();
      setProject((preProject) => data);
    } catch (error) {
      console.log("the error while setting task to user: ", error);
    } finally {
      setJoin(false);
    }
  };

  const userWorking = async (index) => {
    try {
      const updatedTask = [...project.task];
      // if the user is already working in the task & not yet completed
      // then make this field default
      if (
        updatedTask[index].activeUser === session?.user.name &&
        !updatedTask[index].completion
      ) {
        updatedTask[index].activeUser = "";
        updatedTask[index].status = false;
        updatedTask[index].startingDate = "";
      }
      // if user is not working , then fill the field
      setProject((prevProject) => ({ ...prevProject, task: updatedTask }));
      const res = await fetch(`api/posts/${id}/post`, {
        method: "PATCH",
        body: JSON.stringify({
          task: updatedTask[index],
          index: index,
        }),
      });
      const data = await res.json();
      setProject((preProject) => data);
    } catch (error) {
      console.log("the error while setting task to user: ", error);
    }
  };
  // set the task completion functionlaity
  const taskCompletion = async (index) => {
    const updatedTask = [...project.task];
    updatedTask[index].completion = !updatedTask[index].completion;
    setProject((prevProject) => ({ ...prevProject, task: updatedTask }));
    const res = await fetch(`api/posts/${id}/post`, {
      method: "PATCH",
      body: JSON.stringify({
        task: updatedTask[index],
        index: index,
      }),
    });
    const data = await res.json();
    setProject((preProject) => data);
  };
  // delete the task
  const handleDelTask = async (index) => {
    let isConfirm = confirm("Are you sure, do you wanna delete this task?");
    if (isConfirm) {
      let updatedTask = [...project.task];
      updatedTask.splice(index, 1);
      setProject((preProject) => ({
        ...preProject,
        task: updatedTask,
      }));
      // post the changes to database
      await fetch(`api/posts/${id}/post`, {
        method: "PATCH",
        body: JSON.stringify({
          task: updatedTask,
          index: false,
        }),
      });
    }
  };
  useEffect(() => {
    const fetchPostData = async () => {
      const res = await fetch(`/api/posts/${id}/post`);
      const data = await res.json();
      setProject(data);
    };

    if (id) {
      fetchPostData();
    }
    if (project) {
      setState(true);
      // if the logged in user is the member of the project
      project.users.map((user) => {
        if (user.email === session?.user?.email) {
          setIsMember(true);
        }
      });
    }
  }, [session?.user]);

  // check if the user is already the member
  const projectInovation = () => {
    if (project) {
      setState(true);
      project.users.map((user) => {
        if (user.email === session?.user?.email) {
          setIsMember(true);
        }
      });
    }
  };
  if (!state) {
    projectInovation();
  }

  let privateHandler = false;

  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);

  // toggle the tasks
  const handleToggleTask = (index) => {
    setExpandedTaskIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  // toggle the names
  const handleToggleNames = () => {
    setShowNames((prevShowNames) => !prevShowNames);
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
      {project?.projectName ? (
        <>
          <div className="p-3 md:p-6 w-11/12 md:w-10/12 mx-auto bg-white rounded-lg shadow-md flex flex-col dark:bg-slate-800 dark:border-2 text-slate-600 dark:text-slate-500  dark:border-slate-700 dark:shadow-inner dark:shadow-slate-700  mt-5">
            <div className="flex flex-col gap-10 justify-start md:flex-row md:justify-center  md:md:gap-2">
              <div className="flex flex-col gap-2 mx-auto w-11/12 md:m-0 md:w-5/12">
                <h2 className="text-2xl font-bold mb-2 text-purple-700 dark:text-blue-600 capitalize">
                  {project.projectName}
                </h2>
                {/* // check wether it crosses the limit of projects members  */}
                {project.teamMembers &&
                project.teamMembers <= project.users.length ? (
                  <>
                    <p className="text-slate-600 dark:text-slate-500 ">
                      {" "}
                      The members of this project are full.
                    </p>
                    {/* // also check if the project is private & you are invited  */}
                    <>
                      {project.projectType === "private" ? (
                        project.invitedUsers.map((user) => {
                          if (user === session?.user?.email) {
                            privateHandler = true;
                          }
                        })
                      ) : (
                        <></>
                      )}
                    </>
                  </>
                ) : (
                  <>
                    {" "}
                    {project.projectType === "private" ? (
                      <>
                        {/* // check if you are invited or not  */}
                        {project.invitedUsers.map((user) => {
                          if (user === session?.user?.email) {
                            privateHandler = true;
                          }
                        })}
                        {/* // show the sensitive detail if you are the member or owner  */}
                        {privateHandler === true ||
                        project.creator.email === session?.user?.email ? (
                          <>
                            {isMember ? (
                              <>
                                {project.creator.email ===
                                session?.user?.email ? (
                                  <p className="text-slate-600 dark:text-slate-500 ">
                                    You are the admin of this project
                                  </p>
                                ) : (
                                  <p className="text-slate-600 dark:text-slate-500 ">
                                    You are the member of this project
                                  </p>
                                )}
                              </>
                            ) : (
                              <button
                                className="btnStyle self-start"
                                onClick={joinUser}
                              >
                                {join ? "Joining..." : "Join Project"}
                              </button>
                            )}
                          </>
                        ) : (
                          <p className="text-slate-600 dark:text-slate-500 ">
                            This is a private project, you can't contribute
                            here, sorry
                          </p>
                        )}
                      </>
                    ) : isMember ? (
                      <>
                        {project.creator.email === session?.user?.email ? (
                          <p className="text-slate-600 dark:text-slate-500 ">
                            You are the admin of this project
                          </p>
                        ) : (
                          <p className="text-slate-600 dark:text-slate-500 ">
                            You are the member of this project
                          </p>
                        )}
                      </>
                    ) : (
                      <button
                        className="btnStyle self-start"
                        onClick={joinUser}
                      >
                        {join ? "Joining..." : "Join Project"}
                      </button>
                    )}
                  </>
                )}

                <p className="mb-2 text-slate-600 dark:text-slate-500 ">
                  Type: {project.projectType}
                </p>
                <p className="mb-2 text-slate-600 dark:text-slate-500 ">
                  Description: {project.projectDescription}
                </p>
                <p className="mb-2 text-slate-600 dark:text-slate-500  capitalize">
                  Admin: {project.creator.username}
                </p>
                <p>
                  {project.projectType === "private"
                    ? privateHandler ||
                      project.creator.email === session?.user?.email
                      ? `Team Members: ${project.users.length}`
                      : "Team Members: Private Not Visible To You"
                    : project.teamMembers
                    ? `Team Members: ${project.users.length}`
                    : ""}
                </p>
                <div className="mt-4 ">
                  <button onClick={handleToggleNames} className="btnStyle">
                    {showNames ? "Hide Members" : "Show Members"}
                  </button>
                  {showNames && (
                    <ul className="mt-2 bg-gray-100 flex flex-col gap-1 pl-2  dark:bg-slate-800 dark:border-2 dark:border-slate-700 dark:shadow-inner dark:shadow-slate-700">
                      {project.projectType === "private" ? (
                        <>
                          {privateHandler ||
                          project.creator.email === session?.user?.email ? (
                            project.users.map((user, index) => (
                              <li key={index} className="text-slate-500">
                                {user.name}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-500">
                              Its private not visible to you.
                            </li>
                          )}
                        </>
                      ) : (
                        project.users.map((user, index) => (
                          <li key={index} className="text-slate-500">
                            {user.name}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div className="mx-auto md:m-0 w-11/12 md:w-1/2">
                {" "}
                <h3 className="text-lg font-bold mb-2 text-purple-500 dark:text-blue-600 ">
                  Tasks:
                </h3>
                {project.task.length === 0 ? (
                  <h2>Yet no tasks are assigned to users</h2>
                ) : (
                  <>
                    {project.task.map((taskItem, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 rounded relative p-0 mb-2 flex flex-col gap-3  dark:bg-slate-800 dark:border-2 dark:border-slate-700 dark:shadow-inner dark:shadow-slate-700"
                      >
                        {project.creator.email === session?.user?.email ? (
                          <button
                            type="button"
                            onClick={() => handleDelTask(index)}
                            className="cursor-pointer absolute right-2 top-1 text-[12px] text-black dark:text-slate-400 dark:hover:text-slate-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="2"
                              className="w-4 h-4 stroke-slate-600 hover:stroke-red-500  active:stroke-red-400 dark:stroke-blue-600 dark:hover:stroke-red-500 dark:active:stroke-red-400"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        ) : (
                          ""
                        )}
                        <button
                          onClick={() => handleToggleTask(index)}
                          className="text-purple-600 dark:text-blue-600  text-left font-bold mb-2 focus:outline-none w-full p-4 pb-0 capitalize"
                        >
                          {taskItem.name}
                        </button>
                        {expandedTaskIndex === index && (
                          <>
                            <div className="p-4 pt-2 relative">
                              {!taskItem.status && isMember ? (
                                <button
                                  type=" button"
                                  onClick={() => setTaskToUser(index)}
                                  aria-label="invite button"
                                  className={`btnStyle absolute right-5 -top-8 ${
                                    join
                                      ? "bg-purple-500 hover:bg-purple-500 dark:bg-blue-500 dark:hover:bg-blue-500 "
                                      : "bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-500 "
                                  }  `}
                                >
                                  {join ? "Joining..." : "Start Task"}
                                </button>
                              ) : (
                                ""
                              )}

                              <p className=" text-sm mb-2">
                                {taskItem.description}
                              </p>
                              <div className=" text-sm mb-2 flex justify-start items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={taskItem.activeUser ? true : false}
                                  onClick={() => userWorking(index)}
                                />{" "}
                                <span>
                                  {taskItem.activeUser ? (
                                    <>
                                      {!taskItem.completion
                                        ? `${taskItem.activeUser} is working on it`
                                        : `This task is completed by ${taskItem.activeUser}`}
                                    </>
                                  ) : (
                                    "This Project is available to work"
                                  )}
                                </span>
                              </div>
                              <p className=" text-sm mb-2 flex flex-col gap-3">
                                <span>
                                  Starting Date:{" "}
                                  {taskItem.startingDate
                                    ? taskItem.startingDate
                                    : "Not yet started"}
                                </span>

                                <span>
                                  {" "}
                                  {taskItem.dueDate && taskItem.startingDate
                                    ? `Due Date: ${taskItem.dueDate}`
                                    : ""}
                                </span>
                              </p>
                              <div className=" text-sm mb-2 flex justify-start items-center  gap-2">
                                <span>Completed</span>
                                <input
                                  type="checkbox"
                                  onClick={() => {
                                    if (
                                      taskItem.activeUser ===
                                      session?.user?.name
                                      // &&
                                      // privateHandler
                                    ) {
                                      taskCompletion(index);
                                    }
                                  }}
                                  checked={taskItem.completion ? true : false}
                                />{" "}
                              </div>
                            </div>
                            {/* Include other task details here */}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <hr className="h-[2px] bg-slate-600 my-6" />
            {project.users.some(
              (data) => data.email === session?.user?.email
            ) ? (
              <div className="w-full md:w-3/4  my-1 p-0 md:my-4 md:p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <div className="h-[250px] p-3 md:p-4 border rounded-md overflow-y-auto">
                  {project?.chatData?.map((chat, index) => (
                    <div key={index} className="mb-2 w-full md:w-3/4">
                      <div className="border relative rounded-sm border-slate-400 px-2 py-4">
                        <div className="flex justify-between gap-1 text-[12px] absolute text-slate-600 dark:text-slate-400 right-2 top-0">
                          {chat.email === session?.user?.email ? (
                            <>
                              <span
                                className="cursor-pointer dark:hover:text-slate-300 "
                                onClick={() => {
                                  setEdit({ state: true, index: index }),
                                    setMessage(chat.data);
                                }}
                              >
                                Edit
                              </span>
                              <span
                                className="cursor-pointer dark:hover:text-slate-300 "
                                onClick={() => handleDelMsg(index)}
                              >
                                X
                              </span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <span className="font-semibold underline absolute left-2 text-[12px] top-0 dark:text-slate-400 text-slate-500">
                          {chat.name}
                        </span>{" "}
                        <span className="text-[14px] pr-8"> {chat.data}</span>
                        <span className="font-semibold cursor-pointer absolute right-2 bottom-0 text-[12px]  text-slate-600 dark:text-slate-400">
                          {chat.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full rounded border-2 border-gray-300 focus:outline-none focus:border-gray-400 p-2 dark:text-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-slate-600 dark:border-2 dark:focus:border-2 dark:outline-none  dark:shadow-inner dark:shadow-slate-700"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        edit.state
                          ? handleEditMsg(edit.index)
                          : handleSendMsg();
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      edit.state ? handleEditMsg(edit.index) : handleSendMsg();
                    }}
                    className="btnStyle self-start"
                  >
                    {edit.state ? "Edit" : "Send"}
                  </button>
                </div>
              </div>
            ) : (
              <h2> The chat section is not available to you.</h2>
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default ProjectDetails;
