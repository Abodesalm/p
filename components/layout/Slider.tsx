"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import dynamic from "next/dynamic";
import Image from "next/image";
import { covers_api } from "@/public/data";
import Link from "next/link";

export default function Slider({ data }) {
  //const SwiperCore = dynamic(() => import("swiper/react"), { ssr: false });
  return (
    <Swiper
      modules={[Pagination, EffectFade, Autoplay]}
      className="min-h-[300px]"
      spaceBetween={20}
      slidesPerView={3}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={true}
      keyboard={{ enabled: true }}
      breakpoints={{
        360: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {data.map((game) => (
        <SwiperSlide key={game.slug} className="golden-glass">
          <Image
            src={`${covers_api}/${game.cover}`}
            alt="game cover"
            width={300}
            height={900}
            className="w-auto h-[300px] rounded-md -rotate-1 rtl:rotate-1"
          />
          <div className="flex flex-col">
            <h2 className="text-size-4 capitalize mt-2 text-dark font-semibold">
              {game.name}
            </h2>
            <Link
              href={`/games/${game.slug}`}
              className="btn-accent absolute bottom-[20px] end-[20px]"
            >
              show details
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
