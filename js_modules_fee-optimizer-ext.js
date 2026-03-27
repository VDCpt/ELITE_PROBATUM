/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE EFFICIENCY OPTIMIZER EXTENSION
 * ============================================================================
 * Extensão do Efficiency Optimizer com funcionalidades adicionais:
 * - Análise avançada de produtividade
 * - Previsão de performance
 * - Recomendações de melhoria
 * - Exportação de relatórios de eficiência
 * ============================================================================
 */

class EfficiencyOptimizerExtension {
    constructor(optimizer) {
        this.optimizer = optimizer || window.EfficiencyOptimizer;
        this.initialized = false;
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.optimizer) {
                console.warn('[ELITE] Efficiency Optimizer não disponível para extensão');
                return false;
            }
            this.initialized = true;
            console.log('[ELITE] Efficiency Optimizer Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Analisa produtividade por advogado
     */
    analyzeProductivity(userId) {
        try {
            const metrics = this.optimizer.getLawyerMetrics(userId);
            if (!metrics) return null;
            
            const productivityScore = metrics.productivityScore;
            let classification = '';
            let recommendations = [];
            
            if (productivityScore > 0.85) {
                classification = 'Excelente';
                recommendations.push('Manter estratégia atual');
                recommendations.push('Considerar mentoria para colegas');
            } else if (productivityScore > 0.7) {
                classification = 'Boa';
                recommendations.push('Otimizar gestão de tempo');
                recommendations.push('Automatizar tarefas repetitivas');
            } else if (productivityScore > 0.55) {
                classification = 'Moderada';
                recommendations.push('Revisar metodologia de trabalho');
                recommendations.push('Investir em formação específica');
            } else {
                classification = 'Crítica';
                recommendations.push('Reunião de avaliação de desempenho');
                recommendations.push('Plano de desenvolvimento individual');
            }
            
            return {
                userId: userId,
                name: metrics.name,
                productivityScore: (productivityScore * 100).toFixed(0) + '%',
                classification: classification,
                recommendations: recommendations,
                metrics: {
                    successRate: metrics.successRatePercent,
                    efficiency: metrics.efficiencyPercent,
                    hoursPerCase: metrics.hoursPerCase,
                    clientSatisfaction: metrics.clientSatisfaction
                }
            };
        } catch (error) {
            console.error('[ELITE] Erro na análise de produtividade:', error);
            return null;
        }
    }
    
    /**
     * Previsão de performance futura
     */
    predictPerformance(userId, periods = 3) {
        try {
            const metrics = this.optimizer.getLawyerMetrics(userId);
            if (!metrics) return null;
            
            const historicalTrend = this.optimizer.getEfficiencyTrends(periods);
            const avgEfficiency = historicalTrend.reduce((sum, t) => sum + parseFloat(t.avgEfficiency), 0) / historicalTrend.length;
            
            let predictedEfficiency = (metrics.efficiencyScore + avgEfficiency / 100) / 2;
            let trend = 'stable';
            
            if (metrics.efficiencyScore > avgEfficiency / 100 + 0.05) {
                trend = 'improving';
                predictedEfficiency += 0.03;
            } else if (metrics.efficiencyScore < avgEfficiency / 100 - 0.05) {
                trend = 'declining';
                predictedEfficiency -= 0.02;
            }
            
            predictedEfficiency = Math.min(Math.max(predictedEfficiency, 0.3), 0.98);
            
            return {
                userId: userId,
                name: metrics.name,
                currentEfficiency: metrics.efficiencyPercent,
                predictedEfficiency: (predictedEfficiency * 100).toFixed(0) + '%',
                trend: trend,
                confidence: trend === 'stable' ? 0.7 : 0.6,
                recommendations: this.getPerformanceRecommendations(metrics, trend)
            };
        } catch (error) {
            console.error('[ELITE] Erro na previsão de performance:', error);
            return null;
        }
    }
    
    /**
     * Obtém recomendações de performance
     */
    getPerformanceRecommendations(metrics, trend) {
        const recs = [];
        if (metrics.successRate < 70) recs.push('Reforçar análise preliminar de casos');
        if (metrics.efficiency < 80) recs.push('Otimizar processos internos');
        if (metrics.clientSatisfaction < 4.5) recs.push('Melhorar comunicação com clientes');
        if (trend === 'declining') recs.push('Revisão urgente de metodologia');
        if (recs.length === 0) recs.push('Manter estratégia atual - performance consistente');
        return recs;
    }
    
    /**
     * Exporta relatório de eficiência
     */
    exportEfficiencyReport(format = 'json') {
        try {
            const stats = this.optimizer.getStatistics();
            const ranking = this.optimizer.getEfficiencyRanking(20);
            const teamRanking = this.optimizer.getTeamRanking();
            const trends = this.optimizer.getEfficiencyTrends(4);
            
            const report = {
                generatedAt: new Date().toISOString(),
                summary: stats,
                ranking: ranking,
                teamRanking: teamRanking,
                trends: trends,
                version: '2.0.5'
            };
            
            if (format === 'json') {
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `efficiency_report_${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(link.href);
            } else if (format === 'html') {
                const html = this.generateReportHTML(report);
                const blob = new Blob([html], { type: 'text/html' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `efficiency_report_${new Date().toISOString().slice(0, 10)}.html`;
                link.click();
                URL.revokeObjectURL(link.href);
            }
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Relatório de eficiência exportado (${format})`, 'success');
            }
            return report;
        } catch (error) {
            console.error('[ELITE] Erro na exportação do relatório:', error);
            if (window.EliteUtils) window.EliteUtils.showToast('Erro na exportação', 'error');
            return null;
        }
    }
    
    /**
     * Gera HTML do relatório
     */
    generateReportHTML(report) {
        return `<!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Relatório de Eficiência - ELITE PROBATUM</title>
        <style>body{font-family:'JetBrains Mono',monospace;padding:40px;background:white;color:#0a0c10;} h1{color:#00e5ff;} .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:20px 0;} .stat-card{background:#f8fafc;padding:16px;border-radius:12px;text-align:center;} .stat-value{font-size:1.5rem;font-weight:bold;color:#00e5ff;} table{width:100%;border-collapse:collapse;margin:20px 0;} th,td{border:1px solid #e2e8f0;padding:12px;text-align:left;} th{background:#f1f5f9;} .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:10px;text-align:center;}</style>
        </head>
        <body>
            <h1>ELITE PROBATUM - Relatório de Eficiência</h1>
            <p>Gerado em: ${new Date().toLocaleString('pt-PT')}</p>
            <div class="stats"><div class="stat-card"><div class="stat-value">${report.summary.avgEfficiency}</div><div>Eficiência Média</div></div><div class="stat-card"><div class="stat-value">${report.summary.avgSuccessRate}</div><div>Sucesso Médio</div></div><div class="stat-card"><div class="stat-value">${report.summary.totalWins}</div><div>Vitórias Totais</div></div><div class="stat-card"><div class="stat-value">${report.summary.overallWinRate}</div><div>Taxa Global</div></div></div>
            <h2>Ranking de Eficiência</h2>
            <table><thead><tr><th>#</th><th>Advogado</th><th>Equipa</th><th>Eficiência</th><th>Sucesso</th><th>Vitórias</th></tr></thead><tbody>${report.ranking.map(r => `<tr><td>${r.rank}º</td><td><strong>${r.name}</strong><br><small>${r.role}</small></td><td>${r.team}</td><td>${r.efficiency}</td><td>${r.successRate}</td><td>${r.casesWon}</td></tr>`).join('')}</tbody></table>
            <h2>Ranking por Equipa</h2>
            <table><thead><tr><th>Equipa</th><th>Eficiência</th><th>Sucesso</th><th>Produtividade</th><th>Membros</th><th>Casos</th></tr></thead><tbody>${report.teamRanking.map(t => `<tr><td><strong>${t.name}</strong></td><td>${t.avgEfficiency}</td><td>${t.avgSuccessRate}</td><td>${t.avgProductivity}</td><td>${t.members}</td><td>${t.totalCases}</td></tr>`).join('')}</tbody></table>
            <div class="footer"><p>ELITE PROBATUM v2.0.5 • Unidade de Comando Estratégico</p><p>Relatório gerado automaticamente pelo Efficiency Optimizer</p></div>
        </body>
        </html>`;
    }
}

// Instância global
window.EfficiencyOptimizerExtension = new EfficiencyOptimizerExtension(window.EfficiencyOptimizer);

console.log('[ELITE] Efficiency Optimizer Extension carregada');