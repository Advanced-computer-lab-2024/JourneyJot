// components/BackArrow.js

import { useHistory } from "react-router-dom";

const BackArrow = () => {
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack(); // Navigate back to the previous page
  };

  return (
    <button
      onClick={handleBackClick}
      className="flex items-center text-blue-500 hover:text-blue-700 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 12H3m0 0l6 6m-6-6l6-6"
        />
      </svg>
      Back
    </button>
  );
};

export default BackArrow;
