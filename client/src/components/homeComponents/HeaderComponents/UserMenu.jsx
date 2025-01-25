import React from 'react';
import { Link } from 'react-router-dom';
import { BsKey, BsDatabase, BsPencil } from 'react-icons/bs';
import { MdPrivateConnectivity } from 'react-icons/md';
import { CiMedal } from 'react-icons/ci';
import { useUser } from '@/context/UserContext';

function UserMenu({ user, miniMenu, handleLogout }) {
   const { user: loggedInUser } = useUser();
  
  return (
    <div
      className={`${miniMenu ? "opacity-100 max-h-[500px] " : "opacity-0 max-h-0"
        } absolute overflow-hidden transition-all duration-300 
      ease-in-out shadow-lg rounded-[4px] bg-[var(--body)] flex flex-col w-72 top-[4.5rem] right-[7.5rem]`}
      style={{
        transition: "opacity 0.5s ease, max-height 0.5s ease ",
      }}
    >
      <div className="flex items-center flex-col gap-4 pb-3 relative">
        <div className="bg-[var(--primary)] w-full h-[100px] flex items-center justify-center relative rounded-t-lg">
          <h4 className="text-white text-lg font-bold">{user?.name}</h4>
          {/* <button className="absolute right-4 bottom-2 text-white text-sm hover:text-gray-300">
            <BsPencil />
          </button> */}
        </div>

        <div className="flex flex-col justify-center items-center mt-[-40px] z-10">
          <img
            className="w-12 h-12 object-cover rounded-full border-1 border-black shadow-lg"
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/147/147142.png"}
            alt="User"
          />
          <h4 className="text-[var(--gray--900)] mt-2 font-semibold">{user?.name}</h4>
          <p className="text-[var(--grey--800)] text-sm">{user?.email}</p>
          <div className='mt-2'>
            {/* <Link to={`/user/request-contributor`} className='text-blue-500'>Click here</Link><span> to become a contributor</span> */}
          </div>
          <div className="flex gap-1">
            <UserActionButtons loggedInUser={loggedInUser} />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={handleLogout} className="btn-2">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserActionButtons = ({ loggedInUser }) => (
  <>
    <div className="relative group">
      <Link to="/user/change-passowrd">
        <button className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2">
          <BsKey className="text-lg" />
        </button>
      </Link>
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 bg-gray-800 text-white text-sm rounded py-1 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
        Change Password
        <div className="absolute left-1/2 transform -translate-x-1/2 button-4 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>


    {(loggedInUser?.role !== "contributor" || loggedInUser?.role === "admin") && <div className="relative group">
      <Link to="/user/request-contributor">
        <button className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2">
          <CiMedal className="size-5" />
        </button>
      </Link>
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 bg-gray-800 text-white text-sm rounded py-1 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
        Request to contribute
        <div className="absolute left-1/2 transform -translate-x-1/2  button-4 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>}

    {loggedInUser?.role === "admin" && <div className="relative group">
      <Link to="/admin">
        <button className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2">
          <MdPrivateConnectivity className="text-lg" />
        </button>
      </Link>
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 bg-gray-800 text-white text-sm rounded py-1 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
        Admin 
        <div className="absolute left-1/2 transform -translate-x-1/2  button-4 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>}

  </>
);

export default UserMenu; 