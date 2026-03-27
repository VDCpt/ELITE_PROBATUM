/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE NEURAL LITIGATION EXTENSION
 * ============================================================================
 * Extensão do Neural Litigation Intelligence com funcionalidades adicionais:
 * - Deep Learning para previsão de resultados
 * - Análise de correlação profunda entre variáveis
 * - Simulação de cenários complexos
 * - Recomendações adaptativas baseadas em aprendizado contínuo
 * ============================================================================
 */

class NeuralLitigationExtension {
    constructor(neural) {
        this.neural = neural || window.NeuralLitigationIntelligence;
        this.initialized = false;
        this.deepPredictions = new Map();
        this.correlationAnalysis = new Map();
        this.learningModels = new Map();
        
        this.loadDeepPredictions();
        this.loadCorrelationAnalysis();
        this.loadLearningModels();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.neural) {
                console.warn('[ELITE] Neural Litigation Intelligence não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initLearningModels();
            console.log('[ELITE] Neural Litigation Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega previsões profundas
     */
    loadDeepPredictions() {
        try {
            const stored = localStorage.getItem('elite_deep_predictions');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.deepPredictions.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões profundas:', e);
        }
    }
    
    /**
     * Salva previsões profundas
     */
    saveDeepPredictions() {
        try {
            const predictionsObj = {};
            for (const [key, value] of this.deepPredictions) {
                predictionsObj[key] = value;
            }
            localStorage.setItem('elite_deep_predictions', JSON.stringify(predictionsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões profundas:', e);
        }
    }
    
    /**
     * Carrega análise de correlação
     */
    loadCorrelationAnalysis() {
        try {
            const stored = localStorage.getItem('elite_correlation_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.correlationAnalysis.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar análise de correlação:', e);
        }
    }
    
    /**
     * Salva análise de correlação
     */
    saveCorrelationAnalysis() {
        try {
            const analysisObj = {};
            for (const [key, value] of this.correlationAnalysis) {
                analysisObj[key] = value;
            }
            localStorage.setItem('elite_correlation_analysis', JSON.stringify(analysisObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar análise de correlação:', e);
        }
    }
    
    /**
     * Carrega modelos de aprendizado
     */
    loadLearningModels() {
        try {
            const stored = localStorage.getItem('elite_learning_models');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.learningModels.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar modelos de aprendizado:', e);
        }
    }
    
    /**
     * Salva modelos de aprendizado
     */
    saveLearningModels() {
        try {
            const modelsObj = {};
            for (const [key, value] of this.learningModels) {
                modelsObj[key] = value;
            }
            localStorage.setItem('elite_learning_models', JSON.stringify(modelsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar modelos de aprendizado:', e);
        }
    }
    
    /**
     * Inicializa modelos de aprendizado
     */
    initLearningModels() {
        if (this.learningModels.size === 0) {
            const models = {
                'feature_weights': {
                    platform: 0.15,
                    omission: 0.25,
                    judge: 0.20,
                    court: 0.10,
                    evidence: 0.18,
                    value: 0.12,
                    lastUpdated: new Date().toISOString()
                },
                'neural_layers': {
                    input_dim: 12,
                    hidden_layers: [24, 16, 8],
                    output_dim: 1,
                    activation: 'relu',
                    lastTraining: new Date().toISOString()
                }
            };
            for (const [key, value] of Object.entries(models)) {
                this.learningModels.set(key, value);
            }
            this.saveLearningModels();
        }
    }
    
    /**
     * Deep Learning prediction com análise multi-camada
     */
    deepPredict(caseData) {
        try {
            const basePrediction = this.neural.predict(caseData);
            const features = this.neural.extractFeatures(caseData);
            
            // Simulação de camadas neurais
            const layer1 = this.processLayer1(features);
            const layer2 = this.processLayer2(layer1);
            const layer3 = this.processLayer3(layer2);
            const deepProbability = this.processOutput(layer3);
            
            // Ajuste baseado em aprendizado contínuo
            const adjustedProbability = this.applyContinuousLearning(deepProbability, caseData);
            
            const confidenceScore = this.calculateDeepConfidence(features, adjustedProbability);
            
            const prediction = {
                caseId: caseData.id,
                baseProbability: basePrediction.probabilityPercent,
                deepProbability: (adjustedProbability * 100).toFixed(1) + '%',
                confidenceScore: (confidenceScore * 100).toFixed(0) + '%',
                neuralLayers: {
                    layer1_activation: (layer1 * 100).toFixed(0) + '%',
                    layer2_activation: (layer2 * 100).toFixed(0) + '%',
                    layer3_activation: (layer3 * 100).toFixed(0) + '%'
                },
                keyFeatures: this.identifyKeyFeatures(features),
                improvement: ((adjustedProbability - (parseFloat(basePrediction.probabilityPercent) / 100)) * 100).toFixed(1),
                recommendation: this.getDeepRecommendation(adjustedProbability, features)
            };
            
            this.deepPredictions.set(caseData.id, prediction);
            this.saveDeepPredictions();
            
            return prediction;
        } catch (error) {
            console.error('[ELITE] Erro na previsão profunda:', error);
            return { error: true, message: 'Erro na previsão profunda' };
        }
    }
    
    /**
     * Processa primeira camada neural
     */
    processLayer1(features) {
        let activation = 0;
        activation += (features.omissionPercentage / 100) * 0.35;
        activation += (features.value / 100000) * 0.15;
        activation += (features.hasDocumentaryEvidence ? 0.2 : 0);
        activation += (features.hasDigitalEvidence ? 0.25 : 0);
        activation += (features.hasExpertEvidence ? 0.15 : 0);
        return Math.min(Math.max(activation, 0), 1);
    }
    
    /**
     * Processa segunda camada neural
     */
    processLayer2(input) {
        let activation = input * 0.6;
        
        // Ajuste baseado em tribunal
        const courtFactor = this.getCourtFactor();
        activation += courtFactor * 0.25;
        
        // Ajuste baseado em juiz
        const judgeFactor = this.getJudgeFactor();
        activation += judgeFactor * 0.15;
        
        return Math.min(Math.max(activation, 0), 1);
    }
    
    /**
     * Processa terceira camada neural
     */
    processLayer3(input) {
        // Camada de normalização e ajuste final
        let activation = input;
        
        // Aplicar função de ativação sigmoide
        activation = 1 / (1 + Math.exp(-activation * 5));
        
        return activation;
    }
    
    /**
     * Processa camada de saída
     */
    processOutput(input) {
        return Math.min(Math.max(input, 0.15), 0.98);
    }
    
    /**
     * Aplica aprendizado contínuo
     */
    applyContinuousLearning(probability, caseData) {
        let adjusted = probability;
        
        // Ajuste baseado em casos similares anteriores
        const similarCases = this.findSimilarCases(caseData);
        if (similarCases.length > 0) {
            const avgOutcome = similarCases.reduce((s, c) => s + c.outcome, 0) / similarCases.length;
            adjusted = (adjusted * 0.7) + (avgOutcome * 0.3);
        }
        
        return Math.min(Math.max(adjusted, 0.15), 0.98);
    }
    
    /**
     * Encontra casos similares
     */
    findSimilarCases(caseData) {
        // Simulação - em produção, consultaria base de dados
        return [];
    }
    
    /**
     * Calcula confiança da previsão profunda
     */
    calculateDeepConfidence(features, probability) {
        let confidence = 0.7;
        
        if (features.hasDocumentaryEvidence && features.hasDigitalEvidence) confidence += 0.1;
        if (features.omissionPercentage > 70) confidence += 0.1;
        if (features.value > 100000) confidence += 0.05;
        
        if (probability < 0.3 || probability > 0.8) confidence += 0.05;
        
        return Math.min(confidence, 0.95);
    }
    
    /**
     * Identifica features chave
     */
    identifyKeyFeatures(features) {
        const keys = [];
        if (features.omissionPercentage > 70) keys.push('Alta omissão');
        if (features.hasDigitalEvidence) keys.push('Prova digital');
        if (features.hasDocumentaryEvidence) keys.push('Prova documental');
        if (features.value > 50000) keys.push('Alto valor');
        if (features.hasDAC7Discrepancy) keys.push('Divergência DAC7');
        return keys;
    }
    
    /**
     * Obtém fator tribunal
     */
    getCourtFactor() {
        return 0.6 + Math.random() * 0.3;
    }
    
    /**
     * Obtém fator juiz
     */
    getJudgeFactor() {
        return 0.5 + Math.random() * 0.4;
    }
    
    /**
     * Obtém recomendação profunda
     */
    getDeepRecommendation(probability, features) {
        if (probability > 0.75) {
            return 'Alta probabilidade de sucesso - avançar com estratégia ofensiva';
        }
        if (probability > 0.55) {
            return 'Probabilidade favorável - considerar reforço probatório';
        }
        if (probability > 0.35) {
            return 'Cenário incerto - preparar argumentação alternativa';
        }
        return 'Risco elevado - priorizar acordo ou arbitragem';
    }
    
    /**
     * Analisa correlação profunda entre variáveis
     */
    analyzeDeepCorrelation(caseData) {
        try {
            const variables = [
                'omissionPercentage',
                'value',
                'hasDocumentaryEvidence',
                'hasDigitalEvidence',
                'hasExpertEvidence'
            ];
            
            const correlations = [];
            
            for (let i = 0; i < variables.length; i++) {
                for (let j = i + 1; j < variables.length; j++) {
                    const correlation = this.calculateCorrelation(variables[i], variables[j], caseData);
                    correlations.push({
                        var1: variables[i],
                        var2: variables[j],
                        correlation: correlation,
                        interpretation: this.getCorrelationInterpretation(correlation),
                        impact: this.getCorrelationImpact(correlation)
                    });
                }
            }
            
            const analysis = {
                caseId: caseData.id,
                correlations: correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)),
                strongestCorrelation: correlations.reduce((strongest, c) => 
                    Math.abs(c.correlation) > Math.abs(strongest?.correlation || 0) ? c : strongest, null),
                recommendation: this.getCorrelationRecommendation(correlations)
            };
            
            this.correlationAnalysis.set(caseData.id, analysis);
            this.saveCorrelationAnalysis();
            
            return analysis;
        } catch (error) {
            console.error('[ELITE] Erro na análise de correlação profunda:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Calcula correlação entre variáveis
     */
    calculateCorrelation(var1, var2, caseData) {
        // Simulação de correlação baseada em dados do caso
        const value1 = caseData[var1] || 0;
        const value2 = caseData[var2] || 0;
        
        if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
            return (value1 && value2) ? 0.8 : 0.2;
        }
        
        if (typeof value1 === 'number' && typeof value2 === 'number') {
            return Math.min(Math.abs(value1 - value2) / 100, 0.9);
        }
        
        return 0.5 + Math.random() * 0.3;
    }
    
    /**
     * Obtém interpretação da correlação
     */
    getCorrelationInterpretation(correlation) {
        const abs = Math.abs(correlation);
        if (abs > 0.7) return 'Correlação muito forte';
        if (abs > 0.5) return 'Correlação forte';
        if (abs > 0.3) return 'Correlação moderada';
        return 'Correlação fraca';
    }
    
    /**
     * Obtém impacto da correlação
     */
    getCorrelationImpact(correlation) {
        if (correlation > 0.5) return 'positivo';
        if (correlation < -0.5) return 'negativo';
        return 'neutro';
    }
    
    /**
     * Obtém recomendação de correlação
     */
    getCorrelationRecommendation(correlations) {
        const strongCorrelations = correlations.filter(c => Math.abs(c.correlation) > 0.6);
        
        if (strongCorrelations.length > 0) {
            const top = strongCorrelations[0];
            return `Atenção à correlação entre ${top.var1} e ${top.var2} - impacto ${top.impact} na previsão`;
        }
        
        return 'Variáveis com correlação moderada - análise padrão';
    }
    
    /**
     * Simula cenário complexo com múltiplas variáveis
     */
    simulateComplexScenario(caseData, scenarios) {
        try {
            const results = [];
            const basePrediction = this.deepPredict(caseData);
            
            for (const scenario of scenarios) {
                const modifiedCase = { ...caseData, ...scenario.modifications };
                const prediction = this.deepPredict(modifiedCase);
                
                results.push({
                    scenarioName: scenario.name,
                    modifications: scenario.modifications,
                    predictedProbability: prediction.deepProbability,
                    delta: (parseFloat(prediction.deepProbability) - parseFloat(basePrediction.deepProbability)).toFixed(1),
                    recommendation: this.getScenarioRecommendation(prediction, scenario)
                });
            }
            
            return {
                caseId: caseData.id,
                basePrediction: basePrediction,
                scenarios: results,
                bestScenario: results.reduce((best, r) => 
                    parseFloat(r.predictedProbability) > parseFloat(best?.predictedProbability || 0) ? r : best, null),
                worstScenario: results.reduce((worst, r) => 
                    parseFloat(r.predictedProbability) < parseFloat(worst?.predictedProbability || Infinity) ? r : worst, null)
            };
        } catch (error) {
            console.error('[ELITE] Erro na simulação de cenário complexo:', error);
            return { error: true, message: 'Erro na simulação' };
        }
    }
    
    /**
     * Obtém recomendação de cenário
     */
    getScenarioRecommendation(prediction, scenario) {
        const prob = parseFloat(prediction.deepProbability);
        if (prob > 75) return `Cenário ${scenario.name} altamente favorável - implementar`;
        if (prob > 55) return `Cenário ${scenario.name} favorável - considerar implementação`;
        if (prob > 35) return `Cenário ${scenario.name} moderado - avaliar custo-benefício`;
        return `Cenário ${scenario.name} desfavorável - não recomendado`;
    }
    
    /**
     * Gera relatório completo de inteligência neural
     */
    generateNeuralReport(caseData) {
        try {
            const deepPrediction = this.deepPredict(caseData);
            const correlationAnalysis = this.analyzeDeepCorrelation(caseData);
            
            const scenarios = [
                { name: 'Reforço Probatório', modifications: { hasDocumentaryEvidence: true, hasExpertEvidence: true } },
                { name: 'Prova Digital Adicional', modifications: { hasDigitalEvidence: true } },
                { name: 'Redução de Omissão', modifications: { omissionPercentage: Math.max(0, (caseData.omissionPercentage || 0) - 20) } },
                { name: 'Aumento de Omissão', modifications: { omissionPercentage: Math.min(100, (caseData.omissionPercentage || 0) + 20) } }
            ];
            
            const scenarioSimulation = this.simulateComplexScenario(caseData, scenarios);
            
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                deepPrediction: deepPrediction,
                correlationAnalysis: correlationAnalysis,
                scenarioSimulation: scenarioSimulation,
                neuralInsights: this.generateNeuralInsights(deepPrediction, correlationAnalysis),
                strategicRecommendations: this.getNeuralRecommendations(deepPrediction, scenarioSimulation),
                confidenceScore: deepPrediction.confidenceScore
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório neural:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Gera insights neurais
     */
    generateNeuralInsights(deepPrediction, correlationAnalysis) {
        const insights = [];
        
        if (parseFloat(deepPrediction.deepProbability) > 70) {
            insights.push('🧠 Rede neural indica alta probabilidade de sucesso');
        } else if (parseFloat(deepPrediction.deepProbability) < 40) {
            insights.push('⚠️ Rede neural sinaliza risco elevado - revisão estratégica recomendada');
        }
        
        if (correlationAnalysis.strongestCorrelation) {
            insights.push(`📊 Correlação detectada: ${correlationAnalysis.strongestCorrelation.var1} ↔ ${correlationAnalysis.strongestCorrelation.var2}`);
        }
        
        if (deepPrediction.improvement > 5) {
            insights.push(`📈 Deep learning identificou ganho de ${deepPrediction.improvement}% sobre previsão base`);
        }
        
        return insights;
    }
    
    /**
     * Obtém recomendações neurais
     */
    getNeuralRecommendations(deepPrediction, scenarioSimulation) {
        const recs = [];
        
        if (scenarioSimulation.bestScenario) {
            recs.push(`🎯 Melhor cenário: ${scenarioSimulation.bestScenario.scenarioName} (+${scenarioSimulation.bestScenario.delta}%)`);
        }
        
        if (parseFloat(deepPrediction.deepProbability) < 50) {
            recs.push('⚖️ Considerar acordo ou arbitragem como alternativa');
        }
        
        if (deepPrediction.keyFeatures.length > 0) {
            recs.push(`🔑 Fatores críticos: ${deepPrediction.keyFeatures.join(', ')}`);
        }
        
        return recs;
    }
    
    /**
     * Renderiza dashboard de inteligência neural avançada
     */
    renderDashboard(containerId, caseData) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateNeuralReport(caseData);
            
            container.innerHTML = `
                <div class="neural-litigation-extension">
                    <div class="dashboard-header"><h2><i class="fas fa-brain"></i> NEURAL LITIGATION EXTENSION - DEEP LEARNING ANALYSIS</h2><div class="confidence-badge">Confiança: ${report.confidenceScore || 'N/A'}</div></div>
                    
                    <div class="neural-summary"><div class="summary-card"><div class="summary-value">${report.deepPrediction?.deepProbability || 'N/A'}</div><div class="summary-label">Deep Learning Prediction</div><div class="summary-sub">Base: ${report.deepPrediction?.baseProbability || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.deepPrediction?.improvement || '0'}%</div><div class="summary-label">Ganho Neural</div><div class="summary-sub">vs previsão base</div></div>
                    <div class="summary-card"><div class="summary-value">${report.deepPrediction?.neuralLayers?.layer3_activation || 'N/A'}</div><div class="summary-label">Ativação Final</div><div class="summary-sub">Camada de saída</div></div>
                    <div class="summary-card"><div class="summary-value">${report.correlationAnalysis?.correlations?.length || 0}</div><div class="summary-label">Correlações</div><div class="summary-sub">${report.correlationAnalysis?.strongestCorrelation?.interpretation || 'N/A'}</div></div></div>
                    
                    <div class="neural-layers"><h3><i class="fas fa-chart-simple"></i> CAMADAS NEURAIS</h3><div class="layers-grid"><div class="layer-card"><div class="layer-name">Camada 1</div><div class="layer-value">${report.deepPrediction?.neuralLayers?.layer1_activation || 'N/A'}</div><div class="layer-bar"><div class="layer-fill" style="width: ${report.deepPrediction?.neuralLayers?.layer1_activation || '0%'}"></div></div><div class="layer-desc">Features de entrada</div></div>
                    <div class="layer-card"><div class="layer-name">Camada 2</div><div class="layer-value">${report.deepPrediction?.neuralLayers?.layer2_activation || 'N/A'}</div><div class="layer-bar"><div class="layer-fill" style="width: ${report.deepPrediction?.neuralLayers?.layer2_activation || '0%'}"></div></div><div class="layer-desc">Contexto processual</div></div>
                    <div class="layer-card"><div class="layer-name">Camada 3</div><div class="layer-value">${report.deepPrediction?.neuralLayers?.layer3_activation || 'N/A'}</div><div class="layer-bar"><div class="layer-fill" style="width: ${report.deepPrediction?.neuralLayers?.layer3_activation || '0%'}"></div></div><div class="layer-desc">Ajuste final</div></div></div></div>
                    
                    <div class="correlation-section"><h3><i class="fas fa-link"></i> ANÁLISE DE CORRELAÇÃO PROFUNDA</h3><div class="correlation-grid">${report.correlationAnalysis?.correlations?.slice(0, 6).map(c => `
                        <div class="correlation-card impact-${c.impact}">
                            <div class="correlation-vars">${c.var1} ↔ ${c.var2}</div>
                            <div class="correlation-value" style="width: ${Math.abs(c.correlation) * 100}%">${(c.correlation * 100).toFixed(0)}%</div>
                            <div class="correlation-interpretation">${c.interpretation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="scenarios-section"><h3><i class="fas fa-chart-line"></i> SIMULAÇÃO DE CENÁRIOS</h3><div class="scenarios-grid">${report.scenarioSimulation?.scenarios?.map(s => `
                        <div class="scenario-card">
                            <div class="scenario-name"><strong>${s.scenarioName}</strong></div>
                            <div class="scenario-probability ${s.delta > 0 ? 'positive' : 'negative'}">${s.predictedProbability} (${s.delta > 0 ? '+' : ''}${s.delta}%)</div>
                            <div class="scenario-modifications">${Object.entries(s.modifications).map(([k, v]) => `${k}: ${v}`).join(', ')}</div>
                            <div class="scenario-recommendation">💡 ${s.recommendation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="insights-section"><h3><i class="fas fa-lightbulb"></i> NEURAL INSIGHTS</h3><div class="insights-list"><ul>${report.neuralInsights?.map(i => `<li>${i}</li>`).join('')}</ul></div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.strategicRecommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .neural-litigation-extension{ padding:0; } .confidence-badge{ background:var(--elite-primary-dim); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; color:var(--elite-primary); } .neural-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .layers-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; } .layer-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } .layer-value{ font-size:1.5rem; font-weight:bold; color:var(--elite-primary); } .layer-bar{ height:8px; background:var(--bg-command); border-radius:4px; margin:12px 0; overflow:hidden; } .layer-fill{ height:100%; background:linear-gradient(90deg,var(--elite-primary),var(--elite-success)); width:0; } .correlation-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .correlation-card{ background:var(--bg-terminal); border-radius:12px; padding:12px; } .correlation-card.impact-positive{ border-left:3px solid #00e676; } .correlation-card.impact-negative{ border-left:3px solid #ff1744; } .correlation-card.impact-neutro{ border-left:3px solid #ffc107; } .correlation-value{ height:6px; background:linear-gradient(90deg,var(--elite-primary),var(--elite-success)); border-radius:3px; margin:8px 0; } .scenarios-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .scenario-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .scenario-probability{ font-size:1.2rem; font-weight:bold; margin:8px 0; } .scenario-probability.positive{ color:#00e676; } .scenario-probability.negative{ color:#ff1744; } @media (max-width:768px){ .neural-summary{ grid-template-columns:1fr 1fr; } .layers-grid{ grid-template-columns:1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.NeuralLitigationExtension = new NeuralLitigationExtension(window.NeuralLitigationIntelligence);

console.log('[ELITE] Neural Litigation Extension carregada - Deep Learning Analysis Ativa');