import React,{useEffect} from "react";
import "aos/dist/aos.css";
import Aos from "aos";
import Image from "next/image";



type Props = {
    nama: string,
    nik: string,
    foto: string
};    
export default function CardDosen({nama, nik, foto="/profil.png"}: Props) {


      useEffect(() => {
      Aos.init({
        duration: 2000, // Durasi animasi dalam milidetik
        once: true, // Animasi hanya berjalan sekali
        easing: "ease-in-out", // Efek transisi animasi
      });
    }, []);
  return (
    <div data-aos="flip-left" className=" h-32 rounded-lg shadow-xl flex max-w-[22rem] lg:max-w-[25rem] text-wrap ">
      <div className="flex justify-center items-center h-32 w-32 bg-purple-800 rounded-full">
        <Image
          src={foto}
          alt=""
          width={112}
          height={112}
          className="w-[7rem] h-[7rem] bg-purple-400 rounded-full object-cover"
        />
      </div>
      <div className=" flex flex-col justify-evenly w-[14rem] lg:w-[17rem]">
        <h1 className="font-bold text-lg pl-2">{nama}</h1>
        <hr className='border-t-4 border-purple-800 w-full'/>
        <h2 className="font-semibold pl-2">NIK. {nik}</h2>
      </div>
    </div>
  );
}
