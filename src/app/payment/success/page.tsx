// filepath: src/app/payment/success/page.tsx
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p>Your credits have been added. Thank you for your purchase.</p>
        <a href="/pricing" className="mt-4 inline-block text-blue-600 underline">Go back to Pricing</a>
      </div>
    </main>
  );
}