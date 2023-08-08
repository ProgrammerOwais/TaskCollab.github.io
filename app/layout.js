import Footer from "@/components/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Provider from "@/components/Provider";
import { ProjectProvider } from "@/components/ProjectContext";

export const metadata = {
  title: "TaskCollab",
  description:
    " Welcome to TaskCollab, your ultimate solution for seamless task   tracking, collaboration, and team management! TaskCollab is a powerful   web application designed to streamline your team's workflow, allowing   you to conquer even the most ambitious projects with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="dark:bg-slate-800 dark:text-gray-200 overflow-x-hidden">
        <Provider>
          <Navbar />
          <ProjectProvider>{children}</ProjectProvider>
          <hr className="border-slate-500 my-5" />
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
