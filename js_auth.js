/**
 * ELITE PROBATUM — MÓDULO DE AUTENTICAÇÃO v2.0.5-HYBRID
 * Missão: Autenticação Segura com Fallback para Ambiente Estático
 */
class AuthClient {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = null;
    }

    async login(username, password) {
        console.log(`[AUTH] A processar credenciais para: ${username}`);

        // BYPASS DE EMERGÊNCIA (Obrigatório para GitHub Pages/Acesso Offline)
        const isBypass = (username === 'admin' && password === 'admin123') || 
                         (username === 'user' && password === 'user123');

        if (isBypass) {
            this.currentUser = { 
                username: username, 
                role: username === 'admin' ? 'admin' : 'senior_lawyer',
                name: 'Operador Estratégico' 
            };
            this.token = 'SECURE_SESSION_TOKEN_V2_5';
            this.isAuthenticated = true;
            
            localStorage.setItem('elite_auth_token', this.token);
            localStorage.setItem('elite_user_data', JSON.stringify(this.currentUser));
            
            return { success: true, mode: 'HYBRID_BYPASS' };
        }

        // TENTATIVA DE CONEXÃO AO SERVIDOR (Se existir)
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                const data = await response.json();
                this._persist(data.token, data.user);
                return { success: true, mode: 'SERVER' };
            }
        } catch (e) {
            console.warn('[AUTH] Servidor offline. Utilize credenciais de emergência.');
        }

        throw new Error('Falha na autenticação');
    }

    _persist(token, user) {
        this.token = token;
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('elite_auth_token', token);
        localStorage.setItem('elite_user_data', JSON.stringify(user));
    }

    async tryAutoLogin() {
        const t = localStorage.getItem('elite_auth_token');
        const d = localStorage.getItem('elite_user_data');
        if (t && d) {
            this.token = t;
            this.currentUser = JSON.parse(d);
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }
}

window.AuthClient = new AuthClient();
console.info('[SYSTEM] Motor de Autenticação v2.0.5-HYBRID Ativo.');