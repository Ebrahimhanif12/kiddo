"use client";

import { useRouter } from "next/navigation";

export default function OutOfCreditsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-black mb-3 text-center">
          You are out of credits
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Please purchase more credits to continue using this feature.
        </p>

        <div className="flex justify-center justify-items-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border bg-black  rounded-md hover:bg-black transition"
          >
            Cancel
          </button>

          <button
            onClick={() => router.push("/pricing")}
            className="px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition"
          >
            Go to Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
