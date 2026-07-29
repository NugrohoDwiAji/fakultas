import React from "react";
import CardDosen from "@/components/cards/CardDosen";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { IdentitasType, StafType } from "@/types";

interface StafProps {
  identitas: IdentitasType[];
  dataStaf: StafType[];
}

export default function Staf({ identitas, dataStaf }: StafProps) {
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
            Daftar Staf 
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
        {dataStaf.map((item) => (
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [identitas, dataStaf] = await Promise.all([
      prisma.identitas.findMany(),
      prisma.staf.findMany({
        orderBy: { nama: "asc" },
      }),
    ]);

    return {
      props: {
        identitas: JSON.parse(JSON.stringify(identitas)),
        dataStaf: JSON.parse(JSON.stringify(dataStaf)),
      },
    };
  } catch (error) {
    console.error("Error fetching staf:", error);
    return {
      props: {
        identitas: [],
        dataStaf: [],
      },
    };
  }
};
