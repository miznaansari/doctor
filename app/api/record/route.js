import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming record request:", body);

    const errors = {};

    if (!body.patientId) errors.patientId = "Patient missing";
    if (!body.date) errors.date = "Date is required";
    if (!body.complain) errors.complain = "Complain is required";

    if (Object.keys(errors).length > 0) {
      return Response.json(
        { errors },
        { status: 400 }
      );
    }

    const record = await prisma.patientRecord.create({
      data: {
        patientId: body.patientId,
        date: new Date(body.date),
        complain: body.complain,
        investigation: body.investigation || "",
        advice: body.advice || "",
        treatment: body.treatment || "",
        improvement: body.improvement || "",
        cure: body.cure || "",
      },
    });

    console.log("Record created:", record);

    return Response.json(record);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Server error while creating record" },
      { status: 500 }
    );
  }
}
