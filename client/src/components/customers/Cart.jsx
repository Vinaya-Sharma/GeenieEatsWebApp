import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/stateContext";
import toast from "react-hot-toast";
import cart from "../../assets/empty-cart-4816550-4004141.webp";

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

  const placeOrder = async () => {
    try {
      setCartItems([]);
      toast.success("Order placed!");
      const resp = await axios.put(`/placeOrder/${isUser}`, {
        placed: true,
        placedAt: new Date(),
      });
      getCartItems();
    } catch (err) {
      console.log(err);
    }
  };

  const placeWithoutPaying = async () => {
    for (let i = 0; i < cartItems.length; i++) {
      try {
        const resp = await axios.post(
          `http://localhost:${process.env.PORT}/checkAvailability`,
          { itemId: cartItems[i].itemId }
        );
        const theItem = resp.data.filter(
          (dish) => dish._id == cartItems[i].itemId
        );
        if (!cartItems[i] || cartItems[i].quantity < 1) {
          toast.error(
            `Please remove the ${cartItems[i].itemName} from your cart or purchase atleast 1`
          );
          return;
        }
        if (theItem[0].available !== true) {
          toast.error(`${cartItems[i].itemName} is unavailable right now`);
          return;
        } else if (theItem[0].cost != cartItems[i].itemCost) {
          toast.error(
            `${cartItems[i].itemName} has been updated, please add the updated item to cart`
          );
          return;
        }
      } catch (err) {
        console.log(err);
      }
    }
    await placeOrder();
  };

  const checkStripeCart = async () => {
    for (let i = 0; i < cartItems.length; i++) {
      try {
        const resp = await axios.post(
          `http://localhost:${process.env.PORT}/checkAvailability`,
          { itemId: cartItems[i].itemId }
        );
        const theItem = resp.data.filter(
          (dish) => dish._id == cartItems[i].itemId
        );
        if (!cartItems[i] || cartItems[i].quantity < 1) {
          toast.error(
            `Please remove the ${cartItems[i].itemName} from your cart or purchase atleast 1`
          );
          return;
        }
        if (theItem[0].available !== true) {
          toast.error(`${cartItems[i].itemName} is unavailable right now`);
          return;
        } else if (theItem[0].cost != cartItems[i].itemCost) {
          toast.error(
            `${cartItems[i].itemName} has been updated, please add the updated item to cart`
          );
          return;
        }
      } catch (err) {
        console.log(err);
      }
    }
    stripeCheckout();
  };

  const stripeCheckout = async () => {
    const theResp = await axios.post(
      `http://localhost:${process.env.PORT}/create-checkout-session`,
      cartItems
    );
    const theStripeId = theResp.data.id ? theResp.data.id : "0";
    //sends user to success or fail url
    window.location = theResp.data.url;
  };

  const updateQuantity = async (id, e) => {
    let value;

    if (e > 20) {
      value = 20;
      toast.error("Sorry there is a max quantity of 20 ");
    } else {
      value = e;
    }

    try {
      await axios.put(
        `http://localhost:${process.env.PORT}/updateQuantity/${id}`,
        {
          quantity: value,
        }
      );
      getCartItems();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCartItem = async (item) => {
    try {
      await axios.post(`http://localhost:${process.env.PORT}/deleteCartItem`, {
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
    <div className="min-h-screen overflow-scroll w-full  bg-base lg:bg-dblue p-12  max-h-screen h-full flex flex-col">
      {cartItems.length > 0 ? (
        <div className="min-h-screen overflow-scroll w-full  bg-base lg:bg-dblue  max-h-screen h-full flex flex-col">
          <p className="font-sm tracking-wider text-white border-b-2 pb-1 border-white ">
            Order from {user?.name} 👨‍🍳
          </p>

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
                  <p className="w-2/6 text-white mx-3 place-self-center text-xs">
                    {item.itemName}
                  </p>

                  <div className="flex lg:w-2/6 w-3/6 bg-base rounded-lg flex-col  justify-center place-content-center">
                    <input
                      className="bg-dblue  w-16 place-self-center outline-none border-none p-2 rounded-lg lg:bg-base text-center text-white"
                      value={item.quantity ? item.quantity : ""}
                      placeholder="0"
                      onChange={(e) => updateQuantity(item._id, e.target.value)}
                    />
                  </div>

                  <p className="md:w-2/6 w-1/6 place-self-center text-right text-white text-s">
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
              onClick={() => checkStripeCart()}
              className="hover:opacity-75 w-full mx-3 bg-gray-300 mb-10 place-self-center px-5 py-2 rounded-lg font-bold text-center text-dteal"
            >
              Pay Now With Stripe
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-3">
          <p className="font-sm text-white ">Order from {user?.name} 👨‍🍳</p>
          <hr className="text-white bg-white flex w-full my-2" />
          <p className="text-gray-300 ">
            Currently empty, treat yourself with GeenieEats!
          </p>
          <img src={cart} />
        </div>
      )}
    </div>
  );
};

export default Cart;
