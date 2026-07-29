import React from "react";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "@/services/prisma";
import { ContentType, IdentitasType } from "@/types";

interface VisimisiProps {
  content: ContentType[];
  identitas: IdentitasType[];
}

export default function Visimisi({ content, identitas }: VisimisiProps) {
  const misiContent =
    content?.find((item: ContentType) => item.title === "Misi")?.value || "";

  const formattedContent = misiContent
      .split(/(?=\d+\.)/)
  .map(item => item.replace(/^\d+\.\s*/, '').trim())
  .filter(item => item.length > 0);

  return (
    <div className="">
      {/* jumbotron */}
      <div className="relative h-80 md:h-96 lg:h-[35rem] ">
        <Image
          fill
          src="/img/banner-pasca.png"
          alt=""
          className="object-cover"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-10 -mt-9 md:-mt-20 lg:-mt-36 ">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
            Visi Dan Misi
          </h1>
          <h2 className="text-white mt-3">
            Visi dan Misi{" "}
            {identitas?.find((item) => item.name === "Nama Fakultas")?.value}{" "}
            Universitas Bumigora
          </h2>
        </div>
      </div>
      <div className="text-purple-900 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
          Visi dan Misi
        </h1>
      </div>

      {/* main */}
      <main className="px-5 text-justify my-10 md:my-12 md:max-w-xl lg:max-w-4xl m-auto ">
        <div>
          <h1 className="font-bold text-xl md:text-2xl mb-2 text-purple-900">
            Visi
          </h1>
          <p className="text-lg">
            {content?.find((item) => item.title === "Visi")?.value}
          </p>
        </div>
        <div>
          <h1 className="font-bold mt-10 text-xl md:text-2xl mb-2 text-purple-900 whitespace-pre-line">
            Misi
          </h1>
          <ul className="space-y-2 text-lg text-justify list-decimal ml-5 ">
            {formattedContent.map((item, index) => (
               <li key={index}>{item}</li> 
              ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [content, identitas] = await Promise.all([
      prisma.content.findMany(),
      prisma.identitas.findMany(),
    ]);

    return {
      props: {
        content: JSON.parse(JSON.stringify(content)),
        identitas: JSON.parse(JSON.stringify(identitas)),
      },
    };
  } catch (error) {
    console.error("Error fetching visimisi:", error);
    return {
      props: {
        content: [],
        identitas: [],
      },
    };
  }
};
