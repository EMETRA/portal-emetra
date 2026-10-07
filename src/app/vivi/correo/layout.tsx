import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Denuncia VIVI', robots: { index: false, follow: false, nocache: true }, referrer: 'no-referrer' };
export default function CorreoLayout({ children }: { children: React.ReactNode }) { return children; }
