import { LoginAlertBox } from "@/app/components/loginAlertBox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen grid grid-cols-2">
      <div className="relative w-full h-full">
        <Image
          src="/backgroundImage.png"
          alt="Illustration"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-blue-950/30"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-relaxed">
            Welcome to our
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-relaxed ">
            Learning Management System
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center bg-blue-950">
        <LoginAlertBox />
      </div>
    </div>
  );
}
