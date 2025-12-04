import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formDataToJson } from "@/lib/formToJson";

export async function POST(req: Request) {
  const form = await req.formData();
  const raw = formDataToJson(form);

  const tran_id = raw.tran_id as string;

  await prisma.payment.update({
    where: { tranId: tran_id },
    data: {
      status: "FAILED",
      raw: raw,
    },
  });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=failed`
  );
}
