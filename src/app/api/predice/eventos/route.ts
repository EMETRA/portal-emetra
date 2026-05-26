import { NextRequest, NextResponse } from "next/server";
import { BackendError } from "@/lib/backend/client";
import {
  createPrediceEventServer,
  fetchPrediceEventsServer,
} from "@/lib/predice/server";
import type { CreatePrediceEventPayload } from "@/lib/predice/types";

export async function GET(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get("admin") ?? undefined;
    const events = await fetchPrediceEventsServer(admin);
    return NextResponse.json(events);
  } catch (error) {
    console.error("[GET /api/predice/eventos]", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get("admin") ?? undefined;
    const payload = (await request.json()) as CreatePrediceEventPayload;
    const created = await createPrediceEventServer(payload, admin);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[POST /api/predice/eventos]", error);
    return NextResponse.json(
      { error: "No se pudo registrar el evento" },
      { status: 500 }
    );
  }
}
