import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({ codigo: 'DEFENSA_WEB_DESHABILITADA', message: ['Abre el enlace Refutar del correo y descarga la plantilla para presentarla en el juzgado.'] }, { status: 410, headers: { 'Cache-Control': 'private, no-store' } }); }
