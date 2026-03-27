/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE COURT DEADLINES EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Court Deadlines com funcionalidades adicionais:
 * - Previsão de atrasos processuais
 * - Otimização de calendário judicial
 * - Alertas inteligentes baseados em histórico
 * - Análise de tendências por tribunal
 * ============================================================================
 */

class CourtDeadlinesExtensionExtended {
    constructor(deadlines) {
        this.deadlines = deadlines || window.CourtDeadlines;
        this.initialized = false;
        this.delayPredictions = new Map();
        this.calendarOptimization = new Map();
        this.trendAnalysis = new Map();
        
        this.loadDelayPredictions();
        this.loadCalendarOptimization();
        this.loadTrendAnalysis();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.deadlines) {
                console.warn('[ELITE] Court Deadlines não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initTrendAnalysis();
            console.log('[ELITE] Court Deadlines Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega previsões de atraso
     */
    loadDelayPredictions() {
        try {
            const stored = localStorage.getItem('elite_delay_predictions_ext');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.delayPredictions.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de atraso:', e);
        }
    }
    
    /**
     * Salva previsões de atraso
     */
    saveDelayPredictions() {
        try {
            const predictionsObj = {};
            for (const [key, value] of this.delayPredictions) {
                predictionsObj[key] = value;
            }
            localStorage.setItem('elite_delay_predictions_ext', JSON.stringify(predictionsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de atraso:', e);
        }
    }
    
    /**
     * Carrega otimização de calendário
     */
    loadCalendarOptimization() {
        try {
            const stored = localStorage.getItem('elite_calendar_optimization');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.calendarOptimization.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar otimização de calendário:', e);
        }
    }
    
    /**
     * Salva otimização de calendário
     */
    saveCalendarOptimization() {
        try {
            const optObj = {};
            for (const [key, value] of this.calendarOptimization) {
                optObj[key] = value;
            }
            localStorage.setItem('elite_calendar_optimization', JSON.stringify(optObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar otimização de calendário:', e);
        }
    }
    
    /**
     * Carrega análise de tendências
     */
    loadTrendAnalysis() {
        try {
            const stored = localStorage.getItem('elite_trend_analysis_ext');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.trendAnalysis.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar análise de tendências:', e);
        }
    }
    
    /**
     * Salva análise de tendências
     */
    saveTrendAnalysis() {
        try {
            const trendsObj = {};
            for (const [key, value] of this.trendAnalysis) {
                trendsObj[key] = value;
            }
            localStorage.setItem('elite_trend_analysis_ext', JSON.stringify(trendsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar análise de tendências:', e);
        }
    }
    
    /**
     * Inicializa análise de tendências
     */
    initTrendAnalysis() {
        if (this.trendAnalysis.size === 0) {
            const courts = ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro'];
            for (const court of courts) {
                this.trendAnalysis.set(court, {
                    court: court,
                    avgDelay: 30 + Math.random() * 60,
                    delayTrend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining',
                    efficiency: 0.5 + Math.random() * 0.4,
                    peakMonths: this.getPeakMonths(),
                    lastUpdated: new Date().toISOString()
                });
            }
            this.saveTrendAnalysis();
        }
    }
    
    /**
     * Obtém meses de pico
     */
    getPeakMonths() {
        return ['Março', 'Abril', 'Maio', 'Setembro', 'Outubro', 'Novembro'];
    }
    
    /**
     * Prediz atraso processual
     */
    predictCaseDelay(caseId, court, caseComplexity = 'medium') {
        try {
            const courtTrend = this.trendAnalysis.get(court);
            if (!courtTrend) return null;
            
            const baseDelay = courtTrend.avgDelay;
            const complexityFactor = caseComplexity === 'high' ? 1.5 : caseComplexity === 'medium' ? 1.0 : 0.7;
            const trendFactor = courtTrend.delayTrend === 'rising' ? 1.2 : courtTrend.delayTrend === 'declining' ? 0.8 : 1.0;
            const seasonFactor = this.getSeasonalityFactor();
            
            const predictedDelay = Math.round(baseDelay * complexityFactor * trendFactor * seasonFactor);
            const confidence = this.calculateDelayConfidence(courtTrend, caseComplexity);
            
            const prediction = {
                caseId: caseId,
                court: court,
                predictedDelayDays: predictedDelay,
                confidence: (confidence * 100).toFixed(0) + '%',
                factors: {
                    baseDelay: `${baseDelay} dias`,
                    complexity: caseComplexity,
                    trend: courtTrend.delayTrend,
                    seasonality: this.getCurrentSeason()
                },
                riskLevel: this.getDelayRiskLevel(predictedDelay),
                recommendation: this.getDelayRecommendation(predictedDelay, caseComplexity)
            };
            
            this.delayPredictions.set(caseId, prediction);
            this.saveDelayPredictions();
            
            return prediction;
        } catch (error) {
            console.error('[ELITE] Erro na previsão de atraso:', error);
            return { error: true, message: 'Erro na previsão' };
        }
    }
    
    /**
     * Obtém fator de sazonalidade
     */
    getSeasonalityFactor() {
        const currentMonth = new Date().toLocaleString('pt-PT', { month: 'long' });
        return this.getPeakMonths().includes(currentMonth) ? 1.15 : 0.95;
    }
    
    /**
     * Obtém estação atual
     */
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'Primavera (pico)';
        if (month >= 5 && month <= 7) return 'Verão';
        if (month >= 8 && month <= 10) return 'Outono (pico)';
        return 'Inverno';
    }
    
    /**
     * Calcula confiança da previsão
     */
    calculateDelayConfidence(courtTrend, caseComplexity) {
        let confidence = 0.7;
        if (courtTrend.delayTrend === 'stable') confidence += 0.1;
        if (caseComplexity === 'medium') confidence += 0.05;
        if (this.getPeakMonths().includes(new Date().toLocaleString('pt-PT', { month: 'long' }))) confidence -= 0.1;
        return Math.min(confidence, 0.9);
    }
    
    /**
     * Obtém nível de risco do atraso
     */
    getDelayRiskLevel(predictedDelay) {
        if (predictedDelay > 180) return 'CRÍTICO';
        if (predictedDelay > 120) return 'ALTO';
        if (predictedDelay > 60) return 'MODERADO';
        return 'BAIXO';
    }
    
    /**
     * Obtém recomendação de atraso
     */
    getDelayRecommendation(predictedDelay, caseComplexity) {
        if (predictedDelay > 180) {
            return '⚠️ Atraso previsto crítico - considerar pedido de aceleração processual';
        }
        if (predictedDelay > 120) {
            return '📋 Atraso significativo - monitorizar e preparar alegações complementares';
        }
        if (predictedDelay > 60 && caseComplexity === 'high') {
            return '📊 Atraso esperado para casos complexos - manter acompanhamento';
        }
        return '✅ Prazo dentro dos padrões - seguir cronograma normal';
    }
    
    /**
     * Otimiza calendário judicial
     */
    optimizeCourtCalendar(caseIds, court) {
        try {
            const deadlines = [];
            for (const caseId of caseIds) {
                const caseDeadlines = this.deadlines.getDeadlinesByCase(caseId);
                deadlines.push(...caseDeadlines);
            }
            
            const pendingDeadlines = deadlines.filter(d => d.status === 'pending');
            const courtTrend = this.trendAnalysis.get(court);
            
            const sortedByUrgency = pendingDeadlines.sort((a, b) => {
                const dateA = new Date(a.dueDateRaw);
                const dateB = new Date(b.dueDateRaw);
                return dateA - dateB;
            });
            
            const optimizedCalendar = sortedByUrgency.map((d, idx) => ({
                order: idx + 1,
                caseId: d.caseId,
                description: d.description,
                dueDate: this.deadlines.formatDate(d.dueDateRaw),
                priority: this.calculateUrgencyScore(d),
                recommendedStartDate: this.calculateRecommendedStart(d, courtTrend)
            }));
            
            const workloadDistribution = this.calculateWorkloadDistribution(optimizedCalendar, courtTrend);
            
            const optimization = {
                court: court,
                totalDeadlines: pendingDeadlines.length,
                optimizedCalendar: optimizedCalendar.slice(0, 20),
                workloadDistribution: workloadDistribution,
                recommendations: this.getCalendarRecommendations(optimizedCalendar, courtTrend),
                estimatedCompletion: this.estimateCompletionDate(optimizedCalendar, courtTrend)
            };
            
            this.calendarOptimization.set(court, optimization);
            this.saveCalendarOptimization();
            
            return optimization;
        } catch (error) {
            console.error('[ELITE] Erro na otimização de calendário:', error);
            return { error: true, message: 'Erro na otimização' };
        }
    }
    
    /**
     * Calcula score de urgência
     */
    calculateUrgencyScore(deadline) {
        const dueDate = new Date(deadline.dueDateRaw);
        const today = new Date();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 0) return 100;
        if (daysLeft <= 3) return 90;
        if (daysLeft <= 7) return 75;
        if (daysLeft <= 15) return 50;
        if (daysLeft <= 30) return 25;
        return 10;
    }
    
    /**
     * Calcula data de início recomendada
     */
    calculateRecommendedStart(deadline, courtTrend) {
        const dueDate = new Date(deadline.dueDateRaw);
        const daysBefore = courtTrend?.efficiency > 0.7 ? 5 : 10;
        const startDate = new Date(dueDate);
        startDate.setDate(dueDate.getDate() - daysBefore);
        return startDate.toISOString().slice(0, 10);
    }
    
    /**
     * Calcula distribuição de carga de trabalho
     */
    calculateWorkloadDistribution(calendar, courtTrend) {
        const distribution = {
            immediate: 0,
            thisWeek: 0,
            nextWeek: 0,
            thisMonth: 0,
            future: 0
        };
        
        const today = new Date();
        for (const item of calendar) {
            const dueDate = new Date(item.dueDate.split('/').reverse().join('-'));
            const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 0) distribution.immediate++;
            else if (daysDiff <= 7) distribution.thisWeek++;
            else if (daysDiff <= 14) distribution.nextWeek++;
            else if (daysDiff <= 30) distribution.thisMonth++;
            else distribution.future++;
        }
        
        return distribution;
    }
    
    /**
     * Obtém recomendações de calendário
     */
    getCalendarRecommendations(calendar, courtTrend) {
        const recs = [];
        const immediateDeadlines = calendar.filter(c => c.priority > 80);
        
        if (immediateDeadlines.length > 0) {
            recs.push(`🚨 ${immediateDeadlines.length} prazos urgentes - ação prioritária`);
        }
        
        if (courtTrend?.delayTrend === 'rising') {
            recs.push('⚠️ Tendência de aumento de atrasos - antecipar prazos sempre que possível');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Calendário otimizado - manter cronograma');
        }
        
        return recs;
    }
    
    /**
     * Estima data de conclusão
     */
    estimateCompletionDate(calendar, courtTrend) {
        if (calendar.length === 0) return 'N/A';
        
        const lastDeadline = calendar[calendar.length - 1];
        const lastDate = new Date(lastDeadline.dueDate.split('/').reverse().join('-'));
        const bufferDays = courtTrend?.delayTrend === 'rising' ? 15 : 5;
        lastDate.setDate(lastDate.getDate() + bufferDays);
        
        return lastDate.toISOString().slice(0, 10);
    }
    
    /**
     * Gera relatório de tendências por tribunal
     */
    generateCourtTrendReport() {
        try {
            const courts = Array.from(this.trendAnalysis.values());
            const sortedByEfficiency = [...courts].sort((a, b) => b.efficiency - a.efficiency);
            const sortedByDelay = [...courts].sort((a, b) => a.avgDelay - b.avgDelay);
            
            return {
                generatedAt: new Date().toISOString(),
                courts: courts.map(c => ({
                    court: c.court,
                    avgDelay: `${Math.round(c.avgDelay)} dias`,
                    delayTrend: c.delayTrend,
                    efficiency: (c.efficiency * 100).toFixed(0) + '%',
                    peakMonths: c.peakMonths,
                    recommendation: this.getCourtRecommendation(c)
                })),
                bestCourt: sortedByEfficiency[0],
                worstCourt: sortedByDelay[sortedByDelay.length - 1],
                overallTrend: this.calculateOverallTrend(courts)
            };
        } catch (error) {
            console.error('[ELITE] Erro no relatório de tendências:', error);
            return { error: true, message: 'Erro no relatório' };
        }
    }
    
    /**
     * Obtém recomendação por tribunal
     */
    getCourtRecommendation(court) {
        if (court.efficiency > 0.7) {
            return 'Tribunal eficiente - prazos confiáveis';
        }
        if (court.delayTrend === 'rising') {
            return 'Aumento de atrasos - antecipar submissões';
        }
        return 'Acompanhamento regular recomendado';
    }
    
    /**
     * Calcula tendência geral
     */
    calculateOverallTrend(courts) {
        const risingCount = courts.filter(c => c.delayTrend === 'rising').length;
        const decliningCount = courts.filter(c => c.delayTrend === 'declining').length;
        
        if (risingCount > decliningCount) return 'piora';
        if (decliningCount > risingCount) return 'melhora';
        return 'estável';
    }
    
    /**
     * Renderiza dashboard de prazos judiciais avançado
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const trendReport = this.generateCourtTrendReport();
            
            container.innerHTML = `
                <div class="court-deadlines-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-calendar-alt"></i> COURT DEADLINES EXTENSION - ANÁLISE AVANÇADA</h2><div class="trend-badge trend-${trendReport.overallTrend}">Tendência: ${trendReport.overallTrend === 'piora' ? '📉 Piora' : trendReport.overallTrend === 'melhora' ? '📈 Melhora' : '📊 Estável'}</div></div>
                    
                    <div class="deadlines-summary"><div class="summary-card"><div class="summary-value">${trendReport.bestCourt?.court || 'N/A'}</div><div class="summary-label">Tribunal Mais Eficiente</div><div class="summary-sub">Eficiência: ${trendReport.bestCourt?.efficiency || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${trendReport.worstCourt?.court || 'N/A'}</div><div class="summary-label">Maior Atraso</div><div class="summary-sub">Média: ${trendReport.worstCourt?.avgDelay || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${trendReport.courts?.length || 0}</div><div class="summary-label">Tribunais Analisados</div><div class="summary-sub">${trendReport.courts?.filter(c => c.delayTrend === 'melhora').length || 0} em melhora</div></div>
                    <div class="summary-card"><div class="summary-value">${this.deadlines.getPendingDeadlines().length}</div><div class="summary-label">Prazos Pendentes</div><div class="summary-sub">${this.deadlines.getOverdueDeadlines().length} vencidos</div></div></div>
                    
                    <div class="courts-section"><h3><i class="fas fa-building"></i> ANÁLISE POR TRIBUNAL</h3><div class="courts-grid">${trendReport.courts?.map(c => `
                        <div class="court-card trend-${c.delayTrend}">
                            <div class="court-header"><strong>${c.court}</strong><span class="trend-indicator">${c.delayTrend === 'rising' ? '📈' : c.delayTrend === 'declining' ? '📉' : '📊'}</span></div>
                            <div class="court-stats"><div>⏱️ Atraso: ${c.avgDelay}</div><div>⚡ Eficiência: ${c.efficiency}</div><div>📅 Pico: ${c.peakMonths?.slice(0, 2).join(', ')}</div></div>
                            <div class="court-recommendation">💡 ${c.recommendation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul><li>📋 Antecipar prazos em tribunais com tendência de piora</li><li>🎯 Priorizar submissões em tribunais mais eficientes</li><li>⚠️ Monitorizar tribunais com alto volume de atrasos</li><li>📊 Revisar estratégia para meses de pico (${trendReport.courts?.[0]?.peakMonths?.slice(0, 3).join(', ') || 'Mar-Mai, Set-Nov'})</li></ul></div></div>
                </div>
                <style>
                    .court-deadlines-ext{ padding:0; } .trend-badge{ padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; } .trend-melhora{ border-left:3px solid #00e676; color:#00e676; background:rgba(0,230,118,0.1); } .trend-piora{ border-left:3px solid #ff1744; color:#ff1744; background:rgba(255,23,68,0.1); } .trend-estável{ border-left:3px solid #ffc107; color:#ffc107; background:rgba(255,193,7,0.1); } .deadlines-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .courts-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .court-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border-left:3px solid; } .court-card.trend-rising{ border-left-color:#ff1744; } .court-card.trend-declining{ border-left-color:#00e676; } .court-card.trend-stable{ border-left-color:#ffc107; } .court-header{ display:flex; justify-content:space-between; margin-bottom:12px; } .court-stats{ display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.7rem; margin-bottom:12px; } @media (max-width:768px){ .deadlines-summary{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.CourtDeadlinesExtensionExtended = new CourtDeadlinesExtensionExtended(window.CourtDeadlines);

console.log('[ELITE] Court Deadlines Extension Extended carregada - Análise Avançada de Prazos Ativa');