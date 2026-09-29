import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "PLANNED",
  "WATCHING",
  "COMPLETED",
  "DROPPED",
] as const;

type WatchStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(value: unknown): value is WatchStatus {
  return (
    typeof value === "string" &&
    VALID_STATUSES.includes(value as WatchStatus)
  );
}

function parseId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const showId = parseId(id);

    if (!showId) {
      return NextResponse.json(
        { error: "Invalid show ID" },
        { status: 400 }
      );
    }

    const show = await prisma.show.findUnique({
      where: {
        id: showId,
      },
    });

    if (!show) {
      return NextResponse.json(
        { error: "Show not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(show);
  } catch (error) {
    console.error("GET /api/shows/[id] failed:", error);

    return NextResponse.json(
      { error: "Failed to retrieve show" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const showId = parseId(id);

    if (!showId) {
      return NextResponse.json(
        { error: "Invalid show ID" },
        { status: 400 }
      );
    }

    const existingShow = await prisma.show.findUnique({
      where: {
        id: showId,
      },
    });

    if (!existingShow) {
      return NextResponse.json(
        { error: "Show not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be an object" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      data.title !== undefined &&
      (typeof data.title !== "string" ||
        data.title.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    if (
      data.title !== undefined &&
      typeof data.title === "string" &&
      data.title.trim().length > 200
    ) {
      return NextResponse.json(
        { error: "Title must be 200 characters or fewer" },
        { status: 400 }
      );
    }

    if (
      data.description !== undefined &&
      data.description !== null &&
      typeof data.description !== "string"
    ) {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 }
      );
    }

    if (
      data.genre !== undefined &&
      data.genre !== null &&
      typeof data.genre !== "string"
    ) {
      return NextResponse.json(
        { error: "Genre must be a string" },
        { status: 400 }
      );
    }

    if (
      data.status !== undefined &&
      !isValidStatus(data.status)
    ) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (
      data.rating !== undefined &&
      data.rating !== null &&
      (typeof data.rating !== "number" ||
        !Number.isFinite(data.rating) ||
        data.rating < 0 ||
        data.rating > 10)
    ) {
      return NextResponse.json(
        { error: "Rating must be a number between 0 and 10" },
        { status: 400 }
      );
    }

    const show = await prisma.show.update({
      where: {
        id: showId,
      },
      data: {
        ...(data.title !== undefined && {
          title: (data.title as string).trim(),
        }),
        ...(data.description !== undefined && {
          description:
            typeof data.description === "string"
              ? data.description.trim() || null
              : null,
        }),
        ...(data.genre !== undefined && {
          genre:
            typeof data.genre === "string"
              ? data.genre.trim() || null
              : null,
        }),
        ...(data.status !== undefined && {
          status: data.status as WatchStatus,
        }),
        ...(data.rating !== undefined && {
          rating: data.rating as number | null,
        }),
      },
    });

    return NextResponse.json(show);
  } catch (error) {
    console.error("PUT /api/shows/[id] failed:", error);

    return NextResponse.json(
      { error: "Failed to update show" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const showId = parseId(id);

    if (!showId) {
      return NextResponse.json(
        { error: "Invalid show ID" },
        { status: 400 }
      );
    }

    const existingShow = await prisma.show.findUnique({
      where: {
        id: showId,
      },
    });

    if (!existingShow) {
      return NextResponse.json(
        { error: "Show not found" },
        { status: 404 }
      );
    }

    await prisma.show.delete({
      where: {
        id: showId,
      },
    });

    return NextResponse.json({
      message: "Show deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/shows/[id] failed:", error);

    return NextResponse.json(
      { error: "Failed to delete show" },
      { status: 500 }
    );
  }
}