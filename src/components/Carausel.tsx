import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function Carousel({children}:Props):React.JSX.Element {
  const [currentSlide, setcurrentSlide] = useState(0)
  const [arrows, setarrows] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(4)

  // Deteksi ukuran layar dan ubah slidesToShow
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { // mobile
        setSlidesToShow(1);
      } else if (width < 1024) { // tablet
        setSlidesToShow(2);
      } else if (width < 1280) { // desktop small
        setSlidesToShow(3);
      } else { // desktop large
        setSlidesToShow(4);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    centerPadding: "0px",
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (index: number) => setcurrentSlide(index),
    arrows: arrows,
    customPaging: (i: number) => (
      <div className={`w-2 h-2 mx-1 mt-4 rounded-full  ${currentSlide === i ? "bg-blue-950" : "bg-gray-300/70"}  transition-all duration-300 ease-in-out`} />
    ),
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPaddig: "0px"
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          centerPaddig: "0px"

        }
      }
    ]
  };

  return (
    <div className="relative m-auto">
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
}