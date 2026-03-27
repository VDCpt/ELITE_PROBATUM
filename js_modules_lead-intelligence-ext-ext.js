/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE LEAD INTELLIGENCE EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Lead Intelligence com funcionalidades adicionais:
 * - Análise preditiva avançada de conversión
 * - Segmentação comportamental de leads
 * - Automação de nurturing inteligente
 * - Previsão de lifetime value (LTV)
 * ============================================================================
 */

class LeadIntelligenceExtensionExtended {
    constructor(intel) {
        this.intel = intel || window.LeadIntelligence;
        this.initialized = false;
        this.conversionModels = new Map();
        this.behavioralSegments = new Map();
        this.ltvPredictions = new Map();
        
        this.loadConversionModels();
        this.loadBehavioralSegments();
        this.loadLTVPredictions();
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
            this.initBehavioralSegments();
            console.log('[ELITE] Lead Intelligence Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega modelos de conversão
     */
    loadConversionModels() {
        try {
            const stored = localStorage.getItem('elite_conversion_models');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.conversionModels.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar modelos de conversão:', e);
        }
    }
    
    /**
     * Salva modelos de conversão
     */
    saveConversionModels() {
        try {
            const modelsObj = {};
            for (const [key, value] of this.conversionModels) {
                modelsObj[key] = value;
            }
            localStorage.setItem('elite_conversion_models', JSON.stringify(modelsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar modelos de conversão:', e);
        }
    }
    
    /**
     * Carrega segmentos comportamentais
     */
    loadBehavioralSegments() {
        try {
            const stored = localStorage.getItem('elite_behavioral_segments');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.behavioralSegments.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar segmentos comportamentais:', e);
        }
    }
    
    /**
     * Salva segmentos comportamentais
     */
    saveBehavioralSegments() {
        try {
            const segmentsObj = {};
            for (const [key, value] of this.behavioralSegments) {
                segmentsObj[key] = value;
            }
            localStorage.setItem('elite_behavioral_segments', JSON.stringify(segmentsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar segmentos comportamentais:', e);
        }
    }
    
    /**
     * Carrega previsões de LTV
     */
    loadLTVPredictions() {
        try {
            const stored = localStorage.getItem('elite_ltv_predictions');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.ltvPredictions.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de LTV:', e);
        }
    }
    
    /**
     * Salva previsões de LTV
     */
    saveLTVPredictions() {
        try {
            const ltvObj = {};
            for (const [key, value] of this.ltvPredictions) {
                ltvObj[key] = value;
            }
            localStorage.setItem('elite_ltv_predictions', JSON.stringify(ltvObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de LTV:', e);
        }
    }
    
    /**
     * Inicializa segmentos comportamentais
     */
    initBehavioralSegments() {
        if (this.behavioralSegments.size === 0) {
            const segments = {
                'high_intent': {
                    name: 'Alta Intenção',
                    criteria: { score: 80, interactions: 3, value: 50000 },
                    conversionRate: 0.85,
                    nurturingStrategy: 'aggressive',
                    recommendedActions: ['contato imediato', 'proposta comercial', 'case study']
                },
                'medium_intent': {
                    name: 'Intenção Moderada',
                    criteria: { score: 60, interactions: 2, value: 20000 },
                    conversionRate: 0.65,
                    nurturingStrategy: 'balanced',
                    recommendedActions: ['conteúdo educativo', 'follow-up semanal', 'webinar']
                },
                'low_intent': {
                    name: 'Baixa Intenção',
                    criteria: { score: 40, interactions: 1, value: 5000 },
                    conversionRate: 0.35,
                    nurturingStrategy: 'passive',
                    recommendedActions: ['newsletter', 'conteúdo relevante', 'monitorização']
                },
                'cold': {
                    name: 'Frio',
                    criteria: { score: 20, interactions: 0, value: 0 },
                    conversionRate: 0.15,
                    nurturingStrategy: 'cultivation',
                    recommendedActions: ['conteúdo de awareness', 'redes sociais', 'longo prazo']
                }
            };
            for (const [key, value] of Object.entries(segments)) {
                this.behavioralSegments.set(key, value);
            }
            this.saveBehavioralSegments();
        }
    }
    
    /**
     * Prediz conversão com modelo avançado
     */
    predictAdvancedConversion(leadId) {
        try {
            const lead = this.intel.leads.find(l => l.id === leadId);
            if (!lead) return null;
            
            const basePrediction = this.intel.predictLeadConversion(leadId);
            const behavioralSegment = this.classifyBehavioralSegment(lead);
            const timeToConversion = this.predictTimeToConversion(lead, behavioralSegment);
            const ltvPrediction = this.predictLeadLTV(lead);
            
            const conversionModel = {
                leadId: lead.id,
                leadName: lead.name,
                conversionProbability: basePrediction?.conversionProbability || '0%',
                confidence: (0.7 + (lead.interactions.length * 0.05)).toFixed(0) + '%',
                behavioralSegment: behavioralSegment.name,
                segmentStrategy: behavioralSegment.recommendedActions,
                predictedTimeToConversion: timeToConversion,
                predictedLTV: ltvPrediction,
                recommendedNextAction: this.getNextActionRecommendation(lead, behavioralSegment),
                nurturingSequence: this.generateNurturingSequence(lead, behavioralSegment)
            };
            
            this.conversionModels.set(leadId, conversionModel);
            this.saveConversionModels();
            
            return conversionModel;
        } catch (error) {
            console.error('[ELITE] Erro na previsão avançada de conversão:', error);
            return { error: true, message: 'Erro na previsão' };
        }
    }
    
    /**
     * Classifica lead por segmento comportamental
     */
    classifyBehavioralSegment(lead) {
        const segments = Array.from(this.behavioralSegments.values());
        
        if (lead.score > 80 && lead.interactions.length >= 3) {
            return segments.find(s => s.name === 'Alta Intenção') || segments[0];
        }
        if (lead.score > 60 && lead.interactions.length >= 2) {
            return segments.find(s => s.name === 'Intenção Moderada') || segments[1];
        }
        if (lead.score > 40 && lead.interactions.length >= 1) {
            return segments.find(s => s.name === 'Baixa Intenção') || segments[2];
        }
        return segments.find(s => s.name === 'Frio') || segments[3];
    }
    
    /**
     * Prediz tempo até conversão
     */
    predictTimeToConversion(lead, segment) {
        let baseDays = 0;
        
        if (segment.name === 'Alta Intenção') baseDays = 7;
        else if (segment.name === 'Intenção Moderada') baseDays = 21;
        else if (segment.name === 'Baixa Intenção') baseDays = 45;
        else baseDays = 90;
        
        if (lead.estimatedValue > 50000) baseDays = Math.max(baseDays - 5, 3);
        if (lead.estimatedValue < 10000) baseDays += 7;
        baseDays = Math.max(baseDays - (lead.interactions.length * 2), 1);
        
        return `${baseDays} dias`;
    }
    
    /**
     * Prediz Lifetime Value do lead
     */
    predictLeadLTV(lead) {
        const baseValue = lead.estimatedValue;
        const conversionProb = lead.conversionProbability;
        const repeatProbability = 0.3 + (lead.score / 100) * 0.3;
        
        const expectedValue = baseValue * conversionProb;
        const lifetimeValue = expectedValue * (1 + repeatProbability);
        
        return {
            expectedValue: Math.round(expectedValue),
            lifetimeValue: Math.round(lifetimeValue),
            repeatProbability: (repeatProbability * 100).toFixed(0) + '%',
            formattedValue: new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(lifetimeValue),
            classification: lifetimeValue > 50000 ? 'Alto Valor' : lifetimeValue > 15000 ? 'Médio Valor' : 'Baixo Valor'
        };
    }
    
    /**
     * Obtém próxima ação recomendada
     */
    getNextActionRecommendation(lead, segment) {
        const lastInteraction = lead.interactions[0];
        const daysSinceLast = lastInteraction 
            ? Math.floor((new Date() - new Date(lastInteraction.timestamp)) / (1000 * 60 * 60 * 24))
            : 999;
        
        if (segment.name === 'Alta Intenção') {
            if (daysSinceLast > 3) return '📞 Contato urgente - lead quente';
            return '📄 Enviar proposta comercial personalizada';
        }
        if (segment.name === 'Intenção Moderada') {
            if (daysSinceLast > 7) return '📧 Follow-up com conteúdo relevante';
            return '📊 Compartilhar case study de sucesso';
        }
        if (segment.name === 'Baixa Intenção') {
            return '📧 Newsletter mensal com conteúdo educativo';
        }
        return '📱 Manter na base de nutrição com conteúdo de awareness';
    }
    
    /**
     * Gera sequência de nurturing
     */
    generateNurturingSequence(lead, segment) {
        const sequence = [];
        
        if (segment.name === 'Alta Intenção') {
            sequence.push({ day: 1, action: 'Contato telefônico', content: 'Apresentação de proposta' });
            sequence.push({ day: 3, action: 'E-mail', content: 'Envio de minuta de contrato' });
            sequence.push({ day: 7, action: 'Follow-up', content: 'Acompanhamento de decisão' });
        } else if (segment.name === 'Intenção Moderada') {
            sequence.push({ day: 1, action: 'E-mail', content: 'Artigo sobre jurisprudência recente' });
            sequence.push({ day: 7, action: 'E-mail', content: 'Case study de sucesso' });
            sequence.push({ day: 14, action: 'Contato', content: 'Convidar para webinar' });
        } else {
            sequence.push({ day: 7, action: 'Newsletter', content: 'Conteúdo educativo' });
            sequence.push({ day: 30, action: 'E-mail', content: 'Atualização do setor' });
            sequence.push({ day: 60, action: 'Contato', content: 'Reavaliação de interesse' });
        }
        
        return sequence;
    }
    
    /**
     * Analisa pipeline de leads
     */
    analyzeLeadPipeline() {
        try {
            const leads = this.intel.leads;
            const segments = Array.from(this.behavioralSegments.values());
            
            const pipelineAnalysis = segments.map(segment => {
                const segmentLeads = leads.filter(lead => {
                    const classified = this.classifyBehavioralSegment(lead);
                    return classified.name === segment.name;
                });
                
                const totalValue = segmentLeads.reduce((s, l) => s + (l.estimatedValue || 0), 0);
                const expectedValue = totalValue * segment.conversionRate;
                
                return {
                    segment: segment.name,
                    leadCount: segmentLeads.length,
                    totalValue: totalValue,
                    expectedValue: expectedValue,
                    conversionRate: (segment.conversionRate * 100).toFixed(0) + '%',
                    nurturingStrategy: segment.nurturingStrategy,
                    priority: this.getSegmentPriority(segment.name, segmentLeads.length)
                };
            });
            
            const totalLeads = leads.length;
            const totalExpectedValue = pipelineAnalysis.reduce((s, p) => s + p.expectedValue, 0);
            
            return {
                generatedAt: new Date().toISOString(),
                pipeline: pipelineAnalysis,
                summary: {
                    totalLeads: totalLeads,
                    totalExpectedValue: totalExpectedValue,
                    avgConversionRate: (pipelineAnalysis.reduce((s, p) => s + parseFloat(p.conversionRate), 0) / pipelineAnalysis.length).toFixed(0) + '%',
                    hotLeadsCount: pipelineAnalysis.find(p => p.segment === 'Alta Intenção')?.leadCount || 0
                },
                recommendations: this.getPipelineRecommendations(pipelineAnalysis)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de pipeline:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Obtém prioridade do segmento
     */
    getSegmentPriority(segmentName, leadCount) {
        if (segmentName === 'Alta Intenção') return 'CRÍTICA';
        if (segmentName === 'Intenção Moderada' && leadCount > 10) return 'ALTA';
        if (segmentName === 'Intenção Moderada') return 'MÉDIA';
        return 'BAIXA';
    }
    
    /**
     * Obtém recomendações de pipeline
     */
    getPipelineRecommendations(pipeline) {
        const recs = [];
        const highIntent = pipeline.find(p => p.segment === 'Alta Intenção');
        const cold = pipeline.find(p => p.segment === 'Frio');
        
        if (highIntent && highIntent.leadCount > 0) {
            recs.push(`🚨 ${highIntent.leadCount} leads de alta intenção - ação imediata`);
        }
        
        if (cold && cold.leadCount > 50) {
            recs.push(`📊 ${cold.leadCount} leads frios - revisar estratégia de captação`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Pipeline equilibrado - manter estratégias atuais');
        }
        
        return recs;
    }
    
    /**
     * Gera relatório completo de inteligência de leads
     */
    generateLeadIntelligenceFullReport() {
        try {
            const pipeline = this.analyzeLeadPipeline();
            const topLeads = this.intel.identifyHotLeads().slice(0, 5);
            const conversionPredictions = topLeads.map(lead => this.predictAdvancedConversion(lead.id));
            
            return {
                generatedAt: new Date().toISOString(),
                pipelineAnalysis: pipeline,
                topLeads: topLeads.map((lead, idx) => ({
                    name: lead.name,
                    score: lead.score,
                    segment: this.classifyBehavioralSegment(lead).name,
                    predictedLTV: conversionPredictions[idx]?.predictedLTV?.formattedValue || 'N/A',
                    nextAction: conversionPredictions[idx]?.recommendedNextAction || 'N/A'
                })),
                performanceMetrics: {
                    avgScore: this.intel.leads.reduce((s, l) => s + l.score, 0) / this.intel.leads.length,
                    conversionRate: (this.intel.leads.filter(l => l.status === 'converted').length / this.intel.leads.length * 100).toFixed(1) + '%',
                    totalPipelineValue: pipeline.summary.totalExpectedValue,
                    hotLeadsCount: pipeline.summary.hotLeadsCount
                },
                recommendations: pipeline.recommendations
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório de leads:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Renderiza dashboard de inteligência de leads avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateLeadIntelligenceFullReport();
            
            container.innerHTML = `
                <div class="lead-intelligence-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> LEAD INTELLIGENCE EXTENSION - ANÁLISE AVANÇADA</h2><div class="stats-badge">Pipeline: €${(report.performanceMetrics?.totalPipelineValue / 1000 || 0).toFixed(0)}k</div></div>
                    
                    <div class="lead-summary"><div class="summary-card"><div class="summary-value">${report.performanceMetrics?.avgScore?.toFixed(0) || 0}</div><div class="summary-label">Score Médio</div><div class="summary-sub">${report.performanceMetrics?.hotLeadsCount || 0} hot leads</div></div>
                    <div class="summary-card"><div class="summary-value">${report.performanceMetrics?.conversionRate || '0%'}</div><div class="summary-label">Taxa Conversão</div><div class="summary-sub">${report.pipelineAnalysis?.summary?.totalLeads || 0} leads</div></div>
                    <div class="summary-card"><div class="summary-value">€${(report.performanceMetrics?.totalPipelineValue / 1000 || 0).toFixed(0)}k</div><div class="summary-label">Pipeline Valor</div><div class="summary-sub">Esperado</div></div>
                    <div class="summary-card"><div class="summary-value">${report.pipelineAnalysis?.summary?.hotLeadsCount || 0}</div><div class="summary-label">Leads Quentes</div><div class="summary-sub">Prioridade crítica</div></div></div>
                    
                    <div class="pipeline-section"><h3><i class="fas fa-chart-simple"></i> PIPELINE POR SEGMENTO</h3><div class="pipeline-grid">${report.pipelineAnalysis?.pipeline?.map(p => `
                        <div class="pipeline-card priority-${p.priority.toLowerCase()}">
                            <div class="pipeline-header"><strong>${p.segment}</strong><span class="priority-badge">${p.priority}</span></div>
                            <div class="pipeline-stats"><div>📊 Leads: ${p.leadCount}</div><div>💰 Valor: €${(p.totalValue / 1000).toFixed(0)}k</div><div>🎯 Conversão: ${p.conversionRate}</div></div>
                            <div class="pipeline-value"><strong>Valor Esperado:</strong> €${(p.expectedValue / 1000).toFixed(0)}k</div>
                            <div class="pipeline-strategy">Estratégia: ${p.nurturingStrategy}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="top-leads"><h3><i class="fas fa-fire"></i> TOP LEADS</h3><div class="leads-grid">${report.topLeads?.map(l => `
                        <div class="lead-card">
                            <div class="lead-name"><strong>${l.name}</strong><span class="segment-badge">${l.segment}</span></div>
                            <div class="lead-stats"><div>🎯 Score: ${l.score}%</div><div>💰 LTV: ${l.predictedLTV}</div></div>
                            <div class="lead-action">${l.nextAction}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.recommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .lead-intelligence-ext{ padding:0; } .lead-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .pipeline-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .pipeline-card.priority-crítica{ border-left:3px solid #ff1744; } .pipeline-card.priority-alta{ border-left:3px solid #ffc107; } .pipeline-card.priority-média{ border-left:3px solid #00e5ff; } .pipeline-card.priority-baixa{ border-left:3px solid #00e676; } .leads-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; } .lead-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .segment-badge{ background:var(--elite-primary-dim); padding:2px 8px; border-radius:12px; font-size:0.6rem; margin-left:8px; } @media (max-width:768px){ .lead-summary{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.LeadIntelligenceExtensionExtended = new LeadIntelligenceExtensionExtended(window.LeadIntelligence);

console.log('[ELITE] Lead Intelligence Extension Extended carregada - Análise Avançada de Leads Ativa');