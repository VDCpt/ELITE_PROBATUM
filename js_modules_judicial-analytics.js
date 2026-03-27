/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 3: PERFIL DE MAGISTRADOS
 * ============================================================================
 * Análise detalhada de magistrados, histórico de decisões,
 * padrões comportamentais e estratégias recomendadas por juiz.
 * ============================================================================
 */

class JudicialAnalytics {
    constructor() {
        this.judges = this.loadJudgesData();
        this.courts = this.loadCourtsData();
        this.decisionHistory = this.loadDecisionHistory();
        this.patterns = this.loadPatterns();
        this.initialized = false;
    }
    
    /**
     * Inicializa o módulo
     */
    initialize() {
        try {
            this.initialized = true;
            console.log('[ELITE] Judicial Analytics inicializado');
        } catch (error) {
            console.error('[ELITE] Erro na inicialização:', error);
            this.initialized = false;
        }
        return this;
    }
    
    /**
     * Carrega base de dados de magistrados
     */
    loadJudgesData() {
        try {
            return {
                'Dr. António Costa': {
                    id: 'judge_001',
                    name: 'Dr. António Costa',
                    court: 'Tribunal Judicial de Lisboa',
                    position: 'Juiz de Direito',
                    since: '2015',
                    decisions: 156,
                    favorableRate: 0.68,
                    avgTime: 120,
                    specialization: ['Direito Fiscal', 'Direito Comercial'],
                    patterns: {
                        prefersDocumentaryEvidence: true,
                        acceptsExpertWitness: true,
                        grantsInjunction: 0.72,
                        appealsReversal: 0.18,
                        formalistic: false,
                        technical: true
                    },
                    keyCases: [
                        { number: '1234/19.8BELRS', outcome: 'favorable', year: 2023, value: 125000, summary: 'Fraude fiscal qualificada' },
                        { number: '5678/20.1BELRS', outcome: 'favorable', year: 2023, value: 89000, summary: 'Omissão de faturação' },
                        { number: '9012/21.3BELRS', outcome: 'unfavorable', year: 2024, value: 45000, summary: 'Decadência do direito' }
                    ],
                    recommendedStrategy: {
                        approach: 'aggressive',
                        arguments: ['dac7', 'monopoly_invoicing', 'vat_self_assessment'],
                        avoid: ['technical_error', 'force_majeure'],
                        evidence: ['documentary', 'expert']
                    },
                    personality: 'Técnico, fundamentado, valoriza prova documental robusta',
                    tendencies: 'Decisões bem fundamentadas, raras decisões surpresa'
                },
                'Dra. Sofia Mendes': {
                    id: 'judge_002',
                    name: 'Dra. Sofia Mendes',
                    court: 'Tribunal Judicial do Porto',
                    position: 'Juíza de Direito',
                    since: '2017',
                    decisions: 98,
                    favorableRate: 0.72,
                    avgTime: 95,
                    specialization: ['Direito do Trabalho', 'Direito Civil'],
                    patterns: {
                        prefersDocumentaryEvidence: true,
                        acceptsExpertWitness: true,
                        grantsInjunction: 0.85,
                        appealsReversal: 0.12,
                        formalistic: false,
                        technical: true
                    },
                    keyCases: [
                        { number: '3456/19.0BEPRT', outcome: 'favorable', year: 2023, value: 28000, summary: 'Despedimento ilícito' },
                        { number: '7890/20.2BEPRT', outcome: 'favorable', year: 2023, value: 15720, summary: 'Contrato sem termo' }
                    ],
                    recommendedStrategy: {
                        approach: 'aggressive',
                        arguments: ['fraud_qualification', 'burden_reversal'],
                        avoid: ['jurisdiction'],
                        evidence: ['documentary', 'expert', 'digital']
                    },
                    personality: 'Progressista, sensível a questões sociais, valoriza prova testemunhal',
                    tendencies: 'Favorável ao trabalhador, concede tutelas antecipadas com frequência'
                },
                'Dr. Ricardo Alves': {
                    id: 'judge_003',
                    name: 'Dr. Ricardo Alves',
                    court: 'Tribunal Judicial de Braga',
                    position: 'Juiz de Direito',
                    since: '2012',
                    decisions: 210,
                    favorableRate: 0.58,
                    avgTime: 110,
                    specialization: ['Direito Penal', 'Direito Civil'],
                    patterns: {
                        prefersDocumentaryEvidence: false,
                        acceptsExpertWitness: true,
                        grantsInjunction: 0.45,
                        appealsReversal: 0.25,
                        formalistic: true,
                        technical: false
                    },
                    keyCases: [
                        { number: '1112/21.7BEBRG', outcome: 'unfavorable', year: 2023, value: 32000, summary: 'Prova testemunhal frágil' },
                        { number: '1314/22.1BEBRG', outcome: 'favorable', year: 2024, value: 8900, summary: 'Acordo extrajudicial' }
                    ],
                    recommendedStrategy: {
                        approach: 'balanced',
                        arguments: ['settlement', 'arbitration'],
                        avoid: ['aggressive_claims', 'media_pressure'],
                        evidence: ['expert', 'documentary']
                    },
                    personality: 'Conservador, formalista, valoriza precedentes',
                    tendencies: 'Decisões previsíveis, raras concessões de tutela antecipada'
                },
                'Dra. Teresa Lopes': {
                    id: 'judge_004',
                    name: 'Dra. Teresa Lopes',
                    court: 'Tribunal Judicial de Lisboa',
                    position: 'Juíza de Direito',
                    since: '2014',
                    decisions: 112,
                    favorableRate: 0.71,
                    avgTime: 105,
                    specialization: ['Direito da Família', 'Direito Civil'],
                    patterns: {
                        prefersDocumentaryEvidence: true,
                        acceptsExpertWitness: false,
                        grantsInjunction: 0.68,
                        appealsReversal: 0.15,
                        formalistic: false,
                        technical: true
                    },
                    keyCases: [
                        { number: '2222/20.5BELRS', outcome: 'favorable', year: 2023, value: 12300, summary: 'Divórcio litigioso' },
                        { number: '3333/21.7BELRS', outcome: 'favorable', year: 2023, value: 8500, summary: 'Regulação poder paternal' }
                    ],
                    recommendedStrategy: {
                        approach: 'balanced',
                        arguments: ['consensual', 'mediation'],
                        avoid: ['aggressive'],
                        evidence: ['documentary']
                    },
                    personality: 'Empática, valoriza acordos consensuais',
                    tendencies: 'Incentiva mediação, decisões equilibradas'
                },
                'Dr. Pedro Santos': {
                    id: 'judge_005',
                    name: 'Dr. Pedro Santos',
                    court: 'Tribunal Arbitral (CAAD)',
                    position: 'Árbitro',
                    since: '2018',
                    decisions: 48,
                    favorableRate: 0.82,
                    avgTime: 65,
                    specialization: ['Direito Fiscal', 'Arbitragem'],
                    patterns: {
                        prefersDocumentaryEvidence: true,
                        acceptsExpertWitness: true,
                        grantsInjunction: 0.92,
                        appealsReversal: 0.05,
                        formalistic: false,
                        technical: true
                    },
                    keyCases: [
                        { number: 'CAAD_001/2023', outcome: 'favorable', year: 2023, value: 28450, summary: 'Preço de transferência' },
                        { number: 'CAAD_002/2024', outcome: 'favorable', year: 2024, value: 45200, summary: 'IVA dedutível' }
                    ],
                    recommendedStrategy: {
                        approach: 'aggressive',
                        arguments: ['all'],
                        avoid: [],
                        evidence: ['documentary', 'expert', 'digital']
                    },
                    personality: 'Técnico, eficiente, valoriza celeridade',
                    tendencies: 'Decisões rápidas, favorável ao contribuinte'
                },
                'Dr. Rui Silva': {
                    id: 'judge_006',
                    name: 'Dr. Rui Silva',
                    court: 'Tribunal Judicial de Coimbra',
                    position: 'Juiz de Direito',
                    since: '2016',
                    decisions: 85,
                    favorableRate: 0.62,
                    avgTime: 125,
                    specialization: ['Direito Civil', 'Direito das Obrigações'],
                    patterns: {
                        prefersDocumentaryEvidence: true,
                        acceptsExpertWitness: true,
                        grantsInjunction: 0.55,
                        appealsReversal: 0.20,
                        formalistic: true,
                        technical: true
                    },
                    keyCases: [
                        { number: '4444/20.5BECBR', outcome: 'favorable', year: 2023, value: 45000, summary: 'Incumprimento contratual' }
                    ],
                    recommendedStrategy: {
                        approach: 'balanced',
                        arguments: ['documentary_evidence', 'contract_law'],
                        avoid: ['emotional_appeals'],
                        evidence: ['documentary', 'expert']
                    },
                    personality: 'Rigoroso, valoriza a forma e o conteúdo probatório',
                    tendencies: 'Decisões baseadas em prova documental robusta'
                }
            };
        } catch (error) {
            console.error('[ELITE] Erro ao carregar dados de magistrados:', error);
            return {};
        }
    }
    
    /**
     * Carrega dados dos tribunais
     */
    loadCourtsData() {
        try {
            return {
                'Tribunal Judicial de Lisboa': {
                    id: 'court_lisboa',
                    name: 'Lisboa',
                    avgSuccessRate: 0.62,
                    avgDuration: 135,
                    judges: ['Dr. António Costa', 'Dra. Teresa Lopes', 'Dr. João Costa', 'Dra. Isabel Ferreira'],
                    caseVolume: 450,
                    infrastructure: 'Boa',
                    specialization: 'Geral'
                },
                'Tribunal Judicial do Porto': {
                    id: 'court_porto',
                    name: 'Porto',
                    avgSuccessRate: 0.68,
                    avgDuration: 110,
                    judges: ['Dra. Sofia Mendes', 'Dr. Carlos Lima', 'Dra. Ana Marques'],
                    caseVolume: 380,
                    infrastructure: 'Boa',
                    specialization: 'Geral'
                },
                'Tribunal Judicial de Braga': {
                    id: 'court_braga',
                    name: 'Braga',
                    avgSuccessRate: 0.55,
                    avgDuration: 125,
                    judges: ['Dr. Ricardo Alves', 'Dra. Teresa Martins'],
                    caseVolume: 250,
                    infrastructure: 'Regular',
                    specialization: 'Geral'
                },
                'Tribunal Arbitral (CAAD)': {
                    id: 'court_caad',
                    name: 'CAAD',
                    avgSuccessRate: 0.78,
                    avgDuration: 85,
                    judges: ['Dr. Pedro Santos', 'Dra. Luísa Costa', 'Dr. Miguel Ferreira'],
                    caseVolume: 120,
                    infrastructure: 'Excelente',
                    specialization: 'Arbitragem Fiscal'
                },
                'Tribunal Judicial de Coimbra': {
                    id: 'court_coimbra',
                    name: 'Coimbra',
                    avgSuccessRate: 0.58,
                    avgDuration: 140,
                    judges: ['Dr. Rui Silva', 'Dra. Helena Martins'],
                    caseVolume: 220,
                    infrastructure: 'Regular',
                    specialization: 'Geral'
                },
                'Tribunal Judicial de Faro': {
                    id: 'court_faro',
                    name: 'Faro',
                    avgSuccessRate: 0.61,
                    avgDuration: 130,
                    judges: ['Dr. José Oliveira', 'Dra. Carla Ferreira'],
                    caseVolume: 180,
                    infrastructure: 'Regular',
                    specialization: 'Geral'
                }
            };
        } catch (error) {
            console.error('[ELITE] Erro ao carregar dados de tribunais:', error);
            return {};
        }
    }
    
    /**
     * Carrega histórico de decisões
     */
    loadDecisionHistory() {
        try {
            return [
                { judge: 'Dr. António Costa', date: '2024-01-15', case: '1234/19.8BELRS', outcome: 'favorable', area: 'fiscal', value: 125000 },
                { judge: 'Dr. António Costa', date: '2024-02-20', case: '5678/20.1BELRS', outcome: 'favorable', area: 'comercial', value: 89000 },
                { judge: 'Dr. António Costa', date: '2024-03-10', case: '9012/21.3BELRS', outcome: 'unfavorable', area: 'fiscal', value: 45000 },
                { judge: 'Dra. Sofia Mendes', date: '2024-01-25', case: '3456/19.0BEPRT', outcome: 'favorable', area: 'laboral', value: 28000 },
                { judge: 'Dra. Sofia Mendes', date: '2024-02-28', case: '7890/20.2BEPRT', outcome: 'favorable', area: 'laboral', value: 15720 },
                { judge: 'Dr. Ricardo Alves', date: '2024-01-05', case: '1112/21.7BEBRG', outcome: 'unfavorable', area: 'civil', value: 32000 },
                { judge: 'Dr. Ricardo Alves', date: '2024-03-15', case: '1314/22.1BEBRG', outcome: 'favorable', area: 'civil', value: 8900 },
                { judge: 'Dr. Pedro Santos', date: '2024-02-10', case: 'CAAD_001/2023', outcome: 'favorable', area: 'fiscal', value: 28450 },
                { judge: 'Dr. Pedro Santos', date: '2024-03-20', case: 'CAAD_002/2024', outcome: 'favorable', area: 'fiscal', value: 45200 },
                { judge: 'Dr. Rui Silva', date: '2024-02-05', case: '4444/20.5BECBR', outcome: 'favorable', area: 'civil', value: 45000 }
            ];
        } catch (error) {
            console.error('[ELITE] Erro ao carregar histórico de decisões:', error);
            return [];
        }
    }
    
    /**
     * Carrega padrões identificados
     */
    loadPatterns() {
        try {
            return {
                documentaryEvidence: {
                    weight: 0.15,
                    description: 'Juízes que valorizam prova documental têm taxa de sucesso 12% superior'
                },
                expertWitness: {
                    weight: 0.10,
                    description: 'Perícia técnica aumenta probabilidade de sucesso em 8%'
                },
                injunction: {
                    weight: 0.08,
                    description: 'Juízes com alta taxa de concessão de tutelas antecipadas'
                },
                appeals: {
                    weight: 0.12,
                    description: 'Taxa de reversão em recurso por magistrado'
                }
            };
        } catch (error) {
            return {};
        }
    }
    
    /**
     * Obtém perfil de um magistrado com tratamento de erros
     */
    getJudgeProfile(judgeName) {
        try {
            if (!judgeName) return null;
            return this.judges[judgeName] || null;
        } catch (error) {
            console.error('[ELITE] Erro ao obter perfil do juiz:', error);
            return null;
        }
    }
    
    /**
     * Obtém perfil de um tribunal
     */
    getCourtProfile(courtName) {
        try {
            if (!courtName) return null;
            return this.courts[courtName] || null;
        } catch (error) {
            console.error('[ELITE] Erro ao obter perfil do tribunal:', error);
            return null;
        }
    }
    
    /**
     * Analisa caso para um magistrado específico
     */
    analyzeCase(judgeName, caseData) {
        try {
            const judge = this.getJudgeProfile(judgeName);
            if (!judge) {
                return {
                    successProbability: 0.50,
                    confidence: 0.30,
                    message: 'Juiz não encontrado na base de dados. Usar análise genérica.',
                    judgeNotFound: true
                };
            }
            
            let probability = judge.favorableRate;
            let confidence = Math.min(judge.decisions / 100, 0.85);
            let adjustments = [];
            
            if (caseData.area && judge.specialization && judge.specialization.includes(caseData.area)) {
                const areaBonus = 0.05;
                probability += areaBonus;
                adjustments.push({
                    factor: 'Especialização',
                    impact: areaBonus,
                    description: `Juiz especializado em ${caseData.area}`
                });
            }
            
            if (caseData.value && caseData.value > 50000) {
                const valueBonus = 0.03;
                probability += valueBonus;
                adjustments.push({
                    factor: 'Valor da Causa',
                    impact: valueBonus,
                    description: `Valor superior a €50.000 (+3%)`
                });
            }
            
            if (caseData.hasDocumentaryEvidence) {
                if (judge.patterns && judge.patterns.prefersDocumentaryEvidence) {
                    const docBonus = 0.08;
                    probability += docBonus;
                    adjustments.push({
                        factor: 'Prova Documental',
                        impact: docBonus,
                        description: `Juiz valoriza prova documental (+8%)`
                    });
                } else if (judge.patterns) {
                    const docBonus = 0.03;
                    probability += docBonus;
                    adjustments.push({
                        factor: 'Prova Documental',
                        impact: docBonus,
                        description: `Juiz aceita prova documental (+3%)`
                    });
                }
            }
            
            if (caseData.hasExpertEvidence && judge.patterns && judge.patterns.acceptsExpertWitness) {
                const expertBonus = 0.05;
                probability += expertBonus;
                adjustments.push({
                    factor: 'Prova Pericial',
                    impact: expertBonus,
                    description: `Juiz aceita prova pericial (+5%)`
                });
            }
            
            const injunctionProbability = judge.patterns?.grantsInjunction || 0.5;
            const appealReversalRate = judge.patterns?.appealsReversal || 0.15;
            
            probability = Math.min(Math.max(probability, 0.20), 0.95);
            
            return {
                judge: judgeName,
                judgeId: judge.id,
                court: judge.court,
                successProbability: probability,
                confidence: confidence,
                injunctionProbability: injunctionProbability,
                appealReversalRate: appealReversalRate,
                expectedDuration: judge.avgTime,
                recommendedStrategy: judge.recommendedStrategy,
                keyCases: judge.keyCases ? judge.keyCases.slice(0, 3) : [],
                patterns: judge.patterns,
                adjustments: adjustments,
                observations: this.getObservations(judge, caseData),
                personality: judge.personality,
                tendencies: judge.tendencies,
                specialization: judge.specialization,
                decisionsCount: judge.decisions
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise do caso:', error);
            return {
                successProbability: 0.50,
                confidence: 0.30,
                error: true,
                message: 'Erro ao analisar o caso. Utilize análise genérica.'
            };
        }
    }
    
    /**
     * Obtém observações para o caso
     */
    getObservations(judge, caseData) {
        try {
            const observations = [];
            
            if (judge.patterns && judge.patterns.prefersDocumentaryEvidence && !caseData.hasDocumentaryEvidence) {
                observations.push({
                    type: 'warning',
                    message: '⚠️ Este juiz valoriza fortemente prova documental. Reforce esta área.',
                    priority: 'high'
                });
            }
            
            if (judge.patterns && judge.patterns.grantsInjunction > 0.7) {
                observations.push({
                    type: 'opportunity',
                    message: '✅ Boa probabilidade de deferimento de tutela antecipada.',
                    priority: 'medium'
                });
            }
            
            if (judge.favorableRate < 0.6) {
                observations.push({
                    type: 'warning',
                    message: '⚠️ Este juiz tem histórico desfavorável. Considere arbitragem ou mudança de foro.',
                    priority: 'high'
                });
            }
            
            if (judge.recommendedStrategy && judge.recommendedStrategy.avoid && judge.recommendedStrategy.avoid.includes('aggressive_claims')) {
                observations.push({
                    type: 'caution',
                    message: 'ℹ️ Evitar linguagem agressiva. Este juiz prefere abordagem técnica.',
                    priority: 'medium'
                });
            }
            
            if (judge.specialization && caseData.area && judge.specialization.includes(caseData.area)) {
                observations.push({
                    type: 'positive',
                    message: `✅ Juiz especializado em ${caseData.area}. Fator positivo.`,
                    priority: 'low'
                });
            }
            
            return observations;
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Compara múltiplos magistrados
     */
    compareJudges(judges, caseData) {
        try {
            const comparisons = [];
            
            for (const judgeName of judges) {
                const analysis = this.analyzeCase(judgeName, caseData);
                if (analysis) {
                    comparisons.push(analysis);
                }
            }
            
            comparisons.sort((a, b) => b.successProbability - a.successProbability);
            
            return {
                best: comparisons[0] || null,
                alternatives: comparisons.slice(1, 3),
                recommendation: comparisons[0]?.successProbability > 0.65 
                    ? 'Litigar neste foro' 
                    : comparisons[0]?.successProbability > 0.50
                    ? 'Considerar arbitragem'
                    : 'Mudança de foro recomendada',
                comparisonTable: comparisons.map(c => ({
                    judge: c.judge,
                    court: c.court,
                    probability: (c.successProbability * 100).toFixed(1) + '%',
                    confidence: (c.confidence * 100).toFixed(1) + '%',
                    injunctionProbability: (c.injunctionProbability * 100).toFixed(1) + '%',
                    expectedDuration: c.expectedDuration
                }))
            };
        } catch (error) {
            console.error('[ELITE] Erro na comparação de juízes:', error);
            return {
                best: null,
                alternatives: [],
                recommendation: 'Erro na comparação. Utilize análise individual.',
                comparisonTable: []
            };
        }
    }
    
    /**
     * Obtém tendências de um tribunal
     */
    getTrends(court, period = 12) {
        try {
            const courtData = this.getCourtProfile(court);
            if (!courtData) return null;
            
            const decisions = this.decisionHistory.filter(d => {
                const judge = this.judges[d.judge];
                return judge && judge.court === court;
            });
            
            const recentDecisions = decisions.filter(d => {
                const date = new Date(d.date);
                const cutoff = new Date();
                cutoff.setMonth(cutoff.getMonth() - period);
                return date >= cutoff;
            });
            
            const favorableDecisions = recentDecisions.filter(d => d.outcome === 'favorable');
            const recentSuccessRate = recentDecisions.length > 0 
                ? favorableDecisions.length / recentDecisions.length 
                : courtData.avgSuccessRate;
            
            const judgesAnalysis = courtData.judges.map(judgeName => {
                const judge = this.getJudgeProfile(judgeName);
                return {
                    name: judgeName,
                    favorableRate: judge?.favorableRate || 0.50,
                    decisions: judge?.decisions || 0
                };
            }).sort((a, b) => b.favorableRate - a.favorableRate);
            
            return {
                court: court,
                courtData: courtData,
                avgSuccessRate: courtData.avgSuccessRate,
                recentSuccessRate: recentSuccessRate,
                avgDuration: courtData.avgDuration,
                judges: judgesAnalysis,
                caseVolume: courtData.caseVolume,
                recommendation: recentSuccessRate > 0.65 
                    ? 'Foro favorável para litígio' 
                    : recentSuccessRate > 0.55
                    ? 'Foro moderado - reforçar estratégia probatória'
                    : 'Foro desafiador - considerar arbitragem',
                trend: recentSuccessRate > courtData.avgSuccessRate ? 'ascending' : 'descending',
                trendPercentage: ((recentSuccessRate - courtData.avgSuccessRate) * 100).toFixed(1)
            };
        } catch (error) {
            console.error('[ELITE] Erro ao obter tendências do tribunal:', error);
            return null;
        }
    }
    
    /**
     * Gera relatório completo de um magistrado
     */
    generateJudgeReport(judgeName) {
        try {
            const judge = this.getJudgeProfile(judgeName);
            if (!judge) return null;
            
            const decisionsByYear = {};
            const decisionsByArea = {};
            
            const judgeDecisions = this.decisionHistory.filter(d => d.judge === judgeName);
            
            for (const decision of judgeDecisions) {
                const year = new Date(decision.date).getFullYear();
                decisionsByYear[year] = (decisionsByYear[year] || 0) + 1;
                decisionsByArea[decision.area] = (decisionsByArea[decision.area] || 0) + 1;
            }
            
            return {
                judge: judge,
                statistics: {
                    totalDecisions: judge.decisions,
                    favorableRate: judge.favorableRate,
                    avgTimeDays: judge.avgTime,
                    decisionsByYear,
                    decisionsByArea,
                    recentCases: judgeDecisions.slice(0, 5)
                },
                patterns: judge.patterns,
                recommendedStrategy: judge.recommendedStrategy,
                keyCases: judge.keyCases,
                personality: judge.personality,
                tendencies: judge.tendencies,
                specialization: judge.specialization,
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('[ELITE] Erro ao gerar relatório do juiz:', error);
            return null;
        }
    }
    
    /**
     * Busca magistrados por especialização
     */
    findJudgesBySpecialization(area) {
        try {
            const results = [];
            
            for (const [name, judge] of Object.entries(this.judges)) {
                if (judge.specialization && judge.specialization.some(spec => spec.toLowerCase().includes(area.toLowerCase()))) {
                    results.push({
                        name: name,
                        court: judge.court,
                        favorableRate: judge.favorableRate,
                        decisions: judge.decisions
                    });
                }
            }
            
            return results.sort((a, b) => b.favorableRate - a.favorableRate);
        } catch (error) {
            console.error('[ELITE] Erro ao buscar juízes por especialização:', error);
            return [];
        }
    }
    
    /**
     * Obtém estatísticas gerais do sistema judicial
     */
    getJudicialStatistics() {
        try {
            const courts = Object.values(this.courts);
            const judges = Object.values(this.judges);
            
            const avgSuccessRate = judges.reduce((sum, j) => sum + j.favorableRate, 0) / (judges.length || 1);
            const avgDuration = judges.reduce((sum, j) => sum + j.avgTime, 0) / (judges.length || 1);
            
            const bestJudge = judges.reduce((best, j) => j.favorableRate > best.favorableRate ? j : best, judges[0]);
            const worstJudge = judges.reduce((worst, j) => j.favorableRate < worst.favorableRate ? j : worst, judges[0]);
            const bestCourt = courts.reduce((best, c) => c.avgSuccessRate > best.avgSuccessRate ? c : best, courts[0]);
            
            return {
                totalCourts: courts.length,
                totalJudges: judges.length,
                avgSuccessRate: (avgSuccessRate * 100).toFixed(1),
                avgDurationDays: avgDuration.toFixed(0),
                bestJudge: {
                    name: bestJudge?.name || 'N/A',
                    court: bestJudge?.court || 'N/A',
                    favorableRate: bestJudge ? (bestJudge.favorableRate * 100).toFixed(1) : '0'
                },
                worstJudge: {
                    name: worstJudge?.name || 'N/A',
                    court: worstJudge?.court || 'N/A',
                    favorableRate: worstJudge ? (worstJudge.favorableRate * 100).toFixed(1) : '0'
                },
                bestCourt: {
                    name: bestCourt?.name || 'N/A',
                    successRate: bestCourt ? (bestCourt.avgSuccessRate * 100).toFixed(1) : '0'
                },
                totalDecisionsAnalyzed: this.decisionHistory.length
            };
        } catch (error) {
            console.error('[ELITE] Erro ao obter estatísticas judiciais:', error);
            return {
                totalCourts: 0,
                totalJudges: 0,
                avgSuccessRate: '0',
                avgDurationDays: '0',
                bestJudge: { name: 'N/A', court: 'N/A', favorableRate: '0' },
                worstJudge: { name: 'N/A', court: 'N/A', favorableRate: '0' },
                bestCourt: { name: 'N/A', successRate: '0' },
                totalDecisionsAnalyzed: 0
            };
        }
    }
    
    /**
     * Renderiza dashboard de análise judicial
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const stats = this.getJudicialStatistics();
            const judgesList = Object.values(this.judges).sort((a, b) => b.favorableRate - a.favorableRate);
            
            container.innerHTML = `
                <div class="judicial-analytics-dashboard">
                    <div class="dashboard-header">
                        <h2><i class="fas fa-gavel"></i> ANÁLISE DE MAGISTRADOS</h2>
                        <div class="header-stats">
                            <div class="stat"><span>🏛️ Tribunais</span><strong>${stats.totalCourts}</strong></div>
                            <div class="stat"><span>⚖️ Magistrados</span><strong>${stats.totalJudges}</strong></div>
                            <div class="stat"><span>📊 Taxa Média</span><strong>${stats.avgSuccessRate}%</strong></div>
                        </div>
                    </div>
                    
                    <div class="judges-grid">
                        ${judgesList.map(judge => `
                            <div class="judge-card">
                                <div class="judge-header">
                                    <i class="fas fa-user-graduate"></i>
                                    <div>
                                        <h3>${judge.name}</h3>
                                        <p>${judge.court}</p>
                                    </div>
                                </div>
                                <div class="judge-stats">
                                    <div class="stat">
                                        <span class="stat-label">Taxa Favorável</span>
                                        <span class="stat-value">${(judge.favorableRate * 100).toFixed(0)}%</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-label">Decisões</span>
                                        <span class="stat-value">${judge.decisions}</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-label">Tempo Médio</span>
                                        <span class="stat-value">${judge.avgTime}d</span>
                                    </div>
                                </div>
                                <div class="judge-specialization">
                                    ${judge.specialization ? judge.specialization.map(spec => `<span class="badge">${spec}</span>`).join('') : ''}
                                </div>
                                <div class="judge-actions">
                                    <button class="action-btn view-judge" data-judge="${judge.name.replace(/'/g, "\\'")}">
                                        <i class="fas fa-chart-line"></i> ANALISAR
                                    </button>
                                    <button class="action-btn compare-judge" data-judge="${judge.name.replace(/'/g, "\\'")}">
                                        <i class="fas fa-chart-simple"></i> COMPARAR
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="court-stats">
                        <h3><i class="fas fa-building"></i> ESTATÍSTICAS POR TRIBUNAL</h3>
                        <table class="data-table">
                            <thead>
                                <tr><th>Tribunal</th><th>Taxa Sucesso</th><th>Duração Média</th><th>Magistrados</th><th>Volume</th> </thead>
                            <tbody>
                                ${Object.values(this.courts).map(court => `
                                    <tr>
                                        <td><strong>${court.name}</strong></td>
                                        <td><span class="status-badge ${court.avgSuccessRate > 0.65 ? 'status-active' : court.avgSuccessRate > 0.55 ? 'status-pending' : 'status-critical'}">${(court.avgSuccessRate * 100).toFixed(0)}%</span></td>
                                        <td>${court.avgDuration} dias</td>
                                        <td>${court.judges.length}</td>
                                        <td>${court.caseVolume}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <style>
                    .judicial-analytics-dashboard{ padding:0; }
                    .dashboard-header{ display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:24px; }
                    .header-stats{ display:flex; gap:24px; }
                    .stat{ text-align:center; }
                    .stat span:first-child{ font-size:0.7rem; color:#94a3b8; display:block; }
                    .stat strong{ font-size:1.2rem; color:var(--elite-primary); }
                    .judges-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; margin-bottom:32px; }
                    .judge-card{ background:var(--bg-command); border:1px solid var(--border-tactic); border-radius:16px; padding:20px; transition:all 0.2s; }
                    .judge-card:hover{ border-color:var(--elite-primary); transform:translateY(-2px); }
                    .judge-header{ display:flex; align-items:center; gap:12px; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border-tactic); }
                    .judge-header i{ font-size:1.5rem; color:var(--elite-primary); }
                    .judge-header h3{ font-size:1rem; margin-bottom:4px; }
                    .judge-header p{ font-size:0.7rem; color:#94a3b8; }
                    .judge-stats{ display:flex; justify-content:space-between; margin-bottom:16px; }
                    .judge-stats .stat{ text-align:center; }
                    .judge-stats .stat-label{ display:block; font-size:0.6rem; color:#64748b; margin-bottom:4px; }
                    .judge-stats .stat-value{ font-size:1rem; font-weight:700; color:var(--elite-primary); }
                    .judge-specialization{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
                    .badge{ background:var(--elite-primary-dim); padding:4px 8px; border-radius:12px; font-size:0.6rem; color:var(--elite-primary); }
                    .judge-actions{ display:flex; gap:12px; justify-content:flex-end; }
                    .action-btn{ background:rgba(255,255,255,0.05); border:1px solid var(--border-tactic); padding:8px 16px; border-radius:8px; cursor:pointer; transition:all 0.2s; font-size:0.7rem; color:#94a3b8; }
                    .action-btn:hover{ border-color:var(--elite-primary); color:var(--elite-primary); }
                    @media (max-width:768px){ .judges-grid{ grid-template-columns:1fr; } .judge-actions{ flex-direction:column; } .action-btn{ text-align:center; } }
                </style>
            `;
            
            container.querySelectorAll('.view-judge').forEach(btn => {
                btn.addEventListener('click', () => {
                    const judgeName = btn.dataset.judge;
                    const report = this.generateJudgeReport(judgeName);
                    if (report && window.EliteUtils) {
                        window.EliteUtils.showToast(`Relatório de ${judgeName} gerado`, 'success');
                        this.showJudgeModal(report);
                    }
                });
            });
            
            container.querySelectorAll('.compare-judge').forEach(btn => {
                btn.addEventListener('click', () => {
                    const judgeName = btn.dataset.judge;
                    this.showComparisonModal(judgeName);
                });
            });
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `
                <div class="alert-item error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Erro ao Carregar</strong>
                        <p>Ocorreu um erro ao carregar a análise de magistrados: ${error.message}</p>
                        <small>Por favor, recarregue a página ou contacte o suporte.</small>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Mostra modal com relatório do juiz
     */
    showJudgeModal(report) {
        const modalBody = document.getElementById('aiPredictionBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="judge-report">
                <div class="report-header">
                    <h3>${report.judge.name}</h3>
                    <p>${report.judge.court} · ${report.judge.position} · Desde ${report.judge.since}</p>
                </div>
                <div class="report-stats">
                    <div class="stat-card"><div class="stat-value">${(report.statistics.favorableRate * 100).toFixed(0)}%</div><div class="stat-label">Taxa Favorável</div></div>
                    <div class="stat-card"><div class="stat-value">${report.statistics.totalDecisions}</div><div class="stat-label">Decisões</div></div>
                    <div class="stat-card"><div class="stat-value">${report.statistics.avgTimeDays}</div><div class="stat-label">Dias Médios</div></div>
                </div>
                <div class="report-section"><h4>Perfil do Magistrado</h4><p><strong>Personalidade:</strong> ${report.personality}</p><p><strong>Tendências:</strong> ${report.tendencies}</p><p><strong>Especializações:</strong> ${report.specialization ? report.specialization.join(', ') : 'N/A'}</p></div>
                <div class="report-section"><h4>Padrões Identificados</h4><ul><li>Prefere prova documental: ${report.patterns?.prefersDocumentaryEvidence ? 'Sim' : 'Não'}</li><li>Aceita prova pericial: ${report.patterns?.acceptsExpertWitness ? 'Sim' : 'Não'}</li><li>Concede tutela antecipada: ${report.patterns?.grantsInjunction ? (report.patterns.grantsInjunction * 100).toFixed(0) : '0'}%</li><li>Taxa de reversão em recurso: ${report.patterns?.appealsReversal ? (report.patterns.appealsReversal * 100).toFixed(0) : '0'}%</li></ul></div>
                <div class="report-section"><h4>Estratégia Recomendada</h4><p><strong>Abordagem:</strong> ${report.recommendedStrategy?.approach || 'Equilibrada'}</p><p><strong>Argumentos preferidos:</strong> ${report.recommendedStrategy?.arguments ? report.recommendedStrategy.arguments.join(', ') : 'N/A'}</p><p><strong>Evitar:</strong> ${report.recommendedStrategy?.avoid ? report.recommendedStrategy.avoid.join(', ') : 'Nenhum'}</p></div>
                <div class="report-section"><h4>Casos Relevantes</h4>${report.keyCases ? report.keyCases.map(k => `<div class="case-item"><strong>${k.number}</strong> (${k.year}) - ${k.outcome === 'favorable' ? '✅ Favorável' : '❌ Desfavorável'}<p>${k.summary} - Valor: €${k.value?.toLocaleString()}</p></div>`).join('') : '<p>Nenhum caso registado</p>'}</div>
            </div>
            <style>
                .judge-report{ padding:0; }
                .report-header{ margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-tactic); }
                .report-header h3{ color:var(--elite-primary); margin-bottom:8px; }
                .report-header p{ font-size:0.75rem; color:#94a3b8; }
                .report-stats{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:24px; }
                .stat-card{ background:var(--bg-command); border-radius:12px; padding:16px; text-align:center; }
                .stat-value{ font-size:1.5rem; font-weight:800; color:var(--elite-primary); }
                .stat-label{ font-size:0.7rem; color:#94a3b8; }
                .report-section{ margin-bottom:20px; padding:12px; background:var(--bg-terminal); border-radius:12px; }
                .report-section h4{ color:var(--elite-primary); margin-bottom:12px; font-size:0.8rem; }
                .case-item{ padding:8px; border-bottom:1px solid var(--border-tactic); margin-bottom:8px; }
                .case-item:last-child{ border-bottom:none; }
            </style>
        `;
        
        document.getElementById('aiPredictionModal').style.display = 'flex';
    }
    
    /**
     * Mostra modal de comparação
     */
    showComparisonModal(selectedJudge) {
        const judges = Object.keys(this.judges);
        const modalBody = document.getElementById('aiPredictionBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="judge-comparison">
                <h3>Comparar Magistrados</h3>
                <div class="form-group"><label>Selecionar magistrado para comparar com ${selectedJudge}</label><select id="compareJudgeSelect">${judges.filter(j => j !== selectedJudge).map(j => `<option value="${j}">${j}</option>`).join('')}</select></div>
                <button id="runComparisonBtn" class="elite-btn primary">COMPARAR</button>
                <div id="comparisonResult" style="margin-top: 20px;"></div>
            </div>
        `;
        
        document.getElementById('runComparisonBtn')?.addEventListener('click', () => {
            const compareWith = document.getElementById('compareJudgeSelect')?.value;
            if (compareWith) {
                const comparison = this.compareJudges([selectedJudge, compareWith], { area: 'fiscal', value: 50000, hasDocumentaryEvidence: true });
                const resultDiv = document.getElementById('comparisonResult');
                if (resultDiv) {
                    resultDiv.innerHTML = `
                        <div class="comparison-table"><table class="data-table"><thead><tr><th>Magistrado</th><th>Probabilidade</th><th>Confiança</th><th>Tutela Antecipada</th><th>Duração</th></tr></thead><tbody>${comparison.comparisonTable.map(c => `<tr><td><strong>${c.judge}</strong></td><td>${c.probability}</td><td>${c.confidence}</td><td>${c.injunctionProbability}</td><td>${c.expectedDuration} dias</td></tr>`).join('')}</tbody></table><div class="recommendation"><strong>Recomendação:</strong> ${comparison.recommendation}</div></div>
                        <style>.comparison-table{ margin-top:16px; } .recommendation{ margin-top:16px; padding:12px; background:var(--elite-primary-dim); border-radius:8px; }</style>
                    `;
                }
            }
        });
        
        document.getElementById('aiPredictionModal').style.display = 'flex';
    }
}

// Instância global
window.JudicialAnalytics = new JudicialAnalytics();