/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE MASS LITIGATION EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Mass Litigation Engine com funcionalidades adicionais:
 * - Otimização de batches por similaridade
 * - Previsão de tempo de processamento
 * - Alocação dinâmica de recursos
 * - Relatórios de produtividade por lote
 * ============================================================================
 */

class MassLitigationExtensionExtended {
    constructor(engine) {
        this.engine = engine || window.MassLitigationEngine;
        this.initialized = false;
        this.batchOptimization = new Map();
        this.processingForecasts = new Map();
        this.resourceAllocation = new Map();
        
        this.loadBatchOptimization();
        this.loadProcessingForecasts();
        this.loadResourceAllocation();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.engine) {
                console.warn('[ELITE] Mass Litigation Engine não disponível para extensão');
                return false;
            }
            this.initialized = true;
            console.log('[ELITE] Mass Litigation Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega otimização de batches
     */
    loadBatchOptimization() {
        try {
            const stored = localStorage.getItem('elite_batch_optimization');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.batchOptimization.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar otimização de batches:', e);
        }
    }
    
    /**
     * Salva otimização de batches
     */
    saveBatchOptimization() {
        try {
            const optObj = {};
            for (const [key, value] of this.batchOptimization) {
                optObj[key] = value;
            }
            localStorage.setItem('elite_batch_optimization', JSON.stringify(optObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar otimização de batches:', e);
        }
    }
    
    /**
     * Carrega previsões de processamento
     */
    loadProcessingForecasts() {
        try {
            const stored = localStorage.getItem('elite_processing_forecasts');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.processingForecasts.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar previsões de processamento:', e);
        }
    }
    
    /**
     * Salva previsões de processamento
     */
    saveProcessingForecasts() {
        try {
            const forecastsObj = {};
            for (const [key, value] of this.processingForecasts) {
                forecastsObj[key] = value;
            }
            localStorage.setItem('elite_processing_forecasts', JSON.stringify(forecastsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar previsões de processamento:', e);
        }
    }
    
    /**
     * Carrega alocação de recursos
     */
    loadResourceAllocation() {
        try {
            const stored = localStorage.getItem('elite_resource_allocation');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.resourceAllocation.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar alocação de recursos:', e);
        }
    }
    
    /**
     * Salva alocação de recursos
     */
    saveResourceAllocation() {
        try {
            const allocObj = {};
            for (const [key, value] of this.resourceAllocation) {
                allocObj[key] = value;
            }
            localStorage.setItem('elite_resource_allocation', JSON.stringify(allocObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar alocação de recursos:', e);
        }
    }
    
    /**
     * Otimiza batches por similaridade
     */
    optimizeBatchesBySimilarity(cases) {
        try {
            const similarityMatrix = this.calculateSimilarityMatrix(cases);
            const clusters = this.clusterCases(cases, similarityMatrix);
            const optimizedBatches = this.createOptimizedBatches(clusters);
            
            const optimization = {
                totalCases: cases.length,
                originalBatches: Math.ceil(cases.length / 20),
                optimizedBatches: optimizedBatches.length,
                reduction: ((Math.ceil(cases.length / 20) - optimizedBatches.length) / Math.ceil(cases.length / 20) * 100).toFixed(0) + '%',
                clusters: clusters.map(c => ({
                    size: c.cases.length,
                    similarityScore: c.similarity,
                    keyFeatures: c.keyFeatures,
                    recommendedBatchSize: Math.ceil(c.cases.length / 5)
                })),
                optimizedBatches: optimizedBatches,
                recommendations: this.getBatchOptimizationRecommendations(optimizedBatches, clusters)
            };
            
            this.batchOptimization.set(Date.now(), optimization);
            this.saveBatchOptimization();
            
            return optimization;
        } catch (error) {
            console.error('[ELITE] Erro na otimização de batches:', error);
            return { error: true, message: 'Erro na otimização' };
        }
    }
    
    /**
     * Calcula matriz de similaridade
     */
    calculateSimilarityMatrix(cases) {
        const matrix = [];
        for (let i = 0; i < cases.length; i++) {
            matrix[i] = [];
            for (let j = 0; j < cases.length; j++) {
                if (i === j) {
                    matrix[i][j] = 1;
                } else {
                    const similarity = this.calculateCaseSimilarity(cases[i], cases[j]);
                    matrix[i][j] = similarity;
                }
            }
        }
        return matrix;
    }
    
    /**
     * Calcula similaridade entre dois casos
     */
    calculateCaseSimilarity(case1, case2) {
        let score = 0;
        let factors = 0;
        
        if (case1.platform === case2.platform) {
            score += 0.3;
            factors++;
        }
        if (case1.category === case2.category) {
            score += 0.25;
            factors++;
        }
        if (case1.court === case2.court) {
            score += 0.2;
            factors++;
        }
        if (case1.judge === case2.judge) {
            score += 0.15;
            factors++;
        }
        
        const valueDiff = Math.abs((case1.value || 0) - (case2.value || 0)) / Math.max(case1.value || 1, case2.value || 1);
        score += (1 - Math.min(valueDiff, 0.5)) * 0.1;
        factors++;
        
        return score / factors;
    }
    
    /**
     * Agrupa casos em clusters
     */
    clusterCases(cases, similarityMatrix) {
        const clusters = [];
        const used = new Set();
        
        for (let i = 0; i < cases.length; i++) {
            if (used.has(i)) continue;
            
            const cluster = {
                cases: [cases[i]],
                indices: [i],
                similarity: 1,
                keyFeatures: this.extractKeyFeatures(cases[i])
            };
            used.add(i);
            
            for (let j = i + 1; j < cases.length; j++) {
                if (used.has(j)) continue;
                if (similarityMatrix[i][j] > 0.6) {
                    cluster.cases.push(cases[j]);
                    cluster.indices.push(j);
                    cluster.similarity = (cluster.similarity + similarityMatrix[i][j]) / 2;
                    used.add(j);
                }
            }
            
            clusters.push(cluster);
        }
        
        return clusters;
    }
    
    /**
     * Extrai features chave do caso
     */
    extractKeyFeatures(caseData) {
        const features = [];
        if (caseData.platform) features.push(`Plataforma: ${caseData.platform}`);
        if (caseData.category) features.push(`Área: ${caseData.category}`);
        if (caseData.value > 50000) features.push('Alto valor');
        if (caseData.omissionPercentage > 60) features.push('Alta omissão');
        return features;
    }
    
    /**
     * Cria batches otimizados
     */
    createOptimizedBatches(clusters) {
        const batches = [];
        let batchId = 1;
        
        for (const cluster of clusters) {
            const batchSize = Math.ceil(cluster.cases.length / 5);
            for (let i = 0; i < cluster.cases.length; i += batchSize) {
                batches.push({
                    id: `BATCH_${batchId++}`,
                    cases: cluster.cases.slice(i, i + batchSize),
                    similarityScore: cluster.similarity,
                    estimatedTime: this.estimateBatchTime(cluster.cases.slice(i, i + batchSize))
                });
            }
        }
        
        return batches;
    }
    
    /**
     * Estima tempo de processamento do batch
     */
    estimateBatchTime(batchCases) {
        const baseTime = batchCases.length * 2;
        const complexityFactor = batchCases.some(c => c.value > 100000) ? 1.5 : 1;
        return Math.ceil(baseTime * complexityFactor);
    }
    
    /**
     * Obtém recomendações de otimização
     */
    getBatchOptimizationRecommendations(batches, clusters) {
        const recs = [];
        const largeClusters = clusters.filter(c => c.cases.length > 50);
        
        if (largeClusters.length > 0) {
            recs.push(`📦 Cluster com ${largeClusters[0].cases.length} casos similares - processamento prioritário`);
        }
        
        const highSimilarityBatches = batches.filter(b => b.similarityScore > 0.8);
        if (highSimilarityBatches.length > 0) {
            recs.push(`🎯 ${highSimilarityBatches.length} batches com alta similaridade - templates unificados`);
        }
        
        if (recs.length === 0) {
            recs.push('✅ Distribuição equilibrada - processamento padrão');
        }
        
        return recs;
    }
    
    /**
     * Prediz tempo de processamento
     */
    predictProcessingTime(batchId, resources = 1) {
        try {
            const batch = this.engine.batches.get(batchId);
            if (!batch) return null;
            
            const baseTime = batch.cases.length * 2;
            const complexity = this.calculateBatchComplexity(batch);
            const parallelFactor = Math.min(resources, 5);
            const predictedHours = (baseTime * complexity) / parallelFactor;
            const predictedDays = Math.ceil(predictedHours / 8);
            
            const forecast = {
                batchId: batchId,
                batchName: batch.name,
                totalCases: batch.cases.length,
                complexityScore: (complexity * 100).toFixed(0) + '%',
                resourcesAllocated: resources,
                predictedHours: Math.ceil(predictedHours),
                predictedDays: predictedDays,
                estimatedCompletion: new Date(Date.now() + predictedDays * 24 * 60 * 60 * 1000).toISOString(),
                confidence: this.calculateForecastConfidence(batch),
                recommendations: this.getProcessingRecommendations(predictedDays, complexity)
            };
            
            this.processingForecasts.set(batchId, forecast);
            this.saveProcessingForecasts();
            
            return forecast;
        } catch (error) {
            console.error('[ELITE] Erro na previsão de tempo:', error);
            return { error: true, message: 'Erro na previsão' };
        }
    }
    
    /**
     * Calcula complexidade do batch
     */
    calculateBatchComplexity(batch) {
        let complexity = 1;
        const avgValue = batch.cases.reduce((s, c) => s + (c.value || 0), 0) / batch.cases.length;
        const avgOmission = batch.cases.reduce((s, c) => s + (c.omissionPercentage || 0), 0) / batch.cases.length;
        
        if (avgValue > 100000) complexity *= 1.5;
        if (avgValue > 50000) complexity *= 1.2;
        if (avgOmission > 70) complexity *= 1.3;
        if (avgOmission < 30) complexity *= 0.8;
        
        return Math.min(complexity, 2.5);
    }
    
    /**
     * Calcula confiança da previsão
     */
    calculateForecastConfidence(batch) {
        let confidence = 0.7;
        if (batch.cases.length > 100) confidence -= 0.1;
        if (batch.cases.length < 20) confidence += 0.1;
        if (batch.status === 'completed') confidence += 0.1;
        return Math.min(confidence, 0.95);
    }
    
    /**
     * Obtém recomendações de processamento
     */
    getProcessingRecommendations(predictedDays, complexity) {
        if (predictedDays > 30) {
            return '⚠️ Processamento extenso - considerar aumento de recursos ou divisão do lote';
        }
        if (predictedDays > 15) {
            return '📊 Processamento moderado - manter recursos atuais';
        }
        return '✅ Processamento rápido - seguir cronograma';
    }
    
    /**
     * Aloca recursos dinamicamente
     */
    allocateDynamicResources(batchId) {
        try {
            const batch = this.engine.batches.get(batchId);
            if (!batch) return null;
            
            const complexity = this.calculateBatchComplexity(batch);
            const baseResources = Math.ceil(batch.cases.length / 25);
            const recommendedResources = Math.min(Math.ceil(baseResources * complexity), 8);
            const optimalResources = Math.min(recommendedResources, 5);
            
            const allocation = {
                batchId: batchId,
                batchName: batch.name,
                baseResources: baseResources,
                recommendedResources: recommendedResources,
                optimalResources: optimalResources,
                resourceAllocation: this.createResourcePlan(batch, optimalResources),
                timeline: this.createResourceTimeline(batch, optimalResources),
                costBenefit: this.calculateResourceCostBenefit(batch, baseResources, optimalResources)
            };
            
            this.resourceAllocation.set(batchId, allocation);
            this.saveResourceAllocation();
            
            return allocation;
        } catch (error) {
            console.error('[ELITE] Erro na alocação de recursos:', error);
            return { error: true, message: 'Erro na alocação' };
        }
    }
    
    /**
     * Cria plano de recursos
     */
    createResourcePlan(batch, resources) {
        const plan = [];
        const casesPerResource = Math.ceil(batch.cases.length / resources);
        
        for (let i = 0; i < resources; i++) {
            const startIdx = i * casesPerResource;
            const endIdx = Math.min(startIdx + casesPerResource, batch.cases.length);
            plan.push({
                resourceId: `RES_${i + 1}`,
                cases: batch.cases.slice(startIdx, endIdx),
                caseCount: endIdx - startIdx,
                estimatedDays: Math.ceil((endIdx - startIdx) * 2 / 8)
            });
        }
        
        return plan;
    }
    
    /**
     * Cria timeline de recursos
     */
    createResourceTimeline(batch, resources) {
        const timeline = [];
        const totalDays = Math.ceil(batch.cases.length * 2 / (resources * 8));
        
        for (let day = 1; day <= totalDays; day++) {
            timeline.push({
                day: day,
                date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                resourcesActive: Math.min(resources, Math.ceil(batch.cases.length / (totalDays - day + 1))),
                casesCompleted: Math.min(day * resources * 4, batch.cases.length)
            });
        }
        
        return timeline;
    }
    
    /**
     * Calcula custo-benefício da alocação
     */
    calculateResourceCostBenefit(batch, baseResources, optimalResources) {
        const baseTime = Math.ceil(batch.cases.length * 2 / (baseResources * 8));
        const optimalTime = Math.ceil(batch.cases.length * 2 / (optimalResources * 8));
        const timeReduction = baseTime - optimalTime;
        const resourceIncrease = optimalResources - baseResources;
        
        return {
            baseTime: `${baseTime} dias`,
            optimalTime: `${optimalTime} dias`,
            timeReduction: `${timeReduction} dias`,
            resourceIncrease: `${resourceIncrease} recursos`,
            efficiencyGain: ((timeReduction / baseTime) * 100).toFixed(0) + '%',
            recommendation: timeReduction > 5 ? 'Recomendado aumentar recursos' : 'Recursos atuais suficientes'
        };
    }
    
    /**
     * Gera relatório de produtividade por lote
     */
    generateBatchProductivityReport(batchId) {
        try {
            const batch = this.engine.batches.get(batchId);
            if (!batch) return null;
            
            const completed = batch.cases.filter(c => c.status === 'processed').length;
            const successRate = completed > 0 ? (batch.results.successful / completed * 100).toFixed(1) : 0;
            const avgTimePerCase = batch.results.endTime && batch.results.startTime 
                ? ((batch.results.endTime - batch.results.startTime) / completed / 1000).toFixed(1) 
                : 0;
            
            return {
                batchId: batchId,
                batchName: batch.name,
                productivity: {
                    totalCases: batch.cases.length,
                    completed: completed,
                    successRate: successRate + '%',
                    avgTimePerCase: `${avgTimePerCase} segundos`,
                    errors: batch.results.errors.length
                },
                resourceEfficiency: {
                    workersUsed: this.engine.activeWorkers,
                    casesPerWorker: (completed / Math.max(this.engine.activeWorkers, 1)).toFixed(1),
                    timeEfficiency: (completed / (batch.results.endTime && batch.results.startTime 
                        ? (batch.results.endTime - batch.results.startTime) / 1000 / 3600 
                        : 1)).toFixed(2) + ' casos/hora'
                },
                recommendations: this.getProductivityRecommendations(batch, avgTimePerCase, successRate)
            };
        } catch (error) {
            console.error('[ELITE] Erro no relatório de produtividade:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Obtém recomendações de produtividade
     */
    getProductivityRecommendations(batch, avgTime, successRate) {
        const recs = [];
        
        if (avgTime > 120) {
            recs.push('⏱️ Tempo por caso elevado - revisar processos automatizados');
        }
        if (successRate < 70) {
            recs.push('📉 Taxa de sucesso abaixo do esperado - reforçar análise preliminar');
        }
        if (batch.results.errors.length > 5) {
            recs.push('⚠️ Alto número de erros - revisar templates e validações');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Produtividade adequada - manter estratégia');
        }
        
        return recs;
    }
    
    /**
     * Renderiza dashboard de litigância em massa avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const batches = this.engine.getAllBatches();
            const activeBatches = batches.filter(b => b.status === 'processing');
            const completedBatches = batches.filter(b => b.status === 'completed');
            
            container.innerHTML = `
                <div class="mass-litigation-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> MASS LITIGATION EXTENSION - OTIMIZAÇÃO AVANÇADA</h2><div class="stats-badge">${activeBatches.length} ativos | ${completedBatches.length} concluídos</div></div>
                    
                    <div class="mass-summary"><div class="summary-card"><div class="summary-value">${batches.length}</div><div class="summary-label">Total Batches</div><div class="summary-sub">${batches.reduce((s, b) => s + b.cases.length, 0)} casos</div></div>
                    <div class="summary-card"><div class="summary-value">${(batches.reduce((s, b) => s + b.progress.successful, 0) / Math.max(batches.reduce((s, b) => s + b.progress.total, 0), 1) * 100).toFixed(0)}%</div><div class="summary-label">Sucesso Global</div><div class="summary-sub">${batches.reduce((s, b) => s + b.progress.successful, 0)} vitórias</div></div>
                    <div class="summary-card"><div class="summary-value">${(batches.reduce((s, b) => s + b.progress.processed, 0) / Math.max(batches.reduce((s, b) => s + b.progress.total, 0), 1) * 100).toFixed(0)}%</div><div class="summary-label">Processamento</div><div class="summary-sub">${batches.reduce((s, b) => s + b.progress.processed, 0)}/${batches.reduce((s, b) => s + b.progress.total, 0)}</div></div>
                    <div class="summary-card"><div class="summary-value">${this.engine.activeWorkers}</div><div class="summary-label">Workers Ativos</div><div class="summary-sub">Max: ${this.engine.maxWorkers}</div></div></div>
                    
                    <div class="batches-section"><h3><i class="fas fa-layer-group"></i> BATCHES ATIVOS</h3><div class="batches-grid">${activeBatches.slice(0, 6).map(b => `
                        <div class="batch-card">
                            <div class="batch-header"><strong>${b.name}</strong><span class="batch-status processing">PROCESSANDO</span></div>
                            <div class="batch-progress"><div class="progress-bar"><div class="progress-fill" style="width: ${b.progress.percentage}%"></div><span class="progress-text">${b.progress.percentage.toFixed(0)}%</span></div></div>
                            <div class="batch-stats"><div>✅ ${b.progress.successful}/${b.progress.total}</div><div>❌ ${b.progress.failed}</div><div>⏱️ ${((Date.now() - new Date(b.results.startTime).getTime()) / 1000 / 60).toFixed(0)} min</div></div>
                            <button class="action-btn view-batch" data-batch-id="${b.id}">VER DETALHES</button>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="optimization-section"><h3><i class="fas fa-chart-simple"></i> OTIMIZAÇÃO DE RECURSOS</h3><div class="optimization-grid">${activeBatches.slice(0, 3).map(b => {
                        const allocation = this.allocateDynamicResources(b.id);
                        return `
                            <div class="optimization-card">
                                <div class="opt-header"><strong>${b.name}</strong></div>
                                <div class="opt-resources"><div>Base: ${allocation?.baseResources || 1}</div><div>Ótimo: ${allocation?.optimalResources || 1}</div><div>Recomendado: ${allocation?.recommendedResources || 1}</div></div>
                                <div class="opt-benefit">Ganho: ${allocation?.costBenefit?.efficiencyGain || '0%'}</div>
                                <button class="action-btn apply-optimization" data-batch-id="${b.id}" data-resources="${allocation?.optimalResources || 1}">APLICAR OTIMIZAÇÃO</button>
                            </div>
                        `;
                    }).join('')}</div></div>
                    
                    <div class="productivity-section"><h3><i class="fas fa-chart-line"></i> PRODUTIVIDADE POR LOTE</h3><div class="productivity-grid">${completedBatches.slice(0, 5).map(b => {
                        const report = this.generateBatchProductivityReport(b.id);
                        return `
                            <div class="productivity-card">
                                <div class="prod-header"><strong>${b.name}</strong><span class="prod-success">${report?.productivity?.successRate || '0%'}</span></div>
                                <div class="prod-stats"><div>⏱️ ${report?.productivity?.avgTimePerCase || 'N/A'}</div><div>📊 ${report?.productivity?.casesPerWorker || 'N/A'} casos/worker</div></div>
                                <div class="prod-efficiency">${report?.resourceEfficiency?.timeEfficiency || 'N/A'}</div>
                            </div>
                        `;
                    }).join('')}</div></div>
                </div>
                <style>
                    .mass-litigation-ext{ padding:0; } .mass-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .batches-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-bottom:24px; } .batch-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .batch-status{ background:rgba(0,229,255,0.1); color:#00e5ff; padding:2px 8px; border-radius:12px; font-size:0.6rem; } .optimization-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .optimization-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .productivity-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; } .productivity-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } @media (max-width:768px){ .mass-summary{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
            
            document.querySelectorAll('.view-batch').forEach(btn => {
                btn.addEventListener('click', () => {
                    const batchId = btn.dataset.batchId;
                    if (window.EliteUtils) window.EliteUtils.showToast(`Detalhes do batch ${batchId} - em desenvolvimento`, 'info');
                });
            });
            
            document.querySelectorAll('.apply-optimization').forEach(btn => {
                btn.addEventListener('click', () => {
                    const batchId = btn.dataset.batchId;
                    const resources = btn.dataset.resources;
                    if (window.EliteUtils) window.EliteUtils.showToast(`Otimização aplicada ao batch ${batchId} com ${resources} recursos`, 'success');
                });
            });
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.MassLitigationExtensionExtended = new MassLitigationExtensionExtended(window.MassLitigationEngine);

console.log('[ELITE] Mass Litigation Extension Extended carregada - Otimização Avançada de Batches Ativa');