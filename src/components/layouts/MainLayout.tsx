import React, { ReactNode } from "react";
import Header from "../Header";
import { useState, useEffect } from "react";
import ContactHeader from "../ContactHeader";
import Footer from "../Footer";

type Props = {
  children: ReactNode;
  hideHeader: boolean;
  hideContactHeader: boolean;
  hideFooter: boolean;
};

export default function MainLayout({
  children,
  hideFooter,
  hideHeader,
  hideContactHeader,
}: Props) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {!hideContactHeader && <ContactHeader isScroll={scrolled} />}
      {!hideHeader && <Header isScroll={scrolled} />}

      {children}

      {!hideFooter && <Footer />}
    </div>
  );
}
