import React, { useEffect, useState } from "react";
import axios from "axios";
import CardDosen from "@/components/cards/CardDosen";
import Image from "next/image";

type IdentitasType = {
  id: string;
  name: string;
  value: string;
};

type Data = {
  id: string;
  nama: string;
  nitk: string;
  foto: string;
  uploadat: string;
};

export default function Staf() {
  const [identitas, setIdentitas] = useState<IdentitasType[] | null>([]);
  const [dosenIlkom, setDosenIlkom] = useState<Data[]>([]);

  const handleGetIdentitas = async () => {
    try {
      const result = await axios.get("/api/identitas");
      setIdentitas(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetByHomebase = async () => {
    try {
      const result = await axios.get(`/api/staf`);
      setDosenIlkom(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetIdentitas();
    handleGetByHomebase()
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 lg:h-[35rem]">
        <Image
          fill
          src="/img/banner-pasca.png"
          alt=""
          className="object-cover"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-5 md:p-10 -mt-9 md:-mt-20 lg:-mt-36">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
            Daftar Dosen 
          </h1>
          <h2 className="text-white mt-3">
            Daftar Staf
            {identitas?.find((item) => item.name === "Nama Fakultas")?.value}{" "}
            Universitas Bumigora
          </h2>
        </div>
      </div>

      <div className="text-purple-900 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">Staf</h1>
      </div>
      {/* Main */}
      <main className="flex flex-col  items-center min-h-64 py-10 px-5 lg:px-10">

        <div className="flex gap-5 flex-wrap justify-center mb-10">
        {dosenIlkom.map((item) => (
          <CardDosen
            key={item.id}
            nama={item.nama}
            nik={item.nitk}
            foto={item.foto}
          />
        ))}
        </div>
  
      </main>
    </div>
  );
}
