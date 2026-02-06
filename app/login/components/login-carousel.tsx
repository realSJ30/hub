"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "The simplest way to manage your rental properties",
    description:
      "RentHub is a platform that helps you manage your rental properties with ease and efficiency.",
    image: "/signin-hero.svg",
  },
  {
    title: "Maximize Your ROI with Smart Analytics",
    description:
      "Our advanced algorithms help you stay ahead of the market and optimize your rental prices.",
    image: "/signin-hero.svg",
  },
  {
    title: "Seamless Communication with Tenants",
    description:
      "Message your tenants, track maintenance requests, and collect payments all in one place.",
    image: "/signin-hero.svg",
  },
];

const LoginCarousel = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

  return (
    <div className="hidden md:flex flex-col px-12 py-12 justify-start flex-1 bg-primary rounded-2xl text-white relative overflow-hidden min-h-[600px]">
      {/* Background patterns for a premium feel */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
              }`}
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight tracking-tight max-w-sm">
                  {slide.title}
                </h2>
                <p className="text-neutral-200 text-lg max-w-sm leading-relaxed">
                  {slide.description}
                </p>
              </div>

              <div className="mt-16 flex justify-center items-center">
                <div className="relative w-full max-w-[400px] aspect-square animate-in fade-in zoom-in duration-1000">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-contain opacity-95 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/10">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating || index === currentSlide) return;
                  setIsAnimating(true);
                  setCurrentSlide(index);
                  setTimeout(() => setIsAnimating(false), 700);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? "w-10 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 border-white/10 hover:bg-white hover:text-primary transition-all duration-300 h-11 w-11 text-white group"
              onClick={prevSlide}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 border-white/10 hover:bg-white hover:text-primary transition-all duration-300 h-11 w-11 text-white group"
              onClick={nextSlide}
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCarousel;
