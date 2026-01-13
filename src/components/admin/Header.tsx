import React, { useState } from "react";
import ButtonPrimary from "../elements/ButtonPrimary";
import axios from "axios";
import { Settings, RotateCcwKey } from "lucide-react";
import CardResetPass from "./cards/CardResetPass";

export default function Header() {
  const [rotate, setRotate] = useState<string>("")
  const [isRes, setIsRes] = useState<boolean>(false)
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed right-0 top-0 left-0 flex justify-end items-center p-5 bg-white">
      <div className="flex items-center">
        <button className={`mr-2 ${rotate} transition-all duration-300 ease-in-out cursor-pointer`} onClick={() => setRotate(rotate === "rotate-180" ? "" : "rotate-180")}><Settings /></button>
        <ButtonPrimary
          onClick={handleLogout}
          ClassName="bg-purple-500 text-white p-2 rounded"
        >
          Log Out
        </ButtonPrimary>
      </div>
      {rotate === "rotate-180" && (

        <div className="border-2 bg-white p-4 absolute top-20 right-5 rounded-lg border-purple-600">
          <h1 className="font-semibold text-gray-800 mb-5">Admin</h1>
          <button onClick={()=>setIsRes(!isRes)} className="text-sm flex items-center gap-2 cursor-pointer hover:scale-105 "><RotateCcwKey className="text-purple-600" />Change Password</button>
        </div>
      )}
      {isRes && (
        <div className="absolute top-0 z-50 h-screen w-screen bg-gray-100/90 flex items-center justify-center">
          <CardResetPass onClick={()=>setIsRes(!isRes)} />
        </div>
      )}
    </div>
  );
}
