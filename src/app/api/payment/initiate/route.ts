import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store_id = process.env.SSLCOMMERZ_STORE_ID!;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
  const isSandbox = process.env.SSLCOMMERZ_IS_SANDBOX === "true";

  const baseUrl = isSandbox
    ? "https://sandbox.sslcommerz.com"
    : "https://securepay.sslcommerz.com";

  const tran_id = crypto.randomUUID();

  const payload = {
    store_id,
    store_passwd,
    total_amount: "400",
    currency: "BDT",
    tran_id,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cancel`,
    cus_name: "User",
    cus_email: `${userId}@example.com`,
    cus_add1: "Dhaka",
    cus_phone: "01700000000",
    shipping_method: "NO",
    product_name: "Credits",
    product_category: "Digital",
    product_profile: "general",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1230,
    ship_country: "Bangladesh",
  };

  console.log("INIT PAYLOAD:", payload);

  // ❗ FIX: MUST send as x-www-form-urlencoded
  const response = await fetch(`${baseUrl}/gwprocess/v3/api.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload),
  });

  const data = await response.json();

  console.log("SSL RESPONSE:", data);

  if (data?.GatewayPageURL) {
    return Response.json({ url: data.GatewayPageURL });
  }

  return Response.json({ error: "SSL init failed", details: data });
}
