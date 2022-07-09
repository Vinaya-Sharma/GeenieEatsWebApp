import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faEyeSlash,
  faEye,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import AddItemPopup from "./addItemPopup";
import axios from "axios";
import { useStateContext } from "../../context/stateContext";

const AddPage = () => {
  const [addPopup, setAddPopup] = useState(false);
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cost, setCost] = useState("");
  const [prepTime, setPreptime] = useState("");
  const [img, setImg] = useState("");
  const [edit, setEdit] = useState(false);
  const [visibility, setVisibility] = useState(false);

  const { restObj } = useStateContext();

  const updateVisibility = async (meal) => {
    const available = !meal.available;
    try {
      await axios.put(`/updateAvailability`, {
        email: restObj.email,
        id: meal._id,
        available,
      });
      setVisibility(!visibility);
    } catch (err) {
      console.log(err);
    }
  };

  const editDish = async (meal) => {
    setEdit(meal._id);
    setName(meal.name);
    setDescription(meal.description);
    setIngredients(meal.ingredients);
    setCost(meal.cost);
    setPreptime(meal.prepTime);
    setImg(meal.img);

    if (name.length > 0 && description.length > 0) {
      setAddPopup(true);
    }
  };

  const deleteMeal = async (meal) => {
    try {
      const resp = await axios.post(`/deleteDish`, {
        id: meal._id,
        email: restObj.email,
      });
      setVisibility(!visibility);
    } catch (err) {
      console.log(err);
    }
  };

  const addMeal = () => {
    setEdit(false);
    setName("");
    setDescription("");
    setIngredients("");
    setCost("");
    setPreptime("");
    setImg("");
    setAddPopup(true);
  };

  const findMeals = async () => {
    try {
      const resp = await axios.post(`/findDishes`, {
        email: restObj.email,
      });
      setMeals(resp?.data?.dishes ? resp.data.dishes : "");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    findMeals();
  }, [addPopup, visibility]);

  return (
    <div className="min-h-screen relative h-full w-full bg-base p-20">
      <AddItemPopup
        restEmail={restObj.email}
        setAddPopup={setAddPopup}
        edit={edit}
        setEdit={setEdit}
        addPopup={addPopup}
        name={name}
        description={description}
        ingredients={ingredients}
        cost={cost}
        prepTime={prepTime}
        img={img}
        setName={setName}
        setDescription={setDescription}
        setIngredients={setIngredients}
        setCost={setCost}
        setPreptime={setPreptime}
        setImg={setImg}
      />
      <p className="text-2xl font-bold text-white tracking-widest">
        Manage Meals
      </p>

      <div className="w-11/12 mt-10 place-self-center place-items-center flex flex-col bg-[#1F1D2B] p-12 rounded-lg">
        <p className="text-xl font-bold text-stone-300">Add And Edit Meals</p>

        <div className="flex place-self-center place-content-center lg:justify-between center flex-row my-5 flex-wrap w-full">
          <div
            onClick={() => addMeal()}
            className="min-w-250 my-5 h-80 w-[31%] place-self-center justify-center text-center flex flex-col border-teal border-dotted rounded-lg border-2"
          >
            <p className="w-full text-4xl font-bold text-center text-teal">+</p>
            <p className="w-full text-xl text-center mt-5 text-teal">
              add a new meal
            </p>
          </div>
          {meals?.length > 0 &&
            meals?.map((meal) => {
              const base64string = btoa(
                String.fromCharCode(...new Uint8Array(item.img.data))
              )(
                <div
                  key={meal._id}
                  className={`${
                    meal.available ? "opacity-100" : "opacity-50"
                  } min-w-250 my-5 h-full w-[31%] place-self-center center text-center flex flex-col border-[#393C49] rounded-lg border-2`}
                >
                  <img
                    className="rounded-lg w-full h-36 object-cover"
                    src={`data:image/png;base64, ${base64string}`}
                    alt={`${meal.name}-img`}
                  />
                  <p className="text-md font-bold text-white place-self-center w-full text-center my-3">
                    {meal.name}
                  </p>
                  <p className="text-sm  text-white place-self-center w-full text-center my-1">
                    {meal.description}
                  </p>
                  <p className="text-sm font-bold text-stone-300 place-self-center w-full text-center my-3">
                    ${meal.cost} •{" "}
                    {meal.prepTime
                      ? `${meal.prepTime}mins`
                      : `Ingredients: ${
                          meal.ingredients.length > 10
                            ? `${meal.ingredients.slice(0, 10)}...`
                            : meal.ingredients
                        }`}{" "}
                  </p>
                  <div className="w-full h-20 mt-3 bg-teal bg-opacity-50 flex rounded-sm place-content-center center justify-center flex-row">
                    <div
                      onClick={() => {
                        editDish(meal);
                      }}
                      className="flex flex-col text-teal hover:text-white place-content-center place-self-center w-2/6 mx-5"
                    >
                      {" "}
                      <FontAwesomeIcon
                        className="w-6 h-6 place-self-center"
                        icon={faPenToSquare}
                      />{" "}
                      <p className="place-self-center text-sm mt-1 w-full text-center">
                        edit
                      </p>{" "}
                    </div>
                    <div
                      onClick={() => updateVisibility(meal)}
                      className="flex flex-col text-teal hover:text-white place-content-center align-center w-2/6 mx-5"
                    >
                      {" "}
                      <FontAwesomeIcon
                        className="w-6 h-6 place-self-center"
                        icon={meal.available ? faEye : faEyeSlash}
                      />{" "}
                      <p className="place-self-center text-sm mt-1 w-full text-center">
                        {meal.available ? "available" : "unavailable"}
                      </p>{" "}
                    </div>
                    <div
                      onClick={() => deleteMeal(meal)}
                      className="flex flex-col text-teal hover:text-white place-content-center align-center w-2/6 mx-5"
                    >
                      {" "}
                      <FontAwesomeIcon
                        className="w-6 h-6 place-self-center "
                        icon={faTrash}
                      />{" "}
                      <p className="place-self-center text-sm mt-1 w-full text-center">
                        remove
                      </p>{" "}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AddPage;
