import React, { useState, useEffect } from "react";
import axios from "axios";
import CardProdi from "@/components/CardProdi";
import { ChevronDown } from "lucide-react";
import CardKurikulum from "@/components/CardKurikulum";
import TabelKurikulum from "@/components/TabelKurikulum";
import { da } from "date-fns/locale";

interface Prodi {
  id: string;
  nama: string;
  link: string;
  visi: string;
  misi: string;
}
interface Kurikulum {
  semester: string;
  data: [
    {
      id_matakuliah: number;
      kode_matakuliah: string;
      nama_matakuliah: string;
      sks_teori: number;
      sks_praktek: number;
      sks_praktikum: number;
    }
  ];
}

export default function S2IlmuKomputer() {
  const [prodi, setProdi] = useState<Prodi[]>([]);
  const [kurikulum, setkurikulum] = useState<Kurikulum[]>([]);
    const [kurikulumActiveId, setKurikulumActiveId] = useState<Number | null>(null);
    const [prodiActiveId, setProdiActiveId] = useState<Number>(1);
  
  const handleGetProdi = async () => {
    try {
      const result = await axios.get("/api/prodi");
      setProdi(result.data);
    } catch (error) {
      console.log(error, "eror");
    }
  };

  const misiContent =
    prodi?.find((item: Prodi) => item.nama === "S2 Ilmu Komputer")?.misi || "";

  const formattedContent = misiContent
    .split(/(?=\d+\.)/) // Pisahkan sebelum angka
    .map((item) => item.replace(/^\d+\.\s*/, "").trim()) // Hapus nomor dan spasi setelahnya
    .filter((item) => item.length > 0); // Hapus item kosong jika ada

  const dataMap = formattedContent.slice(1);

  const handleGetKurikulum = async () => {
    try {
      const result = await axios.get(
        "https://backbone.universitasbumigora.ac.id/api/v1/kurikulum/18"
      );
      setkurikulum(result.data);
      console.log("ini result", result);
    } catch (error) {
      console.log(error, "eror");
    }
  };

  useEffect(() => {
    handleGetProdi();
    handleGetKurikulum();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 lg:h-[35rem]">
        <img
          src="/img/banner-pasca.png"
          alt=""
          className="w-full bg-cover h-full"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-3 md:p-10 -mt-9 md:-mt-20 lg:-mt-36">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
            S2 Ilmu Komputer
          </h1>
          <h2 className="text-white mt-3">
            S2 Ilmu Komputer Universitas Bumigora
          </h2>
        </div>
      </div>

      <div className="text-purple-900 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
          Profil S2 Ilmu Komputer
        </h1>
      </div>
      {/* Main */}
      <main className="px-5 flex flex-col my-10 md:my-12 md:max-w-xl lg:max-w-4xl m-auto gap-2">
        <CardProdi title="Visi" onClick={()=>setProdiActiveId(1)} isOpen={prodiActiveId === 1 ? true : false}>
          {prodi?.find((item) => item.nama === "S2 Ilmu Komputer")?.visi}
        </CardProdi>

        <CardProdi title="Misi" isOpen={prodiActiveId === 2 ? true : false} onClick={()=>setProdiActiveId(2)}>
          <p className="space-y-2 text-lg text-justify indent-10 mb-5">
            {formattedContent[0]}
          </p>
          <ul className="space-y-2 text-lg text-justify list-decimal ml-5 ">
            {dataMap?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardProdi>
        <CardProdi title="Profil Lulusan" isOpen={prodiActiveId === 3 ? true : false} onClick={()=>setProdiActiveId(3)}>
          <div></div>
        </CardProdi>
        <CardProdi title="Kurikulum" isOpen={prodiActiveId === 4 ? true : false} onClick={()=>setProdiActiveId(4)}>
          {kurikulum.map((item, index) => (
            <CardKurikulum semester={item.semester} key={index} onClick={()=>setKurikulumActiveId(index)} isOpen={kurikulumActiveId === index ? true : false}>
              {item.data.map((data, index) => (
                <TabelKurikulum
                  id_matkul={data.id_matakuliah}
                  nama_matakuliah={data.nama_matakuliah}
                  kode_matakuliah={data.kode_matakuliah}
                  no={index + 1}
                  sks={data.sks_teori + data.sks_praktek + data.sks_praktikum}
                  key={index}
                />
              ))}
            </CardKurikulum>
          ))}
        </CardProdi>
      </main>
    </div>
  );
}
