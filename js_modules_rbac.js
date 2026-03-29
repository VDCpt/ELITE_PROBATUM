/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO RBAC (ROLE-BASED ACCESS CONTROL)
 * ============================================================================
 * Gerencia permissões de acesso com base no payload do JWT.
 * Roles disponíveis: admin, partner, senior_lawyer, junior_lawyer
 * ============================================================================
 */

class RBACManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.permissions = {
            admin: {
                canViewAllCases: true,
                canEditAllCases: true,
                canDeleteCases: true,
                canManageUsers: true,
                canViewAdminPanel: true,
                canViewVault: true,
                canExportAll: true,
                priority: 100
            },
            partner: {
                canViewAllCases: true,
                canEditAllCases: true,
                canDeleteCases: false,
                canManageUsers: true,
                canViewAdminPanel: true,
                canViewVault: true,
                canExportAll: true,
                priority: 90
            },
            senior_lawyer: {
                canViewAllCases: false,
                canEditAllCases: false,
                canDeleteCases: false,
                canManageUsers: false,
                canViewAdminPanel: false,
                canViewVault: true,
                canExportAll: false,
                priority: 70
            },
            junior_lawyer: {
                canViewAllCases: false,
                canEditAllCases: false,
                canDeleteCases: false,
                canManageUsers: false,
                canViewAdminPanel: false,
                canViewVault: false,
                canExportAll: false,
                priority: 50
            }
        };
    }

    /**
     * Inicializa o gestor com os dados do utilizador logado
     * @param {Object} userData - Dados do utilizador vindo do servidor
     * @param {string} token - JWT token
     */
    initialize(userData, token) {
        this.currentUser = userData;
        this.token = token;
        console.log(`[RBAC] Inicializado para: ${userData.name} (${userData.role})`);
        return this;
    }

    /**
     * Verifica se o utilizador tem permissão para aceder a um determinado caso
     * @param {string} caseId - ID do processo
     * @returns {boolean}
     */
    canAccessCase(caseId) {
        if (!this.currentUser) return false;
        
        const rolePerms = this.permissions[this.currentUser.role];
        if (!rolePerms) return false;

        // Admin e Sócios veem tudo
        if (rolePerms.canViewAllCases) return true;

        // Advogados: verificam se o caso está na sua lista assignedCases
        if (this.currentUser.assignedCases && this.currentUser.assignedCases.includes(caseId)) {
            return true;
        }

        console.warn(`[RBAC] Acesso negado ao caso ${caseId} para ${this.currentUser.name}`);
        return false;
    }

    /**
     * Filtra uma lista de casos, retornando apenas os permitidos
     * @param {Array} cases - Lista de objetos de caso (cada objeto deve ter uma propriedade 'id')
     * @returns {Array}
     */
    filterAccessibleCases(cases) {
        if (!this.currentUser) return [];
        
        const rolePerms = this.permissions[this.currentUser.role];
        if (rolePerms && rolePerms.canViewAllCases) return cases;

        return cases.filter(c => 
            this.currentUser.assignedCases && this.currentUser.assignedCases.includes(c.id)
        );
    }

    /**
     * Verifica permissão específica
     * @param {string} permissionKey - Ex: 'canViewAdminPanel', 'canDeleteCases'
     * @returns {boolean}
     */
    hasPermission(permissionKey) {
        if (!this.currentUser) return false;
        const rolePerms = this.permissions[this.currentUser.role];
        return rolePerms ? !!rolePerms[permissionKey] : false;
    }

    /**
     * Obtém o nível de prioridade do utilizador
     * @returns {number}
     */
    getPriority() {
        if (!this.currentUser) return 0;
        return this.permissions[this.currentUser.role]?.priority || 0;
    }

    /**
     * Verifica se o utilizador atual é Admin
     */
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    /**
     * Verifica se é Sócio
     */
    isPartner() {
        return this.currentUser?.role === 'partner';
    }

    /**
     * Verifica se é Advogado (qualquer nível)
     */
    isLawyer() {
        return this.currentUser?.role === 'senior_lawyer' || this.currentUser?.role === 'junior_lawyer';
    }

    /**
     * Limpa a sessão (logout)
     */
    clear() {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('elite_auth_token');
        localStorage.removeItem('elite_user_data');
    }

    /**
     * Persiste os dados no localStorage (apenas para persistência de sessão entre refreshes)
     */
    persist() {
        if (this.currentUser && this.token) {
            localStorage.setItem('elite_auth_token', this.token);
            localStorage.setItem('elite_user_data', JSON.stringify(this.currentUser));
        }
    }

    /**
     * Tenta restaurar sessão a partir do localStorage
     * @returns {boolean}
     */
    restore() {
        const token = localStorage.getItem('elite_auth_token');
        const userData = localStorage.getItem('elite_user_data');
        
        if (token && userData) {
            try {
                this.token = token;
                this.currentUser = JSON.parse(userData);
                console.log(`[RBAC] Sessão restaurada para: ${this.currentUser.name}`);
                return true;
            } catch (e) {
                console.error('[RBAC] Erro ao restaurar sessão:', e);
                this.clear();
            }
        }
        return false;
    }
}

// Instância global
window.RBAC = new RBACManager();

console.log('[ELITE] Módulo RBAC carregado.');