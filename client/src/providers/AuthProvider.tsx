import { PropsWithChildren, createContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const fakeAuth = (): Promise<string> =>
    new Promise((resolve) => {
        setTimeout(() => resolve('supersecretauttoken'), 250);
    });

export type AuthContextType = {
    token: string | null,
    onLogin: () => void,
    onRegister: () => void,
    onLogout: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        const token = await fakeAuth();

        setToken(token);
        const origin = location.state?.from?.pathname || '/game';
        navigate(origin);
    };

    const handleRegister = async () => {
        const token = await fakeAuth();

        setToken(token);
        const origin = location.state?.from?.pathname || '/game';
        navigate(origin);
    };


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