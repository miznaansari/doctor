import { prisma } from "@/lib/prisma";

export async function GET() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(patients);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const errors = {};

    if (!body.patientName) errors.patientName = "Name is required";
    if (!body.age) errors.age = "Age is required";
    if (!body.fatherName) errors.fatherName = "Father name is required";
    if (!body.address) errors.address = "Address is required";

    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    const patient = await prisma.patient.create({
      data: {
        patientName: body.patientName,
        age: Number(body.age),
        fatherName: body.fatherName,
        address: body.address,
      },
    });

    return Response.json(patient);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}
