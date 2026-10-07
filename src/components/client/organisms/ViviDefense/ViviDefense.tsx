import { SectionTitle } from '@/components/server/molecules';
export default function ViviDefense({ caseId }: { caseId: string }) {
  return <main style={{ maxWidth: 760, margin: '3rem auto', padding: '1rem' }}><SectionTitle>Plantilla de defensa</SectionTitle><p>Caso {caseId}</p><p>Abre el enlace «Refutar» del correo recibido para descargar la plantilla de este caso. Imprímela, complétala a mano y preséntala en el juzgado indicado en el aviso.</p></main>;
}
