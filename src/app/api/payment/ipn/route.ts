import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const data = req.body;

  const tran_id = data.tran_id;

  if (!tran_id) {
    return res.status(400).json({ error: "Missing tran_id" });
  }

  // Log everything
  await prisma.payment.update({
    where: { tranId: tran_id },
    data: { raw: data },
  });

  // Handle status
  if (data.status === "VALID") {
    await prisma.payment.update({
      where: { tranId: tran_id },
      data: { status: "PAID" },
    });

    // Add credits
    const payment = await prisma.payment.findUnique({
      where: { tranId: tran_id },
    });

    if (payment) {
      await prisma.usage.upsert({
        where: { key: payment.userId },
        update: { points: { increment: payment.credits } },
        create: {
          key: payment.userId,
          points: payment.credits,
        },
      });
    }
  } else {
    await prisma.payment.update({
      where: { tranId: tran_id },
      data: { status: "FAILED" },
    });
  }

  return res.status(200).json({ received: true });
}
