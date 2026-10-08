import type { Metadata } from 'next';
import TramiteReporte from '@/components/client/organisms/ViviCorreo/TramiteReporte';
export const metadata: Metadata = { title: 'Plantilla de defensa | EMETRA', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export const dynamic = 'force-dynamic';
export default async function DefensaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TramiteReporte codigoCaso={id} defensa />;
}
