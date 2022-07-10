import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const AddItemPopup = ({
  addPopup,
  edit,
  setEdit,
  setAddPopup,
  restEmail,
  setName,
  setDescription,
  setIngredients,
  setCost,
  setPreptime,
  setImg,
  name,
  description,
  ingredients,
  cost,
  prepTime,
  img,
}) => {
  const addDish = async (e) => {
    e.preventDefault();

    if (edit) {
      try {
        const resp = axios.put(`/updateMeal`, {
          email: restEmail,
          id: edit,
          name,
          description,
          ingredients,
          cost,
          prepTime,
          img: formData.file,
        });
        setAddPopup(false);
        setName("");
        setDescription("");
        setIngredients("");
        setCost("");
        setPreptime("");
        setImg("");
        setEdit(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const resp = await axios.post(`/addDish/${restEmail}`, {
          name,
          description,
          ingredients,
          cost,
          prepTime,
          img,
        });

        if (resp.status === 201) {
          setAddPopup(false);
          setName("");
          setDescription("");
          setIngredients("");
          setCost("");
          setPreptime("");
          setImg("");
          setEdit(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  let formData;
  const onSelectImageHandler = (files) => {
    const file = files[0];
    formData = {
      file: file,
    };
  };

  return (
    <div>
      {addPopup && (
        <div className="z-50 bg-green-200 flex flex-col absolute min-w-250 w-4/6 rounded-lg p-5 lg:w-5/12 left-0 ml-auto mr-auto right-0 min-h-100">
          <FontAwesomeIcon
            onClick={() => setAddPopup(false)}
            className="w-6 h-6 text-black"
            icon={faXmark}
          />
          <p className="text-2xl font-bold w-full text-center my-10 text-black tracking-widest">
            Dish Information
          </p>
          <form
            onSubmit={(e) => addDish(e)}
            className="flex flex-row flex-wrap"
          >
            <div className="px-5  w-full flex md:w-3/6 min-w-150 flex-col">
              <label className="text-sm" htmlFor="name">
                Dish Name
              </label>
              <input
                className="my-3 px-3 py-2 rounded-lg outline-white"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex px-5 w-full  md:w-3/6 min-w-150 flex-col">
              <label className="text-sm" htmlFor="description">
                Description
              </label>
              <input
                className="my-3 px-3 py-2 rounded-lg outline-white"
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
              <label className="text-sm" htmlFor="cost">
                Price
              </label>
              <input
                className="my-3 px-3 py-2 rounded-lg outline-white"
                type="text"
                name="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
              <label className="text-sm" htmlFor="Ingredients">
                Ingredients
              </label>
              <input
                className="my-3 px-3 py-2 rounded-lg outline-white"
                type="text"
                name="Ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>
            <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
              <label className="text-sm" htmlFor="PrepTime">
                Approximate PrepTime
              </label>
              <input
                className="my-3 px-3 py-2 rounded-lg outline-white"
                type="text"
                name="PrepTime"
                value={prepTime}
                onChange={(e) => setPreptime(e.target.value)}
              />
            </div>

            <div className="flex px-5 w-full   md:w-3/6 min-w-150 flex-col">
              <label className="text-sm" htmlFor="dishImg">
                Select your profile picture:
              </label>
              <input
                className="my-3 px-3 py-2 rounded-lg outline-white"
                type="file"
                id="inputGroupFile01"
                onChange={(e) => onSelectImageHandler(e.target.files)}
              />
            </div>

            {/* <img
              className="w-full h-44 object-contain"
              src={
                img
                  ? img
                  : "https://aadhyafoodindian.com/img/placeholders/grey_fork_and_knife.png"
              }
            /> */}
            <div className="w-full flex flex-col place-content-center h-full">
              <input
                type="submit"
                className="place-self-center my-3 min-w-250 bg-teal text-white p-2 rounded-full"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddItemPopup;
