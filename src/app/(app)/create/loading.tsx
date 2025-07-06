import { Image as ImageIcon, Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<div className="container mx-auto py-8 px-4">
				<div className="mx-auto max-w-4xl">
					{/* Header Section */}
					<div className="mb-12 text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
							<span className="size-2 bg-primary rounded-full"></span>
							Create New Drop
						</div>
						<Skeleton className="h-12 w-96 mx-auto mb-4" />
						<Skeleton className="h-6 w-80 mx-auto" />
					</div>

					{/* Form Loading */}
					<div className="space-y-8">
						{/* File Uploads Section */}
						<Card>
							<CardContent className="p-6">
								<Skeleton className="h-7 w-48 mb-6" />
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-4">
										<Skeleton className="h-4 w-20" />
										<div className="rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-8">
											<div className="flex flex-col items-center justify-center">
												<Music className="size-12 text-muted-foreground mb-4" />
												<Skeleton className="h-6 w-32 mb-2" />
												<Skeleton className="h-4 w-48" />
											</div>
										</div>
									</div>
									<div className="space-y-4">
										<Skeleton className="h-4 w-24" />
										<div className="rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-8">
											<div className="flex flex-col items-center justify-center">
												<ImageIcon className="size-12 text-muted-foreground mb-4" />
												<Skeleton className="h-6 w-32 mb-2" />
												<Skeleton className="h-4 w-48" />
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Song Details Section */}
						<Card>
							<CardContent className="p-6">
								<Skeleton className="h-7 w-32 mb-6" />
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-10 w-full" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-10 w-full" />
									</div>
								</div>
								<div className="mt-6 space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-24 w-full" />
								</div>
								<div className="grid gap-6 md:grid-cols-2 mt-6">
									<div className="space-y-2">
										<Skeleton className="h-4 w-16" />
										<Skeleton className="h-10 w-full" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-10 w-full" />
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Submit Section */}
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-5 w-24" />
							</div>
							<Skeleton className="h-12 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
