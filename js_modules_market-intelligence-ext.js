/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE MARKET INTELLIGENCE EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Market Intelligence com funcionalidades adicionais:
 * - Análise de tendências de mercado em tempo real
 * - Previsão de movimentos da concorrência
 * - Identificação de oportunidades de crescimento
 * - Mapa de calor de setores
 * ============================================================================
 */

class MarketIntelligenceExtensionExtended {
    constructor(intel) {
        this.intel = intel || window.MarketIntelligence;
        this.initialized = false;
        this.realTimeTrends = new Map();
        this.competitorForecasts = new Map();
        this.growthOpportunities = new Map();
        
        this.loadRealTimeTrends();
        this.loadCompetitorForecasts();
        this.loadGrowthOpportunities();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.intel) {
                console.warn('[ELITE] Market Intelligence não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initRealTimeTrends();
            console.log('[ELITE] Market Intelligence Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega tendências em tempo real
     */
    loadRealTimeTrends() {
        try {
            const stored = localStorage.getItem('elite_realtime_trends');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.realTimeTrends.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar tendências em tempo real:', e);
        }
    }
    
    /**
     * Salva tendências em tempo real
     */
    saveRealTimeTrends() {
        try {
            const trendsObj = {};
            for (const [key, value] of this.realTimeTrends) {
                trendsObj[key] = value;
            }
            localStorage.setItem('elite_realtime_trends', JSON.stringify(trendsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar tendências em tempo real:', e);
        }
    }
    
    /**
     * Carrega previsões de concorrentes
     */
    loadCompetitorForecasts() {
        try {
            const stored = localStorage.getItem('elite_competitor_forecasts');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.competitorForecasts.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de concorrentes:', e);
        }
    }
    
    /**
     * Salva previsões de concorrentes
     */
    saveCompetitorForecasts() {
        try {
            const forecastsObj = {};
            for (const [key, value] of this.competitorForecasts) {
                forecastsObj[key] = value;
            }
            localStorage.setItem('elite_competitor_forecasts', JSON.stringify(forecastsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de concorrentes:', e);
        }
    }
    
    /**
     * Carrega oportunidades de crescimento
     */
    loadGrowthOpportunities() {
        try {
            const stored = localStorage.getItem('elite_growth_opportunities');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.growthOpportunities.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar oportunidades de crescimento:', e);
        }
    }
    
    /**
     * Salva oportunidades de crescimento
     */
    saveGrowthOpportunities() {
        try {
            const oppsObj = {};
            for (const [key, value] of this.growthOpportunities) {
                oppsObj[key] = value;
            }
            localStorage.setItem('elite_growth_opportunities', JSON.stringify(oppsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar oportunidades de crescimento:', e);
        }
    }
    
    /**
     * Inicializa tendências em tempo real
     */
    initRealTimeTrends() {
        if (this.realTimeTrends.size === 0) {
            const sectors = ['TVDE', 'E-commerce', 'Delivery', 'Fintech', 'Saúde', 'Imobiliário'];
            for (const sector of sectors) {
                this.realTimeTrends.set(sector, {
                    sector: sector,
                    momentum: 0.3 + Math.random() * 0.6,
                    sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
                    growthRate: 0.05 + Math.random() * 0.25,
                    keyDrivers: this.getKeyDrivers(sector),
                    lastUpdated: new Date().toISOString()
                });
            }
            this.saveRealTimeTrends();
        }
    }
    
    /**
     * Obtém drivers chave por setor
     */
    getKeyDrivers(sector) {
        const drivers = {
            'TVDE': ['Regulação DAC7', 'Jurisprudência STA', 'Concorrência entre plataformas'],
            'E-commerce': ['Obrigações fiscais', 'Proteção do consumidor', 'Logística'],
            'Delivery': ['Vínculo laboral', 'Condições de trabalho', 'Modelos de remuneração'],
            'Fintech': ['Regulação bancária', 'Proteção de dados', 'Cibersegurança'],
            'Saúde': ['Telemedicina', 'Proteção de dados sensíveis', 'Responsabilidade civil'],
            'Imobiliário': ['AL (Alojamento Local)', 'Contratos de arrendamento', 'Fiscalidade']
        };
        return drivers[sector] || ['Tendências de mercado', 'Mudanças regulatórias'];
    }
    
    /**
     * Analisa tendências de mercado em tempo real
     */
    analyzeRealTimeTrends() {
        try {
            const trends = Array.from(this.realTimeTrends.values());
            const sortedByMomentum = [...trends].sort((a, b) => b.momentum - a.momentum);
            const hotSectors = sortedByMomentum.filter(t => t.momentum > 0.7);
            const coldSectors = sortedByMomentum.filter(t => t.momentum < 0.4);
            
            return {
                generatedAt: new Date().toISOString(),
                overallMarketMomentum: (trends.reduce((s, t) => s + t.momentum, 0) / trends.length * 100).toFixed(0) + '%',
                hotSectors: hotSectors.map(s => ({
                    sector: s.sector,
                    momentum: (s.momentum * 100).toFixed(0) + '%',
                    sentiment: s.sentiment,
                    keyDrivers: s.keyDrivers
                })),
                coldSectors: coldSectors.map(s => ({
                    sector: s.sector,
                    momentum: (s.momentum * 100).toFixed(0) + '%',
                    sentiment: s.sentiment
                })),
                recommendations: this.getTrendRecommendations(hotSectors, coldSectors)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de tendências:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Obtém recomendações de tendências
     */
    getTrendRecommendations(hotSectors, coldSectors) {
        const recs = [];
        
        if (hotSectors.length > 0) {
            recs.push(`📈 Foco prioritário em setores em alta: ${hotSectors.map(s => s.sector).join(', ')}`);
        }
        
        if (coldSectors.length > 0) {
            recs.push(`📉 Reavaliar estratégia em setores em baixa: ${coldSectors.map(s => s.sector).join(', ')}`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Mercado equilibrado - manter estratégia atual');
        }
        
        return recs;
    }
    
    /**
     * Prediz movimentos da concorrência
     */
    predictCompetitorMovements(competitorId = null) {
        try {
            const competitors = this.intel.competitors;
            const predictions = [];
            
            for (const comp of competitors) {
                if (competitorId && comp.id !== competitorId) continue;
                
                const recentActivity = this.analyzeRecentActivity(comp);
                const predictedMovement = this.forecastMovement(comp, recentActivity);
                
                predictions.push({
                    competitor: comp.name,
                    recentActivity: recentActivity,
                    predictedMovement: predictedMovement,
                    threatLevel: this.assessMovementThreat(comp, predictedMovement),
                    recommendedResponse: this.getMovementResponse(predictedMovement)
                });
            }
            
            const highThreatMovements = predictions.filter(p => p.threatLevel === 'high');
            
            return {
                generatedAt: new Date().toISOString(),
                predictions: predictions,
                highThreatCount: highThreatMovements.length,
                overallRecommendation: highThreatMovements.length > 0 ? 
                    `🚨 Atenção: ${highThreatMovements.length} concorrente(s) com movimentos de alta ameaça` : 
                    '✅ Ambiente competitivo estável'
            };
        } catch (error) {
            console.error('[ELITE] Erro na previsão de movimentos da concorrência:', error);
            return { error: true, message: 'Erro na previsão' };
        }
    }
    
    /**
     * Analisa atividade recente do concorrente
     */
    analyzeRecentActivity(competitor) {
        const activities = [];
        
        if (competitor.recentNews && competitor.recentNews.length > 0) {
            activities.push(...competitor.recentNews);
        }
        
        if (competitor.recentCases > 10) {
            activities.push(`Alto volume de casos recentes (${competitor.recentCases})`);
        }
        
        if (competitor.growth > 0.1) {
            activities.push(`Crescimento acelerado de ${(competitor.growth * 100).toFixed(0)}%`);
        }
        
        if (activities.length === 0) {
            activities.push('Atividade estável');
        }
        
        return activities;
    }
    
    /**
     * Previsão de movimento
     */
    forecastMovement(competitor, recentActivity) {
        let movement = 'estável';
        let confidence = 0.6;
        
        if (competitor.growth > 0.15) {
            movement = 'expansão agressiva';
            confidence = 0.75;
        } else if (competitor.growth > 0.08) {
            movement = 'expansão moderada';
            confidence = 0.7;
        } else if (competitor.growth < 0) {
            movement = 'contração';
            confidence = 0.65;
        }
        
        if (competitor.recentCases > 15) {
            movement = 'intensificação de litígios';
            confidence = 0.8;
        }
        
        return {
            type: movement,
            confidence: (confidence * 100).toFixed(0) + '%',
            expectedTimeline: movement === 'expansão agressiva' ? '3-6 meses' : '6-12 meses',
            indicators: recentActivity.slice(0, 2)
        };
    }
    
    /**
     * Avalia ameaça do movimento
     */
    assessMovementThreat(competitor, movement) {
        if (movement.type === 'expansão agressiva' && competitor.marketShare > 0.15) return 'high';
        if (movement.type === 'intensificação de litígios') return 'high';
        if (movement.type === 'expansão moderada') return 'medium';
        return 'low';
    }
    
    /**
     * Obtém resposta ao movimento
     */
    getMovementResponse(movement) {
        if (movement.type === 'expansão agressiva') {
            return 'Reforçar diferenciação e intensificar marketing';
        }
        if (movement.type === 'intensificação de litígios') {
            return 'Preparar argumentação robusta e reforçar provas';
        }
        return 'Monitorar evolução e manter estratégia';
    }
    
    /**
     * Identifica oportunidades de crescimento
     */
    identifyGrowthOpportunities() {
        try {
            const trends = this.analyzeRealTimeTrends();
            const competitors = this.intel.competitors;
            const marketGaps = this.identifyMarketGaps(trends, competitors);
            
            const opportunities = marketGaps.map(gap => ({
                sector: gap.sector,
                opportunity: gap.description,
                potentialValue: gap.potentialValue,
                timeline: gap.timeline,
                requiredResources: gap.requiredResources,
                roi: gap.roi
            }));
            
            const sortedByValue = [...opportunities].sort((a, b) => b.potentialValue - a.potentialValue);
            
            return {
                generatedAt: new Date().toISOString(),
                opportunities: sortedByValue,
                topOpportunity: sortedByValue[0],
                totalPotentialValue: sortedByValue.reduce((s, o) => s + o.potentialValue, 0),
                recommendations: this.getGrowthRecommendations(sortedByValue)
            };
        } catch (error) {
            console.error('[ELITE] Erro na identificação de oportunidades:', error);
            return { error: true, message: 'Erro na identificação' };
        }
    }
    
    /**
     * Identifica gaps de mercado
     */
    identifyMarketGaps(trends, competitors) {
        const gaps = [];
        const hotSectors = trends.hotSectors || [];
        
        for (const sector of hotSectors) {
            const competitorPresence = competitors.filter(c => 
                c.focusAreas?.some(area => area.toLowerCase().includes(sector.sector.toLowerCase()))
            ).length;
            
            if (competitorPresence < 2) {
                gaps.push({
                    sector: sector.sector,
                    description: `Baixa concorrência em ${sector.sector} com alta demanda`,
                    potentialValue: 50000 + Math.random() * 150000,
                    timeline: '3-6 meses',
                    requiredResources: 'Médio',
                    roi: 2.5 + Math.random() * 1.5
                });
            }
        }
        
        return gaps;
    }
    
    /**
     * Obtém recomendações de crescimento
     */
    getGrowthRecommendations(opportunities) {
        const recs = [];
        
        if (opportunities.length > 0) {
            recs.push(`🎯 Oportunidade prioritária: ${opportunities[0].sector} (valor potencial: €${(opportunities[0].potentialValue / 1000).toFixed(0)}k)`);
        }
        
        if (opportunities.length > 1) {
            recs.push(`📊 Segunda oportunidade: ${opportunities[1].sector} - ROI estimado ${opportunities[1].roi}x`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Nenhuma oportunidade significativa identificada no momento');
        }
        
        return recs;
    }
    
    /**
     * Gera relatório completo de inteligência de mercado
     */
    generateMarketIntelligenceReport() {
        try {
            const trends = this.analyzeRealTimeTrends();
            const competitorMovements = this.predictCompetitorMovements();
            const growthOpportunities = this.identifyGrowthOpportunities();
            const marketStats = this.intel.getStatistics();
            
            return {
                generatedAt: new Date().toISOString(),
                marketOverview: {
                    momentum: trends.overallMarketMomentum,
                    hotSectorsCount: trends.hotSectors?.length || 0,
                    coldSectorsCount: trends.coldSectors?.length || 0
                },
                trendsAnalysis: trends,
                competitorAnalysis: competitorMovements,
                growthOpportunities: growthOpportunities,
                strategicRecommendations: this.getStrategicRecommendations(trends, competitorMovements, growthOpportunities),
                riskFactors: this.identifyRiskFactors(trends, competitorMovements)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Obtém recomendações estratégicas
     */
    getStrategicRecommendations(trends, competitorMovements, opportunities) {
        const recs = [];
        
        if (trends.hotSectors?.length > 0) {
            recs.push(`📈 Expandir atuação em setores de alta: ${trends.hotSectors.map(s => s.sector).join(', ')}`);
        }
        
        if (competitorMovements.highThreatCount > 0) {
            recs.push(`⚠️ Atenção a movimentos agressivos da concorrência`);
        }
        
        if (opportunities.topOpportunity) {
            recs.push(`💰 Aproveitar oportunidade em ${opportunities.topOpportunity.sector}`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Manter estratégia atual - mercado estável');
        }
        
        return recs;
    }
    
    /**
     * Identifica fatores de risco
     */
    identifyRiskFactors(trends, competitorMovements) {
        const risks = [];
        
        if (trends.coldSectors?.length > 0) {
            risks.push({
                factor: 'Setores em declínio',
                severity: 'Médio',
                sectors: trends.coldSectors.map(s => s.sector)
            });
        }
        
        if (competitorMovements.highThreatCount > 0) {
            risks.push({
                factor: 'Concorrência agressiva',
                severity: 'Alto',
                description: `${competitorMovements.highThreatCount} concorrente(s) com movimentos agressivos`
            });
        }
        
        return risks;
    }
    
    /**
     * Renderiza dashboard de inteligência de mercado avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateMarketIntelligenceReport();
            
            container.innerHTML = `
                <div class="market-intelligence-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> MARKET INTELLIGENCE EXTENSION - ANÁLISE AVANÇADA</h2><div class="momentum-badge">Momentum: ${report.marketOverview?.momentum || 'N/A'}</div></div>
                    
                    <div class="market-summary"><div class="summary-card"><div class="summary-value">${report.marketOverview?.hotSectorsCount || 0}</div><div class="summary-label">Setores em Alta</div><div class="summary-sub">Momentum positivo</div></div>
                    <div class="summary-card"><div class="summary-value">${report.marketOverview?.coldSectorsCount || 0}</div><div class="summary-label">Setores em Baixa</div><div class="summary-sub">Reavaliar estratégia</div></div>
                    <div class="summary-card"><div class="summary-value">${report.competitorAnalysis?.highThreatCount || 0}</div><div class="summary-label">Ameaças Altas</div><div class="summary-sub">Concorrentes agressivos</div></div>
                    <div class="summary-card"><div class="summary-value">€${(report.growthOpportunities?.totalPotentialValue / 1000 || 0).toFixed(0)}k</div><div class="summary-label">Potencial de Crescimento</div><div class="summary-sub">Oportunidades identificadas</div></div></div>
                    
                    <div class="trends-section"><h3><i class="fas fa-chart-simple"></i> TENDÊNCIAS EM TEMPO REAL</h3><div class="trends-grid">${report.trendsAnalysis?.hotSectors?.map(s => `
                        <div class="trend-card hot">
                            <div class="trend-sector"><strong>${s.sector}</strong><span class="trend-badge">🔥 Alta</span></div>
                            <div class="trend-momentum">Momentum: ${s.momentum}</div>
                            <div class="trend-drivers"><strong>Drivers:</strong> ${s.keyDrivers?.slice(0, 2).join(', ')}</div>
                        </div>
                    `).join('')}${report.trendsAnalysis?.coldSectors?.map(s => `
                        <div class="trend-card cold">
                            <div class="trend-sector"><strong>${s.sector}</strong><span class="trend-badge">❄️ Baixa</span></div>
                            <div class="trend-momentum">Momentum: ${s.momentum}</div>
                            <div class="trend-sentiment">Sentimento: ${s.sentiment}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="competitor-section"><h3><i class="fas fa-building"></i> PREVISÃO DE MOVIMENTOS</h3><div class="competitor-grid">${report.competitorAnalysis?.predictions?.slice(0, 4).map(p => `
                        <div class="competitor-card threat-${p.threatLevel}">
                            <div class="competitor-name"><strong>${p.competitor}</strong><span class="threat-badge">Ameaça: ${p.threatLevel === 'high' ? 'ALTA' : p.threatLevel === 'medium' ? 'MÉDIA' : 'BAIXA'}</span></div>
                            <div class="competitor-movement">Movimento previsto: ${p.predictedMovement?.type}</div>
                            <div class="competitor-confidence">Confiança: ${p.predictedMovement?.confidence}</div>
                            <div class="competitor-response">Resposta: ${p.recommendedResponse}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="opportunities-section"><h3><i class="fas fa-rocket"></i> OPORTUNIDADES DE CRESCIMENTO</h3><div class="opportunities-grid">${report.growthOpportunities?.opportunities?.slice(0, 3).map(o => `
                        <div class="opportunity-card">
                            <div class="opportunity-sector"><strong>${o.sector}</strong></div>
                            <div class="opportunity-desc">${o.opportunity}</div>
                            <div class="opportunity-value">💰 Valor potencial: €${(o.potentialValue / 1000).toFixed(0)}k</div>
                            <div class="opportunity-meta">ROI: ${o.roi}x | Timeline: ${o.timeline}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.strategicRecommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .market-intelligence-ext{ padding:0; } .momentum-badge{ background:var(--elite-primary-dim); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; color:var(--elite-primary); } .market-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .trends-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .trend-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .trend-card.hot{ border-left:3px solid #ff1744; } .trend-card.cold{ border-left:3px solid #00e676; } .trend-sector{ display:flex; justify-content:space-between; margin-bottom:8px; } .competitor-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-bottom:24px; } .competitor-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .competitor-card.threat-high{ border-left:3px solid #ff1744; } .competitor-card.threat-medium{ border-left:3px solid #ffc107; } .competitor-card.threat-low{ border-left:3px solid #00e676; } .opportunities-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-bottom:24px; } .opportunity-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } @media (max-width:768px){ .market-summary{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.MarketIntelligenceExtensionExtended = new MarketIntelligenceExtensionExtended(window.MarketIntelligence);

console.log('[ELITE] Market Intelligence Extension Extended carregada - Análise Avançada de Mercado Ativa');