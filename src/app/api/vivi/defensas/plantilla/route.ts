import { NextRequest } from 'next/server';
import { proxyBackendRequest } from '@/lib/backend/proxy';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) { return proxyBackendRequest(request, { path: '/vivi/defensas/plantilla', method: 'POST', timeoutMs: 30000 }); }
