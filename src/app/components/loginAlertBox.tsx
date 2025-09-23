"use client";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export function LoginAlertBox() {
  const router = useRouter();
  const { user } = useAuth();
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Login successful");
      router.push("./text-editor");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <Card className="w-full max-w-sm bg-gray-600/50 px-5">
      <Button
        variant="outline"
        className="w-full bg-white text-black text-md py-5 font-bold"
        onClick={handleLogin}
      >
        <Image src="/google.svg" width={35} height={35} alt="Google" />
        Signing with Google
      </Button>
    </Card>
  );
}
