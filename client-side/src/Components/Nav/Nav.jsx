import React from "react";
import { Link } from "react-router-dom";

const Nav = ({user}) => {
  return (
    <nav className="bg-teal-600 text-white px-6 py-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Title */}
       <Link to={'/'}> <h1 className="text-xl font-bold">ChatApp</h1></Link>
        <h2  className="text-xl font-bold">{user}</h2>
      </div>
    </nav>
  );
};

export default Nav;
