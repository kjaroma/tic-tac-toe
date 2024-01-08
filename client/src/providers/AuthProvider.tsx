import { PropsWithChildren, createContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { URLS } from "../constants";
import { useCookies } from "react-cookie";

export type AuthContextType = {
    token: string | null,
    onLogin: (email: string, password: string) => void,
    onRegister: (email: string, name:string, password: string) => void,
    onLogout: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [_, setCookie] = useCookies(['access_token'])


    const makeAuthRequest = async (email: string, password: string, url: string, name?: string) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, password }),
            })
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            setToken(data.accessToken);
            setCookie('access_token', data.accessToken)
            const origin = location.state?.from?.pathname || '/game';
            navigate(origin);
        } catch (e) {
            console.error((e as any).message)
        }
    }

    const handleLogin = async (email: string, password: string) => makeAuthRequest(email, password, URLS.login)

    const handleRegister = async (email: string, name:string, password: string) => makeAuthRequest(email, password, URLS.register, name)


    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onRegister: handleRegister,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider