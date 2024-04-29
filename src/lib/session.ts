import { createContext } from "react";

type Token = {
	token: string | null;
	setToken: ((token: string | null) =>  void);
}

export const TokenContext = createContext<Token>({token: null, setToken: () => {}});