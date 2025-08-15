"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { FaHome } from "react-icons/fa";


const converters = [
  { title: "Unit Converter", img: "/gifs/unit.gif", link: "/converter/unit" },
  { title: "Cooking Converter", img: "/gifs/cook.gif", link: "/converter/cooking" },
  { title: "Fuel Converter", img: "/gifs/fuel.gif", link: "/converter/fuel" },
];


function ConverterCard({ title, img, link, index }: { title: string; img: string; link: string; index: number }) {
  return (
    
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link
        href={link}
        className="group relative block rounded-3xl overflow-hidden shadow-lg bg-gradient-to-b from-gray-900 to-gray-800 hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-400
                   before:absolute before:inset-0 before:rounded-3xl before:bg-green-400/10 before:blur-xl before:transition-opacity before:duration-300 hover:before:opacity-100"
      >
        <Image
          src={img}
          alt={`${title} preview`}
          width={400}
          height={256}
          unoptimized
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-md">
            {title}
          </h2>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ConverterHub() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-green-300 via-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg">
          Select a Converter
        </h1>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {converters.map((converter, index) => (
            <ConverterCard key={converter.title} {...converter} index={index} />
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-7">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 shadow-lg shadow-green-500/30 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <FaHome className="text-lg" />
            </Link>
        </div>
      </main>
    </div>
  );
}
