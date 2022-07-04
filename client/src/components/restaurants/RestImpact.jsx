import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleDollarToSlot,
  faPerson,
  faPlateWheat,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useStateContext } from "../../context/stateContext";
import { useParams } from "react-router-dom";
import { PieChart } from "../charts/PieChart";
import { Link } from "react-router-dom";
import { LineChart } from "../charts/LineChart";
import construction from "../../assets/construction.png";

const RestImpact = () => {
  const params = useParams();
  const { isUser, theOrders } = useStateContext();
  const [usersDishes, setusersDishes] = useState(null);
  const [numberDishes, setnumberDishes] = useState(null);
  const [impactReportUser, setimpactReportUser] = useState({});
  const usersImpactSlug = params.slug;
  let mostPopMeal = 0;
  let popImg = "";
  let mostPopMealImg = [];
  let MealLabels;
  let MealData;
  let mealsThisWeek = 0;
  let userName = [];
  let userData = [];

  const getImpactReportUser = async () => {
    try {
      const resp = await axios.post(`/impactReportRest`, {
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
      const resp = await axios.post(`/getOrders/${data.email}`);
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
      if (labels.includes(usersDishes[i].itemName)) {
        data[labels.indexOf(usersDishes[i].itemName)] =
          data[labels.indexOf(usersDishes[i].itemName)] +
          usersDishes[i].quantity;
      } else {
        labels.push(String(usersDishes[i].itemName));
        data.push(usersDishes[i].quantity);
      }
    }

    for (let i = 0; i < usersDishes.length; i++) {
      if (userName.includes(usersDishes[i].name)) {
        userData[userName.indexOf(usersDishes[i].name)] =
          userData[userName.indexOf(usersDishes[i].name)] +
          usersDishes[i].quantity;
      } else {
        userName.push(String(usersDishes[i].name));
        userData.push(usersDishes[i].quantity);
      }
    }
    mostPopStore();
    getMostPopMeal();
    return <PieChart labels={labels} data={data} />;
  };

  const numDishes = async (data) => {
    try {
      const resp = await axios.post("/restNumDishes", {
        email: data.email,
      });
      setnumberDishes(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getImpactReportUser();
  }, []);

  const revenue = () => {
    let theRev = 0;
    usersDishes?.forEach((dish) => {
      theRev += dish.quantity * dish.itemCost;
    });
    return theRev;
  };

  const newRest = () => {
    let restaurants = [];
    console.log("dishes", usersDishes);
    usersDishes?.forEach((dish) => {
      restaurants.push(dish.email);
    });

    let uRestaurants = [...new Set(restaurants)];
    return uRestaurants.length;
  };
  if (!usersImpactSlug)
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
      mealsThisWeek = mealsThisWeek + MealData[i];
    }

    const num = MealData.indexOf(mostPopMeal);
    mostPopMeal = MealLabels[MealData.indexOf(mostPopMeal)];
    popImg = mostPopMealImg[num];
  };

  let mostPopUser;
  const mostPopStore = () => {
    mostPopUser = 0;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i] > mostPopUser) {
        mostPopUser = userData[i];
      }
    }
    mostPopUser = userName[userData.indexOf(mostPopUser)];
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
          <p className="text-2xl mt-5 font-bold text-white">
            About {numberDishes}
          </p>
          <p className="text-md mt-2 text-stone-300 ">
            Total Meals Saved With GeenieEats
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
            ${revenue()} Worth{" "}
          </p>
          <p className="text-md mt-2 text-stone-300 ">
            Of Food Saved This Week
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
            {impactReportUser && impactReportUser?.dishes?.length} dishes
          </p>
          <p className="text-md mt-2 text-stone-300 ">
            Currently available on GeenieEats
          </p>
        </div>
      </div>
      <hr className="my-5" />
      {usersDishes?.length > 0 ? (
        <div>
          <div className="w-11/12screen flex-col sm:flex-row md:w-full flex gap-10">
            {
              //most commonly ordered dish, most commonly ordered store,
              usersDishes && (
                <div className="w-[99%] lg:w-3/6 mb-32 sm:w-3/6 h-80 flex object-contain">
                  <div className="flex w-full h-full flex-col">
                    <p className="my-5 font-bold">
                      {impactReportUser.name}'s Weekly Meal Popularity Breakdown
                    </p>
                    {usersDishes && getPieChartData()}
                  </div>
                </div>
              )
            }
            {
              <div className="w-full lg:w-4/6  h-full sm:w-3/6 gap-2 flex flex-col mb-5">
                <p className="mt-5 border-white border-b-2 w-auto pb-2 font-bold">
                  Restaurant Info & Weekly Finds
                </p>
                <div className="w-full flex flex-row flex-wrap gap-3 ">
                  <div>🚗 You can find</div>
                  <div className="font-bold block lg:inline">
                    {usersDishes && usersDishes[0]?.restName} at
                  </div>
                  <div className="font-bold block lg:inline ">
                    {usersDishes && usersDishes[0]?.restLocation}{" "}
                  </div>
                </div>
                <div className="w-full flex gap-3">
                  🥘 Food Saved This Week:
                  <span className="font-bold">{mealsThisWeek * 1.5}lbs</span>
                </div>
                <div className="w-full flex gap-3">
                  🛍️ Favourite Customer:
                  <span className="font-bold">{mostPopUser}</span>
                </div>
                <div className="w-full flex gap-3">
                  🌮 Favourite Meal:
                  <span className="font-bold">{mostPopMeal}</span>
                </div>
                <div className="w-44 place-self-center h-44 relative mt-12 flex">
                  <FontAwesomeIcon
                    className="w-20 h-20 -rotate-45 text-yellow-200 absolute -top-10 -left-5"
                    icon={faCrown}
                  />
                  <img
                    className="w-full h-full object-cover flex rounded-full"
                    src={popImg}
                  />
                </div>
              </div>
            }
          </div>
          {usersDishes && (
            <div className="w-11/12screen md:w-full mb-5 mt-12 md:mt-20 ">
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
      ) : (
        <div>
          <p>currently unavailable...</p>
          <div className="w-full h-80 flex">
            <img className="w-full h-full object-contain " src={construction} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestImpact;
