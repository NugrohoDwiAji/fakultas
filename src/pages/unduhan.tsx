import CardBerkas from "@/components/cards/CardBerkas";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { set } from "date-fns";

type Berkas = {
  id: string;
  title: string;
  filepath: string;
  uploadat: string;
};

type IdentitasType = {
  id: string;
  name: string;
  value: string;
};

export default function Unduhan() {
  const [berkas, setberkas] = useState<Berkas[]>([]);
  const [identitas, setIdentitas] = useState<IdentitasType[] | null>([]);
  const [viewPerPage, setViewPerPage] = useState(5);
  const [itemSearch, setItemSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1)

  const handleGetIdentitas = async () => {
    try {
      const result = await axios.get("/api/identitas");
      setIdentitas(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetIdentitas();
  }, []);

  const handleBerkas = async () => {
    if (itemSearch !== "") {
      try {
        const response = await axios.get(`/api/berkasDetails?name=${itemSearch}`);
        setberkas(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.get("/api/berkas");
        setberkas(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // pagenitation logic
    const totalPages = Math.ceil(berkas.length / viewPerPage);
  const startIndex = (currentPage - 1) * viewPerPage;
  const endIndex = startIndex + viewPerPage;
  const currentData = berkas.slice(startIndex, endIndex);


  useEffect(() => {
    handleBerkas();
    console.log(berkas)
  }, [itemSearch]);

  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 lg:h-[35rem]">
        <img
          src="/img/banner-pasca.png"
          alt=""
          className="w-full bg-cover h-full"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-10 -mt-9 md:-mt-20 lg:-mt-36">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
            Berkas Unduhan
          </h1>
          <h2 className="text-white mt-3">
            Berkas Penting{" "}
            {identitas?.find((item) => item.name === "Nama Fakultas")?.value}{" "}
            Universitas Bumigora
          </h2>
        </div>
      </div>

      <div className="text-purple-900 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">Berkas</h1>
      </div>
      {/* Main */}
      <main className="flex flex-col items-center min-h-64 px-2">
        <div className="w-[900px]">
          {/* stats */}
          <div className="border border-gray-200 w-full h-fit rounded-lg mb-5 p-2 ">
            <div className="flex gap-5 items-center pb-2">
              {/* serach */}
              <input
                type="text"
                onChange={(e) => {
                  handleBerkas();
                  setItemSearch(e.target.value);
                }}
                placeholder="Cari Berkas"
                className="inert:shadow-2xl border border-gray-200 h-10 rounded-lg px-2 outline-0"
              />
              <select
                name=""
                id=""
                className="border border-gray-200 h-10 rounded-lg px-2 outline-0"
                onChange={(e) => setViewPerPage(parseInt(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
            <div className="flex gap-5 items-center border-t border-gray-200 pt-2 text-gray-500 md:justify-between">
              <h1 className="">Jumlah Berkas : {berkas.length}</h1>
              <h1>Halaman {currentPage} : dari {Math.ceil(berkas.length / viewPerPage)}</h1>
            </div>
          </div>

          {/* Table */}
          <table className="md:w-full ">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="px-2 py-4 rounded-tl-lg">No</th>
                <th className="">Nama Berkas</th>
                <th className="px-2 rounded-tr-lg">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.slice(0, viewPerPage).map((item, index) => (
                <tr
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-purple-300 bg-opacity-50"
                  }`}
                >
                  <td className="text-center">{startIndex +index + 1}</td>
                  <td>{item.title}</td>
                  <td className="text-center py-4">
                    <a href={item.filepath}>Unduh</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-full h-16 border rounded-b-lg border-purple-400 mb-10 flex justify-between px-5 items-center gap-2">
            <h1 className="text-gray-600">
              Total Page: {Math.ceil(berkas.length / viewPerPage)}{" "}
            </h1>
            <div className="flex h-full items-center text-purple-700 font-bold">
              <button onClick={() => setCurrentPage(currentPage - 1)}>
              <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.ceil(berkas.length / viewPerPage))].map(
                (_, i) =>{
                   const page = i + 1;
                      if (
                        page === 1 ||
                        page === Math.ceil(berkas.length / viewPerPage) ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-purple-600 text-white"
                                : "text-purple-600 hover:bg-purple-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                }
              )}
              <button onClick={() => setCurrentPage(currentPage + 1)}>
              <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
