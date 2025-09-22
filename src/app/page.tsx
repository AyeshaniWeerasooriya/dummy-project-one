import { LoginAlertBox } from "@/app/components/loginAlertBox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen grid grid-cols-2">
      <div className="bg-blue-950 flex items-center justify-center">
        <h1 className="text-5xl font-semibold text-white text-center px-15 leading-relaxed">
          Welcome to the Learning Management System
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <Image
          src="/backgroundImage.png"
          width={500}
          height={500}
          alt="Illustration"
        />
        <LoginAlertBox />
      </div>
    </div>
  );
}
