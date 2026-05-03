import React from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  semester: string;
  children: React.ReactNode;
  isOpen : boolean;
  onClick: () => void ;
}
export default function CardKurikulum({ children, semester, isOpen, onClick }: Props) {
  console.log("ini is open",isOpen)
  return (
    <div className={`bg-white max-w-sm md:max-w-xl lg:max-w-3xl relative shadow-2xl  rounded-lg ${isOpen?" border-2 border-collapse  border-purple-300":""} mb-5 transform `}>
      <button
        onClick={onClick}
        className="p-2 cursor-pointer outline-none text-lg font-bold mb-1 w-full rounded-lg ring-2 ring-purple-500 flex items-center justify-between"
      >
        {"Semester " + semester}
        <button
          onClick={onClick}
          className={`absolute right-4 top-2  cursor-pointer transform transition-all duration-300  ${
            isOpen ? "rotate-180 text-gray-600" : " text-purple-600"
          }`}
        >
          <ChevronDown />
        </button>
      </button>
      <div
        className={` ${isOpen?" m-2 md:m-5 bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden":"m-0 hidden"} `}
      >
        <div
          className={`overflow-x-auto ${
          isOpen ? " scale-100" : "scale-0 max-h-0 p-0"
        }`}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                <th className=" px-2 md:px-6 py-4 text-left font-semibold">No</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Kode MataKuliah
                </th>
                <th className="px-2 md:px-6 py-4 text-left font-semibold">
                  Nama MataKuliah
                </th>
                <th className="px-2 md:px-6 py-4 text-left font-semibold">SKS</th>
              </tr>
            </thead>
            <tbody>
           {children}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
