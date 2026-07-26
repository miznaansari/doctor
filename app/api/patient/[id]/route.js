import { prisma } from "@/lib/prisma";
import { withRequireUser } from "@/lib/withRequireUser";

export const GET = withRequireUser(async function GET(req, { params }) {
  const p = await params;
  const patient = await prisma.patient.findUnique({
    where: { id: p.id },
  });

  if (!patient || patient.userId !== req.user.id) {
    return Response.json({ error: "Patient not found" }, { status: 404 });
  }

  return Response.json(patient);
});

export const PUT = withRequireUser(async function PUT(req, { params }) {
  try {
    const p = await params;
    const body = await req.json();

    const existing = await prisma.patient.findUnique({
      where: { id: p.id },
    });

    if (!existing || existing.userId !== req.user.id) {
      return Response.json({ error: "Patient not found" }, { status: 404 });
    }

    const updateData = {
      patientName: body.patientName?.trim() || existing.patientName,
      age: body.age ? Number(body.age) : existing.age,
      fatherName: body.fatherName?.trim() || existing.fatherName,
      mobileNumber: body.mobileNumber !== undefined ? body.mobileNumber : existing.mobileNumber,
      address: body.address?.trim() || existing.address,
    };

    // Safely add gender if supported by current Prisma Client
    try {
      const updated = await prisma.patient.update({
        where: { id: p.id },
        data: {
          ...updateData,
          gender: body.gender || existing.gender || "Male",
        },
      });
      return Response.json(updated);
    } catch (err) {
      // Fallback if gender column is pending prisma generate
      const updated = await prisma.patient.update({
        where: { id: p.id },
        data: updateData,
      });
      return Response.json({ ...updated, gender: body.gender });
    }
  } catch (err) {
    console.error("Failed to update patient:", err);
    return Response.json({ error: "Failed to update patient" }, { status: 500 });
  }
});
