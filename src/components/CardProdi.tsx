import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
    title: string;
    children:React.ReactNode;
    isOpen : boolean;
    onClick: () => void
};  

const CardProdi = ({title, children, isOpen, onClick}: Props) => {
  return (
    <div className="bg-white max-w-xs md:max-w-xl lg:max-w-3xl relative shadow-2xl h-fit rounded-lg border-purple-300 border-2 border-collapse w-fit lg:min-w-3xl min-w-xs">
      <button
        onClick={onClick}
        className="cursor-pointer w-full text-start font-bold text-lg md:text-xl  text-gray-900 ring-2 ring-purple-500 rounded-lg px-10 py-2"
      >
        <h1>
         {title}
        </h1>
      </button>
      <div
        className={`text-gray-700 transform transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "px-2 md:px-6 py-2 scale-100" : "scale-0 max-h-0 p-0"
        }`}
      >
        <div
          className={`text-gray-700 leading-relaxed text-base transform transition-all duration-500 ease-in-out ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
         {children}
        </div>
      </div>

      <button
        onClick={onClick}
        className={`absolute right-4 top-2  cursor-pointer transform transition-all duration-300  ${
          isOpen ? "rotate-180 text-gray-600" : " text-purple-600"
        }`}
      >
        <ChevronDown />
      </button>
    </div>
  );
};

export default CardProdi;
