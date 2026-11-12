import { redirect, notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ persona: string; evento: string }>;
}) {
  const p = await params;
  if (!/^[1-9]\d{0,9}$/.test(p.evento) || !/^[1-9]\d{0,9}$/.test(p.persona))
    notFound();
  redirect(`/evial/${p.evento}?continuar=1&codigo=${p.persona}`);
}
