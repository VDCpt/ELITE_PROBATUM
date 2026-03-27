/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE AI ASSISTANT EXTENSION
 * ============================================================================
 * Extensão do AI Assistant com funcionalidades adicionais:
 * - Análise de padrões jurisprudenciais profundos
 * - Previsão de comportamento de magistrados
 * - Recomendações estratégicas avançadas
 * - Simulação de argumentação adversarial
 * ============================================================================
 */

class AIAssistantExtension {
    constructor(assistant) {
        this.assistant = assistant || window.AIAssistant;
        this.initialized = false;
        this.judicialPatterns = new Map();
        this.argumentationSimulations = new Map();
        
        this.loadJudicialPatterns();
        this.loadArgumentationSimulations();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.assistant) {
                console.warn('[ELITE] AI Assistant não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initJudicialPatterns();
            console.log('[ELITE] AI Assistant Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega padrões judiciais
     */
    loadJudicialPatterns() {
        try {
            const stored = localStorage.getItem('elite_judicial_patterns');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.judicialPatterns.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar padrões judiciais:', e);
        }
    }
    
    /**
     * Salva padrões judiciais
     */
    saveJudicialPatterns() {
        try {
            const patternsObj = {};
            for (const [key, value] of this.judicialPatterns) {
                patternsObj[key] = value;
            }
            localStorage.setItem('elite_judicial_patterns', JSON.stringify(patternsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar padrões judiciais:', e);
        }
    }
    
    /**
     * Carrega simulações de argumentação
     */
    loadArgumentationSimulations() {
        try {
            const stored = localStorage.getItem('elite_argumentation_sims');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.argumentationSimulations.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar simulações de argumentação:', e);
        }
    }
    
    /**
     * Salva simulações de argumentação
     */
    saveArgumentationSimulations() {
        try {
            const simsObj = {};
            for (const [key, value] of this.argumentationSimulations) {
                simsObj[key] = value;
            }
            localStorage.setItem('elite_argumentation_sims', JSON.stringify(simsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar simulações de argumentação:', e);
        }
    }
    
    /**
     * Inicializa padrões judiciais de demonstração
     */
    initJudicialPatterns() {
        if (this.judicialPatterns.size === 0) {
            const patterns = {
                'STA_FISCAL': {
                    court: 'STA',
                    area: 'fiscal',
                    avgDecisionTime: 210,
                    successRate: 0.58,
                    preferredArguments: ['dac7', 'preço_transferência', 'omissão'],
                    avoidedArguments: ['formalismo', 'decadência'],
                    typicalOutcome: 'favorable'
                },
                'TCA_LABORAL': {
                    court: 'TCA',
                    area: 'laboral',
                    avgDecisionTime: 135,
                    successRate: 0.72,
                    preferredArguments: ['contrato_trabalho', 'despedimento', 'antiguidade'],
                    avoidedArguments: ['formalismo', 'caducidade'],
                    typicalOutcome: 'favorable'
                },
                'CAAD_ARBITRAGEM': {
                    court: 'CAAD',
                    area: 'arbitragem',
                    avgDecisionTime: 85,
                    successRate: 0.82,
                    preferredArguments: ['eficiência', 'celeridade', 'prova_digital'],
                    avoidedArguments: ['dilações', 'formalismo'],
                    typicalOutcome: 'favorable'
                },
                'TRIBUNAL_CIVEL': {
                    court: 'Tribunal Judicial',
                    area: 'civil',
                    avgDecisionTime: 165,
                    successRate: 0.62,
                    preferredArguments: ['prova_documental', 'contrato', 'obrigações'],
                    avoidedArguments: ['equidade', 'interpretação_extensiva'],
                    typicalOutcome: 'neutral'
                }
            };
            for (const [key, value] of Object.entries(patterns)) {
                this.judicialPatterns.set(key, value);
            }
            this.saveJudicialPatterns();
        }
    }
    
    /**
     * Analisa padrões jurisprudenciais profundos
     */
    analyzeDeepJurisprudence(caseData) {
        try {
            const relevantPatterns = [];
            const predictions = [];
            
            for (const [key, pattern] of this.judicialPatterns) {
                if (pattern.area === caseData.category || pattern.court === caseData.court) {
                    relevantPatterns.push(pattern);
                    
                    const prediction = this.predictOutcomeByPattern(pattern, caseData);
                    predictions.push({
                        pattern: key,
                        court: pattern.court,
                        predictedOutcome: prediction.outcome,
                        confidence: prediction.confidence,
                        keyFactors: prediction.factors
                    });
                }
            }
            
            const aggregatedPrediction = this.aggregatePredictions(predictions);
            
            return {
                caseId: caseData.id,
                analyzedAt: new Date().toISOString(),
                relevantPatterns: relevantPatterns.length,
                predictions: predictions,
                aggregatedPrediction: aggregatedPrediction,
                recommendedArguments: this.extractRecommendedArguments(predictions),
                avoidedArguments: this.extractAvoidedArguments(predictions)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de jurisprudência profunda:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Prediz resultado por padrão
     */
    predictOutcomeByPattern(pattern, caseData) {
        let outcome = pattern.typicalOutcome;
        let confidence = pattern.successRate;
        let factors = [];
        
        if (pattern.preferredArguments) {
            const matchingArgs = pattern.preferredArguments.filter(arg => 
                caseData.description?.toLowerCase().includes(arg) || 
                caseData.evidence?.some(e => e.toLowerCase().includes(arg))
            );
            if (matchingArgs.length > 0) {
                confidence += 0.05 * matchingArgs.length;
                factors.push(`Argumentos alinhados: ${matchingArgs.join(', ')}`);
            }
        }
        
        if (pattern.avoidedArguments) {
            const conflictingArgs = pattern.avoidedArguments.filter(arg => 
                caseData.description?.toLowerCase().includes(arg)
            );
            if (conflictingArgs.length > 0) {
                confidence -= 0.08 * conflictingArgs.length;
                factors.push(`Evitar: ${conflictingArgs.join(', ')}`);
            }
        }
        
        confidence = Math.min(Math.max(confidence, 0.3), 0.95);
        
        return {
            outcome: confidence > 0.65 ? 'favorable' : confidence > 0.45 ? 'neutral' : 'unfavorable',
            confidence: (confidence * 100).toFixed(0) + '%',
            factors: factors
        };
    }
    
    /**
     * Agrega previsões de múltiplos padrões
     */
    aggregatePredictions(predictions) {
        if (predictions.length === 0) {
            return { outcome: 'indeterminado', confidence: '0%', consensus: false };
        }
        
        const favorableCount = predictions.filter(p => p.predictedOutcome === 'favorable').length;
        const unfavorableCount = predictions.filter(p => p.predictedOutcome === 'unfavorable').length;
        const neutralCount = predictions.filter(p => p.predictedOutcome === 'neutral').length;
        
        let outcome = 'indeterminado';
        let confidence = 0;
        
        if (favorableCount > unfavorableCount && favorableCount > neutralCount) {
            outcome = 'favorable';
            confidence = favorableCount / predictions.length;
        } else if (unfavorableCount > favorableCount && unfavorableCount > neutralCount) {
            outcome = 'unfavorable';
            confidence = unfavorableCount / predictions.length;
        } else if (neutralCount > favorableCount && neutralCount > unfavorableCount) {
            outcome = 'neutral';
            confidence = neutralCount / predictions.length;
        }
        
        return {
            outcome: outcome,
            confidence: (confidence * 100).toFixed(0) + '%',
            consensus: favorableCount > predictions.length / 2 || unfavorableCount > predictions.length / 2,
            breakdown: { favorable: favorableCount, unfavorable: unfavorableCount, neutral: neutralCount }
        };
    }
    
    /**
     * Extrai argumentos recomendados
     */
    extractRecommendedArguments(predictions) {
        const args = new Set();
        for (const pred of predictions) {
            if (pred.predictedOutcome === 'favorable') {
                const pattern = this.judicialPatterns.get(pred.pattern);
                if (pattern?.preferredArguments) {
                    pattern.preferredArguments.forEach(arg => args.add(arg));
                }
            }
        }
        return Array.from(args).slice(0, 5);
    }
    
    /**
     * Extrai argumentos a evitar
     */
    extractAvoidedArguments(predictions) {
        const args = new Set();
        for (const pred of predictions) {
            if (pred.predictedOutcome === 'unfavorable') {
                const pattern = this.judicialPatterns.get(pred.pattern);
                if (pattern?.avoidedArguments) {
                    pattern.avoidedArguments.forEach(arg => args.add(arg));
                }
            }
        }
        return Array.from(args).slice(0, 5);
    }
    
    /**
     * Simula argumentação adversarial
     */
    simulateAdversarialArgumentation(caseData, platform) {
        try {
            const simulationId = Date.now();
            const argumentsList = this.generateAdversarialArguments(caseData, platform);
            const counterArguments = this.generateCounterArguments(argumentsList, caseData);
            
            const simulation = {
                id: simulationId,
                caseId: caseData.id,
                platform: platform,
                timestamp: new Date().toISOString(),
                adversarialArguments: argumentsList,
                counterArguments: counterArguments,
                strengthScore: this.calculateArgumentStrength(argumentsList, counterArguments),
                recommendedResponses: this.getRecommendedResponses(argumentsList),
                winningStrategy: this.determineWinningStrategy(argumentsList, counterArguments)
            };
            
            this.argumentationSimulations.set(simulationId, simulation);
            this.saveArgumentationSimulations();
            
            return simulation;
        } catch (error) {
            console.error('[ELITE] Erro na simulação de argumentação adversarial:', error);
            return { error: true, message: 'Erro na simulação' };
        }
    }
    
    /**
     * Gera argumentos adversariais
     */
    generateAdversarialArguments(caseData, platform) {
        const arguments_list = [];
        
        // Argumentos baseados na plataforma
        if (platform === 'bolt') {
            arguments_list.push({
                type: 'jurisdictional',
                text: 'A Bolt Operations OÜ tem sede na Estónia, aplicando-se a legislação estónia e não a portuguesa.',
                strength: 0.65,
                counter: 'Art. 4.º do Regulamento Roma I - lei do país do prestador de serviços'
            });
            arguments_list.push({
                type: 'technical',
                text: 'Os algoritmos de cálculo de comissões são propriedade intelectual protegida e não podem ser revelados.',
                strength: 0.55,
                counter: 'Art. 432.º CPC - produção antecipada de provas essenciais'
            });
        } else if (platform === 'uber') {
            arguments_list.push({
                type: 'contractual',
                text: 'Os Termos de Serviço preveem arbitragem vinculativa nos Países Baixos.',
                strength: 0.70,
                counter: 'Art. 30.º RL - cláusulas abusivas em contratos de adesão'
            });
            arguments_list.push({
                type: 'evidentiary',
                text: 'O requerente não apresentou prova documental suficiente da discrepância.',
                strength: 0.60,
                counter: 'Art. 344.º CC - inversão do ónus da prova'
            });
        }
        
        // Argumentos baseados na percentagem de omissão
        if (caseData.omissionPercentage < 40) {
            arguments_list.push({
                type: 'de_minimis',
                text: 'A discrepância é inferior a 40%, não configurando omissão material.',
                strength: 0.55,
                counter: 'Art. 104.º RGIT - acumulação de omissões configura fraude qualificada'
            });
        } else if (caseData.omissionPercentage > 70) {
            arguments_list.push({
                type: 'fraud',
                text: 'A percentagem de omissão superior a 70% pode indicar dolo do requerente.',
                strength: 0.50,
                counter: 'Art. 103.º RGIT - dolo da plataforma na retenção indevida'
            });
        }
        
        // Argumentos baseados no valor
        if (caseData.value < 15000) {
            arguments_list.push({
                type: 'value',
                text: 'O valor em disputa é inferior ao limiar de fraude fiscal qualificada (€15.000).',
                strength: 0.60,
                counter: 'Art. 104.º RGIT - reincidência configura fraude qualificada'
            });
        }
        
        return arguments_list;
    }
    
    /**
     * Gera contra-argumentos
     */
    generateCounterArguments(adversarialArgs, caseData) {
        return adversarialArgs.map(arg => ({
            against: arg.text,
            counter: arg.counter,
            strength: 0.7,
            legalBasis: this.getLegalBasisForCounter(arg.type)
        }));
    }
    
    /**
     * Obtém base legal para contra-argumento
     */
    getLegalBasisForCounter(type) {
        const bases = {
            jurisdictional: 'Art. 4.º Regulamento Roma I; Art. 30.º RL',
            technical: 'Art. 432.º CPC; ISO/IEC 27037:2012',
            contractual: 'Art. 30.º RL; Art. 344.º CC',
            evidentiary: 'Art. 344.º CC; Art. 376.º CC',
            de_minimis: 'Art. 104.º RGIT; Jurisprudência STA',
            fraud: 'Art. 103.º RGIT; Art. 104.º RGIT',
            value: 'Art. 104.º RGIT; Acórdão STA 0456/2024'
        };
        return bases[type] || 'Artigos aplicáveis conforme legislação vigente';
    }
    
    /**
     * Calcula força da argumentação
     */
    calculateArgumentStrength(adversarialArgs, counterArgs) {
        const avgAdversarialStrength = adversarialArgs.reduce((s, a) => s + a.strength, 0) / (adversarialArgs.length || 1);
        const avgCounterStrength = counterArgs.reduce((s, c) => s + c.strength, 0) / (counterArgs.length || 1);
        
        const netStrength = avgCounterStrength - avgAdversarialStrength;
        
        return {
            score: ((netStrength + 0.5) * 100).toFixed(0) + '%',
            classification: netStrength > 0.2 ? 'Favorável' : netStrength > -0.1 ? 'Equilibrado' : 'Desfavorável',
            adversarialAverage: (avgAdversarialStrength * 100).toFixed(0) + '%',
            counterAverage: (avgCounterStrength * 100).toFixed(0) + '%'
        };
    }
    
    /**
     * Obtém respostas recomendadas
     */
    getRecommendedResponses(adversarialArgs) {
        return adversarialArgs.map(arg => ({
            argument: arg.text,
            recommendedResponse: arg.counter,
            priority: arg.strength > 0.65 ? 'alta' : 'média'
        }));
    }
    
    /**
     * Determina estratégia vencedora
     */
    determineWinningStrategy(adversarialArgs, counterArgs) {
        const avgAdversarial = adversarialArgs.reduce((s, a) => s + a.strength, 0) / (adversarialArgs.length || 1);
        const avgCounter = counterArgs.reduce((s, c) => s + c.strength, 0) / (counterArgs.length || 1);
        
        if (avgCounter > avgAdversarial + 0.15) {
            return {
                name: 'Ofensiva',
                description: 'Contra-argumentação robusta. Avançar com ação judicial.',
                confidence: 'alta'
            };
        } else if (avgCounter > avgAdversarial - 0.1) {
            return {
                name: 'Equilibrada',
                description: 'Forças equilibradas. Considerar acordo ou arbitragem.',
                confidence: 'média'
            };
        } else {
            return {
                name: 'Defensiva',
                description: 'Argumentação adversária forte. Priorizar acordo.',
                confidence: 'alta'
            };
        }
    }
    
    /**
     * Gera relatório completo de IA avançada
     */
    generateAdvancedAIReport(caseData, platform) {
        try {
            const basePrediction = this.assistant.predictSuccess(caseData);
            const jurisprudenceAnalysis = this.analyzeDeepJurisprudence(caseData);
            const adversarialSimulation = this.simulateAdversarialArgumentation(caseData, platform);
            
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                platform: platform,
                basePrediction: {
                    probability: basePrediction.probabilityPercent,
                    confidence: basePrediction.confidenceScore,
                    riskLevel: basePrediction.riskLevel
                },
                jurisprudenceAnalysis: {
                    patternsFound: jurisprudenceAnalysis.relevantPatterns,
                    aggregatedPrediction: jurisprudenceAnalysis.aggregatedPrediction,
                    recommendedArguments: jurisprudenceAnalysis.recommendedArguments,
                    avoidedArguments: jurisprudenceAnalysis.avoidedArguments
                },
                adversarialSimulation: {
                    adversarialArguments: adversarialSimulation.adversarialArguments,
                    counterArguments: adversarialSimulation.counterArguments,
                    strengthScore: adversarialSimulation.strengthScore,
                    winningStrategy: adversarialSimulation.winningStrategy
                },
                integratedRecommendation: this.integrateRecommendations(basePrediction, jurisprudenceAnalysis, adversarialSimulation),
                confidenceScore: (basePrediction.probability * 0.4 + 
                                 (jurisprudenceAnalysis.aggregatedPrediction?.confidence / 100 || 0) * 0.3 + 
                                 (adversarialSimulation.strengthScore?.score / 100 || 0) * 0.3).toFixed(1) + '%'
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório avançado:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Integra recomendações de múltiplas fontes
     */
    integrateRecommendations(basePrediction, jurisprudenceAnalysis, adversarialSimulation) {
        const recommendations = [];
        
        if (basePrediction.probability > 0.7) {
            recommendations.push('Alta probabilidade de sucesso - avançar com litígio');
        } else if (basePrediction.probability < 0.4) {
            recommendations.push('Baixa probabilidade de sucesso - priorizar acordo');
        }
        
        if (jurisprudenceAnalysis.recommendedArguments?.length > 0) {
            recommendations.push(`Incorporar argumentos: ${jurisprudenceAnalysis.recommendedArguments.slice(0, 3).join(', ')}`);
        }
        
        if (jurisprudenceAnalysis.avoidedArguments?.length > 0) {
            recommendations.push(`Evitar argumentos: ${jurisprudenceAnalysis.avoidedArguments.slice(0, 3).join(', ')}`);
        }
        
        if (adversarialSimulation.winningStrategy?.name === 'Ofensiva') {
            recommendations.push('Estratégia ofensiva recomendada - contra-argumentação robusta');
        } else if (adversarialSimulation.winningStrategy?.name === 'Defensiva') {
            recommendations.push('Estratégia defensiva - considerar acordo');
        }
        
        return {
            primary: recommendations[0] || 'Manter estratégia atual',
            secondary: recommendations.slice(1, 3),
            overall: recommendations.length > 2 ? 'Múltiplas recomendações - priorizar as de maior impacto' : 'Recomendações alinhadas'
        };
    }
    
    /**
     * Renderiza dashboard de IA avançada
     */
    renderDashboard(containerId, caseData, platform) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateAdvancedAIReport(caseData, platform);
            
            container.innerHTML = `
                <div class="ai-assistant-extension">
                    <div class="dashboard-header"><h2><i class="fas fa-brain"></i> AI ASSISTANT EXTENSION - ANÁLISE AVANÇADA</h2><div class="confidence-badge">Confiança: ${report.confidenceScore || 'N/A'}</div></div>
                    
                    <div class="ai-summary"><div class="summary-card"><div class="summary-value">${report.basePrediction?.probability || 'N/A'}</div><div class="summary-label">Probabilidade Base</div><div class="summary-sub">Risco: ${report.basePrediction?.riskLevel || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.jurisprudenceAnalysis?.aggregatedPrediction?.outcome?.toUpperCase() || 'N/A'}</div><div class="summary-label">Previsão Jurisprudencial</div><div class="summary-sub">Confiança: ${report.jurisprudenceAnalysis?.aggregatedPrediction?.confidence || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.adversarialSimulation?.strengthScore?.classification || 'N/A'}</div><div class="summary-label">Força Argumentativa</div><div class="summary-sub">Score: ${report.adversarialSimulation?.strengthScore?.score || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.adversarialSimulation?.winningStrategy?.name || 'N/A'}</div><div class="summary-label">Estratégia Vencedora</div><div class="summary-sub">${report.adversarialSimulation?.winningStrategy?.description || ''}</div></div></div>
                    
                    <div class="jurisprudence-section"><h3><i class="fas fa-book"></i> ANÁLISE JURISPRUDENCIAL PROFUNDA</h3><div class="jurisprudence-card"><div class="patterns-found"><strong>Padrões Identificados:</strong> ${report.jurisprudenceAnalysis?.patternsFound || 0}</div>
                    <div class="prediction-detail"><strong>Previsão Agregada:</strong> ${report.jurisprudenceAnalysis?.aggregatedPrediction?.outcome?.toUpperCase() || 'N/A'} (${report.jurisprudenceAnalysis?.aggregatedPrediction?.confidence || '0%'} confiança)</div>
                    <div class="arguments-recommended"><strong>Argumentos Recomendados:</strong><ul>${report.jurisprudenceAnalysis?.recommendedArguments?.map(a => `<li>${a}</li>`).join('')}</ul></div>
                    <div class="arguments-avoided"><strong>Argumentos a Evitar:</strong><ul>${report.jurisprudenceAnalysis?.avoidedArguments?.map(a => `<li>${a}</li>`).join('')}</ul></div></div></div>
                    
                    <div class="adversarial-section"><h3><i class="fas fa-gavel"></i> SIMULAÇÃO DE ARGUMENTAÇÃO ADVERSARIAL</h3><div class="adversarial-grid">${report.adversarialSimulation?.adversarialArguments?.map(a => `
                        <div class="argument-card"><div class="argument-type">${a.type.toUpperCase()}</div><div class="argument-text">"${a.text}"</div><div class="argument-strength">Força: ${(a.strength * 100).toFixed(0)}%</div><div class="argument-counter"><strong>Contra-argumento:</strong> ${a.counter}</div></div>
                    `).join('')}</div>
                    <div class="strength-analysis"><div class="strength-meter"><div class="strength-fill" style="width: ${report.adversarialSimulation?.strengthScore?.score || '0%'}"></div><span>Força da Posição: ${report.adversarialSimulation?.strengthScore?.score || '0%'}</span></div>
                    <div class="strategy-recommendation"><strong>Estratégia Recomendada:</strong> ${report.adversarialSimulation?.winningStrategy?.name || 'N/A'}<br><small>${report.adversarialSimulation?.winningStrategy?.description || ''}</small></div></div></div>
                    
                    <div class="recommendation-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÃO INTEGRADA</h3><div class="recommendation-card"><div class="primary-rec"><strong>Recomendação Principal:</strong> ${report.integratedRecommendation?.primary || 'N/A'}</div>
                    <div class="secondary-rec"><strong>Recomendações Secundárias:</strong><ul>${report.integratedRecommendation?.secondary?.map(r => `<li>${r}</li>`).join('')}</ul></div>
                    <div class="overall-rec"><strong>Análise Global:</strong> ${report.integratedRecommendation?.overall || 'N/A'}</div></div></div>
                </div>
                <style>
                    .ai-assistant-extension{ padding:0; } .confidence-badge{ background:var(--elite-primary-dim); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; color:var(--elite-primary); } .ai-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .summary-card{ background:var(--bg-command); border-radius:16px; padding:20px; text-align:center; } .jurisprudence-card{ background:var(--bg-terminal); border-radius:12px; padding:20px; } .adversarial-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; margin-bottom:20px; } .argument-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border-left:3px solid var(--elite-primary); } .argument-type{ font-size:0.6rem; color:#94a3b8; margin-bottom:8px; } .argument-text{ font-size:0.85rem; margin-bottom:8px; } .argument-strength{ font-size:0.7rem; color:#ffc107; margin-bottom:8px; } .argument-counter{ font-size:0.7rem; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-tactic); } .strength-meter{ height:30px; background:var(--bg-terminal); border-radius:15px; overflow:hidden; margin:16px 0; } .strength-fill{ height:100%; background:linear-gradient(90deg,#ff1744,#ffc107,#00e676); width:0; display:flex; align-items:center; justify-content:flex-end; padding-right:12px; color:white; font-size:0.7rem; } .recommendation-card{ background:var(--elite-primary-dim); border-radius:12px; padding:20px; } .primary-rec{ font-size:1rem; font-weight:bold; margin-bottom:12px; } .secondary-rec ul{ margin:8px 0 0 20px; font-size:0.75rem; } @media (max-width:768px){ .ai-summary{ grid-template-columns:1fr 1fr; } .adversarial-grid{ grid-template-columns:1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.AIAssistantExtension = new AIAssistantExtension(window.AIAssistant);

console.log('[ELITE] AI Assistant Extension carregada - Análise Jurisprudencial Avançada Ativa');