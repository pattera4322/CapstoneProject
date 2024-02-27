import React from "react";
import { NavLink } from "react-router-dom";
import NavLinkItem from "./NavLinkItem";
import { useAuthenticate } from "../api/userApi";
import Dropdown  from "./DropdownNavbar";

const NavBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { logOut, loading, error } = useAuthenticate();

  const handleSignout = () => {
    logOut();
  };

  return (
    <nav className="fixed top-0 z-40 w-full bg-white border-gray-200 drop-shadow-lg">
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-8 py-1">
        <NavLink to="/" className="flex items-center" aria-current="page">
          <img
            src={process.env.PUBLIC_URL + "/assets/SmartStockLogo.svg"}
            className="h-12 mr-2 sm:mr-4"
            alt="Smart Stock"
          />
          {/* <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
            Smart Stock
          </span> */}
        </NavLink>
        <div className="md:hidden"></div>
        <div className="hidden md:flex md:w-auto">
          {user ? (
            <ul className="cursor-pointer font-medium flex flex-col p-4 md:p-0 mt-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white">  
                <Dropdown isDivider={true} handleSignout={handleSignout} userName={user.userName}/>
            </ul>
          ) : (
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white">
              <li>
                <NavLinkItem to={"/Login"} children={"Login"} />
              </li>
              <li>
                <NavLinkItem to={"/Register"} children={"Register"} />
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
