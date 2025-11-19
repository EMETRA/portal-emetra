import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_EMETRA_API_BASE_URL; 

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tipoPlaca, placa } = body;

        // Lo que espera el backend Nest:
        const payload = {
            tipo_placa: tipoPlaca,
            numero_placa: placa,
        };

        const res = await fetch(`${BASE_URL}/solvencia/consultar-placa-pago-tiempo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error('Error al llamar al backend:', res.status, res.statusText);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Error al consultar la placa en el servidor.',
                },
                { status: 500 },
            );
        }

        const data = await res.json(); 

        return NextResponse.json(
            {
                success: data.valido,
                message: data.mensaje,
                recibo: data.recibo ?? null,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error en API interna', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error interno del servidor.',
            },
            { status: 500 },
        );
    }
}
