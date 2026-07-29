import AdminLayout from "@/components/layouts/AdminLayout";
import React, { useState, useEffect } from "react";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import FileDropzone from "@/components/admin/elements/FileDropZone";
import axios from "axios";
import { format } from "date-fns";
import SuccessAlert from "@/components/cards/AlertSucces";
import { BeritaType } from "@/types";

type PushData = {
  title: string;
  description: string;
  tanggal:Date;
};

export default function Berita() {
  const [isInput, setIsInput] = useState(false);
  const [dataBerita, setDataBerita] = useState<BeritaType[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [pushData, setPushData] = useState({
    title: "",
    description: "",
    tanggal: new Date(),
  });
  const [file, setFile] = useState<File | null>(null);

  const handleGetBerita = async () => {
    try {
      const result = await axios.get("/api/berita");
      setDataBerita(result.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostBerita = async () => {
    const data = {
      title: pushData.title,
      description: pushData.description,
      file: file,
      tanggal: pushData.tanggal,
    };
    try {
      const result = await axios.post("/api/berita", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDataBerita([...dataBerita, result.data.data]);
      setShowAlert(true);
      setIsInput(false);
      setPushData({ title: "", description: "", tanggal: new Date() });
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBerita = async (id: string) => {
    try {
      await axios.delete(`/api/beritaDetails?id=${id}`);
      setDataBerita(dataBerita.filter((item) => item.id !== id));
      setShowAlert(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileDrop = (file: File) => {
    setFile(file);
    console.log(file);
  };
  useEffect(() => {
    handleGetBerita();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl text-gray-600 ">Berita</h1>
      <div className="flex gap-5">
        <ButtonPrimary
          ClassName="text-white bg-purple-600 hover:bg-white hover:text-purple-600 hover:border-2 hover:border-purple-600 ease-in-out duration-300 transition-all mt-5"
          onClick={() => setIsInput(!isInput)}
        >
          {isInput ? "Batal" : "Input Berita"}
        </ButtonPrimary>
        {isInput && (
          <ButtonPrimary
            ClassName="text-white bg-green-600 hover:bg-white hover:text-green-600 hover:border-2 hover:border-green-600 ease-in-out duration-300 transition-all mt-5"
            onClick={() => handlePostBerita()}
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
              <label htmlFor="">Judul Berita</label>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setPushData({ ...pushData, title: e.target.value })
                }
                className="bg-white p-2 focus:outline-purple-600 rounded-lg outline-purple-100 outline-2"
              />
            </div>
            <div className="flex items-center gap-5 ">
              <label htmlFor="">Deskripsi</label>
              <textarea
                name=""
                id=""
                onChange={(e) =>
                  setPushData({ ...pushData, description: e.target.value })
                }
                className="bg-white h-40 p-2 focus:outline-purple-600 rounded-lg outline-purple-100 outline-2 w-96 "
              ></textarea>
            </div>
            <div className="flex items-center gap-5 ">
              <label htmlFor="" >Tanggal</label>
              <input type="date" onChange={(e) => setPushData({ ...pushData, tanggal:new Date(e.target.value)})} className="bg-white p-2 focus:outline-purple-600 rounded-lg outline-purple-100 outline-2" />
            </div>
          </div>
        </div>
      )}

      <table className="table-fixed border-collapse mt-10  m-auto rounded-2xl">
        <thead className="text-white">
          <tr className="">
            <th className="lg:w-10 py-2 bg-purple-600 rounded-tl-md border-xl border-gray-300 ">
              No
            </th>
            <th className=" lg:w-60 bg-purple-600 border-x border-gray-300 ">
              Judul Berita
            </th>
            <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
              Deskripsi
            </th>
            <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
              Gambar
            </th>
            <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
              Tanggal Upload
            </th>
            <th className=" lg:w-56 bg-purple-600 rounded-tr-md border-gray-300 ">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {dataBerita.map((item, index) => (
            <tr key={index} className="border-b border-x border-gray-300">
              <td className="py-2 text-center bg-purple-100">{index + 1}</td>
              <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                {item.title}
              </td>
              <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                {item.description}
              </td>
              <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                {item.filepath}
              </td>
              <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                {
                  (item.uploudat = format(
                    new Date(item.uploudat),
                    "yyyy-MM-dd"
                  ))
                }
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
                    onClick={() => handleDeleteBerita(item.id)}
                  >
                    Delete
                  </ButtonPrimary>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SuccessAlert
        show={showAlert}
        onClose={() => setShowAlert(false)}
        message="Data berhasil disimpan ke database!"
        duration={4000} // Opsional: custom duration
      />
    </AdminLayout>
  );
}
