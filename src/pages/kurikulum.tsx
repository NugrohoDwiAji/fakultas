import React from 'react'
import Image from 'next/image'

export default function Kurikulum() {
  return (
   <div className='min-h-screen'>
      <div className="relative h-80 md:h-96 lg:h-[28rem]">
        <Image fill src="/img/bg-kampus.jpg" alt="" className="object-cover" />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-950/50 flex flex-col justify-center p-10 ">
          <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold">
            Kurikulum
          </h1>
          <h2 className="text-white mt-3">
           Kurikulum Fakultas {" "}
          </h2>
        </div>
      </div>

      {/* Main */}
      <main>

      <h1 className="font-bold text-xl md:text-2xl my-5 text-center min-h-64">Kurikulum</h1>
      </main>
    </div>
  )
}
