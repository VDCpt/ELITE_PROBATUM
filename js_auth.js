/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE AUTENTICAÇÃO (CLIENT)
 * ============================================================================
 * Gerencia a comunicação com o servidor, armazenamento de tokens JWT,
 * refresh de sessão e integração com o SecureStorage (Web Crypto API).
 * ============================================================================
 */

class AuthClient {
    constructor() {
        this.apiBase = '/api/auth';
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = null;
        this.sessionSalt = null; // Salt dinâmico recebido do servidor para derivar chave AES
    }

    /**
     * Tenta fazer login com as credenciais fornecidas
     * @param {string} username 
     * @param {string} password 
     * @param {string} mobile 
     * @returns {Promise<Object>}
     */
    async login(username, password, mobile) {
        try {
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, mobile })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na autenticação.');
            }

            // Armazenar token e dados do user
            this.token = data.token;
            this.currentUser = data.user;
            this.sessionSalt = data.sessionSalt;
            this.isAuthenticated = true;

            // Inicializar RBAC
            if (window.RBAC) {
                window.RBAC.initialize(this.currentUser, this.token);
                window.RBAC.persist();
            }

            // Inicializar SecureStorage com o salt dinâmico e o token como chave mestra derivada
            if (window.SecureStorage && window.SecureStorage.initializeWithSession) {
                // A chave mestra será derivada no servidor? 
                // Para segurança máxima, o cliente usa PBKDF2 com o salt recebido + token.
                // Assim a chave de encriptação nunca viaja na rede.
                await window.SecureStorage.initializeWithSession(this.token, this.sessionSalt);
            }

            console.log('[Auth] Login bem-sucedido:', this.currentUser.name);
            return { success: true, user: this.currentUser };

        } catch (error) {
            console.error('[Auth] Erro no login:', error);
            this.logout();
            return { success: false, error: error.message };
        }
    }

    /**
     * Verifica a validade do token atual com o servidor
     */
    async verifySession() {
        if (!this.token) return false;

        try {
            const response = await fetch(`${this.apiBase}/profile`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.isAuthenticated = true;
                if (window.RBAC) window.RBAC.initialize(this.currentUser, this.token);
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (e) {
            this.logout();
            return false;
        }
    }

    /**
     * Efetua logout local e no servidor
     */
    async logout() {
        if (this.token) {
            try {
                await fetch(`${this.apiBase}/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
            } catch (e) { /* ignore */ }
        }
        
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = null;
        this.sessionSalt = null;
        
        if (window.RBAC) window.RBAC.clear();
        if (window.SecureStorage && window.SecureStorage.clear) window.SecureStorage.clear();
        
        localStorage.removeItem('elite_auth_token');
        localStorage.removeItem('elite_user_data');
        
        console.log('[Auth] Logout efetuado.');
    }

    /**
     * Tenta restaurar sessão automaticamente
     */
    async tryAutoLogin() {
        const token = localStorage.getItem('elite_auth_token');
        if (token) {
            this.token = token;
            const isValid = await this.verifySession();
            if (isValid) {
                console.log('[Auth] Auto-login bem-sucedido.');
                return true;
            }
        }
        return false;
    }

    /**
     * Obtém o token atual para requisições autenticadas
     */
    getToken() {
        return this.token;
    }

    /**
     * Retorna o header de autorização para fetch
     */
    getAuthHeader() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
}

// Instância global
window.AuthClient = new AuthClient();

console.log('[ELITE] Módulo de Autenticação carregado.');