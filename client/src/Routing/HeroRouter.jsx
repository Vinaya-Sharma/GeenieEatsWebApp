import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../components/customers/HomePage";
import History from "../components/customers/History";
import MyImpact from "../components/customers/MyImpact";
import RestProf from "../components/RestProf";
import AddPage from "../components/restaurants/AddPage";
import Orders from "../components/restaurants/Orders";
import Cart from "../components/customers/Cart";

const HeroRouter = ({ user, restaurants, restaurant }) => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <HomePage
            user={user}
            restaurant={restaurant}
            restaurants={restaurants}
          />
        }
      />
      <Route path="/History/*" element={<History user={user} />} />
      <Route path="/myImpact" element={<MyImpact />} />
      <Route
        path="/order/:name"
        element={<RestProf user={user} restaurant={restaurant} />}
      />
      <Route
        path="/cart"
        element={<Cart user={user} restaurant={restaurant} />}
      />

      <Route
        path="/restaurants"
        element={
          <HomePage
            restaurant={restaurant}
            user={user}
            restaurants={restaurants}
          />
        }
      />
      <Route
        path="/restaurants/order/:name"
        element={<RestProf user={user} restaurant={restaurant} />}
      />
      <Route path="/manageMeals" element={<AddPage />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
};

export default HeroRouter;
