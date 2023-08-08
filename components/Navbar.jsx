"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRef } from "react";

const Navbar = () => {
  // themeSwitcher & hamburger element
  let hamburger = useRef();

  // providers will use to get the user value
  const [providers, setProviders] = useState(null);
  const [themeToggle, setThemeToggle] = useState(false);
  // for toggling the nav-menu in mobile
  const [toggleDropdown, setToggleDropdown] = useState(false);
  function setTheme(themeName) {
    localStorage.setItem("theme", themeName);
    document.documentElement.className = themeName;
  } // Hamburger animation & nav toggling
  const handleHamburger = () => {
    const span = hamburger.current.querySelector("span");
    span.classList.toggle("active");
    setToggleDropdown(!toggleDropdown);
  };

  // function to toggle between light and dark theme
  function toggleTheme() {
    if (localStorage.getItem("theme") === "dark") {
      setTheme("light");
      setThemeToggle(true);
    } else {
      setTheme("dark");
      setThemeToggle(false);
    }
  }
  useEffect(() => {
    (async () => {
      // get the theme from local storage
      if (localStorage.getItem("theme") === "dark") {
        setTheme("dark");
        setThemeToggle(false);
      } else {
        setTheme("light");
        setThemeToggle(true);
      }
      // get the provider as the page render
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const { data: session } = useSession();

  return (
    <nav className="w-full relative  shadow-md ">
      <div className="flex justify-between items-center w-[95%] lg:max-w-[1200px] mx-auto  h-[70px] py-8">
        <div
          className="w-[15%] flex 
        h-[70px] justify-between items-center overflow-y-hidden"
        >
          <Link href={"/"}>
            {themeToggle ? (
              <Image
                src={"/light_logo.png"}
                width={110}
                height={110}
                alt="logo"
              />
            ) : (
              <Image src={"/dark_logo.png"} width={90} height={90} alt="logo" />
            )}
          </Link>
        </div>

        {/* desktop navigation menu */}
        <div className="hidden sm:flex w-[80%]  justify-between items-center">
          <div className="sm:w-[70%]  md:w-[60%]">
            <ul className="w-full flex justify-around  text-slate-700 dark:text-gray-200 items-center">
              <li>
                <Link
                  className="text-[14px] md:text-xl/4 border-slate-500 dark:border-gray-200 focus:border-b-4 pb-1 cursor-pointer  "
                  href={"/projects"}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  className="text-[14px] border-slate-500 dark:border-gray-200 focus:border-b-4 pb-1 md:text-xl/4 cursor-pointer"
                  href={"/create"}
                >
                  Create +
                </Link>
              </li>
              <li>
                <Link
                  className="text-[14px] border-slate-500 dark:border-gray-200 focus:border-b-4 pb-1 md:text-xl/4 no-underline cursor-pointer"
                  href={"/join"}
                >
                  Joined
                </Link>
              </li>
              <li>
                <Link
                  className="text-[14px] border-slate-500 dark:border-gray-200 focus:border-b-4 pb-1 md:text-xl/4 no-underline cursor-pointer"
                  href={"/collab"}
                >
                  collaboration
                </Link>
              </li>
            </ul>
          </div>
          <div className="sm:w-[10%]  md:w-[15%]">
            <label id="switch" className="switch">
              <input
                type="checkbox"
                onChange={toggleTheme}
                checked={themeToggle ? true : false}
                id="slider"
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="sm:w-[30%] md:w-[25%]  flex justify-end gap-3 items-center ">
            {session?.user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                  }}
                  className="btnStyle text-[14px] md:text-xl"
                >
                  SignOut
                </button>
                <Link href={`/profile/${session?.user?.id}`}>
                  <Image
                    src={session?.user.image}
                    alt="signout logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Link>
              </>
            ) : (
              <>
                {providers &&
                  Object.values(providers).map((provider) => (
                    <button
                      type="button"
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="btnStyle text-[14px] md:text-xl"
                    >
                      SignIn
                    </button>
                  ))}{" "}
              </>
            )}
          </div>
        </div>
        {/* mobile navigation menu  */}
        <button
          ref={hamburger}
          onClick={handleHamburger}
          className=" sm:hidden btn effect1"
        >
          <span></span>
        </button>
        {toggleDropdown && (
          <div className="sm:hidden z-10 w-full  border-red-600  min-h-[90vh] absolute left-0 top-[70px] bg-slate-800/90  dark:bg-black/80  flex  flex-col justify-center items-center">
            <div className=" flex flex-col justify-center items-center gap-4">
              {" "}
              <div className="  w-[300px]  ">
                <ul className="w-full flex flex-col gap-4 justify-around  text-gray-200 dark:text-gray-200 items-center">
                  <li>
                    <Link
                      onClick={handleHamburger}
                      className="text-2xl cursor-pointer focus:underline "
                      href={"/projects"}
                    >
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleHamburger}
                      className="text-2xl focus:underline cursor-pointer"
                      href={"/create"}
                    >
                      Create +
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleHamburger}
                      className="text-2xl  focus:underline no-underline cursor-pointer"
                      href={"/join"}
                    >
                      Join
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleHamburger}
                      className="text-2xl focus:underline  no-underline cursor-pointer"
                      href={"/collab"}
                    >
                      collaboration
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="w-[20%] ">
                <label id="switch" className="switch">
                  <input type="checkbox" onChange={toggleTheme} id="slider" />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="w-[50%]   flex justify-center gap-4 items-center ">
                {session?.user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                      }}
                      className="btnStyle text-[14px] md:text-xl"
                    >
                      SignOut
                    </button>
                    <Link href={`/profile/${session?.user?.id}`}>
                      <Image
                        src={session?.user.image}
                        alt="signout Logo"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </Link>
                  </>
                ) : (
                  <>
                    {providers &&
                      Object.values(providers).map((provider) => (
                        <button
                          type="button"
                          key={provider.name}
                          onClick={() => signIn(provider.id)}
                          className="btnStyle text-[14px] md:text-xl "
                        >
                          SignIn
                        </button>
                      ))}{" "}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
