import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
    const p  = await params;
  const records = await prisma.patientRecord.findMany({
    where: { patientId: p.patientId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(records);
}
