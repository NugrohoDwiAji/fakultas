import React from "react";
import CardDosen from "@/components/cards/CardDosen";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { IdentitasType, DosenType } from "@/types";

interface DosenProps {
  identitas: IdentitasType[];
  dosenIlkom: DosenType[];
  dosenSasing: DosenType[];
}

export default function Dosen({ identitas, dosenIlkom, dosenSasing }: DosenProps) {
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
            Daftar Dosen
            {identitas?.find((item) => item.name === "Nama Fakultas")?.value}{" "}
            Universitas Bumigora
          </h2>
        </div>
      </div>

      <div className="text-purple-900 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">Dosen</h1>
      </div>
      {/* Main */}
      <main className="flex flex-col  items-center min-h-64 py-10 px-5 lg:px-10">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-purple-900 mb-5 border-2 border-dashed px-2 py-1 rounded-lg">S2 Ilmu Komputer</h1>
        <div className="flex gap-5 flex-wrap justify-center mb-10">
        {dosenIlkom.map((item) => (
          <CardDosen
            key={item.id}
            nama={item.nama}
            nik={item.nik}
            foto={item.foto}
          />
        ))}
        </div>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-purple-900 mb-5 border-2 px-2 py-1 border-dashed rounded-lg">S2 Sastra Inggris</h1>
        <div className="flex gap-5 flex-wrap justify-center">
        {dosenSasing.map((item) => (
          <CardDosen
            key={item.id}
            nama={item.nama}
            nik={item.nik}
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
    const [identitas, dosenIlkom, dosenSasing] = await Promise.all([
      prisma.identitas.findMany(),
      prisma.dosen.findMany({
        where: { jenis_dosen: "S2 Ilmu Komputer" },
        orderBy: { nama: "asc" },
      }),
      prisma.dosen.findMany({
        where: { jenis_dosen: "S2 Sastra Inggris" },
        orderBy: { nama: "asc" },
      }),
    ]);

    return {
      props: {
        identitas: JSON.parse(JSON.stringify(identitas)),
        dosenIlkom: JSON.parse(JSON.stringify(dosenIlkom)),
        dosenSasing: JSON.parse(JSON.stringify(dosenSasing)),
      },
    };
  } catch (error) {
    console.error("Error fetching dosen:", error);
    return {
      props: {
        identitas: [],
        dosenIlkom: [],
        dosenSasing: [],
      },
    };
  }
};
