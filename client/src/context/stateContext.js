import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
const Context = createContext({ isUser: null, isRest: null });

export const StateContext = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isUser, setIsUser] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const [isRest, setIsRest] = useState(null);
  const [restObj, setRestObj] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const Navigator = useNavigate();

  const userCheck = async () => {
    if (cookies.auth && cookies.email) {
      setIsRest(null);
      setRestObj(null);
      setIsUser(cookies.email);
      findUser();
    } else if (isUser && userObj) {
      setIsRest(null);
      setRestObj(null);
    } else if (
      cookies.auth &&
      cookies.emailr &&
      window.location.toString().includes("restaurants")
    ) {
      setIsRest(cookies.emailr);
      setIsUser(null);
      setUserObj(null);
      findRest();
    } else if (isRest) {
      setIsRest(isRest);
      findRest();
      setIsUser(null);
      setUserObj(null);
    } else {
      if (window.location.toString().includes("restaurants")) {
        Navigator("/restaurants/login");
      } else {
        Navigator("/login");
      }
    }
  };

  useEffect(() => {
    userCheck();
  }, [isRest, isUser]);

  const loginFunc = async (email, password) => {
    try {
      const resp = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      if (resp.status == 201) {
        setRestObj(null);
        setIsRest(null);
        setIsUser(resp.data.user.email);
        setUserObj(resp.data.user);
        setCookie("email", resp.data.user.email);
        setCookie("auth", resp.data.token);
        Navigator("/");
        toast.loading("Signing you in!");
      } else {
        toast.error("Invalid credentials, try again");
      }
    } catch (err) {
      toast.error("Invalid credentials, try again");
    }
  };

  const signupFunc = async (email, name, password) => {
    try {
      const resp = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
        orders: [],
        pastOrders: [],
      });

      if (resp.status === 200) {
        setIsUser(resp.data.user.email);
        setUserObj(resp.data.user);
        setIsRest(null);
        setCookie("email", resp.data.user.email);
        setCookie("auth", resp.data.token);
        Navigator("/");
      } else console.log("Email taken");
    } catch (err) {
      console.log(err);
      toast.error("Email taken...try another");
    }
  };

  const restLoginFunc = async (email, password) => {
    try {
      const resp = await axios.post("http://localhost:5000/restaurant/login", {
        email,
        password,
      });

      if (resp.status === 201) {
        setIsRest(resp.data.rest.email);
        setRestObj(resp.data);
        setIsUser(null);
        setCookie("emailr", resp.data.rest.email);
        setCookie("auth", resp.data.token);
        Navigator("/restaurants");
        toast.loading("Signing you in!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  const restSignupFunc = async (
    name,
    email,
    password,
    website,
    location,
    img,
    logo
  ) => {
    try {
      const resp = await axios.post("http://localhost:5000/restaurant/signup", {
        name,
        email,
        password,
        website,
        location,
        img,
        logo,
      });

      if (resp.status === 200) {
        setIsRest(resp.data.rest.email);
        setRestObj(resp.data.rest);
        setIsUser(null);
        setCookie("emailr", resp.data.rest.email);
        setCookie("auth", resp.data.token);
        Navigator("/restaurants");
      } else console.log("email taken");
    } catch (err) {
      console.log(err);
      toast.error("Email taken...try another");
    }
  };

  const getRest = async () => {
    try {
      const resp = await axios.get("http://localhost:5000/findRestaurants");
      setRestaurants(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  const findUser = async () => {
    try {
      const resp = await axios.post("http://localhost:5000/findUser", {
        email: isUser,
      });
      setUserObj(resp.data);
    } catch (err) {
      console.log("user not found");
      setIsUser(null);
      setUserObj(null);
    }
  };

  const findRest = async () => {
    try {
      const resp = await axios.post("http://localhost:5000/findTheRestaurant", {
        email: isRest,
      });
      resp && setRestObj(resp.data);
    } catch (err) {
      console.log("user not found");
    }
  };

  const getCartItems = async () => {
    try {
      const resp = await axios.post("http://localhost:5000/getCartItems", {
        email: isUser,
      });

      setCartItems(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    toast.loading("Signing you out");
    setIsRest(null);
    setIsUser(null);
    setRestObj(null);
    setUserObj(null);
    removeCookie("email", { path: "/" });
    removeCookie("auth", { path: "/" });
    removeCookie("email", { path: "/restaurants" });
    removeCookie("auth", { path: "/restaurants" });
    Navigator("/login");
  };

  //only keep last 10 orders
  const deleteOldOrders = async () => {};

  return (
    <Context.Provider
      value={{
        isUser,
        setIsUser,
        isRest,
        setIsRest,
        getRest,
        loginFunc,
        signupFunc,
        findUser,
        findRest,
        restaurants,
        userObj,
        restLoginFunc,
        restSignupFunc,
        restObj,
        logout,
        getCartItems,
        cartItems,
        setCartItems,
        userCheck,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
