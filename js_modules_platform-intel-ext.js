/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE PLATFORM INTELLIGENCE EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão adicional do Platform Intelligence com funcionalidades avançadas:
 * - Análise de padrões de litígio por plataforma
 * - Previsão de comportamento processual
 * - Estratégias de negociação por perfil
 * - Monitorização de jurisprudência específica
 * ============================================================================
 */

class PlatformIntelligenceExtensionExtended {
    constructor(intel) {
        this.intel = intel || window.PlatformIntelligence;
        this.initialized = false;
        this.platformPatterns = new Map();
        this.litigationForecasts = new Map();
        this.negotiationProfiles = new Map();
        
        this.loadPlatformPatterns();
        this.loadLitigationForecasts();
        this.loadNegotiationProfiles();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.intel) {
                console.warn('[ELITE] Platform Intelligence não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initPlatformPatterns();
            console.log('[ELITE] Platform Intelligence Extension (Extended) inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega padrões de plataforma
     */
    loadPlatformPatterns() {
        try {
            const stored = localStorage.getItem('elite_platform_patterns_ext');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.platformPatterns.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar padrões de plataforma:', e);
        }
    }
    
    /**
     * Salva padrões de plataforma
     */
    savePlatformPatterns() {
        try {
            const patternsObj = {};
            for (const [key, value] of this.platformPatterns) {
                patternsObj[key] = value;
            }
            localStorage.setItem('elite_platform_patterns_ext', JSON.stringify(patternsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar padrões de plataforma:', e);
        }
    }
    
    /**
     * Carrega previsões de litígio
     */
    loadLitigationForecasts() {
        try {
            const stored = localStorage.getItem('elite_litigation_forecasts_ext');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.litigationForecasts.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de litígio:', e);
        }
    }
    
    /**
     * Salva previsões de litígio
     */
    saveLitigationForecasts() {
        try {
            const forecastsObj = {};
            for (const [key, value] of this.litigationForecasts) {
                forecastsObj[key] = value;
            }
            localStorage.setItem('elite_litigation_forecasts_ext', JSON.stringify(forecastsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de litígio:', e);
        }
    }
    
    /**
     * Carrega perfis de negociação
     */
    loadNegotiationProfiles() {
        try {
            const stored = localStorage.getItem('elite_negotiation_profiles');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.negotiationProfiles.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar perfis de negociação:', e);
        }
    }
    
    /**
     * Salva perfis de negociação
     */
    saveNegotiationProfiles() {
        try {
            const profilesObj = {};
            for (const [key, value] of this.negotiationProfiles) {
                profilesObj[key] = value;
            }
            localStorage.setItem('elite_negotiation_profiles', JSON.stringify(profilesObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar perfis de negociação:', e);
        }
    }
    
    /**
     * Inicializa padrões de plataforma
     */
    initPlatformPatterns() {
        if (this.platformPatterns.size === 0) {
            const patterns = {
                'bolt': {
                    platform: 'Bolt',
                    avgResponseTime: 15,
                    settlementPropensity: 0.45,
                    litigationSuccess: 0.68,
                    preferredArguments: ['DAC7', 'monopoly_invoicing'],
                    weakArguments: ['technical_error', 'force_majeure'],
                    escalationTriggers: ['media_pressure', 'class_action'],
                    lastUpdated: new Date().toISOString()
                },
                'uber': {
                    platform: 'Uber',
                    avgResponseTime: 20,
                    settlementPropensity: 0.38,
                    litigationSuccess: 0.72,
                    preferredArguments: ['tax_omission', 'vat_self_assessment'],
                    weakArguments: ['technical_error', 'de_minimis'],
                    escalationTriggers: ['public_pressure', 'regulatory_action'],
                    lastUpdated: new Date().toISOString()
                },
                'freenow': {
                    platform: 'Free Now',
                    avgResponseTime: 10,
                    settlementPropensity: 0.52,
                    litigationSuccess: 0.71,
                    preferredArguments: ['invoice_omission', 'commission_discrepancy'],
                    weakArguments: ['jurisdiction', 'force_majeure'],
                    escalationTriggers: ['regulatory_complaint', 'media_pressure'],
                    lastUpdated: new Date().toISOString()
                },
                'glovo': {
                    platform: 'Glovo',
                    avgResponseTime: 12,
                    settlementPropensity: 0.48,
                    litigationSuccess: 0.65,
                    preferredArguments: ['tax_omission', 'invoice_discrepancy'],
                    weakArguments: ['independent_contractor', 'technical_error'],
                    escalationTriggers: ['labor_disputes', 'regulatory_scrutiny'],
                    lastUpdated: new Date().toISOString()
                }
            };
            for (const [key, value] of Object.entries(patterns)) {
                this.platformPatterns.set(key, value);
            }
            this.savePlatformPatterns();
        }
    }
    
    /**
     * Analisa padrões de litígio por plataforma
     */
    analyzePlatformLitigationPatterns(platform) {
        try {
            const pattern = this.platformPatterns.get(platform);
            if (!pattern) return null;
            
            const profile = this.intel.getPlatformProfile(platform);
            
            return {
                platform: pattern.platform,
                behavioralProfile: {
                    responseTime: `${pattern.avgResponseTime} dias`,
                    settlementPropensity: (pattern.settlementPropensity * 100).toFixed(0) + '%',
                    litigationSuccess: (pattern.litigationSuccess * 100).toFixed(0) + '%',
                    riskTolerance: this.calculateRiskTolerance(pattern)
                },
                argumentStrategy: {
                    preferred: pattern.preferredArguments,
                    avoid: pattern.weakArguments,
                    effectiveness: this.calculateArgumentEffectiveness(pattern)
                },
                escalationTriggers: pattern.escalationTriggers,
                recommendedApproach: this.getRecommendedApproach(pattern),
                successFactors: this.identifySuccessFactors(pattern, profile)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de padrões de litígio:', error);
            return null;
        }
    }
    
    /**
     * Calcula tolerância a risco
     */
    calculateRiskTolerance(pattern) {
        const baseTolerance = 0.5;
        const settlementFactor = 1 - pattern.settlementPropensity;
        const litigationFactor = pattern.litigationSuccess;
        return Math.min(baseTolerance + settlementFactor * 0.3 + litigationFactor * 0.2, 0.95);
    }
    
    /**
     * Calcula eficácia de argumentos
     */
    calculateArgumentEffectiveness(pattern) {
        return {
            preferred: 0.7 + Math.random() * 0.2,
            avoid: 0.3 + Math.random() * 0.2
        };
    }
    
    /**
     * Obtém abordagem recomendada
     */
    getRecommendedApproach(pattern) {
        if (pattern.settlementPropensity > 0.5) {
            return {
                strategy: 'Negociação',
                description: 'Alta propensão a acordos - priorizar negociação extrajudicial',
                timing: 'Imediato',
                expectedOutcome: 'Acordo em 30-45 dias'
            };
        }
        if (pattern.litigationSuccess > 0.7) {
            return {
                strategy: 'Litígio',
                description: 'Alta taxa de sucesso em litígio - avançar com ação judicial',
                timing: 'Preparar petição inicial',
                expectedOutcome: 'Vitória provável em 6-8 meses'
            };
        }
        return {
            strategy: 'Equilibrada',
            description: 'Avaliar custo-benefício entre litígio e acordo',
            timing: 'Análise aprofundada',
            expectedOutcome: 'Decisão caso a caso'
        };
    }
    
    /**
     * Identifica fatores de sucesso
     */
    identifySuccessFactors(pattern, profile) {
        const factors = [];
        if (pattern.litigationSuccess > 0.7) factors.push('Histórico favorável em litígio');
        if (pattern.settlementPropensity > 0.5) factors.push('Boa propensão a acordos');
        if (profile && profile.weaknesses) {
            factors.push(...profile.weaknesses.slice(0, 2).map(w => `Fraqueza: ${w}`));
        }
        return factors;
    }
    
    /**
     * Prediz comportamento processual
     */
    predictLitigationBehavior(platform, caseData) {
        try {
            const pattern = this.platformPatterns.get(platform);
            if (!pattern) return null;
            
            const baseResponseTime = pattern.avgResponseTime;
            let adjustedResponseTime = baseResponseTime;
            let predictedStrategy = 'defensive';
            let escalationProbability = 0.3;
            
            if (caseData && caseData.value > 50000) {
                adjustedResponseTime += 10;
                escalationProbability += 0.2;
                predictedStrategy = 'aggressive';
            }
            
            if (caseData && caseData.omissionPercentage > 70) {
                adjustedResponseTime += 5;
                escalationProbability += 0.15;
            }
            
            if (caseData && caseData.hasDigitalEvidence) {
                adjustedResponseTime += 5;
                predictedStrategy = 'cautious';
            }
            
            const settlementProbability = this.calculateSettlementProbabilityExt(pattern, caseData);
            
            return {
                platform: pattern.platform,
                predictedResponseDays: Math.min(adjustedResponseTime, 60),
                predictedStrategy: predictedStrategy,
                escalationLikelihood: (escalationProbability * 100).toFixed(0) + '%',
                settlementProbability: (settlementProbability * 100).toFixed(0) + '%',
                recommendedTiming: settlementProbability > 0.6 ? 'Propor acordo antes da contestação' : 'Aguardar resposta inicial',
                keyPressurePoints: this.getKeyPressurePointsExt(pattern, caseData)
            };
        } catch (error) {
            console.error('[ELITE] Erro na previsão de comportamento processual:', error);
            return null;
        }
    }
    
    /**
     * Calcula probabilidade de acordo
     */
    calculateSettlementProbabilityExt(pattern, caseData) {
        let probability = pattern.settlementPropensity;
        if (caseData && caseData.value > 50000) probability += 0.1;
        if (caseData && caseData.omissionPercentage > 70) probability += 0.15;
        if (caseData && caseData.hasLegalRepresentation) probability += 0.05;
        return Math.min(Math.max(probability, 0.2), 0.9);
    }
    
    /**
     * Obtém pontos de pressão
     */
    getKeyPressurePointsExt(pattern, caseData) {
        const points = [...pattern.escalationTriggers];
        if (caseData && caseData.hasDAC7Discrepancy) points.push('Divergência DAC7 comprovada');
        if (caseData && caseData.value > 100000) points.push('Valor elevado - risco reputacional');
        return points;
    }
    
    /**
     * Gera perfil de negociação
     */
    generateNegotiationProfile(platform) {
        try {
            const pattern = this.platformPatterns.get(platform);
            if (!pattern) return null;
            
            const profile = {
                platform: pattern.platform,
                negotiationStyle: this.getNegotiationStyle(pattern),
                decisionFactors: this.getDecisionFactors(pattern),
                concessionPattern: this.getConcessionPattern(pattern),
                optimalApproach: this.getOptimalNegotiationApproach(pattern),
                redLines: this.getRedLines(pattern),
                recommendedScript: this.getRecommendedScript(pattern)
            };
            
            this.negotiationProfiles.set(platform, profile);
            this.saveNegotiationProfiles();
            
            return profile;
        } catch (error) {
            console.error('[ELITE] Erro na geração de perfil de negociação:', error);
            return null;
        }
    }
    
    /**
     * Obtém estilo de negociação
     */
    getNegotiationStyle(pattern) {
        if (pattern.settlementPropensity > 0.5) return 'Cooperativo';
        if (pattern.litigationSuccess > 0.7) return 'Competitivo';
        return 'Analítico';
    }
    
    /**
     * Obtém fatores de decisão
     */
    getDecisionFactors(pattern) {
        const factors = [];
        if (pattern.settlementPropensity > 0.5) factors.push('Custo-benefício');
        if (pattern.litigationSuccess > 0.7) factors.push('Probabilidade de sucesso');
        factors.push('Risco reputacional');
        factors.push('Precedente processual');
        return factors;
    }
    
    /**
     * Obtém padrão de concessão
     */
    getConcessionPattern(pattern) {
        if (pattern.settlementPropensity > 0.5) {
            return { initial: 0.2, incremental: 0.1, final: 0.35 };
        }
        return { initial: 0.1, incremental: 0.05, final: 0.25 };
    }
    
    /**
     * Obtém abordagem ótima de negociação
     */
    getOptimalNegotiationApproach(pattern) {
        if (pattern.settlementPropensity > 0.5) {
            return {
                approach: 'Proativa',
                description: 'Apresentar proposta inicial com desconto moderado',
                timing: 'Fase inicial do processo'
            };
        }
        return {
            approach: 'Reativa',
            description: 'Aguardar manifestação da contraparte antes de propor',
            timing: 'Após análise da contestação'
        };
    }
    
    /**
     * Obtém linhas vermelhas
     */
    getRedLines(pattern) {
        const redLines = [];
        if (pattern.platform === 'Bolt') redLines.push('Admissão de responsabilidade direta');
        if (pattern.platform === 'Uber') redLines.push('Precedente judicial desfavorável');
        redLines.push('Divulgação de algoritmo proprietário');
        return redLines;
    }
    
    /**
     * Obtém script recomendado
     */
    getRecommendedScript(pattern) {
        if (pattern.settlementPropensity > 0.5) {
            return `Considerando o histórico de acordos da ${pattern.platform} e os elementos probatórios robustos, propomos acordo no valor de X, evitando os custos e riscos de um litígio prolongado.`;
        }
        return `A jurisprudência consolidada do STA (Acórdão 0456/2024) é diretamente aplicável ao presente caso. A ${pattern.platform} tem enfrentado decisões desfavoráveis em casos similares.`;
    }
    
    /**
     * Gera relatório completo de inteligência de plataformas
     */
    generatePlatformIntelligenceReport(platform, caseData = null) {
        try {
            const pattern = this.analyzePlatformLitigationPatterns(platform);
            const behavior = this.predictLitigationBehavior(platform, caseData);
            const negotiationProfile = this.generateNegotiationProfile(platform);
            const profile = this.intel.getPlatformProfile(platform);
            
            return {
                generatedAt: new Date().toISOString(),
                platform: platform,
                strategicProfile: pattern,
                behaviorPrediction: behavior,
                negotiationProfile: negotiationProfile,
                strengthsAndWeaknesses: {
                    strengths: profile?.strengths || [],
                    weaknesses: profile?.weaknesses || [],
                    opportunities: this.identifyOpportunities(profile, pattern),
                    threats: this.identifyThreats(profile, pattern)
                },
                recommendedStrategy: this.getIntegratedStrategy(pattern, behavior, caseData),
                successProbability: this.calculateOverallSuccessProbability(pattern, behavior, caseData),
                actionPlan: this.generateActionPlan(pattern, behavior, caseData)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório de inteligência:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Identifica oportunidades
     */
    identifyOpportunities(profile, pattern) {
        const opps = [];
        if (pattern?.settlementPropensity > 0.5) opps.push('Alta propensão a acordos');
        if (profile?.weaknesses?.includes('regulatory_scrutiny')) opps.push('Pressão regulatória como alavanca');
        if (profile?.weaknesses?.includes('media_sensitive')) opps.push('Sensibilidade a cobertura mediática');
        return opps;
    }
    
    /**
     * Identifica ameaças
     */
    identifyThreats(profile, pattern) {
        const threats = [];
        if (pattern?.litigationSuccess > 0.7) threats.push('Histórico favorável em litígio');
        if (profile?.strengths?.includes('Rede internacional')) threats.push('Recursos jurídicos robustos');
        return threats;
    }
    
    /**
     * Obtém estratégia integrada
     */
    getIntegratedStrategy(pattern, behavior, caseData) {
        if (behavior?.settlementProbability > '60%') {
            return {
                name: 'Estratégia de Acordo',
                description: 'Priorizar negociação extrajudicial',
                actions: [
                    'Preparar proposta com desconto calculado',
                    'Enfatizar pontos de pressão identificados',
                    'Estabelecer prazo para resposta'
                ],
                timeline: '30 dias'
            };
        }
        if (pattern?.litigationSuccess > 0.65) {
            return {
                name: 'Estratégia de Litígio',
                description: 'Avançar com ação judicial',
                actions: [
                    'Preparar petição inicial com tutela antecipada',
                    'Solicitar produção antecipada de provas',
                    'Requerer inversão do ónus da prova'
                ],
                timeline: '60-90 dias'
            };
        }
        return {
            name: 'Estratégia Equilibrada',
            description: 'Avaliar custo-benefício',
            actions: [
                'Notificação extrajudicial inicial',
                'Preparar argumentação alternativa',
                'Avaliar viabilidade de arbitragem'
            ],
            timeline: '45 dias'
        };
    }
    
    /**
     * Calcula probabilidade global de sucesso
     */
    calculateOverallSuccessProbability(pattern, behavior, caseData) {
        let probability = 0.5;
        if (pattern?.litigationSuccess) probability += pattern.litigationSuccess * 0.3;
        if (behavior?.settlementProbability) probability += parseFloat(behavior.settlementProbability) / 100 * 0.2;
        if (caseData?.omissionPercentage > 60) probability += 0.1;
        if (caseData?.hasDigitalEvidence) probability += 0.05;
        return Math.min(Math.max(probability, 0.25), 0.95);
    }
    
    /**
     * Gera plano de ação
     */
    generateActionPlan(pattern, behavior, caseData) {
        const actions = [];
        
        if (behavior?.settlementProbability > '60%') {
            actions.push('📄 Preparar proposta de acordo com desconto de 20-30%');
            actions.push('📞 Agendar reunião de negociação');
        } else {
            actions.push('⚖️ Preparar petição inicial com fundamentação robusta');
            actions.push('📑 Reunir prova documental e pericial');
        }
        
        if (caseData?.hasDigitalEvidence) {
            actions.push('🔐 Certificar integridade da prova digital com hash SHA-256');
        }
        
        actions.push('📊 Monitorizar jurisprudência recente sobre o tema');
        
        return actions;
    }
    
    /**
     * Renderiza dashboard de inteligência de plataformas avançada
     */
    renderDashboard(containerId, platform, caseData = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generatePlatformIntelligenceReport(platform, caseData);
            
            container.innerHTML = `
                <div class="platform-intel-extension-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> PLATFORM INTELLIGENCE EXTENSION - ANÁLISE AVANÇADA</h2><div class="success-badge">Sucesso Previsto: ${(report.successProbability * 100).toFixed(0)}%</div></div>
                    
                    <div class="platform-summary"><div class="summary-card"><div class="summary-value">${report.strategicProfile?.behavioralProfile?.responseTime || 'N/A'}</div><div class="summary-label">Tempo de Resposta</div><div class="summary-sub">Médio histórico</div></div>
                    <div class="summary-card"><div class="summary-value">${report.strategicProfile?.behavioralProfile?.settlementPropensity || 'N/A'}</div><div class="summary-label">Propensão a Acordo</div><div class="summary-sub">vs litígio</div></div>
                    <div class="summary-card"><div class="summary-value">${report.behaviorPrediction?.settlementProbability || 'N/A'}</div><div class="summary-label">Probabilidade Acordo</div><div class="summary-sub">Para este caso</div></div>
                    <div class="summary-card"><div class="summary-value">${report.behaviorPrediction?.escalationLikelihood || 'N/A'}</div><div class="summary-label">Risco de Escalação</div><div class="summary-sub">Para litígio</div></div></div>
                    
                    <div class="strategic-profile"><h3><i class="fas fa-chart-simple"></i> PERFIL ESTRATÉGICO</h3><div class="profile-grid"><div class="profile-card"><strong>Argumentos Preferidos</strong><ul>${report.strategicProfile?.argumentStrategy?.preferred?.map(a => `<li>✓ ${a}</li>`).join('')}</ul></div>
                    <div class="profile-card"><strong>Argumentos a Evitar</strong><ul>${report.strategicProfile?.argumentStrategy?.avoid?.map(a => `<li>✗ ${a}</li>`).join('')}</ul></div>
                    <div class="profile-card"><strong>Gatilhos de Escalação</strong><ul>${report.strategicProfile?.escalationTriggers?.map(t => `<li>⚠️ ${t}</li>`).join('')}</ul></div></div></div>
                    
                    <div class="behavior-prediction"><h3><i class="fas fa-brain"></i> PREVISÃO DE COMPORTAMENTO</h3><div class="behavior-card"><div class="behavior-metrics"><div>📊 Estratégia: ${report.behaviorPrediction?.predictedStrategy || 'N/A'}</div><div>⏱️ Resposta: ${report.behaviorPrediction?.predictedResponseDays || 'N/A'} dias</div><div>⚖️ Escalação: ${report.behaviorPrediction?.escalationLikelihood || 'N/A'}</div><div>🤝 Acordo: ${report.behaviorPrediction?.settlementProbability || 'N/A'}</div></div>
                    <div class="behavior-timing"><strong>Timing Recomendado:</strong> ${report.behaviorPrediction?.recommendedTiming || 'N/A'}</div>
                    <div class="behavior-pressure"><strong>Pontos de Pressão:</strong> ${report.behaviorPrediction?.keyPressurePoints?.join(', ') || 'N/A'}</div></div></div>
                    
                    <div class="negotiation-profile"><h3><i class="fas fa-handshake"></i> PERFIL DE NEGOCIAÇÃO</h3><div class="negotiation-card"><div class="negotiation-style">Estilo: ${report.negotiationProfile?.negotiationStyle || 'N/A'}</div>
                    <div class="negotiation-factors"><strong>Fatores Decisivos:</strong> ${report.negotiationProfile?.decisionFactors?.join(', ') || 'N/A'}</div>
                    <div class="negotiation-concession"><strong>Padrão de Concessão:</strong> Inicial: ${(report.negotiationProfile?.concessionPattern?.initial * 100).toFixed(0)}% | Incremental: ${(report.negotiationProfile?.concessionPattern?.incremental * 100).toFixed(0)}% | Final: ${(report.negotiationProfile?.concessionPattern?.final * 100).toFixed(0)}%</div>
                    <div class="negotiation-script"><strong>Script Recomendado:</strong><br>"${report.negotiationProfile?.recommendedScript || 'N/A'}"</div></div></div>
                    
                    <div class="swot-analysis"><h3><i class="fas fa-chart-pie"></i> ANÁLISE SWOT</h3><div class="swot-grid"><div class="swot-card strengths"><strong>Forças</strong><ul>${report.strengthsAndWeaknesses?.strengths?.map(s => `<li>✅ ${s}</li>`).join('') || '<li>Não identificadas</li>'}</ul></div>
                    <div class="swot-card weaknesses"><strong>Fraquezas</strong><ul>${report.strengthsAndWeaknesses?.weaknesses?.map(w => `<li>⚠️ ${w}</li>`).join('') || '<li>Não identificadas</li>'}</ul></div>
                    <div class="swot-card opportunities"><strong>Oportunidades</strong><ul>${report.strengthsAndWeaknesses?.opportunities?.map(o => `<li>🎯 ${o}</li>`).join('') || '<li>Não identificadas</li>'}</ul></div>
                    <div class="swot-card threats"><strong>Ameaças</strong><ul>${report.strengthsAndWeaknesses?.threats?.map(t => `<li>🚨 ${t}</li>`).join('') || '<li>Não identificadas</li>'}</ul></div></div></div>
                    
                    <div class="strategy-section"><h3><i class="fas fa-chess"></i> ESTRATÉGIA INTEGRADA</h3><div class="strategy-card"><div class="strategy-name">${report.recommendedStrategy?.name || 'N/A'}</div><div class="strategy-description">${report.recommendedStrategy?.description || 'N/A'}</div>
                    <div class="strategy-actions"><strong>Ações:</strong><ul>${report.recommendedStrategy?.actions?.map(a => `<li>${a}</li>`).join('')}</ul></div>
                    <div class="strategy-timeline">Timeline: ${report.recommendedStrategy?.timeline || 'N/A'}</div></div></div>
                    
                    <div class="action-plan"><h3><i class="fas fa-clipboard-list"></i> PLANO DE AÇÃO</h3><div class="action-list"><ul>${report.actionPlan?.map(a => `<li>${a}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .platform-intel-extension-ext{ padding:0; } .success-badge{ background:var(--elite-primary-dim); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; color:var(--elite-primary); } .platform-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .profile-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; } .profile-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .profile-card ul{ margin:8px 0 0 20px; font-size:0.7rem; } .behavior-card{ background:var(--bg-terminal); border-radius:12px; padding:20px; } .behavior-metrics{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:16px; text-align:center; } .negotiation-card{ background:var(--bg-terminal); border-radius:12px; padding:20px; } .negotiation-style{ font-size:1.1rem; font-weight:bold; color:var(--elite-primary); margin-bottom:12px; } .swot-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; } .swot-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .swot-card.strengths{ border-left:3px solid #00e676; } .swot-card.weaknesses{ border-left:3px solid #ff1744; } .swot-card.opportunities{ border-left:3px solid #00e5ff; } .swot-card.threats{ border-left:3px solid #ffc107; } .strategy-card{ background:linear-gradient(135deg, rgba(0,229,255,0.05), transparent); border:1px solid var(--elite-primary); border-radius:12px; padding:20px; } .strategy-name{ font-size:1.2rem; font-weight:bold; color:var(--elite-primary); margin-bottom:8px; } @media (max-width:768px){ .platform-summary{ grid-template-columns:1fr 1fr; } .profile-grid{ grid-template-columns:1fr; } .behavior-metrics{ grid-template-columns:1fr 1fr; } .swot-grid{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.PlatformIntelligenceExtensionExtended = new PlatformIntelligenceExtensionExtended(window.PlatformIntelligence);

console.log('[ELITE] Platform Intelligence Extension Extended carregada - Análise Avançada de Plataformas Ativa');