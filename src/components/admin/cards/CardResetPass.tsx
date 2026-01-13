'use client'

import axios from "axios"
import { Cross } from "lucide-react"
import { useState } from "react"

type Props = {
    onClick: () => void

}

type FormData = {
    passOld: string;
    passNew: string;
}



export default function CardResetPass({ onClick }: Props) {
    const [dataRes, setDataRes] = useState<FormData>({
        passOld: "",
        passNew: ""
    })
    const [message, setMessage] = useState<string>("");
    const handleReset = async () => {
        try {
            await axios.put("/api/resetPass", dataRes).then(
                (res) => {
                    setMessage(res.data.message);
                }
            );
            setTimeout(() => {
               window.location.reload(); 
            },3000)
        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
            window.location.reload();

        }
    }
    return (
        <>
            {!message ? (
                <div className='bg-white w-md px-10 pb-10 py-5 rounded-lg relative'>
                    <button type="button" onClick={onClick} className='absolute right-5 top-5 cursor-pointer'>
                        <Cross color="#9810fa" className="rotate-45 cursor-pointer " />
                    </button>
                    <h1 className='text-center font-bold text-gray-800 text-lg mb-5'>Reset Password</h1>
                    <form className='flex flex-col'>
                        <label htmlFor="oldpass">Enter Old Password</label>
                        <input type="password" name="oldpass" id="oldpass" value={dataRes.passOld} onChange={(e) => setDataRes({ ...dataRes, passOld: e.target.value })} className='p-1 mb-5 outline-none ring-2 ring-purple-300 rounded-md focus:ring-purple-600 mt-2 ' />
                        <label htmlFor="respass">Enter New Password</label>
                        <input type="password" name="respass" id="respass" value={dataRes.passNew} onChange={(e) => setDataRes({ ...dataRes, passNew: e.target.value })} className='p-1 outline-none ring-2 ring-purple-300 rounded-md focus:ring-purple-600 mt-2 ' />
                        <button type="button" onClick={handleReset} className='bg-blue-600 rounded py-2 text-white mt-5 cursor-pointer hover:scale-105 hover:shadow-lg ease-in-out duration-300 transition-all'>Submit</button>
                    </form>
                </div>
            ) : (
                <div>
<h1 className="text-2xl">{message}</h1>
                </div>
            )}
        </>
    )

}
