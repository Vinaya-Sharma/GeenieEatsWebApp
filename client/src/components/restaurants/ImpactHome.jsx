import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import Cart from "../../components/customers/Cart";
import NavBar from "../../components/NavBar";
import { useStateContext } from "../../context/stateContext";
import axios from "axios";
import RestImpact from "./RestImpact";

const ImpactHome = () => {
  const [showSideBar, setShowSidebar] = useState(true);
  const { isRest, isUser, userObj } = useStateContext();

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

      <div className="lg:w-11/12 md:w-10/12 w-12/12">
        <div className="flex bg-dblue md:hidden">
          <NavBar showSideBar={showSideBar} setShowSidebar={setShowSidebar} />
        </div>
        <div className="rounded-t-lg w-full">
          <RestImpact />
        </div>
      </div>
    </div>
  );
};

export default ImpactHome;
