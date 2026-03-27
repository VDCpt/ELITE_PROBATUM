/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE PRACTICE DASHBOARD
 * ============================================================================
 * Dashboard consolidado para gestão de prática jurídica
 * Integra métricas de performance, eficiência e inteligência de mercado
 * SEM QUALQUER FUNCIONALIDADE DE FATURAÇÃO
 * ============================================================================
 * Funcionalidades:
 * 1. Visão geral da prática por área do direito
 * 2. Métricas de performance por equipa
 * 3. Análise de tendências por setor
 * 4. Scorecard de saúde da prática
 * 5. Relatórios executivos para sócios
 * ============================================================================
 */

class PracticeDashboard {
    constructor() {
        this.practiceData = [];
        this.sectorMetrics = new Map();
        this.teamPerformance = new Map();
        this.trendAnalysis = [];
        this.healthScore = null;
        this.initialized = false;
        
        this.loadPracticeData();
        this.loadSectorMetrics();
        this.loadTeamPerformance();
    }
    
    /**
     * Inicializa o dashboard de prática
     */
    initialize() {
        try {
            this.initialized = true;
            this.calculateHealthScore();
            this.analyzeTrends();
            console.log('[ELITE] Practice Dashboard inicializado - Visão Estratégica da Prática');
        } catch (error) {
            console.error('[ELITE] Erro na inicialização:', error);
            this.initialized = false;
        }
        return this;
    }
    
    /**
     * Carrega dados da prática
     */
    loadPracticeData() {
        try {
            const stored = localStorage.getItem('elite_practice_data');
            if (stored) {
                this.practiceData = JSON.parse(stored);
            } else {
                this.initDemoPracticeData();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar dados da prática:', e);
            this.initDemoPracticeData();
        }
    }
    
    /**
     * Inicializa dados de demonstração da prática
     */
    initDemoPracticeData() {
        try {
            this.practiceData = [
                { area: 'Insolvência (CIRE)', activeCases: 42, newCasesMonth: 8, successRate: 0.72, avgDuration: 145, revenueShare: 0.28, teamSize: 8, trend: 'rising', priority: 'high' },
                { area: 'Direito Fiscal', activeCases: 38, newCasesMonth: 6, successRate: 0.78, avgDuration: 112, revenueShare: 0.24, teamSize: 7, trend: 'rising', priority: 'high' },
                { area: 'Contencioso Bancário', activeCases: 25, newCasesMonth: 4, successRate: 0.68, avgDuration: 158, revenueShare: 0.18, teamSize: 5, trend: 'stable', priority: 'medium' },
                { area: 'Direito do Trabalho', activeCases: 32, newCasesMonth: 7, successRate: 0.82, avgDuration: 95, revenueShare: 0.12, teamSize: 6, trend: 'rising', priority: 'high' },
                { area: 'Direito Civil', activeCases: 28, newCasesMonth: 5, successRate: 0.65, avgDuration: 125, revenueShare: 0.10, teamSize: 5, trend: 'stable', priority: 'medium' },
                { area: 'Direito Comercial', activeCases: 22, newCasesMonth: 4, successRate: 0.71, avgDuration: 118, revenueShare: 0.08, teamSize: 4, trend: 'stable', priority: 'medium' },
                { area: 'Arbitragem', activeCases: 15, newCasesMonth: 3, successRate: 0.85, avgDuration: 85, revenueShare: 0.06, teamSize: 3, trend: 'rising', priority: 'high' },
                { area: 'Litigância de Massa', activeCases: 35, newCasesMonth: 12, successRate: 0.74, avgDuration: 105, revenueShare: 0.14, teamSize: 6, trend: 'rising', priority: 'critical' }
            ];
            this.savePracticeData();
        } catch (e) {
            console.error('[ELITE] Erro ao inicializar dados demo:', e);
            this.practiceData = [];
        }
    }
    
    /**
     * Salva dados da prática
     */
    savePracticeData() {
        try {
            localStorage.setItem('elite_practice_data', JSON.stringify(this.practiceData));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar dados da prática:', e);
        }
    }
    
    /**
     * Carrega métricas por setor
     */
    loadSectorMetrics() {
        try {
            const stored = localStorage.getItem('elite_sector_metrics');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.sectorMetrics.set(key, value);
                }
            } else {
                this.initDemoSectorMetrics();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar métricas de setor:', e);
            this.initDemoSectorMetrics();
        }
    }
    
    /**
     * Inicializa métricas de setor de demonstração
     */
    initDemoSectorMetrics() {
        try {
            const sectors = ['TVDE', 'E-commerce', 'Delivery', 'Hotelaria', 'Fintech', 'Saúde'];
            for (const sector of sectors) {
                this.sectorMetrics.set(sector, {
                    name: sector,
                    caseVolume: Math.floor(Math.random() * 100) + 20,
                    growthRate: 0.05 + Math.random() * 0.2,
                    avgCaseValue: 5000 + Math.random() * 30000,
                    successRate: 0.55 + Math.random() * 0.3,
                    marketPotential: 0.4 + Math.random() * 0.5,
                    trend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining'
                });
            }
            this.saveSectorMetrics();
        } catch (e) {
            console.error('[ELITE] Erro ao inicializar métricas de setor:', e);
        }
    }
    
    /**
     * Salva métricas de setor
     */
    saveSectorMetrics() {
        try {
            const metricsObj = {};
            for (const [key, value] of this.sectorMetrics) {
                metricsObj[key] = value;
            }
            localStorage.setItem('elite_sector_metrics', JSON.stringify(metricsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar métricas de setor:', e);
        }
    }
    
    /**
     * Carrega performance por equipa
     */
    loadTeamPerformance() {
        try {
            const stored = localStorage.getItem('elite_team_performance');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.teamPerformance.set(key, value);
                }
            } else {
                this.initDemoTeamPerformance();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar performance de equipa:', e);
            this.initDemoTeamPerformance();
        }
    }
    
    /**
     * Inicializa performance de equipa de demonstração
     */
    initDemoTeamPerformance() {
        try {
            const teams = ['Litígio', 'Fiscal', 'Arbitragem', 'Laboral', 'Civil', 'Comercial'];
            for (const team of teams) {
                this.teamPerformance.set(team, {
                    name: team,
                    efficiency: 0.65 + Math.random() * 0.25,
                    successRate: 0.6 + Math.random() * 0.3,
                    caseLoad: Math.floor(Math.random() * 50) + 20,
                    avgResolutionDays: 80 + Math.random() * 80,
                    clientSatisfaction: 3.5 + Math.random() * 1.5,
                    teamSize: Math.floor(Math.random() * 8) + 2,
                    trend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining'
                });
            }
            this.saveTeamPerformance();
        } catch (e) {
            console.error('[ELITE] Erro ao inicializar performance de equipa:', e);
        }
    }
    
    /**
     * Salva performance de equipa
     */
    saveTeamPerformance() {
        try {
            const perfObj = {};
            for (const [key, value] of this.teamPerformance) {
                perfObj[key] = value;
            }
            localStorage.setItem('elite_team_performance', JSON.stringify(perfObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar performance de equipa:', e);
        }
    }
    
    /**
     * Calcula score de saúde da prática
     */
    calculateHealthScore() {
        try {
            const totalCases = this.practiceData.reduce((sum, p) => sum + p.activeCases, 0);
            const avgSuccess = this.practiceData.reduce((sum, p) => sum + p.successRate, 0) / this.practiceData.length;
            const growthRate = this.practiceData.reduce((sum, p) => sum + (p.newCasesMonth / Math.max(p.activeCases, 1)), 0) / this.practiceData.length;
            
            const diversityScore = Math.min(this.practiceData.length / 10, 1);
            const successScore = avgSuccess;
            const growthScore = Math.min(growthRate, 1);
            const volumeScore = Math.min(totalCases / 100, 1);
            
            const healthScore = (successScore * 0.4) + (growthScore * 0.3) + (volumeScore * 0.2) + (diversityScore * 0.1);
            
            this.healthScore = {
                score: (healthScore * 100).toFixed(1),
                classification: healthScore > 0.8 ? 'Excelente' : healthScore > 0.6 ? 'Boa' : healthScore > 0.4 ? 'Moderada' : 'Crítica',
                components: {
                    successRate: (avgSuccess * 100).toFixed(1) + '%',
                    growthRate: (growthRate * 100).toFixed(1) + '%',
                    totalCases: totalCases,
                    practiceAreas: this.practiceData.length
                },
                recommendations: this.generateHealthRecommendations(healthScore, avgSuccess, growthRate)
            };
        } catch (error) {
            this.healthScore = { score: '0', classification: 'Indeterminada', components: {}, recommendations: [] };
        }
    }
    
    /**
     * Gera recomendações baseadas no score de saúde
     */
    generateHealthRecommendations(healthScore, successRate, growthRate) {
        const recommendations = [];
        if (successRate < 0.7) recommendations.push('📉 Reforçar estratégias probatórias para aumentar taxa de sucesso');
        if (growthRate < 0.1) recommendations.push('📊 Expandir captação de casos em áreas com maior potencial');
        if (healthScore < 0.5) recommendations.push('⚠️ Revisão urgente da estratégia de prática - risco sistémico');
        if (successRate > 0.75 && growthRate > 0.15) recommendations.push('🚀 Oportunidade de expansão - consolidar áreas de sucesso');
        if (recommendations.length === 0) recommendations.push('✅ Prática saudável - manter estratégia atual');
        return recommendations;
    }
    
    /**
     * Analisa tendências por área
     */
    analyzeTrends() {
        try {
            this.trendAnalysis = this.practiceData.map(area => ({
                area: area.area,
                currentSuccess: (area.successRate * 100).toFixed(1) + '%',
                trend: area.trend,
                priority: area.priority,
                growthPotential: area.newCasesMonth / Math.max(area.activeCases, 1),
                recommendation: this.getAreaRecommendation(area)
            }));
        } catch (error) {
            this.trendAnalysis = [];
        }
    }
    
    /**
     * Obtém recomendação por área
     */
    getAreaRecommendation(area) {
        if (area.trend === 'rising' && area.successRate > 0.7) return 'Expandir equipa e captação - alta performance';
        if (area.trend === 'rising' && area.successRate < 0.6) return 'Reforçar argumentação - potencial não aproveitado';
        if (area.trend === 'declining') return 'Revisão estratégica - avaliar causas da queda';
        if (area.priority === 'critical') return 'Atenção prioritária - área crítica para o escritório';
        return 'Manter estratégia atual - monitorizar evolução';
    }
    
    /**
     * Obtém áreas com maior potencial
     */
    getTopOpportunityAreas(limit = 3) {
        return this.practiceData
            .filter(a => a.trend === 'rising')
            .sort((a, b) => (b.newCasesMonth / Math.max(b.activeCases, 1)) - (a.newCasesMonth / Math.max(a.activeCases, 1)))
            .slice(0, limit)
            .map(a => ({
                area: a.area,
                growthRate: ((a.newCasesMonth / Math.max(a.activeCases, 1)) * 100).toFixed(1) + '%',
                successRate: (a.successRate * 100).toFixed(1) + '%',
                recommendation: this.getAreaRecommendation(a)
            }));
    }
    
    /**
     * Obtém áreas com risco crítico
     */
    getCriticalAreas() {
        return this.practiceData
            .filter(a => a.priority === 'critical' || a.trend === 'declining')
            .map(a => ({
                area: a.area,
                risk: a.priority === 'critical' ? 'ALTO' : 'MODERADO',
                currentSuccess: (a.successRate * 100).toFixed(1) + '%',
                recommendation: this.getAreaRecommendation(a)
            }));
    }
    
    /**
     * Obtém benchmarking com mercado
     */
    getMarketBenchmark() {
        const avgFirmSuccess = this.practiceData.reduce((sum, a) => sum + a.successRate, 0) / this.practiceData.length;
        const marketAvgSuccess = 0.62;
        const marketAvgDuration = 125;
        const firmAvgDuration = this.practiceData.reduce((sum, a) => sum + a.avgDuration, 0) / this.practiceData.length;
        
        return {
            successRate: {
                firm: (avgFirmSuccess * 100).toFixed(1) + '%',
                market: (marketAvgSuccess * 100).toFixed(1) + '%',
                delta: ((avgFirmSuccess - marketAvgSuccess) * 100).toFixed(1),
                position: avgFirmSuccess > marketAvgSuccess ? 'acima' : 'abaixo'
            },
            avgDuration: {
                firm: firmAvgDuration.toFixed(0) + ' dias',
                market: marketAvgDuration + ' dias',
                delta: (firmAvgDuration - marketAvgDuration).toFixed(0),
                position: firmAvgDuration < marketAvgDuration ? 'melhor' : 'pior'
            }
        };
    }
    
    /**
     * Obtém estatísticas gerais da prática
     */
    getStatistics() {
        const totalCases = this.practiceData.reduce((sum, p) => sum + p.activeCases, 0);
        const totalNewCases = this.practiceData.reduce((sum, p) => sum + p.newCasesMonth, 0);
        const avgSuccess = this.practiceData.reduce((sum, p) => sum + p.successRate, 0) / this.practiceData.length;
        const totalTeams = this.teamPerformance.size;
        
        return {
            totalActiveCases: totalCases,
            totalNewCasesMonth: totalNewCases,
            avgSuccessRate: (avgSuccess * 100).toFixed(1) + '%',
            practiceAreas: this.practiceData.length,
            teamsCount: totalTeams,
            healthScore: this.healthScore?.score || '0',
            healthClassification: this.healthScore?.classification || 'Indeterminada'
        };
    }
    
    /**
     * Renderiza dashboard de prática
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const stats = this.getStatistics();
            const opportunities = this.getTopOpportunityAreas(3);
            const criticalAreas = this.getCriticalAreas();
            const benchmark = this.getMarketBenchmark();
            const sectorMetrics = Array.from(this.sectorMetrics.values()).slice(0, 6);
            const teamPerformance = Array.from(this.teamPerformance.values()).sort((a, b) => b.efficiency - a.efficiency);
            
            container.innerHTML = `
                <div class="practice-dashboard">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-pie"></i> DASHBOARD DE PRÁTICA ESTRATÉGICA</h2><div class="health-badge health-${this.healthScore?.classification?.toLowerCase() || 'moderada'}"><i class="fas fa-heartbeat"></i> Saúde: ${this.healthScore?.score || '0'}%</div></div>
                    
                    <div class="stats-grid"><div class="stat-card"><div class="stat-value">${stats.totalActiveCases}</div><div class="stat-label">Casos Ativos</div><div class="stat-trend">+${stats.totalNewCasesMonth} este mês</div></div>
                    <div class="stat-card"><div class="stat-value">${stats.avgSuccessRate}</div><div class="stat-label">Taxa de Sucesso Média</div><div class="stat-trend ${benchmark.successRate.position === 'acima' ? 'positive' : 'negative'}">${benchmark.successRate.delta > 0 ? '+' : ''}${benchmark.successRate.delta}% vs mercado</div></div>
                    <div class="stat-card"><div class="stat-value">${stats.practiceAreas}</div><div class="stat-label">Áreas de Prática</div><div class="stat-trend">${stats.teamsCount} equipas</div></div>
                    <div class="stat-card"><div class="stat-value">${benchmark.avgDuration.firm}</div><div class="stat-label">Duração Média</div><div class="stat-trend ${benchmark.avgDuration.position === 'melhor' ? 'positive' : 'negative'}">${Math.abs(parseFloat(benchmark.avgDuration.delta))} dias vs mercado</div></div></div>
                    
                    <div class="health-section"><div class="health-card"><div class="health-score">${this.healthScore?.score || '0'}%</div><div class="health-classification ${this.healthScore?.classification?.toLowerCase() || 'moderada'}">${this.healthScore?.classification || 'Indeterminada'}</div><div class="health-recommendations"><strong>Recomendações:</strong><ul>${(this.healthScore?.recommendations || []).map(r => `<li>${r}</li>`).join('')}</ul></div></div></div>
                    
                    <div class="two-columns"><div class="column"><h3><i class="fas fa-rocket"></i> ÁREAS COM MAIOR POTENCIAL</h3><div class="opportunities-list">${opportunities.map(o => `<div class="opportunity-card"><div class="opp-header"><strong>${o.area}</strong><span class="growth-badge">Crescimento: ${o.growthRate}</span></div><div class="opp-stats">🎯 Sucesso: ${o.successRate}</div><div class="opp-recommendation">💡 ${o.recommendation}</div></div>`).join('')}${opportunities.length === 0 ? '<div class="empty-state">Nenhuma oportunidade identificada</div>' : ''}</div></div>
                    <div class="column"><h3><i class="fas fa-exclamation-triangle"></i> ÁREAS CRÍTICAS</h3><div class="critical-list">${criticalAreas.map(c => `<div class="critical-card risk-${c.risk.toLowerCase()}"><div class="critical-header"><strong>${c.area}</strong><span class="risk-badge">${c.risk}</span></div><div class="critical-stats">📉 Sucesso: ${c.currentSuccess}</div><div class="critical-recommendation">⚠️ ${c.recommendation}</div></div>`).join('')}${criticalAreas.length === 0 ? '<div class="empty-state">✅ Nenhuma área crítica identificada</div>' : ''}</div></div></div>
                    
                    <div class="benchmark-section"><h3><i class="fas fa-chart-simple"></i> BENCHMARKING DE MERCADO</h3><div class="benchmark-grid"><div class="benchmark-card"><div class="benchmark-label">Taxa de Sucesso</div><div class="benchmark-values"><div><span>ELITE:</span><strong>${benchmark.successRate.firm}</strong></div><div><span>Mercado:</span><strong>${benchmark.successRate.market}</strong></div></div><div class="benchmark-delta ${benchmark.successRate.position === 'acima' ? 'positive' : 'negative'}">${benchmark.successRate.delta > 0 ? '+' : ''}${benchmark.successRate.delta}%</div></div>
                    <div class="benchmark-card"><div class="benchmark-label">Duração Média (dias)</div><div class="benchmark-values"><div><span>ELITE:</span><strong>${benchmark.avgDuration.firm}</strong></div><div><span>Mercado:</span><strong>${benchmark.avgDuration.market}</strong></div></div><div class="benchmark-delta ${benchmark.avgDuration.position === 'melhor' ? 'positive' : 'negative'}">${benchmark.avgDuration.delta > 0 ? '+' : ''}${benchmark.avgDuration.delta} dias</div></div></div></div>
                    
                    <div class="sector-section"><h3><i class="fas fa-industry"></i> INTELIGÊNCIA POR SETOR</h3><div class="sector-grid">${sectorMetrics.map(s => `<div class="sector-card"><div class="sector-name"><strong>${s.name}</strong><span class="trend-${s.trend}">${s.trend === 'rising' ? '📈' : s.trend === 'declining' ? '📉' : '📊'}</span></div><div class="sector-stats"><div>Casos: ${s.caseVolume}</div><div>Crescimento: ${(s.growthRate * 100).toFixed(0)}%</div><div>Sucesso: ${(s.successRate * 100).toFixed(0)}%</div></div><div class="sector-potential">Potencial: ${(s.marketPotential * 100).toFixed(0)}%</div></div>`).join('')}</div></div>
                    
                    <div class="team-section"><h3><i class="fas fa-users"></i> PERFORMANCE POR EQUIPA</h3><div class="team-grid">${teamPerformance.map(t => `<div class="team-card"><div class="team-header"><strong>${t.name}</strong><span class="efficiency-badge">${(t.efficiency * 100).toFixed(0)}%</span></div><div class="team-stats"><div>📈 Sucesso: ${(t.successRate * 100).toFixed(0)}%</div><div>⚖️ Casos: ${t.caseLoad}</div><div>⏱️ ${t.avgResolutionDays} dias</div><div>⭐ ${t.clientSatisfaction.toFixed(1)}/5</div></div><div class="team-progress"><div class="progress-bar"><div class="progress-fill" style="width: ${t.efficiency * 100}%"></div></div></div></div>`).join('')}</div></div>
                </div>
                <style>
                    .practice-dashboard{ padding:0; } .health-badge{ background:var(--bg-terminal); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; } .health-excelente{ border-left:3px solid #00e676; color:#00e676; } .health-boa{ border-left:3px solid #00e5ff; color:#00e5ff; } .health-moderada{ border-left:3px solid #ffc107; color:#ffc107; } .health-crítica{ border-left:3px solid #ff1744; color:#ff1744; } .stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; } .stat-card{ background:var(--bg-command); border-radius:16px; padding:20px; text-align:center; } .stat-value{ font-size:1.8rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); } .stat-label{ font-size:0.7rem; color:#94a3b8; margin-top:4px; } .stat-trend{ font-size:0.6rem; margin-top:8px; } .stat-trend.positive{ color:#00e676; } .stat-trend.negative{ color:#ff1744; } .health-section{ margin-bottom:24px; } .health-card{ background:var(--bg-command); border-radius:16px; padding:20px; text-align:center; } .health-score{ font-size:3rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); } .health-classification{ font-size:1rem; font-weight:bold; margin:8px 0; } .health-classification.excelente{ color:#00e676; } .health-classification.boa{ color:#00e5ff; } .health-classification.moderada{ color:#ffc107; } .health-classification.crítica{ color:#ff1744; } .health-recommendations{ text-align:left; margin-top:16px; padding:12px; background:var(--bg-terminal); border-radius:12px; } .health-recommendations ul{ margin:8px 0 0 20px; font-size:0.7rem; color:#94a3b8; } .two-columns{ display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; } .opportunity-card,.critical-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; margin-bottom:12px; } .opportunity-card{ border-left:3px solid #00e676; } .critical-card{ border-left:3px solid #ff1744; } .critical-card.risk-alto{ border-left-color:#ff1744; background:rgba(255,23,68,0.05); } .critical-card.risk-moderado{ border-left-color:#ffc107; } .growth-badge{ background:rgba(0,230,118,0.1); color:#00e676; padding:2px 8px; border-radius:12px; font-size:0.6rem; } .risk-badge{ background:rgba(255,23,68,0.1); color:#ff1744; padding:2px 8px; border-radius:12px; font-size:0.6rem; } .benchmark-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:24px; } .benchmark-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .benchmark-values{ display:flex; justify-content:space-between; margin:12px 0; } .benchmark-delta{ text-align:center; font-size:0.7rem; font-weight:bold; } .sector-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .sector-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border:1px solid var(--border-tactic); } .sector-name{ display:flex; justify-content:space-between; margin-bottom:12px; } .trend-rising{ color:#00e676; } .trend-declining{ color:#ff1744; } .trend-stable{ color:#ffc107; } .sector-stats{ display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.7rem; color:#94a3b8; margin-bottom:12px; } .team-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; } .team-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border:1px solid var(--border-tactic); } .team-header{ display:flex; justify-content:space-between; margin-bottom:12px; } .efficiency-badge{ background:var(--elite-primary-dim); padding:2px 8px; border-radius:12px; font-size:0.6rem; } .team-stats{ display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.7rem; color:#94a3b8; margin-bottom:12px; } @media (max-width:768px){ .stats-grid{ grid-template-columns:1fr 1fr; } .two-columns{ grid-template-columns:1fr; } .benchmark-grid{ grid-template-columns:1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
    
    /**
     * Renderiza Arquitetura de Verdade (método especial)
     */
    renderTruthArchitecture() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        // Utilizar os módulos existentes para construir a arquitetura
        container.innerHTML = `
            <div class="truth-architecture-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chess-queen"></i> ARQUITETURA DE VERDADE</h2>
                    <div class="header-badges">
                        <span class="badge badge-primary"><i class="fas fa-link"></i> Shadow Dossier Ativo</span>
                        <span class="badge badge-success"><i class="fas fa-chart-line"></i> Monte Carlo Online</span>
                        <span class="badge badge-info"><i class="fas fa-shield-alt"></i> Strategic Vault</span>
                    </div>
                </div>
                
                <div class="truth-summary">
                    <div class="summary-card"><div class="summary-icon"><i class="fas fa-fingerprint"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Vínculos CITIUS</div><div class="summary-trend">0 validados</div></div></div>
                    <div class="summary-card"><div class="summary-icon"><i class="fas fa-chart-simple"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Simulações Monte Carlo</div><div class="summary-trend">Análise de 0% risco</div></div></div>
                    <div class="summary-card"><div class="summary-icon"><i class="fas fa-file-alt"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Bónus Meritocráticos</div><div class="summary-trend">Total: €0</div></div></div>
                </div>
                
                <div class="truth-tabs">
                    <button class="tab-btn active" data-tab="shadow-dossier"><i class="fas fa-link"></i> Shadow Dossier</button>
                    <button class="tab-btn" data-tab="black-swan"><i class="fas fa-chart-line"></i> Black Swan Predictor</button>
                    <button class="tab-btn" data-tab="value-dashboard"><i class="fas fa-chart-line"></i> Geração de Valor</button>
                </div>
                
                <div id="truth-tab-content" class="truth-tab-content">
                    <div class="loading-shimmer" style="height: 200px;"></div>
                </div>
            </div>
            <style>
                .truth-architecture-dashboard{ padding:0; }
                .dashboard-header{ display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:24px; }
                .header-badges{ display:flex; gap:8px; }
                .badge{ display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:20px; font-size:0.7rem; font-weight:600; }
                .badge-primary{ background:var(--elite-primary-dim); color:var(--elite-primary); border:1px solid var(--elite-primary); }
                .badge-success{ background:var(--elite-success-dim); color:var(--elite-success); border:1px solid var(--elite-success); }
                .badge-info{ background:var(--elite-info-dim); color:var(--elite-info); border:1px solid var(--elite-info); }
                .truth-summary{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; }
                .summary-card{ background:var(--bg-command); border-radius:16px; padding:20px; display:flex; align-items:center; gap:16px; border:1px solid var(--border-tactic); }
                .summary-card:hover{ border-color:var(--elite-primary); transform:translateY(-2px); }
                .summary-icon{ width:48px; height:48px; background:var(--elite-primary-dim); border-radius:12px; display:flex; align-items:center; justify-content:center; }
                .summary-icon i{ font-size:1.5rem; color:var(--elite-primary); }
                .summary-value{ font-size:1.8rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); }
                .summary-label{ font-size:0.7rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; }
                .summary-trend{ font-size:0.65rem; color:#64748b; margin-top:4px; }
                .truth-tabs{ display:flex; gap:8px; border-bottom:1px solid var(--border-tactic); margin-bottom:24px; padding-bottom:0; }
                .tab-btn{ background:transparent; border:none; padding:12px 24px; color:#94a3b8; cursor:pointer; font-family:'JetBrains Mono'; font-size:0.8rem; transition:all 0.2s; border-bottom:2px solid transparent; }
                .tab-btn:hover{ color:var(--elite-primary); }
                .tab-btn.active{ color:var(--elite-primary); border-bottom-color:var(--elite-primary); }
            </style>
        `;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                const contentDiv = document.getElementById('truth-tab-content');
                if (contentDiv) {
                    if (tab === 'shadow-dossier' && window.ShadowDossier && typeof window.ShadowDossier.renderDashboard === 'function') {
                        window.ShadowDossier.renderDashboard('truth-tab-content');
                    } else if (tab === 'black-swan' && window.BlackSwan && typeof window.BlackSwan.renderBlackSwanPanel === 'function') {
                        const sampleCase = window.EliteProbatum?.mockCases?.[0] || { id: 'DEMO', value: 12500000, successProbability: 68 };
                        contentDiv.innerHTML = '<div id="monteCarloPanel"></div>';
                        window.BlackSwan.renderBlackSwanPanel('monteCarloPanel', sampleCase);
                    } else if (tab === 'value-dashboard' && window.ValueEfficiencyEngine && typeof window.ValueEfficiencyEngine.renderDashboard === 'function') {
                        window.ValueEfficiencyEngine.renderDashboard('truth-tab-content');
                    } else {
                        contentDiv.innerHTML = `<div class="empty-state"><i class="fas fa-cog fa-spin"></i><p>Módulo em desenvolvimento</p></div>`;
                    }
                }
            });
        });
        
        if (window.ShadowDossier && typeof window.ShadowDossier.renderDashboard === 'function') {
            window.ShadowDossier.renderDashboard('truth-tab-content');
        } else {
            document.getElementById('truth-tab-content').innerHTML = '<div class="empty-state"><i class="fas fa-cog fa-spin"></i><p>Carregando Shadow Dossier...</p></div>';
        }
    }
}

// Instância global
window.PracticeDashboard = new PracticeDashboard();

console.log('[ELITE] Practice Dashboard carregado - Visão Estratégica da Prática');