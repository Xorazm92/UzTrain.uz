// Role-based Access Control System

export interface User {
    username: string;
    password: string;
    role: UserRole;
    displayName: string;
    organizationId?: string;
}

export type UserRole = 'admin' | 'manager' | 'supervisor' | 'user';

export interface RolePermissions {
    viewDashboard: boolean;
    viewCompanies: boolean;
    addCompany: boolean;
    editCompany: boolean;
    deleteCompany: boolean;
    viewReports: boolean;
    exportData: boolean;
    importData: boolean;
    manageUsers: boolean;
    viewAllOrganizations: boolean;
}

// Initial Test accounts
const INITIAL_USERS: User[] = [
    {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        displayName: 'Administrator'
    },
    {
        username: 'manager',
        password: 'manager123',
        role: 'manager',
        displayName: 'Menejer',
        organizationId: 'aj_head'
    },
    {
        username: 'supervisor',
        password: 'super123',
        role: 'supervisor',
        displayName: 'Nazoratchi',
        organizationId: 'toshkent_mtu'
    },
    {
        username: 'user',
        password: 'user123',
        role: 'user',
        displayName: 'Foydalanuvchi',
        organizationId: 'salor_masofa'
    }
];

// Role permissions configuration
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
    admin: {
        viewDashboard: true,
        viewCompanies: true,
        addCompany: true,
        editCompany: true,
        deleteCompany: true,
        viewReports: true,
        exportData: true,
        importData: true,
        manageUsers: true,
        viewAllOrganizations: true
    },
    manager: {
        viewDashboard: true,
        viewCompanies: true,
        addCompany: true,
        editCompany: true,
        deleteCompany: false,
        viewReports: true,
        exportData: true,
        importData: true,
        manageUsers: false,
        viewAllOrganizations: true
    },
    supervisor: {
        viewDashboard: true,
        viewCompanies: true,
        addCompany: true,
        editCompany: true,
        deleteCompany: false,
        viewReports: true,
        exportData: true,
        importData: false,
        manageUsers: false,
        viewAllOrganizations: false
    },
    user: {
        viewDashboard: true,
        viewCompanies: true,
        addCompany: false,
        editCompany: false,
        deleteCompany: false,
        viewReports: true,
        exportData: false,
        importData: false,
        manageUsers: false,
        viewAllOrganizations: false
    }
};

// User Management Functions
export function getUsers(): User[] {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
        return JSON.parse(usersJson);
    }
    // Initialize if empty
    localStorage.setItem('users', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
}

export function addUser(user: User): void {
    const users = getUsers();
    if (users.find(u => u.username === user.username)) {
        throw new Error('Username already exists');
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

export function removeUser(username: string): void {
    const users = getUsers();
    const newUsers = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(newUsers));
}

// Authentication functions
export function authenticateUser(username: string, password: string): User | null {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
}

export function getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;

    try {
        return JSON.parse(userJson);
    } catch {
        return null;
    }
}

export function setCurrentUser(user: User | null): void {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

export function logout(): void {
    setCurrentUser(null);
}

export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

export function hasPermission(permission: keyof RolePermissions): boolean {
    const user = getCurrentUser();
    if (!user) return false;

    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions[permission];
}

export function canAccessOrganization(organizationId: string): boolean {
    const user = getCurrentUser();
    if (!user) return false;

    // Admin and managers can access all
    if (user.role === 'admin' || user.role === 'manager') {
        return true;
    }

    // Supervisors and users can only access their organization and children
    if (user.organizationId) {
        // TODO: Implement hierarchy check
        return organizationId === user.organizationId || organizationId.startsWith(user.organizationId);
    }

    return false;
}

export function getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
        admin: 'Administrator',
        manager: 'Menejer',
        supervisor: 'Nazoratchi',
        user: 'Foydalanuvchi'
    };
    return labels[role];
}

export function getRoleColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
        admin: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
        manager: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
        supervisor: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
        user: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
    };
    return colors[role];
}
