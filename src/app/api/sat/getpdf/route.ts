import { NextRequest } from "next/server";

export const runtime = "nodejs";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function POST(req: NextRequest) {
    try {
        const { plate } = await req.json();

        if (!plate || typeof plate !== "string") {
            return new Response(
                JSON.stringify({ error: true, message: "La placa es requerida" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const placaNormalizada = plate.replace(/\s+/g, "");
        const [tplacaRaw, nplacaRaw] = placaNormalizada.split("-");
        const tplaca = tplacaRaw?.trim().toUpperCase();
        const nplaca = nplacaRaw?.trim().toUpperCase();

        if (!tplaca || !nplaca) {
            return new Response(
                JSON.stringify({ error: true, message: "Formato de placa inválido" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_API_BASE_URL no está configurada");
        }

        const externalUrl = `${baseUrl}/notificado/generar`;

        const externalRes = await fetch(externalUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tplaca, nplaca }),
        });

        const contentType = externalRes.headers.get("content-type") ?? "application/json";
        const rawBody = await externalRes.text(); 
        console.log("datos pdf: ", rawBody)
        return new Response(rawBody, {
            status: externalRes.status,
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch (err) {
        console.error("Error en api interna:", err);
        return new Response(
            JSON.stringify({
                error: true,
                message: "Error interno al obtener datos de notificación",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
