import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { useUser } from "@/context/UserContext";
import CompanyLogo from "../../../assets/images/SukoonSphere_Logo.png";
import links from "@/utils/SharedComp/PageLinks";
import DesktopNav from "./DesktopNav";
import UserMenu from "./UserMenu";
import { MdOutlineNotificationsActive, MdOutlinePassword } from "react-icons/md";
import { BiLogIn, BiUserPlus } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { BiMessageSquareAdd } from "react-icons/bi";
import { CiMedal } from "react-icons/ci";
import { BiUser } from "react-icons/bi";
function NavMenu() {
  const [activeSublink, setActiveSublink] = useState(null);
  const [miniMenu, setMiniMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const toggleMiniMenu = () => setMiniMenu(!miniMenu);
  const toggleSublink = (index) => {
    setActiveSublink(index === activeSublink ? null : index);
  };
  const { user: loggedInUser } = useUser();
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeSublink !== null) {
        setActiveSublink(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeSublink]);

  const handleLogout = async () => {
    try {
      await logout();
      setMiniMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const settingsLinks = user 
  ? [
      ...(loggedInUser?.role !== "contributor" 
        ? [
            ...(loggedInUser?.role === "admin" 
              ? [
                  {
                    name: "Notifications",
                    address: "/admin",
                    icon: <MdOutlineNotificationsActive />,
                  },
                ]
              : []),
            {
              name: "Become a contributor",
              address: "/user/request-contributor",
              icon: <CiMedal />,
            },
          ] 
        : []),
      {
        name: "Change Password",
        address: "/user/change-password",
        icon: <MdOutlinePassword />,
      },
      {
        name: "Logout",
        icon: <RxCross2 />,
        onClick: handleLogout,
      },
    ] 
  : [
      {
        name: "Sign Up",
        address: "/auth/sign-up",
        icon: <FiUserPlus />,
      },
      {
        name: "Login",
        address: "/auth/sign-in",
        icon: <BiLogIn />,
      },
    ];


  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden lg:flex w-full bg-[var(--white-color)] sticky top-0 items-center justify-between shadow-[0px_1px_10px_rgba(0,0,0,0.1)] z-50 transition-all ease-in-out p-2 h-[65px]">
        <div className="flex w-full justify-between items-center px-4 lg:px-20">
        <Link to="/">
          <img
            src={CompanyLogo}
            className="object-contain w-14"
            alt="Logo Loading..."
          />
          </Link>
          <DesktopNav links={links} />
          {user ? (
            <UserSection
              user={user}
              miniMenu={miniMenu}
              toggleMiniMenu={toggleMiniMenu}
              handleLogout={handleLogout}
            />
          ) : (
            <AuthButtons />
          )}
        </div>
      </nav>
      {/* New Mobile Top Header */}
      <header className="lg:hidden  left-0 right-0 bg-[var(--white-color)] h-14 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">

            <Link to="/">
              <img
                src={CompanyLogo}
                className="object-contain h-8 w-auto"
                alt="Logo"
              />
            </Link>

          </div>
          <div className="flex items-center gap-4">
            {user && (
              <Link to="/Posts">
                <BiMessageSquareAdd className="text-2xl" />
              </Link>
            )}
            {user ? (
              <Link to={`/about/user/${user._id}`}>
                <img
                  src={
                    user?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/147/147142.png"
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link to="/auth/sign-in">
                <button className="bg-[var(--secondary)] px-2 py-1 text-sm rounded-[6px] hover:scale-105 transition-all duration-300 hover:bg-[var(--secondary-hover)] flex items-center">
                  <BiUserPlus className="text-xl text-gray-600 inline-block" />
                  <span className="ml-2">Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--white-color)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
        <div className="flex justify-around items-center h-16">
          {links.map((link, index) => (
            <div key={link.name} className="relative group">
              {link.sublinks ? (
                <div
                  className="p-2 text-2xl text-[var(--grey--800)] hover:text-[var(--ternery)] transform transition-all duration-150 hover:scale-110 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSublink(index);
                  }}
                >
                  {link.icon}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[var(--white-color)] rounded-2xl shadow-xl p-2 w-fit border border-[var(--grey--400)] transition-all duration-200 ease-out ${activeSublink === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                      }`}
                  >
                    <div className="flex flex-col space-y-3">
                      {link.sublinks.map((sublink) => {
                        // Check if the sublink is for videos or podcasts
                        
                        return (
                          <NavLink
                            key={sublink.name}
                            to={sublink.address}
                            className={({ isActive }) =>
                              `flex items-center gap-3 p-2 rounded-xl whitespace-nowrap transform transition-all duration-150 hover:scale-105 active:scale-95 ${isActive
                                ? "bg-[var(--blue--100)] text-[var(--ternery)] shadow-sm"
                                : "hover:bg-[var(--grey--200)] text-[var(--grey--800)]"
                              }`
                            }
                            onClick={() => setActiveSublink(null)}
                          >
                            <div className="text-xl">{sublink.icon}</div>
                            <span className="text-sm">{sublink.name}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--white-color)] transform rotate-45 border-r border-b border-[var(--grey--400)] z-[-1]"></div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={link.address}
                  className={({ isActive }) =>
                    `p-2 text-2xl transform transition-all duration-150 hover:scale-110 active:scale-95 ${isActive
                      ? "text-[var(--ternery)]"
                      : "text-[var(--grey--800)] hover:text-[var(--ternery)]"
                    }`
                  }
                >
                  {link.icon}
                </NavLink>
              )}
            </div>
          ))}

          <div className="relative">
            <div
              className="p-2 text-2xl text-[var(--grey--800)] hover:text-[var(--ternery)] transform transition-all duration-150 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                toggleSublink("settings");
              }}
            >
              <BsThreeDotsVertical />
            </div>
            <div
              className={`absolute bottom-full right-2 mb-2 bg-[var(--white-color)] rounded-2xl shadow-xl p-2 w-fit border border-[var(--grey--400)] transition-all duration-200 ease-out ${activeSublink === "settings"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
                }`}
            >
              <div className="flex flex-col space-y-3">
                {settingsLinks.map((link) =>
                  link.onClick ? (
                    <div
                      key={link.name}
                      className="flex items-center gap-3 p-2 hover:bg-[var(--grey--200)] rounded-xl cursor-pointer whitespace-nowrap transform transition-all duration-150 hover:scale-105 active:scale-95"
                      onClick={() => {
                        link.onClick();
                        setActiveSublink(null);
                      }}
                    >
                      <div className="text-xl text-[var(--grey--800)]">
                        {link.icon}
                      </div>
                      <span className="text-sm text-[var(--grey--800)]">
                        {link.name}
                      </span>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.address}
                      className="flex items-center gap-3 p-2 hover:bg-[var(--grey--200)] rounded-xl whitespace-nowrap transform transition-all duration-150 hover:scale-105 active:scale-95"
                      onClick={() => setActiveSublink(null)}
                    >
                      <div className="text-xl text-[var(--grey--800)]">
                        {link.icon}
                      </div>
                      <span className="text-sm text-[var(--grey--800)]">
                        {link.name}
                      </span>
                    </Link>
                  )
                )}
              </div>
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[var(--white-color)] transform rotate-45 border-r border-b border-[var(--grey--400)] z-[-1]"></div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

const UserSection = ({ user, miniMenu, toggleMiniMenu, handleLogout }) => {
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (miniMenu) toggleMiniMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [miniMenu, toggleMiniMenu]);

  return (
    <div ref={menuRef}>
      <div className="hidden lg:flex items-center justify-center gap-2">
        <Link to={`about/user/${user._id}`}>
          <div className="group relative">
            <img
              className="w-9 h-9 object-cover rounded-full border-[3px] border-[var(--grey--600)] hover:border-[var(--ternery)]"
              src={
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/147/147142.png"
              }
              alt="User"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[var(--grey--900)] text-[var(--white-color)] px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              View Profile
            </div>
          </div>
        </Link>
        {miniMenu ? (
          <RxCross2
            className="block cursor-pointer size-8 hover:text-[var(--ternery)] hover:bg-[var(--grey--200)] rounded-full p-1 transition-transform duration-300"
            onClick={toggleMiniMenu}
          />
        ) : (
          <BsThreeDotsVertical
            className="block cursor-pointer size-8 hover:text-[var(--ternery)] hover:bg-[var(--grey--200)] rounded-full p-1 transition-transform duration-300"
            onClick={toggleMiniMenu}
          />
        )}
      </div>
      <UserMenu user={user} miniMenu={miniMenu} handleLogout={handleLogout} />
    </div>
  );
};

const AuthButtons = () => (
  <div className="flex gap-2">
    <Link to="/auth/sign-up">
      <button className="hidden lg:flex bg-[var(--white-color)] items-center gap-1 rounded-[5px] shadow-[0_2px_0_0_rgba(0,0,0,0.04),_inset_0_0_0_2px_var(--grey--400)] transition-all ease-in-out duration-600 text-[var(--grey--900)] px-3 py-2 text-xs leading-[1.32] hover:bg-[var(--grey--200)]">
        <span>Sign Up</span>
        <FaArrowRightLong />
      </button>
    </Link>
    <Link to="/auth/sign-in">
      <button className="hidden lg:flex bg-[var(--black-color)] items-center gap-1 rounded-[5px] transition-all ease-in-out duration-600 text-[var(--white-color)] px-3 py-2 text-xs leading-[1.32] hover:bg-[var(--brand--black-pearl)]">
        <span>Login</span>
        <FaArrowRightLong />
      </button>
    </Link>
  </div>
);

export default NavMenu;
