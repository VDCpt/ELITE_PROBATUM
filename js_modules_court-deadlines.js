/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE PRAZOS JUDICIAIS
 * ============================================================================
 * CORREÇÃO v2.0.5:
 * 1. Implementação exata do algoritmo de Meeus/Jones/Butcher para cálculo da Páscoa
 * 2. Inclusão de feriados móveis (Carnaval, Corpo de Deus)
 * 3. Validação de datas com base no calendário judicial português
 * ============================================================================
 */

class CourtDeadlines {
    constructor() {
        this.deadlines = [];
        this.monitorInterval = null;
        this.notificationCallback = null;
        
        this.judicialHolidays = {
            christmas: { start: '12-20', end: '01-07' },
            easter: { start: null, end: null },
            summer: { start: '07-15', end: '09-01' }
        };
        
        this.nationalHolidays = [
            '01-01', '04-25', '05-01', '06-10', '08-15', '10-05', '11-01', '12-01', '12-08', '12-25'
        ];
        
        this.movableHolidays = {
            carnival: null,
            goodFriday: null,
            easterSunday: null,
            corpusChristi: null
        };
        
        this.loadDeadlines();
        this.calculateMovableHolidays(new Date().getFullYear());
    }
    
    /**
     * Inicializa o módulo e começa a monitorização
     */
    initialize() {
        try {
            this.loadDeadlines();
            this.startMonitoring();
            console.log('[ELITE] CourtDeadlines inicializado com', this.deadlines.length, 'prazos');
        } catch (error) {
            console.error('[ELITE] Erro na inicialização do CourtDeadlines:', error);
        }
        return this;
    }
    
    /**
     * Cálculo exato da Páscoa pelo algoritmo de Meeus/Jones/Butcher
     */
    calculateEasterDate(year) {
        try {
            const a = year % 19;
            const b = Math.floor(year / 100);
            const c = year % 100;
            const d = Math.floor(b / 4);
            const e = b % 4;
            const f = Math.floor((b + 8) / 25);
            const g = Math.floor((b - f + 1) / 3);
            const h = (19 * a + b - d - g + 15) % 30;
            const i = Math.floor(c / 4);
            const k = c % 4;
            const l = (32 + 2 * e + 2 * i - h - k) % 7;
            const m = Math.floor((a + 11 * h + 22 * l) / 451);
            const month = Math.floor((h + l - 7 * m + 114) / 31);
            const day = ((h + l - 7 * m + 114) % 31) + 1;
            return new Date(year, month - 1, day);
        } catch (error) {
            return new Date(year, 3, 20);
        }
    }
    
    /**
     * Calcula todos os feriados móveis para um determinado ano
     */
    calculateMovableHolidays(year) {
        try {
            const easterDate = this.calculateEasterDate(year);
            this.movableHolidays.easterSunday = easterDate;
            
            const goodFriday = new Date(easterDate);
            goodFriday.setDate(easterDate.getDate() - 2);
            this.movableHolidays.goodFriday = goodFriday;
            
            const carnival = new Date(easterDate);
            carnival.setDate(easterDate.getDate() - 47);
            this.movableHolidays.carnival = carnival;
            
            const corpusChristi = new Date(easterDate);
            corpusChristi.setDate(easterDate.getDate() + 60);
            this.movableHolidays.corpusChristi = corpusChristi;
            
            const easterStart = new Date(easterDate);
            easterStart.setDate(easterDate.getDate() - 7);
            const easterEnd = new Date(easterDate);
            easterEnd.setDate(easterDate.getDate() + 7);
            this.judicialHolidays.easter = {
                start: this.formatMonthDay(easterStart),
                end: this.formatMonthDay(easterEnd)
            };
            
            console.log(`[ELITE] Feriados móveis ${year}: Páscoa=${this.formatDate(easterDate)}`);
        } catch (error) {
            console.error('[ELITE] Erro ao calcular feriados móveis:', error);
        }
    }
    
    /**
     * Verifica se uma data é feriado móvel
     */
    isMovableHoliday(date) {
        try {
            const year = date.getFullYear();
            if (!this.movableHolidays.easterSunday || this.movableHolidays.easterSunday.getFullYear() !== year) {
                this.calculateMovableHolidays(year);
            }
            const dateStr = this.formatDateISO(date);
            const movableDates = [this.movableHolidays.carnival, this.movableHolidays.goodFriday, this.movableHolidays.easterSunday, this.movableHolidays.corpusChristi];
            return movableDates.some(holiday => holiday && this.formatDateISO(holiday) === dateStr);
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Verifica se a data está dentro do período de férias judiciais
     */
    isJudicialHoliday(date) {
        try {
            const year = date.getFullYear();
            if (!this.movableHolidays.easterSunday || this.movableHolidays.easterSunday.getFullYear() !== year) {
                this.calculateMovableHolidays(year);
            }
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const christmasStart = this.parseMonthDay(this.judicialHolidays.christmas.start);
            const christmasEnd = this.parseMonthDay(this.judicialHolidays.christmas.end);
            if (this.isDateInRange(month, day, christmasStart, christmasEnd)) return true;
            const summerStart = this.parseMonthDay(this.judicialHolidays.summer.start);
            const summerEnd = this.parseMonthDay(this.judicialHolidays.summer.end);
            if (this.isDateInRange(month, day, summerStart, summerEnd)) return true;
            const easterStart = this.parseMonthDay(this.judicialHolidays.easter.start);
            const easterEnd = this.parseMonthDay(this.judicialHolidays.easter.end);
            if (this.isDateInRange(month, day, easterStart, easterEnd)) return true;
            return false;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Verifica se uma data é dia útil
     */
    isBusinessDay(date) {
        try {
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) return false;
            const monthDay = this.formatMonthDay(date);
            if (this.nationalHolidays.includes(monthDay)) return false;
            if (this.isMovableHoliday(date)) return false;
            if (this.isJudicialHoliday(date)) return false;
            return true;
        } catch (error) {
            return true;
        }
    }
    
    /**
     * Calcula a data limite com base em dias úteis
     */
    calculateDueDate(startDate, businessDays) {
        try {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            let current = new Date(start);
            let remaining = businessDays;
            while (remaining > 0) {
                current.setDate(current.getDate() + 1);
                if (this.isBusinessDay(current)) remaining--;
            }
            return current;
        } catch (error) {
            return new Date();
        }
    }
    
    /**
     * Calcula prioridade do prazo (1-5, onde 5 é mais urgente)
     */
    calculatePriority(dueDate) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const due = new Date(dueDate);
            due.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) return 5;
            if (diffDays === 0) return 5;
            if (diffDays <= 3) return 4;
            if (diffDays <= 7) return 3;
            if (diffDays <= 15) return 2;
            return 1;
        } catch (error) {
            return 3;
        }
    }
    
    /**
     * Analisa string de data no formato DD/MM/YYYY
     */
    parseDate(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return new Date(dateStr);
    }
    
    /**
     * Formata data no formato DD/MM/YYYY
     */
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    /**
     * Formata mês-dia para comparação (MM-DD)
     */
    formatMonthDay(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}-${day}`;
    }
    
    /**
     * Formata data no formato ISO (YYYY-MM-DD)
     */
    formatDateISO(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    /**
     * Analisa string mês-dia (MM-DD)
     */
    parseMonthDay(str) {
        if (!str) return { month: 1, day: 1 };
        const parts = str.split('-');
        return { month: parseInt(parts[0]), day: parseInt(parts[1]) };
    }
    
    /**
     * Verifica se uma data está dentro de um intervalo
     */
    isDateInRange(month, day, start, end) {
        const dateValue = month * 100 + day;
        const startValue = start.month * 100 + start.day;
        const endValue = end.month * 100 + end.day;
        if (startValue <= endValue) {
            return dateValue >= startValue && dateValue <= endValue;
        } else {
            return dateValue >= startValue || dateValue <= endValue;
        }
    }
    
    /**
     * Carrega prazos do localStorage
     */
    loadDeadlines() {
        try {
            const stored = localStorage.getItem('elite_deadlines');
            if (stored) {
                this.deadlines = JSON.parse(stored);
            } else {
                this.deadlines = [];
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar prazos:', e);
            this.deadlines = [];
        }
        return this.deadlines;
    }
    
    /**
     * Persiste prazos no localStorage
     */
    saveDeadlines() {
        try {
            localStorage.setItem('elite_deadlines', JSON.stringify(this.deadlines));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar prazos:', e);
        }
        return this;
    }
    
    /**
     * Adiciona um novo prazo
     */
    addDeadline(deadline) {
        try {
            const newDeadline = {
                id: Date.now(),
                caseId: deadline.caseId,
                description: deadline.description,
                dueDate: deadline.dueDate,
                dueDateRaw: deadline.dueDateRaw || this.parseDate(deadline.dueDate),
                type: deadline.type || 'judicial',
                priority: deadline.priority || this.calculatePriority(deadline.dueDate),
                notes: deadline.notes || '',
                status: 'pending',
                createdAt: new Date().toISOString(),
                notified: false,
                reminderSent: false
            };
            this.deadlines.push(newDeadline);
            this.saveDeadlines();
            this.checkUrgentDeadlines();
            return newDeadline;
        } catch (error) {
            console.error('[ELITE] Erro ao adicionar prazo:', error);
            return null;
        }
    }
    
    /**
     * Atualiza um prazo existente
     */
    updateDeadline(id, updates) {
        try {
            const index = this.deadlines.findIndex(d => d.id === id);
            if (index !== -1) {
                this.deadlines[index] = { ...this.deadlines[index], ...updates };
                if (updates.dueDate) {
                    this.deadlines[index].dueDateRaw = this.parseDate(updates.dueDate);
                    this.deadlines[index].priority = this.calculatePriority(updates.dueDate);
                }
                this.saveDeadlines();
            }
        } catch (error) {
            console.error('[ELITE] Erro ao atualizar prazo:', error);
        }
        return this;
    }
    
    /**
     * Remove um prazo
     */
    deleteDeadline(id) {
        try {
            this.deadlines = this.deadlines.filter(d => d.id !== id);
            this.saveDeadlines();
        } catch (error) {
            console.error('[ELITE] Erro ao remover prazo:', error);
        }
        return this;
    }
    
    /**
     * Obtém prazos de um caso específico
     */
    getDeadlinesByCase(caseId) {
        try {
            return this.deadlines.filter(d => d.caseId === caseId);
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Obtém prazos pendentes
     */
    getPendingDeadlines(days = null) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let filtered = this.deadlines.filter(d => {
                const dueDate = new Date(d.dueDateRaw);
                dueDate.setHours(0, 0, 0, 0);
                return d.status === 'pending' && dueDate >= today;
            });
            if (days) {
                const limit = new Date();
                limit.setDate(limit.getDate() + days);
                limit.setHours(23, 59, 59, 999);
                filtered = filtered.filter(d => new Date(d.dueDateRaw) <= limit);
            }
            return filtered.sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw));
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Obtém prazos vencidos
     */
    getOverdueDeadlines() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return this.deadlines.filter(d => {
                const dueDate = new Date(d.dueDateRaw);
                dueDate.setHours(0, 0, 0, 0);
                return d.status === 'pending' && dueDate < today;
            }).sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw));
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Calcula dias úteis entre duas datas
     */
    calculateBusinessDays(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            let businessDays = 0;
            let current = new Date(start);
            while (current <= end) {
                if (this.isBusinessDay(current)) businessDays++;
                current.setDate(current.getDate() + 1);
            }
            return businessDays;
        } catch (error) {
            return 0;
        }
    }
    
    /**
     * Inicia monitorização de prazos
     */
    startMonitoring() {
        try {
            if (this.monitorInterval) clearInterval(this.monitorInterval);
            const currentYear = new Date().getFullYear();
            this.calculateMovableHolidays(currentYear);
            setInterval(() => {
                const now = new Date();
                if (now.getFullYear() !== currentYear) this.calculateMovableHolidays(now.getFullYear());
            }, 24 * 60 * 60 * 1000);
            this.monitorInterval = setInterval(() => { this.checkUrgentDeadlines(); }, 60 * 60 * 1000);
            setTimeout(() => this.checkUrgentDeadlines(), 1000);
        } catch (error) {
            console.error('[ELITE] Erro ao iniciar monitorização:', error);
        }
        return this;
    }
    
    /**
     * Para monitorização de prazos
     */
    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        return this;
    }
    
    /**
     * Verifica prazos urgentes e dispara notificações
     */
    checkUrgentDeadlines() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const urgentThreshold = new Date();
            urgentThreshold.setDate(urgentThreshold.getDate() + 3);
            urgentThreshold.setHours(23, 59, 59, 999);
            const urgentDeadlines = this.deadlines.filter(d => {
                if (d.status !== 'pending') return false;
                const dueDate = new Date(d.dueDateRaw);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate <= urgentThreshold;
            });
            for (const deadline of urgentDeadlines) {
                const dueDate = new Date(deadline.dueDateRaw);
                const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                if (!deadline.notified && diffDays <= 3 && diffDays >= 0) { this.notifyDeadline(deadline, diffDays); deadline.notified = true; }
                if (!deadline.reminderSent && diffDays === 1) { this.sendReminder(deadline); deadline.reminderSent = true; }
                if (diffDays < 0 && deadline.status === 'pending') { this.notifyOverdue(deadline); deadline.status = 'overdue'; }
            }
            this.saveDeadlines();
            return urgentDeadlines;
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Notifica sobre prazo próximo
     */
    notifyDeadline(deadline, daysLeft) {
        try {
            const message = `⚠️ PRAZO JUDICIAL: ${deadline.description}\nProcesso: ${deadline.caseId}\nVence em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'} (${this.formatDate(deadline.dueDateRaw)})`;
            if (window.EliteUtils && window.EliteUtils.showToast) window.EliteUtils.showToast(message, daysLeft <= 1 ? 'error' : 'warning');
            window.dispatchEvent(new CustomEvent('deadlineUrgent', { detail: { deadline, daysLeft, message } }));
            this.logActivity(deadline, `Prazo próximo (${daysLeft} dias)`);
        } catch (error) { console.error('[ELITE] Erro ao notificar prazo:', error); }
        return this;
    }
    
    /**
     * Notifica sobre prazo vencido
     */
    notifyOverdue(deadline) {
        try {
            const overdueDays = Math.ceil((new Date() - new Date(deadline.dueDateRaw)) / (1000 * 60 * 60 * 24));
            const message = `🔴 PRAZO VENCIDO: ${deadline.description}\nProcesso: ${deadline.caseId}\nVencido há ${overdueDays} ${overdueDays === 1 ? 'dia' : 'dias'}`;
            if (window.EliteUtils && window.EliteUtils.showToast) window.EliteUtils.showToast(message, 'error');
            window.dispatchEvent(new CustomEvent('deadlineOverdue', { detail: { deadline, overdueDays, message } }));
            this.logActivity(deadline, `Prazo vencido (${overdueDays} dias)`);
        } catch (error) { console.error('[ELITE] Erro ao notificar prazo vencido:', error); }
        return this;
    }
    
    /**
     * Envia lembrete de prazo (dia anterior)
     */
    sendReminder(deadline) {
        try {
            const message = `📢 LEMBRETE: ${deadline.description}\nProcesso: ${deadline.caseId}\nVence AMANHÃ (${this.formatDate(deadline.dueDateRaw)})`;
            if (window.EliteUtils && window.EliteUtils.showToast) window.EliteUtils.showToast(message, 'warning');
            window.dispatchEvent(new CustomEvent('deadlineReminder', { detail: { deadline, message } }));
            this.logActivity(deadline, 'Lembrete enviado (D-1)');
        } catch (error) { console.error('[ELITE] Erro ao enviar lembrete:', error); }
        return this;
    }
    
    /**
     * Registra atividade no log RGPD
     */
    logActivity(deadline, action) {
        try {
            const logEntry = { timestamp: new Date().toLocaleString(), user: 'Sistema', action: `Prazo: ${action}`, entity: `${deadline.caseId} - ${deadline.description}`, hash: window.EliteUtils ? window.EliteUtils.generateHash(deadline.id + action) : null };
            const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
            logs.unshift(logEntry);
            localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
        } catch (error) { console.error('[ELITE] Erro ao registar atividade:', error); }
        return this;
    }
    
    /**
     * Marca prazo como concluído
     */
    markAsCompleted(id) {
        try {
            const deadline = this.deadlines.find(d => d.id === id);
            if (deadline) {
                deadline.status = 'completed';
                deadline.completedAt = new Date().toISOString();
                this.saveDeadlines();
                if (window.EliteUtils) window.EliteUtils.showToast(`Prazo "${deadline.description}" concluído`, 'success');
                this.logActivity(deadline, 'Prazo concluído');
            }
        } catch (error) { console.error('[ELITE] Erro ao marcar prazo como concluído:', error); }
        return this;
    }
    
    /**
     * Renderiza o calendário de prazos
     */
    renderCalendar(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const pendingDeadlines = this.getPendingDeadlines(30);
            const overdueDeadlines = this.getOverdueDeadlines();
            
            container.innerHTML = `
                <div class="court-deadlines-widget">
                    <div class="deadlines-summary"><div class="summary-card"><div class="summary-value">${pendingDeadlines.length}</div><div class="summary-label">Prazos Pendentes</div></div><div class="summary-card urgent"><div class="summary-value">${overdueDeadlines.length}</div><div class="summary-label">Prazos Vencidos</div></div><div class="summary-card"><div class="summary-value">${this.deadlines.filter(d => d.status === 'completed').length}</div><div class="summary-label">Concluídos</div></div></div>
                    <div class="deadlines-list"><h4>Próximos Prazos</h4>${pendingDeadlines.slice(0, 5).map(d => `<div class="deadline-row priority-${d.priority}"><div class="deadline-date">${this.formatDate(d.dueDateRaw)}</div><div class="deadline-info"><strong>${d.description}</strong><small>${d.caseId}</small></div><button class="complete-btn" data-id="${d.id}" title="Marcar como concluído">✓</button></div>`).join('')}${pendingDeadlines.length === 0 ? '<div class="empty-state">Nenhum prazo pendente</div>' : ''}</div>
                </div>
                <style>
                    .court-deadlines-widget{ background:var(--bg-command); border-radius:16px; padding:20px; border:1px solid var(--border-tactic); }
                    .deadlines-summary{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:20px; }
                    .summary-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; }
                    .summary-value{ font-size:1.5rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); }
                    .summary-label{ font-size:0.7rem; color:#94a3b8; }
                    .deadlines-list h4{ font-size:0.8rem; margin-bottom:12px; color:var(--elite-primary); }
                    .deadline-row{ display:flex; align-items:center; gap:12px; padding:12px; background:var(--bg-terminal); border-radius:8px; margin-bottom:8px; border-left:3px solid; }
                    .deadline-row.priority-5{ border-left-color:#ff1744; background:rgba(255,23,68,0.05); }
                    .deadline-row.priority-4{ border-left-color:#ff6b6b; }
                    .deadline-row.priority-3{ border-left-color:#ffc107; }
                    .deadline-row.priority-2{ border-left-color:#00e676; }
                    .deadline-row.priority-1{ border-left-color:#00e5ff; }
                    .deadline-date{ font-family:'JetBrains Mono'; font-size:0.7rem; min-width:80px; }
                    .deadline-info{ flex:1; }
                    .deadline-info strong{ display:block; font-size:0.8rem; }
                    .deadline-info small{ font-size:0.6rem; color:#94a3b8; }
                    .complete-btn{ background:rgba(0,230,118,0.1); border:1px solid #00e676; color:#00e676; width:28px; height:28px; border-radius:50%; cursor:pointer; transition:all 0.2s; }
                    .complete-btn:hover{ background:#00e676; color:#000; transform:scale(1.1); }
                    @media (max-width:768px){ .deadline-row{ flex-wrap:wrap; } .complete-btn{ margin-left:auto; } }
                </style>
            `;
            
            container.querySelectorAll('.complete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(btn.dataset.id);
                    this.markAsCompleted(id);
                    this.renderCalendar(containerId);
                });
            });
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar calendário:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
    
    /**
     * Exporta prazos para CSV
     */
    exportToCSV() {
        try {
            const headers = ['ID', 'Processo', 'Descrição', 'Data Vencimento', 'Tipo', 'Prioridade', 'Status', 'Notas'];
            const rows = this.deadlines.map(d => [d.id, d.caseId, d.description, this.formatDate(d.dueDateRaw), d.type, d.priority, d.status, d.notes || '']);
            const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `prazos_judiciais_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
            if (window.EliteUtils) window.EliteUtils.showToast('Prazos exportados com sucesso', 'success');
        } catch (error) { console.error('[ELITE] Erro ao exportar prazos:', error); }
        return this;
    }
    
    /**
     * Define callback para notificações personalizadas
     */
    setNotificationCallback(callback) {
        this.notificationCallback = callback;
        return this;
    }
    
    /**
     * Obtém estatísticas de prazos
     */
    getStatistics() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const pending = this.deadlines.filter(d => d.status === 'pending');
            const overdue = this.getOverdueDeadlines();
            const urgent = this.getPendingDeadlines(3);
            const byPriority = { 1: pending.filter(d => d.priority === 1).length, 2: pending.filter(d => d.priority === 2).length, 3: pending.filter(d => d.priority === 3).length, 4: pending.filter(d => d.priority === 4).length, 5: pending.filter(d => d.priority === 5).length };
            const byType = { judicial: pending.filter(d => d.type === 'judicial').length, civil: pending.filter(d => d.type === 'civil').length, procedural: pending.filter(d => d.type === 'procedural').length };
            return { total: this.deadlines.length, pending: pending.length, completed: this.deadlines.filter(d => d.status === 'completed').length, overdue: overdue.length, urgent: urgent.length, byPriority, byType, nextDeadline: pending.length > 0 ? this.formatDate(pending.sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw))[0].dueDateRaw) : null };
        } catch (error) { return { total: 0, pending: 0, completed: 0, overdue: 0, urgent: 0 }; }
    }
    
    /**
     * Obtém a data da Páscoa para um determinado ano
     */
    getEasterDate(year) { return this.calculateEasterDate(year); }
    
    /**
     * Obtém todos os feriados móveis para um ano
     */
    getMovableHolidays(year) {
        this.calculateMovableHolidays(year);
        return { carnival: this.movableHolidays.carnival, goodFriday: this.movableHolidays.goodFriday, easterSunday: this.movableHolidays.easterSunday, corpusChristi: this.movableHolidays.corpusChristi };
    }
}

// Instância global
window.CourtDeadlines = new CourtDeadlines();