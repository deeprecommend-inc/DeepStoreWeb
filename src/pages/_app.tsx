import NavBar from "@/components/NavBar";
import { defaultTheme } from "@/lib/defaultTheme";
import { TokenContext } from "@/lib/session";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";



export default function App({
	Component, pageProps: { ...pageProps }
}: AppProps) {
	const [_token, _setToken] = useState<string | null>(null);
	const [user, setUser] = useState<{name: string, email: string, address: string, tel:string} | null>(null);

	// tokenが変更されたらlocalStorageの方も書き換える
	const setToken = (newToken: string | null) => {
		localStorage.setItem("token", newToken || "");
		_setToken(newToken);
	};

	useEffect(() => {
		if (!_token) return;
		// 現在ログイン中のユーザーの情報を取得
		fetch("/api/auth/current", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${_token}`
			}
		})
			.then(res => {
				switch (res?.status) {
					case 200:
						if (res != null) {
							res.json().then(user => setUser(user));
							break;
						}
					default:
						// 無効なtoken
						setToken(null);
				}
			});
	}, [_token]);

	const logout = () => {
		const url = "/api/auth/logout";
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${_token}`
			}
		});
		setToken(null);
	};

	// localStorageに保存したtokenを読み出す
	useEffect(() => {
		_setToken(localStorage.getItem("token") || null);
	}, []);

	return (
		<ThemeProvider theme={defaultTheme}>
			<TokenContext.Provider value={{token: _token, setToken, user}}>
				<NavBar isLoggedIn={_token != null} username={user?.name || "ロード中.."} logout={logout} />
				<Component {...pageProps} />
			</TokenContext.Provider>
		</ThemeProvider>
	);
}