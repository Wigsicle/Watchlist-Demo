import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const shows = await prisma.show.findMany({
    where: {
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
      ...(status
        ? {
            status: status as
              | "PLANNED"
              | "WATCHING"
              | "COMPLETED"
              | "DROPPED",
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(shows);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, description, genre, status, rating } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const show = await prisma.show.create({
      data: {
        title,
        description: description ?? null,
        genre: genre ?? null,
        status: status ?? "PLANNED",
        rating: rating ?? null,
      },
    });

    return NextResponse.json(show, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create show" },
      { status: 500 }
    );
  }
}