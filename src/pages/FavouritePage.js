import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavouriteList from "../components/FavouriteList";

const FavouritePage = () => {
  return (
    <div>
      <Navbar />
      <FavouriteList />
      <Footer />
    </div>
  );
};

export default FavouritePage;
