/** @format */

import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex justify-center ">
      <Link to={"/products"}>
        <button className="bg-red-500 rounded-md">View Products</button>
      </Link>
      <Link to={"/tour-guide/profile"}>
        <button className="bg-red-500 rounded-md">View Profile</button>
      </Link>
    </div>
  );
};

export default HomePage;
