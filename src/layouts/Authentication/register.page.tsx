import reti from "../../assets/reti.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import RegisterForm from "../../components/secondary/RegisterForm";

import youth from "../../assets/youth.jpg";
import youth1 from "../../assets/youth1.png";
import youth2 from "../../assets/youth2.png";

export const images = [youth, youth1, youth2];

export default function RegisterPage() {
  return (
    <div className="">
      <div className="mx-auto max-w-screen h-screen">
        <div className="flex min-h-full flex-1">
          <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-md lg:w-full">
              <div>
                <img
                  alt="Your Company"
                  src={reti}
                  className="h-20 w-auto mx-auto"
                />
                <h2 className="mt-4 text-2xl/9 font-bold tracking-tight text-gray-900">
                  JOIN ReTivate
                </h2>
                <p className="mt-2 text-sm/6 text-gray-500 mb-4">
                  Unlock a world of opportunities by joining the ReTivate community.
                </p>
              </div>

              <div>
                <RegisterForm />
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 flex-1 lg:block">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 5000 }}
              pagination={{ clickable: true }}
              loop={true}
              className="absolute inset-0 size-full"
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="size-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
