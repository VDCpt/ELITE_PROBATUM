/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE RISK MITIGATION EXTENSION
 * ============================================================================
 * Extensão do Risk Mitigation Engine com funcionalidades adicionais:
 * - Análise de risco em tempo real
 * - Previsão de eventos adversos
 * - Simulação de contramedidas
 * - Score de vulnerabilidade dinâmico
 * ============================================================================
 */

class RiskMitigationExtension {
    constructor(engine) {
        this.engine = engine || window.RiskMitigationEngine;
        this.initialized = false;
        this.riskScores = new Map();
        this.eventPredictions = new Map();
        this.countermeasureSimulations = new Map();
        
        this.loadRiskScores();
        this.loadEventPredictions();
        this.loadCountermeasureSimulations();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.engine) {
                console.warn('[ELITE] Risk Mitigation Engine não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initDemoRiskScores();
            console.log('[ELITE] Risk Mitigation Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega scores de risco
     */
    loadRiskScores() {
        try {
            const stored = localStorage.getItem('elite_risk_scores');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.riskScores.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar scores de risco:', e);
        }
    }
    
    /**
     * Salva scores de risco
     */
    saveRiskScores() {
        try {
            const scoresObj = {};
            for (const [key, value] of this.riskScores) {
                scoresObj[key] = value;
            }
            localStorage.setItem('elite_risk_scores', JSON.stringify(scoresObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar scores de risco:', e);
        }
    }
    
    /**
     * Carrega previsões de eventos
     */
    loadEventPredictions() {
        try {
            const stored = localStorage.getItem('elite_event_predictions');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.eventPredictions.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de eventos:', e);
        }
    }
    
    /**
     * Salva previsões de eventos
     */
    saveEventPredictions() {
        try {
            const predictionsObj = {};
            for (const [key, value] of this.eventPredictions) {
                predictionsObj[key] = value;
            }
            localStorage.setItem('elite_event_predictions', JSON.stringify(predictionsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de eventos:', e);
        }
    }
    
    /**
     * Carrega simulações de contramedidas
     */
    loadCountermeasureSimulations() {
        try {
            const stored = localStorage.getItem('elite_countermeasure_sims');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.countermeasureSimulations.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar simulações de contramedidas:', e);
        }
    }
    
    /**
     * Salva simulações de contramedidas
     */
    saveCountermeasureSimulations() {
        try {
            const simsObj = {};
            for (const [key, value] of this.countermeasureSimulations) {
                simsObj[key] = value;
            }
            localStorage.setItem('elite_countermeasure_sims', JSON.stringify(simsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar simulações de contramedidas:', e);
        }
    }
    
    /**
     * Inicializa scores de risco de demonstração
     */
    initDemoRiskScores() {
        if (this.riskScores.size === 0) {
            const riskCategories = [
                'probatório', 'processual', 'jurisprudencial', 'regulatório', 'reputacional'
            ];
            for (const category of riskCategories) {
                this.riskScores.set(category, {
                    category: category,
                    currentScore: 30 + Math.random() * 50,
                    trend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining',
                    volatility: 0.1 + Math.random() * 0.3,
                    lastUpdated: new Date().toISOString()
                });
            }
            this.saveRiskScores();
        }
    }
    
    /**
     * Analisa risco em tempo real
     */
    analyzeRealTimeRisk(caseData, evidenceList) {
        try {
            const baseSimulation = this.engine.simulateOppositionAttack(caseData, evidenceList);
            const riskCategories = Array.from(this.riskScores.values());
            
            const realTimeAnalysis = {
                caseId: caseData.id,
                timestamp: new Date().toISOString(),
                overallRiskScore: baseSimulation.overallRiskScore,
                riskBreakdown: riskCategories.map(cat => ({
                    category: cat.category,
                    score: cat.currentScore,
                    trend: cat.trend,
                    contribution: this.calculateRiskContribution(cat, baseSimulation),
                    alertLevel: this.getAlertLevel(cat.currentScore)
                })),
                dynamicFactors: this.identifyDynamicFactors(caseData, evidenceList),
                immediateActions: this.getImmediateActions(baseSimulation, riskCategories),
                monitoringInterval: this.getMonitoringInterval(baseSimulation.overallRiskScore)
            };
            
            this.riskScores.set(caseData.id, realTimeAnalysis);
            this.saveRiskScores();
            
            return realTimeAnalysis;
        } catch (error) {
            console.error('[ELITE] Erro na análise de risco em tempo real:', error);
            return { error: true, message: 'Erro na análise' };
        }
    }
    
    /**
     * Calcula contribuição de risco
     */
    calculateRiskContribution(category, simulation) {
        const baseContribution = category.currentScore / 100;
        const attackMultiplier = simulation.attacks?.length || 0;
        return Math.min(baseContribution * (1 + attackMultiplier * 0.1), 1);
    }
    
    /**
     * Obtém nível de alerta
     */
    getAlertLevel(score) {
        if (score > 70) return 'CRÍTICO';
        if (score > 50) return 'ALTO';
        if (score > 30) return 'MODERADO';
        return 'BAIXO';
    }
    
    /**
     * Identifica fatores dinâmicos
     */
    identifyDynamicFactors(caseData, evidenceList) {
        const factors = [];
        
        if (caseData.omissionPercentage > 70) {
            factors.push({ factor: 'Alta omissão', impact: 'positivo', weight: 0.8 });
        }
        
        if (!caseData.hasDocumentaryEvidence) {
            factors.push({ factor: 'Ausência de prova documental', impact: 'negativo', weight: 0.7 });
        }
        
        if (evidenceList && evidenceList.length < 2) {
            factors.push({ factor: 'Baixa quantidade de evidências', impact: 'negativo', weight: 0.6 });
        }
        
        if (caseData.hasDigitalEvidence) {
            factors.push({ factor: 'Prova digital disponível', impact: 'positivo', weight: 0.75 });
        }
        
        return factors;
    }
    
    /**
     * Obtém ações imediatas
     */
    getImmediateActions(simulation, riskCategories) {
        const actions = [];
        const criticalRisks = riskCategories.filter(c => c.currentScore > 70);
        
        if (criticalRisks.length > 0) {
            actions.push(`🚨 Ação urgente: mitigar riscos em ${criticalRisks.map(c => c.category).join(', ')}`);
        }
        
        if (simulation.overallRiskScore > 60) {
            actions.push('⚠️ Reunião extraordinária da equipa de litígio');
            actions.push('📋 Revisão completa da estratégia probatória');
        } else if (simulation.overallRiskScore > 40) {
            actions.push('📊 Análise aprofundada das vulnerabilidades identificadas');
            actions.push('📝 Preparação de argumentação alternativa');
        } else {
            actions.push('✅ Monitorização regular - risco controlado');
        }
        
        return actions;
    }
    
    /**
     * Obtém intervalo de monitorização
     */
    getMonitoringInterval(riskScore) {
        if (riskScore > 70) return '24 horas';
        if (riskScore > 50) return '3 dias';
        if (riskScore > 30) return '7 dias';
        return '30 dias';
    }
    
    /**
     * Prediz eventos adversos
     */
    predictAdverseEvents(caseData, horizonDays = 30) {
        try {
            const simulation = this.engine.simulateOppositionAttack(caseData, []);
            const events = [];
            
            // Previsão baseada em ataques previstos
            for (const attack of simulation.attacks.slice(0, 3)) {
                const probability = attack.likelihood;
                const expectedDays = this.estimateEventTiming(attack, caseData);
                
                if (expectedDays <= horizonDays) {
                    events.push({
                        event: attack.attack.name,
                        probability: (probability * 100).toFixed(0) + '%',
                        expectedDays: expectedDays,
                        severity: attack.severity,
                        impact: this.estimateEventImpact(attack, caseData),
                        mitigation: attack.counterArguments[0] || 'Reforçar evidências'
                    });
                }
            }
            
            // Previsão de eventos processuais
            const proceduralEvents = this.predictProceduralEvents(caseData);
            events.push(...proceduralEvents);
            
            const prediction = {
                caseId: caseData.id,
                horizonDays: horizonDays,
                events: events.sort((a, b) => a.expectedDays - b.expectedDays),
                totalEvents: events.length,
                highRiskEvents: events.filter(e => e.severity === 'high').length,
                recommendation: this.getEventRecommendation(events)
            };
            
            this.eventPredictions.set(caseData.id, prediction);
            this.saveEventPredictions();
            
            return prediction;
        } catch (error) {
            console.error('[ELITE] Erro na previsão de eventos adversos:', error);
            return { error: true, message: 'Erro na previsão' };
        }
    }
    
    /**
     * Estima timing do evento
     */
    estimateEventTiming(attack, caseData) {
        const baseTime = 15;
        const complexityFactor = caseData.value > 100000 ? 1.5 : 1;
        return Math.round(baseTime * attack.likelihood * complexityFactor);
    }
    
    /**
     * Estima impacto do evento
     */
    estimateEventImpact(attack, caseData) {
        const baseImpact = attack.severity === 'high' ? 0.4 : 0.2;
        const valueFactor = Math.min(caseData.value / 100000, 1);
        return Math.min(baseImpact + valueFactor * 0.3, 0.8);
    }
    
    /**
     * Prediz eventos processuais
     */
    predictProceduralEvents(caseData) {
        const events = [];
        
        // Prazo para contestação
        events.push({
            event: 'Prazo para contestação',
            probability: '85%',
            expectedDays: 20,
            severity: 'medium',
            impact: 0.3,
            mitigation: 'Preparar resposta antecipada'
        });
        
        // Audiência preliminar
        events.push({
            event: 'Designação de audiência preliminar',
            probability: '70%',
            expectedDays: 45,
            severity: 'medium',
            impact: 0.25,
            mitigation: 'Preparar cronograma processual'
        });
        
        return events;
    }
    
    /**
     * Obtém recomendação de eventos
     */
    getEventRecommendation(events) {
        const imminentEvents = events.filter(e => e.expectedDays <= 7);
        if (imminentEvents.length > 0) {
            return `⚠️ ${imminentEvents.length} evento(s) iminente(s) - ação prioritária`;
        }
        return '📋 Preparar calendário processual para os próximos 30 dias';
    }
    
    /**
     * Simula contramedidas
     */
    simulateCountermeasures(caseData, evidenceList) {
        try {
            const baseSimulation = this.engine.simulateOppositionAttack(caseData, evidenceList);
            const countermeasures = [
                { name: 'Reforço Probatório', actions: ['Juntar prova documental', 'Obter perícia técnica'], expectedReduction: 0.25 },
                { name: 'Antecipação de Provas', actions: ['Requerer produção antecipada', 'Notificar testemunhas'], expectedReduction: 0.20 },
                { name: 'Estratégia Ofensiva', actions: ['Pedido de tutela antecipada', 'Ação principal'], expectedReduction: 0.15 },
                { name: 'Mediação', actions: ['Propor mediação', 'Acordo extrajudicial'], expectedReduction: 0.30 }
            ];
            
            const simulations = countermeasures.map(cm => ({
                countermeasure: cm.name,
                actions: cm.actions,
                currentRisk: baseSimulation.overallRiskScore,
                projectedRisk: Math.max(0, baseSimulation.overallRiskScore - cm.expectedReduction * 100),
                reduction: (cm.expectedReduction * 100).toFixed(0) + '%',
                effort: this.estimateEffort(cm),
                timeline: this.estimateTimeline(cm),
                recommendation: this.getCountermeasureRecommendation(cm, baseSimulation)
            }));
            
            const bestCountermeasure = simulations.reduce((best, sim) => 
                sim.projectedRisk < best.projectedRisk ? sim : best, simulations[0]);
            
            const result = {
                caseId: caseData.id,
                baseRisk: baseSimulation.overallRiskScore,
                countermeasures: simulations,
                bestCountermeasure: bestCountermeasure,
                combinedEffect: this.calculateCombinedEffect(simulations),
                recommendedAction: bestCountermeasure.countermeasure
            };
            
            this.countermeasureSimulations.set(caseData.id, result);
            this.saveCountermeasureSimulations();
            
            return result;
        } catch (error) {
            console.error('[ELITE] Erro na simulação de contramedidas:', error);
            return { error: true, message: 'Erro na simulação' };
        }
    }
    
    /**
     * Estima esforço da contramedida
     */
    estimateEffort(countermeasure) {
        const efforts = {
            'Reforço Probatório': 'Alto',
            'Antecipação de Provas': 'Médio',
            'Estratégia Ofensiva': 'Alto',
            'Mediação': 'Baixo'
        };
        return efforts[countermeasure.name] || 'Médio';
    }
    
    /**
     * Estima timeline da contramedida
     */
    estimateTimeline(countermeasure) {
        const timelines = {
            'Reforço Probatório': '15-30 dias',
            'Antecipação de Provas': '10-20 dias',
            'Estratégia Ofensiva': '5-15 dias',
            'Mediação': '7-14 dias'
        };
        return timelines[countermeasure.name] || '15-30 dias';
    }
    
    /**
     * Obtém recomendação de contramedida
     */
    getCountermeasureRecommendation(countermeasure, simulation) {
        if (simulation.overallRiskScore > 70) {
            return `Prioridade máxima: ${countermeasure.name} - necessário implementar imediatamente`;
        }
        if (simulation.overallRiskScore > 50) {
            return `Recomendado: ${countermeasure.name} - implementar nos próximos 7 dias`;
        }
        return `${countermeasure.name} - implementar conforme planejamento`;
    }
    
    /**
     * Calcula efeito combinado
     */
    calculateCombinedEffect(simulations) {
        const bestReduction = Math.max(...simulations.map(s => parseFloat(s.reduction)));
        const combinedReduction = Math.min(bestReduction * 1.5, 70);
        return {
            potentialReduction: combinedReduction.toFixed(0) + '%',
            recommendation: combinedReduction > 50 ? 'Alta eficácia - implementar múltiplas medidas' : 'Eficácia moderada - priorizar melhor opção'
        };
    }
    
    /**
     * Gera relatório completo de mitigação de risco
     */
    generateRiskMitigationReport(caseData, evidenceList) {
        try {
            const realTimeRisk = this.analyzeRealTimeRisk(caseData, evidenceList);
            const eventPrediction = this.predictAdverseEvents(caseData, 30);
            const countermeasureSim = this.simulateCountermeasures(caseData, evidenceList);
            
            return {
                generatedAt: new Date().toISOString(),
                caseId: caseData.id,
                realTimeRisk: realTimeRisk,
                eventPrediction: eventPrediction,
                countermeasureSimulation: countermeasureSim,
                riskScorecard: this.generateRiskScorecard(realTimeRisk, eventPrediction),
                executiveSummary: this.getRiskExecutiveSummary(realTimeRisk, countermeasureSim),
                actionPlan: this.generateActionPlan(realTimeRisk, countermeasureSim, eventPrediction)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório de mitigação:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Gera scorecard de risco
     */
    generateRiskScorecard(realTimeRisk, eventPrediction) {
        return {
            overallRisk: realTimeRisk.overallRiskScore + '%',
            riskLevel: this.getAlertLevel(parseFloat(realTimeRisk.overallRiskScore)),
            eventsForecast: `${eventPrediction.totalEvents} eventos previstos`,
            highRiskEvents: eventPrediction.highRiskEvents,
            monitoringInterval: realTimeRisk.monitoringInterval,
            color: this.getRiskColor(parseFloat(realTimeRisk.overallRiskScore))
        };
    }
    
    /**
     * Obtém cor do risco
     */
    getRiskColor(score) {
        if (score > 70) return '#ff1744';
        if (score > 50) return '#ffc107';
        return '#00e676';
    }
    
    /**
     * Obtém sumário executivo
     */
    getRiskExecutiveSummary(realTimeRisk, countermeasureSim) {
        const riskLevel = this.getAlertLevel(parseFloat(realTimeRisk.overallRiskScore));
        const bestMeasure = countermeasureSim.bestCountermeasure;
        
        if (riskLevel === 'CRÍTICO') {
            return `⚠️ RISCO CRÍTICO: ${realTimeRisk.overallRiskScore}%. Ação imediata: ${bestMeasure.countermeasure}. Redução potencial: ${bestMeasure.reduction}`;
        }
        if (riskLevel === 'ALTO') {
            return `📊 RISCO ELEVADO: ${realTimeRisk.overallRiskScore}%. Estratégia recomendada: ${bestMeasure.countermeasure}. Implementar nos próximos 7 dias.`;
        }
        return `✅ RISCO CONTROLADO: ${realTimeRisk.overallRiskScore}%. Manter monitorização a cada ${realTimeRisk.monitoringInterval}.`;
    }
    
    /**
     * Gera plano de ação
     */
    generateActionPlan(realTimeRisk, countermeasureSim, eventPrediction) {
        const actions = [];
        
        // Ações imediatas
        actions.push(...realTimeRisk.immediateActions);
        
        // Ações baseadas na melhor contramedida
        const bestMeasure = countermeasureSim.bestCountermeasure;
        actions.push(`🎯 Implementar: ${bestMeasure.countermeasure}`);
        actions.push(...bestMeasure.actions.map(a => `   - ${a}`));
        
        // Ações baseadas em eventos previstos
        const imminentEvents = eventPrediction.events.filter(e => e.expectedDays <= 14);
        for (const event of imminentEvents) {
            actions.push(`📅 Preparar para: ${event.event} (${event.expectedDays} dias) - ${event.mitigation}`);
        }
        
        return actions;
    }
    
    /**
     * Renderiza dashboard de mitigação de risco avançada
     */
    renderDashboard(containerId, caseData, evidenceList) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateRiskMitigationReport(caseData, evidenceList);
            
            container.innerHTML = `
                <div class="risk-mitigation-extension">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> RISK MITIGATION EXTENSION - ANÁLISE AVANÇADA</h2><div class="risk-badge" style="background: ${report.riskScorecard?.color}20; border-color: ${report.riskScorecard?.color}">Risco: ${report.riskScorecard?.overallRisk || 'N/A'}</div></div>
                    
                    <div class="risk-summary"><div class="summary-card"><div class="summary-value">${report.riskScorecard?.overallRisk || 'N/A'}</div><div class="summary-label">Risco Global</div><div class="summary-sub">Nível: ${report.riskScorecard?.riskLevel || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.eventPrediction?.totalEvents || 0}</div><div class="summary-label">Eventos Previstos</div><div class="summary-sub">${report.eventPrediction?.highRiskEvents || 0} alto risco</div></div>
                    <div class="summary-card"><div class="summary-value">${report.countermeasureSimulation?.bestCountermeasure?.reduction || '0%'}</div><div class="summary-label">Redução Potencial</div><div class="summary-sub">${report.countermeasureSimulation?.bestCountermeasure?.countermeasure || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.realTimeRisk?.monitoringInterval || 'N/A'}</div><div class="summary-label">Monitorização</div><div class="summary-sub">Próxima revisão</div></div></div>
                    
                    <div class="risk-breakdown"><h3><i class="fas fa-chart-pie"></i> ANÁLISE DE RISCO EM TEMPO REAL</h3><div class="breakdown-grid">${report.realTimeRisk?.riskBreakdown?.map(r => `
                        <div class="breakdown-card">
                            <div class="breakdown-category">${r.category}</div>
                            <div class="breakdown-score" style="color: ${this.getRiskColor(r.score)}">${r.score.toFixed(0)}%</div>
                            <div class="breakdown-trend trend-${r.trend}">${r.trend === 'rising' ? '📈 Subindo' : r.trend === 'declining' ? '📉 Descendo' : '📊 Estável'}</div>
                            <div class="breakdown-alert alert-${r.alertLevel.toLowerCase()}">${r.alertLevel}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="events-section"><h3><i class="fas fa-calendar-alt"></i> PREVISÃO DE EVENTOS ADVERSOS</h3><div class="events-grid">${report.eventPrediction?.events?.slice(0, 5).map(e => `
                        <div class="event-card severity-${e.severity}">
                            <div class="event-name"><strong>${e.event}</strong></div>
                            <div class="event-details"><div>📊 Probabilidade: ${e.probability}</div><div>⏱️ Em: ${e.expectedDays} dias</div><div>🎯 Impacto: ${(e.impact * 100).toFixed(0)}%</div></div>
                            <div class="event-mitigation"><strong>Mitigação:</strong> ${e.mitigation}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="countermeasures-section"><h3><i class="fas fa-shield-alt"></i> SIMULAÇÃO DE CONTRAMEDIDAS</h3><div class="countermeasures-grid">${report.countermeasureSimulation?.countermeasures?.map(c => `
                        <div class="countermeasure-card">
                            <div class="countermeasure-name"><strong>${c.countermeasure}</strong></div>
                            <div class="countermeasure-stats"><div>Risco Atual: ${c.currentRisk.toFixed(0)}%</div><div>Risco Projetado: ${c.projectedRisk.toFixed(0)}%</div><div>Redução: ${c.reduction}</div></div>
                            <div class="countermeasure-actions"><strong>Ações:</strong> ${c.actions.join(', ')}</div>
                            <div class="countermeasure-meta">Esforço: ${c.effort} | Timeline: ${c.timeline}</div>
                            ${c.countermeasure === report.countermeasureSimulation?.bestCountermeasure?.countermeasure ? '<div class="best-badge">⭐ RECOMENDADO</div>' : ''}
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="action-plan"><h3><i class="fas fa-clipboard-list"></i> PLANO DE AÇÃO</h3><div class="action-list"><ul>${report.actionPlan?.map(a => `<li>${a}</li>`).join('')}</ul></div></div>
                    
                    <div class="executive-summary"><h3><i class="fas fa-crown"></i> SUMÁRIO EXECUTIVO</h3><div class="summary-card-exec">${report.executiveSummary || 'N/A'}</div></div>
                </div>
                <style>
                    .risk-mitigation-extension{ padding:0; } .risk-badge{ padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; border:1px solid; } .risk-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .breakdown-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px; margin-bottom:24px; } .breakdown-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } .breakdown-score{ font-size:1.5rem; font-weight:bold; } .alert-critical{ color:#ff1744; } .alert-alto{ color:#ff6b6b; } .alert-moderado{ color:#ffc107; } .alert-baixo{ color:#00e676; } .events-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-bottom:24px; } .event-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; border-left:3px solid; } .event-card.severity-high{ border-left-color:#ff1744; } .event-card.severity-medium{ border-left-color:#ffc107; } .countermeasures-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; margin-bottom:24px; } .countermeasure-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; position:relative; } .best-badge{ position:absolute; top:12px; right:12px; background:var(--elite-success); color:#000; padding:2px 8px; border-radius:12px; font-size:0.6rem; } .action-list ul{ margin:0 0 0 20px; font-size:0.75rem; } .summary-card-exec{ background:var(--bg-command); border-radius:12px; padding:16px; margin-top:8px; } @media (max-width:768px){ .risk-summary{ grid-template-columns:1fr 1fr; } .breakdown-grid{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.RiskMitigationExtension = new RiskMitigationExtension(window.RiskMitigationEngine);

console.log('[ELITE] Risk Mitigation Extension carregada - Análise de Risco Avançada Ativa');