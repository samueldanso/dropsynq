"use client";

import CreateForm from "./_components/create-form";

export default function CreatePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto py-8 px-4">
				<div className="mx-auto max-w-4xl">
					{/* Header Section */}
					<div className="mb-12 text-center">
						<h1 className="mb-4 font-bold text-2xl md:text-3xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
							Launch Your Music Drop
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Upload & tokenize your music as a tradable coin on Dropsynq.
						</p>
					</div>

					{/* Form Section */}
					<CreateForm />
				</div>
			</div>
		</div>
	);
}
