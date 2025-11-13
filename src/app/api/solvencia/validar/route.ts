import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { tipoPlaca, placa, fechaRecibo, numeroRecibo } = body;

  const payload = {
    tipo_Placa: tipoPlaca,
    numero_placa: placa,
    fecha: fechaRecibo,
    recibo: numeroRecibo,
  };

//   const res = await fetch("http://localhost:3000/api/consultarExistenciaDocumento", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
  const data = {success: true, message: "Documento emitido correctamente, impresion valida"} //await res.json();
  return NextResponse.json(data);
}

