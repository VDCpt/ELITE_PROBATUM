/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE BLACK SWAN EXTENSION
 * ============================================================================
 * Extensão do Black Swan Predictor com funcionalidades adicionais:
 * - Análise de cenários de stress extremo
 * - Simulação de eventos catastróficos
 * - Previsão de impacto regulatório
 * - Análise de correlação entre variáveis de risco
 * ============================================================================
 */

class BlackSwanExtension {
    constructor(predictor) {
        this.predictor = predictor || window.BlackSwan;
        this.initialized = false;
        this.stressScenarios = [];
        this.correlationMatrix = new Map();
        
        this.loadStressScenarios();
        this.loadCorrelationMatrix();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.predictor) {
                console.warn('[ELITE] Black Swan Predictor não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initStressScenarios();
            console.log('[ELITE] Black Swan Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega cenários de stress
     */
    loadStressScenarios() {
        try {
            const stored = localStorage.getItem('elite_stress_scenarios');
            if (stored) {
                this.stressScenarios = JSON.parse(stored);
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar cenários de stress:', e);
        }
    }
    
    /**
     * Inicializa cenários de stress de demonstração
     */
    initStressScenarios() {
        if (this.stressScenarios.length === 0) {
            this.stressScenarios = [
                {
                    id: 'STRESS_001',
                    name: 'Crise Económica Severa',
                    description: 'Recessão económica profunda com impacto na capacidade de pagamento',
                    impact: 0.35,
                    probability: 0.08,
                    affectedFactors: ['settlementRate', 'litigationVolume'],
                    mitigation: 'Reforçar garantias e acelerar execuções'
                },
                {
                    id: 'STRESS_002',
                    name: 'Mudança Legislativa Adversa',
                    description: 'Alteração legislativa que prejudica teses jurídicas',
                    impact: 0.45,
                    probability: 0.12,
                    affectedFactors: ['successRate', 'appealSuccess'],
                    mitigation: 'Acompanhar processo legislativo e preparar argumentação alternativa'
                },
                {
                    id: 'STRESS_003',
                    name: 'Decisão Judicial Vinculativa Desfavorável',
                    description: 'Acórdão do STA com efeitos vinculativos contrários à tese',
                    impact: 0.55,
                    probability: 0.05,
                    affectedFactors: ['successRate', 'appealSuccess'],
                    mitigation: 'Diferenciar factualmente os casos ou recorrer ao TC'
                },
                {
                    id: 'STRESS_004',
                    name: 'Falência de Plataforma Digital',
                    description: 'Insolvência da plataforma com impacto em créditos',
                    impact: 0.70,
                    probability: 0.03,
                    affectedFactors: ['recoveryRate', 'settlementRate'],
                    mitigation: 'Garantir privilégios creditórios e acelerar ações'
                }
            ];
            this.saveStressScenarios();
        }
    }
    
    /**
     * Salva cenários de stress
     */
    saveStressScenarios() {
        try {
            localStorage.setItem('elite_stress_scenarios', JSON.stringify(this.stressScenarios));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar cenários de stress:', e);
        }
    }
    
    /**
     * Carrega matriz de correlação
     */
    loadCorrelationMatrix() {
        try {
            const stored = localStorage.getItem('elite_correlation_matrix');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.correlationMatrix.set(key, value);
                }
            } else {
                this.initCorrelationMatrix();
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar matriz de correlação:', e);
            this.initCorrelationMatrix();
        }
    }
    
    /**
     * Inicializa matriz de correlação
     */
    initCorrelationMatrix() {
        const factors = ['judicialRisk', 'legislativeRisk', 'economicRisk', 'reputationalRisk'];
        for (const factor of factors) {
            const correlations = {};
            for (const other of factors) {
                if (factor === other) correlations[other] = 1.0;
                else if (factor === 'judicialRisk' && other === 'legislativeRisk') correlations[other] = 0.65;
                else if (factor === 'judicialRisk' && other === 'economicRisk') correlations[other] = 0.25;
                else if (factor === 'judicialRisk' && other === 'reputationalRisk') correlations[other] = 0.45;
                else if (factor === 'legislativeRisk' && other === 'economicRisk') correlations[other] = 0.35;
                else if (factor === 'legislativeRisk' && other === 'reputationalRisk') correlations[other] = 0.55;
                else if (factor === 'economicRisk' && other === 'reputationalRisk') correlations[other] = 0.40;
                else correlations[other] = 0.15;
            }
            this.correlationMatrix.set(factor, correlations);
        }
        this.saveCorrelationMatrix();
    }
    
    /**
     * Salva matriz de correlação
     */
    saveCorrelationMatrix() {
        try {
            const matrixObj = {};
            for (const [key, value] of this.correlationMatrix) {
                matrixObj[key] = value;
            }
            localStorage.setItem('elite_correlation_matrix', JSON.stringify(matrixObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar matriz de correlação:', e);
        }
    }
    
    /**
     * Analisa cenários de stress extremo
     */
    analyzeStressScenario(caseData, scenarioId = null) {
        try {
            let scenarios = this.stressScenarios;
            if (scenarioId) {
                scenarios = this.stressScenarios.filter(s => s.id === scenarioId);
            }
            
            const results = [];
            const baseSimulation = this.predictor.calculateLegalVaR(caseData.value, caseData.successProbability / 100);
            
            for (const scenario of scenarios) {
                const adjustedSuccessProb = caseData.successProbability / 100 * (1 - scenario.impact);
                const stressSimulation = this.predictor.calculateLegalVaR(caseData.value, adjustedSuccessProb, {
                    judicialVolatility: 0.25 + scenario.impact * 0.3,
                    legislativeRisk: 0.15 + scenario.impact * 0.2
                });
                
                results.push({
                    scenario: scenario.name,
                    description: scenario.description,
                    impact: (scenario.impact * 100).toFixed(0) + '%',
                    probability: (scenario.probability * 100).toFixed(1) + '%',
                    baseVaR: baseSimulation.riskMetrics?.valueAtRisk?.var95_formatted || '€0',
                    stressVaR: stressSimulation.riskMetrics?.valueAtRisk?.var95_formatted || '€0',
                    varIncrease: this.calculateVarIncrease(baseSimulation, stressSimulation),
                    recommendedMitigation: scenario.mitigation,
                    riskLevel: scenario.impact > 0.5 ? 'CRÍTICO' : scenario.impact > 0.3 ? 'ALTO' : 'MODERADO'
                });
            }
            
            return {
                caseId: caseData.id,
                analyzedAt: new Date().toISOString(),
                scenarios: results,
                worstCaseScenario: results.reduce((worst, r) => {
                    const impact = parseFloat(r.impact);
                    return impact > (worst?.impact || 0) ? r : worst;
                }, null),
                overallRecommendation: this.getStressRecommendation(results)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de stress:', error);
            return null;
        }
    }
    
    /**
     * Calcula aumento do VaR
     */
    calculateVarIncrease(baseSim, stressSim) {
        const baseVar = Math.abs(baseSim.riskMetrics?.valueAtRisk?.var95 || 0);
        const stressVar = Math.abs(stressSim.riskMetrics?.valueAtRisk?.var95 || 0);
        if (baseVar === 0) return '+0%';
        const increase = ((stressVar - baseVar) / baseVar) * 100;
        return (increase > 0 ? '+' : '') + increase.toFixed(0) + '%';
    }
    
    /**
     * Obtém recomendação de stress
     */
    getStressRecommendation(results) {
        const criticalScenarios = results.filter(r => r.riskLevel === 'CRÍTICO');
        const highScenarios = results.filter(r => r.riskLevel === 'ALTO');
        
        if (criticalScenarios.length > 0) {
            return `ATENÇÃO CRÍTICA: ${criticalScenarios.length} cenário(s) de risco extremo identificado(s). Mitigação prioritária: ${criticalScenarios[0].recommendedMitigation}`;
        } else if (highScenarios.length > 0) {
            return `Risco ELEVADO: ${highScenarios.length} cenário(s) com impacto significativo. Recomenda-se plano de contingência para: ${highScenarios.map(s => s.scenario).join(', ')}`;
        } else {
            return `Risco MODERADO: Cenários de stress dentro dos parâmetros esperados. Manter monitorização regular.`;
        }
    }
    
    /**
     * Simula eventos de Cisne Negro correlacionados
     */
    simulateCorrelatedEvents(caseData, maxEvents = 3) {
        try {
            const scenarios = [...this.stressScenarios];
            const shuffled = scenarios.sort(() => 0.5 - Math.random());
            const selectedEvents = shuffled.slice(0, maxEvents);
            
            let totalImpact = 0;
            let combinedProbability = 1;
            
            for (const event of selectedEvents) {
                totalImpact += event.impact;
                combinedProbability *= event.probability;
            }
            
            totalImpact = Math.min(totalImpact, 0.85);
            const adjustedSuccessProb = Math.max(caseData.successProbability / 100 * (1 - totalImpact), 0.05);
            
            const simulation = this.predictor.calculateLegalVaR(caseData.value, adjustedSuccessProb, {
                judicialVolatility: 0.35,
                legislativeRisk: 0.25
            });
            
            return {
                simulationId: Date.now(),
                caseId: caseData.id,
                events: selectedEvents.map(e => ({ name: e.name, impact: e.impact, probability: e.probability })),
                combinedImpact: (totalImpact * 100).toFixed(0) + '%',
                combinedProbability: (combinedProbability * 100).toFixed(4) + '%',
                adjustedVaR: simulation.riskMetrics?.valueAtRisk?.var95_formatted || '€0',
                expectedShortfall: simulation.riskMetrics?.expectedShortfallFormatted || '€0',
                recommendation: totalImpact > 0.6 ? 'REVISÃO ESTRATÉGICA URGENTE' : 'PREPARAR PLANO DE CONTINGÊNCIA'
            };
        } catch (error) {
            console.error('[ELITE] Erro na simulação de eventos correlacionados:', error);
            return null;
        }
    }
    
    /**
     * Analisa correlação entre fatores de risco
     */
    analyzeRiskCorrelation(factors) {
        try {
            const correlations = [];
            for (let i = 0; i < factors.length; i++) {
                for (let j = i + 1; j < factors.length; j++) {
                    const factor1 = factors[i];
                    const factor2 = factors[j];
                    const correlation = this.correlationMatrix.get(factor1)?.[factor2] || 0.15;
                    correlations.push({
                        factor1: factor1,
                        factor2: factor2,
                        correlation: correlation,
                        interpretation: this.getCorrelationInterpretation(correlation),
                        recommendation: this.getCorrelationRecommendation(factor1, factor2, correlation)
                    });
                }
            }
            return {
                analyzedAt: new Date().toISOString(),
                factors: factors,
                correlations: correlations,
                highestCorrelation: correlations.reduce((highest, c) => c.correlation > (highest?.correlation || 0) ? c : highest, null),
                summary: this.getCorrelationSummary(correlations)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de correlação:', error);
            return null;
        }
    }
    
    /**
     * Obtém interpretação da correlação
     */
    getCorrelationInterpretation(correlation) {
        if (correlation > 0.7) return 'Correlação muito forte';
        if (correlation > 0.5) return 'Correlação forte';
        if (correlation > 0.3) return 'Correlação moderada';
        if (correlation > 0.1) return 'Correlação fraca';
        return 'Correlação desprezível';
    }
    
    /**
     * Obtém recomendação baseada na correlação
     */
    getCorrelationRecommendation(factor1, factor2, correlation) {
        if (correlation > 0.6) {
            return `Alta correlação entre ${factor1} e ${factor2}. Mitigar ambos em conjunto.`;
        } else if (correlation > 0.4) {
            return `Correlação moderada entre ${factor1} e ${factor2}. Considerar impacto conjunto.`;
        }
        return `Baixa correlação entre ${factor1} e ${factor2}. Mitigar separadamente.`;
    }
    
    /**
     * Obtém sumário de correlação
     */
    getCorrelationSummary(correlations) {
        const strongCorrelations = correlations.filter(c => c.correlation > 0.5);
        if (strongCorrelations.length > 0) {
            return `Identificadas ${strongCorrelations.length} correlações fortes. Atenção especial à relação entre ${strongCorrelations[0].factor1} e ${strongCorrelations[0].factor2}.`;
        }
        return 'Fatores de risco com baixa correlação entre si. Mitigar individualmente.';
    }
    
    /**
     * Previsão de impacto regulatório
     */
    predictRegulatoryImpact(regulation, caseData) {
        try {
            const regulatoryRisks = {
                'DAC7': { impact: 0.25, affected: ['tax', 'platform'], probability: 0.15 },
                'RGPD': { impact: 0.18, affected: ['data', 'privacy'], probability: 0.22 },
                'Lei dos Motoristas': { impact: 0.32, affected: ['labor', 'platform'], probability: 0.28 },
                'Alteração RGIT': { impact: 0.22, affected: ['tax', 'criminal'], probability: 0.18 }
            };
            
            const risk = regulatoryRisks[regulation] || { impact: 0.15, affected: ['general'], probability: 0.1 };
            const isAffected = risk.affected.includes(caseData.category) || risk.affected.includes('general');
            
            const adjustedProbability = isAffected ? caseData.successProbability / 100 * (1 - risk.impact) : caseData.successProbability / 100;
            const probabilityDelta = ((adjustedProbability - caseData.successProbability / 100) * 100).toFixed(1);
            
            return {
                regulation: regulation,
                impact: (risk.impact * 100).toFixed(0) + '%',
                probability: (risk.probability * 100).toFixed(1) + '%',
                affectsCase: isAffected,
                currentSuccessRate: (caseData.successProbability).toFixed(0) + '%',
                adjustedSuccessRate: (adjustedProbability * 100).toFixed(0) + '%',
                delta: (probabilityDelta > 0 ? '+' : '') + probabilityDelta + '%',
                recommendation: isAffected ? 
                    `Preparar argumentação específica para ${regulation} - impacto estimado de ${(risk.impact * 100).toFixed(0)}%` : 
                    `Regulamentação ${regulation} não afeta diretamente este caso`
            };
        } catch (error) {
            console.error('[ELITE] Erro na previsão de impacto regulatório:', error);
            return null;
        }
    }
    
    /**
     * Gera relatório de resiliência
     */
    generateResilienceReport(caseData) {
        try {
            const stressAnalysis = this.analyzeStressScenario(caseData);
            const correlatedEvents = this.simulateCorrelatedEvents(caseData, 2);
            const regulatoryImpacts = ['DAC7', 'RGPD', 'Lei dos Motoristas', 'Alteração RGIT'].map(reg => 
                this.predictRegulatoryImpact(reg, caseData)
            ).filter(r => r);
            
            const resilienceScore = this.calculateResilienceScore(stressAnalysis, correlatedEvents);
            
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                resilienceScore: resilienceScore.score,
                resilienceClassification: resilienceScore.classification,
                stressAnalysis: stressAnalysis,
                correlatedEvents: correlatedEvents,
                regulatoryImpacts: regulatoryImpacts,
                recommendations: this.getResilienceRecommendations(stressAnalysis, regulatoryImpacts),
                contingencyPlan: this.generateContingencyPlan(stressAnalysis)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório de resiliência:', error);
            return null;
        }
    }
    
    /**
     * Calcula score de resiliência
     */
    calculateResilienceScore(stressAnalysis, correlatedEvents) {
        let score = 75;
        
        if (stressAnalysis && stressAnalysis.scenarios) {
            const criticalCount = stressAnalysis.scenarios.filter(s => s.riskLevel === 'CRÍTICO').length;
            const highCount = stressAnalysis.scenarios.filter(s => s.riskLevel === 'ALTO').length;
            score -= criticalCount * 15;
            score -= highCount * 8;
        }
        
        if (correlatedEvents && correlatedEvents.combinedImpact) {
            const impact = parseFloat(correlatedEvents.combinedImpact);
            if (impact > 50) score -= 20;
            else if (impact > 30) score -= 10;
        }
        
        score = Math.max(Math.min(score, 100), 0);
        
        let classification = '';
        if (score >= 80) classification = 'Excelente';
        else if (score >= 60) classification = 'Boa';
        else if (score >= 40) classification = 'Moderada';
        else classification = 'Crítica';
        
        return { score: score.toFixed(0), classification: classification };
    }
    
    /**
     * Obtém recomendações de resiliência
     */
    getResilienceRecommendations(stressAnalysis, regulatoryImpacts) {
        const recs = [];
        
        if (stressAnalysis && stressAnalysis.scenarios) {
            const criticalScenarios = stressAnalysis.scenarios.filter(s => s.riskLevel === 'CRÍTICO');
            for (const scenario of criticalScenarios) {
                recs.push(`🔴 Mitigar cenário crítico: ${scenario.scenario} - ${scenario.recommendedMitigation}`);
            }
        }
        
        const highRegulatoryImpacts = regulatoryImpacts.filter(r => r && r.affectsCase && parseFloat(r.impact) > 20);
        for (const reg of highRegulatoryImpacts) {
            recs.push(`📜 Preparar para impacto regulatório: ${reg.regulation} - ${reg.recommendation}`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Caso com boa resiliência a eventos de Cisne Negro. Manter monitorização regular.');
        }
        
        return recs;
    }
    
    /**
     * Gera plano de contingência
     */
    generateContingencyPlan(stressAnalysis) {
        const criticalScenarios = stressAnalysis?.scenarios?.filter(s => s.riskLevel === 'CRÍTICO') || [];
        
        return {
            immediateActions: criticalScenarios.length > 0 ? [
                'Reunião extraordinária da equipa de litígio',
                'Revisão da estratégia probatória',
                'Consulta a especialista externo'
            ] : [
                'Monitorização regular de jurisprudência',
                'Atualização de precedentes relevantes'
            ],
            shortTermActions: [
                'Reforço de prova documental',
                'Preparação de argumentação alternativa',
                'Análise de viabilidade de acordo'
            ],
            longTermActions: [
                'Diversificação de teses jurídicas',
                'Expansão de fontes probatórias',
                'Capacitação da equipa em análise de risco'
            ],
            responsibleTeam: 'Equipa de Litígio Estratégico',
            reviewPeriod: criticalScenarios.length > 0 ? '7 dias' : '30 dias'
        };
    }
    
    /**
     * Renderiza dashboard de análise de risco avançada
     */
    renderDashboard(containerId, caseData) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const resilienceReport = this.generateResilienceReport(caseData);
            const correlationAnalysis = this.analyzeRiskCorrelation(['judicialRisk', 'legislativeRisk', 'economicRisk', 'reputationalRisk']);
            
            container.innerHTML = `
                <div class="black-swan-extension">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> BLACK SWAN EXTENSION - ANÁLISE DE RESILIÊNCIA</h2><div class="resilience-badge resilience-${resilienceReport?.resilienceClassification?.toLowerCase() || 'moderada'}"><i class="fas fa-shield-alt"></i> Resiliência: ${resilienceReport?.resilienceScore || '0'}%</div></div>
                    
                    <div class="resilience-summary"><div class="resilience-card"><div class="resilience-score">${resilienceReport?.resilienceScore || '0'}%</div><div class="resilience-label">Score de Resiliência</div><div class="resilience-class">${resilienceReport?.resilienceClassification || 'Indeterminada'}</div></div>
                    <div class="resilience-card"><div class="resilience-value">${resilienceReport?.stressAnalysis?.scenarios?.length || 0}</div><div class="resilience-label">Cenários de Stress</div><div class="resilience-sub">${resilienceReport?.stressAnalysis?.scenarios?.filter(s => s.riskLevel === 'CRÍTICO').length || 0} críticos</div></div>
                    <div class="resilience-card"><div class="resilience-value">${resilienceReport?.correlatedEvents?.combinedProbability || '0'}%</div><div class="resilience-label">Probabilidade Correlacionada</div><div class="resilience-sub">Impacto: ${resilienceReport?.correlatedEvents?.combinedImpact || '0%'}</div></div></div>
                    
                    <div class="stress-scenarios"><h3><i class="fas fa-chart-simple"></i> CENÁRIOS DE STRESS EXTREMO</h3><div class="scenarios-grid">${resilienceReport?.stressAnalysis?.scenarios?.map(s => `
                        <div class="scenario-card risk-${s.riskLevel.toLowerCase()}">
                            <div class="scenario-header"><strong>${s.scenario}</strong><span class="risk-level">${s.riskLevel}</span></div>
                            <div class="scenario-desc">${s.description}</div>
                            <div class="scenario-metrics"><div>Impacto: ${s.impact}</div><div>Probabilidade: ${s.probability}</div></div>
                            <div class="scenario-var"><div>VaR Base: ${s.baseVaR}</div><div>VaR Stress: ${s.stressVaR}</div><div class="var-change ${s.varIncrease.includes('+') ? 'negative' : 'positive'}">${s.varIncrease}</div></div>
                            <div class="scenario-mitigation"><strong>Mitigação:</strong> ${s.recommendedMitigation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="correlation-section"><h3><i class="fas fa-link"></i> ANÁLISE DE CORRELAÇÃO DE RISCOS</h3><div class="correlation-grid">${correlationAnalysis?.correlations?.map(c => `
                        <div class="correlation-card">
                            <div class="correlation-factors">${c.factor1} ↔ ${c.factor2}</div>
                            <div class="correlation-value" style="width: ${c.correlation * 100}%">${(c.correlation * 100).toFixed(0)}%</div>
                            <div class="correlation-interpretation">${c.interpretation}</div>
                            <div class="correlation-recommendation">💡 ${c.recommendation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="regulatory-impacts"><h3><i class="fas fa-gavel"></i> IMPACTO REGULATÓRIO</h3><div class="regulatory-grid">${resilienceReport?.regulatoryImpacts?.map(r => `
                        <div class="regulatory-card ${r.affectsCase ? 'affected' : ''}">
                            <div class="regulatory-name"><strong>${r.regulation}</strong><span class="impact-badge">Impacto: ${r.impact}</span></div>
                            <div class="regulatory-stats"><div>Probabilidade: ${r.probability}</div><div>Sucesso Atual: ${r.currentSuccessRate}</div><div>Sucesso Ajustado: ${r.adjustedSuccessRate}</div><div class="delta ${r.delta.includes('+') ? 'positive' : 'negative'}">Δ ${r.delta}</div></div>
                            <div class="regulatory-recommendation">${r.recommendation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="contingency-plan"><h3><i class="fas fa-file-alt"></i> PLANO DE CONTINGÊNCIA</h3><div class="plan-card"><div class="plan-section"><strong>Ações Imediatas:</strong><ul>${resilienceReport?.contingencyPlan?.immediateActions?.map(a => `<li>${a}</li>`).join('')}</ul></div>
                    <div class="plan-section"><strong>Ações Curto Prazo:</strong><ul>${resilienceReport?.contingencyPlan?.shortTermActions?.map(a => `<li>${a}</li>`).join('')}</ul></div>
                    <div class="plan-section"><strong>Ações Longo Prazo:</strong><ul>${resilienceReport?.contingencyPlan?.longTermActions?.map(a => `<li>${a}</li>`).join('')}</ul></div>
                    <div class="plan-footer"><div>Equipa Responsável: ${resilienceReport?.contingencyPlan?.responsibleTeam}</div><div>Revisão: ${resilienceReport?.contingencyPlan?.reviewPeriod}</div></div></div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${resilienceReport?.recommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .black-swan-extension{ padding:0; } .resilience-badge{ background:var(--bg-terminal); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; } .resilience-excelente{ border-left:3px solid #00e676; color:#00e676; } .resilience-boa{ border-left:3px solid #00e5ff; color:#00e5ff; } .resilience-moderada{ border-left:3px solid #ffc107; color:#ffc107; } .resilience-crítica{ border-left:3px solid #ff1744; color:#ff1744; } .resilience-summary{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; } .resilience-card{ background:var(--bg-command); border-radius:16px; padding:20px; text-align:center; } .resilience-score{ font-size:2rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); } .resilience-value{ font-size:1.8rem; font-weight:800; color:var(--elite-primary); } .scenarios-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; margin-bottom:24px; } .scenario-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border-left:3px solid; } .scenario-card.risk-crítico{ border-left-color:#ff1744; } .scenario-card.risk-alto{ border-left-color:#ffc107; } .scenario-card.risk-moderado{ border-left-color:#00e5ff; } .scenario-header{ display:flex; justify-content:space-between; margin-bottom:8px; } .risk-level{ font-size:0.6rem; padding:2px 8px; border-radius:12px; background:rgba(255,23,68,0.1); color:#ff1744; } .scenario-var{ display:flex; justify-content:space-between; font-size:0.7rem; margin:8px 0; } .var-change.negative{ color:#ff1744; } .var-change.positive{ color:#00e676; } .correlation-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .correlation-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .correlation-value{ height:8px; background:linear-gradient(90deg,#00e5ff,#ff1744); border-radius:4px; margin:12px 0; } .regulatory-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .regulatory-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .regulatory-card.affected{ border-left:3px solid #ffc107; } .impact-badge{ background:rgba(0,229,255,0.1); padding:2px 8px; border-radius:12px; font-size:0.6rem; margin-left:8px; } .delta.positive{ color:#00e676; } .delta.negative{ color:#ff1744; } .plan-card{ background:var(--bg-terminal); border-radius:12px; padding:20px; } .plan-section{ margin-bottom:16px; } .plan-section ul{ margin:8px 0 0 20px; font-size:0.7rem; color:#94a3b8; } .plan-footer{ display:flex; justify-content:space-between; margin-top:16px; padding-top:12px; border-top:1px solid var(--border-tactic); font-size:0.7rem; } .recommendations-list ul{ margin:0 0 0 20px; font-size:0.75rem; color:#94a3b8; } @media (max-width:768px){ .resilience-summary{ grid-template-columns:1fr; } .scenarios-grid{ grid-template-columns:1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.BlackSwanExtension = new BlackSwanExtension(window.BlackSwan);

console.log('[ELITE] Black Swan Extension carregada - Análise de Resiliência Ativa');