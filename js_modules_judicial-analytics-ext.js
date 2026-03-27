/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE JUDICIAL ANALYTICS EXTENSION
 * ============================================================================
 * Extensão do Judicial Analytics com funcionalidades adicionais:
 * - Análise de tendências jurisprudenciais profundas
 * - Previsão de evolução de entendimentos
 * - Mapa de calor de decisões por tribunal
 * - Recomendações de estratégia por foro
 * ============================================================================
 */

class JudicialAnalyticsExtension {
    constructor(analytics) {
        this.analytics = analytics || window.JudicialAnalytics;
        this.initialized = false;
        this.trendAnalysis = new Map();
        this.courtHeatmap = new Map();
        this.jurisprudenceTrends = new Map();
        
        this.loadTrendAnalysis();
        this.loadCourtHeatmap();
        this.loadJurisprudenceTrends();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.analytics) {
                console.warn('[ELITE] Judicial Analytics não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initDemoTrends();
            console.log('[ELITE] Judicial Analytics Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega análise de tendências
     */
    loadTrendAnalysis() {
        try {
            const stored = localStorage.getItem('elite_judicial_trends');
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
            localStorage.setItem('elite_judicial_trends', JSON.stringify(trendsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar análise de tendências:', e);
        }
    }
    
    /**
     * Carrega mapa de calor de tribunais
     */
    loadCourtHeatmap() {
        try {
            const stored = localStorage.getItem('elite_court_heatmap');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.courtHeatmap.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar mapa de calor:', e);
        }
    }
    
    /**
     * Salva mapa de calor de tribunais
     */
    saveCourtHeatmap() {
        try {
            const heatmapObj = {};
            for (const [key, value] of this.courtHeatmap) {
                heatmapObj[key] = value;
            }
            localStorage.setItem('elite_court_heatmap', JSON.stringify(heatmapObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar mapa de calor:', e);
        }
    }
    
    /**
     * Carrega tendências jurisprudenciais
     */
    loadJurisprudenceTrends() {
        try {
            const stored = localStorage.getItem('elite_jurisprudence_trends');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.jurisprudenceTrends.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar tendências jurisprudenciais:', e);
        }
    }
    
    /**
     * Salva tendências jurisprudenciais
     */
    saveJurisprudenceTrends() {
        try {
            const trendsObj = {};
            for (const [key, value] of this.jurisprudenceTrends) {
                trendsObj[key] = value;
            }
            localStorage.setItem('elite_jurisprudence_trends', JSON.stringify(trendsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar tendências jurisprudenciais:', e);
        }
    }
    
    /**
     * Inicializa tendências de demonstração
     */
    initDemoTrends() {
        if (this.trendAnalysis.size === 0) {
            const trends = {
                'FISCAL_2024': {
                    area: 'Fiscal',
                    year: 2024,
                    overallTrend: 'rising',
                    favorableRate: 0.68,
                    keyDecisions: ['STA_0456_2024', 'STA_0891_2024'],
                    emergingTheses: ['DAC7', 'preço_transferência'],
                    decliningTheses: ['formalismo', 'decadência'],
                    confidence: 0.82
                },
                'LABORAL_2024': {
                    area: 'Laboral',
                    year: 2024,
                    overallTrend: 'stable',
                    favorableRate: 0.72,
                    keyDecisions: ['TCA_0456_2024'],
                    emergingTheses: ['plataformas digitais', 'vínculo laboral'],
                    decliningTheses: ['caducidade', 'prescrição curta'],
                    confidence: 0.78
                },
                'CIVIL_2024': {
                    area: 'Civil',
                    year: 2024,
                    overallTrend: 'stable',
                    favorableRate: 0.61,
                    keyDecisions: [],
                    emergingTheses: ['prova digital', 'responsabilidade civil'],
                    decliningTheses: ['formalismo excessivo'],
                    confidence: 0.75
                },
                'ARBITRAGEM_2024': {
                    area: 'Arbitragem',
                    year: 2024,
                    overallTrend: 'rising',
                    favorableRate: 0.78,
                    keyDecisions: ['CAAD_01234_2025'],
                    emergingTheses: ['eficiência', 'celeridade', 'prova digital'],
                    decliningTheses: ['dilações', 'formalismo'],
                    confidence: 0.85
                }
            };
            for (const [key, value] of Object.entries(trends)) {
                this.trendAnalysis.set(key, value);
            }
            this.saveTrendAnalysis();
        }
        
        if (this.courtHeatmap.size === 0) {
            const courts = ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Évora'];
            for (const court of courts) {
                this.courtHeatmap.set(court, {
                    court: court,
                    successRate: 0.55 + Math.random() * 0.25,
                    caseVolume: Math.floor(Math.random() * 200) + 50,
                    avgDuration: Math.floor(Math.random() * 80) + 80,
                    favorableJudges: Math.floor(Math.random() * 5) + 1,
                    trend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining'
                });
            }
            this.saveCourtHeatmap();
        }
    }
    
    /**
     * Analisa tendências jurisprudenciais profundas
     */
    analyzeJurisprudenceTrends(area, period = 12) {
        try {
            const trends = Array.from(this.trendAnalysis.values()).filter(t => t.area === area);
            const recentTrends = trends.filter(t => t.year >= new Date().getFullYear() - Math.floor(period / 12));
            
            const avgFavorable = recentTrends.reduce((s, t) => s + t.favorableRate, 0) / (recentTrends.length || 1);
            const overallTrend = this.calculateOverallTrend(recentTrends);
            
            const emergingTheses = [...new Set(recentTrends.flatMap(t => t.emergingTheses))];
            const decliningTheses = [...new Set(recentTrends.flatMap(t => t.decliningTheses))];
            
            const prediction = this.predictTrendEvolution(area, recentTrends);
            
            return {
                area: area,
                period: `${period} meses`,
                avgFavorableRate: (avgFavorable * 100).toFixed(1) + '%',
                overallTrend: overallTrend,
                emergingTheses: emergingTheses,
                decliningTheses: decliningTheses,
                keyDecisions: recentTrends.flatMap(t => t.keyDecisions),
                prediction: prediction,
                confidence: recentTrends.reduce((s, t) => s + t.confidence, 0) / (recentTrends.length || 1) * 100,
                recommendations: this.getTrendRecommendations(area, overallTrend, emergingTheses)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de tendências jurisprudenciais:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Calcula tendência geral
     */
    calculateOverallTrend(recentTrends) {
        const risingCount = recentTrends.filter(t => t.overallTrend === 'rising').length;
        const decliningCount = recentTrends.filter(t => t.overallTrend === 'declining').length;
        
        if (risingCount > decliningCount) return 'rising';
        if (decliningCount > risingCount) return 'declining';
        return 'stable';
    }
    
    /**
     * Prediz evolução de tendência
     */
    predictTrendEvolution(area, recentTrends) {
        const lastTrend = recentTrends[recentTrends.length - 1];
        if (!lastTrend) return { direction: 'stable', confidence: 0.5 };
        
        let direction = 'stable';
        let monthsHorizon = 6;
        
        if (lastTrend.overallTrend === 'rising' && lastTrend.favorableRate > 0.7) {
            direction = 'continuing_rising';
            monthsHorizon = 4;
        } else if (lastTrend.overallTrend === 'rising' && lastTrend.favorableRate < 0.65) {
            direction = 'stabilizing';
            monthsHorizon = 6;
        } else if (lastTrend.overallTrend === 'declining' && lastTrend.favorableRate < 0.55) {
            direction = 'continuing_declining';
            monthsHorizon = 3;
        }
        
        return {
            direction: direction,
            monthsHorizon: monthsHorizon,
            description: this.getTrendDescription(direction, area),
            confidence: lastTrend.confidence * 100
        };
    }
    
    /**
     * Obtém descrição da tendência
     */
    getTrendDescription(direction, area) {
        const descriptions = {
            continuing_rising: `Tendência de crescimento em ${area} deve continuar nos próximos meses`,
            stabilizing: `Crescimento em ${area} tende a estabilizar - momento favorável para litígio`,
            continuing_declining: `Queda em ${area} deve persistir - considerar arbitragem`,
            stable: `Tendência estável em ${area} - manter estratégia atual`
        };
        return descriptions[direction] || `Tendência indefinida em ${area}`;
    }
    
    /**
     * Obtém recomendações de tendência
     */
    getTrendRecommendations(area, overallTrend, emergingTheses) {
        const recs = [];
        
        if (overallTrend === 'rising') {
            recs.push(`📈 Aproveitar momento favorável em ${area} - aumentar captação de casos`);
        } else if (overallTrend === 'declining') {
            recs.push(`📉 Ambiente desafiador em ${area} - revisar estratégia ou considerar arbitragem`);
        }
        
        if (emergingTheses.length > 0) {
            recs.push(`🎯 Incorporar teses emergentes: ${emergingTheses.slice(0, 3).join(', ')}`);
        }
        
        if (recs.length === 0) {
            recs.push(`✅ Manter estratégia atual em ${area}`);
        }
        
        return recs;
    }
    
    /**
     * Gera mapa de calor de tribunais
     */
    generateCourtHeatmap() {
        try {
            const courts = Array.from(this.courtHeatmap.values());
            const sortedBySuccess = [...courts].sort((a, b) => b.successRate - a.successRate);
            const sortedByVolume = [...courts].sort((a, b) => b.caseVolume - a.caseVolume);
            
            const heatmapData = courts.map(court => ({
                court: court.court,
                successRate: (court.successRate * 100).toFixed(0) + '%',
                caseVolume: court.caseVolume,
                avgDuration: court.avgDuration,
                favorableJudges: court.favorableJudges,
                trend: court.trend,
                color: this.getHeatmapColor(court.successRate * 100)
            }));
            
            return {
                generatedAt: new Date().toISOString(),
                courts: heatmapData,
                topPerformingCourt: sortedBySuccess[0],
                highestVolumeCourt: sortedByVolume[0],
                recommendations: this.getCourtRecommendations(heatmapData)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de mapa de calor:', error);
            return { error: true, message: 'Erro na geração' };
        }
    }
    
    /**
     * Obtém cor do heatmap
     */
    getHeatmapColor(score) {
        if (score >= 70) return '#ff1744';
        if (score >= 60) return '#ff6b6b';
        if (score >= 50) return '#ffc107';
        if (score >= 40) return '#00e676';
        return '#00e5ff';
    }
    
    /**
     * Obtém recomendações de tribunal
     */
    getCourtRecommendations(courts) {
        const recs = [];
        const bestCourts = courts.filter(c => parseInt(c.successRate) > 65).slice(0, 2);
        const worstCourts = courts.filter(c => parseInt(c.successRate) < 55).slice(0, 2);
        
        if (bestCourts.length > 0) {
            recs.push(`🏆 Priorizar litígios em: ${bestCourts.map(c => c.court).join(', ')}`);
        }
        
        if (worstCourts.length > 0) {
            recs.push(`⚠️ Evitar ou preparar reforço probatório em: ${worstCourts.map(c => c.court).join(', ')}`);
        }
        
        return recs;
    }
    
    /**
     * Gera relatório completo de análise judicial
     */
    generateJudicialReport() {
        try {
            const fiscalTrends = this.analyzeJurisprudenceTrends('Fiscal', 12);
            const laboralTrends = this.analyzeJurisprudenceTrends('Laboral', 12);
            const civilTrends = this.analyzeJurisprudenceTrends('Civil', 12);
            const courtHeatmap = this.generateCourtHeatmap();
            const stats = this.analytics.getJudicialStatistics();
            
            return {
                generatedAt: new Date().toISOString(),
                overallStatistics: stats,
                trendsByArea: {
                    fiscal: fiscalTrends,
                    laboral: laboralTrends,
                    civil: civilTrends
                },
                courtHeatmap: courtHeatmap,
                strategicRecommendations: this.getJudicialRecommendations(fiscalTrends, laboralTrends, courtHeatmap),
                emergingJurisprudence: this.identifyEmergingJurisprudence(),
                riskAreas: this.identifyRiskAreas(fiscalTrends, laboralTrends, civilTrends)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório judicial:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Identifica jurisprudência emergente
     */
    identifyEmergingJurisprudence() {
        const emerging = [];
        const allTrends = Array.from(this.trendAnalysis.values());
        
        for (const trend of allTrends) {
            for (const thesis of trend.emergingTheses) {
                emerging.push({
                    thesis: thesis,
                    area: trend.area,
                    confidence: trend.confidence
                });
            }
        }
        
        return emerging.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    }
    
    /**
     * Identifica áreas de risco
     */
    identifyRiskAreas(fiscalTrends, laboralTrends, civilTrends) {
        const risks = [];
        
        if (fiscalTrends.overallTrend === 'declining') {
            risks.push({ area: 'Fiscal', risk: 'ALTO', reason: 'Tendência decrescente de favorabilidade' });
        }
        if (laboralTrends.overallTrend === 'declining') {
            risks.push({ area: 'Laboral', risk: 'MODERADO', reason: 'Estabilização após período favorável' });
        }
        if (civilTrends.overallTrend === 'declining') {
            risks.push({ area: 'Civil', risk: 'MODERADO', reason: 'Mudança de entendimento em andamento' });
        }
        
        return risks;
    }
    
    /**
     * Obtém recomendações judiciais
     */
    getJudicialRecommendations(fiscalTrends, laboralTrends, courtHeatmap) {
        const recs = [];
        
        if (fiscalTrends.overallTrend === 'rising') {
            recs.push('💰 Área Fiscal em alta - aumentar investimento em captação de casos');
        }
        
        if (laboralTrends.overallTrend === 'stable') {
            recs.push('⚖️ Área Laboral estável - manter estratégia atual');
        }
        
        if (courtHeatmap.topPerformingCourt) {
            recs.push(`🏛️ Tribunal de ${courtHeatmap.topPerformingCourt.court} com melhor performance - concentrar esforços`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Ambiente judicial estável - manter monitorização');
        }
        
        return recs;
    }
    
    /**
     * Renderiza dashboard de análise judicial avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateJudicialReport();
            const courtHeatmap = this.generateCourtHeatmap();
            
            container.innerHTML = `
                <div class="judicial-analytics-extension">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> JUDICIAL ANALYTICS EXTENSION - ANÁLISE AVANÇADA</h2><div class="stats-badge">${report.overallStatistics?.totalCourts || 0} tribunais | ${report.overallStatistics?.totalJudges || 0} magistrados</div></div>
                    
                    <div class="judicial-summary"><div class="summary-card"><div class="summary-value">${report.overallStatistics?.avgSuccessRate || 'N/A'}%</div><div class="summary-label">Taxa Média Sucesso</div><div class="summary-sub">${report.overallStatistics?.totalDecisionsAnalyzed || 0} decisões</div></div>
                    <div class="summary-card"><div class="summary-value">${report.overallStatistics?.bestJudge?.favorableRate || 'N/A'}%</div><div class="summary-label">Melhor Magistrado</div><div class="summary-sub">${report.overallStatistics?.bestJudge?.name || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.overallStatistics?.bestCourt?.successRate || 'N/A'}%</div><div class="summary-label">Melhor Tribunal</div><div class="summary-sub">${report.overallStatistics?.bestCourt?.name || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.emergingJurisprudence?.length || 0}</div><div class="summary-label">Teses Emergentes</div><div class="summary-sub">${report.riskAreas?.length || 0} áreas de risco</div></div></div>
                    
                    <div class="trends-section"><h3><i class="fas fa-chart-simple"></i> TENDÊNCIAS POR ÁREA</h3><div class="trends-grid"><div class="trend-card area-fiscal"><div class="trend-area">FISCAL</div><div class="trend-rate">${report.trendsByArea?.fiscal?.avgFavorableRate || 'N/A'}</div><div class="trend-direction trend-${report.trendsByArea?.fiscal?.overallTrend || 'stable'}">${report.trendsByArea?.fiscal?.overallTrend === 'rising' ? '📈 Ascendente' : report.trendsByArea?.fiscal?.overallTrend === 'declining' ? '📉 Descendente' : '📊 Estável'}</div><div class="trend-theses"><strong>Emergentes:</strong> ${report.trendsByArea?.fiscal?.emergingTheses?.slice(0, 2).join(', ') || 'N/A'}</div></div>
                    <div class="trend-card area-laboral"><div class="trend-area">LABORAL</div><div class="trend-rate">${report.trendsByArea?.laboral?.avgFavorableRate || 'N/A'}</div><div class="trend-direction trend-${report.trendsByArea?.laboral?.overallTrend || 'stable'}">${report.trendsByArea?.laboral?.overallTrend === 'rising' ? '📈 Ascendente' : report.trendsByArea?.laboral?.overallTrend === 'declining' ? '📉 Descendente' : '📊 Estável'}</div><div class="trend-theses"><strong>Emergentes:</strong> ${report.trendsByArea?.laboral?.emergingTheses?.slice(0, 2).join(', ') || 'N/A'}</div></div>
                    <div class="trend-card area-civil"><div class="trend-area">CIVIL</div><div class="trend-rate">${report.trendsByArea?.civil?.avgFavorableRate || 'N/A'}</div><div class="trend-direction trend-${report.trendsByArea?.civil?.overallTrend || 'stable'}">${report.trendsByArea?.civil?.overallTrend === 'rising' ? '📈 Ascendente' : report.trendsByArea?.civil?.overallTrend === 'declining' ? '📉 Descendente' : '📊 Estável'}</div><div class="trend-theses"><strong>Emergentes:</strong> ${report.trendsByArea?.civil?.emergingTheses?.slice(0, 2).join(', ') || 'N/A'}</div></div></div></div>
                    
                    <div class="heatmap-section"><h3><i class="fas fa-fire"></i> MAPA DE CALOR DE TRIBUNAIS</h3><div class="heatmap-grid">${courtHeatmap.courts?.map(c => `
                        <div class="heatmap-card" style="background: ${c.color}20; border-left: 4px solid ${c.color}">
                            <div class="heatmap-court"><strong>${c.court}</strong></div>
                            <div class="heatmap-stats"><div>✅ Sucesso: ${c.successRate}</div><div>📊 Volume: ${c.caseVolume}</div><div>⏱️ Duração: ${c.avgDuration} dias</div><div>⚖️ Juízes favoráveis: ${c.favorableJudges}</div></div>
                            <div class="heatmap-trend trend-${c.trend}">${c.trend === 'rising' ? '📈 Tendência de alta' : c.trend === 'declining' ? '📉 Tendência de baixa' : '📊 Estável'}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="jurisprudence-section"><h3><i class="fas fa-book"></i> JURISPRUDÊNCIA EMERGENTE</h3><div class="jurisprudence-grid">${report.emergingJurisprudence?.map(j => `
                        <div class="jurisprudence-card">
                            <div class="jurisprudence-thesis"><strong>${j.thesis}</strong></div>
                            <div class="jurisprudence-area">Área: ${j.area}</div>
                            <div class="jurisprudence-confidence">Confiança: ${(j.confidence * 100).toFixed(0)}%</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.strategicRecommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .judicial-analytics-extension{ padding:0; } .stats-badge{ background:var(--elite-primary-dim); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; color:var(--elite-primary); } .judicial-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .trends-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; } .trend-card{ background:var(--bg-terminal); border-radius:12px; padding:20px; text-align:center; } .trend-area{ font-size:1rem; font-weight:bold; margin-bottom:8px; } .trend-rate{ font-size:1.5rem; font-weight:bold; color:var(--elite-primary); } .trend-direction.trend-rising{ color:#00e676; } .trend-direction.trend-declining{ color:#ff1744; } .trend-theses{ font-size:0.7rem; margin-top:8px; } .heatmap-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .heatmap-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .heatmap-stats{ display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.7rem; margin:8px 0; } .heatmap-trend{ font-size:0.65rem; margin-top:8px; } .jurisprudence-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:16px; margin-bottom:24px; } .jurisprudence-card{ background:var(--bg-terminal); border-radius:12px; padding:12px; } @media (max-width:768px){ .judicial-summary{ grid-template-columns:1fr 1fr; } .trends-grid{ grid-template-columns:1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.JudicialAnalyticsExtension = new JudicialAnalyticsExtension(window.JudicialAnalytics);

console.log('[ELITE] Judicial Analytics Extension carregada - Análise Judicial Avançada Ativa');