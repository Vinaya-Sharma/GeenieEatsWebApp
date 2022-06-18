import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/stateContext";

const Cart = ({ user }) => {
  const navigator = useNavigate();
  const { getCartItems, cartItems, setCartItems, isUser } = useStateContext();
  const calculateTotal = () => {
    let total = 0;

    cartItems?.forEach((item) => {
      total += item.quantity * item.itemCost;
    });

    return total;
  };

  const checkCart = async () => {
    cartItems.map(async (item) => {
      try {
        const resp = await axios.post(
          `http://localhost:5000/checkAvailability`,
          { itemId: item.itemId }
        );
        const theItem = resp.data.filter((dish) => dish._id == item.itemId);
        console.log("here it is on frontend", theItem);
        if (theItem[0].available !== true) {
          alert(`${item.itemName} is unavailable right now`);
        } else if (theItem[0].cost != item.itemCost) {
          alert(
            `${item.itemName} has been updated, please add the updated item to cart`
          );
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  const placeOrder = async () => {
    checkCart();
    console.log(isUser);
    try {
      const resp = await axios.put(
        `http://localhost:5000/placeOrder/${user?.email}`,
        { placed: true, placedAt: new Date() }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const placeWithoutPaying = async () => {
    placeOrder();
  };

  const stripeCheckout = async () => {
    const theResp = await axios.post(
      `http://localhost:5000/create-checkout-session`,
      cartItems
    );
    const theStripeId = theResp.data.id ? theResp.data.id : "0";
    //sends user to success or fail url
    window.location = theResp.data.url;
    // try {
    //   const resp = await axios.put(
    //     `http://localhost:5000/placeOrder/${user?.email}`,
    //     { placed: false, placedAt: null, stripeId: theStripeId }
    //   );
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const updateQuantity = async (id, e) => {
    let value;
    if (e > 20) {
      value = 20;
      alert("Sorry there is a max quantity of 20 ");
    } else {
      value = e;
    }

    try {
      await axios.put(`http://localhost:5000/updateQuantity/${id}`, {
        quantity: value,
      });
      getCartItems();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCartItem = async (item) => {
    try {
      await axios.post("http://localhost:5000/deleteCartItem", {
        id: item._id,
      });
      getCartItems();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="w-full bg-dblue p-12 h-full flex flex-col">
      <p className="font-sm text-white ">Order from {user?.name} 👨‍🍳</p>

      <div className="flex flex-col w-full justify-center place-self-center center align-center mt-10">
        <div className="flex-row flex">
          <p className="font-sm text-white w-7/12">Item</p>
          <p className="font-sm text-white mx-10 w-3/12">Quantity</p>
          <p className="font-sm text-white w-2/12">Price</p>
        </div>
        <hr className="w-full my-5" />
      </div>

      <div className="flex flex-col w-full space-y-4">
        {cartItems.map((item, id) => (
          <div key={id} className="w-full flex flex-col">
            <div className="flex flex-row relative">
              <img
                src={item.itemImg}
                alt="food item"
                className="w-10 object-cover h-10 rounded-full"
              />
              <p className="w-7/12 text-white mx-3 place-self-center text-xs">
                {item.itemName}
              </p>

              <div className="flex w-3/12 bg-base rounded-lg flex-col  justify-center place-content-center">
                <input
                  className="place-self-center outline-none border-none p-2 rounded-lg w-full bg-base text-center text-white"
                  value={item.quantity ? item.quantity : ""}
                  placeholder="0"
                  onChange={(e) => updateQuantity(item._id, e.target.value)}
                />
              </div>

              <p className="w-2/12 text-center place-self-center text-right text-white text-s">
                ${item.itemCost}
              </p>
            </div>

            <div className="flex relative row w-full">
              <p className="my-3 place-self-center w-8/12 text-white text-xs">
                {item.restName} @ {item.restLocation}
              </p>
              <FontAwesomeIcon
                onClick={() => deleteCartItem(item)}
                className="text-lg place-self-center absolute right-0 text-teal"
                icon={faTrash}
              />
            </div>
            <hr className="w-full my-3" />
          </div>
        ))}
        <div className="flex flex-row relative py-5 w-full">
          <p className="my-3 place-self-center absolute left-0 text-white text-s">
            Total
          </p>
          <p className="my-3 place-self-center absolute right-0 text-white text-s ">
            ${calculateTotal()}
          </p>
        </div>
        <p
          onClick={() => placeWithoutPaying()}
          className="hover:opacity-75 w-full mx-3 bg-dteal mb-10 place-self-center px-5 py-2 rounded-lg text-center text-white"
        >
          Place Order
        </p>
        <p
          onClick={() => stripeCheckout()}
          className="hover:opacity-75 w-full mx-3 bg-gray-300 mb-10 place-self-center px-5 py-2 rounded-lg font-bold text-center text-dteal"
        >
          Pay Now With Stripe
        </p>
      </div>
    </div>
  );
};

export default Cart;
