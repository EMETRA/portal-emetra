import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const tipoPlaca = searchParams.get('tipo_placa');
    const numeroPlaca = searchParams.get('numero_placa');

    if (!tipoPlaca || !numeroPlaca) {
        return NextResponse.json(
            { message: 'tipo_placa y numero_placa son requeridos' },
            { status: 400 }
        );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 

    if (!baseUrl) {
        return NextResponse.json(
            { message: 'Falta EMETRA_API_BASE_URL en las variables de entorno' },
            { status: 500 }
        );
    }

    const url = `${baseUrl}/juzgado/remisiones?tipo_placa=${encodeURIComponent(tipoPlaca)}&numero_placa=${encodeURIComponent(numeroPlaca)}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { message: 'Error al consultar remisiones en backend', backendResponse: text },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error al llamar al backend', error: error.message },
            { status: 500 }
        );
    }
}
