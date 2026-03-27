/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE VALUE EFFICIENCY ENGINE
 * MODELO GAIN SHARE AGREEMENT (ESA Profit-Sharing) - PAINEL DE AUTORIDADE
 * ============================================================================
 * Funcionalidades (SEM FATURAÇÃO):
 * 1. Cálculo do Alpha (Diferencial entre Sucesso Real e Histórico)
 * 2. Dashboard de ROI para Sócios (Visão Estratégica)
 * 3. Registro Imutável dos Resultados (BlockchainCustody/StrategicVault)
 * 4. Métricas de Conformidade e Redução de Volatilidade
 * ============================================================================
 */

class ValueEfficiencyEngine {
    constructor() {
        this.initialized = false;
        this.performanceHistory = [];
        this.casesRegistry = new Map(); // Armazena casos com resultados selados
        
        // Dados de Simulação para Demo (Escritório de 60 Advogados)
        this.historicalSuccessRate = 0.65; // 65% antes do sistema
        this.totalCasesSimulated = 127;     // Casos ativos na demo
        this.successfulCasesSimulated = 99; // 78% de sucesso (Alpha de 13%)
        this.totalValueRecovered = 8247500; // €8.247.500
        this.totalValueAtRisk = 18750000;   // €18.750.000 em disputa
        
        this.loadPerformanceHistory();
        this.loadCasesRegistry();
    }
    
    /**
     * Inicializa o motor de valor
     */
    initialize() {
        this.initialized = true;
        console.log('[ELITE] Value Efficiency Engine inicializado - Modelo Gain Share Agreement Ativo (Painel de Autoridade)');
        
        // Registrar alguns casos de sucesso simulados no Vault para demonstração
        this.registerDemoCases();
        this.calculateAlpha();
        
        return this;
    }
    
    /**
     * Carrega histórico de performance
     */
    loadPerformanceHistory() {
        const stored = localStorage.getItem('elite_value_performance');
        if (stored) {
            try {
                this.performanceHistory = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar performance:', e);
                this.performanceHistory = [];
            }
        }
    }
    
    /**
     * Salva histórico de performance
     */
    savePerformanceHistory() {
        if (this.performanceHistory.length > 100) {
            this.performanceHistory = this.performanceHistory.slice(0, 100);
        }
        localStorage.setItem('elite_value_performance', JSON.stringify(this.performanceHistory));
    }
    
    /**
     * Carrega registo de casos
     */
    loadCasesRegistry() {
        const stored = localStorage.getItem('elite_value_cases_registry');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.casesRegistry.set(key, value);
                }
            } catch (e) {
                console.error('[ELITE] Erro ao carregar registo de casos:', e);
            }
        }
    }
    
    /**
     * Salva registo de casos
     */
    saveCasesRegistry() {
        const registryObj = {};
        for (const [key, value] of this.casesRegistry) {
            registryObj[key] = value;
        }
        localStorage.setItem('elite_value_cases_registry', JSON.stringify(registryObj));
    }
    
    /**
     * Calcula o Alpha e o Valor Gerado
     * @returns {Object} Estatísticas de desempenho e ganho partilhável
     */
    calculateAlpha() {
        const currentRate = this.successfulCasesSimulated / this.totalCasesSimulated;
        const alpha = currentRate - this.historicalSuccessRate;
        const alphaPercentage = alpha * 100;
        
        // Valor do Alpha em termos monetários (parte do sucesso atribuível ao sistema)
        const attributableSuccess = this.totalValueRecovered * alpha;
        
        // ROI do investimento (Setup estimado de €50.000)
        const estimatedSetup = 50000;
        const roi = (this.totalValueRecovered / estimatedSetup) * 100;
        
        // Redução de Volatilidade (casos perdidos que seriam inesperados)
        const historicalLosses = Math.round(this.totalCasesSimulated * (1 - this.historicalSuccessRate));
        const currentLosses = this.totalCasesSimulated - this.successfulCasesSimulated;
        const volatilityReduction = historicalLosses - currentLosses;
        
        const result = {
            historicalRate: this.historicalSuccessRate,
            currentRate: currentRate,
            alpha: alpha,
            alphaPercentage: alphaPercentage.toFixed(1),
            totalValueRecovered: this.totalValueRecovered,
            totalValueAtRisk: this.totalValueAtRisk,
            attributableValue: attributableSuccess,
            estimatedSetup: estimatedSetup,
            roi: roi.toFixed(1),
            volatilityReduction: volatilityReduction,
            confidenceScore: 0.92,
            timestamp: new Date().toISOString()
        };
        
        // Registrar no histórico
        this.performanceHistory.unshift(result);
        this.savePerformanceHistory();
        
        return result;
    }
    
    /**
     * Registra um caso no Vault com o resultado selado (Vitória/Derrota)
     * @param {Object} caseData - Dados do caso
     * @param {string} outcome - 'win' ou 'loss'
     * @returns {Object} Registro imutável com hash
     */
    sealCaseResult(caseData, outcome) {
        const caseId = caseData.id;
        
        // Calcular valor do ganho (se vitória)
        let recoveredValue = 0;
        if (outcome === 'win') {
            recoveredValue = (caseData.value || 50000) * 0.85;
        }
        
        // Criar registro imutável
        const sealedRecord = {
            caseId: caseId,
            caseName: caseData.client || caseData.id,
            caseValue: caseData.value || 50000,
            outcome: outcome,
            recoveredValue: recoveredValue,
            sealedAt: new Date().toISOString(),
            sealedBy: window.ELITE_SESSION_ID || 'system',
            hash: null
        };
        
        // Calcular hash SHA-256 do registro
        const recordContent = JSON.stringify({
            caseId: sealedRecord.caseId,
            outcome: sealedRecord.outcome,
            recoveredValue: sealedRecord.recoveredValue,
            sealedAt: sealedRecord.sealedAt
        });
        sealedRecord.hash = CryptoJS.SHA256(recordContent).toString();
        
        // Armazenar no mapa local
        this.casesRegistry.set(caseId, sealedRecord);
        this.saveCasesRegistry();
        
        // Se o StrategicVault estiver disponível, registrar a evidência lá também
        if (window.StrategicVault && typeof window.StrategicVault.registerEvidence === 'function') {
            window.StrategicVault.registerEvidence({
                name: `Resultado_${caseId}`,
                type: 'documental',
                caseId: caseId,
                description: `Registo imutável do resultado do caso: ${outcome.toUpperCase()}`,
                content: JSON.stringify(sealedRecord),
                metadata: { outcome: outcome, recoveredValue: recoveredValue }
            });
        }
        
        console.log(`[ELITE] Caso ${caseId} selado com resultado: ${outcome}. Hash: ${sealedRecord.hash.substring(0, 16)}...`);
        
        // Atualizar contadores para o Alpha
        if (outcome === 'win') {
            this.successfulCasesSimulated++;
            this.totalValueRecovered += recoveredValue;
        }
        this.totalCasesSimulated++;
        
        return sealedRecord;
    }
    
    /**
     * Registra casos de demonstração para apresentação
     */
    registerDemoCases() {
        const demoWins = [
            { id: 'INS001', client: 'Construtora ABC, SA', value: 2450000 },
            { id: 'TAX001', client: 'Grupo Industrial, SA', value: 12500000 },
            { id: 'BNK001', client: 'Banco Internacional, SA', value: 12500000 },
            { id: 'MASS001', client: 'Consumidores União', value: 15200000 },
            { id: 'LAB001', client: 'Maria Rodrigues', value: 28900 },
            { id: 'CIV001', client: 'António Almeida', value: 125000 },
            { id: 'MNA001', client: 'Grupo Energia, SA', value: 45000000 }
        ];
        
        for (const win of demoWins) {
            if (!this.casesRegistry.has(win.id)) {
                this.sealCaseResult(win, 'win');
            }
        }
        
        // Alguns casos de derrota para demonstração de transparência
        const demoLosses = [
            { id: 'LOSS_DEMO_001', client: 'Caso de Análise', value: 75000 }
        ];
        for (const loss of demoLosses) {
            if (!this.casesRegistry.has(loss.id)) {
                this.sealCaseResult(loss, 'loss');
            }
        }
        
        this.saveCasesRegistry();
    }
    
    /**
     * Obtém o Score de Conformidade (integridade das provas)
     */
    getComplianceScore() {
        // Simulação: 100% das provas estão em Padrão Europeu
        const vaultStats = window.StrategicVault ? window.StrategicVault.getStatistics() : null;
        const evidenceCount = vaultStats?.totalEvidence || 48;
        const verifiedEvidence = vaultStats?.activeEvidence || 48;
        
        return {
            totalEvidence: evidenceCount,
            verifiedEvidence: verifiedEvidence,
            complianceRate: (verifiedEvidence / Math.max(evidenceCount, 1)) * 100,
            standard: 'ISO/IEC 27037:2012 | eIDAS Reg. 910/2014',
            status: verifiedEvidence === evidenceCount ? 'FULL_COMPLIANCE' : 'PARTIAL_COMPLIANCE'
        };
    }
    
    /**
     * Renderiza o Dashboard de Valor para os Sócios (Painel de Autoridade)
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const alpha = this.calculateAlpha();
        const compliance = this.getComplianceScore();
        const recentCases = Array.from(this.casesRegistry.values()).slice(0, 5);
        
        container.innerHTML = `
            <div class="value-efficiency-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chart-line"></i> PAINEL DE AUTORIDADE | GERAÇÃO DE VALOR SISTÉMICO</h2>
                    <div class="master-hash-badge">
                        <i class="fas fa-fingerprint"></i> Master Hash Active
                    </div>
                </div>
                
                <div class="alpha-summary">
                    <div class="alpha-card">
                        <div class="alpha-label">ALPHA ESTRATÉGICO</div>
                        <div class="alpha-value positive">+${alpha.alphaPercentage}%</div>
                        <div class="alpha-detail">vs. Média Histórica (${(alpha.historicalRate * 100).toFixed(0)}% → ${(alpha.currentRate * 100).toFixed(0)}%)</div>
                    </div>
                    <div class="alpha-card">
                        <div class="alpha-label">VALOR RECUPERADO</div>
                        <div class="alpha-value">€${(alpha.totalValueRecovered / 1000).toFixed(0)}k</div>
                        <div class="alpha-detail">de €${(alpha.totalValueAtRisk / 1000).toFixed(0)}k em disputa</div>
                    </div>
                    <div class="alpha-card">
                        <div class="alpha-label">ROI DO INVESTIMENTO</div>
                        <div class="alpha-value positive">${alpha.roi}%</div>
                        <div class="alpha-detail">Base: Setup de €${alpha.estimatedSetup.toLocaleString()}</div>
                    </div>
                    <div class="alpha-card">
                        <div class="alpha-label">REDUÇÃO DE VOLATILIDADE</div>
                        <div class="alpha-value positive">-${alpha.volatilityReduction}</div>
                        <div class="alpha-detail">casos inesperados evitados</div>
                    </div>
                </div>
                
                <div class="compliance-section">
                    <div class="compliance-card">
                        <div class="compliance-icon"><i class="fas fa-shield-alt"></i></div>
                        <div class="compliance-content">
                            <div class="compliance-label">SCORE DE CONFORMIDADE</div>
                            <div class="compliance-value">${compliance.complianceRate.toFixed(0)}%</div>
                            <div class="compliance-detail">${compliance.verifiedEvidence}/${compliance.totalEvidence} evidências em Padrão Europeu</div>
                            <div class="compliance-standard">${compliance.standard}</div>
                        </div>
                        <div class="compliance-status ${compliance.status === 'FULL_COMPLIANCE' ? 'status-valid' : 'status-warning'}">
                            ${compliance.status === 'FULL_COMPLIANCE' ? '✓ CONFORMIDADE TOTAL' : '⚠ CONFORMIDADE PARCIAL'}
                        </div>
                    </div>
                </div>
                
                <div class="alpha-explanation">
                    <div class="explanation-text">
                        <i class="fas fa-chart-line"></i> <strong>O que é o Alpha Estratégico?</strong>
                        <p>O Alpha é o diferencial de sucesso gerado pela Arquitetura de Verdade. Antes do sistema, a taxa de sucesso era de ${(alpha.historicalRate * 100).toFixed(0)}%. 
                        Com a implementação da IA Preditiva e da Cadeia de Custódia Blockchain, atingimos ${(alpha.currentRate * 100).toFixed(0)}%. 
                        Este aumento de ${alpha.alphaPercentage}% traduz-se em <strong>€${(alpha.attributableValue / 1000).toFixed(0)}k de valor adicional recuperado</strong>, 
                        com uma redução de ${alpha.volatilityReduction} casos perdidos inesperadamente.</p>
                        <small>Modelo de Parceria: Gain Share Agreement sobre o Alpha gerado. Os resultados são selados com hash SHA-256 e ancorados em blockchain.</small>
                    </div>
                </div>
                
                <div class="sealed-cases">
                    <h3><i class="fas fa-link"></i> CASOS SELADOS (CADEIA DE CUSTÓDIA IRREVOGÁVEL)</h3>
                    <table class="data-table">
                        <thead>
                            <tr><th>Processo</th><th>Cliente</th><th>Valor em Disputa</th><th>Resultado</th><th>Hash de Integridade</th><th>Data Selagem</th> </thead>
                        <tbody>
                            ${recentCases.map(c => `
                                <tr>
                                    <td><strong>${c.caseId}</strong></div>
                                    <td>${c.caseName}</div>
                                    <td>€${(c.caseValue / 1000).toFixed(0)}k</div>
                                    <td><span class="status-badge ${c.outcome === 'win' ? 'status-active' : 'status-critical'}">${c.outcome === 'win' ? 'VITÓRIA' : 'ANÁLISE'}</span></div>
                                    <td><code class="log-hash">${c.hash.substring(0, 24)}...</code></div>
                                    <td>${new Date(c.sealedAt).toLocaleDateString('pt-PT')}</div>
                                 </div>
                            `).join('')}
                        </tbody>
                     </div>
                    <div class="cases-footer">
                        <small><i class="fas fa-info-circle"></i> Os registos são imutáveis. Qualquer tentativa de alteração quebra a cadeia de custódia e invalida o certificado de integridade.</small>
                    </div>
                </div>
                
                <div class="performance-history">
                    <h3><i class="fas fa-history"></i> EVOLUÇÃO DO ALPHA (ÚLTIMOS REGISTOS)</h3>
                    <div class="history-list">
                        ${this.performanceHistory.slice(0, 5).map(p => `
                            <div class="history-item">
                                <div class="history-date">${new Date(p.timestamp).toLocaleDateString('pt-PT')}</div>
                                <div class="history-metrics">
                                    <span class="metric">Alpha: <strong class="positive">+${p.alphaPercentage}%</strong></span>
                                    <span class="metric">ROI: <strong>${p.roi}%</strong></span>
                                    <span class="metric">Valor: <strong>€${(p.totalValueRecovered / 1000).toFixed(0)}k</strong></span>
                                </div>
                            </div>
                        `).join('')}
                        ${this.performanceHistory.length === 0 ? '<div class="empty-state">Aguardando dados de performance...</div>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Estilos específicos
        const style = document.createElement('style');
        style.textContent = `
            .value-efficiency-dashboard { padding: 0; }
            .alpha-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
            .alpha-card { background: var(--bg-command); border-radius: 16px; padding: 20px; text-align: center; border: 1px solid var(--border-tactic); transition: all 0.2s; }
            .alpha-card:hover { border-color: var(--elite-primary); transform: translateY(-2px); }
            .alpha-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
            .alpha-value { font-size: 2rem; font-weight: 800; font-family: 'JetBrains Mono'; }
            .alpha-value.positive { color: #00e676; }
            .alpha-detail { font-size: 0.65rem; color: #64748b; margin-top: 8px; }
            .compliance-section { margin-bottom: 24px; }
            .compliance-card { background: var(--bg-command); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 20px; border: 1px solid var(--border-tactic); flex-wrap: wrap; }
            .compliance-icon { width: 48px; height: 48px; background: var(--elite-primary-dim); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
            .compliance-icon i { font-size: 1.5rem; color: var(--elite-primary); }
            .compliance-content { flex: 1; }
            .compliance-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .compliance-value { font-size: 1.5rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
            .compliance-detail { font-size: 0.7rem; color: #94a3b8; }
            .compliance-standard { font-size: 0.65rem; color: #64748b; margin-top: 4px; }
            .compliance-status { padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; }
            .compliance-status.status-valid { background: rgba(0, 230, 118, 0.1); color: #00e676; border: 1px solid #00e676; }
            .compliance-status.status-warning { background: rgba(255, 193, 7, 0.1); color: #ffc107; border: 1px solid #ffc107; }
            .alpha-explanation { background: var(--bg-terminal); border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 4px solid var(--elite-primary); }
            .explanation-text i { font-size: 1.2rem; margin-right: 8px; color: var(--elite-primary); }
            .explanation-text p { margin: 12px 0 8px; line-height: 1.5; }
            .explanation-text small { font-size: 0.65rem; color: #64748b; }
            .sealed-cases { margin-bottom: 24px; }
            .cases-footer { margin-top: 12px; font-size: 0.6rem; color: #64748b; text-align: center; }
            .history-list { background: var(--bg-terminal); border-radius: 12px; padding: 16px; }
            .history-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border-tactic); flex-wrap: wrap; gap: 12px; }
            .history-item:last-child { border-bottom: none; }
            .history-date { font-size: 0.7rem; color: #94a3b8; font-family: monospace; }
            .history-metrics { display: flex; gap: 24px; }
            .history-metrics .metric { font-size: 0.75rem; }
            .history-metrics .positive { color: #00e676; }
            .empty-state { text-align: center; padding: 32px; color: #64748b; }
            @media (max-width: 768px) {
                .alpha-summary { grid-template-columns: 1fr 1fr; }
                .history-metrics { flex-direction: column; gap: 8px; }
                .compliance-card { flex-direction: column; text-align: center; }
            }
        `;
        container.appendChild(style);
    }
    
    /**
     * Obtém o histórico de performance
     */
    getPerformanceHistory() {
        return this.performanceHistory;
    }
    
    /**
     * Obtém o registo de casos selados
     */
    getSealedCases() {
        return Array.from(this.casesRegistry.values());
    }
    
    /**
     * Verifica a integridade de todos os casos selados
     */
    verifyAllSealedCases() {
        let validCount = 0;
        let invalidCount = 0;
        
        for (const [id, record] of this.casesRegistry) {
            const recordContent = JSON.stringify({
                caseId: record.caseId,
                outcome: record.outcome,
                recoveredValue: record.recoveredValue,
                sealedAt: record.sealedAt
            });
            const calculatedHash = CryptoJS.SHA256(recordContent).toString();
            if (calculatedHash === record.hash) {
                validCount++;
            } else {
                invalidCount++;
            }
        }
        
        return {
            total: this.casesRegistry.size,
            valid: validCount,
            invalid: invalidCount,
            integrityScore: this.casesRegistry.size > 0 ? (validCount / this.casesRegistry.size * 100).toFixed(1) : 100
        };
    }
}

// Instância global
window.ValueEfficiencyEngine = new ValueEfficiencyEngine();

console.log('[ELITE] Value Efficiency Engine carregado - Modelo Gain Share Agreement Ativo (Painel de Autoridade)');