import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4 gap-4">
      <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
      <p className="text-xl mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>

      <button className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-black uppercase tracking-wide hover:bg-yellow-300 transition-colors border-2 border-gray-900">
        <Link to="/">Go to Home</Link>
      </button>
    </div>
  );
};

export default NotFound;
