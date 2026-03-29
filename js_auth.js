/**
 * ============================================================================
 * ELITE PROBATUM v3.0.0 — MÓDULO DE AUTENTICAÇÃO
 * JWT + 2FA + SERVICE WORKER REGISTRATION
 * ============================================================================
 * Substitui os dois blocos inline de <script> do index.html
 * Funcionalidades:
 * 1. Registo do Service Worker
 * 2. Autenticação via API backend (JWT)
 * 3. Fluxo de 2FA (verificação de código SMS)
 * 4. Sessão em memória (não localStorage)
 * 5. Refresh automático do token antes da expiração
 * 6. Logout com revogação no servidor
 * 7. Pedido de acesso (pré-autenticação)
 * ============================================================================
 */

(function () {
    'use strict';

    // =========================================================================
    // REGISTO DO SERVICE WORKER
    // =========================================================================

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(reg => {
            console.log('[ELITE] Service Worker registado:', reg.scope);
        }).catch(err => {
            console.error('[ELITE] Erro no Service Worker:', err);
        });
    }

    // =========================================================================
    // ESTADO DA SESSÃO (APENAS EM MEMÓRIA — nunca em localStorage)
    // =========================================================================

    let SESSION = {
        accessToken:    null,
        refreshToken:   null,
        user:           null,
        tempToken:      null,
        refreshTimer:   null,
        deviceId:       null
    };

    function getDeviceId() {
        if (SESSION.deviceId) return SESSION.deviceId;
        let device = localStorage.getItem('elite_device_id');
        if (!device) {
            device = 'DEV_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
            localStorage.setItem('elite_device_id', device);
        }
        SESSION.deviceId = device;
        return device;
    }

    /**
     * Chama a API com o token de autorização
     */
    async function apiCall(method, path, body, requireAuth = true) {
        const headers = { 'Content-Type': 'application/json' };
        if (requireAuth && SESSION.accessToken) {
            headers['Authorization'] = 'Bearer ' + SESSION.accessToken;
        }
        const opts = { method, headers };
        if (body) opts.body = JSON.stringify(body);

        const response = await fetch(path, opts);

        if (response.status === 401 && requireAuth) {
            // Tentar refresh
            const refreshed = await tryRefreshToken();
            if (refreshed) {
                headers['Authorization'] = 'Bearer ' + SESSION.accessToken;
                const retry = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
                return retry;
            } else {
                // Forçar logout
                handleLogout(true);
                throw new Error('Sessão expirada.');
            }
        }
        return response;
    }

    /**
     * Tenta renovar o access token usando o refresh token
     */
    async function tryRefreshToken() {
        if (!SESSION.refreshToken) return false;
        try {
            const res = await fetch('/api/auth/refresh', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ refreshToken: SESSION.refreshToken })
            });
            if (!res.ok) return false;
            const data = await res.json();
            SESSION.accessToken = data.token;
            window.ELITE_SECURE_HASH = SESSION.accessToken;
            scheduleTokenRefresh(data.token);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Agenda o refresh automático do token antes da expiração
     */
    function scheduleTokenRefresh(token) {
        if (SESSION.refreshTimer) clearTimeout(SESSION.refreshTimer);
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const msUntilExpiry = (payload.exp * 1000) - Date.now();
            const refreshAt = msUntilExpiry - 5 * 60 * 1000; // 5 min antes
            if (refreshAt > 0) {
                SESSION.refreshTimer = setTimeout(tryRefreshToken, refreshAt);
            }
        } catch (e) {
            console.warn('[Auth] Não foi possível agendar refresh do token:', e.message);
        }
    }

    // =========================================================================
    // FLUXO DE AUTENTICAÇÃO
    // =========================================================================

    function showLoginError(msg) {
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.textContent = msg;
            loginError.style.display = 'block';
        }
    }

    function hideLoginError() {
        const loginError = document.getElementById('loginError');
        if (loginError) loginError.style.display = 'none';
    }

    /**
     * Passo 1: validar credenciais → obter tempToken → pedir código 2FA
     */
    async function authenticate() {
        const username = document.getElementById('username')?.value.trim() || '';
        const password = document.getElementById('password')?.value.trim() || '';

        if (!username || !password) {
            showLoginError('Introduza o utilizador e a palavra-passe.');
            return;
        }

        hideLoginError();
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.disabled = true;
            authBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A autenticar...';
        }

        try {
            const res = await fetch('/api/auth/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                showLoginError(data.error || 'Credenciais inválidas.');
                return;
            }

            SESSION.tempToken = data.tempToken;

            // Mostrar modal 2FA
            const tfModal = document.getElementById('twoFactorModal');
            if (tfModal) {
                const tfInfo = document.getElementById('twoFactorPhoneInfo');
                if (tfInfo && data.phone) tfInfo.textContent = `Enviado para ${data.phone}`;
                tfModal.style.display = 'flex';
                document.getElementById('twoFactorCode')?.focus();
            }

            if (window.EliteUtils) {
                window.EliteUtils.showToast(data.message || 'Código enviado para o seu telemóvel.', 'info');
            }

        } catch (e) {
            showLoginError('Erro de ligação ao servidor. Verifique a rede.');
            console.error('[Auth] Erro:', e);
        } finally {
            if (authBtn) {
                authBtn.disabled = false;
                authBtn.innerHTML = '<i class="fas fa-key"></i> <span data-i18n="login_button">AUTENTICAR</span>';
            }
        }
    }

    /**
     * Passo 2: verificar código 2FA → obter JWT → iniciar sessão
     */
    async function verifyTwoFactor() {
        const code = document.getElementById('twoFactorCode')?.value.trim() || '';
        if (!code || code.length !== 6) {
            if (window.EliteUtils) window.EliteUtils.showToast('Introduza o código de 6 dígitos.', 'warning');
            return;
        }
        if (!SESSION.tempToken) {
            if (window.EliteUtils) window.EliteUtils.showToast('Sessão expirada. Faça login novamente.', 'error');
            document.getElementById('twoFactorModal').style.display = 'none';
            return;
        }

        const verifyBtn = document.getElementById('verifyTwoFactorBtn');
        if (verifyBtn) { verifyBtn.disabled = true; verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

        try {
            const res = await fetch('/api/auth/2fa/verify', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ tempToken: SESSION.tempToken, code })
            });

            const data = await res.json();

            if (!res.ok) {
                if (window.EliteUtils) window.EliteUtils.showToast(data.error || 'Código inválido.', 'error');
                document.getElementById('twoFactorCode').value = '';
                return;
            }

            // Sessão estabelecida
            SESSION.accessToken  = data.token;
            SESSION.refreshToken = data.refreshToken;
            SESSION.user         = data.user;
            SESSION.tempToken    = null;

            window.ELITE_SECURE_HASH = SESSION.accessToken;
            window.ELITE_SESSION_ID  = SESSION.accessToken;
            window.ELITE_DEVICE_ID   = getDeviceId();

            scheduleTokenRefresh(SESSION.accessToken);

            // Obter settings do servidor (modo demo/real)
            let dataMode = 'demo';
            try {
                const sRes  = await apiCall('GET', '/api/settings');
                const sData = await sRes.json();
                dataMode = sData.dataMode || 'demo';
            } catch (e) { /* manter demo */ }

            document.getElementById('twoFactorModal').style.display = 'none';
            completeAuthentication(data.user, dataMode);

        } catch (e) {
            if (window.EliteUtils) window.EliteUtils.showToast('Erro de ligação. Tente novamente.', 'error');
            console.error('[Auth] Erro 2FA:', e);
        } finally {
            if (verifyBtn) { verifyBtn.disabled = false; verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> VERIFICAR'; }
        }
    }

    /**
     * Reenviar código 2FA
     */
    async function resendTwoFactor() {
        document.getElementById('twoFactorCode').value = '';
        // Re-login para obter novo tempToken
        const username = document.getElementById('username')?.value.trim() || '';
        const password = document.getElementById('password')?.value.trim() || '';
        if (!username || !password) {
            document.getElementById('twoFactorModal').style.display = 'none';
            return;
        }
        try {
            const res  = await fetch('/api/auth/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                SESSION.tempToken = data.tempToken;
                if (window.EliteUtils) window.EliteUtils.showToast('Novo código enviado.', 'info');
            }
        } catch (e) {
            if (window.EliteUtils) window.EliteUtils.showToast('Erro ao reenviar código.', 'error');
        }
    }

    /**
     * Completa a autenticação: inicializa RBAC e app
     */
    function completeAuthentication(user, dataMode) {
        const loginOverlay  = document.getElementById('loginOverlay');
        const appContainer  = document.getElementById('appContainer');

        loginOverlay.style.transition = 'opacity 0.3s ease';
        loginOverlay.style.opacity    = '0';

        setTimeout(() => {
            loginOverlay.style.display = 'none';
            appContainer.style.display = 'flex';
            appContainer.classList.add('visible');

            // Inicializar RBAC
            if (window.EliteRBAC) {
                window.EliteRBAC.initialize(user, dataMode);
            } else {
                window.ELITE_USER = user;
                window.ELITE_DATA_MODE = dataMode;
            }

            // Atualizar stats do header via API
            updateHeaderStatsFromServer();

            // Inicializar módulos
            if (window.ValueEfficiencyEngine && typeof window.ValueEfficiencyEngine.initialize === 'function') {
                window.ValueEfficiencyEngine.initialize();
            }
            if (window.EliteProbatum && typeof window.EliteProbatum.initDashboard === 'function') {
                window.EliteProbatum.initDashboard();
            }

            if (window.EliteUtils) {
                window.EliteUtils.showToast(
                    `Bem-vindo, ${user.name} | Perfil: ${window.EliteRBAC ? window.EliteRBAC.getRoleLabel(user.role) : user.role} | Modo: ${dataMode.toUpperCase()}`,
                    'success'
                );
            }

        }, 300);
    }

    /**
     * Atualiza stats do cabeçalho via API (ou fallback para mock)
     */
    async function updateHeaderStatsFromServer() {
        try {
            const res  = await apiCall('GET', '/api/cases');
            const cases = await res.json();
            const activeCases   = cases.filter(c => c.status === 'active').length;
            const totalValue    = cases.reduce((s, c) => s + (c.value || 0), 0);
            const avgProb       = cases.length > 0
                ? cases.reduce((s, c) => s + (c.successProbability || 0.6), 0) / cases.length
                : 0;

            const el1 = document.getElementById('headerActiveCases');
            const el2 = document.getElementById('headerDisputeValue');
            const el3 = document.getElementById('headerSuccessRate');
            const el4 = document.getElementById('casesBadge');

            if (el1) el1.textContent = activeCases;
            if (el2 && window.EliteUtils) el2.textContent = window.EliteUtils.formatCurrency(totalValue);
            if (el3 && window.EliteUtils) el3.textContent = window.EliteUtils.formatPercentage(avgProb * 100);
            if (el4) el4.textContent = activeCases;
        } catch (e) {
            // fallback: serão actualizados pelo js_core_app.js
        }
    }

    /**
     * Logout com revogação no servidor
     */
    async function handleLogout(forced = false) {
        if (!forced && !confirm('Terminar sessão?')) return;

        try {
            if (SESSION.accessToken) {
                await apiCall('POST', '/api/auth/logout');
            }
        } catch (e) { /* ignorar erro no logout */ }

        if (SESSION.refreshTimer) clearTimeout(SESSION.refreshTimer);

        SESSION.accessToken  = null;
        SESSION.refreshToken = null;
        SESSION.user         = null;
        SESSION.tempToken    = null;

        window.ELITE_SESSION_ID  = null;
        window.ELITE_SECURE_HASH = null;
        window.ELITE_USER        = null;
        window.ELITE_DATA_MODE   = null;

        const dataModeIndicator = document.getElementById('dataModeIndicator');
        if (dataModeIndicator) dataModeIndicator.remove();

        if (window.CourtDeadlines?.stopMonitoring) window.CourtDeadlines.stopMonitoring();

        const appContainer = document.getElementById('appContainer');
        const loginOverlay = document.getElementById('loginOverlay');

        if (appContainer) appContainer.style.display = 'none';
        if (loginOverlay) {
            loginOverlay.style.opacity = '0';
            loginOverlay.style.display = 'flex';
            requestAnimationFrame(() => { loginOverlay.style.opacity = '1'; });
        }

        document.getElementById('username')?.dispatchEvent(new Event('focus'));
        if (window.EliteUtils && !forced) {
            window.EliteUtils.showToast('Sessão terminada com segurança.', 'info');
        }
    }

    // =========================================================================
    // PEDIDO DE ACESSO (pré-autenticação)
    // =========================================================================

    async function submitAccessRequest(e) {
        e.preventDefault();
        const name   = document.getElementById('requestName')?.value  || '';
        const email  = document.getElementById('requestEmail')?.value || '';
        const phone  = document.getElementById('requestPhone')?.value || '';
        const nif    = document.getElementById('requestNif')?.value   || '';
        const role   = document.getElementById('requestRole')?.value  || '';
        const reason = document.getElementById('requestReason')?.value || '';

        if (!name || !email || !phone || !nif) {
            alert('Preencha todos os campos obrigatórios (Nome, E-mail, Telemóvel, NIF).');
            return;
        }

        try {
            const res  = await fetch('/api/access-request', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, email, phone, nif, role, reason })
            });
            const data = await res.json();

            if (res.ok) {
                alert(`[ELITE PROBATUM] Pedido registado.\nID: ${data.id}\n\nO Master Hash Controller analisará o pedido e responderá em até 48h.`);
                document.getElementById('accessRequestModal').style.display = 'none';
                document.getElementById('loginOverlay').style.display = 'flex';
                document.getElementById('accessRequestForm')?.reset();
            } else {
                alert('Erro ao registar pedido: ' + (data.error || 'Erro desconhecido'));
            }
        } catch (e) {
            alert('Erro de ligação ao servidor.');
        }
    }

    // =========================================================================
    // EXPOSIÇÃO DE FUNÇÕES PARA API INTERNA
    // =========================================================================

    window.EliteAuth = {
        apiCall,
        getSession:    () => SESSION,
        getToken:      () => SESSION.accessToken,
        getUser:       () => SESSION.user,
        handleLogout,
        tryRefreshToken
    };

    // =========================================================================
    // EVENT LISTENERS — registados após DOM ready
    // =========================================================================

    document.addEventListener('DOMContentLoaded', () => {

        // Autenticar ao clicar no botão
        document.getElementById('authBtn')?.addEventListener('click', authenticate);

        // Enter no campo de password
        document.getElementById('password')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') authenticate();
        });

        // Verificar 2FA
        document.getElementById('verifyTwoFactorBtn')?.addEventListener('click', verifyTwoFactor);

        // Enter no campo do código 2FA
        document.getElementById('twoFactorCode')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') verifyTwoFactor();
        });

        // Reenviar código
        document.getElementById('resendCodeBtn')?.addEventListener('click', resendTwoFactor);

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => handleLogout(false));

        // Idioma (toggle header)
        document.getElementById('langToggle')?.addEventListener('click', () => {
            const newLocale = window.EliteUtils?.getLocale?.() === 'pt' ? 'en' : 'pt';
            if (window.EliteUtils?.setLocale) window.EliteUtils.setLocale(newLocale);
        });

        // Idioma (botões login)
        document.getElementById('langPT')?.addEventListener('click', () => {
            if (window.EliteUtils?.setLocale) window.EliteUtils.setLocale('pt');
        });
        document.getElementById('langEN')?.addEventListener('click', () => {
            if (window.EliteUtils?.setLocale) window.EliteUtils.setLocale('en');
        });

        // Fechar modais
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.elite-modal');
                if (modal) modal.style.display = 'none';
            });
        });
        document.querySelectorAll('.elite-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });
        });

        // Solicitar acesso
        const requestBtn  = document.getElementById('requestAccessBtn');
        const accessModal = document.getElementById('accessRequestModal');
        if (requestBtn && accessModal) {
            requestBtn.addEventListener('click', () => {
                document.getElementById('loginOverlay').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loginOverlay').style.display = 'none';
                    accessModal.style.display = 'flex';
                    document.getElementById('loginOverlay').style.opacity = '1';
                }, 200);
            });
        }
        document.getElementById('accessRequestForm')?.addEventListener('submit', submitAccessRequest);

        // Botão exportar para dispositivo móvel
        document.getElementById('mobileExportBtn')?.addEventListener('click', () => {
            if (window.EliteProbatum?.exportToRegisteredDevice) {
                window.EliteProbatum.exportToRegisteredDevice();
            }
        });

        // Verificação de integridade
        document.getElementById('btn-integrity-check')?.addEventListener('click', () => {
            if (window.StrategicVault?.verifySystemIntegrity) window.StrategicVault.verifySystemIntegrity();
            else if (window.BlockchainCustody?.verifySystemIntegrity) window.BlockchainCustody.verifySystemIntegrity();
        });

        // Configurações
        const settingsBtn   = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => { settingsModal.style.display = 'flex'; });
        }

        // Guardar configurações
        document.getElementById('saveSettingsBtn')?.addEventListener('click', async () => {
            const apiCourtKey       = document.getElementById('apiCourtKey')?.value;
            const webhookUrl        = document.getElementById('webhookUrl')?.value;
            const themeMode         = document.getElementById('themeMode')?.value;
            const emailNotifications = document.getElementById('emailNotifications')?.checked;
            const smsNotifications  = document.getElementById('smsNotifications')?.checked;
            const settings = {
                apiCourtKey: apiCourtKey ? CryptoJS.SHA256(apiCourtKey).toString() : null,
                webhookUrl, themeMode, emailNotifications, smsNotifications,
                updatedAt: new Date().toISOString()
            };
            if (window.SecureStorageInstance) {
                await window.SecureStorageInstance.setItem('user_settings', settings);
            } else {
                localStorage.setItem('elite_settings', JSON.stringify(settings));
            }
            if (window.EliteUtils) window.EliteUtils.showToast('Configurações guardadas!', 'success');
            if (settingsModal) settingsModal.style.display = 'none';
        });

        // Mudar modo demo/real (botão dinâmico criado pelo renderAdmin)
        document.addEventListener('click', async (e) => {
            if (e.target.id === 'toggleDataModeBtn' || e.target.closest('#toggleDataModeBtn')) {
                const btn = document.getElementById('toggleDataModeBtn');
                const newMode = window.ELITE_DATA_MODE === 'demo' ? 'real' : 'demo';
                try {
                    const res = await window.EliteAuth.apiCall('PUT', '/api/settings', { dataMode: newMode });
                    if (res.ok) {
                        window.ELITE_DATA_MODE = newMode;
                        if (window.EliteRBAC) window.EliteRBAC.renderDataModeBadge(newMode);
                        if (window.EliteUtils) {
                            window.EliteUtils.showToast(`Modo alterado para ${newMode.toUpperCase()}`, 'success');
                        }
                        if (btn) btn.textContent = `MUDAR PARA ${newMode === 'demo' ? 'REAL' : 'DEMO'}`;
                    }
                } catch (err) {
                    if (window.EliteUtils) window.EliteUtils.showToast('Erro ao mudar modo de dados.', 'error');
                }
            }
        });

        console.log('[ELITE Auth] Módulo de autenticação v3.0.0 inicializado.');
    });

})();
