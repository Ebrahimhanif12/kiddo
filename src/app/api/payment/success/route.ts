import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // Clerk and SSLCommerz sometimes ping GET first → avoid 405 error
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const data = Object.fromEntries(
    Array.from(form.entries()).map(([key, value]) => [
      key,
      typeof value === "string" ? value : value.toString(),
    ])
  );

  const tran_id = data.tran_id as string;

  console.log("SUCCESS HIT — FORM DATA:", data);

  if (!tran_id) {
    return NextResponse.json({ error: "tran_id missing" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { tranId: tran_id },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const isSandbox = "true";

  const validatorUrl = isSandbox
    ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

  const validationURL =
    `${validatorUrl}?` +
    new URLSearchParams({
      val_id: data.val_id as string,
      store_id,
      store_passwd,
      format: "json",
    }).toString();

  console.log("VALIDATION URL:", validationURL);

  const validateRes = await fetch(validationURL);
  const validateJson = await validateRes.json();

  console.log("VALIDATION RESPONSE:", validateJson);

  if (validateJson.status !== "VALID" && validateJson.status !== "VALIDATED") {
    await prisma.payment.update({
      where: { tranId: tran_id },
      data: {
        status: "FAILED",
        raw: validateJson,
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=failed`
    );
  }

  await prisma.payment.update({
    where: { tranId: tran_id },
    data: {
      status: "PAID",
      raw: validateJson,
    },
  });

  await prisma.usage.upsert({
    where: { key: payment.userId },
    update: { points: { increment: payment.credits } },
    create: {
      key: payment.userId,
      points: payment.credits,
      expire: null,
    },
  });

 return NextResponse.redirect(
  `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
);
}
