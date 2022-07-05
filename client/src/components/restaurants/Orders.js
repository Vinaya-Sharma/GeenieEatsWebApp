import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDollarToSlot,
  faPerson,
  faPlateWheat,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useStateContext } from "../../context/stateContext";

const Orders = () => {
  const [theOrders, settheOrders] = useState([]);
  const { restObj } = useStateContext();

  const numDishes = () => {
    return theOrders?.length;
  };

  const revenue = () => {
    let theRev = 0;
    theOrders?.forEach((dish) => {
      theRev += dish.quantity * dish.itemCost;
    });
    return theRev;
  };

  const newCust = () => {
    let customers = [];

    theOrders?.forEach((dish) => {
      customers.push(dish.email);
    });

    let uCustomers = [...new Set(customers)];
    return uCustomers.length;
  };

  const levelUp = async (order) => {
    let level;

    if (order.completed === "pending") {
      level = "created";
    } else if (order.completed === "created") {
      level = "completed";
    }

    if (order.completed !== "completed") {
      try {
        await axios.put("/levelUp", {
          id: order._id,
          completed: level,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getOrders = async () => {
    try {
      const resp = await axios.post(`/getOrders/${restObj.email}`);
      const sorted = resp.data.sort((a, b) => {
        if (a.completed > b.completed) return -1;
        if (a.completed < b.completed) return 1;
        return 0;
      });
      settheOrders(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, [theOrders]);

  return (
    <div className="p-20 bg-base h-full min-h-screen w-full text-white">
      <p className="text-2xl font-bold text-white tracking-widest">Orders</p>

      <div className="w-full space-between  mt-10 flex-row flex-wrap hidden lg:flex">
        <div className="w-3/12 mr-10 p-3 min-h-100 bg-dblue rounded-lg h-full">
          <div className=" p-3 bg-base rounded-lg w-12 h-12">
            <FontAwesomeIcon
              className="w-full h-full"
              color="lightGreen"
              icon={faPlateWheat}
            />
          </div>
          <p className="text-2xl mt-5 font-bold text-white ">{numDishes()}</p>
          <p className="text-md mt-2 text-stone-300 ">Dishes Ordered</p>
        </div>
        <div className="w-3/12 mr-10 p-3 min-h-100 bg-dblue rounded-lg h-full">
          <div className=" p-3 bg-base rounded-lg w-12 h-12">
            <FontAwesomeIcon
              className="w-full h-full"
              color="pink"
              icon={faCircleDollarToSlot}
            />
          </div>
          <p className="text-2xl mt-5 font-bold text-white ">${revenue()}</p>
          <p className="text-md mt-2 text-stone-300 ">Total Revenue</p>
        </div>
        <div className="w-3/12 p-3 min-h-100 bg-dblue rounded-lg h-full">
          <div className=" p-3 bg-base rounded-lg w-12 h-12">
            <FontAwesomeIcon
              className="w-full h-full"
              color="lightBlue"
              icon={faPerson}
            />
          </div>
          <p className="text-2xl mt-5 font-bold text-white ">{newCust()}</p>
          <p className="text-md mt-2 text-stone-300 ">New Customers</p>
        </div>
      </div>
      <div className="w-11/12screen md:w-10/12 ">
        <div className="w-full p-12 mt-10 overflow-auto  bg-dblue">
          <div className="flex flex-row mb-5">
            <p className="min-w-250 w-250 text-lg mt-2 mr-5 text-white italic font-bold">
              Customer
            </p>
            <p className="min-w-250 w-250 text-lg mt-2 text-white italic font-bold">
              Item & quantity
            </p>
            <p className="w-100 min-w-100 text-lg mt-2 text-white italic font-bold">
              Cost
            </p>
            <p className="min-w-200 w-200 text-lg mt-2 text-white italic font-bold">
              Status
            </p>
            <p className="min-w-200 w-200 ml-10 text-lg mt-2 text-white italic font-bold">
              Date
            </p>
          </div>
          <hr className="w-screen md:w-6/10screen bg-white" />
          <div className="mt-5 max-h-80">
            {theOrders?.map((order) => (
              <div
                key={order._id}
                className="w-full h-24 center  mt-2 flex flex-row"
              >
                <div
                  className={`${
                    order.paid && "border-2 border-emerald-700"
                  } w-250 p-2 mr-5 min-w-250  align-center flex flex-col`}
                >
                  <p className="text-md text-white">{order.name}</p>
                  <p className="text-sm text-stone-300">{order.email}</p>
                  {order.paid && (
                    <div className="w-full items-center mt-1 gap-2 flex">
                      <div className="w-2 h-2 rounded-full bg-emerald-700" />
                      <p className="text-sm text-emerald-700">Paid Online</p>
                    </div>
                  )}
                </div>

                <div className="w-250 min-w-250  mt-2 align-center flex flex-row">
                  <img
                    className="w-8 h-8 rounded-full mr-3 object-cover"
                    src={order.itemImg}
                  />
                  <p className="text-sm text-stone-300">
                    <span className="underline mr-2 font-bold">
                      {order.quantity}{" "}
                    </span>{" "}
                    of {order.itemName}
                  </p>
                </div>

                <p className="w-100 mt-2 min-w-100 text-md text-white">
                  ${order.itemCost * order.quantity}
                </p>

                <div
                  onClick={() => levelUp(order)}
                  className={`${
                    order.completed === "pending" && "bg-red-400"
                  } ${order.completed === "created" && "bg-purple-400"} ${
                    order.completed === "completed" && "bg-teal"
                  }  mt-2 hover:scale-x-105 cursor-pointer w-200 min-w-200 place-content-center flex flex-row h-10 rounded-lg  px-3 py-2`}
                >
                  <p className="text-md place-self-center text-white">
                    {order.completed}
                  </p>
                </div>

                <p className="text-md place-self-center h-10 place-content-center ml-10 w-full min-w-200 text-white">
                  {new Date(order.placedAt).toDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
