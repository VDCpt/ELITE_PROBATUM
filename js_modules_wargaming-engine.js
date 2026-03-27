/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE WARGAMING ENGINE (ALIAS)
 * ============================================================================
 * Este módulo é um alias para o Risk Mitigation Engine, mantido para compatibilidade
 * com referências existentes no código.
 * 
 * Todas as funcionalidades de simulação de risco estão implementadas em RiskMitigationEngine:
 * - Simulação de ataques da oposição
 * - Análise de vulnerabilidades probatórias
 * - Cross-examination simulation
 * - Recomendações de reforço probatório
 * ============================================================================
 */

// Alias para RiskMitigationEngine
window.WargamingEngine = window.RiskMitigationEngine;

// Garantir que o módulo está inicializado
if (window.RiskMitigationEngine && typeof window.RiskMitigationEngine.initialize === 'function') {
    console.log('[ELITE] Wargaming Engine alias aponta para Risk Mitigation Engine');
} else {
    console.warn('[ELITE] Risk Mitigation Engine não encontrado. Wargaming Engine não disponível.');
}

// Exportar para compatibilidade
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.WargamingEngine;
}