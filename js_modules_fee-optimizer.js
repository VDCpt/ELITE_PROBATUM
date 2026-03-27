/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE OTIMIZAÇÃO DE EFICIÊNCIA
 * ============================================================================
 * Módulo renomeado de Fee Optimizer para Efficiency Optimizer
 * Mantém apenas métricas de desempenho, eficiência e meritocracia
 * SEM QUALQUER FUNCIONALIDADE DE FATURAÇÃO
 * ============================================================================
 * Funcionalidades:
 * 1. Cálculo de eficiência por advogado
 * 2. Análise de produtividade e desempenho
 * 3. Métricas de sucesso por caso
 * 4. Rankings de eficiência (meritocracia)
 * 5. Dashboard de performance para sócios
 * ============================================================================
 */

class EfficiencyOptimizer {
    constructor() {
        this.performanceData = [];
        this.efficiencyMetrics = new Map();
        this.productivityScores = new Map();
        this.initialized = false;
        
        this.loadPerformanceData();
        this.loadEfficiencyMetrics();
    }
    
    /**
     * Inicializa o módulo de otimização de eficiência
     */
    initialize() {
        try {
            this.initialized = true;
            this.calculateAllMetrics();
            console.log('[ELITE] Efficiency Optimizer inicializado - Métricas de Performance Ativas');
        } catch (error) {
            console.error('[ELITE] Erro na inicialização:', error);
            this.initialized = false;
        }
        return this;
    }
    
    /**
     * Carrega dados de performance do localStorage
     */
    loadPerformanceData() {
        try {
            const stored = localStorage.getItem('elite_performance_data');
            if (stored) {
                this.performanceData = JSON.parse(stored);
            } else {
                this.initDemoPerformanceData();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar dados de performance:', e);
            this.initDemoPerformanceData();
        }
    }
    
    /**
     * Inicializa dados de performance de demonstração
     */
    initDemoPerformanceData() {
        try {
            this.performanceData = [
                { id: 'user_001', name: 'Dra. Ana Silva', role: 'Sócia', team: 'Litígio', casesWon: 24, casesLost: 6, hoursSpent: 1850, avgResolutionDays: 112, clientSatisfaction: 4.8, complexityHandled: 0.92, efficiencyScore: 0.89, productivityScore: 0.85, quarter: 'Q4_2024' },
                { id: 'user_002', name: 'Dr. Pedro Santos', role: 'Advogado Sénior', team: 'Litígio', casesWon: 16, casesLost: 5, hoursSpent: 1250, avgResolutionDays: 98, clientSatisfaction: 4.5, complexityHandled: 0.78, efficiencyScore: 0.82, productivityScore: 0.79, quarter: 'Q4_2024' },
                { id: 'user_003', name: 'Dra. Maria Costa', role: 'Advogada', team: 'Arbitragem', casesWon: 12, casesLost: 3, hoursSpent: 890, avgResolutionDays: 85, clientSatisfaction: 4.7, complexityHandled: 0.85, efficiencyScore: 0.85, productivityScore: 0.82, quarter: 'Q4_2024' },
                { id: 'user_004', name: 'Dr. João Mendes', role: 'Advogado Sénior', team: 'Fiscal', casesWon: 21, casesLost: 4, hoursSpent: 1680, avgResolutionDays: 105, clientSatisfaction: 4.9, complexityHandled: 0.88, efficiencyScore: 0.91, productivityScore: 0.88, quarter: 'Q4_2024' },
                { id: 'user_005', name: 'Dra. Sofia Rodrigues', role: 'Advogada', team: 'Laboral', casesWon: 8, casesLost: 2, hoursSpent: 540, avgResolutionDays: 75, clientSatisfaction: 4.6, complexityHandled: 0.72, efficiencyScore: 0.78, productivityScore: 0.75, quarter: 'Q4_2024' },
                { id: 'user_006', name: 'Dr. Miguel Ferreira', role: 'Advogado', team: 'Civil', casesWon: 10, casesLost: 4, hoursSpent: 720, avgResolutionDays: 95, clientSatisfaction: 4.4, complexityHandled: 0.68, efficiencyScore: 0.75, productivityScore: 0.72, quarter: 'Q4_2024' }
            ];
            this.savePerformanceData();
        } catch (e) {
            console.error('[ELITE] Erro ao inicializar dados demo:', e);
            this.performanceData = [];
        }
    }
    
    /**
     * Salva dados de performance
     */
    savePerformanceData() {
        try {
            localStorage.setItem('elite_performance_data', JSON.stringify(this.performanceData));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar dados de performance:', e);
        }
    }
    
    /**
     * Carrega métricas de eficiência
     */
    loadEfficiencyMetrics() {
        try {
            const stored = localStorage.getItem('elite_efficiency_metrics');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.efficiencyMetrics.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar métricas:', e);
        }
    }
    
    /**
     * Salva métricas de eficiência
     */
    saveEfficiencyMetrics() {
        try {
            const metricsObj = {};
            for (const [key, value] of this.efficiencyMetrics) {
                metricsObj[key] = value;
            }
            localStorage.setItem('elite_efficiency_metrics', JSON.stringify(metricsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar métricas:', e);
        }
    }
    
    /**
     * Calcula todas as métricas de eficiência
     */
    calculateAllMetrics() {
        try {
            for (const user of this.performanceData) {
                const successRate = user.casesWon + user.casesLost > 0 
                    ? user.casesWon / (user.casesWon + user.casesLost) 
                    : 0;
                
                const hoursPerCase = user.casesWon + user.casesLost > 0
                    ? user.hoursSpent / (user.casesWon + user.casesLost)
                    : 0;
                
                const productivity = user.productivityScore || (successRate * 0.6 + (1 - Math.min(hoursPerCase / 100, 1)) * 0.4);
                
                const efficiency = user.efficiencyScore || (successRate * 0.5 + productivity * 0.3 + (user.clientSatisfaction / 5) * 0.2);
                
                const metric = {
                    userId: user.id,
                    name: user.name,
                    role: user.role,
                    team: user.team,
                    successRate: successRate,
                    successRatePercent: (successRate * 100).toFixed(1) + '%',
                    hoursPerCase: hoursPerCase.toFixed(1),
                    productivityScore: productivity,
                    productivityPercent: (productivity * 100).toFixed(0) + '%',
                    efficiencyScore: efficiency,
                    efficiencyPercent: (efficiency * 100).toFixed(0) + '%',
                    clientSatisfaction: user.clientSatisfaction,
                    casesWon: user.casesWon,
                    casesLost: user.casesLost,
                    avgResolutionDays: user.avgResolutionDays,
                    complexityHandled: user.complexityHandled,
                    lastUpdated: new Date().toISOString()
                };
                
                this.efficiencyMetrics.set(user.id, metric);
                this.productivityScores.set(user.id, productivity);
            }
            this.saveEfficiencyMetrics();
        } catch (error) {
            console.error('[ELITE] Erro ao calcular métricas:', error);
        }
    }
    
    /**
     * Obtém métricas de um advogado
     */
    getLawyerMetrics(userId) {
        return this.efficiencyMetrics.get(userId) || null;
    }
    
    /**
     * Obtém ranking de eficiência
     */
    getEfficiencyRanking(limit = 10) {
        try {
            const metrics = Array.from(this.efficiencyMetrics.values());
            return metrics
                .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
                .slice(0, limit)
                .map((m, idx) => ({
                    rank: idx + 1,
                    name: m.name,
                    role: m.role,
                    team: m.team,
                    efficiency: m.efficiencyPercent,
                    successRate: m.successRatePercent,
                    productivity: m.productivityPercent,
                    casesWon: m.casesWon
                }));
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Obtém ranking por equipa
     */
    getTeamRanking() {
        try {
            const teamStats = {};
            for (const metric of this.efficiencyMetrics.values()) {
                if (!teamStats[metric.team]) {
                    teamStats[metric.team] = {
                        name: metric.team,
                        totalEfficiency: 0,
                        totalSuccessRate: 0,
                        totalProductivity: 0,
                        members: 0,
                        totalCases: 0
                    };
                }
                teamStats[metric.team].totalEfficiency += metric.efficiencyScore;
                teamStats[metric.team].totalSuccessRate += metric.successRate;
                teamStats[metric.team].totalProductivity += metric.productivityScore;
                teamStats[metric.team].members++;
                teamStats[metric.team].totalCases += metric.casesWon + metric.casesLost;
            }
            
            return Object.values(teamStats).map(team => ({
                name: team.name,
                avgEfficiency: (team.totalEfficiency / team.members * 100).toFixed(1) + '%',
                avgSuccessRate: (team.totalSuccessRate / team.members * 100).toFixed(1) + '%',
                avgProductivity: (team.totalProductivity / team.members * 100).toFixed(1) + '%',
                members: team.members,
                totalCases: team.totalCases,
                score: (team.totalEfficiency / team.members)
            })).sort((a, b) => b.score - a.score);
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Obtém tendências de eficiência ao longo do tempo
     */
    getEfficiencyTrends(periods = 4) {
        try {
            const trends = [];
            const quarters = ['Q1_2024', 'Q2_2024', 'Q3_2024', 'Q4_2024'];
            const recentQuarters = quarters.slice(-periods);
            
            for (const quarter of recentQuarters) {
                const quarterData = this.performanceData.filter(p => p.quarter === quarter);
                if (quarterData.length > 0) {
                    const avgEfficiency = quarterData.reduce((sum, p) => sum + (p.efficiencyScore || 0.7), 0) / quarterData.length;
                    const avgSuccess = quarterData.reduce((sum, p) => {
                        const rate = (p.casesWon + p.casesLost) > 0 ? p.casesWon / (p.casesWon + p.casesLost) : 0;
                        return sum + rate;
                    }, 0) / quarterData.length;
                    
                    trends.push({
                        quarter: quarter,
                        avgEfficiency: (avgEfficiency * 100).toFixed(1) + '%',
                        avgSuccessRate: (avgSuccess * 100).toFixed(1) + '%',
                        totalCases: quarterData.reduce((sum, p) => sum + p.casesWon + p.casesLost, 0)
                    });
                }
            }
            return trends;
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Calcula o score de meritocracia
     */
    calculateMeritScore(userId) {
        try {
            const metric = this.efficiencyMetrics.get(userId);
            if (!metric) return null;
            
            const successWeight = 0.4;
            const efficiencyWeight = 0.3;
            const productivityWeight = 0.2;
            const satisfactionWeight = 0.1;
            
            const meritScore = (metric.successRate * successWeight) +
                               (metric.efficiencyScore * efficiencyWeight) +
                               (metric.productivityScore * productivityWeight) +
                               ((metric.clientSatisfaction / 5) * satisfactionWeight);
            
            return {
                userId: userId,
                name: metric.name,
                meritScore: (meritScore * 100).toFixed(1) + '%',
                meritRank: this.getMeritRank(userId),
                components: {
                    successRate: metric.successRatePercent,
                    efficiency: metric.efficiencyPercent,
                    productivity: metric.productivityPercent,
                    satisfaction: (metric.clientSatisfaction / 5 * 100).toFixed(0) + '%'
                }
            };
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Obtém rank de mérito
     */
    getMeritRank(userId) {
        try {
            const metrics = Array.from(this.efficiencyMetrics.values());
            const scores = metrics.map(m => ({
                id: m.userId,
                score: (m.successRate * 0.4) + (m.efficiencyScore * 0.3) + (m.productivityScore * 0.2) + ((m.clientSatisfaction / 5) * 0.1)
            }));
            scores.sort((a, b) => b.score - a.score);
            const rank = scores.findIndex(s => s.id === userId) + 1;
            return rank > 0 ? rank : metrics.length;
        } catch (error) {
            return 0;
        }
    }
    
    /**
     * Obtém estatísticas gerais de eficiência
     */
    getStatistics() {
        try {
            const metrics = Array.from(this.efficiencyMetrics.values());
            if (metrics.length === 0) return { avgEfficiency: 0, avgSuccessRate: 0, topPerformer: null };
            
            const avgEfficiency = metrics.reduce((sum, m) => sum + m.efficiencyScore, 0) / metrics.length;
            const avgSuccessRate = metrics.reduce((sum, m) => sum + m.successRate, 0) / metrics.length;
            const totalCases = metrics.reduce((sum, m) => sum + m.casesWon + m.casesLost, 0);
            const totalWins = metrics.reduce((sum, m) => sum + m.casesWon, 0);
            const bestPerformer = metrics.reduce((best, m) => m.efficiencyScore > best.efficiencyScore ? m : best, metrics[0]);
            
            return {
                avgEfficiency: (avgEfficiency * 100).toFixed(1) + '%',
                avgSuccessRate: (avgSuccessRate * 100).toFixed(1) + '%',
                totalCases: totalCases,
                totalWins: totalWins,
                overallWinRate: totalCases > 0 ? ((totalWins / totalCases) * 100).toFixed(1) + '%' : '0%',
                topPerformer: bestPerformer ? {
                    name: bestPerformer.name,
                    efficiency: bestPerformer.efficiencyPercent,
                    successRate: bestPerformer.successRatePercent
                } : null
            };
        } catch (error) {
            return { avgEfficiency: '0%', avgSuccessRate: '0%', totalCases: 0, totalWins: 0, overallWinRate: '0%' };
        }
    }
    
    /**
     * Renderiza dashboard de eficiência
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const stats = this.getStatistics();
            const ranking = this.getEfficiencyRanking(10);
            const teamRanking = this.getTeamRanking();
            const trends = this.getEfficiencyTrends(4);
            const meritScores = Array.from(this.efficiencyMetrics.values()).map(m => this.calculateMeritScore(m.userId)).filter(s => s);
            
            container.innerHTML = `
                <div class="efficiency-dashboard">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> MÉTRICAS DE EFICIÊNCIA & MERITOCRACIA</h2><div class="stats-badge"><i class="fas fa-chart-simple"></i> Score Global: ${stats.avgEfficiency}</div></div>
                    <div class="stats-grid"><div class="stat-card"><div class="stat-value">${stats.avgEfficiency}</div><div class="stat-label">Eficiência Média</div></div><div class="stat-card"><div class="stat-value">${stats.avgSuccessRate}</div><div class="stat-label">Taxa de Sucesso Média</div></div><div class="stat-card"><div class="stat-value">${stats.totalWins}</div><div class="stat-label">Vitórias Totais</div></div><div class="stat-card"><div class="stat-value">${stats.overallWinRate}</div><div class="stat-label">Taxa Global de Sucesso</div></div></div>
                    <div class="top-performer"><div class="performer-card"><i class="fas fa-crown"></i><div><div class="performer-label">Melhor Performance</div><div class="performer-name">${stats.topPerformer?.name || 'N/A'}</div><div class="performer-stats">Eficiência: ${stats.topPerformer?.efficiency || '0%'} | Sucesso: ${stats.topPerformer?.successRate || '0%'}</div></div></div></div>
                    <div class="two-columns"><div class="column"><h3><i class="fas fa-trophy"></i> RANKING DE EFICIÊNCIA</h3><table class="data-table"><thead><tr><th>#</th><th>Advogado</th><th>Equipa</th><th>Eficiência</th><th>Sucesso</th><th>Vitórias</th></tr></thead><tbody>${ranking.map(r => `<tr><td><strong>${r.rank}º</strong> ${r.rank === 1 ? '👑' : ''}</td><td><strong>${r.name}</strong><br><small>${r.role}</small></td><td>${r.team}</td><td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${parseInt(r.efficiency)}%"></div><span class="progress-text">${r.efficiency}</span></div></td><td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${parseInt(r.successRate)}%"></div><span class="progress-text">${r.successRate}</span></div></td><td>${r.casesWon}</td></tr>`).join('')}</tbody></table></div>
                    <div class="column"><h3><i class="fas fa-users"></i> RANKING POR EQUIPA</h3><div class="team-ranking">${teamRanking.map(t => `<div class="team-card"><div class="team-header"><strong>${t.name}</strong><span>${t.avgEfficiency}</span></div><div class="team-stats"><div>📈 Sucesso: ${t.avgSuccessRate}</div><div>⚡ Produtividade: ${t.avgProductivity}</div><div>🎯 Casos: ${t.totalCases}</div><div>👥 Membros: ${t.members}</div></div><div class="team-progress"><div class="progress-bar"><div class="progress-fill" style="width: ${parseInt(t.avgEfficiency)}%"></div></div></div></div>`).join('')}</div></div></div>
                    <div class="trends-section"><h3><i class="fas fa-chart-line"></i> EVOLUÇÃO DA EFICIÊNCIA</h3><div class="trends-grid">${trends.map(t => `<div class="trend-card"><div class="trend-quarter">${t.quarter}</div><div class="trend-value">${t.avgEfficiency}</div><div class="trend-label">Eficiência</div><div class="trend-sub">Sucesso: ${t.avgSuccessRate}</div><div class="trend-cases">${t.totalCases} casos</div></div>`).join('')}</div></div>
                    <div class="merit-section"><h3><i class="fas fa-medal"></i> SCORE DE MERITOCRACIA</h3><div class="merit-grid">${meritScores.slice(0, 10).map(m => `<div class="merit-card"><div class="merit-rank">#${m.meritRank}</div><div class="merit-name"><strong>${m.name}</strong></div><div class="merit-score">${m.meritScore}</div><div class="merit-components"><div>🎯 ${m.components.successRate}</div><div>⚡ ${m.components.efficiency}</div><div>📊 ${m.components.productivity}</div><div>⭐ ${m.components.satisfaction}</div></div></div>`).join('')}</div></div>
                </div>
                <style>
                    .efficiency-dashboard{ padding:0; } .stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; } .stat-card{ background:var(--bg-command); border-radius:16px; padding:20px; text-align:center; } .stat-value{ font-size:1.8rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); } .stat-label{ font-size:0.7rem; color:#94a3b8; margin-top:8px; } .top-performer{ margin-bottom:24px; } .performer-card{ background:linear-gradient(135deg, rgba(255,215,0,0.1), transparent); border:1px solid #ffd700; border-radius:16px; padding:20px; display:flex; align-items:center; gap:20px; } .performer-card i{ font-size:2rem; color:#ffd700; } .performer-label{ font-size:0.7rem; color:#94a3b8; text-transform:uppercase; } .performer-name{ font-size:1.2rem; font-weight:bold; } .two-columns{ display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; } .team-ranking{ display:flex; flex-direction:column; gap:12px; } .team-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border:1px solid var(--border-tactic); } .team-header{ display:flex; justify-content:space-between; margin-bottom:12px; font-weight:bold; } .team-stats{ display:flex; gap:16px; font-size:0.7rem; color:#94a3b8; margin-bottom:12px; flex-wrap:wrap; } .trends-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; } .trend-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } .trend-quarter{ font-size:0.7rem; color:#94a3b8; margin-bottom:8px; } .trend-value{ font-size:1.5rem; font-weight:bold; color:var(--elite-primary); } .merit-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; } .merit-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border:1px solid var(--border-tactic); position:relative; } .merit-rank{ position:absolute; top:12px; right:12px; background:var(--elite-primary-dim); padding:2px 8px; border-radius:12px; font-size:0.6rem; } .merit-score{ font-size:1.2rem; font-weight:bold; color:var(--elite-primary); margin:8px 0; } .merit-components{ display:flex; gap:8px; font-size:0.6rem; color:#94a3b8; margin-top:8px; flex-wrap:wrap; } @media (max-width:768px){ .stats-grid{ grid-template-columns:1fr 1fr; } .two-columns{ grid-template-columns:1fr; } .trends-grid{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global (renomeada para EfficiencyOptimizer)
window.EfficiencyOptimizer = new EfficiencyOptimizer();
window.FeeOptimizer = window.EfficiencyOptimizer; // Compatibilidade com nome antigo

console.log('[ELITE] Efficiency Optimizer carregado - Métricas de Performance Ativas');