import CreateForm from "./_components/create-form";

export default function CreatePage() {
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
						<h1 className="mb-4 font-bold text-4xl md:text-5xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
							Launch Your Song Coin
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Upload your music and tokenize it as a tradable coin on Zora.
							Connect directly with fans and earn from your art.
						</p>
					</div>

					{/* Form Section */}
					<CreateForm />
				</div>
			</div>
		</div>
	);
}
