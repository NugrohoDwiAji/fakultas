import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
    question: string;
    answer: string;
};  

const CardFaq = ({question, answer}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white max-w-sm md:max-w-xl relative shadow-2xl h-fit rounded-lg border-purple-300 border-2 border-collapse w-fit">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full text-start font-bold text-lg md:text-xl  text-gray-900 ring-2 ring-purple-500 rounded-lg px-10 py-2"
      >
        <h1>
         {question}
        </h1>
      </button>
      <div
        className={`text-gray-700 transform transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "px-6 py-2 scale-100" : "scale-0 max-h-0 p-0"
        }`}
      >
        <p
          className={`text-gray-700 leading-relaxed text-base transform transition-all duration-500 ease-in-out ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
         {answer}
        </p>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute right-4 top-2  cursor-pointer transform transition-all duration-300  ${
          isOpen ? "rotate-180 text-gray-600" : " text-purple-600"
        }`}
      >
        <ChevronDown />
      </button>
    </div>
  );
};

export default CardFaq;
