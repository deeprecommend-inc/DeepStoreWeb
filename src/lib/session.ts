import { createContext } from "react";

type Token = {
	token: string | null;
	setToken: ((token: string | null) =>  void);
	user: {
		name: string;
		email: string;
		address: string;
		tel: string;
	} | null
}

export const TokenContext = createContext<Token>({token: null, setToken: () => {}, user:null});