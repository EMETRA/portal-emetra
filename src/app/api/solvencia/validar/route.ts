import { NextResponse } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_EMETRA_API_BASE_URL; 
export async function POST(req: Request) {
  const body = await req.json();
  const { tipoPlaca, placa, fechaRecibo, numeroRecibo } = body;

  const payload = {
    tipo_placa: tipoPlaca,
    numero_placa: placa,
    fecha_recibo: fechaRecibo,
    numero_recibo: numeroRecibo,
  };

  const res = await fetch(`${BASE_URL}/solvencia/consultar-existencia-documento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();//{success: true, message: "Documento emitido correctamente, impresion valida"} //await res.json();
  return NextResponse.json(data);
}

