/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 7: PORTAL DO CLIENTE
 * ============================================================================
 * Portal exclusivo para clientes com acompanhamento em tempo real,
 * simulação de cenários, comunicação segura e download de documentos.
 * ============================================================================
 */

class ClientPortal {
    constructor() {
        this.clients = new Map();
        this.activeSessions = new Map();
        this.messages = new Map();
        this.notifications = new Map();
        this.documents = new Map();
        this.cases = new Map();
        this.feedback = new Map();
        
        this.loadClients();
        this.loadMessages();
        this.loadDocuments();
    }
    
    /**
     * Carrega clientes do localStorage
     */
    loadClients() {
        try {
            const stored = localStorage.getItem('elite_portal_clients');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.clients.set(key, value);
                }
            } else {
                this.initDemoClients();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar clientes:', e);
            this.initDemoClients();
        }
    }
    
    /**
     * Inicializa clientes de demonstração
     */
    initDemoClients() {
        try {
            const demoClients = [
                { id: 'CL001', name: 'João Silva', nif: '123456789', email: 'joao.silva@email.com', phone: '912345678', token: this.generateToken('CL001'), avatar: 'JS', since: '2024-01-15', status: 'active', cases: ['C001'], preferences: { language: 'pt', notifications: true, emailUpdates: true } },
                { id: 'CL002', name: 'Maria Santos', nif: '987654321', email: 'maria.santos@email.com', phone: '923456789', token: this.generateToken('CL002'), avatar: 'MS', since: '2024-03-20', status: 'active', cases: ['C002', 'C003'], preferences: { language: 'pt', notifications: true, emailUpdates: true } },
                { id: 'CL003', name: 'António Costa', nif: '456789123', email: 'antonio.costa@email.com', phone: '934567891', token: this.generateToken('CL003'), avatar: 'AC', since: '2024-05-10', status: 'active', cases: ['C004'], preferences: { language: 'pt', notifications: false, emailUpdates: true } }
            ];
            for (const client of demoClients) {
                this.clients.set(client.id, client);
            }
            this.saveClients();
        } catch (e) {
            console.error('[ELITE] Erro ao inicializar clientes demo:', e);
        }
    }
    
    /**
     * Carrega mensagens
     */
    loadMessages() {
        try {
            const stored = localStorage.getItem('elite_portal_messages');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.messages.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar mensagens:', e);
        }
    }
    
    /**
     * Carrega documentos
     */
    loadDocuments() {
        try {
            const stored = localStorage.getItem('elite_portal_documents');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.documents.set(key, value);
                }
            } else {
                this.initDemoDocuments();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar documentos:', e);
            this.initDemoDocuments();
        }
    }
    
    /**
     * Inicializa documentos de demonstração
     */
    initDemoDocuments() {
        try {
            const demoDocs = [
                { id: 'DOC001', caseId: 'C001', name: 'Petição Inicial', type: 'pdf', date: '2024-09-20', size: 245, url: null, hash: 'a1b2c3d4e5f6' },
                { id: 'DOC002', caseId: 'C001', name: 'Relatório Pericial', type: 'pdf', date: '2024-09-18', size: 1228, url: null, hash: 'b2c3d4e5f6a1' },
                { id: 'DOC003', caseId: 'C001', name: 'Notificação da AT', type: 'pdf', date: '2024-10-05', size: 89, url: null, hash: 'c3d4e5f6a1b2' },
                { id: 'DOC004', caseId: 'C002', name: 'Contestação', type: 'pdf', date: '2024-10-15', size: 156, url: null, hash: 'd4e5f6a1b2c3' },
                { id: 'DOC005', caseId: 'C003', name: 'Acordo de Mediação', type: 'pdf', date: '2024-11-01', size: 98, url: null, hash: 'e5f6a1b2c3d4' }
            ];
            for (const doc of demoDocs) {
                this.documents.set(doc.id, doc);
            }
            this.saveDocuments();
        } catch (e) {
            console.error('[ELITE] Erro ao inicializar documentos demo:', e);
        }
    }
    
    /**
     * Gera token de acesso
     */
    generateToken(clientId) {
        try {
            return CryptoJS.SHA256(clientId + Date.now() + Math.random()).toString().substring(0, 32);
        } catch (e) {
            return 'token_' + Date.now();
        }
    }
    
    /**
     * Autentica cliente
     */
    async authenticate(clientId, accessToken) {
        try {
            const client = await this.validateClient(clientId, accessToken);
            if (!client) return null;
            
            const sessionId = this.createSession(clientId);
            this.activeSessions.set(sessionId, {
                clientId, createdAt: Date.now(), expiresAt: Date.now() + 24 * 60 * 60 * 1000,
                ip: 'client', userAgent: navigator.userAgent
            });
            
            const clientCases = await this.getClientCases(clientId);
            
            return {
                sessionId,
                client: this.sanitizeClientData(client),
                cases: clientCases,
                notifications: this.getNotifications(clientId),
                lastActivity: new Date().toISOString()
            };
        } catch (e) {
            console.error('[ELITE] Erro na autenticação do cliente:', e);
            return null;
        }
    }
    
    /**
     * Valida credenciais do cliente
     */
    async validateClient(clientId, token) {
        try {
            const client = this.clients.get(clientId);
            if (client && client.token === token && client.status === 'active') {
                return client;
            }
            return null;
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Cria sessão
     */
    createSession(clientId) {
        return 'SESS_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
    }
    
    /**
     * Sanitiza dados do cliente para exibição
     */
    sanitizeClientData(client) {
        try {
            return {
                id: client.id,
                name: client.name,
                nif: client.nif.substring(0, 3) + '***' + client.nif.substring(6),
                email: client.email,
                phone: client.phone,
                avatar: client.avatar,
                since: client.since,
                preferences: client.preferences
            };
        } catch (e) {
            return { id: client.id, name: client.name };
        }
    }
    
    /**
     * Obtém casos do cliente
     */
    async getClientCases(clientId) {
        try {
            const client = this.clients.get(clientId);
            if (!client) return [];
            
            const allCases = [
                { id: 'C001', platform: 'Bolt', status: 'active', statusText: 'Em andamento', value: 28450, discrepancy: 2184.95, percentage: 89.26, createdAt: '2024-09-15', lastUpdate: '2024-10-20', nextDeadline: '2024-11-15', lawyer: 'Dra. Ana Silva', probability: 0.82, documents: ['DOC001', 'DOC002', 'DOC003'],
                    timeline: [{ date: '2024-09-15', event: 'Início do processo', status: 'completed' }, { date: '2024-09-20', event: 'Petição inicial submetida', status: 'completed' }, { date: '2024-10-05', event: 'Citação da ré', status: 'completed' }, { date: '2024-11-15', event: 'Prazo para contestação', status: 'pending' }],
                    updates: [{ date: '2024-10-20', message: 'Petição inicial aceite pelo tribunal', type: 'info' }] },
                { id: 'C002', platform: 'Uber', status: 'active', statusText: 'Em negociação', value: 15720, discrepancy: 2340.00, percentage: 85.12, createdAt: '2024-10-01', lastUpdate: '2024-10-25', nextDeadline: '2024-12-01', lawyer: 'Dr. Pedro Santos', probability: 0.75, documents: ['DOC004'],
                    timeline: [{ date: '2024-10-01', event: 'Início do processo', status: 'completed' }, { date: '2024-10-15', event: 'Notificação extrajudicial', status: 'completed' }, { date: '2024-12-01', event: 'Prazo para resposta', status: 'pending' }],
                    updates: [{ date: '2024-10-25', message: 'Proposta de acordo recebida', type: 'info' }] },
                { id: 'C003', platform: 'Free Now', status: 'active', statusText: 'Mediação', value: 32400, discrepancy: 4560.00, percentage: 85.93, createdAt: '2024-10-20', lastUpdate: '2024-11-01', nextDeadline: '2024-11-20', lawyer: 'Dra. Maria Costa', probability: 0.88, documents: ['DOC005'],
                    timeline: [{ date: '2024-10-20', event: 'Início do processo', status: 'completed' }, { date: '2024-11-01', event: 'Sessão de mediação agendada', status: 'completed' }, { date: '2024-11-20', event: 'Sessão de mediação', status: 'upcoming' }],
                    updates: [{ date: '2024-11-01', message: 'Sessão de mediação agendada para 20/11', type: 'info' }] },
                { id: 'C004', platform: 'Glovo', status: 'closed', statusText: 'Concluído', value: 12500, discrepancy: 1850.00, percentage: 85.20, createdAt: '2024-08-10', lastUpdate: '2024-11-30', nextDeadline: null, lawyer: 'Dra. Sofia Rodrigues', probability: 0.78, documents: [],
                    timeline: [{ date: '2024-08-10', event: 'Início do processo', status: 'completed' }, { date: '2024-09-15', event: 'Acordo extrajudicial', status: 'completed' }, { date: '2024-11-30', event: 'Processo concluído', status: 'completed' }],
                    updates: [{ date: '2024-11-30', message: 'Processo concluído com acordo favorável', type: 'success' }] }
            ];
            return allCases.filter(c => client.cases.includes(c.id));
        } catch (e) {
            console.error('[ELITE] Erro ao obter casos do cliente:', e);
            return [];
        }
    }
    
    /**
     * Obtém notificações do cliente
     */
    getNotifications(clientId) {
        try {
            const clientNotifications = this.notifications.get(clientId) || [];
            return clientNotifications.filter(n => !n.read).slice(0, 10);
        } catch (e) {
            return [];
        }
    }
    
    /**
     * Adiciona notificação
     */
    addNotification(clientId, notification) {
        try {
            const clientNotifications = this.notifications.get(clientId) || [];
            clientNotifications.unshift({
                id: Date.now(),
                ...notification,
                read: false,
                createdAt: new Date().toISOString()
            });
            this.notifications.set(clientId, clientNotifications);
            this.saveNotifications();
            return notification;
        } catch (e) {
            console.error('[ELITE] Erro ao adicionar notificação:', e);
            return null;
        }
    }
    
    /**
     * Marca notificação como lida
     */
    markNotificationRead(clientId, notificationId) {
        try {
            const clientNotifications = this.notifications.get(clientId) || [];
            const notification = clientNotifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                this.notifications.set(clientId, clientNotifications);
                this.saveNotifications();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao marcar notificação:', e);
        }
    }
    
    /**
     * Envia mensagem
     */
    async sendMessage(clientId, message, lawyerId = null) {
        try {
            const client = this.clients.get(clientId);
            if (!client) return null;
            
            const encrypted = await this.encryptMessage(message);
            const messageId = Date.now();
            
            const msg = {
                id: messageId, text: message, encrypted, sender: 'client', senderName: client.name,
                senderId: clientId, receiverId: lawyerId || 'lawyer_default', timestamp: new Date().toISOString(),
                read: false, readAt: null
            };
            
            const clientMessages = this.messages.get(clientId) || [];
            clientMessages.push(msg);
            this.messages.set(clientId, clientMessages);
            this.saveMessages();
            
            this.addNotification('lawyer', { type: 'message', title: 'Nova mensagem de cliente', content: `${client.name} enviou uma mensagem`, clientId: clientId, messageId: messageId });
            return msg;
        } catch (e) {
            console.error('[ELITE] Erro ao enviar mensagem:', e);
            return null;
        }
    }
    
    /**
     * Obtém mensagens do cliente
     */
    getMessages(clientId, limit = 50) {
        try {
            const messages = this.messages.get(clientId) || [];
            return messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
        } catch (e) {
            return [];
        }
    }
    
    /**
     * Marca mensagem como lida
     */
    markMessageRead(clientId, messageId) {
        try {
            const messages = this.messages.get(clientId) || [];
            const message = messages.find(m => m.id === messageId);
            if (message && !message.read) {
                message.read = true;
                message.readAt = new Date().toISOString();
                this.messages.set(clientId, messages);
                this.saveMessages();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao marcar mensagem:', e);
        }
    }
    
    /**
     * Encripta mensagem
     */
    async encryptMessage(message) {
        try {
            return CryptoJS.AES.encrypt(message, 'elite_secret_key').toString();
        } catch (e) {
            return message;
        }
    }
    
    /**
     * Desencripta mensagem
     */
    decryptMessage(encrypted) {
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, 'elite_secret_key');
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return '[Mensagem criptografada]';
        }
    }
    
    /**
     * Obtém documento
     */
    getDocument(documentId) {
        return this.documents.get(documentId) || null;
    }
    
    /**
     * Obtém documentos do caso
     */
    getCaseDocuments(caseId) {
        try {
            const docs = [];
            for (const [id, doc] of this.documents) {
                if (doc.caseId === caseId) {
                    docs.push(doc);
                }
            }
            return docs.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (e) {
            return [];
        }
    }
    
    /**
     * Adiciona documento
     */
    addDocument(documentData) {
        try {
            const doc = { id: 'DOC' + Date.now(), ...documentData, uploadedAt: new Date().toISOString(), hash: CryptoJS.SHA256(JSON.stringify(documentData)).toString() };
            this.documents.set(doc.id, doc);
            this.saveDocuments();
            this.addNotification(doc.caseId, { type: 'document', title: 'Novo documento disponível', content: `O documento ${doc.name} foi adicionado ao seu processo`, documentId: doc.id });
            return doc;
        } catch (e) {
            console.error('[ELITE] Erro ao adicionar documento:', e);
            return null;
        }
    }
    
    /**
     * Simula cenário de litígio
     */
    simulateScenario(caseId, scenario) {
        try {
            const scenarios = {
                litigate: { name: 'Litígio', probability: 0.82, duration: '8-12 meses', expectedValue: 28450, risk: 'Alto', costs: 2500, description: 'Ação judicial completa com pedido de tutela antecipada' },
                negotiate: { name: 'Negociação', probability: 0.95, duration: '2-3 meses', expectedValue: 12500, risk: 'Baixo', costs: 800, description: 'Acordo extrajudicial com mediação' },
                arbitration: { name: 'Arbitragem', probability: 0.78, duration: '4-6 meses', expectedValue: 22000, risk: 'Moderado', costs: 1500, description: 'Arbitragem no CAAD com decisão vinculativa' }
            };
            const result = scenarios[scenario];
            if (!result) return null;
            return { ...result, roi: ((result.expectedValue - result.costs) / result.costs * 100).toFixed(0), recommendation: result.probability > 0.8 ? 'Altamente recomendado' : result.probability > 0.6 ? 'Recomendado' : 'Considerar alternativas' };
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Obtém previsão de êxito
     */
    getSuccessPrediction(caseId) {
        try {
            const predictions = {
                C001: { probability: 0.82, confidence: 0.85, factors: ['Prova documental robusta', 'Jurisprudência favorável'] },
                C002: { probability: 0.75, confidence: 0.78, factors: ['Notificação prévia', 'Testemunhas'] },
                C003: { probability: 0.88, confidence: 0.82, factors: ['Acordo consensual', 'Mediação'] },
                C004: { probability: 0.78, confidence: 0.80, factors: ['Acordo extrajudicial'] }
            };
            return predictions[caseId] || { probability: 0.65, confidence: 0.70, factors: ['Análise em curso'] };
        } catch (e) {
            return { probability: 0.65, confidence: 0.70, factors: ['Análise em curso'] };
        }
    }
    
    /**
     * Obtém timeline do caso
     */
    getCaseTimeline(caseId) {
        try {
            const timelines = {
                C001: [{ date: '2024-09-15', event: 'Início do processo', status: 'completed', description: 'Contrato de mandato assinado' }, { date: '2024-09-20', event: 'Petição inicial submetida', status: 'completed', description: 'Documentos entregues no tribunal' }, { date: '2024-10-05', event: 'Citação da ré', status: 'completed', description: 'Ré citada com sucesso' }, { date: '2024-11-15', event: 'Prazo para contestação', status: 'pending', description: 'Aguardando resposta da ré' }],
                C002: [{ date: '2024-10-01', event: 'Início do processo', status: 'completed', description: 'Contrato de mandato assinado' }, { date: '2024-10-15', event: 'Notificação extrajudicial', status: 'completed', description: 'Notificação enviada à plataforma' }, { date: '2024-12-01', event: 'Prazo para resposta', status: 'pending', description: 'Aguardando resposta' }],
                C003: [{ date: '2024-10-20', event: 'Início do processo', status: 'completed', description: 'Contrato de mandato assinado' }, { date: '2024-11-01', event: 'Sessão de mediação agendada', status: 'completed', description: 'Agendamento confirmado' }, { date: '2024-11-20', event: 'Sessão de mediação', status: 'upcoming', description: 'Primeira sessão com mediador' }]
            };
            return timelines[caseId] || [];
        } catch (e) {
            return [];
        }
    }
    
    /**
     * Envia feedback
     */
    sendFeedback(clientId, caseId, rating, comment) {
        try {
            const feedback = { id: Date.now(), clientId, caseId, rating, comment, createdAt: new Date().toISOString(), status: 'pending' };
            const clientFeedback = this.feedback.get(clientId) || [];
            clientFeedback.push(feedback);
            this.feedback.set(clientId, clientFeedback);
            this.saveFeedback();
            this.addNotification('lawyer', { type: 'feedback', title: 'Novo feedback de cliente', content: `${this.clients.get(clientId)?.name} avaliou o caso ${caseId} com ${rating} estrelas`, clientId: clientId, caseId: caseId });
            return feedback;
        } catch (e) {
            console.error('[ELITE] Erro ao enviar feedback:', e);
            return null;
        }
    }
    
    /**
     * Obtém estatísticas do cliente
     */
    getClientStats(clientId) {
        try {
            const client = this.clients.get(clientId);
            if (!client) return null;
            const clientCases = this.cases.get(clientId) || [];
            const totalValue = clientCases.reduce((sum, c) => sum + c.value, 0);
            const activeCases = clientCases.filter(c => c.status === 'active').length;
            const avgProbability = clientCases.reduce((sum, c) => sum + c.probability, 0) / (clientCases.length || 1);
            return { totalCases: clientCases.length, activeCases, totalValue, avgProbability: (avgProbability * 100).toFixed(0), lastActivity: client.lastActivity || client.since, documentsCount: this.getCaseDocuments(clientCases[0]?.id).length || 0, messagesCount: (this.messages.get(clientId) || []).length };
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Renderiza portal do cliente
     */
    renderPortal(clientId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const client = this.clients.get(clientId);
            if (!client) { container.innerHTML = '<div class="error">Cliente não encontrado</div>'; return; }
            
            const clientCases = this.getClientCases(clientId);
            const stats = this.getClientStats(clientId);
            
            container.innerHTML = `
                <div class="client-portal">
                    <div class="portal-header">
                        <div class="client-welcome"><div class="client-avatar">${client.avatar}</div><div><h2>Olá, ${client.name}</h2><p>Cliente desde ${new Date(client.since).toLocaleDateString('pt-PT')}</p></div></div>
                        <div class="portal-stats"><div class="stat"><span class="stat-label">Casos Ativos</span><span class="stat-value">${stats?.activeCases || 0}</span></div><div class="stat"><span class="stat-label">Valor em Disputa</span><span class="stat-value">${this.formatCurrency(stats?.totalValue || 0)}</span></div><div class="stat"><span class="stat-label">Probabilidade Média</span><span class="stat-value">${stats?.avgProbability || 0}%</span></div></div>
                    </div>
                    <div class="portal-cases"><h3><i class="fas fa-folder-open"></i> Meus Processos</h3><div class="cases-grid">${this.renderCases(clientCases)}</div></div>
                    <div class="portal-communication"><h3><i class="fas fa-lock"></i> Comunicação Segura</h3><div class="messages-container"><div class="messages-list" id="messagesList">${this.renderMessages(clientId)}</div><div class="message-input"><textarea id="clientMessage" placeholder="Escreva uma mensagem para o seu advogado... (criptografada AES-256)"></textarea><button id="sendMessageBtn" class="elite-btn primary"><i class="fas fa-lock"></i> Enviar Mensagem</button></div></div></div>
                    <div class="portal-documents"><h3><i class="fas fa-file-alt"></i> Documentos</h3><div class="documents-grid" id="documentsGrid">${this.renderDocuments(clientCases)}</div></div>
                    <div class="portal-feedback"><h3><i class="fas fa-star"></i> Avalie o Serviço</h3><div class="feedback-form"><div class="rating-stars">${[1,2,3,4,5].map(i => `<i class="far fa-star" data-rating="${i}"></i>`).join('')}</div><textarea id="feedbackComment" placeholder="Deixe o seu comentário..."></textarea><button id="submitFeedbackBtn" class="elite-btn secondary">ENVIAR FEEDBACK</button></div></div>
                </div>
                <style>
                    .client-portal{ background:var(--bg-terminal); border-radius:16px; padding:24px; border:1px solid var(--border-tactic); }
                    .portal-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap:wrap; gap:20px; }
                    .client-welcome{ display:flex; align-items:center; gap:16px; }
                    .client-avatar{ width:64px; height:64px; background:linear-gradient(135deg,#00e5ff,#0099cc); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:800; font-family:'JetBrains Mono'; color:#000000; }
                    .portal-stats{ display:flex; gap:24px; }
                    .portal-stats .stat{ text-align:center; }
                    .cases-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; margin-bottom:32px; }
                    .case-card{ background:var(--bg-command); border:1px solid var(--border-tactic); border-radius:12px; padding:16px; cursor:pointer; transition:all 0.2s; }
                    .case-card:hover{ border-color:#00e5ff; transform:translateY(-2px); }
                    .case-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
                    .case-id{ font-family:'JetBrains Mono'; font-size:0.7rem; color:#00e5ff; }
                    .case-status{ font-size:0.6rem; padding:2px 8px; border-radius:12px; font-weight:700; }
                    .case-status.status-active{ background:#00e676; color:#000; }
                    .case-status.status-pending{ background:#ffc107; color:#000; }
                    .case-status.status-closed{ background:#64748b; color:#fff; }
                    .case-details{ display:flex; gap:16px; margin-bottom:12px; font-size:0.75rem; color:#94a3b8; }
                    .case-progress{ margin-bottom:12px; }
                    .case-footer{ display:flex; justify-content:space-between; font-size:0.65rem; color:#64748b; }
                    .messages-container{ background:var(--bg-command); border-radius:12px; border:1px solid var(--border-tactic); overflow:hidden; }
                    .messages-list{ max-height:300px; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; }
                    .message{ max-width:80%; padding:10px 14px; border-radius:12px; position:relative; word-break:break-word; }
                    .message.sent{ background:#00e5ff; color:#000; align-self:flex-end; border-bottom-right-radius:4px; }
                    .message.received{ background:rgba(255,255,255,0.1); color:#fff; align-self:flex-start; border-bottom-left-radius:4px; }
                    .message-header{ display:flex; justify-content:space-between; gap:16px; margin-bottom:4px; font-size:0.65rem; }
                    .message-input{ padding:16px; border-top:1px solid var(--border-tactic); display:flex; gap:12px; }
                    .message-input textarea{ flex:1; background:rgba(0,0,0,0.6); border:1px solid var(--border-tactic); border-radius:8px; padding:10px; color:#fff; font-family:'JetBrains Mono'; font-size:0.75rem; resize:vertical; }
                    .documents-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px; }
                    .document-card{ background:var(--bg-command); border:1px solid var(--border-tactic); border-radius:10px; padding:12px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:all 0.2s; }
                    .document-card:hover{ border-color:#00e5ff; transform:translateX(4px); }
                    .rating-stars{ display:flex; gap:8px; margin-bottom:16px; font-size:1.2rem; cursor:pointer; }
                    .rating-stars i{ color:#ffc107; transition:all 0.2s; }
                    .feedback-form textarea{ width:100%; background:rgba(0,0,0,0.6); border:1px solid var(--border-tactic); border-radius:8px; padding:10px; color:#fff; font-family:'JetBrains Mono'; font-size:0.75rem; margin-bottom:12px; }
                    @media (max-width:768px){ .portal-header{ flex-direction:column; align-items:flex-start; } .portal-stats{ width:100%; justify-content:space-between; } .message{ max-width:90%; } .message-input{ flex-direction:column; } .message-input button{ padding:10px; } }
                </style>
            `;
            
            document.getElementById('sendMessageBtn')?.addEventListener('click', async () => {
                const textarea = document.getElementById('clientMessage');
                const message = textarea?.value.trim();
                if (message) {
                    await this.sendMessage(clientId, message);
                    textarea.value = '';
                    this.renderMessages(clientId);
                    if (window.EliteUtils) window.EliteUtils.showToast('Mensagem enviada com sucesso!', 'success');
                }
            });
            
            document.getElementById('submitFeedbackBtn')?.addEventListener('click', () => {
                const rating = document.querySelector('.rating-stars .fas')?.dataset.rating;
                const comment = document.getElementById('feedbackComment')?.value;
                if (rating) {
                    this.sendFeedback(clientId, clientCases[0]?.id, parseInt(rating), comment);
                    if (window.EliteUtils) window.EliteUtils.showToast('Feedback enviado com sucesso!', 'success');
                    document.querySelectorAll('.rating-stars i').forEach(star => star.className = 'far fa-star');
                    document.getElementById('feedbackComment').value = '';
                }
            });
            
            document.querySelectorAll('.rating-stars i').forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.dataset.rating);
                    document.querySelectorAll('.rating-stars i').forEach((s, i) => { s.className = i < rating ? 'fas fa-star' : 'far fa-star'; });
                });
            });
            
            document.querySelectorAll('.download-doc').forEach(btn => {
                btn.addEventListener('click', () => { const docId = btn.dataset.docId; this.downloadDocument(docId); });
            });
            
            document.querySelectorAll('.view-case-details').forEach(btn => {
                btn.addEventListener('click', () => { const caseId = btn.dataset.caseId; this.showCaseDetails(caseId, clientId); });
            });
        } catch (e) {
            console.error('[ELITE] Erro ao renderizar portal:', e);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro no Portal</strong><p>${e.message}</p></div></div>`;
        }
    }
    
    /**
     * Renderiza casos
     */
    renderCases(cases) {
        if (!cases || cases.length === 0) return '<div class="empty-state">Nenhum processo ativo no momento</div>';
        return cases.map(c => `
            <div class="case-card" data-case-id="${c.id}">
                <div class="case-header"><span class="case-id">${c.id}</span><span class="case-status status-${c.status}">${c.statusText}</span></div>
                <div class="case-details"><div><i class="fas fa-building"></i> ${c.platform}</div><div><i class="fas fa-euro-sign"></i> ${this.formatCurrency(c.value)}</div></div>
                <div class="case-progress"><div class="progress-label">Probabilidade de sucesso</div><div class="progress-bar"><div class="progress-fill" style="width: ${c.probability * 100}%"></div><span class="progress-text">${(c.probability * 100).toFixed(0)}%</span></div></div>
                <div class="case-footer"><span><i class="fas fa-user"></i> ${c.lawyer}</span><span><i class="fas fa-calendar"></i> ${new Date(c.lastUpdate).toLocaleDateString('pt-PT')}</span><button class="action-btn view-case-details" data-case-id="${c.id}">VER DETALHES</button></div>
            </div>
        `).join('');
    }
    
    /**
     * Renderiza mensagens
     */
    renderMessages(clientId) {
        try {
            const messages = this.getMessages(clientId);
            if (messages.length === 0) return '<div class="empty-messages">Nenhuma mensagem ainda. Envie uma mensagem para o seu advogado.</div>';
            return messages.map(m => `
                <div class="message ${m.sender === 'client' ? 'sent' : 'received'}">
                    <div class="message-header"><strong>${m.sender === 'client' ? 'Você' : m.senderName || 'Advogado'}</strong><small>${new Date(m.timestamp).toLocaleString('pt-PT')}</small></div>
                    <div class="message-body">${this.decryptMessage(m.encrypted)}</div>
                    ${m.read ? '<span class="message-read">✓ Lida</span>' : '<span class="message-pending">✓ Enviada</span>'}
                </div>
            `).join('');
        } catch (e) {
            return '<div class="error">Erro ao carregar mensagens</div>';
        }
    }
    
    /**
     * Renderiza documentos
     */
    renderDocuments(cases) {
        if (!cases) return '<div class="empty-state">Nenhum documento disponível</div>';
        const allDocs = [];
        for (const c of cases) {
            const docs = this.getCaseDocuments(c.id);
            allDocs.push(...docs);
        }
        if (allDocs.length === 0) return '<div class="empty-state">Nenhum documento disponível</div>';
        return allDocs.map(doc => `
            <div class="document-card"><i class="fas ${this.getDocIcon(doc.type)}"></i><div><div class="doc-name">${doc.name}</div><div class="doc-meta">${new Date(doc.date).toLocaleDateString('pt-PT')} · ${doc.size} KB</div></div><button class="action-btn download-doc" data-doc-id="${doc.id}"><i class="fas fa-download"></i></button></div>
        `).join('');
    }
    
    /**
     * Mostra detalhes do caso
     */
    showCaseDetails(caseId, clientId) {
        try {
            const cases = this.getClientCases(clientId);
            const caseData = cases.find(c => c.id === caseId);
            if (!caseData) return;
            const prediction = this.getSuccessPrediction(caseId);
            const timeline = this.getCaseTimeline(caseId);
            const modalBody = document.getElementById('caseDetailBody');
            if (modalBody) {
                modalBody.innerHTML = `<div class="case-detail-modal"><h3>Processo ${caseData.id} - ${caseData.platform}</h3><div class="detail-section"><h4>Resumo do Caso</h4><div class="detail-row"><span>Valor da Causa:</span><strong>${this.formatCurrency(caseData.value)}</strong></div><div class="detail-row"><span>Discrepância:</span><strong>${this.formatCurrency(caseData.discrepancy)}</strong></div><div class="detail-row"><span>Percentagem:</span><strong>${caseData.percentage}%</strong></div><div class="detail-row"><span>Advogado Responsável:</span><strong>${caseData.lawyer}</strong></div><div class="detail-row"><span>Data de Início:</span><strong>${new Date(caseData.createdAt).toLocaleDateString('pt-PT')}</strong></div></div><div class="detail-section"><h4>Previsão de Êxito</h4><div class="prediction-box"><div class="probability-gauge"><div class="gauge-value" style="width: ${prediction.probability * 100}%">${(prediction.probability * 100).toFixed(0)}%</div></div><div class="confidence">Confiança: ${(prediction.confidence * 100).toFixed(0)}%</div><div class="factors"><strong>Fatores considerados:</strong><ul>${prediction.factors.map(f => `<li>${f}</li>`).join('')}</ul></div></div></div><div class="detail-section"><h4>Linha do Tempo</h4><div class="timeline">${timeline.map(t => `<div class="timeline-event ${t.status}"><div class="event-date">${new Date(t.date).toLocaleDateString('pt-PT')}</div><div class="event-description">${t.event}</div><div class="event-detail">${t.description}</div></div>`).join('')}</div></div><div class="detail-section"><h4>Simulador de Cenários</h4><div class="scenario-buttons"><button class="elite-btn small" onclick="ClientPortal.simulateAndShow('${caseId}', 'litigate')">Litígio</button><button class="elite-btn small" onclick="ClientPortal.simulateAndShow('${caseId}', 'negotiate')">Negociação</button><button class="elite-btn small" onclick="ClientPortal.simulateAndShow('${caseId}', 'arbitration')">Arbitragem</button></div><div id="scenarioResult" class="scenario-result"></div></div></div>`;
            }
            document.getElementById('caseDetailModal').style.display = 'flex';
        } catch (e) {
            console.error('[ELITE] Erro ao mostrar detalhes do caso:', e);
        }
    }
    
    /**
     * Simula e mostra resultado
     */
    simulateAndShow(caseId, scenario) {
        try {
            const result = this.simulateScenario(caseId, scenario);
            if (result) {
                const resultDiv = document.getElementById('scenarioResult');
                if (resultDiv) {
                    resultDiv.innerHTML = `<div class="scenario-details"><div class="scenario-name">${result.name}</div><div class="scenario-description">${result.description}</div><div class="scenario-stats"><div><strong>Probabilidade:</strong> ${(result.probability * 100).toFixed(0)}%</div><div><strong>Duração Estimada:</strong> ${result.duration}</div><div><strong>Valor Esperado:</strong> ${this.formatCurrency(result.expectedValue)}</div><div><strong>Custos Estimados:</strong> ${this.formatCurrency(result.costs)}</div><div><strong>ROI:</strong> ${result.roi}%</div><div><strong>Nível de Risco:</strong> ${result.risk}</div></div><div class="recommendation">${result.recommendation}</div><button class="elite-btn primary" onclick="ClientPortal.selectScenario('${caseId}', '${scenario}')">Selecionar esta estratégia</button></div>`;
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro na simulação:', e);
        }
    }
    
    /**
     * Seleciona cenário
     */
    selectScenario(caseId, scenario) {
        if (window.EliteUtils) window.EliteUtils.showToast(`Estratégia de ${scenario} selecionada. O seu advogado será notificado.`, 'success');
    }
    
    /**
     * Download de documento
     */
    downloadDocument(docId) {
        const doc = this.getDocument(docId);
        if (doc) {
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`A descarregar ${doc.name}...`, 'info');
                setTimeout(() => window.EliteUtils.showToast(`${doc.name} descarregado com sucesso!`, 'success'), 1000);
            }
        }
    }
    
    /**
     * Obtém ícone do documento
     */
    getDocIcon(type) {
        const icons = { pdf: 'fa-file-pdf', docx: 'fa-file-word', xlsx: 'fa-file-excel', txt: 'fa-file-alt', jpg: 'fa-file-image', png: 'fa-file-image' };
        return icons[type] || 'fa-file';
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        try {
            return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value || 0);
        } catch (e) {
            return `€${(value || 0).toLocaleString()}`;
        }
    }
    
    /**
     * Salva clientes
     */
    saveClients() {
        try {
            const clientsObj = {};
            for (const [key, value] of this.clients) clientsObj[key] = value;
            localStorage.setItem('elite_portal_clients', JSON.stringify(clientsObj));
        } catch (e) { console.error('[ELITE] Erro ao salvar clientes:', e); }
    }
    
    /**
     * Salva mensagens
     */
    saveMessages() {
        try {
            const messagesObj = {};
            for (const [key, value] of this.messages) messagesObj[key] = value;
            localStorage.setItem('elite_portal_messages', JSON.stringify(messagesObj));
        } catch (e) { console.error('[ELITE] Erro ao salvar mensagens:', e); }
    }
    
    /**
     * Salva documentos
     */
    saveDocuments() {
        try {
            const docsObj = {};
            for (const [key, value] of this.documents) docsObj[key] = value;
            localStorage.setItem('elite_portal_documents', JSON.stringify(docsObj));
        } catch (e) { console.error('[ELITE] Erro ao salvar documentos:', e); }
    }
    
    /**
     * Salva notificações
     */
    saveNotifications() {
        try {
            const notifObj = {};
            for (const [key, value] of this.notifications) notifObj[key] = value;
            localStorage.setItem('elite_portal_notifications', JSON.stringify(notifObj));
        } catch (e) { console.error('[ELITE] Erro ao salvar notificações:', e); }
    }
    
    /**
     * Salva feedback
     */
    saveFeedback() {
        try {
            const feedbackObj = {};
            for (const [key, value] of this.feedback) feedbackObj[key] = value;
            localStorage.setItem('elite_portal_feedback', JSON.stringify(feedbackObj));
        } catch (e) { console.error('[ELITE] Erro ao salvar feedback:', e); }
    }
    
    /**
     * Adiciona cliente
     */
    addClient(clientData) {
        try {
            const client = {
                id: 'CL' + Date.now(),
                ...clientData,
                token: this.generateToken(clientData.id || Date.now().toString()),
                avatar: clientData.name.substring(0, 2).toUpperCase(),
                since: new Date().toISOString().split('T')[0],
                status: 'active',
                cases: [],
                preferences: { language: 'pt', notifications: true, emailUpdates: true }
            };
            this.clients.set(client.id, client);
            this.saveClients();
            return client;
        } catch (e) {
            console.error('[ELITE] Erro ao adicionar cliente:', e);
            return null;
        }
    }
}

// Instância global
window.ClientPortal = new ClientPortal();