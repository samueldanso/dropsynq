import { useLogin, usePrivy } from "@privy-io/react-auth";

export default function SignIn() {
	const { ready, authenticated } = usePrivy();
	const { login } = useLogin();
	const handleLogin = async () => {
		await login();
	};
	if (!ready) {
		return <div>Loading...</div>;
	}
	return (
		<button onClick={handleLogin} type="button">
			{authenticated ? "Logout" : "Login"}
		</button>
	);
}
