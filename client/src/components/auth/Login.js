import React, { useEffect, useState } from "react";
import background from "../../assets/background.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/stateContext";

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState(true);
  const [name, setName] = useState("");
  const [theEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginFunc, signupFunc, isUser } = useStateContext();

  const switchLS = () => {
    setLogin(!login);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const email = theEmail.toLowerCase();

    if (login && theEmail && password) {
      loginFunc(email, password);
    } else if (!login && theEmail && password && name) {
      signupFunc(email, name, password);
    }
  };

  const tealStyle =
    "text-4xl font-bold text-teal underline font-playfair hover:underline cursor-pointer";
  const whiteStyle =
    "text-4xl font-bold text-white font-playfair cursor-pointer hover:underline ";

  return (
    <div className="w-screen min-h-screen bg-lblue h-full flex relative">
      <div className="hidden md:flex flex-end cover h-full max-w-320 contain absolute right-0">
        <img src={background} alt="background" />
      </div>

      {/** LOGIN AND SIGN UP STUFF */}
      <div className="flex flex-col w-full md:w-8/12 justify-center center align-center place-content-center">
        {/** DECIDING LOGIN OR SIGN UP STARTS */}
        <div className="flex flex-row space-x-4 place-self-center mb-5">
          <div
            onClick={() => switchLS()}
            className={login ? tealStyle : whiteStyle}
          >
            Login
          </div>
          <div
            onClick={() => switchLS()}
            className={!login ? tealStyle : whiteStyle}
          >
            Sign Up
          </div>
        </div>
        <p className="text-sm text-stone-300 place-self-center">
          view the latest deals and help your community
        </p>
        {/** DECIDING LOGIN AND SIGN UP STUFF ENDS */}
        {/** FORM STARTS */}
        <form className="place-self-center" onSubmit={(e) => submitForm(e)}>
          <div className="flex flex-col h-full place-content-center space-y-2 mt-5">
            {!login && (
              <div className="flex flex-col space-y-2 ">
                <label className="text-sm text-stone-300" htmlFor="name">
                  name displayed
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className=" min-w-250 bg-white p-2 rounded-full"
                />
              </div>
            )}
            <label className="text-sm text-stone-300" htmlFor="email">
              email
            </label>
            <input
              type="email"
              name="email"
              value={theEmail}
              onChange={(e) => setEmail(e.target.value)}
              className=" min-w-250 bg-white p-2 rounded-full"
            />
            <label className="text-sm text-stone-300 mt-2 " htmlFor="password">
              password
            </label>
            <input
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className=" min-w-250 bg-white p-2 rounded-full"
            />

            <input
              type="submit"
              className="m-10 min-w-250 bg-teal text-white p-2 rounded-full"
            />
          </div>
        </form>
        {/** FORM ENDS */}
      </div>
      {/** LOGIN AND SIGN UP STUFF */}
    </div>
  );
};

export default Login;
