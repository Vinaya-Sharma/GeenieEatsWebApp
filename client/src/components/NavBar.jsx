import React from "react";

const NavBar = ({ showSideBar, setShowSidebar }) => {
  const sideBarHandler = () => {
    setShowSidebar(!showSideBar);
  };

  return (
    <div className="transition-all ease-in duration-1000 w-screen relative h-16 px-12 py-4 bg-teal">
      <div
        onClick={() => sideBarHandler()}
        className="flex flex-col w-11 h-8 rounded-sm place-content-center justify-center border-2 border-base"
      >
        <hr className="w-8 m-1 place-self-center bg-base h-2" />
        <hr className="w-8 place-self-center bg-base h-2" />
        <hr className="w-8 m-1 place-self-center bg-base h-2" />
      </div>
    </div>
  );
};

export default NavBar;
