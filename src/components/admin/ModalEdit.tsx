import React, { useState, useEffect } from "react";
import ButtonPrimary from "../elements/ButtonPrimary";
import axios from "axios";

type ModalEditProps = {
  onClose: () => void;
  title: string;
  onSave: () => void;
  defaultValue: string;
  id: string;
};

export default function ModalEdit({
  onClose,
  title,
  defaultValue,
  id,
}: ModalEditProps) {
  const [value, setValue] = useState("");

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/contentDetails?id=${id}`, {
        title: title,
        value: value,
      });
      document.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-700/50">
      <div className="bg-white p-5 w-[30rem] rounded-xl">
        <h1 className="text-2xl font-bold text-center">Edit Data</h1>
        <form action="" className="flex flex-col gap-3 mt-7">
          <div className="flex justify-between">
            <label htmlFor="title">Title</label>
            <h1
              id="title"
              className="py-2 px-10 border rounded-md text-white bg-purple-600 font-bold"
            >
              {title || "Title"}
            </h1>
          </div>
          <div className="flex justify-between">
            <label htmlFor="value">Value</label>
            <textarea
              className="bg-white h-32 w-96 border p-2 border-purple-600 focus:ring-purple-600 inert:ring-purple-600"
              value={value}
              placeholder="Silahakan Masukkan Value di Sini..."
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </form>
        <div className="mt-10 flex justify-end gap-3">
          <ButtonPrimary ClassName="bg-yellow-500 text-white" onClick={onClose}>
            Cancel
          </ButtonPrimary>
          <ButtonPrimary
            ClassName="bg-green-600 text-white"
            onClick={() => {
              handleUpdate();
              onClose();
            }}
          >
            Save
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
