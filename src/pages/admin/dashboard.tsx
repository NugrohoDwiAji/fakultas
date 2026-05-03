import { useState, useEffect } from "react";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import AdminLayout from "@/components/layouts/AdminLayout";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import Prodis from "@/components/datas/Prodi.json";
import FileDropzone from "@/components/admin/elements/FileDropZone";
import axios from "axios";
import SuccessAlert from "@/components/cards/AlertSucces";

type VisitData = {
  data: { date: string; count: number }[];
  date: string;
  count: number;
};

type Identitas = {
  id: string;
  name: string;
  value: string;
};

interface Prodi {
  nama: string;
  link: string;
  visi:string;
  misi:string
}

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async () => {
  const results = await prisma.$queryRaw<VisitData[]>`
    SELECT DATE(visited_at) as date, COUNT(*) as count FROM Visit GROUP BY DATE(visited_at) ORDER BY date DESC LIMIT 14`;
  const data = results
    .map((item) => ({
      date: format(new Date(item.date), "yyyy-MM-dd"),
      count: Number(item.count),
    }))
    .reverse(); // supaya urutan tanggal naik

  return { props: { data } };
};

export default function Dashboard({ data }: VisitData) {
  const [canEdit, setcanEdit] = useState(false);
  const [datas, setDatas] = useState<Identitas[]>([]);
  const [organisasiImg, setOrganisasiImg] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [prodi, setProdi] = useState<Prodi[]>([]);
  // State untuk menyimpan prodi yang dipilih
  const [selectedProdi, setSelectedProdi] = useState<Prodi[]>([]);
  const [dataUpdate, setDataUpdate] = useState([
    {
      name: "Nama Fakultas",
      value: "",
    },
    {
      name: "Banyak Program Studi",
      value: "",
    },
    {
      name: "Banyak Dosen",
      value: "",
    },
    {
      name: "Banyak Staf",
      value: "",
    },
    {
      name: "No Handphone",
      value: "",
    },
    {
      name: "Email",
      value: "",
    },
    {
      name: "Instagram",
      value: "",
    },
    {
      name: "Facebook",
      value: "",
    },
    {
      name: "Youtube",
      value: "",
    },
  ]);

  const handleOndrop = (file: File) => {
    setOrganisasiImg(file);
  };
  const handlePushOrganisasi = async () => {
    const data = {
      file: organisasiImg,
    };
    try {
      await axios.put("/api/strukturorganisasi", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowAlert(true);
    } catch (error) {
      console.log(error, "eror");
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedOptions: Prodi[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        const selectedProdi = Prodis.find(
          (item) => item.id.toString() === options[i].value
        );
        if (selectedProdi) {
          const pushData = {
            nama: selectedProdi.name,
            link: selectedProdi.Link,
            visi:"",
            misi:""
          };
          selectedOptions.push(pushData);
        }
      }
    }

    setSelectedProdi(selectedOptions);
  };

  const handleSaveProdi = async () => {
    
    try {
      await axios.post("/api/prodi", selectedProdi);
      setShowAlert(true);
    } catch (error) {
      console.log(error, "eror");
    }
  };

  const handleChangeData = (name: string, newValue: string) => {
    setDataUpdate((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, value: newValue } : item
      )
    );
  };
  const handleGetData = async () => {
    try {
      const result = await axios.get("/api/identitas");
      setDatas(result.data);
    } catch (error) {
      console.log(error, "eror");
    }
  };

  const handleUpdateProfil = async () => {
    try {
      const finalData = datas.map((item) => {
        const updatedItem = dataUpdate.find((d) => d.name === item.name);
        return {
          name: item.name,
          value: updatedItem?.value || item.value, // pakai value lama jika tidak diubah
        };
      });

      await axios.put("/api/identitasDetails", finalData);
      setShowAlert(true);
    } catch (error) {
      console.log(error, "eror");
    }
  };
  const handleClearProdi = async () => {
    try {
      await axios.delete("/api/prodi");
      setShowAlert(true);
    }catch (error) {
      console.log(error, "eror");
    }
  }

  const handleGetProdi = async () => {
    try {
      const result = await axios.get("/api/prodi");
      setProdi(result.data);
      
    } catch (error) {
      console.log(error, "eror");
    }
  };

  useEffect(() => {
    handleGetData();
    handleGetProdi();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl text-gray-600 ">Dashboard</h1>
      <h2 className="text-2xl text-gray-600 mt-5 mb-2">Profil Fakultas</h2>
      <ButtonPrimary
        ClassName={`mb-5 text-white hover:bg-white ${
          canEdit
            ? "hover:text-red-600 hover:border-2 hover:border-red-600 bg-red-600"
            : " hover:text-purple-600 hover:border-2 hover:border-purple-600 bg-purple-600"
        }`}
        onClick={() => setcanEdit(!canEdit)}
      >
        {canEdit ? "Batal" : "Edit"}
      </ButtonPrimary>
      <form className="">
        <div className="flex justify-between">
          <div className="w-[40%] flex flex-col gap-5 ">
            <div className="flex gap-2 items-center  ">
              <label htmlFor="" className="w-44  ">
                Nama Fakultas
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate?.find((item) => item.name === "Nama Fakultas")
                    ?.value ||
                  datas.find((item) => item.name === "Nama Fakultas")?.value
                }
                onChange={(e) =>
                  handleChangeData("Nama Fakultas", e.target.value)
                }
                type="text"
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100 w-60"
              />
            </div>
            <div className="flex gap-2 items-center ">
              <label htmlFor="" className="w-44 ">
                Banyak Program Studi
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find(
                    (item) => item.name === "Banyak Program Studi"
                  )?.value ||
                  datas.find((item) => item.name === "Banyak Program Studi")
                    ?.value
                }
                onChange={(e) =>
                  handleChangeData("Banyak Program Studi", e.target.value)
                }
                type="number"
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100 w-14"
              />
            </div>
            <div className="flex gap-2 items-center ">
              <label htmlFor=" " className="w-44 ">
                Banyak Dosen
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find((item) => item.name === "Banyak Dosen")
                    ?.value ||
                  datas.find((item) => item.name === "Banyak Dosen")?.value
                }
                onChange={(e) =>
                  handleChangeData("Banyak Dosen", e.target.value)
                }
                type="number"
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100 w-14"
              />
            </div>
            <div className="flex gap-2 items-center  ">
              <label htmlFor="" className="w-44 ">
                Banyak Staf
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find((item) => item.name === "Banyak Staf")
                    ?.value ||
                  datas.find((item) => item.name === "Banyak Staf")?.value
                }
                type="number"
                onChange={(e) =>
                  handleChangeData("Banyak Staf", e.target.value)
                }
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100 w-14"
              />
            </div>
          </div>
          <div className="w-[40%] flex flex-col gap-5 ">
            <div className="flex gap-2 items-center ">
              <label htmlFor="" className=" w-44">
                No Handphone
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find((item) => item.name === "No Handphone")
                    ?.value ||
                  datas.find((item) => item.name === "No Handphone")?.value
                }
                type="text"
                onChange={(e) =>
                  handleChangeData("No Handphone", e.target.value)
                }
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100"
              />
            </div>
            <div className="flex gap-2 items-cente ">
              <label htmlFor="" className="w-44 ">
                Email
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find((item) => item.name === "Email")?.value ||
                  datas.find((item) => item.name === "Email")?.value
                }
                type="email"
                onChange={(e) => handleChangeData("Email", e.target.value)}
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100"
              />
            </div>
            <div className="flex gap-2 items-cente ">
              <label htmlFor="" className="w-44 ">
                Instagram
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find((item) => item.name === "Instagram")?.value ||
                  datas.find((item) => item.name === "Instagram")?.value
                }
                onChange={(e) => handleChangeData("Instagram", e.target.value)}
                type="text"
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100"
              />
            </div>
            <div className="flex gap-2 items-cente ">
              <label htmlFor="" className="w-44 ">
                Facebook
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find((item) => item.name === "Facebook")?.value ||
                  datas.find((item) => item.name === "Facebook")?.value
                }
                onChange={(e) => handleChangeData("Facebook", e.target.value)}
                type="text"
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100"
              />
            </div>
            <div className="flex gap-2 items-cente ">
              <label htmlFor="" className="w-44 ">
                Youtube
              </label>
              <input
                readOnly={!canEdit}
                value={
                  dataUpdate.find((item) => item.name === "Youtube")?.value ||
                  datas.find((item) => item.name === "Youtube")?.value
                }
                onChange={(e) => handleChangeData("Youtube", e.target.value)}
                type="text"
                className="bg-white p-2 rounded-lg focus:outline-purple-500 outline-2 outline-purple-100"
              />
            </div>
          </div>
        </div>
        {canEdit && (
          <ButtonPrimary
            ClassName="bg-purple-600 text-white hover:bg-white hover:text-purple-600 hover:border-2 hover:border-purple-600 ease-in-out duration-300 transition-all mt-10 mb-5"
            onClick={() => handleUpdateProfil()}
          >
            Simpan Profil
          </ButtonPrimary>
        )}

        <div className="flex flex-col gap-2 ">
          <label className="block mb-2">Pilih Prodi</label>
          <select
            id="prodi"
            multiple
            disabled={!canEdit}
            size={6}
            onChange={handleSelectChange}
            className="mt-1 block w-1/4 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {Prodis.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <h2>Daftar Prodi yang Dipilih:</h2>
            <ul className="mt-2 pl-5 list-disc">
              {selectedProdi.length > 0
                ? selectedProdi.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.nama}
                    </li>
                  ))
                : prodi.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.nama}
                    </li>
                  ))}
            </ul>
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-5">
          <ButtonPrimary
            ClassName="bg-purple-600 text-white hover:bg-white hover:text-purple-600 hover:border-2 hover:border-purple-600 ease-in-out duration-300 transition-all mb-5 mt-5"
            onClick={() => handleSaveProdi()}
          >
            Simpan Prodi
          </ButtonPrimary>
          <ButtonPrimary
            ClassName="bg-red-600 text-white hover:bg-white hover:text-red-600 hover:border-2 hover:border-red-600 ease-in-out duration-300 transition-all mb-5 mt-5"
            onClick={() => handleClearProdi()}
          >
            Clear Prodi
          </ButtonPrimary>
          </div>
        )}
        <div className=" mt-10">
          <h1>Struktur Organisasi</h1>
          {canEdit ? (
            <FileDropzone onDrop={handleOndrop} />
          ) : (
            <div className="relative h-72 w-72 bg-white rounded-lg flex items-center justify-center">
              <Image
                src={
                  datas.find((item) => item.name === "Struktur Organisasi")
                    ?.value || "/img/placeholder.png"
                }
                alt="Image"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
        {canEdit && (
          <div className="flex flex-col ">
            <ButtonPrimary
              ClassName="bg-purple-600 text-white hover:bg-white hover:text-purple-600 hover:border-2 hover:border-purple-600 ease-in-out duration-300 transition-all mt-5"
              onClick={() => handlePushOrganisasi()}
            >
              Simpan Struktur Organisasi
            </ButtonPrimary>
            <ButtonPrimary
              ClassName="bg-green-600 text-white hover:bg-white hover:text-green-600 hover:border-2 hover:border-green-600 ease-in-out duration-300 transition-all mt-5"
              onClick={() => {
                setShowAlert(true);
                window.location.reload();
              }}
            >
              Simpan Data
            </ButtonPrimary>
          </div>
        )}
      </form>
      {/* Grafik Kunjungan */}
      <div className="bg-white rounded-xl mt-10 ">
        <h1 className="bg-purple-200 p-5 rounded-t-xl text-purple-500 font-bold">
          Grafik Kunjungan
        </h1>
        <div className="pr-10 py-10 ">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#9810fa"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <SuccessAlert
          show={showAlert}
          onClose={() => setShowAlert(false)}
          message="Data berhasil di ubah...!"
          duration={4000} // Opsional: custom duration
        />
      </div>
    </AdminLayout>
  );
}
