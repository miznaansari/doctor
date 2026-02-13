import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();

  const record = await prisma.patientRecord.create({
    data: {
      patientId: body.patientId,
      date: new Date(body.date),
      complain: body.complain,
      investigation: body.investigation,
      advice: body.advice,
      treatment: body.treatment,
      improvement: body.improvement,
      cure: body.cure,
    },
  });

  return Response.json(record);
}
