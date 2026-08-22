import { prisma } from "@/lib/prisma";
import { withRequireUser } from "@/lib/withRequireUser";

export const GET = withRequireUser(async function GET(req) {
  const user = req.user;
  try {
    const patients = await prisma.patient.findMany({
      where: {
        userId: user.id,
        OR: [
          { isDeleted: false },
          { isDeleted: null },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(patients);
  } catch {
    // Graceful fallback if Prisma Client runtime is pending regeneration
    const patients = await prisma.patient.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    const activePatients = patients.filter((p) => !p.isDeleted);
    return Response.json(activePatients);
  }
});

export const POST = withRequireUser(async function POST(req) {
  try {
    const user = req.user;
    const body = await req.json();
    const errors = {};
    if (!body.patientName) errors.patientName = "Name is required";
    if (!body.age) errors.age = "Age is required";
    if (!body.fatherName) errors.fatherName = "Father name is required";
    if (!body.mobileNumber) errors.mobileNumber = "Mobile number is required";
    if (!body.address) errors.address = "Address is required";
    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }
    const patient = await prisma.patient.create({
      data: {
        patientName: body.patientName,
        age: Number(body.age),
        gender: body.gender || "Male",
        fatherName: body.fatherName,
        mobileNumber: body.mobileNumber,
        address: body.address,
        userId: user.id,
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
});
