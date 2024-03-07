import { useEffect, useState } from "react";

export default function useToken(): [string, (newToken: string) => void] {
    const [_token, _setToken] = useState<string>("");
    useEffect(() => _setToken(localStorage.getItem("token") || ""), [])
    const setToken = (newToken: string) => {
        localStorage.setItem("token", newToken);
        _setToken(newToken);
    }
    return [_token, setToken];
}
