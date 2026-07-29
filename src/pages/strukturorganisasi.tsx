
import React from "react";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { IdentitasType } from "@/types";

interface StrukturOrganisasiProps {
  identitas: IdentitasType[];
}

export default function StrukturOrganisasi({ identitas }: StrukturOrganisasiProps) {
  return (
    <div>
      {/* jumbotron */}
      <div className="relative h-80 md:h-96 lg:h-[35rem]">
        <Image fill src="/img/banner-pasca.png" alt="" className="object-cover" />
       <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-10 -mt-9 md:-mt-20 lg:-mt-36 ">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
            Struktur Organisasi
          </h1>
          <h2 className="text-white mt-3">
            Struktur Organisasi {identitas?.find((item) => item.name === "Nama Fakultas")?.value} Universitas Bumigora
          </h2>
        </div>
      </div>
 <div className="text-purple-900 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
          Struktur Organisasi
        </h1>
    
      </div>
      {/* Main */}
      <main className="flex flex-col items-center pb-10 min-h-64 mt-10">
    
      <Image src={identitas?.find((item) => item.name === "Struktur Organisasi")?.value || "/img/placeholder.png"} alt="Struktur Organisasi" width={1000} height={1000} />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const identitas = await prisma.identitas.findMany();

    return {
      props: {
        identitas: JSON.parse(JSON.stringify(identitas)),
      },
    };
  } catch (error) {
    console.error("Error fetching struktur organisasi:", error);
    return {
      props: {
        identitas: [],
      },
    };
  }
};
