import { footerLinks } from "@/constants";
import Link from "next/link";

const FooterColumn = ({ title, link, data }) => {
  return (
    <div className="flex-1 flex flex-col gap-3 text-sm min-w-max">
      <h4 className="font-bold">{title}</h4>
      <ul className="flex flex-col gap-2">
        {data.map((name) => (
          <Link
            className="hover:text-slate-800 dark:hover:text-slate-400"
            href={link}
            key={name}
          >
            {name}
          </Link>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="flex-col pb-5 text-slate-600 dark:text-slate-500 paddings w-[95%] lg:max-w-[1200px] mx-auto  gap-20 bg-light-white flex items-center justify-start ">
      <div className="flex flex-col gap-12 w-full  mx-auto max-w-screen-xl">
        <div className="flex items-start flex-col">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl text-slate-700 dark:text-gray-200 font-bold">
            TaskCollab
          </h2>

          <p className=" text-start text-small font-normal max-w-xl mt-5">
            Let's get your project done with your teams & enthusiastice open
            source developer by using Task_Collab web app.
          </p>
        </div>
        <div className=" flex flex-wrap gap-12">
          <FooterColumn
            title={footerLinks[0].title}
            data={footerLinks[0].data}
            link={footerLinks[0].link}
          />
          <div className=" flex flex-col flex-wrap gap-4">
            <FooterColumn
              title={footerLinks[1].title}
              data={footerLinks[1].data}
              link={footerLinks[1].link}
            />
            <FooterColumn
              title={footerLinks[2].title}
              data={footerLinks[2].data}
              link={footerLinks[2].link}
            />
          </div>
          <FooterColumn
            title={footerLinks[3].title}
            data={footerLinks[3].data}
            link={footerLinks[3].link}
          />
          <div className=" flex flex-col flex-wrap gap-4">
            <FooterColumn
              title={footerLinks[4].title}
              data={footerLinks[4].data}
              link={footerLinks[4].link}
            />
            <FooterColumn
              title={footerLinks[5].title}
              data={footerLinks[5].data}
              link={footerLinks[5].link}
            />
          </div>
          <FooterColumn
            title={footerLinks[6].title}
            data={footerLinks[6].data}
            link={footerLinks[6].link}
          />
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-sm:flex-col text-sm font-normal mx-auto max-w-screen-xl">
        <p>@ 2023, Task_Collab, All rights are reserved</p>
        <p className="text-gray">
          Created By <span className="dark:text-blue-500">Muhammad Owais</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
