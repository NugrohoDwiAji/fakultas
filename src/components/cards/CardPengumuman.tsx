import React, { useEffect } from "react";
import { format } from "date-fns";
import AOS from "aos";
import "aos/dist/aos.css";

type Props = {
  title:string;
  file_path: string;
  uploadat: string;
}
export default function CardPengumuman({ title, file_path, uploadat}: Props) {
    
  useEffect(() => {
    // AOS.init({
    //   duration: 3000, // Durasi animasi dalam milidetik
    //   once: false, // Animasi hanya berjalan sekali
    //   easing: "ease-in-out", // Efek transisi animasi
    // });
  }, []);

  return (
    <div  
    // data-aos="flip-left"
    //  data-aos-easing="ease-out-cubic"
    //  data-aos-duration="2000" 
     className="bg-white text-gray-800 h-fit fit md:w-72 shadow-2xl rounded-lg ">
      <h1 className="p-3 text-lg text-center font-bold">{title}</h1>
      <hr className="border-t-2 border-gray-800 w-full" />
      <div className="flex gap-2 justify-center items-center h-1/2 px-4 py-2">
        <h2 className="font-semibold ">{uploadat=format(new Date(uploadat), "yyyy-MM-dd")}</h2>
        <div className="h-9 w-[2px] bg-purple-950"></div>
        <a href={file_path} download={title} className="py-2 px-4 rounded-lg hover:scale-105 ease-in-out duration-300 bg-purple-950 hover:bg-white hover:text-purple-950 hover:border-2 hover:border-purple-950 text-white">Unduh</a>
      </div>
    </div>
  );
}
