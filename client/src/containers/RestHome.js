import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import HeroRouter from "../Routing/HeroRouter";
import Cart from "../components/customers/Cart";

import NavBar from "../components/NavBar";

import axios from "axios";
import { useStateContext } from "../context/stateContext";

const Home = () => {
  const [showSideBar, setShowSidebar] = useState(false);

  const { getRest, findRest, restaurants, restObj } = useStateContext();

  useEffect(() => {
    getRest();
    findRest();
  }, []);

  if (!restObj) return;
  return (
    <div className="flex min-w-screen w-full h-full overflow-hidden bg-base">
      <div className="hidden bg-dblue md:flex md:w-1/6 lg:w-1/12">
        <SideBar restaurant={restObj} />
      </div>

      {showSideBar && (
        <div className="md:hidden bg-white">
          <SideBar restaurant={restObj} />
        </div>
      )}

      <div className="lg:w-11/12 md:w-10/12 w-12/12">
        <div className="flex md:hidden">
          <NavBar showSideBar={showSideBar} setShowSidebar={setShowSidebar} />
        </div>
        <div className="rounded-t-lg w-12/12">
          <HeroRouter restaurant={restObj} restaurants={restaurants} />
        </div>
      </div>
    </div>
  );
};

export default Home;
