import React from "react";
import CardBerita from "@/components/cards/CardBerita";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { BeritaType } from "@/types";

interface BeritaProps {
  dataBerita: BeritaType[];
}

export default function Berita({ dataBerita }: BeritaProps) {
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
            Berita
          </h1>
          <h2 className="text-white mt-3">Berita Fakultas Pascasarjana</h2>
        </div>
      </div>

      {/* Main */}
      <main>
        <h1 className="font-bold text-xl md:text-2xl my-5 text-center ">
          Berita
        </h1>

        <div className="flex flex-wrap gap-5 justify-center">
          {dataBerita.map((item, index) => (
            <div key={index} className="my-4">
              <CardBerita
                key={index}
                img={item.filepath}
                content={item.description}
                title={item.title}
                date={item.uploudat}
                id={item.id}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const dataBerita = await prisma.berita.findMany({
      orderBy: { uploudat: "desc" },
    });

    return {
      props: {
        dataBerita: JSON.parse(JSON.stringify(dataBerita)),
      },
    };
  } catch (error) {
    console.error("Error fetching berita:", error);
    return {
      props: {
        dataBerita: [],
      },
    };
  }
};
