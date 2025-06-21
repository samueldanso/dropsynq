"use client";

import { useState } from "react";

export default function Home() {
	const [file, setFile] = useState<File>();
	const [url, setUrl] = useState("");
	const [uploading, setUploading] = useState(false);

	const uploadFile = async () => {
		try {
			if (!file) {
				alert("No file selected");
				return;
			}

			setUploading(true);
			const data = new FormData();
			data.set("file", file);
			const uploadRequest = await fetch("/api/upload", {
				method: "POST",
				body: data,
			});
			const signedUrl = await uploadRequest.json();
			setUrl(signedUrl);
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
			alert("Trouble uploading file");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target?.files?.[0]);
	};

	return (
		<main className="m-auto flex min-h-screen w-full flex-col items-center justify-center">
			<input type="file" onChange={handleChange} />
			<button type="button" disabled={uploading} onClick={uploadFile}>
				{uploading ? "Uploading..." : "Upload"}
			</button>
			{/* Add a conditional looking for the signed url and use it as the source */}
			{url && <img src={url} alt="Image from Pinata" />}
		</main>
	);
}
