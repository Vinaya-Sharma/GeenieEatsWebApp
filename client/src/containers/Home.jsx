import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import HeroRouter from "../Routing/HeroRouter";
import Cart from "../components/customers/Cart";
import NavBar from "../components/NavBar";
import { useStateContext } from "../context/stateContext";
import axios from "axios";
import { useCookies } from "react-cookie";

const Home = () => {
  const [showSideBar, setShowSidebar] = useState(false);
  const { findUser, restaurants, userObj, userCheck, isUser } =
    useStateContext();
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const checkingAgain = () => {
    const email = cookies.email;
    if (email && userObj && email !== isUser) {
      window.location.reload();
    }
  };

  useEffect(() => {
    userCheck();
    checkingAgain();
  }, []);

  if (!userObj) return;

  return (
    <div className="flex min-w-screen bg-dblue w-full h-full overflow-hidden bg-green">
      <div className="hidden md:flex bg-dblue md:w-1/6 lg:w-1/12">
        <SideBar />
      </div>

      {showSideBar && (
        <div className="md:hidden bg-white">
          <SideBar />
        </div>
      )}

      <div className="lg:w-8/12 md:w-10/12 w-12/12">
        <div className="flex bg-dblue md:hidden">
          <NavBar showSideBar={showSideBar} setShowSidebar={setShowSidebar} />
        </div>
        <div className="rounded-t-lg w-full">
          {findUser && <HeroRouter user={userObj} restaurants={restaurants} />}
        </div>
      </div>
      <div className="hidden lg:flex w-3/12 bg-yellow">
        <Cart user={userObj} />
      </div>
    </div>
  );
};

export default Home;
