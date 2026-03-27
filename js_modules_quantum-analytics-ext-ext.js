/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE QUANTUM ANALYTICS EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Quantum Legal Analytics com funcionalidades adicionais:
 * - Análise de sensibilidade de variáveis
 * - Simulação de Monte Carlo avançada
 * - Otimização multi-objetivo
 * - Previsão de cenários extremos
 * ============================================================================
 */

class QuantumAnalyticsExtensionExtended {
    constructor(analytics) {
        this.analytics = analytics || window.QuantumLegalAnalytics;
        this.initialized = false;
        this.sensitivityAnalysis = new Map();
        this.monteCarloAdvanced = new Map();
        this.multiObjectiveResults = new Map();
        
        this.loadSensitivityAnalysis();
        this.loadMonteCarloAdvanced();
        this.loadMultiObjectiveResults();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.analytics) {
                console.warn('[ELITE] Quantum Legal Analytics não disponível para extensão');
                return false;
            }
            this.initialized = true;
            console.log('[ELITE] Quantum Analytics Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega análise de sensibilidade
     */
    loadSensitivityAnalysis() {
        try {
            const stored = localStorage.getItem('elite_sensitivity_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.sensitivityAnalysis.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar análise de sensibilidade:', e);
        }
    }
    
    /**
     * Salva análise de sensibilidade
     */
    saveSensitivityAnalysis() {
        try {
            const analysisObj = {};
            for (const [key, value] of this.sensitivityAnalysis) {
                analysisObj[key] = value;
            }
            localStorage.setItem('elite_sensitivity_analysis', JSON.stringify(analysisObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar análise de sensibilidade:', e);
        }
    }
    
    /**
     * Carrega Monte Carlo avançado
     */
    loadMonteCarloAdvanced() {
        try {
            const stored = localStorage.getItem('elite_montecarlo_advanced');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.monteCarloAdvanced.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar Monte Carlo avançado:', e);
        }
    }
    
    /**
     * Salva Monte Carlo avançado
     */
    saveMonteCarloAdvanced() {
        try {
            const mcObj = {};
            for (const [key, value] of this.monteCarloAdvanced) {
                mcObj[key] = value;
            }
            localStorage.setItem('elite_montecarlo_advanced', JSON.stringify(mcObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar Monte Carlo avançado:', e);
        }
    }
    
    /**
     * Carrega resultados multi-objetivo
     */
    loadMultiObjectiveResults() {
        try {
            const stored = localStorage.getItem('elite_multiobjective_results');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.multiObjectiveResults.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar resultados multi-objetivo:', e);
        }
    }
    
    /**
     * Salva resultados multi-objetivo
     */
    saveMultiObjectiveResults() {
        try {
            const resultsObj = {};
            for (const [key, value] of this.multiObjectiveResults) {
                resultsObj[key] = value;
            }
            localStorage.setItem('elite_multiobjective_results', JSON.stringify(resultsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar resultados multi-objetivo:', e);
        }
    }
    
    /**
     * Analisa sensibilidade de variáveis
     */
    analyzeVariableSensitivity(caseData, platform) {
        try {
            const variables = [
                { name: 'successProbability', range: [-0.2, 0.2], step: 0.05 },
                { name: 'caseValue', range: [-0.3, 0.3], step: 0.1 },
                { name: 'omissionPercentage', range: [-0.25, 0.25], step: 0.05 },
                { name: 'hasDocumentaryEvidence', range: [0, 1], step: 1 },
                { name: 'hasDigitalEvidence', range: [0, 1], step: 1 }
            ];
            
            const baseAnalysis = this.analytics.analyzeOptimalSettlementTiming(caseData, platform);
            const baseROI = parseFloat(baseAnalysis.expectedROI.roi);
            
            const sensitivityResults = [];
            
            for (const variable of variables) {
                const impacts = [];
                let currentValue = caseData[variable.name];
                if (currentValue === undefined) continue;
                
                for (let delta = variable.range[0]; delta <= variable.range[1]; delta += variable.step) {
                    const modifiedCase = { ...caseData };
                    if (variable.name === 'hasDocumentaryEvidence' || variable.name === 'hasDigitalEvidence') {
                        modifiedCase[variable.name] = delta === 1;
                    } else if (typeof currentValue === 'number') {
                        modifiedCase[variable.name] = currentValue * (1 + delta);
                    }
                    
                    const modifiedAnalysis = this.analytics.analyzeOptimalSettlementTiming(modifiedCase, platform);
                    const modifiedROI = parseFloat(modifiedAnalysis.expectedROI.roi);
                    const impact = modifiedROI - baseROI;
                    
                    impacts.push({
                        delta: delta,
                        roiImpact: impact.toFixed(1),
                        roiValue: modifiedROI.toFixed(1) + '%'
                    });
                }
                
                const maxImpact = Math.max(...impacts.map(i => parseFloat(i.roiImpact)));
                const minImpact = Math.min(...impacts.map(i => parseFloat(i.roiImpact)));
                const avgImpact = impacts.reduce((s, i) => s + parseFloat(i.roiImpact), 0) / impacts.length;
                
                sensitivityResults.push({
                    variable: variable.name,
                    currentValue: currentValue,
                    sensitivityScore: Math.abs(avgImpact).toFixed(1),
                    maxImpact: maxImpact.toFixed(1) + '%',
                    minImpact: minImpact.toFixed(1) + '%',
                    volatility: (maxImpact - minImpact).toFixed(1),
                    recommendation: this.getSensitivityRecommendation(variable.name, avgImpact),
                    impacts: impacts
                });
            }
            
            const sortedBySensitivity = [...sensitivityResults].sort((a, b) => 
                parseFloat(b.sensitivityScore) - parseFloat(a.sensitivityScore));
            
            const analysis = {
                caseId: caseData.id,
                platform: platform,
                baseROI: baseROI.toFixed(1) + '%',
                variables: sensitivityResults,
                mostSensitiveVariable: sortedBySensitivity[0],
                leastSensitiveVariable: sortedBySensitivity[sortedBySensitivity.length - 1],
                recommendations: this.getSensitivityRecommendations(sensitivityResults)
            };
            
            this.sensitivityAnalysis.set(caseData.id, analysis);
            this.saveSensitivityAnalysis();
            
            return analysis;
        } catch (error) {
            console.error('[ELITE] Erro na análise de sensibilidade:', error);
            return { error: true, message: 'Erro na análise de sensibilidade' };
        }
    }
    
    /**
     * Obtém recomendação de sensibilidade
     */
    getSensitivityRecommendation(variable, impact) {
        const absImpact = Math.abs(impact);
        if (absImpact > 10) return `⚠️ ${variable} tem alto impacto - priorizar otimização`;
        if (absImpact > 5) return `📊 ${variable} tem impacto moderado - monitorar variações`;
        return `✅ ${variable} tem baixo impacto - manter estratégia atual`;
    }
    
    /**
     * Obtém recomendações consolidadas de sensibilidade
     */
    getSensitivityRecommendations(variables) {
        const recs = [];
        const highImpactVars = variables.filter(v => parseFloat(v.sensitivityScore) > 8);
        const negativeImpactVars = variables.filter(v => parseFloat(v.minImpact) < -5);
        
        if (highImpactVars.length > 0) {
            recs.push(`🎯 Focar esforços em: ${highImpactVars.map(v => v.variable).join(', ')}`);
        }
        
        if (negativeImpactVars.length > 0) {
            recs.push(`⚠️ Atenção a possíveis impactos negativos de: ${negativeImpactVars.map(v => v.variable).join(', ')}`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Variáveis com impacto controlado - estratégia robusta');
        }
        
        return recs;
    }
    
    /**
     * Simulação de Monte Carlo avançada com distribuições customizadas
     */
    advancedMonteCarlo(caseData, platform, iterations = 10000) {
        try {
            const results = [];
            const distributions = [];
            
            for (let i = 0; i < iterations; i++) {
                const successProbVariation = this.generateNormalVariation(caseData.successProbability / 100, 0.1);
                const valueVariation = this.generateLogNormalVariation(caseData.value, 0.15);
                const omissionVariation = this.generateNormalVariation(caseData.omissionPercentage / 100, 0.08);
                
                const simulatedCase = {
                    ...caseData,
                    successProbability: Math.min(Math.max(successProbVariation * 100, 15), 95),
                    value: Math.max(valueVariation, 0),
                    omissionPercentage: Math.min(Math.max(omissionVariation * 100, 0), 100)
                };
                
                const analysis = this.analytics.analyzeOptimalSettlementTiming(simulatedCase, platform);
                const roi = parseFloat(analysis.expectedROI.roi);
                const settlementValue = analysis.expectedROI.settlementValue;
                
                results.push({
                    iteration: i,
                    roi: roi,
                    settlementValue: settlementValue,
                    successProbability: simulatedCase.successProbability,
                    caseValue: simulatedCase.value,
                    omissionPercentage: simulatedCase.omissionPercentage
                });
                
                distributions.push({
                    roi: roi,
                    settlementValue: settlementValue
                });
            }
            
            const rois = results.map(r => r.roi);
            const settlementValues = results.map(r => r.settlementValue);
            
            rois.sort((a, b) => a - b);
            settlementValues.sort((a, b) => a - b);
            
            const simulation = {
                caseId: caseData.id,
                platform: platform,
                iterations: iterations,
                statistics: {
                    roi: {
                        mean: (rois.reduce((s, v) => s + v, 0) / iterations).toFixed(1) + '%',
                        median: rois[Math.floor(iterations / 2)].toFixed(1) + '%',
                        stdDev: this.calculateStdDev(rois).toFixed(1),
                        var95: rois[Math.floor(iterations * 0.05)].toFixed(1) + '%',
                        var99: rois[Math.floor(iterations * 0.01)].toFixed(1) + '%',
                        max: Math.max(...rois).toFixed(1) + '%',
                        min: Math.min(...rois).toFixed(1) + '%'
                    },
                    settlementValue: {
                        mean: (settlementValues.reduce((s, v) => s + v, 0) / iterations).toFixed(0),
                        median: settlementValues[Math.floor(iterations / 2)].toFixed(0),
                        stdDev: this.calculateStdDev(settlementValues).toFixed(0),
                        var95: settlementValues[Math.floor(iterations * 0.05)].toFixed(0),
                        var99: settlementValues[Math.floor(iterations * 0.01)].toFixed(0),
                        max: Math.max(...settlementValues).toFixed(0),
                        min: Math.min(...settlementValues).toFixed(0)
                    }
                },
                confidenceIntervals: {
                    roi_90: `${rois[Math.floor(iterations * 0.05)].toFixed(1)}% - ${rois[Math.floor(iterations * 0.95)].toFixed(1)}%`,
                    roi_95: `${rois[Math.floor(iterations * 0.025)].toFixed(1)}% - ${rois[Math.floor(iterations * 0.975)].toFixed(1)}%`,
                    value_90: `€${(settlementValues[Math.floor(iterations * 0.05)] / 1000).toFixed(0)}k - €${(settlementValues[Math.floor(iterations * 0.95)] / 1000).toFixed(0)}k`
                },
                riskMetrics: {
                    probabilityNegativeROI: (rois.filter(r => r < 0).length / iterations * 100).toFixed(1) + '%',
                    probabilityLoss: (settlementValues.filter(v => v < 0).length / iterations * 100).toFixed(1) + '%',
                    expectedShortfall: (settlementValues.slice(0, Math.floor(iterations * 0.05)).reduce((s, v) => s + v, 0) / Math.floor(iterations * 0.05)).toFixed(0)
                },
                histogram: this.generateHistogramAdvanced(rois, 20),
                recommendation: this.getMonteCarloRecommendation(rois, settlementValues)
            };
            
            this.monteCarloAdvanced.set(caseData.id, simulation);
            this.saveMonteCarloAdvanced();
            
            return simulation;
        } catch (error) {
            console.error('[ELITE] Erro na simulação de Monte Carlo avançada:', error);
            return { error: true, message: 'Erro na simulação' };
        }
    }
    
    /**
     * Gera variação normal
     */
    generateNormalVariation(mean, stdDev) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return Math.max(0, mean + z0 * stdDev);
    }
    
    /**
     * Gera variação log-normal
     */
    generateLogNormalVariation(mean, stdDev) {
        const mu = Math.log(mean) - 0.5 * Math.log(1 + Math.pow(stdDev, 2));
        const sigma = Math.sqrt(Math.log(1 + Math.pow(stdDev, 2)));
        return Math.exp(this.generateNormalVariation(mu, sigma));
    }
    
    /**
     * Calcula desvio padrão
     */
    calculateStdDev(values) {
        const mean = values.reduce((s, v) => s + v, 0) / values.length;
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return Math.sqrt(squaredDiffs.reduce((s, v) => s + v, 0) / values.length);
    }
    
    /**
     * Gera histograma avançado
     */
    generateHistogramAdvanced(values, bins) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / bins;
        const histogram = [];
        
        for (let i = 0; i < bins; i++) {
            const binMin = min + i * binWidth;
            const binMax = binMin + binWidth;
            const count = values.filter(v => v >= binMin && v < binMax).length;
            histogram.push({
                range: `${binMin.toFixed(1)}% - ${binMax.toFixed(1)}%`,
                count: count,
                frequency: (count / values.length * 100).toFixed(1) + '%'
            });
        }
        
        return histogram;
    }
    
    /**
     * Obtém recomendação de Monte Carlo
     */
    getMonteCarloRecommendation(rois, settlementValues) {
        const negativeProb = rois.filter(r => r < 0).length / rois.length;
        const avgROI = rois.reduce((s, v) => s + v, 0) / rois.length;
        
        if (negativeProb < 0.1 && avgROI > 15) {
            return '✅ Alta probabilidade de retorno positivo - avançar com estratégia';
        }
        if (negativeProb < 0.25 && avgROI > 5) {
            return '📊 Probabilidade favorável - implementar com monitorização';
        }
        if (negativeProb < 0.4) {
            return '⚠️ Risco moderado - considerar mitigação de downside';
        }
        return '🚨 Alto risco de retorno negativo - reavaliar estratégia';
    }
    
    /**
     * Otimização multi-objetivo
     */
    multiObjectiveOptimization(caseData, platform) {
        try {
            const objectives = [
                { name: 'maximizeROI', weight: 0.4 },
                { name: 'minimizeRisk', weight: 0.3 },
                { name: 'maximizeSpeed', weight: 0.2 },
                { name: 'minimizeCost', weight: 0.1 }
            ];
            
            const strategies = [
                { name: 'Agressiva', params: { discount: 0.1, urgency: 0.9, evidence: 0.8 } },
                { name: 'Equilibrada', params: { discount: 0.25, urgency: 0.6, evidence: 0.7 } },
                { name: 'Conservadora', params: { discount: 0.4, urgency: 0.3, evidence: 0.9 } },
                { name: 'Rápida', params: { discount: 0.35, urgency: 0.95, evidence: 0.5 } }
            ];
            
            const results = [];
            
            for (const strategy of strategies) {
                const modifiedCase = {
                    ...caseData,
                    urgency: strategy.params.urgency,
                    evidenceQuality: strategy.params.evidence
                };
                
                const analysis = this.analytics.analyzeOptimalSettlementTiming(modifiedCase, platform);
                const roi = parseFloat(analysis.expectedROI.roi);
                const risk = analysis.overallRiskScore ? parseFloat(analysis.overallRiskScore) : 50;
                const speed = 100 - (analysis.optimalTiming?.probability * 100 || 50);
                const cost = analysis.expectedROI?.expectedLitigationValue || 0;
                
                const scores = {
                    roi: roi,
                    risk: 100 - risk,
                    speed: speed,
                    cost: 100 - Math.min(cost / 100000, 100)
                };
                
                const weightedScore = objectives.reduce((sum, obj) => {
                    const value = scores[obj.name.replace('maximize', '').replace('minimize', '').toLowerCase()];
                    return sum + (value * obj.weight);
                }, 0);
                
                results.push({
                    strategy: strategy.name,
                    params: strategy.params,
                    metrics: {
                        roi: roi.toFixed(1) + '%',
                        risk: risk.toFixed(0) + '%',
                        speed: speed.toFixed(0) + '%',
                        cost: `€${(cost / 1000).toFixed(0)}k`
                    },
                    scores: scores,
                    weightedScore: weightedScore.toFixed(0)
                });
            }
            
            const sorted = [...results].sort((a, b) => parseFloat(b.weightedScore) - parseFloat(a.weightedScore));
            const optimal = sorted[0];
            
            const optimization = {
                caseId: caseData.id,
                platform: platform,
                objectives: objectives,
                strategies: sorted,
                optimalStrategy: optimal,
                paretoFront: this.identifyParetoFront(results),
                recommendation: this.getMultiObjectiveRecommendation(optimal, sorted)
            };
            
            this.multiObjectiveResults.set(caseData.id, optimization);
            this.saveMultiObjectiveResults();
            
            return optimization;
        } catch (error) {
            console.error('[ELITE] Erro na otimização multi-objetivo:', error);
            return { error: true, message: 'Erro na otimização' };
        }
    }
    
    /**
     * Identifica fronteira de Pareto
     */
    identifyParetoFront(results) {
        const pareto = [];
        for (let i = 0; i < results.length; i++) {
            let isDominated = false;
            for (let j = 0; j < results.length; j++) {
                if (i !== j && 
                    results[j].scores.roi >= results[i].scores.roi &&
                    results[j].scores.risk >= results[i].scores.risk &&
                    results[j].scores.speed >= results[i].scores.speed &&
                    results[j].scores.cost >= results[i].scores.cost &&
                    (results[j].scores.roi > results[i].scores.roi ||
                     results[j].scores.risk > results[i].scores.risk ||
                     results[j].scores.speed > results[i].scores.speed ||
                     results[j].scores.cost > results[i].scores.cost)) {
                    isDominated = true;
                    break;
                }
            }
            if (!isDominated) {
                pareto.push(results[i].strategy);
            }
        }
        return pareto;
    }
    
    /**
     * Obtém recomendação multi-objetivo
     */
    getMultiObjectiveRecommendation(optimal, allStrategies) {
        return {
            strategy: optimal.strategy,
            rationale: `Estratégia ${optimal.strategy} otimiza os objetivos com score ${optimal.weightedScore}`,
            alternatives: allStrategies.slice(1, 3).map(s => s.strategy),
            expectedOutcome: `ROI ${optimal.metrics.roi} com risco ${optimal.metrics.risk}`
        };
    }
    
    /**
     * Gera relatório completo de análise quântica avançada
     */
    generateQuantumReport(caseData, platform) {
        try {
            const sensitivity = this.analyzeVariableSensitivity(caseData, platform);
            const monteCarlo = this.advancedMonteCarlo(caseData, platform, 5000);
            const multiObjective = this.multiObjectiveOptimization(caseData, platform);
            const baseAnalysis = this.analytics.analyzeOptimalSettlementTiming(caseData, platform);
            
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                platform: platform,
                baseAnalysis: {
                    optimalTiming: baseAnalysis.optimalTiming,
                    expectedROI: baseAnalysis.expectedROI,
                    nashEquilibrium: baseAnalysis.nashEquilibrium
                },
                sensitivityAnalysis: sensitivity,
                monteCarloSimulation: monteCarlo,
                multiObjectiveOptimization: multiObjective,
                integratedRecommendation: this.getIntegratedQuantumRecommendation(sensitivity, monteCarlo, multiObjective),
                riskAssessment: this.getQuantumRiskAssessment(monteCarlo, sensitivity),
                executiveSummary: this.getQuantumExecutiveSummary(baseAnalysis, monteCarlo, multiObjective)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório quântico:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Obtém recomendação integrada
     */
    getIntegratedQuantumRecommendation(sensitivity, monteCarlo, multiObjective) {
        const recs = [];
        
        if (sensitivity.mostSensitiveVariable) {
            recs.push(`🎯 Foco prioritário em: ${sensitivity.mostSensitiveVariable.variable}`);
        }
        
        if (monteCarlo.riskMetrics?.probabilityNegativeROI && parseFloat(monteCarlo.riskMetrics.probabilityNegativeROI) < 15) {
            recs.push('✅ Alta probabilidade de retorno positivo');
        } else if (monteCarlo.riskMetrics?.probabilityNegativeROI && parseFloat(monteCarlo.riskMetrics.probabilityNegativeROI) > 30) {
            recs.push('⚠️ Risco significativo de retorno negativo');
        }
        
        recs.push(`📊 Estratégia ótima: ${multiObjective.optimalStrategy?.strategy}`);
        
        return recs;
    }
    
    /**
     * Avalia risco quântico
     */
    getQuantumRiskAssessment(monteCarlo, sensitivity) {
        let riskScore = 50;
        
        if (monteCarlo.riskMetrics?.probabilityNegativeROI) {
            const probNeg = parseFloat(monteCarlo.riskMetrics.probabilityNegativeROI);
            riskScore += probNeg * 0.5;
        }
        
        if (sensitivity.mostSensitiveVariable) {
            const sensScore = parseFloat(sensitivity.mostSensitiveVariable.sensitivityScore);
            riskScore += sensScore * 2;
        }
        
        riskScore = Math.min(Math.max(riskScore, 0), 100);
        
        return {
            score: riskScore.toFixed(0),
            level: riskScore > 70 ? 'ALTO' : riskScore > 40 ? 'MODERADO' : 'BAIXO',
            factors: {
                volatility: monteCarlo.statistics?.roi?.stdDev || 'N/A',
                negativeROIProbability: monteCarlo.riskMetrics?.probabilityNegativeROI || 'N/A',
                sensitivityExposure: sensitivity.mostSensitiveVariable?.sensitivityScore || 'N/A'
            }
        };
    }
    
    /**
     * Obtém sumário executivo quântico
     */
    getQuantumExecutiveSummary(baseAnalysis, monteCarlo, multiObjective) {
        return {
            headline: `Análise Quântica: ${baseAnalysis.optimalTiming?.quarter || 'N/A'} - ${multiObjective.optimalStrategy?.strategy || 'N/A'}`,
            keyFinding: `ROI esperado: ${baseAnalysis.expectedROI?.roi || 'N/A'} | VaR 95%: ${monteCarlo.statistics?.roi?.var95 || 'N/A'}`,
            recommendation: multiObjective.optimalStrategy?.strategy || 'Estratégia Equilibrada',
            confidence: monteCarlo.statistics?.roi?.stdDev ? `${(100 - parseFloat(monteCarlo.statistics.roi.stdDev)).toFixed(0)}%` : 'N/A'
        };
    }
    
    /**
     * Renderiza dashboard de análise quântica avançada
     */
    renderDashboard(containerId, caseData, platform) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateQuantumReport(caseData, platform);
            
            container.innerHTML = `
                <div class="quantum-extension-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> QUANTUM ANALYTICS EXTENSION - ANÁLISE AVANÇADA</h2><div class="risk-badge risk-${report.riskAssessment?.level?.toLowerCase() || 'moderado'}">Risco: ${report.riskAssessment?.level || 'Moderado'}</div></div>
                    
                    <div class="quantum-summary"><div class="summary-card"><div class="summary-value">${report.baseAnalysis?.expectedROI?.roi || 'N/A'}</div><div class="summary-label">ROI Esperado</div><div class="summary-sub">VaR 95%: ${report.monteCarloSimulation?.statistics?.roi?.var95 || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.monteCarloSimulation?.riskMetrics?.probabilityNegativeROI || 'N/A'}</div><div class="summary-label">Probabilidade Perda</div><div class="summary-sub">Expected Shortfall: €${(report.monteCarloSimulation?.riskMetrics?.expectedShortfall / 1000 || 0).toFixed(0)}k</div></div>
                    <div class="summary-card"><div class="summary-value">${report.sensitivityAnalysis?.mostSensitiveVariable?.sensitivityScore || 'N/A'}</div><div class="summary-label">Sensibilidade Máxima</div><div class="summary-sub">Variável: ${report.sensitivityAnalysis?.mostSensitiveVariable?.variable || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.multiObjectiveOptimization?.optimalStrategy?.strategy || 'N/A'}</div><div class="summary-label">Estratégia Ótima</div><div class="summary-sub">Score: ${report.multiObjectiveOptimization?.optimalStrategy?.weightedScore || 'N/A'}</div></div></div>
                    
                    <div class="sensitivity-section"><h3><i class="fas fa-chart-simple"></i> ANÁLISE DE SENSIBILIDADE</h3><div class="sensitivity-grid">${report.sensitivityAnalysis?.variables?.slice(0, 4).map(v => `
                        <div class="sensitivity-card">
                            <div class="sensitivity-name"><strong>${v.variable}</strong></div>
                            <div class="sensitivity-score">Impacto: ${v.sensitivityScore}%</div>
                            <div class="sensitivity-range">Variação: ${v.minImpact} a ${v.maxImpact}</div>
                            <div class="sensitivity-recommendation">${v.recommendation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="montecarlo-section"><h3><i class="fas fa-chart-line"></i> MONTE CARLO AVANÇADO (${report.monteCarloSimulation?.iterations?.toLocaleString() || '5.000'} iterações)</h3><div class="montecarlo-grid"><div class="stat-card"><div class="stat-label">ROI Médio</div><div class="stat-value">${report.monteCarloSimulation?.statistics?.roi?.mean || 'N/A'}</div></div>
                    <div class="stat-card"><div class="stat-label">Mediana ROI</div><div class="stat-value">${report.monteCarloSimulation?.statistics?.roi?.median || 'N/A'}</div></div>
                    <div class="stat-card"><div class="stat-label">Desvio Padrão</div><div class="stat-value">${report.monteCarloSimulation?.statistics?.roi?.stdDev || 'N/A'}</div></div>
                    <div class="stat-card"><div class="stat-label">Intervalo 95%</div><div class="stat-value">${report.monteCarloSimulation?.confidenceIntervals?.roi_95 || 'N/A'}</div></div></div>
                    <div class="histogram-preview"><strong>Distribuição de ROI:</strong><div class="histogram-bars">${report.monteCarloSimulation?.histogram?.slice(0, 10).map(h => `<div class="histogram-row"><span>${h.range}</span><div class="histogram-bar"><div class="histogram-fill" style="width: ${h.frequency}%"></div></div><span>${h.frequency}</span></div>`).join('')}</div></div></div>
                    
                    <div class="multiobjective-section"><h3><i class="fas fa-chart-pie"></i> OTIMIZAÇÃO MULTI-OBJETIVO</h3><div class="strategies-grid">${report.multiObjectiveOptimization?.strategies?.map(s => `
                        <div class="strategy-card ${s.strategy === report.multiObjectiveOptimization?.optimalStrategy?.strategy ? 'optimal' : ''}">
                            <div class="strategy-name"><strong>${s.strategy}</strong> ${s.strategy === report.multiObjectiveOptimization?.optimalStrategy?.strategy ? '⭐ ÓTIMA' : ''}</div>
                            <div class="strategy-metrics"><div>📈 ROI: ${s.metrics.roi}</div><div>⚠️ Risco: ${s.metrics.risk}</div><div>⚡ Velocidade: ${s.metrics.speed}</div><div>💰 Custo: ${s.metrics.cost}</div></div>
                            <div class="strategy-score">Score: ${s.weightedScore}</div>
                        </div>
                    `).join('')}</div>
                    <div class="pareto-front"><strong>Fronteira de Pareto:</strong> ${report.multiObjectiveOptimization?.paretoFront?.join(' → ') || 'N/A'}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES INTEGRADAS</h3><div class="recommendations-list"><ul>${report.integratedRecommendation?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                    
                    <div class="executive-summary"><h3><i class="fas fa-crown"></i> SUMÁRIO EXECUTIVO</h3><div class="summary-card-exec"><div class="exec-headline">${report.executiveSummary?.headline || 'N/A'}</div><div class="exec-finding">${report.executiveSummary?.keyFinding || 'N/A'}</div><div class="exec-recommendation"><strong>Recomendação:</strong> ${report.executiveSummary?.recommendation || 'N/A'}</div><div class="exec-confidence">Confiança: ${report.executiveSummary?.confidence || 'N/A'}</div></div></div>
                </div>
                <style>
                    .quantum-extension-ext{ padding:0; } .risk-badge{ padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; } .risk-alto{ border-left:3px solid #ff1744; color:#ff1744; background:rgba(255,23,68,0.1); } .risk-moderado{ border-left:3px solid #ffc107; color:#ffc107; background:rgba(255,193,7,0.1); } .risk-baixo{ border-left:3px solid #00e676; color:#00e676; background:rgba(0,230,118,0.1); } .quantum-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .sensitivity-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:16px; margin-bottom:24px; } .montecarlo-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:20px; } .strategies-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:20px; } @media (max-width:768px){ .quantum-summary{ grid-template-columns:1fr 1fr; } .montecarlo-grid{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.QuantumAnalyticsExtensionExtended = new QuantumAnalyticsExtensionExtended(window.QuantumLegalAnalytics);

console.log('[ELITE] Quantum Analytics Extension Extended carregada - Análise Quântica Avançada Ativa');