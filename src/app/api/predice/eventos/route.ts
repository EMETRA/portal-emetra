import { NextRequest, NextResponse } from "next/server";
import { apiErrorFromUnknown } from "@/lib/api/errors";
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
    return apiErrorFromUnknown(error, "No se pudieron cargar los eventos");
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get("admin") ?? undefined;
    const payload = (await request.json()) as CreatePrediceEventPayload;
    const created = await createPrediceEventServer(payload, admin);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return apiErrorFromUnknown(error, "No se pudo registrar el evento");
  }
}
