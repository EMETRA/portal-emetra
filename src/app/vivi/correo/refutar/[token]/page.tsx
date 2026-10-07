import ViviCorreo from '@/components/client/organisms/ViviCorreo/ViviCorreo';
export default async function Pagina({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ViviCorreo token={token} accion="refutar" />;
}
