import React from "react";
import { useState, useEffect } from "react";
import { AlignRight, ArrowRightFromLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classnames from "classnames";
import axios from "axios";
import Image from "next/image";

type IdentitasType = {
  id: string;
  name: string;
  value: string;
};
type Props = {
  isScroll: boolean;
};
type ProdiType = {
  id: string;
  nama: string;
  link: string;
};

// Tipe yang diinginkan setelah transformasi
type TransformedProdiType = {
  id: string;
  name: string;
  url: string;
};

export default function Header({ isScroll }: Props) {
  const [isActive, setIsActive] = useState(false);
  const [subActive, setsubActive] = useState<string | null>(null);
  const currentPath = usePathname();
  const [identitas, setIdentitas] = useState<IdentitasType[] | null>([]);
  const [prodi, setProdi] = useState<TransformedProdiType[] | null>([]);

  const handleGetProdi = async () => {
    try {
      const result = await axios.get<ProdiType[]>("/api/prodi");
      const transformedData: TransformedProdiType[] = result.data.map(
        (item) => ({
          id: item.id,
          name: item.nama, // Mengubah 'nama' menjadi 'name'
          url: item.link, // Mengubah 'link' menjadi 'url'
        })
      );
      setProdi(transformedData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetIdentitas = async () => {
    try {
      const result = await axios.get("/api/identitas");
      setIdentitas(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleSubMenu = (submenu: string | null) => {
    setsubActive(subActive === submenu ? null : submenu);
  };

  const menu = [
    {
      id: 1,
      name: "Home",
      url: "/",
      action: () => {},
      subMenu: [],
    },
    {
      id: 2,
      name: "Profil",
      url: "",
      action: () => {
        toggleSubMenu("Profil");
      },
      subMenu: [
        {
          id: 21,
          name: "Visi dan Misi",
          url: "/visimisi",
        },
        {
          id: 22,
          name: "Struktur Organisasi",
          url: "/strukturorganisasi",
        },
        {
          id: 23,
          name: "Dosen",
          url: "/dosen",
        },
        {
          id: 24,
          name: "Staf",
          url: "/staf",
        },
      ],
    },
    {
      id: 4,
      name: "Program Studi",
      url: "",
      action: () => {
        toggleSubMenu("Program Studi");
      },
      subMenu: prodi,
    },
    {
      id: 5,
      name: "Unduhan",
      url: "/unduhan",
      action: () => {},
      subMenu: [],
    },
    {
      id: 6,
      name: "Informasi",
      url: "/informasi",
      action: () => {},
      subMenu: [],
    },
    {
      id: 7,
      name: "FAQ",
      url: "/faq",
      action: () => {},
      subMenu: [],
    },
  ];

  useEffect(() => {
    handleGetIdentitas();
    handleGetProdi();
  }, []);

  return (
    <nav
      className={`h-16 md:h-20 flex items-center justify-between fixed  left-0 w-full z-50 ${
        isScroll ? "bg-purple-900 shadow-lg shadow-purple-900 top-0" : "top-14"
      } transition-all duration-500 ease-in-out py-5 px-5 md:px-7 lg:px-20`}
    >
      <div className="flex items-center gap-3 ">
        <Image src="/img/ubg.png" alt="" width={48} height={48} className="h-9 md:h-12 w-auto" />
        <div className={`text-white font-bold text-xs md:text-sm lg:text-base`}>
          <h1>
            {" "}
            {identitas?.find((item) => item.name === "Nama Fakultas")?.value}
          </h1>
          <hr className="" />
          <h1>Universitas Bumigora</h1>
        </div>
      </div>
      <AlignRight
        size={30}
        className={`text-gray-200 hover:text-white ease-in-out duration-300 transition-all md:hidden `}
        onClick={() => setIsActive(!isActive)}
      />
      {/* Layout Desktop dan ipad */}
      <div className={`hidden  md:flex md:gap-4 lg:gap-8 lg:text-lg`}>
        {menu.map((item) => (
          <div key={item.id}>
            <Link
              href={item.url}
              className={classnames({
                "underline font-bold":
                  currentPath === item.url ||
                  item.subMenu?.some((path) => path.url === currentPath),
                "border-none": currentPath !== item.url,
                "text-gray-200 hover:text-white hover:underline hover:scale-105 hover:font-bold hover:shadow-lg ease-in-out duration-300 transition-all":
                  true,
              })}
              onClick={item.action}
            >
              {item.name}
            </Link>
            {subActive === item.name && (
              <div
                className={`flex flex-col gap-3 absolute mt-2 bg-purple-900 rounded-lg ${
                  item.subMenu?.length === 0 ? "" : "px-4 py-2"
                }`}
              >
                {item.subMenu?.map((subItem) => (
                  <Link
                    href={subItem.url}
                    className="text-gray-200 hover:text-white hover:underline hover:font-bold hover:shadow-lg ease-in-out duration-300 transition-all"
                    key={item.id}
                    onClick={() => toggleSubMenu(null)}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Layout Phone */}
      <div
        className={` ${
          isActive ? "flex absolute z-50" : "hidden"
        } md:hidden top-0 text-white right-0 flex-col bg-blue-950 gap-3 px-5 py-4 rounded-bl-xl w-60`}
      ></div>{" "}
      <div
        className={` ${
          isActive ? "flex absolute z-50" : "hidden"
        } top-0 text-white right-0 flex-col bg-purple-900 gap-3 px-5 py-4 rounded-bl-xl w-60`}
      >
        <button onClick={() => setIsActive(!isActive)}>
          <ArrowRightFromLine />
        </button>
        <div className="flex flex-col gap-3">
          {menu.map((item) => (
            <div key={item.id}>
              <Link
                href={item.url}
                className={classnames({
                  "underline font-bold":
                    currentPath === item.url ||
                    item.subMenu?.some((path) => path.url === currentPath),
                  "border-none": currentPath !== item.url,
                  "text-gray-200 hover:text-white hover:underline hover:scale-105 hover:font-bold hover:shadow-lg ease-in-out duration-300 transition-all":
                    true,
                })}
                onClick={item.action}
              >
                {item.name}
              </Link>

              {subActive === item.name && (
                <div
                  className={`flex flex-col gap-3 mt-2 bg-purple-900 rounded-lg ${
                    item.subMenu?.length === 0 ? "" : "px-4 py-2"
                  }`}
                >
                  {item.subMenu?.map((subItem) => (
                    <Link
                      href={subItem.url}
                      className="text-gray-200 hover:text-white hover:underline hover:font-bold hover:shadow-lg ease-in-out duration-300 transition-all "
                      key={subItem.id}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
