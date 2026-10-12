import { NextRequest } from 'next/server';
import { proxyBackendRequest } from '@/lib/backend/proxy';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; evidencia: string }> }) {
  const { id, evidencia } = await params;
  return proxyBackendRequest(request, { path: `/vivi/denuncias/${encodeURIComponent(id)}/evidencias/${encodeURIComponent(evidencia)}`, method: 'POST', timeoutMs: 30000 });
}
