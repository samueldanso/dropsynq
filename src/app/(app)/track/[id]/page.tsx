import { notFound } from "next/navigation";
import TrackDetails from "./_components/track-details";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();
  return <TrackDetails id={id} />;
}
