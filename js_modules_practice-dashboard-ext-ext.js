/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE PRACTICE DASHBOARD EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Practice Dashboard com funcionalidades adicionais:
 * - KPIs avançados de performance
 * - Análise de produtividade por área
 * - Previsão de receita e crescimento
 * - Benchmarking com mercado
 * ============================================================================
 */

class PracticeDashboardExtensionExtended {
    constructor(dashboard) {
        this.dashboard = dashboard || window.PracticeDashboard;
        this.initialized = false;
        this.performanceKPIs = new Map();
        this.productivityAnalysis = new Map();
        this.growthForecasts = new Map();
        
        this.loadPerformanceKPIs();
        this.loadProductivityAnalysis();
        this.loadGrowthForecasts();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.dashboard) {
                console.warn('[ELITE] Practice Dashboard não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initPerformanceKPIs();
            console.log('[ELITE] Practice Dashboard Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega KPIs de performance
     */
    loadPerformanceKPIs() {
        try {
            const stored = localStorage.getItem('elite_performance_kpis');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.performanceKPIs.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar KPIs de performance:', e);
        }
    }
    
    /**
     * Salva KPIs de performance
     */
    savePerformanceKPIs() {
        try {
            const kpisObj = {};
            for (const [key, value] of this.performanceKPIs) {
                kpisObj[key] = value;
            }
            localStorage.setItem('elite_performance_kpis', JSON.stringify(kpisObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar KPIs de performance:', e);
        }
    }
    
    /**
     * Carrega análise de produtividade
     */
    loadProductivityAnalysis() {
        try {
            const stored = localStorage.getItem('elite_productivity_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.productivityAnalysis.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar análise de produtividade:', e);
        }
    }
    
    /**
     * Salva análise de produtividade
     */
    saveProductivityAnalysis() {
        try {
            const analysisObj = {};
            for (const [key, value] of this.productivityAnalysis) {
                analysisObj[key] = value;
            }
            localStorage.setItem('elite_productivity_analysis', JSON.stringify(analysisObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar análise de produtividade:', e);
        }
    }
    
    /**
     * Carrega previsões de crescimento
     */
    loadGrowthForecasts() {
        try {
            const stored = localStorage.getItem('elite_growth_forecasts');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.growthForecasts.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de crescimento:', e);
        }
    }
    
    /**
     * Salva previsões de crescimento
     */
    saveGrowthForecasts() {
        try {
            const forecastsObj = {};
            for (const [key, value] of this.growthForecasts) {
                forecastsObj[key] = value;
            }
            localStorage.setItem('elite_growth_forecasts', JSON.stringify(forecastsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de crescimento:', e);
        }
    }
    
    /**
     * Inicializa KPIs de performance
     */
    initPerformanceKPIs() {
        if (this.performanceKPIs.size === 0) {
            const kpis = {
                'faturação_por_advogado': { value: 125000, target: 150000, trend: 'up', unit: '€' },
                'casos_por_advogado': { value: 12, target: 15, trend: 'stable', unit: 'casos' },
                'taxa_sucesso': { value: 0.72, target: 0.75, trend: 'up', unit: '%' },
                'tempo_médio_resolução': { value: 125, target: 110, trend: 'down', unit: 'dias' },
                'satisfação_cliente': { value: 4.5, target: 4.8, trend: 'stable', unit: '/5' }
            };
            for (const [key, value] of Object.entries(kpis)) {
                this.performanceKPIs.set(key, value);
            }
            this.savePerformanceKPIs();
        }
    }
    
    /**
     * Obtém KPIs de performance
     */
    getPerformanceKPIs() {
        return Array.from(this.performanceKPIs.entries()).map(([key, data]) => ({
            metric: key,
            current: data.value,
            target: data.target,
            progress: ((data.value / data.target) * 100).toFixed(0) + '%',
            trend: data.trend === 'up' ? '📈' : data.trend === 'down' ? '📉' : '📊',
            unit: data.unit
        }));
    }
    
    /**
     * Analisa produtividade por área
     */
    analyzeProductivityByArea() {
        try {
            const areas = this.dashboard.practiceData || [];
            const analysis = areas.map(area => ({
                area: area.area,
                casesPerLawyer: (area.activeCases / area.teamSize).toFixed(1),
                revenuePerLawyer: ((area.revenueShare * 1000000) / area.teamSize).toFixed(0),
                successRate: (area.successRate * 100).toFixed(0) + '%',
                efficiency: this.calculateAreaEfficiency(area),
                productivityScore: this.calculateProductivityScore(area),
                benchmark: this.getAreaBenchmark(area.area)
            }));
            
            const sortedByProductivity = [...analysis].sort((a, b) => b.productivityScore - a.productivityScore);
            
            return {
                generatedAt: new Date().toISOString(),
                areas: analysis,
                topPerformingArea: sortedByProductivity[0],
                bottomPerformingArea: sortedByProductivity[sortedByProductivity.length - 1],
                overallProductivity: (analysis.reduce((s, a) => s + a.productivityScore, 0) / analysis.length).toFixed(0),
                recommendations: this.getProductivityRecommendations(analysis)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de produtividade:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Calcula eficiência da área
     */
    calculateAreaEfficiency(area) {
        const baseEfficiency = area.successRate;
        const volumeFactor = Math.min(area.activeCases / 50, 1);
        return Math.min(baseEfficiency + volumeFactor * 0.1, 1);
    }
    
    /**
     * Calcula score de produtividade
     */
    calculateProductivityScore(area) {
        let score = 50;
        score += area.successRate * 30;
        score += Math.min(area.activeCases / area.teamSize, 20);
        score += area.revenueShare * 100;
        return Math.min(score, 100);
    }
    
    /**
     * Obtém benchmark da área
     */
    getAreaBenchmark(area) {
        const benchmarks = {
            'Insolvência (CIRE)': { marketAvg: 0.65, topPerformer: 0.78 },
            'Direito Fiscal': { marketAvg: 0.62, topPerformer: 0.75 },
            'Contencioso Bancário': { marketAvg: 0.58, topPerformer: 0.72 },
            'Direito do Trabalho': { marketAvg: 0.70, topPerformer: 0.85 },
            'Direito Civil': { marketAvg: 0.60, topPerformer: 0.74 }
        };
        return benchmarks[area] || { marketAvg: 0.60, topPerformer: 0.72 };
    }
    
    /**
     * Obtém recomendações de produtividade
     */
    getProductivityRecommendations(analysis) {
        const recs = [];
        const lowProductivity = analysis.filter(a => a.productivityScore < 50);
        const highProductivity = analysis.filter(a => a.productivityScore > 80);
        
        if (lowProductivity.length > 0) {
            recs.push(`📉 Áreas com baixa produtividade: ${lowProductivity.map(a => a.area).join(', ')} - revisão necessária`);
        }
        
        if (highProductivity.length > 0) {
            recs.push(`🏆 Áreas de destaque: ${highProductivity.map(a => a.area).join(', ')} - compartilhar boas práticas`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Produtividade equilibrada - manter estratégia');
        }
        
        return recs;
    }
    
    /**
     * Previsão de crescimento
     */
    forecastGrowth(periods = 4) {
        try {
            const historicalData = this.dashboard.practiceData;
            const currentCases = historicalData.reduce((s, a) => s + a.activeCases, 0);
            const currentSuccess = historicalData.reduce((s, a) => s + a.successRate, 0) / historicalData.length;
            
            const growthRate = 0.08 + (currentSuccess - 0.65) * 0.3;
            const quarterlyGrowth = Math.max(0.02, Math.min(0.15, growthRate / 4));
            
            const forecasts = [];
            let projectedCases = currentCases;
            
            for (let i = 1; i <= periods; i++) {
                projectedCases = projectedCases * (1 + quarterlyGrowth);
                forecasts.push({
                    quarter: `Q${i} ${new Date().getFullYear() + Math.floor((new Date().getMonth() + i * 3) / 12)}`,
                    projectedCases: Math.round(projectedCases),
                    growthRate: (quarterlyGrowth * 100).toFixed(1) + '%',
                    confidence: 0.7 - (i * 0.05)
                });
            }
            
            return {
                generatedAt: new Date().toISOString(),
                currentCases: currentCases,
                currentSuccessRate: (currentSuccess * 100).toFixed(0) + '%',
                forecasts: forecasts,
                projectedYearEnd: forecasts[forecasts.length - 1],
                recommendations: this.getGrowthForecastRecommendations(forecasts, currentSuccess)
            };
        } catch (error) {
            console.error('[ELITE] Erro na previsão de crescimento:', error);
            return { error: true, message: 'Erro na previsão' };
        }
    }
    
    /**
     * Obtém recomendações de previsão de crescimento
     */
    getGrowthForecastRecommendations(forecasts, currentSuccess) {
        const recs = [];
        const finalGrowth = parseFloat(forecasts[forecasts.length - 1]?.growthRate || '0');
        
        if (finalGrowth > 10) {
            recs.push('📈 Crescimento projetado forte - considerar expansão da equipa');
        } else if (finalGrowth < 5) {
            recs.push('📊 Crescimento moderado - reforçar captação de clientes');
        }
        
        if (currentSuccess < 0.65) {
            recs.push('⚠️ Taxa de sucesso abaixo do mercado - revisar estratégias');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Crescimento sustentável - manter estratégia atual');
        }
        
        return recs;
    }
    
    /**
     * Benchmarking com mercado
     */
    benchmarkWithMarket() {
        try {
            const practiceStats = this.dashboard.getStatistics();
            const marketData = this.getMarketBenchmarkData();
            
            const benchmarks = {
                successRate: {
                    current: parseFloat(practiceStats.avgSuccessRate),
                    market: marketData.avgSuccessRate,
                    gap: parseFloat(practiceStats.avgSuccessRate) - marketData.avgSuccessRate
                },
                casesPerLawyer: {
                    current: practiceStats.totalActiveCases / (practiceStats.teamsCount * 4),
                    market: marketData.avgCasesPerLawyer,
                    gap: (practiceStats.totalActiveCases / (practiceStats.teamsCount * 4)) - marketData.avgCasesPerLawyer
                },
                efficiency: {
                    current: this.dashboard.healthScore?.score || 0,
                    market: marketData.avgEfficiency,
                    gap: (this.dashboard.healthScore?.score || 0) - marketData.avgEfficiency
                }
            };
            
            return {
                generatedAt: new Date().toISOString(),
                benchmarks: benchmarks,
                position: this.getMarketPosition(benchmarks),
                strengths: this.identifyStrengths(benchmarks),
                weaknesses: this.identifyWeaknesses(benchmarks),
                recommendations: this.getBenchmarkRecommendations(benchmarks)
            };
        } catch (error) {
            console.error('[ELITE] Erro no benchmarking:', error);
            return { error: true, message: 'Erro no benchmarking' };
        }
    }
    
    /**
     * Obtém dados de benchmark do mercado
     */
    getMarketBenchmarkData() {
        return {
            avgSuccessRate: 0.62,
            avgCasesPerLawyer: 12,
            avgEfficiency: 65,
            topPerformers: [
                { name: 'Escritório A', successRate: 0.75 },
                { name: 'Escritório B', successRate: 0.73 }
            ]
        };
    }
    
    /**
     * Obtém posição de mercado
     */
    getMarketPosition(benchmarks) {
        const successGap = benchmarks.successRate.gap;
        const efficiencyGap = benchmarks.efficiency.gap;
        
        if (successGap > 5 && efficiencyGap > 5) return 'Líder';
        if (successGap > 0 && efficiencyGap > 0) return 'Seguidor';
        if (successGap > -5 && efficiencyGap > -5) return 'Competidor';
        return 'Desafiado';
    }
    
    /**
     * Identifica pontos fortes
     */
    identifyStrengths(benchmarks) {
        const strengths = [];
        if (benchmarks.successRate.gap > 5) strengths.push('Taxa de sucesso acima da média do mercado');
        if (benchmarks.efficiency.gap > 10) strengths.push('Eficiência operacional superior');
        if (benchmarks.casesPerLawyer.gap > 2) strengths.push('Produtividade elevada');
        return strengths;
    }
    
    /**
     * Identifica pontos fracos
     */
    identifyWeaknesses(benchmarks) {
        const weaknesses = [];
        if (benchmarks.successRate.gap < -5) weaknesses.push('Taxa de sucesso abaixo do mercado');
        if (benchmarks.efficiency.gap < -10) weaknesses.push('Eficiência abaixo do esperado');
        if (benchmarks.casesPerLawyer.gap < -2) weaknesses.push('Produtividade reduzida');
        return weaknesses;
    }
    
    /**
     * Obtém recomendações de benchmarking
     */
    getBenchmarkRecommendations(benchmarks) {
        const recs = [];
        
        if (benchmarks.successRate.gap < 0) {
            recs.push('📈 Melhorar taxa de sucesso - investir em análise preditiva');
        }
        
        if (benchmarks.efficiency.gap < 0) {
            recs.push('⚡ Otimizar processos internos para ganhar eficiência');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Performance acima do mercado - manter estratégia');
        }
        
        return recs;
    }
    
    /**
     * Gera relatório completo de performance
     */
    generatePerformanceReport() {
        try {
            const kpis = this.getPerformanceKPIs();
            const productivity = this.analyzeProductivityByArea();
            const growth = this.forecastGrowth(4);
            const benchmark = this.benchmarkWithMarket();
            const stats = this.dashboard.getStatistics();
            
            return {
                generatedAt: new Date().toISOString(),
                executiveSummary: {
                    overallHealth: stats.healthScore,
                    totalCases: stats.totalActiveCases,
                    avgSuccessRate: stats.avgSuccessRate,
                    marketPosition: benchmark.position
                },
                kpis: kpis,
                productivityAnalysis: productivity,
                growthForecast: growth,
                marketBenchmark: benchmark,
                strategicRecommendations: [
                    ...productivity.recommendations,
                    ...growth.recommendations,
                    ...benchmark.recommendations
                ]
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório de performance:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Renderiza dashboard de performance avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generatePerformanceReport();
            
            container.innerHTML = `
                <div class="practice-dashboard-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> PRACTICE DASHBOARD EXTENSION - PERFORMANCE AVANÇADA</h2><div class="position-badge position-${report.executiveSummary?.marketPosition?.toLowerCase() || 'competidor'}">Posição: ${report.executiveSummary?.marketPosition || 'Competidor'}</div></div>
                    
                    <div class="performance-summary"><div class="summary-card"><div class="summary-value">${report.executiveSummary?.overallHealth || 'N/A'}%</div><div class="summary-label">Saúde da Prática</div><div class="summary-sub">Score global</div></div>
                    <div class="summary-card"><div class="summary-value">${report.executiveSummary?.totalCases || 0}</div><div class="summary-label">Casos Ativos</div><div class="summary-sub">+${report.growthForecast?.projectedYearEnd?.projectedCases - report.executiveSummary?.totalCases || 0} projetados</div></div>
                    <div class="summary-card"><div class="summary-value">${report.executiveSummary?.avgSuccessRate || 'N/A'}</div><div class="summary-label">Taxa Sucesso</div><div class="summary-sub">vs mercado: ${report.marketBenchmark?.benchmarks?.successRate?.gap > 0 ? '+' : ''}${report.marketBenchmark?.benchmarks?.successRate?.gap?.toFixed(1) || '0'}%</div></div>
                    <div class="summary-card"><div class="summary-value">${report.productivityAnalysis?.overallProductivity || 'N/A'}</div><div class="summary-label">Produtividade Geral</div><div class="summary-sub">Score 0-100</div></div></div>
                    
                    <div class="kpis-section"><h3><i class="fas fa-chart-simple"></i> KPIs DE PERFORMANCE</h3><div class="kpis-grid">${report.kpis?.map(k => `
                        <div class="kpi-card">
                            <div class="kpi-name">${k.metric.replace(/_/g, ' ').toUpperCase()}</div>
                            <div class="kpi-value">${k.current}${k.unit}</div>
                            <div class="kpi-target">Meta: ${k.target}${k.unit}</div>
                            <div class="kpi-progress"><div class="progress-bar"><div class="progress-fill" style="width: ${k.progress}%"></div><span class="progress-text">${k.progress}</span></div></div>
                            <div class="kpi-trend">${k.trend} ${k.trend === '📈' ? 'Em alta' : k.trend === '📉' ? 'Em baixa' : 'Estável'}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="productivity-section"><h3><i class="fas fa-chart-line"></i> PRODUTIVIDADE POR ÁREA</h3><div class="productivity-grid">${report.productivityAnalysis?.areas?.slice(0, 4).map(a => `
                        <div class="productivity-card">
                            <div class="productivity-area"><strong>${a.area}</strong></div>
                            <div class="productivity-metrics"><div>📊 Score: ${a.productivityScore}</div><div>⚡ Eficiência: ${(a.efficiency * 100).toFixed(0)}%</div><div>📈 Sucesso: ${a.successRate}</div></div>
                            <div class="productivity-benchmark">Benchmark: ${(a.benchmark?.marketAvg * 100).toFixed(0)}% vs ${(a.benchmark?.topPerformer * 100).toFixed(0)}% (top)</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="growth-section"><h3><i class="fas fa-chart-line"></i> PREVISÃO DE CRESCIMENTO</h3><div class="growth-grid">${report.growthForecast?.forecasts?.map(f => `
                        <div class="growth-card">
                            <div class="growth-period">${f.quarter}</div>
                            <div class="growth-value">${f.projectedCases} casos</div>
                            <div class="growth-rate">Crescimento: ${f.growthRate}</div>
                            <div class="growth-confidence">Confiança: ${(f.confidence * 100).toFixed(0)}%</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.strategicRecommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .practice-dashboard-ext{ padding:0; } .position-badge{ padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; } .position-líder{ border-left:3px solid #ffd700; color:#ffd700; background:rgba(255,215,0,0.1); } .position-seguidor{ border-left:3px solid #c0c0c0; color:#c0c0c0; background:rgba(192,192,192,0.1); } .position-competidor{ border-left:3px solid #00e676; color:#00e676; background:rgba(0,230,118,0.1); } .performance-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .kpis-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:16px; margin-bottom:24px; } .kpi-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .kpi-value{ font-size:1.3rem; font-weight:bold; color:var(--elite-primary); } .productivity-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .productivity-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .growth-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:16px; margin-bottom:24px; } .growth-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } @media (max-width:768px){ .performance-summary{ grid-template-columns:1fr 1fr; } .kpis-grid{ grid-template-columns:1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.PracticeDashboardExtensionExtended = new PracticeDashboardExtensionExtended(window.PracticeDashboard);

console.log('[ELITE] Practice Dashboard Extension Extended carregada - Análise Avançada de Performance Ativa');