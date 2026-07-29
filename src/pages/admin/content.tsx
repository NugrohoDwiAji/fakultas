import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import ModalEdit from "@/components/admin/ModalEdit";
import axios from "axios";
import SuccessAlert from "@/components/cards/AlertSucces";
import { ContentType } from "@/types";

export default function Content() {
  const [isEdit, setisEdit] = useState(false);
  const [data, setData] = useState<ContentType[]>([]);
  const [detailData, setdetailData] = useState<ContentType | null>(null)
  const [showAlert, setShowAlert] = useState(false);

const handleEdit = async (id: string) =>{
  setisEdit(true);
  try {
    const result = await axios.get(`/api/contentDetails?id=${id}`);
    setdetailData(result.data.data);
   
  } catch (error) {
    console.log(error);
  }
}

const handleSave = (updatedItem: ContentType) => {
  setData(data.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  setisEdit(false);
  setShowAlert(true);
}




  const handleGetItem = async () => {
    try {
      const result = await axios.get("/api/content");
      setData(result.data.data || []);
      console.log(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetItem();
  }, []);



  return (
    <AdminLayout>
      <h1 className="text-4xl text-gray-600 ">Content</h1>
      <table className="table-fixed border-collapse mt-10  m-auto rounded-2xl">
        <thead className="text-white">
          <tr className="">
            <th className="lg:w-10 py-2 bg-purple-600 rounded-tl-md border-xl border-gray-300 ">
              No
            </th>
            <th className=" lg:w-60 bg-purple-600 border-x border-gray-300 ">
              Title
            </th>
            <th className=" lg:w-2xl bg-purple-600 border-x border-gray-300 ">
              Description
            </th>
            <th className=" lg:w-56 bg-purple-600 rounded-tr-md border-gray-300 ">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="border-b border-x border-gray-300">
              <td className="py-2 text-center bg-purple-100">{index + 1}</td>
              <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                {item?.title}
              </td>
              <td className="py-2 px-2 border-x border-gray-300 bg-purple-100">
                {item?.value}
              </td>
              <td className="py-2 text-center bg-purple-100">
                <ButtonPrimary
                  ClassName="bg-yellow-500 text-white"
                  onClick={() => handleEdit(item?.id)}
                >
                  Edit
                </ButtonPrimary>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="absolute top-0 left-64 right-0">
        {isEdit && (
          <ModalEdit
          id={detailData?.id || ""}
            onClose={() => setisEdit(!isEdit)}
            onSave={handleSave}
            title={detailData?.title || ""}  
            defaultValue={detailData?.value || ""}
          />
        )}
      </div>
        
      <SuccessAlert 
        show={showAlert} 
        onClose={() => setShowAlert(false)}
        message="Data berhasil disimpan ke database!"
        duration={4000} // Opsional: custom duration
      />
    </AdminLayout>
  );
}
