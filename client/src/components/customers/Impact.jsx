import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleDollarToSlot,
  faPerson,
  faPlateWheat,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useStateContext } from "../../context/stateContext";
import { useParams } from "react-router";
import { PieChart } from "../charts/PieChart";
import { Link } from "react-router-dom";
import { LineChart } from "../charts/LineChart";

const Orders = () => {
  const params = useParams();
  const { isUser, theOrders, getOrders } = useStateContext();
  const [usersDishes, setusersDishes] = useState(null);
  const [numberDishes, setnumberDishes] = useState(null);
  const [impactReportUser, setimpactReportUser] = useState({});
  const usersImpactSlug = params.slug;

  const getImpactReportUser = async () => {
    try {
      const resp = await axios.post(`http://localhost:5000/impactReportUser`, {
        slug: usersImpactSlug,
      });
      setimpactReportUser(resp.data);
      impactReportUser && getCurrentUsersDishes(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentUsersDishes = async (data) => {
    try {
      const resp = await axios.post(
        `http://localhost:5000/history/${data.email}`
      );
      setusersDishes(resp.data);
      numDishes(data);
      revenue();
      newRest();
    } catch (err) {
      console.log(err);
    }
  };

  //week of new data today - 7 days
  let prevMonday = new Date();
  prevMonday.setDate(
    prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7) - 1
  );
  const getLineGraphData = () => {
    const poundsSaved = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < usersDishes.length; i++) {
      const psbm = usersDishes[i].quantity * 1.5;
      poundsSaved[("theDate", new Date(usersDishes[i].placedAt).getDay())] =
        poundsSaved[("theDate", new Date(usersDishes[i].placedAt).getDay())] +
        psbm;
    }
    console.log(poundsSaved);
    return <LineChart poundsSaved={poundsSaved} />;
  };

  let data;
  let labels;
  const getPieChartData = () => {
    labels = [];
    data = [];

    usersDishes && console.log("users dishes", usersDishes);
    for (let i = 0; i < usersDishes.length; i++) {
      if (labels.includes(usersDishes[i].restName)) {
        data[labels.indexOf(usersDishes[i].restName)] =
          data[labels.indexOf(usersDishes[i].restName)] + 1;
      } else {
        labels.push(String(usersDishes[i].restName));
        data.push(1);
      }
    }
    mostPopStore();
    getMostPopMeal();
    return <PieChart labels={labels} data={data} />;
  };

  const numDishes = async (data) => {
    try {
      const resp = await axios.post("http://localhost:5000/numDishes", {
        email: data.email,
      });
      setnumberDishes(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getImpactReportUser();
    getOrders();
  }, [usersImpactSlug]);

  const revenue = () => {
    let theRev = 0;
    usersDishes?.forEach((dish) => {
      theRev += dish.quantity * dish.itemCost;
    });
    return theRev;
  };

  const newRest = () => {
    let restaurants = [];

    usersDishes?.forEach((dish) => {
      restaurants.push(dish.restName);
    });

    let uRestaurants = [...new Set(restaurants)];
    return uRestaurants.length;
  };
  if (!impactReportUser)
    return (
      <div className="bg-base w-full min-h-screen h-full py-16 px-10  flex">
        <div className="justify-center h-24 items-center flex gap-2 text-white">
          {" "}
          <span>
            <Link to={"/home"}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-md bg-white rounded-full p-2 text-black"
              />
            </Link>
          </span>{" "}
          Sorry No User Found
        </div>
      </div>
    );

  let mostPopMeal = 0;
  let popImg = "";
  let mostPopMealImg = [];
  let MealLabels;
  let MealData;
  const getMostPopMeal = () => {
    MealLabels = [];
    MealData = [];
    mostPopMeal = 0;

    for (let i = 0; i < usersDishes.length; i++) {
      if (MealLabels.includes(usersDishes[i].itemName)) {
        MealData[MealLabels.indexOf(usersDishes[i].itemName)] =
          MealData[MealLabels.indexOf(usersDishes[i].itemName)] +
          usersDishes[i].quantity;
      } else {
        MealLabels.push(String(usersDishes[i].itemName));
        MealData.push(usersDishes[i].quantity);
        mostPopMealImg.push(usersDishes[i].itemImg);
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (MealData[i] > mostPopMeal) {
        mostPopMeal = MealData[i];
      }
    }
    const num = MealData.indexOf(mostPopMeal);
    mostPopMeal = MealLabels[MealData.indexOf(mostPopMeal)];
    popImg = mostPopMealImg[num];
  };

  let mostPop;
  const mostPopStore = () => {
    mostPop = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i] > mostPop) {
        mostPop = data[i];
      }
    }
    mostPop = labels[data.indexOf(mostPop)];
  };

  return (
    <div className="p-10 sm:p-20 bg-base h-full min-h-screen w-full text-white">
      <p className="text-2xl font-bold text-white tracking-widest">
        <span className="underline italic">{impactReportUser.name}'s</span>{" "}
        Impact Report!
      </p>

      <div className=" w-11/12screen md:w-full space-between mt-10 flex-col lg:flex-row flex-wrap  lg:flex">
        <div className="lg:w-3/12 w-full mb-5 mr-10 p-3 min-h-100 bg-dblue rounded-lg h-full">
          <div className=" p-3 bg-base rounded-lg w-12 h-12">
            <FontAwesomeIcon
              className="w-full h-full"
              color="lightGreen"
              icon={faPlateWheat}
            />
          </div>
          <p className="text-2xl mt-5 font-bold text-white ">
            About {numberDishes}
          </p>
          <p className="text-md mt-2 text-stone-300 ">
            Total Dishes Ordered With GeenieEats
          </p>
        </div>
        <div className="lg:w-3/12 mb-5 w-full mr-10 p-3 min-h-100 bg-dblue rounded-lg h-full">
          <div className=" p-3 bg-base rounded-lg w-12 h-12">
            <FontAwesomeIcon
              className="w-full h-full"
              color="pink"
              icon={faCircleDollarToSlot}
            />
          </div>
          <p className="text-2xl mt-5 font-bold text-white ">
            ${revenue()} Of{" "}
          </p>
          <p className="text-md mt-2 text-stone-300 ">
            Relief Provided This Week
          </p>
        </div>
        <div className="lg:w-3/12 mb-5 w-full p-3 min-h-100 bg-dblue rounded-lg h-full">
          <div className=" p-3 bg-base rounded-lg w-12 h-12">
            <FontAwesomeIcon
              className="w-full h-full"
              color="lightBlue"
              icon={faPerson}
            />
          </div>
          <p className="text-2xl mt-5 font-bold text-white ">
            {newRest()} Different{" "}
          </p>
          <p className="text-md mt-2 text-stone-300 ">
            Restaurants Purchased From Recently
          </p>
        </div>
      </div>
      <hr className="my-5" />
      <div className="w-11/12screen md:w-full flex gap-10">
        {
          //most commonly ordered dish, most commonly ordered store,
          usersDishes && (
            <div className="w-[99%] mb-32 lg:w-3/6 h-80 flex object-contain">
              <div className="flex w-full h-full flex-col">
                <p className="my-5 font-bold">Weekly Purchase Breakdown</p>
                {usersDishes && getPieChartData()}
              </div>
            </div>
          )
        }
        {
          <div className="w-full h-full flex flex-col my-5">
            <div className="w-full flex gap-3">
              Most Popular Store:
              <span className="font-bold">{mostPop}</span>
            </div>
            <div className="w-full flex gap-3">
              Favourite Meal:
              <span className="font-bold">{mostPopMeal}</span>
            </div>
            <img className="w-44 h-44" src={popImg} />
          </div>
        }
      </div>
      {usersDishes && (
        <div className="w-11/12screen md:w-full my-16 sm:my-20">
          <p>
            Pounds Of Food Saved -{" "}
            <span className="font-bold">
              Week Of {String(prevMonday.toDateString())}{" "}
            </span>
          </p>
          {getLineGraphData()}
        </div>
      )}
    </div>
  );
};

export default Orders;
