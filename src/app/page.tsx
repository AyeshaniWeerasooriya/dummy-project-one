"use client";

import { LoginAlertBox } from "@/app/components/loginAlertBox";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    console.log(
      "Firebase authDomain:",
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    );
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/user-editor");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950 text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative w-full h-96 md:h-full">
        <Image
          src="/backgroundImage.png"
          alt="Illustration"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-snug drop-shadow-lg">
            Welcome to our
          </h1>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-snug drop-shadow-lg mt-2">
            Learning Management System
          </h1>
          <div className="mt-4 w-24 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gradient-to-tr from-blue-950 to-indigo-900">
        <div className="w-full max-w-md p-10 md:p-16 rounded-3xl bg-blue-950/90 backdrop-blur-md shadow-xl flex flex-col gap-6">
          <LoginAlertBox />
          <p className="text-center text-sm text-white/80 mt-4">
            Securely access your courses and notes
          </p>
        </div>
      </div>
    </div>
  );
}
