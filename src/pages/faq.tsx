import React from "react";
import CardFaq from "@/components/cards/CardFaq";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { IdentitasType, FaqType } from "@/types";

interface FaqProps {
  identitas: IdentitasType[];
  dataFaq: FaqType[];
}

const Faq = ({ identitas, dataFaq }: FaqProps) => {
    return (
      <div className="min-h-screen">
        <div className="relative h-80 md:h-96 lg:h-[35rem]">
          <Image
            fill
            src="/img/banner-pasca.png"
            alt=""
            className="object-cover"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-10 -mt-9 md:-mt-20 lg:-mt-36">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
              Frequently Asked Questions
            </h1>
            <h2 className="text-white mt-3">
              FAQ
              {identitas?.find((item) => item.name === "Nama Fakultas")?.value}{" "}
              Universitas Bumigora
            </h2>
          </div>
        </div>
  
        <div className="text-purple-900 text-center mt-10 ">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">FAQ</h1>
        </div>
        {/* Main */}
        <main className="flex flex-col items-center min-h-64">
          <div className="flex gap-5 flex-wrap justify-center lg:p-10 p-5">
            {dataFaq.map((item) => (
              <CardFaq key={item.id} question={item.question} answer={item.answer} />
            ))}
          </div>
        </main>
      </div>
    );
}

export default Faq

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [identitas, dataFaq] = await Promise.all([
      prisma.identitas.findMany(),
      prisma.faq.findMany({
        orderBy: { created_at: "desc" },
      }),
    ]);

    return {
      props: {
        identitas: JSON.parse(JSON.stringify(identitas)),
        dataFaq: JSON.parse(JSON.stringify(dataFaq)),
      },
    };
  } catch (error) {
    console.error("Error fetching faq:", error);
    return {
      props: {
        identitas: [],
        dataFaq: [],
      },
    };
  }
};
