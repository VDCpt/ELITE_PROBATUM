/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE AUTENTICAÇÃO (CLIENT-HYBRID)
 * ============================================================================
 * Versão: v2.0.5-HYBRID (GitHub Ready)
 * * NOTA PERICIAL: Implementado "Emergency Bypass" para visualização em 
 * ambientes estáticos sem backend ativo.
 * ============================================================================
 */

class AuthClient {
    constructor() {
        this.apiBase = '/api/auth';
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = null;
        this.sessionSalt = 'UNIFED_STATIC_SALT_2026'; // Salt de contingência
    }

    /**
     * Tenta fazer login com lógica de redundância (Server -> Local Bypass)
     */
    async login(username, password, mobile) {
        console.log(`[Auth] Tentativa de login para: ${username}`);

        // 1. PROTOCOLO DE EMERGÊNCIA (Bypass para GitHub/Offline)
        // Permite a entrada imediata se o servidor não estiver acessível
        const isEmergencyMatch = (
            (username === 'admin' && password === 'admin123') || 
            (username === 'senior_lawyer' && password === 'lawyer123')
        );

        try {
            // 2. TENTATIVA DE CONEXÃO AO SERVIDOR REAL
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, mobile }),
                signal: AbortSignal.timeout(2000) // Timeout de 2s para não prender a UI
            });

            if (response.ok) {
                const data = await response.json();
                this._persistSession(data.token, data.user);
                return { success: true, mode: 'SERVER' };
            }
        } catch (error) {
            console.warn('[Auth] Servidor backend não detetado. Verificando credenciais locais...');
        }

        // 3. EXECUÇÃO DO BYPASS CASO O SERVIDOR FALHE
        if (isEmergencyMatch) {
            const mockUser = {
                id: username === 'admin' ? 'usr_001' : 'usr_002',
                username: username,
                role: username === 'admin' ? 'admin' : 'senior_lawyer',
                name: username === 'admin' ? 'Perito Administrador' : 'Advogado Sénior',
                phone: mobile || '910000000'
            };
            
            this._persistSession('MOCK_JWT_TOKEN_LOCAL', mockUser);
            console.info('%c[SECURITY] Login via Emergency Bypass Ativado.', 'color: #00E5FF; font-weight: bold;');
            return { success: true, mode: 'LOCAL_BYPASS' };
        }

        throw new Error('Credenciais inválidas ou servidor inacessível.');
    }

    /**
     * Persistência interna de sessão
     */
    _persistSession(token, user) {
        this.token = token;
        this.currentUser = user;
        this.isAuthenticated = true;

        localStorage.setItem('elite_auth_token', token);
        localStorage.setItem('elite_user_data', JSON.stringify(user));

        if (window.RBAC) {
            window.RBAC.token = token;
            window.RBAC.currentUser = user;
        }
    }

    async logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('elite_auth_token');
        localStorage.removeItem('elite_user_data');
        if (window.RBAC) window.RBAC.clear();
        console.log('[Auth] Sessão encerrada.');
        window.location.reload(); // Reset total do estado da app
    }

    async tryAutoLogin() {
        const token = localStorage.getItem('elite_auth_token');
        const userData = localStorage.getItem('elite_user_data');
        if (token && userData) {
            this.token = token;
            this.currentUser = JSON.parse(userData);
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    getToken() { return this.token; }
    getAuthHeader() { return this.token ? { 'Authorization': `Bearer ${this.token}` } : {}; }
}

// Inicialização Global
window.AuthClient = new AuthClient();
console.log('[ELITE] Módulo de Autenticação v2.0.5-HYBRID pronto.');