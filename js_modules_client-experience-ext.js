/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE CLIENT EXPERIENCE EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Client Portal com funcionalidades adicionais:
 * - Análise de satisfação em tempo real
 * - Previsão de churn (perda de clientes)
 * - Recomendações de engajamento personalizadas
 * - Relatórios de NPS (Net Promoter Score)
 * ============================================================================
 */

class ClientExperienceExtensionExtended {
    constructor(portal) {
        this.portal = portal || window.ClientPortal;
        this.initialized = false;
        this.satisfactionMetrics = new Map();
        this.churnPredictions = new Map();
        this.npsHistory = [];
        
        this.loadSatisfactionMetrics();
        this.loadChurnPredictions();
        this.loadNPSHistory();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.portal) {
                console.warn('[ELITE] Client Portal não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initNPSHistory();
            console.log('[ELITE] Client Experience Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega métricas de satisfação
     */
    loadSatisfactionMetrics() {
        try {
            const stored = localStorage.getItem('elite_satisfaction_metrics');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.satisfactionMetrics.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar métricas de satisfação:', e);
        }
    }
    
    /**
     * Salva métricas de satisfação
     */
    saveSatisfactionMetrics() {
        try {
            const metricsObj = {};
            for (const [key, value] of this.satisfactionMetrics) {
                metricsObj[key] = value;
            }
            localStorage.setItem('elite_satisfaction_metrics', JSON.stringify(metricsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar métricas de satisfação:', e);
        }
    }
    
    /**
     * Carrega previsões de churn
     */
    loadChurnPredictions() {
        try {
            const stored = localStorage.getItem('elite_churn_predictions');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.churnPredictions.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de churn:', e);
        }
    }
    
    /**
     * Salva previsões de churn
     */
    saveChurnPredictions() {
        try {
            const predictionsObj = {};
            for (const [key, value] of this.churnPredictions) {
                predictionsObj[key] = value;
            }
            localStorage.setItem('elite_churn_predictions', JSON.stringify(predictionsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de churn:', e);
        }
    }
    
    /**
     * Carrega histórico de NPS
     */
    loadNPSHistory() {
        try {
            const stored = localStorage.getItem('elite_nps_history');
            if (stored) {
                this.npsHistory = JSON.parse(stored);
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar histórico de NPS:', e);
            this.npsHistory = [];
        }
    }
    
    /**
     * Salva histórico de NPS
     */
    saveNPSHistory() {
        try {
            if (this.npsHistory.length > 100) {
                this.npsHistory = this.npsHistory.slice(0, 100);
            }
            localStorage.setItem('elite_nps_history', JSON.stringify(this.npsHistory));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar histórico de NPS:', e);
        }
    }
    
    /**
     * Inicializa histórico de NPS
     */
    initNPSHistory() {
        if (this.npsHistory.length === 0) {
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
            for (let i = 0; i < months.length; i++) {
                this.npsHistory.push({
                    period: months[i],
                    nps: 45 + Math.random() * 40,
                    respondents: 15 + Math.floor(Math.random() * 25),
                    year: 2024
                });
            }
            this.saveNPSHistory();
        }
    }
    
    /**
     * Analisa satisfação em tempo real
     */
    analyzeRealTimeSatisfaction(clientId) {
        try {
            const client = this.portal.clients.get(clientId);
            if (!client) return null;
            
            const interactions = this.portal.getMessages(clientId);
            const documents = this.portal.getCaseDocuments(clientId);
            const feedback = this.portal.feedback.get(clientId) || [];
            
            const satisfactionScore = this.calculateSatisfactionScore(interactions, documents, feedback);
            const sentiment = this.analyzeSentiment(feedback);
            const engagementScore = this.calculateEngagementScore(interactions, documents);
            
            const metrics = {
                clientId: clientId,
                clientName: client.name,
                satisfactionScore: satisfactionScore,
                satisfactionLevel: this.getSatisfactionLevel(satisfactionScore),
                sentiment: sentiment,
                engagementScore: engagementScore,
                lastInteraction: interactions[0]?.timestamp || client.since,
                recommendations: this.getSatisfactionRecommendations(satisfactionScore, sentiment, engagementScore)
            };
            
            this.satisfactionMetrics.set(clientId, metrics);
            this.saveSatisfactionMetrics();
            
            return metrics;
        } catch (error) {
            console.error('[ELITE] Erro na análise de satisfação:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Calcula score de satisfação
     */
    calculateSatisfactionScore(interactions, documents, feedback) {
        let score = 50;
        
        // Fator interações
        if (interactions.length > 5) score += 10;
        else if (interactions.length > 2) score += 5;
        else if (interactions.length === 0) score -= 10;
        
        // Fator documentos
        if (documents.length > 3) score += 8;
        else if (documents.length > 0) score += 3;
        
        // Fator feedback
        if (feedback.length > 0) {
            const avgRating = feedback.reduce((s, f) => s + (f.rating || 3), 0) / feedback.length;
            score += (avgRating - 3) * 10;
        }
        
        // Fator tempo desde última interação
        const lastInteraction = interactions[0]?.timestamp;
        if (lastInteraction) {
            const daysSince = Math.floor((new Date() - new Date(lastInteraction)) / (1000 * 60 * 60 * 24));
            if (daysSince > 30) score -= 15;
            else if (daysSince > 15) score -= 5;
        }
        
        return Math.min(Math.max(score, 0), 100);
    }
    
    /**
     * Obtém nível de satisfação
     */
    getSatisfactionLevel(score) {
        if (score >= 80) return 'Excelente';
        if (score >= 60) return 'Boa';
        if (score >= 40) return 'Regular';
        return 'Crítica';
    }
    
    /**
     * Analisa sentimento do feedback
     */
    analyzeSentiment(feedback) {
        if (feedback.length === 0) return 'neutro';
        
        const positive = feedback.filter(f => f.rating >= 4).length;
        const negative = feedback.filter(f => f.rating <= 2).length;
        
        if (positive > negative) return 'positivo';
        if (negative > positive) return 'negativo';
        return 'neutro';
    }
    
    /**
     * Calcula score de engajamento
     */
    calculateEngagementScore(interactions, documents) {
        let score = 50;
        score += Math.min(interactions.length * 3, 25);
        score += Math.min(documents.length * 5, 25);
        return Math.min(score, 100);
    }
    
    /**
     * Obtém recomendações de satisfação
     */
    getSatisfactionRecommendations(score, sentiment, engagement) {
        const recs = [];
        
        if (score < 40) {
            recs.push('🚨 Ação urgente: agendar reunião com cliente');
            recs.push('📞 Contato imediato para alinhamento de expectativas');
        } else if (score < 60) {
            recs.push('📋 Follow-up em 7 dias');
            recs.push('📧 Enviar relatório de progresso detalhado');
        } else if (score >= 80) {
            recs.push('✅ Manter estratégia atual');
            recs.push('🎯 Solicitar referência/testemunho');
        }
        
        if (sentiment === 'negativo') {
            recs.push('⚠️ Cliente com feedback negativo - ação prioritária');
        }
        
        if (engagement < 40) {
            recs.push('📢 Reativar comunicação - cliente pouco engajado');
        }
        
        return recs;
    }
    
    /**
     * Prediz churn (perda de cliente)
     */
    predictChurn(clientId) {
        try {
            const metrics = this.satisfactionMetrics.get(clientId);
            if (!metrics) return null;
            
            let churnProbability = 0.2;
            
            // Fatores de risco
            if (metrics.satisfactionScore < 40) churnProbability += 0.4;
            else if (metrics.satisfactionScore < 60) churnProbability += 0.2;
            
            if (metrics.sentiment === 'negativo') churnProbability += 0.25;
            if (metrics.engagementScore < 30) churnProbability += 0.15;
            
            // Fator temporal
            const lastInteraction = new Date(metrics.lastInteraction);
            const daysSinceLast = Math.floor((new Date() - lastInteraction) / (1000 * 60 * 60 * 24));
            if (daysSinceLast > 60) churnProbability += 0.2;
            else if (daysSinceLast > 30) churnProbability += 0.1;
            
            churnProbability = Math.min(churnProbability, 0.95);
            
            const prediction = {
                clientId: clientId,
                clientName: metrics.clientName,
                churnProbability: (churnProbability * 100).toFixed(0) + '%',
                riskLevel: this.getChurnRiskLevel(churnProbability),
                timeToChurn: this.estimateTimeToChurn(churnProbability),
                factors: {
                    satisfactionScore: metrics.satisfactionScore,
                    sentiment: metrics.sentiment,
                    engagementScore: metrics.engagementScore,
                    daysSinceLastInteraction: daysSinceLast
                },
                retentionActions: this.getRetentionActions(churnProbability, metrics)
            };
            
            this.churnPredictions.set(clientId, prediction);
            this.saveChurnPredictions();
            
            return prediction;
        } catch (error) {
            console.error('[ELITE] Erro na previsão de churn:', error);
            return { error: true, message: 'Erro na previsão' };
        }
    }
    
    /**
     * Obtém nível de risco de churn
     */
    getChurnRiskLevel(probability) {
        if (probability > 0.7) return 'CRÍTICO';
        if (probability > 0.4) return 'ALTO';
        if (probability > 0.2) return 'MODERADO';
        return 'BAIXO';
    }
    
    /**
     * Estima tempo até churn
     */
    estimateTimeToChurn(probability) {
        if (probability > 0.7) return '30-60 dias';
        if (probability > 0.4) return '3-6 meses';
        if (probability > 0.2) return '6-12 meses';
        return '> 12 meses';
    }
    
    /**
     * Obtém ações de retenção
     */
    getRetentionActions(probability, metrics) {
        const actions = [];
        
        if (probability > 0.7) {
            actions.push('🚨 Plano de recuperação urgente');
            actions.push('Reunião com sócio responsável');
            actions.push('Proposta de benefício especial');
        } else if (probability > 0.4) {
            actions.push('📋 Follow-up em 15 dias');
            actions.push('Enviar relatório de progresso');
            actions.push('Oferecer call de alinhamento');
        } else {
            actions.push('✅ Monitoramento regular');
            actions.push('Solicitar feedback periódico');
        }
        
        return actions;
    }
    
    /**
     * Calcula Net Promoter Score (NPS)
     */
    calculateNPS() {
        try {
            const clients = Array.from(this.portal.clients.values());
            const satisfactions = [];
            
            for (const client of clients) {
                const metrics = this.analyzeRealTimeSatisfaction(client.id);
                if (metrics) {
                    satisfactions.push(metrics.satisfactionScore);
                }
            }
            
            const promoters = satisfactions.filter(s => s >= 80).length;
            const detractors = satisfactions.filter(s => s < 40).length;
            const total = satisfactions.length;
            
            const nps = total > 0 ? ((promoters - detractors) / total * 100) : 0;
            
            const npsRecord = {
                date: new Date().toISOString(),
                nps: nps.toFixed(1),
                promoters: promoters,
                detractors: detractors,
                total: total,
                classification: this.getNPSClassification(nps)
            };
            
            this.npsHistory.unshift(npsRecord);
            this.saveNPSHistory();
            
            return npsRecord;
        } catch (error) {
            console.error('[ELITE] Erro no cálculo de NPS:', error);
            return { error: true, message: 'Erro no cálculo' };
        }
    }
    
    /**
     * Obtém classificação NPS
     */
    getNPSClassification(nps) {
        if (nps > 75) return 'Excelente';
        if (nps > 50) return 'Bom';
        if (nps > 0) return 'Regular';
        return 'Crítico';
    }
    
    /**
     * Gera relatório de experiência do cliente
     */
    generateExperienceReport() {
        try {
            const nps = this.calculateNPS();
            const clients = Array.from(this.portal.clients.values());
            const satisfactionScores = [];
            
            for (const client of clients) {
                const metrics = this.analyzeRealTimeSatisfaction(client.id);
                if (metrics) {
                    satisfactionScores.push(metrics);
                }
            }
            
            const avgSatisfaction = satisfactionScores.reduce((s, m) => s + m.satisfactionScore, 0) / satisfactionScores.length;
            const atRiskClients = satisfactionScores.filter(m => m.satisfactionScore < 40);
            
            return {
                generatedAt: new Date().toISOString(),
                nps: nps,
                overallSatisfaction: avgSatisfaction.toFixed(1),
                clientDistribution: {
                    excelente: satisfactionScores.filter(m => m.satisfactionScore >= 80).length,
                    boa: satisfactionScores.filter(m => m.satisfactionScore >= 60 && m.satisfactionScore < 80).length,
                    regular: satisfactionScores.filter(m => m.satisfactionScore >= 40 && m.satisfactionScore < 60).length,
                    critica: satisfactionScores.filter(m => m.satisfactionScore < 40).length
                },
                atRiskClients: atRiskClients.map(c => ({
                    name: c.clientName,
                    score: c.satisfactionScore,
                    recommendations: c.recommendations
                })),
                recommendations: this.getExperienceRecommendations(nps, avgSatisfaction, atRiskClients.length),
                npsHistory: this.npsHistory.slice(0, 6)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório de experiência:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Obtém recomendações de experiência
     */
    getExperienceRecommendations(nps, avgSatisfaction, atRiskCount) {
        const recs = [];
        
        if (nps.nps < 0) {
            recs.push('🚨 NPS crítico - revisão urgente da estratégia de relacionamento');
        } else if (nps.nps < 50) {
            recs.push('📊 NPS moderado - identificar pontos de melhoria');
        }
        
        if (atRiskCount > 0) {
            recs.push(`⚠️ ${atRiskCount} cliente(s) em risco - ação prioritária`);
        }
        
        if (avgSatisfaction < 60) {
            recs.push('📉 Satisfação abaixo do esperado - revisar processos de atendimento');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Experiência do cliente saudável - manter estratégia');
        }
        
        return recs;
    }
    
    /**
     * Renderiza dashboard de experiência do cliente avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateExperienceReport();
            
            container.innerHTML = `
                <div class="client-experience-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-smile"></i> CLIENT EXPERIENCE EXTENSION - ANÁLISE AVANÇADA</h2><div class="nps-badge nps-${report.nps?.classification?.toLowerCase() || 'regular'}">NPS: ${report.nps?.nps || 'N/A'}</div></div>
                    
                    <div class="experience-summary"><div class="summary-card"><div class="summary-value">${report.overallSatisfaction || 'N/A'}</div><div class="summary-label">Satisfação Média</div><div class="summary-sub">${report.clientDistribution?.excelente || 0} excelentes</div></div>
                    <div class="summary-card"><div class="summary-value">${report.nps?.promoters || 0}</div><div class="summary-label">Promotores</div><div class="summary-sub">NPS ${report.nps?.nps || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.nps?.detractors || 0}</div><div class="summary-label">Detratores</div><div class="summary-sub">${report.atRiskClients?.length || 0} em risco</div></div>
                    <div class="summary-card"><div class="summary-value">${report.clientDistribution?.critica || 0}</div><div class="summary-label">Clientes Críticos</div><div class="summary-sub">Ação prioritária</div></div></div>
                    
                    <div class="distribution-section"><h3><i class="fas fa-chart-pie"></i> DISTRIBUIÇÃO DE SATISFAÇÃO</h3><div class="distribution-grid"><div class="dist-card excellent"><div class="dist-value">${report.clientDistribution?.excelente || 0}</div><div class="dist-label">Excelente (80-100)</div></div>
                    <div class="dist-card good"><div class="dist-value">${report.clientDistribution?.boa || 0}</div><div class="dist-label">Boa (60-79)</div></div>
                    <div class="dist-card regular"><div class="dist-value">${report.clientDistribution?.regular || 0}</div><div class="dist-label">Regular (40-59)</div></div>
                    <div class="dist-card critical"><div class="dist-value">${report.clientDistribution?.critica || 0}</div><div class="dist-label">Crítica (<40)</div></div></div></div>
                    
                    <div class="at-risk-section"><h3><i class="fas fa-exclamation-triangle"></i> CLIENTES EM RISCO</h3><div class="risk-grid">${report.atRiskClients?.slice(0, 5).map(c => `
                        <div class="risk-card">
                            <div class="risk-header"><strong>${c.name}</strong><span class="risk-score">${c.score}%</span></div>
                            <div class="risk-recommendations"><strong>Ações:</strong><ul>${c.recommendations?.slice(0, 2).map(r => `<li>${r}</li>`).join('')}</ul></div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="nps-history"><h3><i class="fas fa-chart-line"></i> EVOLUÇÃO DO NPS</h3><div class="history-grid">${report.npsHistory?.map(h => `
                        <div class="history-card">
                            <div class="history-period">${h.period} ${h.year || '2024'}</div>
                            <div class="history-nps">${h.nps}</div>
                            <div class="history-detail">${h.promoters} prom / ${h.detractors} detr</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.recommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .client-experience-ext{ padding:0; } .nps-badge{ padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; } .nps-excelente{ border-left:3px solid #00e676; color:#00e676; background:rgba(0,230,118,0.1); } .nps-bom{ border-left:3px solid #00e5ff; color:#00e5ff; background:rgba(0,229,255,0.1); } .nps-regular{ border-left:3px solid #ffc107; color:#ffc107; background:rgba(255,193,7,0.1); } .nps-crítico{ border-left:3px solid #ff1744; color:#ff1744; background:rgba(255,23,68,0.1); } .experience-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .distribution-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; } .dist-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } .dist-card.excellent{ border-left:3px solid #00e676; } .dist-card.good{ border-left:3px solid #00e5ff; } .dist-card.regular{ border-left:3px solid #ffc107; } .dist-card.critical{ border-left:3px solid #ff1744; } .risk-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-bottom:24px; } .risk-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .risk-header{ display:flex; justify-content:space-between; margin-bottom:12px; } .risk-score{ background:var(--elite-primary-dim); padding:2px 8px; border-radius:12px; font-size:0.6rem; } .history-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); gap:12px; margin-bottom:24px; } .history-card{ background:var(--bg-terminal); border-radius:8px; padding:12px; text-align:center; } .history-nps{ font-size:1.2rem; font-weight:bold; color:var(--elite-primary); } @media (max-width:768px){ .experience-summary{ grid-template-columns:1fr 1fr; } .distribution-grid{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.ClientExperienceExtensionExtended = new ClientExperienceExtensionExtended(window.ClientPortal);

console.log('[ELITE] Client Experience Extension Extended carregada - Análise Avançada de Satisfação Ativa');