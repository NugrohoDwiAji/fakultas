import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import Image from "next/image";

type BeritaType = {
  id: string;
  title: string;
  description: string;
  filepath: string;
  uploudat: string;
};

export default function BeritaDetail() {
  const [beritaData, setBeritaData] = useState<BeritaType | null>(null);
  const router = useRouter();

  const getDataBerita = useCallback(async () => {
    if (router.isReady) {
      const id = router.query.beritaDetail as string;
      try {
        const response = await axios.get(`/api/beritaDetails?id=${id}`);

        setBeritaData(response.data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    }
  }, [router]);

  useEffect(() => {
    getDataBerita();
  }, [getDataBerita]);

  return (
    <div className="min-h-screen flex flex-col items-center m-auto lg:w-[800px] p-5 lg:0-0">
      <Image
        src={beritaData?.filepath || "/img/placeholder.png"}
        alt="Eror"
        width={800}
        height={448}
        className="w-full h-[28rem] bg-gray-300 mt-20 mb-5 object-cover"
      />
      <main>
        <h1 className="text-4xl font-bold mb-2">{beritaData?.title}</h1>
        <h2 className="text-gray-600">  {beritaData?.uploudat
    ? format(new Date(beritaData.uploudat), "yyyy-MM-dd")
    : " "}</h2>
        <p className="text-gray-700 text-justify indent-16 mt-7 mb-16">{beritaData?.description}</p>
      </main>
    </div>
  );
}
