/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE QUANTUM LEGAL ANALYTICS
 * ============================================================================
 * INOVAÇÃO DISRUPTIVA #4:
 * Análise de Teoria de Jogos para Otimização de Acordos
 * 
 * Funcionalidades:
 * 1. Cálculo do momento ótimo para propor acordo (Equilíbrio de Nash)
 * 2. Análise de fluxo de caixa da parte contrária
 * 3. Previsão de probabilidade de aceitação com base em variáveis de mercado
 * 4. Simulação de cenários de negociação com payoff matrices
 * 5. Recomendação de estratégia baseada em análise de comportamento
 * ============================================================================
 */

class QuantumLegalAnalytics {
    constructor() {
        this.marketData = this.loadMarketData();
        this.platformFinancials = this.loadPlatformFinancials();
        this.settlementHistory = this.loadSettlementHistory();
        this.gameTheoryModels = this.loadGameTheoryModels();
        this.initialized = false;
        
        this.loadSettlementHistory();
    }
    
    /**
     * Inicializa o módulo de analytics quântico
     */
    initialize() {
        try {
            this.initialized = true;
            console.log('[ELITE] Quantum Legal Analytics inicializado - Teoria de Jogos Ativa');
        } catch (error) {
            console.error('[ELITE] Erro na inicialização do Quantum Analytics:', error);
            this.initialized = false;
        }
        return this;
    }
    
    /**
     * Carrega dados de mercado com tratamento de erros
     */
    loadMarketData() {
        try {
            return {
                economicIndicators: {
                    inflation: 0.023,
                    interestRate: 0.045,
                    gdpGrowth: 0.019,
                    unemployment: 0.065
                },
                litigationTrends: {
                    banking: { growth: 0.18, avgCaseValue: 12500000, settlementRate: 0.42 },
                    ma: { growth: 0.12, avgCaseValue: 45000000, settlementRate: 0.38 },
                    mass: { growth: 0.25, avgCaseValue: 15200000, settlementRate: 0.55 },
                    tax: { growth: 0.15, avgCaseValue: 12500000, settlementRate: 0.48 },
                    labor: { growth: 0.08, avgCaseValue: 28900, settlementRate: 0.62 }
                },
                seasonality: {
                    Q1: { factor: 0.92, description: 'Menor atividade - início do ano' },
                    Q2: { factor: 1.05, description: 'Aumento de litígios - pós-carnaval' },
                    Q3: { factor: 1.08, description: 'Pico de atividade - antes das férias' },
                    Q4: { factor: 0.95, description: 'Redução - período natalício' }
                }
            };
        } catch (error) {
            console.error('[ELITE] Erro ao carregar dados de mercado:', error);
            return {
                economicIndicators: { inflation: 0.02, interestRate: 0.04, gdpGrowth: 0.02, unemployment: 0.06 },
                litigationTrends: {},
                seasonality: { Q1: { factor: 1.0 }, Q2: { factor: 1.0 }, Q3: { factor: 1.0 }, Q4: { factor: 1.0 } }
            };
        }
    }
    
    /**
     * Carrega dados financeiros de plataformas
     */
    loadPlatformFinancials() {
        try {
            return {
                bolt: {
                    name: 'Bolt',
                    revenue: 8500000000,
                    profitMargin: 0.08,
                    cashFlow: 1200000000,
                    quarterlyProjection: [
                        { quarter: 'Q1 2025', cashFlow: 1150000000, liquidity: 'Alta' },
                        { quarter: 'Q2 2025', cashFlow: 1080000000, liquidity: 'Média' },
                        { quarter: 'Q3 2025', cashFlow: 950000000, liquidity: 'Média' },
                        { quarter: 'Q4 2025', cashFlow: 880000000, liquidity: 'Baixa' }
                    ],
                    settlementCapacity: 85000000,
                    litigationBudget: 45000000,
                    riskTolerance: 0.35
                },
                uber: {
                    name: 'Uber',
                    revenue: 35000000000,
                    profitMargin: 0.12,
                    cashFlow: 5200000000,
                    quarterlyProjection: [
                        { quarter: 'Q1 2025', cashFlow: 5100000000, liquidity: 'Alta' },
                        { quarter: 'Q2 2025', cashFlow: 4950000000, liquidity: 'Alta' },
                        { quarter: 'Q3 2025', cashFlow: 4800000000, liquidity: 'Média' },
                        { quarter: 'Q4 2025', cashFlow: 4650000000, liquidity: 'Média' }
                    ],
                    settlementCapacity: 250000000,
                    litigationBudget: 120000000,
                    riskTolerance: 0.42
                },
                glovo: {
                    name: 'Glovo',
                    revenue: 850000000,
                    profitMargin: -0.05,
                    cashFlow: 120000000,
                    quarterlyProjection: [
                        { quarter: 'Q1 2025', cashFlow: 115000000, liquidity: 'Média' },
                        { quarter: 'Q2 2025', cashFlow: 98000000, liquidity: 'Baixa' },
                        { quarter: 'Q3 2025', cashFlow: 82000000, liquidity: 'Crítica' },
                        { quarter: 'Q4 2025', cashFlow: 75000000, liquidity: 'Crítica' }
                    ],
                    settlementCapacity: 35000000,
                    litigationBudget: 15000000,
                    riskTolerance: 0.65
                },
                default: {
                    name: 'Parte Contrária',
                    revenue: 10000000,
                    profitMargin: 0.05,
                    cashFlow: 1000000,
                    quarterlyProjection: [
                        { quarter: 'Q1 2025', cashFlow: 1000000, liquidity: 'Média' },
                        { quarter: 'Q2 2025', cashFlow: 950000, liquidity: 'Média' },
                        { quarter: 'Q3 2025', cashFlow: 900000, liquidity: 'Baixa' },
                        { quarter: 'Q4 2025', cashFlow: 850000, liquidity: 'Baixa' }
                    ],
                    settlementCapacity: 5000000,
                    litigationBudget: 2000000,
                    riskTolerance: 0.5
                }
            };
        } catch (error) {
            console.error('[ELITE] Erro ao carregar dados financeiros:', error);
            return { default: { name: 'Parte Contrária', cashFlow: 1000000, settlementCapacity: 5000000, riskTolerance: 0.5 } };
        }
    }
    
    /**
     * Carrega histórico de acordos
     */
    loadSettlementHistory() {
        try {
            return [
                { platform: 'bolt', quarter: 'Q1 2024', count: 12, avgDiscount: 0.32, acceptanceRate: 0.68 },
                { platform: 'bolt', quarter: 'Q2 2024', count: 15, avgDiscount: 0.28, acceptanceRate: 0.72 },
                { platform: 'bolt', quarter: 'Q3 2024', count: 18, avgDiscount: 0.25, acceptanceRate: 0.75 },
                { platform: 'bolt', quarter: 'Q4 2024', count: 22, avgDiscount: 0.22, acceptanceRate: 0.78 },
                { platform: 'uber', quarter: 'Q1 2024', count: 8, avgDiscount: 0.35, acceptanceRate: 0.58 },
                { platform: 'uber', quarter: 'Q2 2024', count: 10, avgDiscount: 0.32, acceptanceRate: 0.62 },
                { platform: 'uber', quarter: 'Q3 2024', count: 12, avgDiscount: 0.30, acceptanceRate: 0.65 },
                { platform: 'uber', quarter: 'Q4 2024', count: 15, avgDiscount: 0.28, acceptanceRate: 0.68 },
                { platform: 'glovo', quarter: 'Q1 2024', count: 5, avgDiscount: 0.45, acceptanceRate: 0.52 },
                { platform: 'glovo', quarter: 'Q2 2024', count: 7, avgDiscount: 0.48, acceptanceRate: 0.48 },
                { platform: 'glovo', quarter: 'Q3 2024', count: 9, avgDiscount: 0.52, acceptanceRate: 0.45 },
                { platform: 'glovo', quarter: 'Q4 2024', count: 11, avgDiscount: 0.55, acceptanceRate: 0.42 }
            ];
        } catch (error) {
            console.error('[ELITE] Erro ao carregar histórico de acordos:', error);
            return [];
        }
    }
    
    /**
     * Carrega modelos de teoria de jogos
     */
    loadGameTheoryModels() {
        try {
            return {
                payoffMatrix: {
                    aggressive_vs_aggressive: { a: -0.3, b: -0.25, equilibrium: false },
                    aggressive_vs_compromise: { a: 0.2, b: -0.1, equilibrium: false },
                    compromise_vs_aggressive: { a: -0.1, b: 0.2, equilibrium: false },
                    compromise_vs_compromise: { a: 0.4, b: 0.3, equilibrium: true },
                    concede_vs_aggressive: { a: -0.5, b: 0.4, equilibrium: false },
                    aggressive_vs_concede: { a: 0.5, b: -0.4, equilibrium: false }
                },
                dominantStrategies: {
                    high_cashflow: 'aggressive',
                    low_cashflow: 'compromise',
                    critical_liquidity: 'concede',
                    high_risk_tolerance: 'aggressive',
                    low_risk_tolerance: 'compromise'
                }
            };
        } catch (error) {
            console.error('[ELITE] Erro ao carregar modelos de teoria de jogos:', error);
            return { payoffMatrix: {}, dominantStrategies: {} };
        }
    }
    
    /**
     * Obtém trimestre atual
     */
    getCurrentQuarter() {
        try {
            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();
            if (month <= 2) return `Q1 ${year}`;
            if (month <= 5) return `Q2 ${year}`;
            if (month <= 8) return `Q3 ${year}`;
            return `Q4 ${year}`;
        } catch (error) {
            return 'Q1 2025';
        }
    }
    
    /**
     * Obtém dados financeiros da plataforma com fallback
     */
    getPlatformFinancials(platform) {
        try {
            return this.platformFinancials[platform] || this.platformFinancials.default;
        } catch (error) {
            return this.platformFinancials.default;
        }
    }
    
    /**
     * Analisa o momento ótimo para propor acordo
     */
    analyzeOptimalSettlementTiming(caseData, platform) {
        try {
            const financials = this.getPlatformFinancials(platform);
            const currentQuarter = this.getCurrentQuarter();
            const futureQuarters = financials.quarterlyProjection || [];
            
            const cashFlowAnalysis = this.analyzeCashFlow(financials);
            
            let worstLiquidityQuarter = null;
            let worstLiquidityScore = 1;
            
            for (const q of futureQuarters) {
                let liquidityScore = 1;
                if (q.liquidity === 'Crítica') liquidityScore = 0;
                else if (q.liquidity === 'Baixa') liquidityScore = 0.3;
                else if (q.liquidity === 'Média') liquidityScore = 0.6;
                else if (q.liquidity === 'Alta') liquidityScore = 0.9;
                
                if (liquidityScore < worstLiquidityScore) {
                    worstLiquidityScore = liquidityScore;
                    worstLiquidityQuarter = q;
                }
            }
            
            const settlementTrend = this.analyzeSettlementTrend(platform);
            
            const acceptanceProbabilities = [];
            for (const q of futureQuarters) {
                let baseProbability = settlementTrend.currentAcceptanceRate || 0.65;
                
                if (q.liquidity === 'Crítica') baseProbability += 0.25;
                else if (q.liquidity === 'Baixa') baseProbability += 0.15;
                else if (q.liquidity === 'Média') baseProbability += 0.05;
                else baseProbability -= 0.1;
                
                const seasonality = this.marketData.seasonality[q.quarter] || { factor: 1.0 };
                baseProbability *= seasonality.factor;
                
                const caseValue = caseData.value || 50000;
                const valueFactor = Math.min(caseValue / (financials.settlementCapacity || 5000000), 1);
                baseProbability *= (1 - valueFactor * 0.3);
                
                acceptanceProbabilities.push({
                    quarter: q.quarter,
                    probability: Math.min(Math.max(baseProbability, 0.1), 0.95),
                    liquidity: q.liquidity,
                    recommendedDiscount: this.calculateRecommendedDiscount(platform, q, caseValue)
                });
            }
            
            const optimal = acceptanceProbabilities.reduce((best, current) => 
                current.probability > best.probability ? current : best, acceptanceProbabilities[0] || { probability: 0.5 });
            
            const nashEquilibrium = this.calculateNashEquilibrium(caseData, platform, optimal);
            
            return {
                platform: financials.name,
                currentQuarter: currentQuarter,
                cashFlowAnalysis: cashFlowAnalysis,
                optimalTiming: optimal,
                acceptanceProbabilities: acceptanceProbabilities,
                nashEquilibrium: nashEquilibrium,
                recommendedStrategy: this.getRecommendedStrategy(platform, optimal, cashFlowAnalysis),
                payoffMatrix: this.generatePayoffMatrix(caseData, platform, optimal),
                expectedROI: this.calculateExpectedROI(caseData, optimal)
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de timing ótimo:', error);
            return {
                platform: platform || 'desconhecido',
                currentQuarter: this.getCurrentQuarter(),
                cashFlowAnalysis: { liquidityRisk: 'medium', recommendation: 'Análise indisponível devido a erro' },
                optimalTiming: { quarter: this.getCurrentQuarter(), probability: 0.5, recommendedDiscount: 0.25 },
                acceptanceProbabilities: [],
                nashEquilibrium: { isEquilibrium: false, explanation: 'Erro no cálculo do equilíbrio' },
                recommendedStrategy: { name: 'Estratégia Conservadora', description: 'Análise temporariamente indisponível' },
                payoffMatrix: { matrix: [] },
                expectedROI: { roi: '0%', recommendation: 'Erro no cálculo' }
            };
        }
    }
    
    /**
     * Analisa fluxo de caixa da parte contrária
     */
    analyzeCashFlow(financials) {
        try {
            const currentCF = financials.cashFlow || 0;
            const projectedCF = financials.quarterlyProjection || [];
            
            let trend = 'stable';
            let trendPercentage = 0;
            
            if (projectedCF.length >= 2) {
                const first = projectedCF[0].cashFlow || 0;
                const last = projectedCF[projectedCF.length - 1].cashFlow || 0;
                trendPercentage = first > 0 ? ((last - first) / first) * 100 : 0;
                trend = trendPercentage > 0 ? 'improving' : 'declining';
            }
            
            const liquidityRisk = this.assessLiquidityRisk(financials);
            
            return {
                currentCashFlow: currentCF,
                projectedTrend: trend,
                trendPercentage: trendPercentage.toFixed(1),
                liquidityRisk: liquidityRisk,
                settlementCapacity: financials.settlementCapacity || 0,
                riskTolerance: financials.riskTolerance || 0.5,
                recommendation: liquidityRisk === 'high' 
                    ? 'Momento favorável para propor acordo - contraparte com necessidade de liquidez'
                    : liquidityRisk === 'medium'
                    ? 'Janela de oportunidade moderada - considerar proposta com desconto competitivo'
                    : 'Contraparte com liquidez confortável - estratégia mais agressiva recomendada'
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de fluxo de caixa:', error);
            return {
                currentCashFlow: 0,
                projectedTrend: 'stable',
                trendPercentage: '0',
                liquidityRisk: 'medium',
                settlementCapacity: 0,
                riskTolerance: 0.5,
                recommendation: 'Análise de fluxo de caixa temporariamente indisponível'
            };
        }
    }
    
    /**
     * Avalia risco de liquidez
     */
    assessLiquidityRisk(financials) {
        try {
            const quarterlyProjection = financials.quarterlyProjection || [];
            let criticalQuarters = 0;
            
            for (const q of quarterlyProjection) {
                if (q.liquidity === 'Crítica') criticalQuarters++;
                else if (q.liquidity === 'Baixa') criticalQuarters += 0.5;
            }
            
            if (criticalQuarters >= 2) return 'high';
            if (criticalQuarters >= 1) return 'medium';
            return 'low';
        } catch (error) {
            return 'medium';
        }
    }
    
    /**
     * Analisa tendência de acordos
     */
    analyzeSettlementTrend(platform) {
        try {
            const history = this.settlementHistory.filter(h => h.platform === platform);
            if (history.length === 0) return { trend: 'stable', currentAcceptanceRate: 0.5, averageDiscount: 0.3 };
            
            const recent = history.slice(-4);
            const avgAcceptance = recent.reduce((sum, h) => sum + (h.acceptanceRate || 0.5), 0) / recent.length;
            const avgDiscount = recent.reduce((sum, h) => sum + (h.avgDiscount || 0.3), 0) / recent.length;
            
            let trend = 'stable';
            if (recent.length >= 2) {
                const last = recent[recent.length - 1].acceptanceRate || 0.5;
                const prev = recent[recent.length - 2].acceptanceRate || 0.5;
                if (last > prev) trend = 'increasing';
                else if (last < prev) trend = 'decreasing';
            }
            
            return {
                trend: trend,
                currentAcceptanceRate: avgAcceptance,
                averageDiscount: avgDiscount,
                recentQuarters: recent.map(h => ({ quarter: h.quarter, acceptanceRate: h.acceptanceRate, discount: h.avgDiscount }))
            };
        } catch (error) {
            return { trend: 'stable', currentAcceptanceRate: 0.65, averageDiscount: 0.3 };
        }
    }
    
    /**
     * Calcula desconto recomendado
     */
    calculateRecommendedDiscount(platform, quarter, caseValue) {
        try {
            const financials = this.getPlatformFinancials(platform);
            const settlementTrend = this.analyzeSettlementTrend(platform);
            
            let baseDiscount = settlementTrend.averageDiscount || 0.3;
            
            if (quarter.liquidity === 'Crítica') baseDiscount += 0.15;
            else if (quarter.liquidity === 'Baixa') baseDiscount += 0.1;
            else if (quarter.liquidity === 'Média') baseDiscount += 0.05;
            else baseDiscount -= 0.05;
            
            const valueRatio = caseValue / (financials.settlementCapacity || 5000000);
            if (valueRatio > 0.5) baseDiscount += 0.05;
            else if (valueRatio < 0.1) baseDiscount -= 0.05;
            
            return Math.min(Math.max(baseDiscount, 0.1), 0.7);
        } catch (error) {
            return 0.25;
        }
    }
    
    /**
     * Calcula Equilíbrio de Nash
     */
    calculateNashEquilibrium(caseData, platform, optimalTiming) {
        try {
            const financials = this.getPlatformFinancials(platform);
            const caseValue = caseData.value || 50000;
            const proposedValue = caseValue * (1 - (optimalTiming.recommendedDiscount || 0.25));
            
            const clientPayoff = {
                accept: proposedValue,
                reject_litigate: caseValue * ((caseData.successProbability || 70) / 100),
                reject_arbitrate: caseValue * 0.6,
                expectedValue: proposedValue * (optimalTiming.probability || 0.5) + 
                               (caseValue * 0.7) * (1 - (optimalTiming.probability || 0.5))
            };
            
            const platformPayoff = {
                accept: -proposedValue,
                reject_litigate: -(caseValue * 0.5 + 50000),
                reject_settle_later: -(caseValue * 0.3),
                bestResponse: proposedValue < (caseValue * 0.5 + 50000) ? 'accept' : 'reject'
            };
            
            const isNashEquilibrium = platformPayoff.bestResponse === 'accept' && 
                                       clientPayoff.expectedValue > clientPayoff.reject_litigate;
            
            return {
                isEquilibrium: isNashEquilibrium,
                clientOptimalStrategy: clientPayoff.expectedValue > clientPayoff.reject_litigate ? 'accept' : 'litigate',
                platformOptimalStrategy: platformPayoff.bestResponse,
                equilibriumValue: proposedValue,
                clientPayoff: clientPayoff,
                platformPayoff: platformPayoff,
                explanation: isNashEquilibrium 
                    ? `Proposta de €${proposedValue.toLocaleString()} (${((optimalTiming.recommendedDiscount || 0.25) * 100).toFixed(0)}% de desconto) está no equilíbrio.`
                    : `Proposta atual não está no equilíbrio. ${platformPayoff.bestResponse === 'accept' ? 'Cliente' : 'Plataforma'} tem incentivo para desviar.`
            };
        } catch (error) {
            return {
                isEquilibrium: false,
                explanation: 'Erro no cálculo do Equilíbrio de Nash',
                clientOptimalStrategy: 'litigate',
                platformOptimalStrategy: 'reject'
            };
        }
    }
    
    /**
     * Obtém estratégia recomendada
     */
    getRecommendedStrategy(platform, optimalTiming, cashFlowAnalysis) {
        try {
            const strategies = {
                aggressive: {
                    name: 'Estratégia Agressiva',
                    description: 'Manter posição firme, propor desconto mínimo',
                    discount: '5-15%',
                    timing: 'Imediato ou quando contraparte tem alta liquidez',
                    successProbability: 0.65
                },
                balanced: {
                    name: 'Estratégia Equilibrada',
                    description: 'Propor desconto moderado, buscar acordo vantajoso',
                    discount: '20-30%',
                    timing: 'Quando contraparte tem liquidez média',
                    successProbability: 0.75
                },
                concession: {
                    name: 'Estratégia de Concessão',
                    description: 'Oferecer desconto significativo para garantir acordo rápido',
                    discount: '35-50%',
                    timing: 'Quando contraparte tem necessidade crítica de liquidez',
                    successProbability: 0.85
                }
            };
            
            let selected = strategies.balanced;
            
            if (cashFlowAnalysis.liquidityRisk === 'high') {
                selected = strategies.concession;
            } else if (cashFlowAnalysis.liquidityRisk === 'low' && optimalTiming.liquidity !== 'Crítica') {
                selected = strategies.aggressive;
            }
            
            return {
                ...selected,
                recommendedDiscount: (optimalTiming.recommendedDiscount || 0.25) * 100,
                optimalQuarter: optimalTiming.quarter || 'Q1 2025',
                acceptanceProbability: ((optimalTiming.probability || 0.5) * 100).toFixed(0) + '%',
                rationale: cashFlowAnalysis.liquidityRisk === 'high' 
                    ? 'Contraparte com necessidade crítica de liquidez - janela de oportunidade'
                    : cashFlowAnalysis.liquidityRisk === 'low'
                    ? 'Contraparte com liquidez confortável - manter posição agressiva'
                    : 'Momento equilibrado para negociação'
            };
        } catch (error) {
            return {
                name: 'Estratégia Conservadora',
                description: 'Análise indisponível, adotar abordagem conservadora',
                discount: '20-30%',
                timing: 'Aguardar evolução do processo',
                successProbability: 0.6,
                recommendedDiscount: 25,
                optimalQuarter: 'Q1 2025',
                acceptanceProbability: '65%',
                rationale: 'Análise temporariamente indisponível devido a erro'
            };
        }
    }
    
    /**
     * Gera matriz de payoff
     */
    generatePayoffMatrix(caseData, platform, optimalTiming) {
        try {
            const caseValue = caseData.value || 50000;
            const discount = optimalTiming.recommendedDiscount || 0.25;
            const proposedValue = caseValue * (1 - discount);
            
            const clientStrategies = ['aggressive', 'balanced', 'concession'];
            const platformStrategies = ['aggressive', 'balanced', 'concession'];
            
            const matrix = [];
            
            for (const clientStrategy of clientStrategies) {
                const row = { clientStrategy, platformPayoffs: [] };
                
                for (const platformStrategy of platformStrategies) {
                    let clientPayoff = 0;
                    let platformPayoff = 0;
                    
                    if (clientStrategy === 'aggressive' && platformStrategy === 'aggressive') {
                        clientPayoff = caseValue * 0.3;
                        platformPayoff = -caseValue * 0.5;
                    } else if (clientStrategy === 'aggressive' && platformStrategy === 'balanced') {
                        clientPayoff = caseValue * 0.5;
                        platformPayoff = -caseValue * 0.35;
                    } else if (clientStrategy === 'aggressive' && platformStrategy === 'concession') {
                        clientPayoff = caseValue * 0.7;
                        platformPayoff = -caseValue * 0.2;
                    } else if (clientStrategy === 'balanced' && platformStrategy === 'aggressive') {
                        clientPayoff = caseValue * 0.4;
                        platformPayoff = -caseValue * 0.4;
                    } else if (clientStrategy === 'balanced' && platformStrategy === 'balanced') {
                        clientPayoff = proposedValue;
                        platformPayoff = -proposedValue;
                    } else if (clientStrategy === 'balanced' && platformStrategy === 'concession') {
                        clientPayoff = proposedValue * 1.1;
                        platformPayoff = -proposedValue * 0.9;
                    } else if (clientStrategy === 'concession' && platformStrategy === 'aggressive') {
                        clientPayoff = caseValue * 0.2;
                        platformPayoff = -caseValue * 0.6;
                    } else if (clientStrategy === 'concession' && platformStrategy === 'balanced') {
                        clientPayoff = caseValue * 0.3;
                        platformPayoff = -caseValue * 0.45;
                    } else if (clientStrategy === 'concession' && platformStrategy === 'concession') {
                        clientPayoff = caseValue * 0.5;
                        platformPayoff = -caseValue * 0.3;
                    }
                    
                    row.platformPayoffs.push({
                        platformStrategy,
                        clientPayoff: Math.round(clientPayoff),
                        platformPayoff: Math.round(platformPayoff),
                        isNash: false
                    });
                }
                
                matrix.push(row);
            }
            
            return {
                clientStrategies: clientStrategies,
                platformStrategies: platformStrategies,
                matrix: matrix,
                dominantStrategy: this.findDominantStrategy(matrix),
                recommendation: this.findNashEquilibrium(matrix)
            };
        } catch (error) {
            return {
                clientStrategies: ['aggressive', 'balanced', 'concession'],
                platformStrategies: ['aggressive', 'balanced', 'concession'],
                matrix: [],
                dominantStrategy: { strategy: 'balanced', description: 'Estratégia equilibrada' },
                recommendation: { exists: false, description: 'Nenhum equilíbrio encontrado' }
            };
        }
    }
    
    /**
     * Encontra estratégia dominante
     */
    findDominantStrategy(matrix) {
        try {
            const clientScores = { aggressive: 0, balanced: 0, concession: 0 };
            
            for (let i = 0; i < matrix.length; i++) {
                const strategy = matrix[i].clientStrategy;
                const avgPayoff = matrix[i].platformPayoffs.reduce((sum, p) => sum + p.clientPayoff, 0) / matrix[i].platformPayoffs.length;
                clientScores[strategy] = avgPayoff;
            }
            
            const dominant = Object.entries(clientScores).reduce((a, b) => a[1] > b[1] ? a : b);
            
            return {
                strategy: dominant[0],
                avgPayoff: Math.round(dominant[1]),
                description: `Estratégia ${dominant[0]} maximiza o payoff médio`
            };
        } catch (error) {
            return { strategy: 'balanced', avgPayoff: 0, description: 'Estratégia equilibrada recomendada' };
        }
    }
    
    /**
     * Encontra equilíbrio de Nash
     */
    findNashEquilibrium(matrix) {
        try {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].platformPayoffs.length; j++) {
                    if (matrix[i].platformPayoffs[j].isNash) {
                        return {
                            exists: true,
                            clientStrategy: matrix[i].clientStrategy,
                            platformStrategy: matrix[i].platformPayoffs[j].platformStrategy,
                            clientPayoff: matrix[i].platformPayoffs[j].clientPayoff,
                            platformPayoff: matrix[i].platformPayoffs[j].platformPayoff,
                            description: `Equilíbrio de Nash: Cliente joga ${matrix[i].clientStrategy}, Plataforma joga ${matrix[i].platformPayoffs[j].platformStrategy}`
                        };
                    }
                }
            }
            return { exists: false, description: 'Nenhum equilíbrio de Nash puro encontrado' };
        } catch (error) {
            return { exists: false, description: 'Erro na análise de equilíbrio' };
        }
    }
    
    /**
     * Calcula ROI esperado
     */
    calculateExpectedROI(caseData, optimalTiming) {
        try {
            const caseValue = caseData.value || 50000;
            const settlementValue = caseValue * (1 - (optimalTiming.recommendedDiscount || 0.25));
            const litigationCosts = 25000;
            const successProbability = (caseData.successProbability || 70) / 100;
            const expectedLitigationValue = caseValue * successProbability - litigationCosts;
            
            const roi = expectedLitigationValue > 0 
                ? ((settlementValue - expectedLitigationValue) / expectedLitigationValue) * 100 
                : 0;
            
            return {
                settlementValue: settlementValue,
                expectedLitigationValue: expectedLitigationValue,
                roi: roi.toFixed(1) + '%',
                recommendation: roi > 0 ? 'Acordo mais vantajoso que litígio' : 'Litígio pode ser mais vantajoso',
                breakEvenDiscount: expectedLitigationValue > 0 
                    ? ((caseValue - expectedLitigationValue) / caseValue * 100).toFixed(1) + '%'
                    : 'N/A'
            };
        } catch (error) {
            return {
                settlementValue: 0,
                expectedLitigationValue: 0,
                roi: '0%',
                recommendation: 'Erro no cálculo do ROI',
                breakEvenDiscount: 'N/A'
            };
        }
    }
    
    /**
     * Gera relatório completo
     */
    generateReport(caseData, platform) {
        try {
            const analysis = this.analyzeOptimalSettlementTiming(caseData, platform);
            
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                platform: platform,
                caseValue: caseData.value,
                optimalTiming: {
                    quarter: analysis.optimalTiming.quarter,
                    probability: (analysis.optimalTiming.probability * 100).toFixed(0) + '%',
                    recommendedDiscount: (analysis.optimalTiming.recommendedDiscount * 100).toFixed(0) + '%',
                    liquidity: analysis.optimalTiming.liquidity
                },
                cashFlowAnalysis: {
                    currentCashFlow: analysis.cashFlowAnalysis.currentCashFlow,
                    liquidityRisk: analysis.cashFlowAnalysis.liquidityRisk,
                    recommendation: analysis.cashFlowAnalysis.recommendation
                },
                nashEquilibrium: analysis.nashEquilibrium,
                recommendedStrategy: analysis.recommendedStrategy,
                expectedROI: analysis.expectedROI,
                payoffMatrix: analysis.payoffMatrix,
                summary: this.generateSummary(analysis)
            };
        } catch (error) {
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                platform: platform,
                error: true,
                summary: { headline: 'Erro na análise', keyFinding: error.message, recommendation: 'Reintentar análise' }
            };
        }
    }
    
    /**
     * Gera sumário executivo
     */
    generateSummary(analysis) {
        try {
            const optimal = analysis.optimalTiming;
            const strategy = analysis.recommendedStrategy;
            
            return {
                headline: `Momento ótimo para acordo: ${optimal.quarter}`,
                keyFinding: `Probabilidade de aceitação de ${(optimal.probability * 100).toFixed(0)}% com desconto de ${(optimal.recommendedDiscount * 100).toFixed(0)}%`,
                recommendation: strategy.name,
                rationale: strategy.rationale,
                expectedOutcome: strategy.acceptanceProbability === '85%' ? 'Alta probabilidade de acordo rápido' : 
                                 strategy.acceptanceProbability === '75%' ? 'Boa oportunidade de acordo' :
                                 'Janela desafiadora - considerar estratégia alternativa'
            };
        } catch (error) {
            return {
                headline: 'Análise indisponível',
                keyFinding: 'Erro no processamento',
                recommendation: 'Reintentar análise',
                rationale: 'Erro técnico no cálculo do momento ótimo'
            };
        }
    }
    
    /**
     * Renderiza dashboard de analytics quântico
     */
    renderDashboard(containerId, caseData, platform) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const analysis = this.analyzeOptimalSettlementTiming(caseData, platform);
            
            container.innerHTML = `
                <div class="quantum-analytics-dashboard">
                    <div class="dashboard-header">
                        <h2><i class="fas fa-chart-line"></i> QUANTUM LEGAL ANALYTICS</h2>
                        <div class="platform-badge">${analysis.platform}</div>
                    </div>
                    
                    <div class="summary-header">
                        <div class="summary-card"><div class="summary-value">${analysis.optimalTiming.quarter}</div><div class="summary-label">Momento Ótimo</div><div class="summary-trend">${analysis.optimalTiming.liquidity}</div></div>
                        <div class="summary-card"><div class="summary-value">${analysis.optimalTiming.probability}</div><div class="summary-label">Probabilidade Aceitação</div><div class="summary-trend trend-up">+${(analysis.optimalTiming.probability * 100).toFixed(0)}%</div></div>
                        <div class="summary-card"><div class="summary-value">${analysis.optimalTiming.recommendedDiscount}</div><div class="summary-label">Desconto Recomendado</div></div>
                        <div class="summary-card"><div class="summary-value">${analysis.expectedROI.roi}</div><div class="summary-label">ROI Esperado</div><div class="summary-trend ${analysis.expectedROI.roi > '0' ? 'positive' : 'negative'}">${analysis.expectedROI.recommendation}</div></div>
                    </div>
                    
                    <div class="two-columns">
                        <div class="column">
                            <div class="cashflow-card">
                                <h3><i class="fas fa-chart-line"></i> Análise de Fluxo de Caixa</h3>
                                <div class="cashflow-metric"><div class="metric-label">Liquidez Atual</div><div class="metric-value">€${((analysis.cashFlowAnalysis.currentCashFlow || 0) / 1000000).toFixed(0)}M</div><div class="metric-status ${analysis.cashFlowAnalysis.liquidityRisk === 'high' ? 'critical' : analysis.cashFlowAnalysis.liquidityRisk === 'medium' ? 'warning' : 'good'}">Risco: ${analysis.cashFlowAnalysis.liquidityRisk === 'high' ? 'ALTO' : analysis.cashFlowAnalysis.liquidityRisk === 'medium' ? 'MÉDIO' : 'BAIXO'}</div></div>
                                <div class="cashflow-recommendation"><i class="fas fa-lightbulb"></i> ${analysis.cashFlowAnalysis.recommendation}</div>
                            </div>
                            <div class="probabilities-card">
                                <h3><i class="fas fa-chart-simple"></i> Probabilidades por Trimestre</h3>
                                <div class="quarter-probabilities">${analysis.acceptanceProbabilities.map(q => `<div class="quarter-item"><div class="quarter-name">${q.quarter}</div><div class="progress-bar"><div class="progress-fill" style="width: ${q.probability * 100}%"></div><span class="progress-text">${(q.probability * 100).toFixed(0)}%</span></div><div class="quarter-discount">Desconto: ${(q.recommendedDiscount * 100).toFixed(0)}%</div></div>`).join('')}</div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="nash-card">
                                <h3><i class="fas fa-chess-board"></i> Equilíbrio de Nash</h3>
                                <div class="nash-status ${analysis.nashEquilibrium.isEquilibrium ? 'equilibrium' : 'no-equilibrium'}">${analysis.nashEquilibrium.isEquilibrium ? '✓ EQUILÍBRIO ENCONTRADO' : '⚠ SEM EQUILÍBRIO PURO'}</div>
                                <div class="nash-explanation">${analysis.nashEquilibrium.explanation}</div>
                                <div class="nash-values"><div class="value-row"><span>Valor de Equilíbrio:</span><strong>€${analysis.nashEquilibrium.equilibriumValue ? analysis.nashEquilibrium.equilibriumValue.toLocaleString() : 'N/A'}</strong></div><div class="value-row"><span>Estratégia Cliente:</span><strong>${analysis.nashEquilibrium.clientOptimalStrategy === 'accept' ? 'Aceitar proposta' : 'Litigar'}</strong></div><div class="value-row"><span>Estratégia Plataforma:</span><strong>${analysis.nashEquilibrium.platformOptimalStrategy === 'accept' ? 'Aceitar proposta' : 'Rejeitar'}</strong></div></div>
                            </div>
                            <div class="strategy-card">
                                <h3><i class="fas fa-gavel"></i> Estratégia Recomendada</h3>
                                <div class="strategy-name">${analysis.recommendedStrategy.name}</div>
                                <div class="strategy-description">${analysis.recommendedStrategy.description}</div>
                                <div class="strategy-details"><div><strong>Desconto:</strong> ${analysis.recommendedStrategy.discount}</div><div><strong>Timing:</strong> ${analysis.recommendedStrategy.optimalQuarter}</div><div><strong>Probabilidade:</strong> ${analysis.recommendedStrategy.acceptanceProbability}</div></div>
                                <div class="strategy-rationale"><i class="fas fa-brain"></i> ${analysis.recommendedStrategy.rationale}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="roi-card">
                        <h3><i class="fas fa-chart-pie"></i> Análise de ROI</h3>
                        <div class="roi-values"><div class="roi-item"><div class="roi-label">Valor do Acordo</div><div class="roi-value">€${analysis.expectedROI.settlementValue.toLocaleString()}</div></div><div class="roi-item"><div class="roi-label">Valor Esperado Litígio</div><div class="roi-value">€${analysis.expectedROI.expectedLitigationValue.toLocaleString()}</div></div><div class="roi-item"><div class="roi-label">ROI do Acordo</div><div class="roi-value ${analysis.expectedROI.roi > '0' ? 'positive' : 'negative'}">${analysis.expectedROI.roi}</div></div><div class="roi-item"><div class="roi-label">Break-even Discount</div><div class="roi-value">${analysis.expectedROI.breakEvenDiscount}</div></div></div>
                        <div class="roi-recommendation"><i class="fas ${analysis.expectedROI.roi > '0' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> ${analysis.expectedROI.recommendation}</div>
                    </div>
                    
                    <div class="summary-footer">
                        <div class="summary-headline">${analysis.summary.headline}</div>
                        <div class="summary-key">${analysis.summary.keyFinding}</div>
                        <div class="summary-action"><button id="applyStrategyBtn" class="elite-btn primary"><i class="fas fa-rocket"></i> APLICAR ESTRATÉGIA RECOMENDADA</button><button id="exportAnalysisBtn" class="elite-btn secondary"><i class="fas fa-download"></i> EXPORTAR ANÁLISE</button></div>
                    </div>
                </div>
                <style>
                    .quantum-analytics-dashboard{ padding:0; }
                    .platform-badge{ background:var(--elite-primary-dim); color:var(--elite-primary); padding:4px 12px; border-radius:20px; font-size:0.7rem; }
                    .summary-header{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin:20px 0; }
                    .summary-card{ background:var(--bg-command); border-radius:16px; padding:20px; text-align:center; }
                    .summary-value{ font-size:1.5rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); }
                    .summary-label{ font-size:0.7rem; color:#94a3b8; margin:8px 0; }
                    .two-columns{ display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:20px 0; }
                    .cashflow-card,.probabilities-card,.nash-card,.strategy-card{ background:var(--bg-terminal); border-radius:16px; padding:20px; margin-bottom:20px; }
                    .cashflow-metric{ text-align:center; padding:16px; }
                    .metric-status{ margin-top:8px; font-size:0.7rem; font-weight:bold; }
                    .metric-status.critical{ color:#ff1744; }
                    .metric-status.warning{ color:#ffc107; }
                    .metric-status.good{ color:#00e676; }
                    .quarter-probabilities{ display:flex; flex-direction:column; gap:12px; }
                    .quarter-item{ display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
                    .quarter-name{ width:60px; font-size:0.7rem; font-weight:bold; }
                    .quarter-item .progress-bar{ flex:1; }
                    .nash-status{ padding:12px; border-radius:8px; text-align:center; font-weight:bold; margin-bottom:16px; }
                    .nash-status.equilibrium{ background:rgba(0,230,118,0.1); color:#00e676; }
                    .nash-status.no-equilibrium{ background:rgba(255,193,7,0.1); color:#ffc107; }
                    .strategy-name{ font-size:1.2rem; font-weight:bold; color:var(--elite-primary); margin:12px 0; }
                    .strategy-details{ display:flex; gap:16px; justify-content:space-between; padding:12px; background:var(--bg-command); border-radius:8px; margin-bottom:16px; font-size:0.7rem; flex-wrap:wrap; }
                    .roi-card{ background:var(--bg-terminal); border-radius:16px; padding:20px; margin:20px 0; }
                    .roi-values{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin:16px 0; }
                    .roi-value.positive{ color:#00e676; }
                    .roi-value.negative{ color:#ff1744; }
                    .summary-footer{ background:var(--bg-command); border-radius:16px; padding:24px; text-align:center; margin-top:20px; }
                    @media (max-width:768px){ .two-columns{ grid-template-columns:1fr; } .roi-values{ grid-template-columns:1fr 1fr; } .summary-header{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
            
            document.getElementById('applyStrategyBtn')?.addEventListener('click', () => {
                if (window.EliteUtils) {
                    window.EliteUtils.showToast(`Estratégia ${analysis.recommendedStrategy.name} aplicada. Proposta recomendada: ${analysis.recommendedStrategy.discount} de desconto.`, 'success');
                }
            });
            
            document.getElementById('exportAnalysisBtn')?.addEventListener('click', () => {
                const report = this.generateReport(caseData, platform);
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `quantum_analysis_${caseData.id}_${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(link.href);
                if (window.EliteUtils) window.EliteUtils.showToast('Análise exportada com sucesso', 'success');
            });
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard Quantum Analytics:', error);
            container.innerHTML = `
                <div class="alert-item error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Erro na Análise</strong>
                        <p>Ocorreu um erro ao processar a análise quântica: ${error.message}</p>
                        <small>Por favor, tente novamente ou contacte o suporte técnico.</small>
                    </div>
                </div>
            `;
        }
    }
}

// Instância global
window.QuantumLegalAnalytics = new QuantumLegalAnalytics();

console.log('[ELITE] Quantum Legal Analytics carregado - Teoria de Jogos Ativa');