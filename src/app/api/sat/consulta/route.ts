import { NextRequest, NextResponse } from "next/server";
const baseUrl = process.env.EMETRA_API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const { plate } = await req.json();

    if (!plate || typeof plate !== "string") {
      return NextResponse.json(
        { error: true, message: "La placa es requerida" },
        { status: 400 }
      );
    }

    const [tplacaRaw, nplacaRaw] = plate.split("-");
    const tplaca = tplacaRaw?.trim().toUpperCase();
    const nplaca = nplacaRaw?.trim().toUpperCase();

    if (!tplaca || !nplaca) {
      return NextResponse.json(
        { error: true, message: "Formato de placa inválido" },
        { status: 400 }
      );
    }

    
    if (!baseUrl) {
      throw new Error("EMETRA_API_BASE_URL no está configurada");
    }

    const externalUrl = `${baseUrl}/notificado/consulta/${encodeURIComponent(tplaca)}/${encodeURIComponent(nplaca)}`;

    const externalRes = await fetch(externalUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!externalRes.ok) {
      const text = await externalRes.text();
      console.error("Error al consultar backend:", externalRes.status, text);

      return NextResponse.json(
        {
          error: true,
          message: "No se pudo consultar remisiones en el servidor externo",
        },
        { status: 502 }
      );
    }

    const data = await externalRes.json();

    console.log("datos de consulta: ", data)

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error en /api/solvencia/consulta:", err);
    return NextResponse.json(
      { error: true, message: "Error interno en la consulta de solvencia" },
      { status: 500 }
    );
  }
}
