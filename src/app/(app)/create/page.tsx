import CreateForm from "./_components/create-form";

export default function CreatePage() {
	return (
		<div className="container mx-auto py-8">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8 text-center">
					<h1 className="mb-4 font-bold text-4xl">Create Your Song Coin</h1>
					<p className="text-lg text-muted-foreground">
						Upload your song and launch it as a tokenized coin on Zora
					</p>
				</div>

				<CreateForm />
			</div>
		</div>
	);
}
