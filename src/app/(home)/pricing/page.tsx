"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <section className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-2xl text-black font-semibold mb-4">
          Buying credit is not available yet, thank you.
        </h1>

        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-2 rounded-md bg-black text-white hover:opacity-80 transition"
        >
          Go to Home
        </button>
      </section>
    </main>
  );
}
