import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "./Loader";
import {
  faHouse,
  faPizzaSlice,
  faEarthAmericas,
  faArrowLeft,
  faUtensils,
  faBurger,
  faShoppingCart,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "../context/stateContext";
import { useEffect } from "react";

const SideBar = ({ restaurant }) => {
  const { isRest, isUser, userObj, restObj, userCheck } = useStateContext();
  const [toUse, settoUse] = useState(noUser);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setloading(true);
    setTimeout(() => {
      if (isRest) {
        settoUse(restElements);
      } else if (isUser) {
        settoUse(userElements);
      } else {
        settoUse(noUser);
      }
    }, 5);
    setPage(noUser);
    setloading(false);
  }, [isUser, isRest]);

  const restElements = [
    {
      name: `${isRest ? "restaurants" : "/login"}`,
      disName: "Home",
      icon: faHouse,
    },
    {
      name: `order/${restObj?.name}`,
      disName: "Profile",
      icon: faPizzaSlice,
    },
    {
      name: "manageMeals",
      disName: "Manage Meals",
      icon: faUtensils,
    },
    {
      name: "orders",
      disName: "orders",
      icon: faBurger,
    },
    {
      name: `impactReport/${restObj?.slug}`,
      disName: "Impact",
      icon: faEarthAmericas,
    },
  ];

  const userElements = [
    {
      name: `Home`,
      disName: "Home",
      icon: faHouse,
    },
    {
      name: "History",
      disName: "History",
      icon: faPizzaSlice,
    },
    {
      name: `myImpact/${userObj?.slug}`,
      disName: "My Impact",
      icon: faEarthAmericas,
    },
  ];

  const noUser = [
    {
      name: `login`,
      disName: "Login",
      icon: faArrowAltCircleLeft,
    },
    {
      name: `login`,
      disName: `History`,
      icon: faPizzaSlice,
    },
    {
      name: `myImpact/${userObj?.slug}`,
      disName: "Impact",
      icon: faEarthAmericas,
    },
  ];

  const { logout } = useStateContext();
  const Navigate = useNavigate();
  const [page, setPage] = useState("Home");
  if (loading) return Loader;
  return (
    <div className="min-w-100 md:min-w-0 md:w-full relative h-full min-h-screen flex flex-col place-content-center align-center bg-dblue text-center">
      <div className="w-full max-h-screen h-screen justify-center text-center center place-content-center align-center place-self-center flex flex-col">
        {toUse?.map((item) => {
          return (
            <div
              key={item.name}
              className="flex flex-col"
              onClick={() => setPage(item.name)}
            >
              <div
                className={`w-12 hover:scale-105  h-12 shadow-black shadow-2 rounded-xl place-self-center place-content-center center text-center justify-center flex flex-col bg-teal`}
              >
                <div
                  onClick={() =>
                    Navigate(`${isRest ? "/restaurants/" : "/"}${item.name}`)
                  }
                >
                  <FontAwesomeIcon
                    color={page === item.name ? "teal" : "white"}
                    className="fa-md"
                    icon={item.icon}
                  />
                </div>
              </div>
              <p className="text-white text-sm mb-5">{item.disName}</p>
            </div>
          );
        })}
        {!isRest && (
          <div
            className="lg:hidden flex flex-col"
            onClick={() => setPage("cart")}
          >
            <div
              className={`w-12 hover:scale-105  h-12 shadow-black shadow-2 rounded-xl place-self-center place-content-center center text-center justify-center flex flex-col bg-teal`}
            >
              <NavLink to={"cart"}>
                <FontAwesomeIcon
                  color={page === "cart" ? "teal" : "white"}
                  className="fa-md"
                  icon={faShoppingCart}
                />
              </NavLink>
            </div>
            <p className="text-white text-sm mb-5">Cart</p>
          </div>
        )}
      </div>
      <div
        onClick={() => logout()}
        className="mb-5 place-self-center justify-center flex flex-col h-12 bg-dteal absolute bottom-10 left-0 right-0"
      >
        <FontAwesomeIcon color="white" className="fa-md" icon={faArrowLeft} />
      </div>
    </div>
  );
};

export default SideBar;
