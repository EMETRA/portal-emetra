import { NextRequest, NextResponse } from 'next/server';
import { json } from 'zod';

export const runtime = 'nodejs';

const BASE_URL = process.env.EMETRA_API_BASE_URL; 

function normalizaNumero(str: string): string {
    if (str == null) return '0';
    const s = String(str);
    const idx = s.lastIndexOf(',');
    let out = s;
    if (idx !== -1) {
        out = out.substring(0, idx) + '.' + out.substring(idx + 1);
    }
    out = out.replace(/,/g, '');
    return out;
}

type DetalleIntereses = {
  tipo_cobro: number;
  cobro: number;
  cuenta_cobro: number;
  cuenta: string;
  intereses: string;
} | null;


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const rawdocumento = body.documento;
        const serie = body.serie ?? 'E/E';

        if (!rawdocumento) {
            return NextResponse.json(
                { success: false, message: 'documento es requerido' },
                { status: 400 },
            );
        }
        const documento = String(rawdocumento).trim();

        const dtoRecibo = { serie, documento };

        // 1) Traer TODO del backend Nest, PERO SECUENCIAL

        // Encabezado
        const encRes = await fetch(`${BASE_URL}/recibo/encabezado`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dtoRecibo),
        });

        if (!encRes.ok) {
            console.error('Error en api', encRes.status, encRes.statusText);
            return NextResponse.json(
                { success: false, message: 'Error consultando encabezado del recibo.' },
                { status: 500 },
            );
        }

        // Detalle remisiones
        const remRes = await fetch(`${BASE_URL}/recibo/detalle-remisiones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dtoRecibo),
        });

        if (!remRes.ok) {
            console.error('Error en api 1', remRes.status, remRes.statusText);
            return NextResponse.json(
                { success: false, message: 'Error consultando remisiones del recibo.' },
                { status: 500 },
            );
        }

        // Detalle cuentas
        const ctasRes = await fetch(`${BASE_URL}/recibo/detalle-cuentas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dtoRecibo),
        });

        if (!ctasRes.ok) {
            console.error('Error en api 2', ctasRes.status, ctasRes.statusText);
            return NextResponse.json(
                { success: false, message: 'Error consultando cuentas del recibo.' },
                { status: 500 },
            );
        }

        // Detalle intereses
        const intRes = await fetch(`${BASE_URL}/recibo/detalle-intereses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dtoRecibo),
        });

        if (!intRes.ok) {
            console.error('Error en api 3', intRes.status, intRes.statusText);
            return NextResponse.json(
                { success: false, message: 'Error consultando intereses del recibo.' },
                { status: 500 },
            );
        }

        // Detalle descuentos
        const descRes = await fetch(`${BASE_URL}/recibo/detalle-descuentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dtoRecibo),
        });

        if (!descRes.ok) {
            console.error('Error en api 4', descRes.status, descRes.statusText);
            return NextResponse.json(
                { success: false, message: 'Error consultando descuentos del recibo.' },
                { status: 500 },
            );
        }

        // 2) Leer JSON de cada respuesta
        const encabezadoRaw = await encRes.json();
        const remisionesRaw = await remRes.json();
        const cuentasRaw = await ctasRes.json();
        const interesesText = await intRes.text();
        let interesesRaw: DetalleIntereses = null;
        const trimmed = interesesText.trim();
        if (trimmed !== '' && trimmed !== 'null') {
            try {
                interesesRaw = JSON.parse(trimmed) as DetalleIntereses;
            } catch (e) {
                console.error('Error parseando JSON de intereses:', e, 'texto:', interesesText);
                interesesRaw = null;
            }
        }
        const descuentosRaw = await descRes.json();

        // 3) Normalizar encabezado a array
        const encRow = Array.isArray(encabezadoRaw)
        ? encabezadoRaw[0]
        : encabezadoRaw;

        const encabezado: [
            string,
            number | string,
            string,
            string,
            string,
            string | null,
            string | null,
            string | null,
            string | null,
            string | null,
            string | null,
        ] = [
            encRow.SERIE ?? encRow.serie ?? 'E/E',                    
            encRow.DOCUMENTO ?? encRow.documento,                     
            encRow.FECHA ?? encRow.fecha,                             
            encRow.NOMBRE_PAGO ?? encRow.nombre_pago ?? '',           
            encRow.VALOR_TOTAL ?? encRow.valor_total ?? '0',          
            encRow.TIPO_PLACA ?? encRow.tipo_placa ?? null,           
            encRow.PLACA ?? encRow.placa ?? null,                     
            encRow.FIRMA_EL ?? encRow.firma_el ?? null,               
            encRow.CAJA ?? encRow.caja ?? null,                       
            encRow.USUARIO_GRABA ?? encRow.usuario_graba ?? null,     
            encRow.USUARIO ?? encRow.usuario ?? null,                  
        ];

        // 4) Remisiones
        const remisiones = (Array.isArray(remisionesRaw) ? remisionesRaw : []).map((r: any) => {
            const serieRem = r.SERIE_REMISION ?? r.serie_remision ?? '';
            const numRem = r.NUMERO_REMISION ?? r.numero_remision ?? '';
            return [`${serieRem}${numRem}`];
        });

        // 5) Cuentas
        const cuentas = (Array.isArray(cuentasRaw) ? cuentasRaw : []).map((c: any) => [
            c.TIPO_COBRO ?? c.tipo_cobro,
            c.COBRO ?? c.cobro,
            c.CUENTA_COBRO ?? c.cuenta_cobro,
            c.CUENTA ?? c.cuenta,
            c.VALOR ?? c.valor,
        ]);

        // 6) Intereses
        let intereses: any = [];
        if (interesesRaw) {
            const iRow = Array.isArray(interesesRaw)
                ? interesesRaw[0]
                : interesesRaw;
            if (iRow) {
                intereses = [
                iRow.TIPO_COBRO ?? iRow.tipo_cobro,
                iRow.COBRO ?? iRow.cobro,
                iRow.CUENTA_COBRO ?? iRow.cuenta_cobro,
                iRow.CUENTA ?? iRow.cuenta,
                iRow.INTERESES ?? iRow.intereses ?? '0',
                ];
            }
        }

        // 7) Descuentos
        const descuentos = (Array.isArray(descuentosRaw) ? descuentosRaw : []).map((d: any) => [
            d.TIPO_COBRO ?? d.tipo_cobro,
            d.COBRO ?? d.cobro,
            d.CUENTA_COBRO ?? d.cuenta_cobro,
            d.CUENTA ?? d.cuenta,
            Number(d.DESCUENTO ?? d.descuento ?? 0),
        ]);

        // 8) Nota de crédito total
        let notaCredito = 0;
        console.log('[NOTA CREDITO] remisiones para nota de crédito:', remisiones);
        for (const [sr] of remisiones) {
            console.log('[NOTA CREDITO] Consultando nota crédito para sr:', sr);
            if (!sr || typeof sr !== 'string' || sr.trim() === '') {
                console.log('[NOTA CREDITO] sr vacío o inválido, se omite llamada');
                continue;
            }
            const notaRes = await fetch(
                `${BASE_URL}/recibo/nota-credito/${encodeURIComponent(sr)}`,
            );

            if (!notaRes.ok) {
                console.error('Error en api 5', sr, notaRes.status, notaRes.statusText);
                return NextResponse.json(
                    { success: false, message: 'Error consultando nota de crédito.' },
                    { status: 500 },
                );
            }

            const notaJson = await notaRes.json();
            notaCredito += Number(notaJson.nota ?? notaJson.NOTA ?? 0);
        }

        // 9) Valor en letras
        const valorTotalNum = Number(normalizaNumero(encabezado[4]));
        console.log('Valor total numérico para valor en letras:', valorTotalNum);
        const velRes = await fetch(`${BASE_URL}/recibo/valor-en-letras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor_total: valorTotalNum }),
        });

        console.log('[VALOR-LETRAS] status:', velRes.status);
        console.log('[VALOR-LETRAS] content-type:', velRes.headers.get('content-type'));

        if (!velRes.ok) {
            console.error('Error en api', velRes.status, velRes.statusText);
            return NextResponse.json(
                { success: false, message: 'No se pudo obtener valor en letras.' },
                { status: 500 },
            );
        }

        const valorEnLetrasRaw = await velRes.text();
        console.log('[VALOR-LETRAS] Texto recibido:', valorEnLetrasRaw);

        // Si viene vacío, lo interpretamos como '' (sin romper)
        const valorEnLetras = valorEnLetrasRaw?.trim() || '';

        // 10) Respuesta
        const data = {
            encabezado,
            remisiones,
            cuentas,
            intereses,
            descuentos,
            valorEnLetras,
            notaCredito,
        };

        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error en api 6', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error interno al obtener datos del recibo.',
            },
            { status: 500 },
        );
    }
}
