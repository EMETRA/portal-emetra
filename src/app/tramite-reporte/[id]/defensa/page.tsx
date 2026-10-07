import { ViviDefense } from '@/components/client/organisms/ViviDefense';
export default async function DefensaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ViviDefense caseId={id} />;
}
