import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const {tipoPlaca, placa} = body;

    const payload = {
        tipo_Placa: tipoPlaca,
        numero_placa: placa,
    }

    const res = await fetch("", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    })

    const data = await res.json();
    return NextResponse.json(data);
}