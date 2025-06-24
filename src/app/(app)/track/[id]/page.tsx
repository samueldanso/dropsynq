import { notFound } from "next/navigation";
import TrackDetails from "./_components/track-details";

export default async function TrackPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) return notFound();
  return <TrackDetails id={params.id} />;
}
