/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE LEAD INTELLIGENCE EXTENSION
 * ============================================================================
 * Extensão do Lead Intelligence com funcionalidades adicionais:
 * - Análise preditiva de conversão
 * - Segmentação avançada de leads
 * - Automação de nurturing
 * - Previsão de pipeline
 * ============================================================================
 */

class LeadIntelligenceExtension {
    constructor(intel) {
        this.intel = intel || window.LeadIntelligence;
        this.initialized = false;
        this.conversionPredictions = new Map();
        this.segmentAnalysis = new Map();
        this.pipelineForecast = null;
        
        this.loadConversionPredictions();
        this.loadSegmentAnalysis();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.intel) {
                console.warn('[ELITE] Lead Intelligence não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initDemoSegments();
            console.log('[ELITE] Lead Intelligence Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega previsões de conversão
     */
    loadConversionPredictions() {
        try {
            const stored = localStorage.getItem('elite_conversion_predictions');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.conversionPredictions.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de conversão:', e);
        }
    }
    
    /**
     * Salva previsões de conversão
     */
    saveConversionPredictions() {
        try {
            const predictionsObj = {};
            for (const [key, value] of this.conversionPredictions) {
                predictionsObj[key] = value;
            }
            localStorage.setItem('elite_conversion_predictions', JSON.stringify(predictionsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de conversão:', e);
        }
    }
    
    /**
     * Carrega análise de segmentos
     */
    loadSegmentAnalysis() {
        try {
            const stored = localStorage.getItem('elite_segment_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.segmentAnalysis.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar análise de segmentos:', e);
        }
    }
    
    /**
     * Salva análise de segmentos
     */
    saveSegmentAnalysis() {
        try {
            const segmentsObj = {};
            for (const [key, value] of this.segmentAnalysis) {
                segmentsObj[key] = value;
            }
            localStorage.setItem('elite_segment_analysis', JSON.stringify(segmentsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar análise de segmentos:', e);
        }
    }
    
    /**
     * Inicializa segmentos de demonstração
     */
    initDemoSegments() {
        if (this.segmentAnalysis.size === 0) {
            const segments = {
                'TVDE_HIGH_VALUE': {
                    name: 'TVDE - Alto Valor',
                    criteria: { platform: ['bolt', 'uber'], minValue: 30000 },
                    leadCount: 45,
                    conversionRate: 0.72,
                    avgScore: 82,
                    priority: 'high',
                    recommendedApproach: 'Ação judicial com pedido de tutela antecipada'
                },
                'TVDE_MEDIUM_VALUE': {
                    name: 'TVDE - Valor Médio',
                    criteria: { platform: ['bolt', 'uber', 'freenow'], minValue: 10000, maxValue: 30000 },
                    leadCount: 128,
                    conversionRate: 0.58,
                    avgScore: 65,
                    priority: 'medium',
                    recommendedApproach: 'Notificação extrajudicial seguida de ação'
                },
                'DELIVERY_HIGH_VOLUME': {
                    name: 'Delivery - Alto Volume',
                    criteria: { platform: ['glovo'], minTrips: 500 },
                    leadCount: 32,
                    conversionRate: 0.68,
                    avgScore: 71,
                    priority: 'high',
                    recommendedApproach: 'Ação coletiva com pedido de inversão do ónus'
                },
                'E_COMMERCE': {
                    name: 'E-commerce Geral',
                    criteria: { sector: 'ecommerce' },
                    leadCount: 89,
                    conversionRate: 0.45,
                    avgScore: 52,
                    priority: 'low',
                    recommendedApproach: 'Conteúdo educativo e follow-up programado'
                }
            };
            for (const [key, value] of Object.entries(segments)) {
                this.segmentAnalysis.set(key, value);
            }
            this.saveSegmentAnalysis();
        }
    }
    
    /**
     * Prediz conversão de lead
     */
    predictLeadConversion(leadId) {
        try {
            const lead = this.intel.leads.find(l => l.id === leadId);
            if (!lead) return null;
            
            const baseProbability = lead.conversionProbability;
            const score = lead.score;
            
            let adjustedProbability = baseProbability;
            let timeToConversion = 0;
            let confidence = 0.7;
            
            // Ajuste baseado no score
            if (score > 80) {
                adjustedProbability += 0.1;
                timeToConversion = 15;
                confidence = 0.85;
            } else if (score > 60) {
                adjustedProbability += 0.05;
                timeToConversion = 30;
                confidence = 0.75;
            } else if (score > 40) {
                adjustedProbability -= 0.05;
                timeToConversion = 60;
                confidence = 0.65;
            } else {
                adjustedProbability -= 0.1;
                timeToConversion = 90;
                confidence = 0.55;
            }
            
            // Ajuste baseado em interações
            const interactionCount = lead.interactions.length;
            if (interactionCount >= 3) {
                adjustedProbability += 0.08;
                timeToConversion = Math.max(10, timeToConversion - 10);
            } else if (interactionCount >= 1) {
                adjustedProbability += 0.03;
                timeToConversion = Math.max(15, timeToConversion - 5);
            }
            
            adjustedProbability = Math.min(Math.max(adjustedProbability, 0.1), 0.95);
            confidence = Math.min(confidence + (interactionCount * 0.02), 0.95);
            
            const prediction = {
                leadId: lead.id,
                leadName: lead.name,
                conversionProbability: (adjustedProbability * 100).toFixed(0) + '%',
                confidence: (confidence * 100).toFixed(0) + '%',
                estimatedTimeToConversion: `${timeToConversion} dias`,
                conversionStage: this.getConversionStage(adjustedProbability),
                keyFactors: this.getConversionFactors(lead, adjustedProbability),
                recommendedActions: this.getConversionActions(lead, adjustedProbability),
                predictedValue: lead.estimatedValue * adjustedProbability
            };
            
            this.conversionPredictions.set(leadId, prediction);
            this.saveConversionPredictions();
            
            return prediction;
        } catch (error) {
            console.error('[ELITE] Erro na previsão de conversão:', error);
            return null;
        }
    }
    
    /**
     * Obtém estágio de conversão
     */
    getConversionStage(probability) {
        if (probability > 0.8) return 'Alta Probabilidade - Ação Imediata';
        if (probability > 0.6) return 'Probabilidade Moderada - Nurturing';
        if (probability > 0.4) return 'Interesse Inicial - Qualificação';
        return 'Frio - Cultivo a Longo Prazo';
    }
    
    /**
     * Obtém fatores de conversão
     */
    getConversionFactors(lead, probability) {
        const factors = [];
        
        if (lead.score > 80) factors.push('Score elevado - forte potencial');
        if (lead.estimatedValue > 30000) factors.push('Alto valor estimado');
        if (lead.interactions.length >= 2) factors.push('Engajamento ativo');
        if (lead.sector === 'tvde' || lead.sector === 'delivery') {
            factors.push('Setor com alta demanda litigiosa');
        }
        
        if (probability < 0.4) {
            factors.push('Necessita de maior engajamento');
            factors.push('Considerar abordagem diferenciada');
        }
        
        if (factors.length === 0) factors.push('Potencial não avaliado - iniciar nurturing');
        return factors;
    }
    
    /**
     * Obtém ações recomendadas para conversão
     */
    getConversionActions(lead, probability) {
        const actions = [];
        
        if (probability > 0.8) {
            actions.push('🚀 Contato imediato para proposta comercial');
            actions.push('📞 Agendar call de fechamento');
            actions.push('📄 Preparar minuta de contrato');
        } else if (probability > 0.6) {
            actions.push('📧 Enviar conteúdo educativo relevante');
            actions.push('📞 Agendar follow-up em 7 dias');
            actions.push('📊 Apresentar case studies de sucesso');
        } else if (probability > 0.4) {
            actions.push('📧 Enviar newsletter segmentada');
            actions.push('📱 Conectar via LinkedIn');
            actions.push('📄 Compartilhar artigo relevante');
        } else {
            actions.push('📧 Manter na base de nutrição');
            actions.push('📊 Monitorizar atividade no setor');
            actions.push('🔄 Reavaliar em 90 dias');
        }
        
        // Ações específicas por setor
        if (lead.sector === 'tvde') {
            actions.push('⚖️ Compartilhar jurisprudência recente do STA');
        }
        if (lead.sector === 'delivery') {
            actions.push('📦 Informar sobre mudanças regulatórias');
        }
        
        return actions;
    }
    
    /**
     * Analisa segmentos de leads
     */
    analyzeLeadSegments() {
        try {
            const segments = Array.from(this.segmentAnalysis.values());
            const leads = this.intel.leads;
            
            const enrichedSegments = segments.map(segment => {
                const segmentLeads = leads.filter(lead => {
                    if (segment.criteria.platform && !segment.criteria.platform.includes(lead.platform)) return false;
                    if (segment.criteria.sector && segment.criteria.sector !== lead.sector) return false;
                    if (segment.criteria.minValue && (lead.estimatedValue || 0) < segment.criteria.minValue) return false;
                    if (segment.criteria.maxValue && (lead.estimatedValue || 0) > segment.criteria.maxValue) return false;
                    return true;
                });
                
                const totalValue = segmentLeads.reduce((s, l) => s + (l.estimatedValue || 0), 0);
                const avgScore = segmentLeads.reduce((s, l) => s + l.score, 0) / (segmentLeads.length || 1);
                const projectedConversion = totalValue * (segment.conversionRate || 0.5);
                
                return {
                    ...segment,
                    actualLeadCount: segmentLeads.length,
                    totalValue: totalValue,
                    avgScore: avgScore.toFixed(0),
                    projectedValue: projectedConversion,
                    conversionPotential: (segment.conversionRate * 100).toFixed(0) + '%',
                    priority: segment.priority
                };
            });
            
            const totalProjectedValue = enrichedSegments.reduce((s, seg) => s + seg.projectedValue, 0);
            const highPrioritySegments = enrichedSegments.filter(s => s.priority === 'high');
            
            return {
                generatedAt: new Date().toISOString(),
                segments: enrichedSegments,
                totalProjectedValue: totalProjectedValue,
                highPrioritySegments: highPrioritySegments.length,
                topSegment: enrichedSegments.reduce((top, seg) => 
                    seg.projectedValue > (top?.projectedValue || 0) ? seg : top, null),
                recommendations: this.getSegmentRecommendations(enrichedSegments)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de segmentos:', error);
            return { error: true, message: 'Erro na análise de segmentos' };
        }
    }
    
    /**
     * Obtém recomendações de segmentos
     */
    getSegmentRecommendations(segments) {
        const recs = [];
        const highPotentialSegments = segments.filter(s => s.conversionPotential > '60%' && s.priority === 'high');
        
        if (highPotentialSegments.length > 0) {
            recs.push(`🎯 Priorizar segmentos: ${highPotentialSegments.map(s => s.name).join(', ')}`);
        }
        
        const underperformingSegments = segments.filter(s => s.actualLeadCount < 10 && s.priority === 'high');
        if (underperformingSegments.length > 0) {
            recs.push(`📢 Reforçar captação em: ${underperformingSegments.map(s => s.name).join(', ')}`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Segmentação equilibrada - manter estratégia');
        }
        
        return recs;
    }
    
    /**
     * Previsão de pipeline
     */
    forecastPipeline(periods = 3) {
        try {
            const leads = this.intel.leads;
            const predictions = [];
            
            for (let i = 1; i <= periods; i++) {
                const monthDate = new Date();
                monthDate.setMonth(monthDate.getMonth() + i);
                
                const monthLeads = leads.filter(lead => {
                    const leadDate = new Date(lead.createdAt);
                    const daysSince = (new Date() - leadDate) / (1000 * 60 * 60 * 24);
                    return daysSince <= 30 * i;
                });
                
                const monthPredictions = monthLeads.map(lead => this.predictLeadConversion(lead.id));
                const totalValue = monthPredictions.reduce((s, p) => s + (p?.predictedValue || 0), 0);
                const avgProbability = monthPredictions.reduce((s, p) => s + (parseFloat(p?.conversionProbability || 0) / 100), 0) / (monthPredictions.length || 1);
                
                predictions.push({
                    period: monthDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }),
                    leadsInPipeline: monthLeads.length,
                    projectedValue: totalValue,
                    avgConversionProbability: (avgProbability * 100).toFixed(0) + '%',
                    confidence: 0.7 - (i * 0.05)
                });
            }
            
            const totalProjected = predictions.reduce((s, p) => s + p.projectedValue, 0);
            
            this.pipelineForecast = {
                generatedAt: new Date().toISOString(),
                periods: predictions,
                totalProjectedValue: totalProjected,
                monthlyAverage: totalProjected / periods,
                trend: this.calculatePipelineTrend(predictions),
                recommendations: this.getPipelineRecommendations(predictions)
            };
            
            return this.pipelineForecast;
        } catch (error) {
            console.error('[ELITE] Erro na previsão de pipeline:', error);
            return { error: true, message: 'Erro na previsão de pipeline' };
        }
    }
    
    /**
     * Calcula tendência do pipeline
     */
    calculatePipelineTrend(predictions) {
        if (predictions.length < 2) return 'stable';
        
        const firstValue = predictions[0].projectedValue;
        const lastValue = predictions[predictions.length - 1].projectedValue;
        
        if (lastValue > firstValue * 1.1) return 'growing';
        if (lastValue < firstValue * 0.9) return 'declining';
        return 'stable';
    }
    
    /**
     * Obtém recomendações de pipeline
     */
    getPipelineRecommendations(predictions) {
        const recs = [];
        const trend = this.calculatePipelineTrend(predictions);
        
        if (trend === 'growing') {
            recs.push('📈 Pipeline em crescimento - considerar expansão da equipa comercial');
        } else if (trend === 'declining') {
            recs.push('📉 Pipeline em declínio - revisar estratégias de captação');
        }
        
        const lowConfidencePeriods = predictions.filter(p => p.confidence < 0.6);
        if (lowConfidencePeriods.length > 0) {
            recs.push('⚠️ Baixa confiança nas projeções - reforçar dados de leads');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Pipeline estável - manter estratégia atual');
        }
        
        return recs;
    }
    
    /**
     * Gera score de qualidade de lead
     */
    generateLeadQualityScore(lead) {
        try {
            let qualityScore = 50;
            
            // Dados completos
            if (lead.name && lead.email && lead.phone) qualityScore += 15;
            if (lead.nif) qualityScore += 5;
            
            // Valor estimado
            if (lead.estimatedValue > 50000) qualityScore += 15;
            else if (lead.estimatedValue > 20000) qualityScore += 10;
            else if (lead.estimatedValue > 5000) qualityScore += 5;
            
            // Setor
            if (lead.sector === 'tvde' || lead.sector === 'delivery') qualityScore += 10;
            else if (lead.sector === 'ecommerce') qualityScore += 5;
            
            // Localização
            if (lead.location === 'lisboa' || lead.location === 'porto') qualityScore += 5;
            
            // Interações
            qualityScore += Math.min(lead.interactions.length * 5, 15);
            
            qualityScore = Math.min(qualityScore, 100);
            
            return {
                score: qualityScore,
                classification: qualityScore >= 80 ? 'Excelente' :
                               qualityScore >= 60 ? 'Boa' :
                               qualityScore >= 40 ? 'Regular' : 'Baixa',
                components: {
                    dataCompleteness: (lead.name && lead.email && lead.phone ? 15 : 0) + (lead.nif ? 5 : 0),
                    valueScore: lead.estimatedValue > 50000 ? 15 : lead.estimatedValue > 20000 ? 10 : lead.estimatedValue > 5000 ? 5 : 0,
                    sectorScore: (lead.sector === 'tvde' || lead.sector === 'delivery') ? 10 : lead.sector === 'ecommerce' ? 5 : 0,
                    locationScore: (lead.location === 'lisboa' || lead.location === 'porto') ? 5 : 0,
                    interactionScore: Math.min(lead.interactions.length * 5, 15)
                }
            };
        } catch (error) {
            return { score: 50, classification: 'Regular', components: {} };
        }
    }
    
    /**
     * Gera relatório completo de inteligência de leads
     */
    generateLeadIntelligenceReport() {
        try {
            const segmentAnalysis = this.analyzeLeadSegments();
            const pipelineForecast = this.forecastPipeline(4);
            const leads = this.intel.leads;
            
            const qualityScores = leads.map(lead => this.generateLeadQualityScore(lead));
            const avgQuality = qualityScores.reduce((s, q) => s + q.score, 0) / (qualityScores.length || 1);
            
            const hotLeads = this.intel.identifyHotLeads();
            const conversionPredictions = hotLeads.map(lead => this.predictLeadConversion(lead.id));
            
            return {
                generatedAt: new Date().toISOString(),
                summary: {
                    totalLeads: leads.length,
                    hotLeads: hotLeads.length,
                    avgQualityScore: avgQuality.toFixed(0),
                    projectedPipelineValue: pipelineForecast.totalProjectedValue,
                    topSegment: segmentAnalysis.topSegment?.name || 'N/A'
                },
                segmentAnalysis: segmentAnalysis,
                pipelineForecast: pipelineForecast,
                qualityDistribution: this.getQualityDistribution(qualityScores),
                topLeads: hotLeads.slice(0, 5).map(lead => ({
                    name: lead.name,
                    score: lead.score,
                    conversionProbability: this.predictLeadConversion(lead.id)?.conversionProbability || 'N/A',
                    estimatedValue: lead.estimatedValue
                })),
                recommendations: this.getLeadIntelligenceRecommendations(segmentAnalysis, pipelineForecast, avgQuality)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório de leads:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Obtém distribuição de qualidade
     */
    getQualityDistribution(qualityScores) {
        return {
            excelente: qualityScores.filter(q => q.score >= 80).length,
            boa: qualityScores.filter(q => q.score >= 60 && q.score < 80).length,
            regular: qualityScores.filter(q => q.score >= 40 && q.score < 60).length,
            baixa: qualityScores.filter(q => q.score < 40).length
        };
    }
    
    /**
     * Obtém recomendações de inteligência de leads
     */
    getLeadIntelligenceRecommendations(segmentAnalysis, pipelineForecast, avgQuality) {
        const recs = [];
        
        if (avgQuality < 50) {
            recs.push('📊 Melhorar qualidade dos dados de leads - revisar formulários de captação');
        }
        
        if (segmentAnalysis.highPrioritySegments === 0) {
            recs.push('🎯 Identificar novos segmentos de alta prioridade');
        }
        
        if (pipelineForecast.trend === 'declining') {
            recs.push('📉 Ação urgente: reforçar campanhas de marketing');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Pipeline saudável - manter estratégias de captação');
        }
        
        return recs;
    }
    
    /**
     * Renderiza dashboard de inteligência de leads avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateLeadIntelligenceReport();
            const segmentAnalysis = this.analyzeLeadSegments();
            const pipelineForecast = this.forecastPipeline(3);
            
            container.innerHTML = `
                <div class="lead-intelligence-extension">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> LEAD INTELLIGENCE EXTENSION - ANÁLISE AVANÇADA</h2><div class="pipeline-badge trend-${pipelineForecast.trend}">Pipeline: ${pipelineForecast.trend === 'growing' ? '📈 Crescendo' : pipelineForecast.trend === 'declining' ? '📉 Declinando' : '📊 Estável'}</div></div>
                    
                    <div class="lead-summary"><div class="summary-card"><div class="summary-value">${report.summary.totalLeads}</div><div class="summary-label">Total de Leads</div><div class="summary-sub">${report.summary.hotLeads} hot leads</div></div>
                    <div class="summary-card"><div class="summary-value">${report.summary.avgQualityScore}%</div><div class="summary-label">Qualidade Média</div><div class="summary-sub">${report.qualityDistribution?.excelente || 0} excelentes</div></div>
                    <div class="summary-card"><div class="summary-value">€${(report.summary.projectedPipelineValue / 1000).toFixed(0)}k</div><div class="summary-label">Pipeline Projetado</div><div class="summary-sub">${pipelineForecast.trend === 'growing' ? '↑ em alta' : pipelineForecast.trend === 'declining' ? '↓ em baixa' : 'estável'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.summary.topSegment}</div><div class="summary-label">Top Segmento</div><div class="summary-sub">Prioridade ${segmentAnalysis.topSegment?.priority || 'N/A'}</div></div></div>
                    
                    <div class="segment-section"><h3><i class="fas fa-chart-pie"></i> ANÁLISE DE SEGMENTOS</h3><div class="segment-grid">${segmentAnalysis.segments?.slice(0, 4).map(s => `
                        <div class="segment-card priority-${s.priority}">
                            <div class="segment-header"><strong>${s.name}</strong><span class="priority-badge">${s.priority.toUpperCase()}</span></div>
                            <div class="segment-stats"><div>📊 Leads: ${s.actualLeadCount}</div><div>💰 Valor: €${(s.totalValue / 1000).toFixed(0)}k</div><div>🎯 Conversão: ${s.conversionPotential}</div><div>⭐ Score: ${s.avgScore}</div></div>
                            <div class="segment-value"><strong>Valor Projetado:</strong> €${(s.projectedValue / 1000).toFixed(0)}k</div>
                            <div class="segment-approach"><strong>Abordagem:</strong> ${s.recommendedApproach}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="pipeline-section"><h3><i class="fas fa-chart-simple"></i> PREVISÃO DE PIPELINE</h3><div class="pipeline-grid">${pipelineForecast.periods?.map(p => `
                        <div class="pipeline-card">
                            <div class="pipeline-period">${p.period}</div>
                            <div class="pipeline-value">€${(p.projectedValue / 1000).toFixed(0)}k</div>
                            <div class="pipeline-leads">${p.leadsInPipeline} leads</div>
                            <div class="pipeline-probability">Probabilidade: ${p.avgConversionProbability}</div>
                            <div class="pipeline-confidence">Confiança: ${(p.confidence * 100).toFixed(0)}%</div>
                            <div class="pipeline-bar"><div class="pipeline-fill" style="width: ${(p.projectedValue / (pipelineForecast.periods?.[0]?.projectedValue || 1)) * 100}%"></div></div>
                        </div>
                    `).join('')}</div>
                    <div class="pipeline-total"><strong>Total Projetado:</strong> €${(pipelineForecast.totalProjectedValue / 1000).toFixed(0)}k (média mensal: €${(pipelineForecast.monthlyAverage / 1000).toFixed(0)}k)</div></div>
                    
                    <div class="top-leads"><h3><i class="fas fa-fire"></i> TOP LEADS QUENTES</h3><div class="leads-grid">${report.topLeads?.map(l => `
                        <div class="lead-card">
                            <div class="lead-name"><strong>${l.name}</strong></div>
                            <div class="lead-stats"><div>🎯 Score: ${l.score}%</div><div>💰 Valor: €${(l.estimatedValue / 1000).toFixed(0)}k</div><div>📈 Conversão: ${l.conversionProbability}</div></div>
                            <div class="lead-actions"><button class="action-btn view-lead" data-lead-id="${l.name}">VER DETALHES</button></div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="quality-distribution"><h3><i class="fas fa-chart-pie"></i> DISTRIBUIÇÃO DE QUALIDADE</h3><div class="quality-grid"><div class="quality-card excellent"><div class="quality-value">${report.qualityDistribution?.excelente || 0}</div><div class="quality-label">Excelente</div></div>
                    <div class="quality-card good"><div class="quality-value">${report.qualityDistribution?.boa || 0}</div><div class="quality-label">Boa</div></div>
                    <div class="quality-card regular"><div class="quality-value">${report.qualityDistribution?.regular || 0}</div><div class="quality-label">Regular</div></div>
                    <div class="quality-card poor"><div class="quality-value">${report.qualityDistribution?.baixa || 0}</div><div class="quality-label">Baixa</div></div></div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.recommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .lead-intelligence-extension{ padding:0; } .pipeline-badge{ padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; } .trend-growing{ border-left:3px solid #00e676; color:#00e676; background:rgba(0,230,118,0.1); } .trend-declining{ border-left:3px solid #ff1744; color:#ff1744; background:rgba(255,23,68,0.1); } .trend-stable{ border-left:3px solid #ffc107; color:#ffc107; background:rgba(255,193,7,0.1); } .lead-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .segment-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; margin-bottom:24px; } .segment-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border-left:3px solid; } .segment-card.priority-high{ border-left-color:#ff1744; } .segment-card.priority-medium{ border-left-color:#ffc107; } .segment-card.priority-low{ border-left-color:#00e676; } .pipeline-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; margin-bottom:20px; } .pipeline-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } .pipeline-value{ font-size:1.2rem; font-weight:bold; color:var(--elite-primary); } .pipeline-bar{ height:6px; background:var(--bg-command); border-radius:3px; margin-top:12px; overflow:hidden; } .pipeline-fill{ height:100%; background:linear-gradient(90deg,var(--elite-primary),var(--elite-success)); width:0; } .leads-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .lead-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .quality-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; } .quality-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } .quality-card.excellent{ border-left:3px solid #00e676; } .quality-card.good{ border-left:3px solid #00e5ff; } .quality-card.regular{ border-left:3px solid #ffc107; } .quality-card.poor{ border-left:3px solid #ff1744; } @media (max-width:768px){ .lead-summary{ grid-template-columns:1fr 1fr; } .segment-grid{ grid-template-columns:1fr; } .quality-grid{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
            
            document.querySelectorAll('.view-lead').forEach(btn => {
                btn.addEventListener('click', () => {
                    const leadName = btn.dataset.leadId;
                    if (window.EliteUtils) window.EliteUtils.showToast(`Detalhes de ${leadName} - em desenvolvimento`, 'info');
                });
            });
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.LeadIntelligenceExtension = new LeadIntelligenceExtension(window.LeadIntelligence);

console.log('[ELITE] Lead Intelligence Extension carregada - Análise Avançada de Leads Ativa');