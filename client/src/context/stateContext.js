import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const Context = createContext({ isUser: null, isRest: null });

export const StateContext = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isUser, setIsUser] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const [isRest, setIsRest] = useState(null);
  const [restObj, setRestObj] = useState(null);
  const [theOrders, settheOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const Navigator = useNavigate();

  const userCheck = async () => {
    if (localStorage.getItem("auth") && localStorage.getItem("email")) {
      setIsRest(null);
      setRestObj(null);
      setIsUser(localStorage.getItem("email"));
      findUser();
    } else if (isUser && userObj) {
      setIsRest(null);
      setRestObj(null);
    } else if (
      localStorage.getItem("auth") &&
      localStorage.getItem("emailr") &&
      window.location.toString().includes("restaurants")
    ) {
      setIsRest(localStorage.getItem("emailr"));
      setIsUser(null);
      setUserObj(null);
      findRest();
    } else if (isRest) {
      setIsRest(isRest);
      findRest();
      setIsUser(null);
      setUserObj(null);
    } else {
      if (window.location.toString().includes("impactReport")) {
        //setting rest &7 customers
        if (localStorage.getItem("auth") && localStorage.getItem("email")) {
          setIsRest(null);
          setRestObj(null);
          setIsUser(localStorage.getItem("email"));
          findUser();
        } else if (isUser && userObj) {
          setIsRest(null);
          setRestObj(null);
        } else if (
          localStorage.getItem("auth") &&
          localStorage.getItem("emailr") &&
          window.location.toString().includes("restaurants")
        ) {
          setIsRest(localStorage.getItem("emailr"));
          setIsUser(null);
          setUserObj(null);
          findRest();
        } else if (isRest) {
          setIsRest(isRest);
          findRest();
          setIsUser(null);
          setUserObj(null);
        }
      } else if (window.location.toString().includes("restaurants")) {
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
      const resp = await axios.post(`/login`, {
        email,
        password,
      });
      if (resp.status == 201) {
        setRestObj(null);
        setIsRest(null);
        setIsUser(resp.data.user.email);
        setUserObj(resp.data.user);
        localStorage.setItem("email", resp.data.user.email);
        localStorage.setItem("auth", resp.data.token);
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
      const resp = await axios.post(`/signup`, {
        name,
        email,
        password,
        orders: [],
        pastOrders: [],
      });

      if (resp.status === 200) {
        setRestObj(null);
        setIsRest(null);
        setIsUser(resp.data.user.email);
        setUserObj(resp.data.user);
        localStorage.setItem("email", resp.data.user.email);
        localStorage.setItem("auth", resp.data.token);
        Navigator("/");
      } else console.log("Email taken");
    } catch (err) {
      console.log(err);
      toast.error("Email taken...try another");
    }
  };

  const restLoginFunc = async (email, password) => {
    try {
      const resp = await axios.post(`/restaurant/login`, {
        email,
        password,
      });

      if (resp.status === 201) {
        setIsRest(resp.data.rest.email);
        setRestObj(resp.data);
        setIsUser(null);
        localStorage.setItem("emailr", resp.data.rest.email);
        localStorage.setItem("auth", resp.data.token);
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
      const resp = await axios.post(`/restaurant/signup`, {
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
        localStorage.setItem("emailr", resp.data.rest.email);
        localStorage.setItem("auth", resp.data.token);
        Navigator("/restaurants");
      } else console.log("email taken");
    } catch (err) {
      console.log(err);
      toast.error("Email taken...try another");
    }
  };

  const getRest = async () => {
    try {
      const resp = await axios.get(`/findRestaurants`);
      setRestaurants(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  const findUser = async () => {
    try {
      const resp = await axios.post(`/findUser`, {
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
      const resp = await axios.post(`/findTheRestaurant`, {
        email: isRest,
      });
      resp && setRestObj(resp.data);
    } catch (err) {
      console.log("user not found");
    }
  };

  const getCartItems = async () => {
    try {
      const resp = await axios.post(`/getCartItems`, {
        email: isUser,
      });

      setCartItems(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getOrders = async () => {
    try {
      const resp = await axios.post(`/history/${isUser}`);
      settheOrders(
        resp.data.sort((a, b) => {
          if (a.completed > b.completed) return -1;
          if (a.completed < b.completed) return 1;
          return 0;
        })
      );
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
    localStorage.removeItem("email", { path: "/" });
    localStorage.removeItem("auth", { path: "/" });
    localStorage.removeItem("email", { path: "/restaurants" });
    localStorage.removeItem("auth", { path: "/restaurants" });
    Navigator("/login");
  };

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
        getOrders,
        theOrders,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
