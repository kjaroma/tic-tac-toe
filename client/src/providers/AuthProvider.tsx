import { PropsWithChildren, createContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { AUTH_COOKIE_NAME, Urls } from "../constants";
import { useCookies } from "react-cookie";
import axios, { AxiosError } from "axios";

export type UserAuthData = {
    accessToken: string | null,
    userId: string | null,
    name: string | null,
}

export type AuthContextType = {
    userAuthData: UserAuthData,
    onLogin: (email: string, password: string) => Promise<string | undefined>,
    onRegister: (email: string, name: string, password: string) => Promise<string | undefined>,
    onLogout: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [userAuthData, setUserAuthData] = useState<UserAuthData>({} as UserAuthData);
    const navigate = useNavigate();
    const location = useLocation();
    const [_, setCookie] = useCookies([AUTH_COOKIE_NAME])

    const makeAuthRequest = async (email: string, password: string, url: string, name?: string): Promise<string | undefined> => {
        try {
            const response = await axios.post<UserAuthData>(url, { email, password, name })
            setUserAuthData(response.data)
            setCookie('access_token', response.data.accessToken)
            const origin = location.state?.from?.pathname || '/game';
            navigate(origin);
        } catch (e) {
            return (e as AxiosError<{ message: string }>)?.response?.data?.message ?? 'Login failed'
        }
    }

    const handleLogin = async (email: string, password: string) => makeAuthRequest(email, password, Urls.LOGIN)

    const handleRegister = async (email: string, name: string, password: string) => makeAuthRequest(email, password, Urls.REGISTER, name)


    const handleLogout = () => {
        setUserAuthData({} as UserAuthData);
    };

    const value = {
        userAuthData,
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