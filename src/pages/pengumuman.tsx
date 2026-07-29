import React from "react";
import CardPengumuman from "@/components/cards/CardPengumuman";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { PengumumanType } from "@/types";

interface PengumumanProps {
  dataPengumuman: PengumumanType[];
}

export default function Pengumuman({ dataPengumuman }: PengumumanProps) {
  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 lg:h-[28rem]">
        <Image
          fill
          src="/img/banner-pasca.png"
          alt=""
          className="object-cover"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-950/50 flex flex-col justify-center p-10 ">
          <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold">
            Pengumuman
          </h1>
          <h2 className="text-white mt-3">Pengumuman Fakultas Pascasarjana</h2>
        </div>
      </div>

      {/* Main */}
      <main>
        <h1 className="font-bold text-xl md:text-2xl my-5 text-center ">
          Pengumuman
        </h1>
        <div className="flex flex-wrap justify-center gap-5 items-center mb-5">
          {dataPengumuman.map((item, index) => (
            <CardPengumuman
              key={index}
              file_path={item.file_path}
              title={item.title}
              uploadat={item.uploadat}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const dataPengumuman = await prisma.pengumuman.findMany({
      orderBy: { uploadat: "desc" },
    });

    return {
      props: {
        dataPengumuman: JSON.parse(JSON.stringify(dataPengumuman)),
      },
    };
  } catch (error) {
    console.error("Error fetching pengumuman:", error);
    return {
      props: {
        dataPengumuman: [],
      },
    };
  }
};
