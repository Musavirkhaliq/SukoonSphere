import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { BsFillTriangleFill } from 'react-icons/bs';

function DesktopNav({ links }) {
  return (
    <div className="hidden lg:flex justify-center flex-grow">
      <ul className="flex mt-[.8rem] h-10 gap-5 items-center">
        {links.map((link, index) => (
          <NavItem key={link.name} link={link} index={index} />
        ))}
      </ul>
    </div>
  );
}

const NavItem = ({ link, index }) => (
  <div className="group relative h-full align-middle">
    <NavLink to={link.address} className="flex group items-center justify-center ">
      <span className="ml-2">{link.name}</span>
      {index !== 0 && (
        <MdOutlineKeyboardArrowUp className="size-[1.4rem] ml-1 group-hover:rotate-180 transition-all duration-300 ease-in-out transform hover:scale-110 text-[var(--primary)] group-hover:text-[var(--ternery)] drop-shadow-sm hover:drop-shadow-md" />
      )}
    </NavLink>
    {link.sublinks && <SubLinks sublinks={link.sublinks} />}
  </div>
);

const SubLinks = ({ sublinks }) => (
  <ul className="top-14 absolute opacity-0 max-h-0 invisible group-hover:opacity-100 group-hover:max-h-[500px] group-hover:visible transition-[opacity, max-height, transform] duration-300 ease-in-out transform group-hover:translate-y-1 shadow-[0px_1px_10px_rgba(0,0,0,0.1)] bg-white p-2 rounded-[5px] w-72">
    <BsFillTriangleFill className="text-lg absolute -top-3 left-5 text-white" />
    {sublinks.map((sublink) => {
      // Check if the sublink is for videos or podcasts
      return <SubLink key={sublink.name} sublink={sublink} />;
    })}
  </ul>
);

const SubLink = ({ sublink }) => (
  <li className="transition-opacity duration-300 ease-in-out border-b-[2px] border-gray-500] last-of-type:border-none">
    <NavLink
      to={sublink.address}
      className="flex items-center gap-2 px-2 py-2 text-[var(--primary)] hover:text-[var(--ternery)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <div className="border bg-[var(--primary)] text-white text-base border-[var(--primary)] rounded-full p-2 font-bold">
        {sublink.icon}
      </div>
      <div className="flex flex-col ml-2 text-[16px] text-gray-600">
        <span className="hover:text-[var(--ternery)]">{sublink.name}</span>
        <span className="text-[12px] text-gray-400">{sublink.description}</span>
      </div>
    </NavLink>
  </li>
);

export default DesktopNav; 