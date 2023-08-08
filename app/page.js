import Link from "next/link";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export default function Home() {
  return (
    <main className="mt-10 min-h-[400px] w-[95%] md:w-8/12 mx-auto md:mt-24 flex flex-col gap-5 md:gap-10">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl text-slate-700 dark:text-gray-200 font-bold ">
        TaskCollab - Empower Your Team, Supercharge Productivity!
      </h1>
      <p className="text-center text-slate-600 dark:text-slate-500 text-[16px] sm:text-xl ">
        Welcome to TaskCollab, your ultimate solution for seamless task
        tracking, collaboration, and team management! TaskCollab is a powerful
        web application designed to streamline your team's workflow, allowing
        you to conquer even the most ambitious projects with ease.
      </p>
      <div className=" flex justify-center gap-2">
        <Link href="/create">
          <button type="button" className="btnStyle">
            Create Project
          </button>
        </Link>
        <Link href="/join">
          <button type="button" className="btnStyle">
            Join Project
          </button>
        </Link>
      </div>
    </main>
  );
}
