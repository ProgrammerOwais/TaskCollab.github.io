import Link from "next/link";

const EditProject = ({ project, projects, setProjects }) => {
  // delete the project
  const handleDelete = async () => {
    const isConfirm = confirm("Are you sure, do you wanna delete it");
    if (isConfirm) {
      try {
        await fetch(`/api/posts/${project._id}/post`, {
          method: "DELETE",
        }).then(() => {
          let updateProjects = projects?.filter(
            (data) => data._id !== project._id
          );

          setProjects(updateProjects);
        });
      } catch (error) {
        console.log("the error while deleting the project : ", error);
      }
    }
  };
  return (
    <div className="flex  gap-1 absolute top-3 right-2 ">
      {" "}
      <Link
        className="flex justify-center items-center"
        href={`http://localhost:3000/editProject?id=${project._id}`}
      >
        {" "}
        <button
          type="button"
          className="cursor-pointer  dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            className="w-5 h-5 stroke-slate-600 hover:stroke-slate-700  active:stroke-slate-400 dark:stroke-blue-600 dark:hover:stroke-blue-500 dark:active:stroke-blue-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        className="cursor-pointer dark:hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          className="w-5 h-5 stroke-slate-600 hover:stroke-red-500  active:stroke-red-400 dark:stroke-blue-600 dark:hover:stroke-red-500 dark:active:stroke-red-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
};

export default EditProject;
