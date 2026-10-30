import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Add Student
export async function POST(request) {
  try {
    const body = await request.json();

    const student = await prisma.student.create({
      data: {
        name: body.name,
        email: body.email,
        course: body.course,
        phone: body.phone,
      },
    });

    return NextResponse.json(student, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "Error adding student", error: error.message },
      { status: 500 }
    );
  }
}

// View Students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(students);

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching students", error: error.message },
      { status: 500 }
    );
  }
}

// Update Student
export async function PUT(request) {
  try {
    const body = await request.json();

    const student = await prisma.student.update({
      where: {
        id: Number(body.id),
      },
      data: {
        name: body.name,
        email: body.email,
        course: body.course,
        phone: body.phone,
      },
    });

    return NextResponse.json(student);

  } catch (error) {
    return NextResponse.json(
      { message: "Error updating student", error: error.message },
      { status: 500 }
    );
  }
}

// Delete Student
export async function DELETE(request) {
  try {
    const body = await request.json();

    const student = await prisma.student.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({
      message: "Student deleted successfully",
      student,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting student", error: error.message },
      { status: 500 }
    );
  }
}
