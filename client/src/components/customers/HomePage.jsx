import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/stateContext";
import storeImg from "../../assets/restaurantimg.jpeg";

const HomePage = () => {
  const Navigator = useNavigate();
  const [search, setSearch] = useState("");
  const { userObj, getRest, restObj, restaurants, isUser, getOrders } =
    useStateContext();
  const date = new Date().toDateString();

  useEffect(() => {
    getRest();
    getOrders();
  }, [isUser]);

  return (
    <div className="h-full min-h-screen w-full bg-base p-10 sm:p-20">
      <div className="flex flex-col md:flex-row w-full justify-center">
        <div className={`flex flex-col ${restObj ? "w-full" : "w-3/6"}`}>
          <p className="text-2xl font-bold text-white tracking-widest">
            Hi, {userObj ? userObj.name : restObj?.name}...welcome back
          </p>
          <p className="text-md text-slate-300 ">{date}</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-md max-w-320 mt-5 md:mt-0 h-12 text-bg-dblue placeholder-dblue w-full rounded-full px-5 py-2 outline-none"
          type="text"
          placeholder="🔍    search"
        />
      </div>

      <div className="flex flex-col justify-center align-center w-12/12 h-full">
        <hr className="my-7 place-self-center w-full " />
        <p className="text-xl font-bold text-white mb-7 w-full italic">
          {search !== "" ? "Search Results" : "Popular Stores"}
        </p>

        <div className="flex scrollbar-hide place-self-center px-auto align-self-center flex-row justify-center space-x-4 w-11/12screen md:w-11/12  overflow-scroll">
          {restaurants
            .filter((rest) =>
              rest.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((store) => (
              <div
                key={store.name}
                onClick={() =>
                  restObj
                    ? Navigator(`/restaurants/order/${store.slug}`)
                    : Navigator(`/order/${store.slug}`)
                }
                className="hover:scale-105 flex flex-col min-w-250 h-64 mb-5 rounded-xl bg-dblue"
              >
                <img
                  className="w-full h-40 rounded-xl object-cover"
                  src={store.img ? store.img : storeImg}
                />
                <div className="flex text-center my-5 flex-col align-center place-self-center justify-center">
                  <p className="text-md text-white">{store.name}</p>
                  <p className="text-xs text-slate-300">{store.location}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col justify-center align-center w-12/12 h-full">
        <p className="text-xl font-bold text-white mb-7 w-full italic">
          Newly Added
        </p>

        <div className="flex scrollbar-hide place-self-center px-auto align-self-center flex-row justify-center space-x-4 w-11/12screen md:w-11/12  overflow-scroll">
          {restaurants
            .slice()
            .reverse()
            .map((store) => (
              <div
                key={store.name}
                onClick={() =>
                  restObj
                    ? Navigator(`/restaurants/order/${store.slug}`)
                    : Navigator(`/order/${store.slug}`)
                }
                className="hover:scale-105 flex flex-col min-w-250 h-64 mb-5 rounded-xl bg-dblue"
              >
                <img
                  className="w-full h-40 rounded-xl object-cover"
                  src={store.img ? store.img : storeImg}
                />
                <div className="flex text-center my-5 flex-col align-center place-self-center justify-center">
                  <p className="text-md text-white">{store.name}</p>
                  <p className="text-xs text-slate-300">{store.location}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
