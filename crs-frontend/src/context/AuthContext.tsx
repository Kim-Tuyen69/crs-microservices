import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

import type { LoginResponse } from '../types/auth';

interface AuthUser {
    id: number;
    username: string;
    role: 'ADMIN' | 'STUDENT';
}

interface AuthContextType {
    user: AuthUser | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const TOKEN_KEY = 'crs_token';
const USER_KEY = 'crs_user';

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

function loadSavedUser(): AuthUser | null {
    const token =
        localStorage.getItem(TOKEN_KEY);

    const savedUser =
        localStorage.getItem(USER_KEY);

    if (!token || !savedUser) {
        return null;
    }

    try {
        return JSON.parse(
            savedUser
        ) as AuthUser;
    } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        return null;
    }
}

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const [user, setUser] =
        useState<AuthUser | null>(
            () => loadSavedUser()
        );

    const login = (
        data: LoginResponse
    ) => {
        const authUser: AuthUser = {
            id: data.userId,
            username: data.username,
            role: data.role,
        };

        localStorage.setItem(
            TOKEN_KEY,
            data.token
        );

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(authUser)
        );

        setUser(authUser);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: user !== null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider'
        );
    }

    return context;
}