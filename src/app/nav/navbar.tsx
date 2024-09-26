import { useEffect, useState } from "react";
import ProfileCircle from "./profile-circle";
import { Link, Outlet } from "react-router-dom";
import { BsChevronDoubleLeft } from "react-icons/bs";
import { BsChevronDoubleRight } from "react-icons/bs";

import { PiBlueprint } from "react-icons/pi";

const iconSize = "1.8rem";

const links = [
  {
    to: "/project",
    label: "Projects",
    icon: <PiBlueprint size={iconSize} />,
  },
];

function NavBar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to handle window resize
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Set up event listener for window resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (windowWidth > 768) {
    return <LargeScreenNavBar />;
  } else {
    return <SmallScreenNavBar />;
  }
}

function LargeScreenNavBar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-row justify-start h-screen relative bg-sims-beige">
      <div className="py-2 px-4 absolute right-0 bg-white rounded shadow">
        <ProfileCircle />
      </div>
      <div className="flex flex-col bg-white shadow-sm border-r-gray-300 border-r">
        <div
          className={`
            pt-3
            ${isOpen ? "w-32" : "w-12"} transition-all duration-300`}
        >
          <div className="flex flex-start flex-col items-center relative">
            <button
              className="p-1 absolute border bg-gray-100 rounded-full -bottom-4 -right-2 shadow-lg"
              onClick={toggleSidebar}
            >
              {isOpen ? (
                <BsChevronDoubleLeft size=".6rem" />
              ) : (
                <BsChevronDoubleRight size=".6rem" />
              )}
            </button>
            <div className={isOpen ? "p-3" : "p-1"}>
              <img
                src="/assets/Sims_Logo_Brand_Green.png"
                alt="Terrier Pro App Icon"
                // style={{ height: "2.5rem", width: "2.5rem" }}
              />
            </div>
          </div>
        </div>
        <nav>
          <ul>
            {links.map((link, index) => {
              return (
                <>
                  <hr className="mx-2" />
                  <li key={index}>
                    <Link to={link.to}>
                      <div
                        className={`
                      pl-1 pr-2 py-3
                      flex flex-row 
                      group
                      hover:bg-slate-200 ${
                        isOpen ? "justify-between" : "justify-center"
                      }`}
                      >
                        <div
                          className={`${
                            isOpen ? "" : "flex justify-center"
                          } transition-all duration-300 group-hover:text-gray-700`}
                        >
                          {link.icon}
                        </div>
                        <div
                          className={`${
                            isOpen ? "block" : "hidden"
                          } transition-all duration-300`}
                        >
                          {link.label}
                        </div>
                      </div>
                    </Link>
                  </li>
                </>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

function SmallScreenNavBar() {
  return (
    <div className="flex flex-col">
      <div className="h-full bg-slate-200">
        <Outlet />
        <div className="h-16"></div>
      </div>
      <div className="pb-2 pt-1 px-2 border-t-2 shadow-sm fixed bottom-0 bg-slate-50">
        <nav className="w-screen p-1">
          <ul className="flex flex-row justify-around items-end">
            {links.map((link, index) => {
              return (
                <li key={index}>
                  <Link to={link.to}>
                    <div className="group-hover:text-gray-700">{link.icon}</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
