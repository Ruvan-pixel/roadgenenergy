import Image from "next/image";
import backgroundImage from "@/public/background.jpg";

export default function Home() {
  return (
    <div className="relative">
      <div className="relative h-[50vh] w-full">
        <Image
          src={backgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Harnessing Every Drive for a Greener Tomorrow</h1>
        </div>
      </div>
      <div className="bg-white p-10">
        <h2 className="text-3xl font-bold mb-4 text-black">Our Mission</h2>
        <p className="text-lg leading-relaxed text-black">
          Our speed breaker power generation project transforms kinetic energy from vehicles into usable electricity. It aims to harness sustainable energy from traffic flow, contributing to a greener future while optimizing urban energy solutions.
        </p>
      </div>
    </div>
  );
}