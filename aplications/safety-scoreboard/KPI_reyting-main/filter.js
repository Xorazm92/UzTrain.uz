// ===================================
// Hierarchical Filtering System
// ===================================

/**
 * Tashkilot darajasiga qarab filtrlangan korxonalarni qaytaradi
 * @param {string} organizationId - Tanlangan tashkilot ID
 * @param {Array} allCompanies - Barcha korxonalar ro'yxati
 * @returns {Array} - Filtrlangan korxonalar
 */
function getFilteredCompaniesByOrganization(organizationId, allCompanies) {
    if (!organizationId || organizationId === 'all') {
        // Barcha korxonalarni ko'rsatish
        return allCompanies;
    }

    // 1. Avval tanlangan tashkilotning o'zini ro'yxatdan qidiramiz
    const selectedOrg = allCompanies.find(c => c.id === organizationId);

    // 2. Agar tashkilot ro'yxatda bo'lsa va u 'aj_head' bo'lsa
    if (selectedOrg && selectedOrg.id === 'aj_head') {
        return allCompanies.filter(c =>
            c.level === 'supervisor' && c.supervisorId === 'aj_head'
        );
    }

    // 3. Agar tashkilot ro'yxatda bo'lsa va u 'supervisor' bo'lsa
    if (selectedOrg && selectedOrg.level === 'supervisor') {
        return allCompanies.filter(c =>
            c.supervisorId === organizationId
        );
    }

    // 4. Agar tashkilot ro'yxatda BO'LMASA (lekin menyuda bor, masalan Toshkent MTU)
    // Biz baribir unga tegishli korxonalarni (supervisorId orqali) qidiramiz
    if (!selectedOrg) {
        // Taxmin qilamizki, bu supervisor ID
        const children = allCompanies.filter(c => c.supervisorId === organizationId);

        // Agar bolalari topilsa, o'shalarni qaytaramiz
        if (children.length > 0) {
            return children;
        }

        // Agar hech narsa topilmasa, demak bu shunchaki ma'lumot yo'q holat
        return [];
    }

    // 5. Agar oddiy korxona tanlangan bo'lsa, faqat o'zini ko'rsatish
    return [selectedOrg];
}

/**
 * Ierarxiya darajasiga qarab tashkilotlar ro'yxatini olish
 * @param {string} level - Daraja: 'all', 'management', 'supervisor', 'subsidiary'
 * @param {Array} allCompanies - Barcha korxonalar
 * @returns {Array} - Filtrlangan tashkilotlar
 */
function getOrganizationsByLevel(level, allCompanies) {
    if (level === 'all') {
        return allCompanies;
    }

    if (level === 'management') {
        return allCompanies.filter(c => c.level === 'management');
    }

    if (level === 'supervisor') {
        return allCompanies.filter(c => c.level === 'supervisor');
    }

    if (level === 'subsidiary') {
        return allCompanies.filter(c => c.level === 'subsidiary');
    }

    return allCompanies;
}

/**
 * Tashkilot uchun reyting kontekstini aniqlash
 * @param {Object} organization - Tashkilot
 * @returns {Object} - Kontekst ma'lumotlari
 */
function getRankingContext(organization) {
    if (!organization) {
        return {
            title: "Barcha Korxonalar Reytingi",
            description: "O'zbekiston Temir Yo'llari tizimidagi barcha korxonalar",
            level: 'all'
        };
    }

    if (organization.id === 'aj_head') {
        return {
            title: "Yuqori Tashkilotlar Reytingi",
            description: "O'zbekiston Temir Yo'llari AJ ga to'g'ridan-to'g'ri hisobot beruvchi tashkilotlar",
            level: 'supervisor',
            parentName: organization.name
        };
    }

    if (organization.level === 'supervisor') {
        return {
            title: `${organization.name} - Korxonalar Reytingi`,
            description: `${organization.name} tarkibidagi korxonalar reytingi`,
            level: 'subsidiary',
            parentName: organization.name
        };
    }

    return {
        title: organization.name,
        description: "Korxona ma'lumotlari",
        level: 'single',
        parentName: organization.name
    };
}

/**
 * Tashkilot selektorini yaratish - Yaxshilangan versiya
 * Faqat ma'lumot kiritilgan korxonalarni ko'rsatadi
 * @param {Array} companies - Korxonalar ro'yxati
 * @param {boolean} showOnlyWithData - Faqat ma'lumotli korxonalarni ko'rsatish
 * @returns {string} - HTML
 */
function createOrganizationSelector(companies, showOnlyWithData = false) {
    // Strukturadan barcha tashkilotlarni olamiz
    const structureData = window.UZ_RAILWAY_DATA || [];
    
    // Ma'lumot kiritilgan korxonalar ID lari
    const companiesWithData = companies.filter(c => c.overallIndex > 0).map(c => c.id);
    const companiesWithDataSet = new Set(companiesWithData);
    
    // Foydalanish uchun manbani tanlaymiz
    const dataSource = structureData.length > 0 ? structureData : companies;
    
    const management = dataSource.filter(c => c.level === 'management');
    const supervisors = dataSource.filter(c => c.level === 'supervisor');

    // Ma'lumot kiritilgan supervisorlarni topamiz (ularning subsidiary lari mavjud)
    const supervisorsWithData = supervisors.filter(sup => {
        const hasOwnData = companiesWithDataSet.has(sup.id);
        const hasChildData = companies.some(c => c.supervisorId === sup.id && c.overallIndex > 0);
        return hasOwnData || hasChildData;
    });

    let html = `
        <div class="organization-selector">
            <label for="org-filter">
                <span class="filter-icon">🏢</span>
                Tashkilotni tanlang:
            </label>
            <select id="org-filter" class="org-select">
                <option value="all">📊 Barcha korxonalar (${companiesWithData.length} ta)</option>
    `;

    // Boshqaruv (Management)
    if (management.length > 0) {
        html += `<optgroup label="🏛️ Boshqaruv">`;
        management.forEach(org => {
            html += `<option value="${org.id}">${org.name}</option>`;
        });
        html += `</optgroup>`;
    }

    // Yuqori tashkilotlarni guruhlash
    const supervisorsByParent = {};
    supervisors.forEach(org => {
        const parentId = org.supervisorId || 'other';
        if (!supervisorsByParent[parentId]) {
            supervisorsByParent[parentId] = [];
        }
        supervisorsByParent[parentId].push(org);
    });

    // Yuqori Tashkilotlar (AJ ga to'g'ridan-to'g'ri)
    if (supervisorsByParent['aj_head'] && supervisorsByParent['aj_head'].length > 0) {
        html += `<optgroup label="🏭 Yuqori Tashkilotlar">`;
        supervisorsByParent['aj_head'].forEach(org => {
            const childCount = companies.filter(c => c.supervisorId === org.id && c.overallIndex > 0).length;
            const countText = childCount > 0 ? ` (${childCount})` : '';
            html += `<option value="${org.id}">📍 ${org.name}${countText}</option>`;
        });
        html += `</optgroup>`;
    }

    // Infratuzilma MTUlari
    if (supervisorsByParent['infra_aj'] && supervisorsByParent['infra_aj'].length > 0) {
        html += `<optgroup label="🚉 Temiryo'linfratuzilma">`;
        supervisorsByParent['infra_aj'].forEach(org => {
            const childCount = companies.filter(c => c.supervisorId === org.id && c.overallIndex > 0).length;
            const countText = childCount > 0 ? ` (${childCount})` : '';
            html += `<option value="${org.id}">🚂 ${org.name}${countText}</option>`;
        });
        html += `</optgroup>`;
    }

    html += `
            </select>
        </div>
    `;

    return html;
}

/**
 * Korxona qo'shish uchun yuqori tashkilot selektori
 * Bu funksiya filter selectoridan farqli - barcha mumkin bo'lgan yuqori tashkilotlarni ko'rsatadi
 * @returns {Array} - Yuqori tashkilotlar ro'yxati
 */
function getParentOrganizationsForForm() {
    const structureData = window.UZ_RAILWAY_DATA || [];
    return structureData.filter(c => c.level === 'management' || c.level === 'supervisor');
}

// Make globally accessible
window.getFilteredCompaniesByOrganization = getFilteredCompaniesByOrganization;
window.getOrganizationsByLevel = getOrganizationsByLevel;
window.getRankingContext = getRankingContext;
window.createOrganizationSelector = createOrganizationSelector;
window.getParentOrganizationsForForm = getParentOrganizationsForForm;
