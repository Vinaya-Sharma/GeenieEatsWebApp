import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const EditProfilePopup = ({
  setShowEditPopup,
  restaurant,
  RestCopy,
  setRestCopy,
}) => {
  const addDish = async (e) => {
    e.preventDefault();
    try {
      const resp = axios.put(`/updateProfile`, {
        restData: RestCopy,
      });
      setShowEditPopup(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="z-50 bg-green-200 flex flex-col absolute min-w-250 w-4/6 rounded-lg p-5 lg:w-5/12 left-0 ml-auto mr-auto right-0 min-h-100">
        <FontAwesomeIcon
          onClick={() => setShowEditPopup(false)}
          className="w-6 h-6 text-black"
          icon={faXmark}
        />
        <p className="text-2xl font-bold w-full text-center my-10 text-black tracking-widest">
          Edit Profile
        </p>
        <form onSubmit={(e) => addDish(e)} className="flex flex-row flex-wrap">
          <div className="flex px-5 w-full  md:w-3/6 min-w-150 flex-col">
            <label className="text-sm" htmlFor="description">
              Email
            </label>
            <input
              className="my-3 px-3 py-2 rounded-lg outline-white"
              type="text"
              name="description"
              value={RestCopy.email}
              onChange={(e) =>
                setRestCopy({ ...RestCopy, email: e.target.value })
              }
            />
          </div>
          <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
            <label className="text-sm" htmlFor="cost">
              Website
            </label>
            <input
              className="my-3 px-3 py-2 rounded-lg outline-white"
              type="text"
              name="cost"
              value={RestCopy.website}
              onChange={(e) =>
                setRestCopy({ ...RestCopy, website: e.target.value })
              }
            />
          </div>
          <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
            <label className="text-sm" htmlFor="Ingredients">
              Location
            </label>
            <input
              className="my-3 px-3 py-2 rounded-lg outline-white"
              type="text"
              name="Ingredients"
              value={RestCopy.location}
              onChange={(e) =>
                setRestCopy({ ...RestCopy, location: e.target.value })
              }
            />
          </div>
          <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
            <label className="text-sm" htmlFor="PrepTime">
              Restaurant Image
            </label>
            <input
              className="my-3 px-3 py-2 rounded-lg outline-white"
              type="text"
              name="PrepTime"
              value={RestCopy.img}
              onChange={(e) =>
                setRestCopy({ ...RestCopy, img: e.target.value })
              }
            />
          </div>
          <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
            <label className="text-sm" htmlFor="img">
              Logo
            </label>
            <input
              className="my-3 px-3 py-2 rounded-lg outline-white"
              type="text"
              name="img"
              value={RestCopy.logo}
              onChange={(e) =>
                setRestCopy({ ...RestCopy, logo: e.target.value })
              }
            />
          </div>
          <img
            className="w-full h-44 object-contain"
            src={
              RestCopy.img
                ? RestCopy.img
                : "https://aadhyafoodindian.com/img/placeholders/grey_fork_and_knife.png"
            }
          />
          <div className="w-full flex flex-col place-content-center h-full">
            <input
              type="submit"
              className="place-self-center my-3 min-w-250 bg-teal text-white p-2 rounded-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
