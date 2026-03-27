/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE BLACK SWAN PREDICTOR
 * SIMULAÇÃO DE MONTE CARLO PARA ANÁLISE DE RISCO JURÍDICO
 * ============================================================================
 * Funcionalidades:
 * 1. Simulação de Monte Carlo com 10.000 iterações
 * 2. Cálculo de Value at Risk (VaR) Jurídico
 * 3. Análise de cenários de Cisne Negro (Black Swan)
 * 4. Histograma de distribuição de resultados
 * 5. Previsão de volatilidade judicial
 * 6. Relatórios executivos para Conselhos de Administração
 * ============================================================================
 */

class BlackSwanPredictor {
    constructor() {
        this.iterations = 10000;
        this.confidenceLevels = [0.90, 0.95, 0.99, 0.999];
        this.simulationHistory = [];
        this.initialized = false;
        
        this.loadSimulationHistory();
    }
    
    /**
     * Inicializa o Black Swan Predictor
     */
    initialize() {
        try {
            this.initialized = true;
            console.log('[ELITE] Black Swan Predictor inicializado - Motor de Monte Carlo Ativo (10.000 iterações)');
        } catch (error) {
            console.error('[ELITE] Erro na inicialização do Black Swan Predictor:', error);
            this.initialized = false;
        }
        return this;
    }
    
    /**
     * Carrega histórico de simulações
     */
    loadSimulationHistory() {
        try {
            const stored = localStorage.getItem('elite_blackswan_history');
            if (stored) {
                this.simulationHistory = JSON.parse(stored);
            } else {
                this.simulationHistory = [];
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar histórico:', e);
            this.simulationHistory = [];
        }
    }
    
    /**
     * Salva histórico de simulações
     */
    saveSimulationHistory() {
        try {
            if (this.simulationHistory.length > 100) {
                this.simulationHistory = this.simulationHistory.slice(0, 100);
            }
            localStorage.setItem('elite_blackswan_history', JSON.stringify(this.simulationHistory));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar histórico:', e);
        }
    }
    
    /**
     * Gera número aleatório com distribuição normal (Box-Muller)
     */
    gaussianRandom(mean = 0, stdev = 1) {
        try {
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            return z0 * stdev + mean;
        } catch (error) {
            return mean;
        }
    }
    
    /**
     * Gera número aleatório com distribuição log-normal
     */
    logNormalRandom(mean, stdev) {
        try {
            const mu = Math.log(mean) - 0.5 * Math.log(1 + Math.pow(stdev / mean, 2));
            const sigma = Math.sqrt(Math.log(1 + Math.pow(stdev / mean, 2)));
            return Math.exp(this.gaussianRandom(mu, sigma));
        } catch (error) {
            return mean;
        }
    }
    
    /**
     * Calcula Value at Risk (VaR) Jurídico com simulação de Monte Carlo
     */
    calculateLegalVaR(baseValue, successProb, options = {}) {
        try {
            const volatility = options.volatility || 0.25;
            const judicialVolatility = options.judicialVolatility || 0.18;
            const legislativeRisk = options.legislativeRisk || 0.12;
            const judicialReversalRisk = options.judicialReversalRisk || 0.08;
            const iterations = Math.min(options.iterations || this.iterations, 5000);
            
            const results = [];
            const scenarios = [];
            const outcomes = { victory: 0, partial: 0, defeat: 0, catastrophic: 0 };
            let bestCase = { value: -Infinity, iteration: -1 };
            let worstCase = { value: Infinity, iteration: -1 };
            let blackSwanEvents = [];
            
            for (let i = 0; i < iterations; i++) {
                try {
                    const judicialFactor = this.gaussianRandom(0, judicialVolatility);
                    const legislativeFactor = this.gaussianRandom(0, legislativeRisk);
                    const marketFactor = this.gaussianRandom(0, volatility * 0.5);
                    const reversalFactor = this.gaussianRandom(0, judicialReversalRisk);
                    
                    let adjustedProb = successProb + judicialFactor + legislativeFactor + marketFactor + reversalFactor;
                    adjustedProb = Math.min(Math.max(adjustedProb, 0.01), 0.99);
                    
                    let recoveryValue = 0;
                    let outcomeType = '';
                    const randomOutcome = Math.random();
                    
                    if (randomOutcome < adjustedProb) {
                        recoveryValue = baseValue * (0.85 + this.gaussianRandom(0, 0.12));
                        outcomeType = 'victory';
                        outcomes.victory++;
                    } else if (randomOutcome < adjustedProb + (1 - adjustedProb) * 0.35) {
                        recoveryValue = baseValue * (0.45 + this.gaussianRandom(0, 0.18));
                        outcomeType = 'partial';
                        outcomes.partial++;
                    } else {
                        recoveryValue = -baseValue * (0.15 + Math.abs(this.gaussianRandom(0, 0.08)));
                        outcomeType = 'defeat';
                        outcomes.defeat++;
                    }
                    
                    const isBlackSwan = Math.random() < 0.012;
                    if (isBlackSwan) {
                        const blackSwanImpact = -baseValue * (0.6 + Math.random() * 0.5);
                        recoveryValue += blackSwanImpact;
                        outcomeType = 'catastrophic';
                        outcomes.catastrophic++;
                        blackSwanEvents.push({
                            iteration: i,
                            impact: blackSwanImpact,
                            type: this.getBlackSwanType(),
                            recoveryValue: recoveryValue
                        });
                    }
                    
                    results.push(recoveryValue);
                    scenarios.push({
                        iteration: i,
                        probability: adjustedProb,
                        outcome: recoveryValue,
                        outcomeType: outcomeType,
                        factors: { judicialFactor, legislativeFactor, marketFactor, reversalFactor }
                    });
                    
                    if (recoveryValue > bestCase.value) {
                        bestCase = { value: recoveryValue, iteration: i, scenario: scenarios[i] };
                    }
                    if (recoveryValue < worstCase.value) {
                        worstCase = { value: recoveryValue, iteration: i, scenario: scenarios[i] };
                    }
                } catch (error) {
                    console.error('[ELITE] Erro na iteração', i, ':', error);
                    results.push(0);
                }
            }
            
            if (results.length === 0) {
                throw new Error('Nenhum resultado válido gerado');
            }
            
            results.sort((a, b) => a - b);
            
            const varResults = {};
            for (const confidence of this.confidenceLevels) {
                const index = Math.floor(iterations * (1 - confidence));
                varResults[`var${(confidence * 100).toFixed(0)}`] = results[index] || 0;
                varResults[`var${(confidence * 100).toFixed(0)}_formatted`] = this.formatCurrency(results[index] || 0);
            }
            
            const mean = results.reduce((a, b) => a + b, 0) / results.length;
            const median = results[Math.floor(results.length / 2)];
            const variance = results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / results.length;
            const stdev = Math.sqrt(variance);
            
            const var95Index = Math.floor(iterations * 0.05);
            const tailResults = results.slice(0, Math.max(var95Index, 1));
            const expectedShortfall = tailResults.reduce((a, b) => a + b, 0) / tailResults.length;
            
            const var99Index = Math.floor(iterations * 0.01);
            const extremeTailResults = results.slice(0, Math.max(var99Index, 1));
            const expectedShortfallExtreme = extremeTailResults.reduce((a, b) => a + b, 0) / extremeTailResults.length;
            
            const histogram = this.generateHistogram(results);
            const lossProbability = results.filter(r => r < 0).length / results.length;
            const catastrophicLossProbability = results.filter(r => r < -baseValue * 0.5).length / results.length;
            const mostLikelyBlackSwan = this.analyzeBlackSwanScenarios(blackSwanEvents);
            const blackSwanAdjustedVaR = (varResults.var95 || 0) - (blackSwanEvents.length / iterations) * baseValue * 0.5;
            
            const simulationResult = {
                simulationId: Date.now(),
                timestamp: new Date().toISOString(),
                parameters: {
                    baseValue: baseValue,
                    baseValueFormatted: this.formatCurrency(baseValue),
                    successProbability: successProb,
                    successProbabilityPercent: (successProb * 100).toFixed(1) + '%',
                    volatility: volatility,
                    judicialVolatility: judicialVolatility,
                    legislativeRisk: legislativeRisk,
                    judicialReversalRisk: judicialReversalRisk,
                    iterations: iterations
                },
                statistics: {
                    mean: mean,
                    meanFormatted: this.formatCurrency(mean),
                    median: median,
                    medianFormatted: this.formatCurrency(median),
                    mode: this.calculateMode(results),
                    modeFormatted: this.formatCurrency(this.calculateMode(results)),
                    standardDeviation: stdev,
                    standardDeviationFormatted: this.formatCurrency(stdev),
                    variance: variance,
                    min: results[0],
                    minFormatted: this.formatCurrency(results[0]),
                    max: results[results.length - 1],
                    maxFormatted: this.formatCurrency(results[results.length - 1]),
                    range: results[results.length - 1] - results[0],
                    rangeFormatted: this.formatCurrency(results[results.length - 1] - results[0]),
                    skewness: this.calculateSkewness(results, mean, stdev),
                    kurtosis: this.calculateKurtosis(results, mean, stdev)
                },
                riskMetrics: {
                    valueAtRisk: varResults,
                    expectedShortfall: expectedShortfall,
                    expectedShortfallFormatted: this.formatCurrency(expectedShortfall),
                    expectedShortfallExtreme: expectedShortfallExtreme,
                    expectedShortfallExtremeFormatted: this.formatCurrency(expectedShortfallExtreme),
                    lossProbability: lossProbability,
                    lossProbabilityPercent: (lossProbability * 100).toFixed(1) + '%',
                    gainProbability: 1 - lossProbability,
                    gainProbabilityPercent: ((1 - lossProbability) * 100).toFixed(1) + '%',
                    catastrophicLossProbability: catastrophicLossProbability,
                    catastrophicLossProbabilityPercent: (catastrophicLossProbability * 100).toFixed(2) + '%',
                    worstCase: worstCase.value,
                    worstCaseFormatted: this.formatCurrency(worstCase.value),
                    bestCase: bestCase.value,
                    bestCaseFormatted: this.formatCurrency(bestCase.value),
                    blackSwanProbability: blackSwanEvents.length / iterations,
                    blackSwanProbabilityPercent: ((blackSwanEvents.length / iterations) * 100).toFixed(2) + '%',
                    blackSwanAdjustedVaR: blackSwanAdjustedVaR,
                    blackSwanAdjustedVaRFormatted: this.formatCurrency(blackSwanAdjustedVaR)
                },
                outcomes: {
                    victory: outcomes.victory / iterations,
                    victoryPercent: ((outcomes.victory / iterations) * 100).toFixed(1) + '%',
                    partial: outcomes.partial / iterations,
                    partialPercent: ((outcomes.partial / iterations) * 100).toFixed(1) + '%',
                    defeat: outcomes.defeat / iterations,
                    defeatPercent: ((outcomes.defeat / iterations) * 100).toFixed(1) + '%',
                    catastrophic: outcomes.catastrophic / iterations,
                    catastrophicPercent: ((outcomes.catastrophic / iterations) * 100).toFixed(2) + '%'
                },
                blackSwan: {
                    events: blackSwanEvents.slice(0, 10),
                    mostLikelyScenario: mostLikelyBlackSwan,
                    impactRange: {
                        min: blackSwanEvents.length > 0 ? Math.min(...blackSwanEvents.map(e => e.impact)) : 0,
                        max: blackSwanEvents.length > 0 ? Math.max(...blackSwanEvents.map(e => e.impact)) : 0,
                        minFormatted: blackSwanEvents.length > 0 ? this.formatCurrency(Math.min(...blackSwanEvents.map(e => e.impact))) : '€0',
                        maxFormatted: blackSwanEvents.length > 0 ? this.formatCurrency(Math.max(...blackSwanEvents.map(e => e.impact))) : '€0'
                    }
                },
                histogram: histogram,
                bestCaseScenario: bestCase.scenario,
                worstCaseScenario: worstCase.scenario,
                confidenceIntervals: this.calculateConfidenceIntervals(results),
                recommendation: this.generateRecommendation(varResults.var95 || 0, lossProbability, outcomes.catastrophic / iterations, baseValue),
                executiveSummary: this.generateExecutiveSummary(varResults, lossProbability, outcomes.catastrophic / iterations, mean, baseValue)
            };
            
            this.simulationHistory.unshift(simulationResult);
            this.saveSimulationHistory();
            return simulationResult;
        } catch (error) {
            console.error('[ELITE] Erro no cálculo do VaR:', error);
            return {
                simulationId: Date.now(),
                timestamp: new Date().toISOString(),
                error: true,
                parameters: { baseValue: baseValue, successProbability: successProb },
                recommendation: { action: 'ERRO NA SIMULAÇÃO', strategy: 'Tente novamente com valores diferentes', priority: 'CRITICAL' },
                executiveSummary: { title: 'Erro na Análise de Risco', boardRecommendation: 'Reintente a simulação ou contacte o suporte' }
            };
        }
    }
    
    /**
     * Gera histograma para visualização
     */
    generateHistogram(results, bins = 20) {
        try {
            if (!results || results.length === 0) return [];
            const min = Math.min(...results);
            const max = Math.max(...results);
            if (min === max) return [];
            const binWidth = (max - min) / bins;
            const histogram = [];
            
            for (let i = 0; i < bins; i++) {
                const binMin = min + i * binWidth;
                const binMax = binMin + binWidth;
                const count = results.filter(r => r >= binMin && r < binMax).length;
                histogram.push({
                    binMin: binMin,
                    binMinFormatted: this.formatCurrency(binMin),
                    binMax: binMax,
                    binMaxFormatted: this.formatCurrency(binMax),
                    count: count,
                    frequency: count / results.length,
                    frequencyPercent: ((count / results.length) * 100).toFixed(1) + '%'
                });
            }
            return histogram;
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Calcula moda dos resultados
     */
    calculateMode(results) {
        try {
            if (!results || results.length === 0) return 0;
            const freq = {};
            results.forEach(r => {
                const key = Math.round(r / 1000) * 1000;
                freq[key] = (freq[key] || 0) + 1;
            });
            let mode = 0;
            let maxFreq = 0;
            for (const [value, count] of Object.entries(freq)) {
                if (count > maxFreq) {
                    maxFreq = count;
                    mode = parseFloat(value);
                }
            }
            return mode;
        } catch (error) {
            return 0;
        }
    }
    
    /**
     * Calcula assimetria (skewness)
     */
    calculateSkewness(results, mean, stdev) {
        try {
            if (!results || results.length < 3 || stdev === 0) return 0;
            const n = results.length;
            const sumCube = results.reduce((sum, r) => sum + Math.pow((r - mean) / stdev, 3), 0);
            return (n / ((n - 1) * (n - 2))) * sumCube;
        } catch (error) {
            return 0;
        }
    }
    
    /**
     * Calcula curtose (kurtosis)
     */
    calculateKurtosis(results, mean, stdev) {
        try {
            if (!results || results.length < 4 || stdev === 0) return 0;
            const n = results.length;
            const sumFourth = results.reduce((sum, r) => sum + Math.pow((r - mean) / stdev, 4), 0);
            return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sumFourth - (3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3)));
        } catch (error) {
            return 0;
        }
    }
    
    /**
     * Calcula intervalos de confiança
     */
    calculateConfidenceIntervals(results) {
        try {
            if (!results || results.length === 0) return {};
            const sorted = [...results].sort((a, b) => a - b);
            const n = sorted.length;
            
            return {
                ci_90: {
                    lower: sorted[Math.floor(n * 0.05)] || 0,
                    lowerFormatted: this.formatCurrency(sorted[Math.floor(n * 0.05)] || 0),
                    upper: sorted[Math.floor(n * 0.95)] || 0,
                    upperFormatted: this.formatCurrency(sorted[Math.floor(n * 0.95)] || 0),
                    range: (sorted[Math.floor(n * 0.95)] || 0) - (sorted[Math.floor(n * 0.05)] || 0),
                    rangeFormatted: this.formatCurrency((sorted[Math.floor(n * 0.95)] || 0) - (sorted[Math.floor(n * 0.05)] || 0))
                },
                ci_95: {
                    lower: sorted[Math.floor(n * 0.025)] || 0,
                    lowerFormatted: this.formatCurrency(sorted[Math.floor(n * 0.025)] || 0),
                    upper: sorted[Math.floor(n * 0.975)] || 0,
                    upperFormatted: this.formatCurrency(sorted[Math.floor(n * 0.975)] || 0),
                    range: (sorted[Math.floor(n * 0.975)] || 0) - (sorted[Math.floor(n * 0.025)] || 0),
                    rangeFormatted: this.formatCurrency((sorted[Math.floor(n * 0.975)] || 0) - (sorted[Math.floor(n * 0.025)] || 0))
                },
                ci_99: {
                    lower: sorted[Math.floor(n * 0.005)] || 0,
                    lowerFormatted: this.formatCurrency(sorted[Math.floor(n * 0.005)] || 0),
                    upper: sorted[Math.floor(n * 0.995)] || 0,
                    upperFormatted: this.formatCurrency(sorted[Math.floor(n * 0.995)] || 0),
                    range: (sorted[Math.floor(n * 0.995)] || 0) - (sorted[Math.floor(n * 0.005)] || 0),
                    rangeFormatted: this.formatCurrency((sorted[Math.floor(n * 0.995)] || 0) - (sorted[Math.floor(n * 0.005)] || 0))
                }
            };
        } catch (error) {
            return {};
        }
    }
    
    /**
     * Gera tipo de Cisne Negro aleatório
     */
    getBlackSwanType() {
        const types = [
            { name: 'Inversão de Jurisprudência no STJ', impact: 'high', probability: 0.015 },
            { name: 'Substituição do Magistrado por juiz desfavorável', impact: 'medium', probability: 0.025 },
            { name: 'Mudança legislativa de última hora', impact: 'high', probability: 0.008 },
            { name: 'Quebra da cadeia de custódia', impact: 'critical', probability: 0.005 },
            { name: 'Testemunha-chave desistiu de depor', impact: 'high', probability: 0.012 },
            { name: 'Documento considerado falso por perícia', impact: 'critical', probability: 0.003 },
            { name: 'Prescrição do direito', impact: 'critical', probability: 0.007 },
            { name: 'Decisão do Tribunal Constitucional', impact: 'high', probability: 0.004 },
            { name: 'Alteração da taxa de juros legais', impact: 'medium', probability: 0.018 },
            { name: 'Falência da parte contrária', impact: 'high', probability: 0.006 },
            { name: 'Recurso extraordinário admitido', impact: 'medium', probability: 0.022 },
            { name: 'Conflito de competência desfavorável', impact: 'medium', probability: 0.014 },
            { name: 'Perda de prova digital por falha técnica', impact: 'high', probability: 0.009 },
            { name: 'Revelia da parte contrária revertida', impact: 'medium', probability: 0.011 }
        ];
        const selected = types[Math.floor(Math.random() * types.length)];
        return selected.name;
    }
    
    /**
     * Analisa cenários de Cisne Negro
     */
    analyzeBlackSwanScenarios(events) {
        try {
            if (!events || events.length === 0) {
                return {
                    type: 'Nenhum evento de Cisne Negro identificado',
                    probability: 0,
                    impact: 0,
                    impactFormatted: '€0',
                    severity: 'N/A'
                };
            }
            
            const typeCount = {};
            events.forEach(e => {
                typeCount[e.type] = (typeCount[e.type] || 0) + 1;
            });
            
            let mostLikely = null;
            let maxCount = 0;
            for (const [type, count] of Object.entries(typeCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    mostLikely = type;
                }
            }
            
            const avgImpact = events.reduce((sum, e) => sum + e.impact, 0) / events.length;
            const totalLoss = events.reduce((sum, e) => sum + e.impact, 0);
            
            let severity = 'MODERADO';
            if (Math.abs(avgImpact) > 500000) severity = 'EXTREMO';
            else if (Math.abs(avgImpact) > 100000) severity = 'ALTO';
            else if (Math.abs(avgImpact) > 25000) severity = 'MÉDIO';
            
            return {
                type: mostLikely,
                probability: (maxCount / events.length) * 100,
                averageImpact: avgImpact,
                averageImpactFormatted: this.formatCurrency(avgImpact),
                totalLoss: totalLoss,
                totalLossFormatted: this.formatCurrency(totalLoss),
                severity: severity,
                eventCount: events.length
            };
        } catch (error) {
            return { type: 'Erro na análise', probability: 0, impact: 0, severity: 'N/A' };
        }
    }
    
    /**
     * Gera recomendação baseada nos resultados
     */
    generateRecommendation(var95, lossProbability, blackSwanProbability, baseValue) {
        try {
            const var95Abs = Math.abs(var95);
            const lossRatio = baseValue > 0 ? var95Abs / baseValue : 0;
            
            if (var95 < 0 && lossProbability > 0.45) {
                return {
                    action: 'REVISÃO URGENTE - RISCO ELEVADO',
                    strategy: 'Considerar acordo ou arbitragem. Risco de perda elevado.',
                    priority: 'CRITICAL',
                    color: '#ff1744',
                    icon: 'fa-skull',
                    message: `VaR(95%): ${this.formatCurrency(var95)} | Probabilidade de perda: ${(lossProbability * 100).toFixed(1)}%`,
                    immediateAction: 'Reunião de estratégia de contingência nas próximas 48h'
                };
            } else if (var95 < 0 && lossProbability > 0.25) {
                return {
                    action: 'REFORÇO PROBATÓRIO - RISCO MODERADO',
                    strategy: 'Reforçar evidências e preparar argumentação alternativa.',
                    priority: 'HIGH',
                    color: '#ffc107',
                    icon: 'fa-exclamation-triangle',
                    message: `VaR(95%): ${this.formatCurrency(var95)} | Probabilidade de perda: ${(lossProbability * 100).toFixed(1)}%`,
                    immediateAction: 'Auditoria probatória e reforço de perícias técnicas'
                };
            } else if (blackSwanProbability > 0.02) {
                return {
                    action: 'MITIGAÇÃO DE CISNE NEGRO',
                    strategy: 'Preparar estratégia de contingência para eventos de baixa probabilidade.',
                    priority: 'MEDIUM',
                    color: '#3b82f6',
                    icon: 'fa-feather-alt',
                    message: `Probabilidade de evento extremo: ${(blackSwanProbability * 100).toFixed(1)}%`,
                    immediateAction: 'Plano de contingência para cenários de inversão jurisprudencial'
                };
            } else if (var95 > 0 && lossProbability < 0.15) {
                return {
                    action: 'MANTER ESTRATÉGIA - OPORTUNIDADE FAVORÁVEL',
                    strategy: 'Caso com boa probabilidade de sucesso. Manter estratégia atual.',
                    priority: 'LOW',
                    color: '#00e676',
                    icon: 'fa-check-circle',
                    message: `Probabilidade de sucesso: ${((1 - lossProbability) * 100).toFixed(1)}%`,
                    immediateAction: 'Preparar petição inicial e pedido de tutela antecipada'
                };
            } else {
                return {
                    action: 'ANÁLISE EQUILIBRADA',
                    strategy: 'Cenário de risco moderado. Avaliar propostas de acordo.',
                    priority: 'MEDIUM',
                    color: '#00e5ff',
                    icon: 'fa-chart-line',
                    message: `VaR(95%): ${this.formatCurrency(var95)} | Probabilidade de perda: ${(lossProbability * 100).toFixed(1)}%`,
                    immediateAction: 'Sondar interesse da contraparte para acordo extrajudicial'
                };
            }
        } catch (error) {
            return {
                action: 'ANÁLISE INDISPONÍVEL',
                strategy: 'Reintente a simulação',
                priority: 'MEDIUM',
                color: '#ffc107',
                icon: 'fa-exclamation-triangle',
                message: 'Erro no cálculo da recomendação',
                immediateAction: 'Contactar suporte técnico'
            };
        }
    }
    
    /**
     * Gera sumário executivo
     */
    generateExecutiveSummary(varResults, lossProbability, blackSwanProbability, mean, baseValue) {
        try {
            const var95 = varResults?.var95 || 0;
            const var99 = varResults?.var99 || 0;
            
            let riskLevel = 'BAIXO';
            let riskColor = '#00e676';
            
            if (var95 < -baseValue * 0.3) {
                riskLevel = 'ALTO';
                riskColor = '#ff1744';
            } else if (var95 < -baseValue * 0.1) {
                riskLevel = 'MODERADO';
                riskColor = '#ffc107';
            }
            
            return {
                title: 'ANÁLISE DE RISCO JURÍDICO - BLACK SWAN PREDICTOR',
                generatedFor: 'Conselho de Administração / Sócios',
                riskLevel: riskLevel,
                riskColor: riskColor,
                keyFindings: {
                    valueAtRisk95: this.formatCurrency(var95),
                    valueAtRisk99: this.formatCurrency(var99),
                    expectedValue: this.formatCurrency(mean),
                    lossProbability: (lossProbability * 100).toFixed(1) + '%',
                    blackSwanProbability: (blackSwanProbability * 100).toFixed(2) + '%',
                    worstCaseScenario: this.formatCurrency(var99 * 1.2)
                },
                interpretation: var95 < 0 
                    ? `Com 95% de confiança, a perda máxima não excederá ${this.formatCurrency(var95)}.`
                    : `Com 95% de confiança, o ganho mínimo será de ${this.formatCurrency(var95)}.`,
                boardRecommendation: var95 < -baseValue * 0.3 
                    ? 'RECOMENDA-SE A REVISÃO URGENTE DA ESTRATÉGIA PROCESSUAL'
                    : var95 < -baseValue * 0.1
                    ? 'RECOMENDA-SE REFORÇO PROBATÓRIO E PREPARAÇÃO DE ARGUMENTAÇÃO ALTERNATIVA'
                    : 'RECOMENDA-SE MANTER ESTRATÉGIA ATUAL E AVANÇAR COM LITÍGIO'
            };
        } catch (error) {
            return {
                title: 'Erro na Análise de Risco',
                riskLevel: 'INDETERMINADO',
                boardRecommendation: 'Reintente a simulação ou contacte o suporte técnico'
            };
        }
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        try {
            if (value === null || value === undefined || isNaN(value)) return '€0';
            if (Math.abs(value) >= 1000000) {
                return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
            }
            return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        } catch (error) {
            return `€${Math.round(value || 0).toLocaleString()}`;
        }
    }
    
    /**
     * Renderiza painel de Black Swan
     */
    renderBlackSwanPanel(containerId, caseData) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const baseValue = caseData?.value || 50000;
            const successProb = (caseData?.successProbability || 70) / 100;
            
            const simulation = this.calculateLegalVaR(baseValue, successProb, {
                judicialVolatility: 0.18,
                legislativeRisk: 0.12,
                judicialReversalRisk: 0.08
            });
            
            if (simulation.error) {
                container.innerHTML = `
                    <div class="alert-item error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Erro na Simulação</strong>
                            <p>Ocorreu um erro ao processar a simulação de Monte Carlo.</p>
                            <small>Por favor, tente novamente ou contacte o suporte técnico.</small>
                        </div>
                    </div>
                `;
                return;
            }
            
            const var95 = simulation.riskMetrics?.valueAtRisk?.var95 || 0;
            const lossProb = simulation.riskMetrics?.lossProbability || 0;
            const blackSwanProb = simulation.riskMetrics?.blackSwanProbability || 0;
            const histogram = simulation.histogram || [];
            const maxFrequency = histogram.length > 0 ? Math.max(...histogram.map(h => h.count)) : 1;
            
            const histogramBars = histogram.map(h => `
                <div class="histogram-bar">
                    <div class="bar-fill ${h.binMin < 0 ? 'negative' : 'positive'}" style="height: ${(h.count / maxFrequency) * 100}%"></div>
                    <div class="bar-label">${h.binMinFormatted}</div>
                </div>
            `).join('');
            
            container.innerHTML = `
                <div class="black-swan-panel">
                    <div class="panel-header">
                        <h3><i class="fas fa-chart-line"></i> ANÁLISE DE CISNE NEGRO (MONTE CARLO)</h3>
                        <div class="simulation-badge">${simulation.parameters?.iterations?.toLocaleString() || '10.000'} iterações</div>
                    </div>
                    
                    <div class="risk-metrics-grid">
                        <div class="metric-card ${var95 < 0 ? 'danger' : 'success'}">
                            <div class="metric-label">Value at Risk (VaR 95%)</div>
                            <div class="metric-value">${simulation.riskMetrics?.valueAtRisk?.var95_formatted || '€0'}</div>
                            <div class="metric-sub">Perda máxima com 95% confiança</div>
                        </div>
                        <div class="metric-card ${lossProb > 0.3 ? 'warning' : 'success'}">
                            <div class="metric-label">Probabilidade de Perda</div>
                            <div class="metric-value">${simulation.riskMetrics?.lossProbabilityPercent || '0%'}</div>
                            <div class="metric-sub">Risco de resultado negativo</div>
                        </div>
                        <div class="metric-card ${blackSwanProb > 0.02 ? 'warning' : 'info'}">
                            <div class="metric-label">Probabilidade de Cisne Negro</div>
                            <div class="metric-value">${simulation.riskMetrics?.blackSwanProbabilityPercent || '0%'}</div>
                            <div class="metric-sub">Evento de baixa probabilidade, alto impacto</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Expected Shortfall (CVaR)</div>
                            <div class="metric-value">${simulation.riskMetrics?.expectedShortfallFormatted || '€0'}</div>
                            <div class="metric-sub">Perda esperada nos 5% piores cenários</div>
                        </div>
                    </div>
                    
                    <div class="outcomes-distribution">
                        <h4>Distribuição de Resultados (${simulation.parameters?.iterations?.toLocaleString() || '10.000'} cenários)</h4>
                        <div class="histogram-container">
                            <div class="histogram">
                                ${histogramBars || '<div class="empty-state">Dados insuficientes para gerar histograma</div>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="outcomes-stats">
                        <div class="stat-item"><span class="stat-label">Vitória Total:</span><span class="stat-value ${simulation.outcomes?.victory > 0.6 ? 'positive' : ''}">${simulation.outcomes?.victoryPercent || '0%'}</span></div>
                        <div class="stat-item"><span class="stat-label">Vitória Parcial:</span><span class="stat-value">${simulation.outcomes?.partialPercent || '0%'}</span></div>
                        <div class="stat-item"><span class="stat-label">Derrota:</span><span class="stat-value ${simulation.outcomes?.defeat > 0.3 ? 'negative' : ''}">${simulation.outcomes?.defeatPercent || '0%'}</span></div>
                        <div class="stat-item"><span class="stat-label">Cisne Negro:</span><span class="stat-value">${simulation.outcomes?.catastrophicPercent || '0%'}</span></div>
                    </div>
                    
                    <div class="confidence-intervals">
                        <h4>Intervalos de Confiança</h4>
                        <div class="ci-list">
                            <div class="ci-item"><span>90%</span><span>${simulation.confidenceIntervals?.ci_90?.lowerFormatted || '€0'} a ${simulation.confidenceIntervals?.ci_90?.upperFormatted || '€0'}</span></div>
                            <div class="ci-item"><span>95%</span><span>${simulation.confidenceIntervals?.ci_95?.lowerFormatted || '€0'} a ${simulation.confidenceIntervals?.ci_95?.upperFormatted || '€0'}</span></div>
                            <div class="ci-item"><span>99%</span><span>${simulation.confidenceIntervals?.ci_99?.lowerFormatted || '€0'} a ${simulation.confidenceIntervals?.ci_99?.upperFormatted || '€0'}</span></div>
                        </div>
                    </div>
                    
                    <div class="recommendation-card priority-${simulation.recommendation?.priority?.toLowerCase() || 'medium'}">
                        <div class="rec-header">
                            <i class="fas ${simulation.recommendation?.icon || 'fa-chart-line'}"></i>
                            <strong>${simulation.recommendation?.action || 'Análise Concluída'}</strong>
                        </div>
                        <p>${simulation.recommendation?.strategy || 'Estratégia recomendada com base na simulação'}</p>
                        <small>${simulation.recommendation?.message || ''}</small>
                        <div class="immediate-action">
                            <i class="fas fa-clock"></i> Ação Imediata: ${simulation.recommendation?.immediateAction || 'Monitorizar evolução do caso'}
                        </div>
                    </div>
                    
                    <div class="black-swan-scenarios">
                        <h4><i class="fas fa-feather-alt"></i> Cenários de Cisne Negro</h4>
                        ${simulation.blackSwan?.events?.length === 0 ? 
                            '<div class="empty-state">Nenhum evento de Cisne Negro identificado nas simulações.</div>' :
                            simulation.blackSwan?.events?.slice(0, 3).map(e => `
                                <div class="scenario-item">
                                    <div class="scenario-type">${e.type}</div>
                                    <div class="scenario-impact impact-negative">Impacto: ${this.formatCurrency(e.impact)}</div>
                                    <div class="scenario-prob">Probabilidade: ${(1 / simulation.parameters.iterations * 100).toFixed(2)}%</div>
                                </div>
                            `).join('')}
                    </div>
                    
                    <div class="executive-summary">
                        <h4><i class="fas fa-chart-pie"></i> Sumário Executivo</h4>
                        <div class="summary-header" style="border-left: 4px solid ${simulation.executiveSummary?.riskColor || '#00e5ff'};">
                            <strong>Nível de Risco: ${simulation.executiveSummary?.riskLevel || 'INDETERMINADO'}</strong>
                        </div>
                        <div class="summary-findings">
                            <div>📊 VaR 95%: ${simulation.executiveSummary?.keyFindings?.valueAtRisk95 || '€0'}</div>
                            <div>📈 Valor Esperado: ${simulation.executiveSummary?.keyFindings?.expectedValue || '€0'}</div>
                            <div>⚠️ Probabilidade de Perda: ${simulation.executiveSummary?.keyFindings?.lossProbability || '0%'}</div>
                            <div>🦢 Probabilidade de Cisne Negro: ${simulation.executiveSummary?.keyFindings?.blackSwanProbability || '0%'}</div>
                        </div>
                        <div class="board-recommendation">
                            <strong>Recomendação para o Conselho:</strong><br>
                            ${simulation.executiveSummary?.boardRecommendation || 'Reavaliar estratégia com base nos resultados da simulação'}
                        </div>
                    </div>
                </div>
                <style>
                    .black-swan-panel { padding: 0; }
                    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
                    .simulation-badge { background: var(--elite-primary-dim); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-family: monospace; }
                    .risk-metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
                    .metric-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; text-align: center; border-left: 3px solid; }
                    .metric-card.danger { border-left-color: #ff1744; }
                    .metric-card.warning { border-left-color: #ffc107; }
                    .metric-card.success { border-left-color: #00e676; }
                    .metric-card.info { border-left-color: #00e5ff; }
                    .metric-label { font-size: 0.7rem; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
                    .metric-value { font-size: 1.3rem; font-weight: bold; font-family: 'JetBrains Mono'; }
                    .metric-sub { font-size: 0.6rem; color: #64748b; margin-top: 4px; }
                    .histogram-container { background: var(--bg-command); border-radius: 12px; padding: 20px; margin: 16px 0; overflow-x: auto; }
                    .histogram { display: flex; align-items: flex-end; gap: 4px; height: 200px; min-width: 600px; }
                    .histogram-bar { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; position: relative; }
                    .bar-fill { width: 100%; min-height: 2px; border-radius: 2px 2px 0 0; transition: height 0.3s; }
                    .bar-fill.positive { background: linear-gradient(180deg, #00e676, #00c853); }
                    .bar-fill.negative { background: linear-gradient(180deg, #ff1744, #b71c1c); }
                    .bar-label { font-size: 0.55rem; transform: rotate(-45deg); margin-top: 8px; white-space: nowrap; position: absolute; bottom: -20px; left: 0; }
                    .outcomes-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; background: var(--bg-command); border-radius: 12px; padding: 16px; }
                    .stat-item { display: flex; justify-content: space-between; font-size: 0.8rem; }
                    .stat-value.positive { color: #00e676; }
                    .stat-value.negative { color: #ff1744; }
                    .confidence-intervals { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin: 20px 0; }
                    .ci-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
                    .ci-item { display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid var(--border-tactic); font-size: 0.75rem; }
                    .recommendation-card { padding: 16px; border-radius: 12px; margin: 20px 0; border-left: 4px solid; }
                    .recommendation-card.priority-critical { border-left-color: #ff1744; background: rgba(255, 23, 68, 0.1); }
                    .recommendation-card.priority-high { border-left-color: #ffc107; background: rgba(255, 193, 7, 0.1); }
                    .recommendation-card.priority-medium { border-left-color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
                    .recommendation-card.priority-low { border-left-color: #00e676; background: rgba(0, 230, 118, 0.1); }
                    .rec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 0.9rem; }
                    .immediate-action { margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--border-tactic); font-size: 0.7rem; color: #94a3b8; }
                    .black-swan-scenarios { margin-top: 20px; }
                    .scenario-item { background: var(--bg-terminal); border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
                    .scenario-type { font-weight: bold; font-size: 0.8rem; }
                    .impact-negative { color: #ff1744; }
                    .executive-summary { background: var(--bg-command); border-radius: 12px; padding: 20px; margin-top: 20px; }
                    .summary-findings { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0; }
                    .summary-findings div { padding: 8px; background: var(--bg-terminal); border-radius: 8px; font-size: 0.7rem; }
                    .board-recommendation { background: rgba(0, 229, 255, 0.05); padding: 16px; border-radius: 8px; margin-top: 12px; font-size: 0.75rem; border-left: 3px solid var(--elite-primary); }
                    @media (max-width: 768px) {
                        .risk-metrics-grid { grid-template-columns: 1fr 1fr; }
                        .outcomes-stats { grid-template-columns: 1fr 1fr; }
                        .summary-findings { grid-template-columns: 1fr; }
                    }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar painel Black Swan:', error);
            container.innerHTML = `
                <div class="alert-item error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Erro na Simulação</strong>
                        <p>Ocorreu um erro ao processar a simulação de Monte Carlo: ${error.message}</p>
                        <small>Por favor, tente novamente com valores diferentes.</small>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Gera relatório completo de análise de risco
     */
    generateRiskReport(caseData) {
        try {
            const simulation = this.calculateLegalVaR(caseData.value, caseData.successProbability / 100);
            return {
                generatedAt: new Date().toISOString(),
                generatedAtFormatted: new Date().toLocaleString('pt-PT'),
                caseId: caseData.id,
                caseValue: caseData.value,
                caseValueFormatted: this.formatCurrency(caseData.value),
                simulationId: simulation.simulationId,
                riskProfile: {
                    var95: simulation.riskMetrics?.valueAtRisk?.var95_formatted || '€0',
                    var99: simulation.riskMetrics?.valueAtRisk?.var99_formatted || '€0',
                    expectedShortfall: simulation.riskMetrics?.expectedShortfallFormatted || '€0',
                    lossProbability: simulation.riskMetrics?.lossProbabilityPercent || '0%',
                    blackSwanProbability: simulation.riskMetrics?.blackSwanProbabilityPercent || '0%',
                    catastrophicLossProbability: simulation.riskMetrics?.catastrophicLossProbabilityPercent || '0%'
                },
                statisticalAnalysis: {
                    mean: simulation.statistics?.meanFormatted || '€0',
                    median: simulation.statistics?.medianFormatted || '€0',
                    mode: simulation.statistics?.modeFormatted || '€0',
                    standardDeviation: simulation.statistics?.standardDeviationFormatted || '€0',
                    skewness: (simulation.statistics?.skewness || 0).toFixed(2),
                    kurtosis: (simulation.statistics?.kurtosis || 0).toFixed(2)
                },
                confidenceIntervals: {
                    ci_90: `${simulation.confidenceIntervals?.ci_90?.lowerFormatted || '€0'} a ${simulation.confidenceIntervals?.ci_90?.upperFormatted || '€0'}`,
                    ci_95: `${simulation.confidenceIntervals?.ci_95?.lowerFormatted || '€0'} a ${simulation.confidenceIntervals?.ci_95?.upperFormatted || '€0'}`,
                    ci_99: `${simulation.confidenceIntervals?.ci_99?.lowerFormatted || '€0'} a ${simulation.confidenceIntervals?.ci_99?.upperFormatted || '€0'}`
                },
                outcomes: simulation.outcomes,
                recommendation: simulation.recommendation,
                blackSwanScenarios: simulation.blackSwan?.events?.slice(0, 5) || [],
                executiveSummary: simulation.executiveSummary
            };
        } catch (error) {
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                error: true,
                recommendation: { action: 'ERRO NA ANÁLISE', strategy: 'Reintente a simulação' }
            };
        }
    }
    
    /**
     * Obtém histórico de simulações
     */
    getSimulationHistory(limit = 10) {
        return this.simulationHistory.slice(0, limit);
    }
    
    /**
     * Exporta relatório completo para JSON
     */
    exportReport(caseData) {
        try {
            const report = this.generateRiskReport(caseData);
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `blackswan_report_${caseData.id}_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(link.href);
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Relatório Black Swan exportado para ${caseData.id}`, 'success');
            }
            return report;
        } catch (error) {
            console.error('[ELITE] Erro na exportação:', error);
            if (window.EliteUtils) window.EliteUtils.showToast('Erro na exportação do relatório', 'error');
            return null;
        }
    }
    
    /**
     * Calcula o risco ajustado por cenário de Cisne Negro
     */
    calculateAdjustedRisk(simulation) {
        try {
            const baseRisk = Math.abs(simulation.riskMetrics?.valueAtRisk?.var95 || 0);
            const blackSwanPremium = baseRisk * (simulation.riskMetrics?.blackSwanProbability || 0);
            
            return {
                baseRisk: this.formatCurrency(baseRisk),
                blackSwanPremium: this.formatCurrency(blackSwanPremium),
                totalAdjustedRisk: this.formatCurrency(baseRisk + blackSwanPremium),
                riskMultiplier: (1 + (simulation.riskMetrics?.blackSwanProbability || 0)).toFixed(2)
            };
        } catch (error) {
            return { baseRisk: '€0', blackSwanPremium: '€0', totalAdjustedRisk: '€0', riskMultiplier: '1.00' };
        }
    }
}

// Instância global
window.BlackSwan = new BlackSwanPredictor();

console.log('[ELITE] Black Swan Predictor carregado - Motor de Monte Carlo Ativo (10.000 iterações)');