// Composant CarrouselSécurisé.jsx
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Carrousel({ slides }) {
  const shouldLoop = slides.length >= 3;
  const slidesPerView = Math.min(3, slides.length);

  return (
    <Swiper
      loop={shouldLoop}
      slidesPerView={slidesPerView}
      spaceBetween={20}
      onInit={(swiper) => {
        if (!shouldLoop) {
          console.warn("Mode loop désactivé - slides insuffisantes");
        }
      }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
}