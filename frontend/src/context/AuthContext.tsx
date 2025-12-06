import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../utils/axiosConfig";
import type { Organization, User, UserProfile } from "../types";

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (userData: User, organizationsData: OrganizationsType, profile: UserProfile) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    isAuthenticated: boolean;
    leadOrgs: Organization[];
    boardMemberOrgs: Organization[];
    memberOrgs: Organization[];
}

interface OrganizationsType {
    leader: Organization[];
    board_member: Organization[];
    member: Organization[];
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [leadOrgs, setLeadOrgs] = useState<Organization[]>([]);
    const [boardMemberOrgs, setBoardMemberOrgs] = useState<Organization[]>([]);
    const [memberOrgs, setMemberOrgs] = useState<Organization[]>([]);
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
                setUserProfile(userResponse.data.profile);
                setLeadOrgs(userResponse.data.organizations.leader);
                setBoardMemberOrgs(
                    userResponse.data.organizations.board_member
                );
                setMemberOrgs(userResponse.data.organizations.member);
            } else {
                setUser(null);
                setUserProfile(null);
                setLeadOrgs([]);
                setBoardMemberOrgs([]);
                setMemberOrgs([]);
            }
        } catch (err) {
            console.error("Error checking auth:", err);
            setUser(null);
            setUserProfile(null);
            setLeadOrgs([]);
            setBoardMemberOrgs([]);
            setMemberOrgs([]);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData: User, organizations: OrganizationsType, profile: UserProfile) => {
        setUser(userData);
        setUserProfile(profile);
        setLeadOrgs(organizations?.leader ?? []);
        setBoardMemberOrgs(organizations?.board_member ?? []);
        setMemberOrgs(organizations?.member ?? []);
    };

    const logout = async () => {
        try {
            await axiosInstance.post(`/api/auth/logout/`, {}).catch(() => {});
        } catch (err) {
            console.error("Error logging out:", err);
        } finally {
            setUser(null);
            setUserProfile(null);
            setLeadOrgs([]);
            setBoardMemberOrgs([]);
            setMemberOrgs([]);
        }
    };

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!user,
        leadOrgs: leadOrgs,
        boardMemberOrgs: boardMemberOrgs,
        memberOrgs: memberOrgs,
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
