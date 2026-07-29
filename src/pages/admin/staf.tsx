import AdminLayout from "@/components/layouts/AdminLayout";
import React, { useState, useEffect } from "react";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import FileDropzone from "@/components/admin/elements/FileDropZone";
import axios from "axios";
import Image from "next/image";
import SuccessAlert from "@/components/cards/AlertSucces";
import { StafType } from "@/types";

type DataStaf = {
  nama: string;
  nik: string;
};

export default function Staf() {
  const [isInput, setIsInput] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [dataStaf, setDataStaf] = useState<DataStaf>({
    nama: "",
    nik: "",
  });
  const [datas, setDatas] = useState<StafType[]>([]);

  const handlePost = async () => {
    const data = {
      nama: dataStaf.nama,
      nik: dataStaf.nik,
      file: file,
    };
    try {
      const result = await axios.post("/api/staf", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDatas([...datas, result.data.data]);
      setShowAlert(true);
      setIsInput(false);
      setDataStaf({ nama: "", nik: "" });
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/staf?id=${id}`);
      setDatas(datas.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGet = async () => {
    try {
      const result = await axios.get("/api/staf");
      setDatas(result.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileDrop = (file: File) => {
    setFile(file);
  };

  useEffect(() => {
    handleGet();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl text-gray-600 ">Input Staf</h1>
      <div className="flex gap-5">
        <ButtonPrimary
          ClassName="text-white bg-purple-600 hover:bg-white hover:text-purple-600 hover:border-2 hover:border-purple-600 ease-in-out duration-300 transition-all mt-5"
          onClick={() => setIsInput(!isInput)}
        >
          {isInput ? "Batal" : "Input Dosen"}
        </ButtonPrimary>
        {isInput && (
          <ButtonPrimary
            ClassName="text-white bg-green-600 hover:bg-white hover:text-green-600 hover:border-2 hover:border-green-600 ease-in-out duration-300 transition-all mt-5"
            onClick={() => handlePost()}
          >
            Save
          </ButtonPrimary>
        )}
      </div>
      {isInput && (
        <div className="ease-in-out duration-300 transition-all">
          <FileDropzone onDrop={handleFileDrop} />
          <div className="flex items-center justify-center gap-20 w-full mt-5">
            <div className="flex items-center gap-5 ">
              <label htmlFor="">Nama Staf</label>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setDataStaf({ ...dataStaf, nama: e.target.value })
                }
                className="bg-white p-2 focus:outline-purple-600 rounded-lg outline-purple-100 outline-2 w-80"
              />
            </div>

            <div className="flex items-center gap-5 ">
              <label htmlFor="">NITK</label>
              <input
                type="text"
                onChange={(e) =>
                  setDataStaf({ ...dataStaf, nik: e.target.value })
                }
                className="bg-white p-2 focus:outline-purple-600 rounded-lg outline-purple-100 outline-2"
              />
            </div>
          </div>
        </div>
      )}
      <main>
        <table className="table-fixed border-collapse mt-10  m-auto rounded-2xl">
          <thead className="text-white">
            <tr className="">
              <th className="lg:w-10 py-2 bg-purple-600 rounded-tl-md border-xl border-gray-300 ">
                No
              </th>
              <th className=" lg:w-60 bg-purple-600 border-x border-gray-300 ">
                Nama Staf
              </th>
              <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
                Nik
              </th>
          
              <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
                Foto
              </th>

              <th className=" lg:w-56 bg-purple-600 rounded-tr-md border-gray-300 ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, index) => (
              <tr key={index} className="border-b border-x border-gray-300 text-center">
                <td className="py-2 text-center bg-purple-100">{index + 1}</td>
                <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                  {data?.nama}
                </td>
                <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                  {data?.nitk}
                </td>
      
                <td className="py-2 px-2 border-x border-gray-300 bg-purple-100 flex justify-center ">
                  <Image
                    src={data?.foto || "/profil.png"}
                    alt=""
                    width={104}
                    height={104}
                    className="w-[6.5rem] h-[6.5rem] bg-purple-400 object-cover"
                  />
                </td>
                <td className="bg-purple-100 border-b border-gray-300">
                  <div className="py-2 text-center  flex gap-5 justify-center  ">
                    <ButtonPrimary
                      ClassName="bg-yellow-500 text-white"
                      onClick={() => {}}
                    >
                      Edit
                    </ButtonPrimary>
                    <ButtonPrimary
                      ClassName="bg-red-500 text-white"
                      onClick={() => handleDelete(data?.id)}
                    >
                      Delete
                    </ButtonPrimary>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <SuccessAlert
        show={showAlert}
        onClose={() => setShowAlert(false)}
        message="Data berhasil disimpan ke database!"
        duration={4000} // Opsional: custom duration
      />
    </AdminLayout>
  );
}
