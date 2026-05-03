import React from "react";
import MenuSidebar from "./elements/MenuSidebar";
import { usePathname } from "next/navigation";
import { Layers, House, Library, FileAxis3d, Newspaper, GraduationCap, University, MailQuestion, Users  } from "lucide-react";
import Image from "next/image";
export default function SideBar() {
  const menu = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: <House />,
    },
    {
      name: "Content",
      url: "/admin/content",
      icon: <Layers />,
    },
    {
      name: "Pengumuman",
      url: "/admin/pengumuman",
      icon: <Library />,
    },
    {
      name: "Berkas",
      url: "/admin/berkas",
      icon: <FileAxis3d/>,
    },
    {
      name: "Berita",
      url: "/admin/berita",
      icon: <Newspaper />,
    },
    {
      name: "Dosen",
      url: "/admin/dosen",
      icon: <GraduationCap />,
    },
    {
      name: "Staf",
      url: "/admin/staf",
      icon:  <Users />,
    },
    {
      name: "Prodi",
      url: "/admin/prodi",
      icon:  <University />,
    },
    {
      name: "faq",
      url: "/admin/faq",
      icon:  <MailQuestion />,
    },
    
    
  ];

  const currentPath = usePathname();
  return (
    <div className="w-64 h-full bg-white p-5 fixed  z-50">
      <div className="flex items-center  gap-2 mb-3">
        <Image src="/img/ubg-blue.png" alt="" width={56} height={56} className="h-14 w-auto" />
        <h1 className="text-2xl font-bold text-purple-600">Admin</h1>
      </div>
      <h2 className="py-2 text-gray-400">Menu</h2>
      <div className="flex flex-col gap-2 h-full w-full">
        {menu.map((item, index) => (
          <MenuSidebar
            key={index}
            icon={item.icon}
            link={item.url}
            text={item.name}
            className={
              currentPath === item.url
                ? "bg-purple-600/20 text-purple-600"
                : "bg-gray-300/70"
            }
          />
        ))}
      </div>
    </div>
  );
}
