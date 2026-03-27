/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE FORENSIC VAULT (ALIAS)
 * ============================================================================
 * Este módulo é um alias para o Strategic Vault, mantido para compatibilidade
 * com referências existentes no código.
 * 
 * Todas as funcionalidades forenses estão implementadas em StrategicVault:
 * - IndexedDB com localForage
 * - Web Crypto API (AES-256-GCM)
 * - Merkle Tree para validação probatória
 * - Exportação de Pacote Forense (Digital Briefcase)
 * - Certificados de integridade eIDAS-compliant
 * ============================================================================
 */

// Alias para StrategicVault
window.ForensicVault = window.StrategicVault;

// Garantir que o módulo está inicializado
if (window.StrategicVault && typeof window.StrategicVault.initialize === 'function') {
    console.log('[ELITE] Forensic Vault alias aponta para Strategic Vault');
} else {
    console.warn('[ELITE] Strategic Vault não encontrado. Forensic Vault não disponível.');
}

// Exportar para compatibilidade
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.ForensicVault;
}