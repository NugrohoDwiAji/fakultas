import AdminLayout from "@/components/layouts/AdminLayout";
import React, { useState, useEffect } from "react";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import FileDropzone from "@/components/admin/elements/FileDropZone";
import axios from "axios";
import Image from "next/image";
import SuccessAlert from "@/components/cards/AlertSucces";
import { DosenType } from "@/types";

type DataDosen = {
  nama: string;
  nik: string;
  jenis_dosen: string;
};

export default function Dosen() {
  const [isInput, setIsInput] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [dataDosen, setDataDosen] = useState<DataDosen>({
    nama: "",
    nik: "",
    jenis_dosen: "",
  });
  const [datas, setDatas] = useState<DosenType[]>([]);

  const handlePost = async () => {
    const data = {
      nama: dataDosen.nama,
      nik: dataDosen.nik,
      jenis_dosen: dataDosen.jenis_dosen,
      file: file,
    };
    try {
      const result = await axios.post("/api/dosen", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDatas([...datas, result.data.data]);
      setShowAlert(true);
      setIsInput(false);
      setDataDosen({ nama: "", nik: "", jenis_dosen: "" });
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/dosen?id=${id}`);
      setDatas(datas.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGet = async () => {
    try {
      const result = await axios.get("/api/dosen");
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
      <h1 className="text-4xl text-gray-600 ">Input Dosen</h1>
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
              <label htmlFor="">Nama Dosen</label>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setDataDosen({ ...dataDosen, nama: e.target.value })
                }
                className="bg-white p-2 focus:outline-purple-600 rounded-lg outline-purple-100 outline-2 w-80"
              />
            </div>

            <div className="flex items-center gap-5 ">
              <label htmlFor="">NIK</label>
              <input
                type="text"
                onChange={(e) =>
                  setDataDosen({ ...dataDosen, nik: e.target.value })
                }
                className="bg-white p-2 focus:outline-purple-600 rounded-lg outline-purple-100 outline-2"
              />
            </div>
            <div className="flex flex-col gap-5">
              <h1>Home Base Dosen</h1>
              <div className="flex gap-5">
                <div>
                  <input
                    onChange={(e) =>
                      setDataDosen({
                        ...dataDosen,
                        jenis_dosen: e.target.value,
                      })
                    }
                    type="radio"
                    name="jenisdosen"
                    id="dosenilkom"
                    value={"S2 Ilmu Komputer"}
                  />
                  <label htmlFor="dosenilkom">S2 Ilmu Komputer</label>
                </div>
                <div>
                  <input
                    onChange={(e) =>
                      setDataDosen({
                        ...dataDosen,
                        jenis_dosen: e.target.value,
                      })
                    }
                    type="radio"
                    name="jenisdosen"
                    id="dosensastrainggris"
                    value={"S2 Sastra Inggris"}
                  />
                  <label htmlFor="dosensastrainggris">S2 Sastra Inggris</label>
                </div>
              </div>
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
                Nama Dosen
              </th>
              <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
                Nik
              </th>
              <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
                Homebase Dosen
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
                  {data?.nik}
                </td>
                <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                  {data?.jenis_dosen}
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
