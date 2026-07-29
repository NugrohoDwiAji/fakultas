import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { BeritaType } from "@/types";

interface BeritaDetailProps {
  beritaData: BeritaType | null;
}

export default function BeritaDetail({ beritaData }: BeritaDetailProps) {
  if (!beritaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Berita tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center m-auto lg:w-[800px] p-5 lg:0-0">
      <Image
        src={beritaData.filepath || "/img/placeholder.png"}
        alt="Eror"
        width={800}
        height={448}
        className="w-full h-[28rem] bg-gray-300 mt-20 mb-5 object-cover"
      />
      <main>
        <h1 className="text-4xl font-bold mb-2">{beritaData.title}</h1>
        <h2 className="text-gray-600">
          {beritaData.uploudat
            ? format(new Date(beritaData.uploudat), "yyyy-MM-dd")
            : " "}
        </h2>
        <p className="text-gray-700 text-justify indent-16 mt-7 mb-16">
          {beritaData.description}
        </p>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.params?.beritaDetail as string;

    if (!id) {
      return {
        props: {
          beritaData: null,
        },
      };
    }

    const beritaData = await prisma.berita.findUnique({
      where: { id },
    });

    return {
      props: {
        beritaData: beritaData ? JSON.parse(JSON.stringify(beritaData)) : null,
      },
    };
  } catch (error) {
    console.error("Error fetching berita detail:", error);
    return {
      props: {
        beritaData: null,
      },
    };
  }
};
