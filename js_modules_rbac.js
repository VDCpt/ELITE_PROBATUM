/**
 * ============================================================================
 * ELITE PROBATUM v3.0.0 — MÓDULO RBAC (Role-Based Access Control)
 * ============================================================================
 * Funcionalidades:
 * 1. Definição de perfis (admin, socio, advogado, estagiario)
 * 2. Matriz de permissões por perfil
 * 3. Filtragem de processos por utilizador
 * 4. Controlo de visibilidade da navegação
 * 5. Adaptação da UI por perfil
 * ============================================================================
 */

(function () {
    'use strict';

    // =========================================================================
    // DEFINIÇÃO DE PERFIS E PERMISSÕES
    // =========================================================================

    const ROLES = {
        ADMIN:      'admin',
        SOCIO:      'socio',
        ADVOGADO:   'advogado',
        ESTAGIARIO: 'estagiario'
    };

    const ROLE_LABELS = {
        admin:      'Administrador',
        socio:      'Sócio',
        advogado:   'Advogado',
        estagiario: 'Estagiário'
    };

    // Matriz de permissões: o que cada perfil pode fazer
    const PERMISSIONS = {
        admin: {
            viewAllCases:       true,
            editAllCases:       true,
            deleteAllCases:     true,
            viewFinancial:      true,
            manageUsers:        true,
            switchDataMode:     true,
            viewAdmin:          true,
            viewInsolvency:     true,
            viewLabor:          true,
            viewLitigation:     true,
            viewQuestionnaire:  true,
            viewEvidence:       true,
            viewAdversary:      true,
            viewSimulator:      true,
            viewDeadlines:      true,
            viewActivityLog:    true,
            viewTruthArch:      true,
            viewValueDashboard: true,
            exportPDF:          true,
            exportForensic:     true,
            accessJudgeBio:     true,
            accessNeuralLit:    true,
            accessMarket:       true,
            accessGamification: true
        },
        socio: {
            viewAllCases:       true,
            editAllCases:       true,
            deleteAllCases:     false,
            viewFinancial:      true,
            manageUsers:        false,
            switchDataMode:     true,
            viewAdmin:          false,
            viewInsolvency:     true,
            viewLabor:          true,
            viewLitigation:     true,
            viewQuestionnaire:  true,
            viewEvidence:       true,
            viewAdversary:      true,
            viewSimulator:      true,
            viewDeadlines:      true,
            viewActivityLog:    true,
            viewTruthArch:      true,
            viewValueDashboard: true,
            exportPDF:          true,
            exportForensic:     true,
            accessJudgeBio:     true,
            accessNeuralLit:    true,
            accessMarket:       true,
            accessGamification: true
        },
        advogado: {
            viewAllCases:       false,
            editAllCases:       false,
            deleteAllCases:     false,
            viewFinancial:      false,
            manageUsers:        false,
            switchDataMode:     false,
            viewAdmin:          false,
            viewInsolvency:     true,
            viewLabor:          true,
            viewLitigation:     true,
            viewQuestionnaire:  true,
            viewEvidence:       true,
            viewAdversary:      true,
            viewSimulator:      true,
            viewDeadlines:      true,
            viewActivityLog:    false,
            viewTruthArch:      true,
            viewValueDashboard: false,
            exportPDF:          true,
            exportForensic:     true,
            accessJudgeBio:     true,
            accessNeuralLit:    true,
            accessMarket:       false,
            accessGamification: true
        },
        estagiario: {
            viewAllCases:       false,
            editAllCases:       false,
            deleteAllCases:     false,
            viewFinancial:      false,
            manageUsers:        false,
            switchDataMode:     false,
            viewAdmin:          false,
            viewInsolvency:     true,
            viewLabor:          true,
            viewLitigation:     false,
            viewQuestionnaire:  true,
            viewEvidence:       true,
            viewAdversary:      false,
            viewSimulator:      false,
            viewDeadlines:      true,
            viewActivityLog:    false,
            viewTruthArch:      false,
            viewValueDashboard: false,
            exportPDF:          false,
            exportForensic:     false,
            accessJudgeBio:     false,
            accessNeuralLit:    false,
            accessMarket:       false,
            accessGamification: true
        }
    };

    // Mapeamento de views para permissões necessárias
    const VIEW_PERMISSIONS = {
        dashboard:         null,
        cases:             null,
        insolvency:        'viewInsolvency',
        labor:             'viewLabor',
        litigation:        'viewLitigation',
        questionnaire:     'viewQuestionnaire',
        evidence:          'viewEvidence',
        adversary:         'viewAdversary',
        simulator:         'viewSimulator',
        deadlines:         'viewDeadlines',
        activitylog:       'viewActivityLog',
        truth_architecture: 'viewTruthArch',
        value_dashboard:   'viewValueDashboard',
        admin:             'viewAdmin'
    };

    // =========================================================================
    // RBAC ENGINE
    // =========================================================================

    const EliteRBAC = {

        /**
         * Verifica se o utilizador corrente tem uma permissão específica
         */
        can(permission) {
            const user = window.ELITE_USER;
            if (!user || !user.role) return false;
            const perms = PERMISSIONS[user.role];
            if (!perms) return false;
            return !!perms[permission];
        },

        /**
         * Verifica se pode aceder a uma view
         */
        canView(viewName) {
            const permRequired = VIEW_PERMISSIONS[viewName];
            if (!permRequired) return true;
            return this.can(permRequired);
        },

        /**
         * Filtra processos conforme o perfil do utilizador
         * Admin/sócio: todos | Advogado/estagiário: apenas assignedCases
         */
        filterCases(cases) {
            const user = window.ELITE_USER;
            if (!user) return [];
            if (this.can('viewAllCases')) return cases;
            const assigned = user.assignedCases || [];
            return cases.filter(c =>
                assigned.includes(c.id) ||
                c.assignedTo === user.id
            );
        },

        /**
         * Retorna label legível do perfil
         */
        getRoleLabel(role) {
            return ROLE_LABELS[role] || role;
        },

        /**
         * Retorna o perfil corrente
         */
        getRole() {
            return window.ELITE_USER ? window.ELITE_USER.role : null;
        },

        /**
         * Aplica visibilidade dos itens de navegação conforme perfil
         */
        applyNavVisibility() {
            const navItems = document.querySelectorAll('.nav-item[data-view]');
            navItems.forEach(item => {
                const view = item.getAttribute('data-view');
                if (view && !this.canView(view)) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                }
            });
        },

        /**
         * Aplica restrições de botões conforme perfil
         * (eliminar, exportar, etc.)
         */
        applyUIRestrictions() {
            // Botão exportar PDF
            const exportBtn = document.getElementById('exportReportBtn');
            if (exportBtn) {
                exportBtn.style.display = this.can('exportPDF') ? '' : 'none';
            }
            // Botão exportar para dispositivo
            const mobileExportBtn = document.getElementById('mobileExportBtn');
            if (mobileExportBtn) {
                mobileExportBtn.style.display = this.can('exportPDF') ? '' : 'none';
            }
        },

        /**
         * Gera o badge de modo de dados (DEMO/REAL)
         */
        renderDataModeBadge(dataMode) {
            const existing = document.getElementById('dataModeIndicator');
            if (existing) existing.remove();

            const badge = document.createElement('div');
            badge.id = 'dataModeIndicator';
            badge.style.cssText = [
                'position: fixed',
                'bottom: 20px',
                'right: 20px',
                'z-index: 9999',
                'padding: 6px 14px',
                'border-radius: 20px',
                'font-family: "JetBrains Mono", monospace',
                'font-size: 0.65rem',
                'font-weight: 700',
                'letter-spacing: 2px',
                'pointer-events: none',
                dataMode === 'demo'
                    ? 'background: rgba(245, 166, 35, 0.15); color: #F5A623; border: 1px solid #F5A623;'
                    : 'background: rgba(0, 230, 118, 0.15); color: #00E676; border: 1px solid #00E676;'
            ].join('; ');
            badge.textContent = dataMode === 'demo' ? '● MODO DEMO' : '● DADOS REAIS';

            document.body.appendChild(badge);
        },

        /**
         * Actualiza informação do utilizador na sidebar
         */
        updateUserDisplay() {
            const user = window.ELITE_USER;
            if (!user) return;

            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            const userPhone = document.getElementById('userPhone');

            if (userName) userName.textContent = user.name;
            if (userRole) userRole.textContent = `${this.getRoleLabel(user.role)} · ${user.team}`;
            if (userPhone && user.phone) userPhone.textContent = user.phone;
        },

        /**
         * Inicializa o módulo RBAC após login
         */
        initialize(user, dataMode) {
            window.ELITE_USER = user;
            window.ELITE_DATA_MODE = dataMode || 'demo';
            this.applyNavVisibility();
            this.applyUIRestrictions();
            this.updateUserDisplay();
            this.renderDataModeBadge(window.ELITE_DATA_MODE);
            console.log(`[RBAC] Inicializado para ${user.name} (${user.role}) | Modo: ${window.ELITE_DATA_MODE}`);
        }
    };

    // Exposição global
    window.EliteRBAC   = EliteRBAC;
    window.ELITE_ROLES = ROLES;
    window.ELITE_PERMISSIONS = PERMISSIONS;

    console.log('[ELITE] RBAC Module carregado — v3.0.0');

})();
