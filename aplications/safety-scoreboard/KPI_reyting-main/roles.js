// ===================================
// Role Management Module
// ===================================

/**
 * Foydalanuvchi rollari
 */
const USER_ROLES = {
    MANAGEMENT: {
        id: 'management',
        name: 'Boshqaruv',
        icon: '🏢',
        color: '#3498db',
        permissions: {
            viewAll: true,
            viewGroup: true,
            viewOwn: true,
            editAll: true,
            editGroup: true,
            editOwn: true,
            addCompany: true,
            deleteCompany: true,
            exportData: true,
            viewReports: true,
            manageUsers: true
        }
    },
    SUPERVISOR: {
        id: 'supervisor',
        name: 'Nazoratchi',
        icon: '👔',
        color: '#9b59b6',
        permissions: {
            viewAll: false,
            viewGroup: true,
            viewOwn: true,
            editAll: false,
            editGroup: true,
            editOwn: true,
            addCompany: true,
            deleteCompany: false,
            exportData: true,
            viewReports: true,
            manageUsers: false
        }
    },
    SUBSIDIARY: {
        id: 'subsidiary',
        name: 'Korxona',
        icon: '🏭',
        color: '#95a5a6',
        permissions: {
            viewAll: false,
            viewGroup: false,
            viewOwn: true,
            editAll: false,
            editGroup: false,
            editOwn: true,
            addCompany: false,
            deleteCompany: false,
            exportData: false,
            viewReports: false,
            manageUsers: false
        }
    }
};

/**
 * Joriy foydalanuvchi
 */
let currentUser = null;

/**
 * Foydalanuvchini o'rnatish
 */
function setCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUIForRole();
}

/**
 * Joriy foydalanuvchini olish
 */
function getCurrentUser() {
    if (!currentUser) {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            currentUser = JSON.parse(stored);
        } else {
            // Default: Management role
            currentUser = {
                role: 'management',
                companyId: null,
                companyName: 'Boshqaruv',
                name: 'Administrator'
            };
        }
    }
    return currentUser;
}

/**
 * Rol ruxsatini tekshirish
 */
function hasPermission(permission) {
    const user = getCurrentUser();
    const role = USER_ROLES[user.role.toUpperCase()];
    return role && role.permissions[permission];
}

/**
 * Rol ma'lumotlarini olish
 */
function getRoleInfo(roleId) {
    return USER_ROLES[roleId.toUpperCase()] || USER_ROLES.SUBSIDIARY;
}

/**
 * UI ni rolga moslash
 */
function updateUIForRole() {
    const user = getCurrentUser();
    const role = getRoleInfo(user.role);

    // Tugmalarni ko'rsatish/yashirish
    document.querySelectorAll('[data-permission]').forEach(element => {
        const permission = element.dataset.permission;
        if (role.permissions[permission]) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });

    // Rol badgeni ko'rsatish
    updateRoleBadge(user, role);
}

/**
 * Rol badge yangilash
 */
function updateRoleBadge(user, role) {
    const badge = document.getElementById('role-badge');
    if (badge) {
        badge.innerHTML = `
            <span class="role-icon">${role.icon}</span>
            <span class="role-name">${role.name}</span>
            <span class="user-name">${user.companyName || user.name}</span>
        `;
        badge.style.backgroundColor = role.color;
    }
}

/**
 * Rol selector yaratish
 */
function renderRoleSelector() {
    const selector = document.getElementById('role-selector');
    if (!selector) return;

    let html = '<div class="role-selector-container">';
    html += '<h3>Rolni tanlang:</h3>';
    html += '<div class="role-options">';

    Object.values(USER_ROLES).forEach(role => {
        html += `
            <div class="role-option" onclick="selectRole('${role.id}')">
                <span class="role-icon">${role.icon}</span>
                <span class="role-name">${role.name}</span>
                <div class="role-description">
                    ${getRoleDescription(role)}
                </div>
            </div>
        `;
    });

    html += '</div>';
    html += '</div>';

    selector.innerHTML = html;
}

/**
 * Rol tavsifi
 */
function getRoleDescription(role) {
    const descriptions = {
        management: 'Barcha korxonalarni ko\'rish va boshqarish',
        supervisor: 'O\'z filiallaringizni boshqarish',
        subsidiary: 'Faqat o\'z korxonangiz ma\'lumotlari'
    };
    return descriptions[role.id] || '';
}

/**
 * Rolni tanlash
 */
function selectRole(roleId) {
    const role = getRoleInfo(roleId);

    if (roleId === 'management') {
        setCurrentUser({
            role: roleId,
            companyId: null,
            companyName: 'Boshqaruv',
            name: 'Administrator'
        });
    } else {
        // Korxonani tanlash modali
        showCompanySelector(roleId);
    }
}

/**
 * Korxona tanlash modali
 */
function showCompanySelector(roleId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Korxonani tanlang</h3>
            <div id="company-list"></div>
            <button onclick="closeModal()">Bekor qilish</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Korxonalar ro'yxati
    const filteredCompanies = companies.filter(c => c.level === roleId);
    const list = document.getElementById('company-list');

    list.innerHTML = filteredCompanies.map(company => `
        <div class="company-option" onclick="selectCompany('${roleId}', '${company.id}', '${company.name}')">
            ${company.name}
        </div>
    `).join('');
}

/**
 * Korxonani tanlash
 */
function selectCompany(roleId, companyId, companyName) {
    setCurrentUser({
        role: roleId,
        companyId: companyId,
        companyName: companyName,
        name: companyName
    });

    closeModal();
    renderDashboard();
}

/**
 * Modalni yopish
 */
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Rol o'zgartirish tugmasi
 */
function renderRoleSwitcher() {
    const switcher = document.getElementById('role-switcher');
    if (!switcher) return;

    const user = getCurrentUser();
    const role = getRoleInfo(user.role);

    switcher.innerHTML = `
        <button class="role-switch-btn" onclick="showRoleSelector()">
            <span class="role-icon">${role.icon}</span>
            <span class="role-name">${role.name}</span>
            <span class="change-icon">⚙️</span>
        </button>
    `;
}

/**
 * Rol selector ko'rsatish
 */
function showRoleSelector() {
    renderRoleSelector();
    const selector = document.getElementById('role-selector');
    if (selector) {
        selector.style.display = 'block';
    }
}

/**
 * Dashboard ni rolga moslash
 */
function getDashboardConfig() {
    const user = getCurrentUser();
    const role = getRoleInfo(user.role);

    return {
        showAllCompanies: role.permissions.viewAll,
        showGroupCompanies: role.permissions.viewGroup,
        showOwnCompany: role.permissions.viewOwn,
        canEdit: role.permissions.editOwn || role.permissions.editGroup || role.permissions.editAll,
        canAdd: role.permissions.addCompany,
        canDelete: role.permissions.deleteCompany,
        canExport: role.permissions.exportData,
        showHierarchy: role.permissions.viewAll || role.permissions.viewGroup,
        showReports: role.permissions.viewReports
    };
}
