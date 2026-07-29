import AdminLayout from "@/components/layouts/AdminLayout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import SuccessAlert from "@/components/cards/AlertSucces";
import { ProdiType } from "@/types";

export default function Prodi() {
  const [prodi, setProdi] = useState<ProdiType[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleGetProdi = async () => {
    try {
      const result = await axios.get("/api/prodi");
      setProdi(result.data.data || []);
    } catch (error) {
      console.log(error, "eror");
    }
  };

  const handleUpdate = async ({ id, nama, link, visi, misi }: ProdiType) => {
    const data = {
      nama: nama,
      link: link,
      visi: visi,
      misi: misi,
    };
    try {
      const result = await axios.put(`/api/prodi?id=${id}`, data);
      setProdi(prodi.map((item) => (item.id === id ? result.data.data : item)));
      setShowAlert(true);
      setIsEdit(false);
    } catch (error) {
      console.log("eror", error);
    }
  };

  useEffect(() => {
    handleGetProdi();
  }, []);

  return (
    <AdminLayout>
      <h1>Prodi</h1>
      <form action="" className="flex flex-col gap-3  ">
        {prodi.map((item, index) => (
          <div key={index} className="flex flex-col gap-3">
            <label
              htmlFor=""
              className="py-2 px-10 border rounded-md text-white bg-purple-600 font-bold w-fit outline-0"
              key={index}
            >
              {item.nama}
            </label>
            <div className="flex gap-5">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor=""
                  className="py-2 px-10 border rounded-md text-purple-800 font-bold w-fit "
                  key={index}
                >
                  Visi
                </label>
                <textarea
                  value={item.visi}
                  onChange={(e) =>
                    setProdi(
                      prodi.map((data) =>
                        data.id === item.id
                          ? { ...data, visi: e.target.value }
                          : data
                      )
                    )
                  }
                  readOnly={!isEdit}
                  className={` h-32 w-96 border p-2 border-purple-600 focus:ring-purple-600 inert:ring-purple-600 outline-0 ${isEdit ? "bg-white" : "bg-gray-200"} `}
                  placeholder="Silahakan Masukkan Value di Sini..."
                />
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor=""
                  className="py-2 px-10 border rounded-md text-purple-800 font-bold w-fit"
                  key={index}
                >
                  Misi
                </label>
                <textarea
                  value={item.misi}
                  onChange={(e) =>
                    setProdi(
                      prodi.map((data) =>
                        data.id === item.id
                          ? { ...data, misi: e.target.value }
                          : data
                      )
                    )
                  }
                  readOnly={!isEdit}
                  className={` h-32 w-96 border p-2 border-purple-600 focus:ring-purple-600 inert:ring-purple-600 outline-0 ${isEdit ? "bg-white" : "bg-gray-200"} `}
                  placeholder="Silahakan Masukkan Value di Sini..."
                />
              </div>
              <div className="flex flex-col justify-center ">
                {isEdit || (
                  <ButtonPrimary
                  onClick={() => setIsEdit(!isEdit)}
                  ClassName="bg-purple-600 h-fit text-white hover:bg-white hover:text-purple-600 hover:border-2 hover:border-purple-600 ease-in-out duration-300 transition-all mb-5 mt-5"
                >
                  Edit
                </ButtonPrimary>
                )}
                
                {isEdit && (
                  <div className="flex flex-col">
                    <ButtonPrimary
                      ClassName="bg-green-600 h-fit text-white hover:bg-white hover:text-purple-600 hover:border-2 hover:border-purple-600 ease-in-out duration-300 transition-all mb-5 mt-5"
                      onClick={() => handleUpdate(item)}
                    >
                      Simpan
                    </ButtonPrimary>

                    <ButtonPrimary
                      ClassName="bg-red-600 h-fit text-white hover:bg-white hover:text-red-600 hover:border-2 hover:border-red-600 ease-in-out duration-300 transition-all mb-5 mt-5"
                      onClick={() => setIsEdit(false)}
                    >
                      Cancel
                    </ButtonPrimary>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </form>
      <SuccessAlert
        onClose={() => setShowAlert(false)}
        duration={2000}
        message="Data Berhasil Diupdate"
        show={showAlert}
      />
    </AdminLayout>
  );
}
