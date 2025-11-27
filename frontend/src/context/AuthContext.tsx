import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../utils/axiosConfig";
import type { Organization, User } from "../types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User, organizationsData?: OrganizationsType) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    isAuthenticated: boolean;
    leadOrgs: Organization[];
    boardMemberOrgs: Organization[];
    memberOrgs: Organization[];
    unverifiedOrgs: Organization[];
}

interface OrganizationsType {
    leader: Organization[];
    board_member: Organization[];
    member: Organization[];
    unverified: Organization[];
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [leadOrgs, setLeadOrgs] = useState<Organization[]>([]);
    const [boardMemberOrgs, setBoardMemberOrgs] = useState<Organization[]>([]);
    const [memberOrgs, setMemberOrgs] = useState<Organization[]>([]);
    const [unverifiedOrgs, setUnverifiedOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userResponse = await axiosInstance
                .get(`/api/auth/check/`)
                .catch(() => ({ data: { is_authenticated: false } }));

            if (userResponse.data.is_authenticated) {
                setUser(userResponse.data.user);
                setLeadOrgs(userResponse.data.organizations.leader);
                setBoardMemberOrgs(
                    userResponse.data.organizations.board_member
                );
                setMemberOrgs(userResponse.data.organizations.member);
                setUnverifiedOrgs(userResponse.data.organizations.unverified);
            } else {
                setUser(null);
                setLeadOrgs([]);
                setBoardMemberOrgs([]);
                setMemberOrgs([]);
                setUnverifiedOrgs([]);
            }
        } catch (err) {
            console.error("Error checking auth:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData: User, organizations?: OrganizationsType) => {
        setUser(userData);
        setLeadOrgs(organizations?.leader ?? []);
        setBoardMemberOrgs(organizations?.board_member ?? []);
        setMemberOrgs(organizations?.member ?? []);
        setUnverifiedOrgs(organizations?.unverified ?? []);
    };

    const logout = async () => {
        try {
            await axiosInstance.post(`/api/auth/logout/`, {}).catch(() => {});
        } catch (err) {
            console.error("Error logging out:", err);
        } finally {
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!user,
        leadOrgs: leadOrgs,
        boardMemberOrgs: boardMemberOrgs,
        memberOrgs: memberOrgs,
        unverifiedOrgs: unverifiedOrgs,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
