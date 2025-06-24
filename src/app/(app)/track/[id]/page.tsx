import { notFound } from "next/navigation";
import TrackDetails from "./_components/track-details";

interface TrackPageProps {
	params: { id: string };
}

export default function TrackPage({ params }: TrackPageProps) {
	if (!params.id) return notFound();
	return <TrackDetails id={params.id} />;
}
