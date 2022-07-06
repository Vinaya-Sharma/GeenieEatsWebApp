import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Img from "../assets/logo.png";
import { useStateContext } from "../context/stateContext";
import toast from "react-hot-toast";
import EditProfilePopup from "./restaurants/EditProfilePopup";

const RestProf = ({ restaurant, user }) => {
  const Params = useParams();
  const { getCartItems, isRest, restObj } = useStateContext();
  const [thisRestaurant, setThisRestaurant] = useState({});
  const [ownProfile, setOwnProfile] = useState(false);
  const [RestCopy, setRestCopy] = useState({});
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [meals, setMeals] = useState({});

  const name = Params.name;

  const addMeal = async (item) => {
    if (restaurant) {
      toast.error(
        "sorry restaurants can not place orders, please create a user account to continue shopping"
      );
    } else {
      try {
        await axios.post("/addToCart", {
          name: user.name,
          email: user.email,
          itemName: item.name,
          itemImg: item.img,
          itemId: item._id,
          prepTime: item.prepTime,
          restEmail: thisRestaurant.email,
          restName: thisRestaurant.name,
          restLocation: thisRestaurant.location,
          itemCost: item.cost,
        });
        toast.success(`${item.name} added to cart`);
        getCartItems();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const findMeals = async () => {
    try {
      const resp = await axios.post("/findMeals", {
        name,
      });
      resp && setMeals(resp.data.dishes);
    } catch (err) {
      console.log(err);
    }
  };

  const findRestaurant = async () => {
    try {
      const resp = await axios.post("/findRestaurant", {
        name,
      });
      resp && setThisRestaurant(resp.data);
      resp && setRestCopy(resp.data);
      if (isRest && restObj.slug == resp.data.slug) {
        setOwnProfile(true);
      } else {
        setOwnProfile(false);
      }
    } catch (err) {
      console.log("user not found");
    }
  };

  useEffect(() => {
    setOwnProfile(false);
    findRestaurant();
    findMeals();
  }, [name, showEditPopup, meals]);

  return (
    <div>
      {showEditPopup && (
        <EditProfilePopup
          restaurant={thisRestaurant}
          setShowEditPopup={setShowEditPopup}
          RestCopy={RestCopy}
          setRestCopy={setRestCopy}
        />
      )}
      <div className="flex relative h-full min-h-screen bg-base place-self-center flex-col w-12/12">
        <div className="shadow-lg  w-6 h-6 absolute top-2 left-2 items-center justify-center flex bg-white rounded-full">
          <Link to={`${isRest ? "/restaurants/home" : "/home"}`}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-lg text-black"
            />
          </Link>
        </div>
        <div className="w-full h-full">
          <img className="w-full h-48 object-cover" src={thisRestaurant.img} />
        </div>
        <img
          className="w-24 h-24 object-cover place-self-center mt-[-40px] border-2 border-black bg-white rounded-full"
          src={thisRestaurant?.logo ? thisRestaurant.logo : Img}
        />

        <div className="flex place-content-center place-self-center flex-col w-11/12 min-w-250">
          <p className="w-full text-center text-white m-3 place-self-center text-lg bold">
            {thisRestaurant.name}{" "}
          </p>
          <p className="w-full text-center text-sm text-stone-300">
            {thisRestaurant.location}
          </p>
          {ownProfile && (
            <p
              onClick={() => setShowEditPopup(true)}
              className="w-full underline text-center text-sm text-stone-300"
            >
              ➡️ Edit Profile
            </p>
          )}
        </div>

        <div className=" mt-10 place-content-center justify-center place-self-center">
          <div className="w-5/12 min-w-320 overflow-y-scroll justify-center place-content-center h-96 place-self-center">
            {meals?.length > 0 &&
              meals
                ?.filter((meal) => meal.available === true)
                .map((item, id) => (
                  <div
                    key={id}
                    className="w-full place-self-center flex flex-col"
                  >
                    <div className="flex flex-row relative">
                      <img
                        src={item.img}
                        alt="food item"
                        className="w-10 object-cover h-10 rounded-full"
                      />
                      <p className="w-5/12 text-white mx-3 place-self-center text-xs">
                        {item.name}
                      </p>

                      <p className="w-2/12 place-self-center text-right text-white text-s">
                        ${item.cost}
                      </p>
                      <FontAwesomeIcon
                        onClick={() => addMeal(item)}
                        className="w-2/12 text-lg place-self-center absolute right-0 text-teal"
                        icon={faCartShopping}
                      />
                    </div>

                    <div className="flex relative row w-full">
                      <p className="my-3 place-self-center text-white text-xs">
                        Info: {item.description}
                      </p>
                    </div>
                    <hr className="w-full my-3" />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestProf;
