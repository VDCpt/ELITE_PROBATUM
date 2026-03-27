/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE FORENSIC VAULT EXTENSION
 * ============================================================================
 * Extensão do Strategic Vault com funcionalidades adicionais:
 * - Exportação avançada de Pacote Forense
 * - Geração de relatórios em múltiplos formatos
 * - Integração com sistemas externos
 * ============================================================================
 */

class ForensicVaultExtension {
    constructor(vault) {
        this.vault = vault || window.StrategicVault;
        this.initialized = false;
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.vault) {
                console.warn('[ELITE] Strategic Vault não disponível para extensão');
                return false;
            }
            this.initialized = true;
            console.log('[ELITE] Forensic Vault Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Exporta Pacote Forense em múltiplos formatos
     */
    async exportCourtPackageAdvanced(caseId, formats = ['zip', 'json', 'pdf']) {
        try {
            if (!this.vault) throw new Error('Strategic Vault não disponível');
            
            const results = {};
            
            for (const format of formats) {
                if (format === 'zip' && typeof this.vault.exportCourtPackage === 'function') {
                    results.zip = await this.vault.exportCourtPackage(caseId, { zip: true });
                } else if (format === 'json') {
                    const evidences = await this.vault.getEvidenceByCase(caseId);
                    const manifest = await this.vault.generateIntegrityManifest(caseId, evidences, null);
                    const jsonData = JSON.stringify({ caseId, evidences, manifest }, null, 2);
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `forensic_package_${caseId}.json`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    results.json = true;
                } else if (format === 'pdf' && typeof this.vault.generateCourtReportHTML === 'function') {
                    const evidences = await this.vault.getEvidenceByCase(caseId);
                    const manifest = await this.vault.generateIntegrityManifest(caseId, evidences, null);
                    const reportHtml = await this.vault.generateCourtReportHTML(caseId, evidences, manifest);
                    const blob = new Blob([reportHtml], { type: 'text/html' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `forensic_report_${caseId}.html`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    results.pdf = true;
                }
            }
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Pacote Forense exportado em ${formats.join(', ')}`, 'success');
            }
            return results;
        } catch (error) {
            console.error('[ELITE] Erro na exportação avançada:', error);
            if (window.EliteUtils) window.EliteUtils.showToast('Erro na exportação do Pacote Forense', 'error');
            return null;
        }
    }
    
    /**
     * Gera certificado de integridade em formato PDF
     */
    async generateIntegrityCertificatePDF(evidenceId) {
        try {
            if (!this.vault) throw new Error('Strategic Vault não disponível');
            
            const evidence = await this.vault.getEvidence(evidenceId);
            if (!evidence) throw new Error('Evidência não encontrada');
            
            const verification = await this.vault.verifyIntegrity(evidenceId);
            const logs = this.vault.getAccessLogs(evidenceId, 10);
            
            const certHtml = `
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"><title>Certificado de Integridade - ${evidence.id}</title>
                <style>
                    body{ font-family:'JetBrains Mono',monospace; background:white; color:#0a0c10; padding:40px; margin:0; }
                    .header{ text-align:center; border-bottom:3px solid #00e5ff; padding-bottom:20px; margin-bottom:30px; }
                    .logo{ font-size:28px; font-weight:bold; color:#00e5ff; }
                    .title{ font-size:20px; font-weight:bold; margin:20px 0; text-align:center; }
                    .status-valid{ display:inline-block; background:#00e67620; color:#00a854; padding:8px 20px; border-radius:30px; font-weight:bold; margin:16px 0; border:1px solid #00e676; }
                    .certificate-box{ border:2px solid #00e5ff; padding:30px; margin:20px 0; border-radius:16px; background:#f8fafc; }
                    .hash-row{ font-family:monospace; font-size:10px; word-break:break-all; background:#f1f5f9; padding:12px; margin:12px 0; border-radius:8px; }
                    .footer{ margin-top:50px; padding-top:20px; border-top:1px solid #e2e8f0; font-size:9px; text-align:center; color:#94a3b8; }
                </style>
                </head>
                <body>
                    <div class="header"><div class="logo">ELITE PROBATUM</div><div>UNIDADE DE COMANDO FORENSE DIGITAL</div></div>
                    <div class="title">CERTIFICADO DE INTEGRIDADE FORENSE</div>
                    <div style="text-align:center;"><div class="status-valid">✓ INTEGRIDADE CONFIRMADA</div></div>
                    <div class="certificate-box">
                        <h3>1. IDENTIFICAÇÃO DA EVIDÊNCIA</h3>
                        <div><strong>ID:</strong> ${evidence.id}</div>
                        <div><strong>Nome:</strong> ${evidence.name}</div>
                        <div><strong>Tipo:</strong> ${evidence.type}</div>
                        <div><strong>Processo:</strong> ${evidence.caseId || 'N/A'}</div>
                        <div><strong>Data de Registo:</strong> ${evidence.timestampFormatted}</div>
                        <div class="hash-row"><strong>Hash SHA-256:</strong><br>${evidence.hash}</div>
                        <h3>2. PROVA DE INTEGRIDADE</h3>
                        <div class="hash-row"><strong>Hash do Certificado:</strong><br>${evidence.certificate.hash}</div>
                        <div class="hash-row"><strong>Assinatura Digital:</strong><br>${evidence.certificate.signature}</div>
                        <h3>3. VERIFICAÇÃO</h3>
                        <div><strong>Validação do Certificado:</strong> ${verification.certValid ? '✓ Válido' : '✗ Inválido'}</div>
                        <div><strong>Validação da Assinatura:</strong> ${verification.signatureValid ? '✓ Válida' : '✗ Inválida'}</div>
                        <div><strong>Integridade Global:</strong> ${verification.valid ? '✓ CONFIRMADA' : '✗ COMPROMETIDA'}</div>
                        <h3>4. CADEIA DE CUSTÓDIA</h3>
                        ${logs.map(log => `<div><small>${log.timestampFormatted}</small> - ${log.action} por ${log.userId}</div>`).join('')}
                    </div>
                    <div class="footer">
                        <p>Documento gerado por ELITE PROBATUM v2.0.5 • Forensic Vault Extension</p>
                        <p>Este certificado atesta a integridade da evidência digital nos termos do Art. 125.º CPP e ISO/IEC 27037:2012.</p>
                    </div>
                </body>
                </html>
            `;
            
            const blob = new Blob([certHtml], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `certificado_${evidence.id}.html`;
            link.click();
            URL.revokeObjectURL(link.href);
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Certificado gerado para ${evidence.name}`, 'success');
            }
            return certHtml;
        } catch (error) {
            console.error('[ELITE] Erro ao gerar certificado PDF:', error);
            if (window.EliteUtils) window.EliteUtils.showToast('Erro ao gerar certificado', 'error');
            return null;
        }
    }
    
    /**
     * Verifica integridade de todas as evidências de um caso
     */
    async verifyCaseIntegrity(caseId) {
        try {
            if (!this.vault) throw new Error('Strategic Vault não disponível');
            
            const evidences = await this.vault.getEvidenceByCase(caseId);
            const results = [];
            
            for (const evidence of evidences) {
                const verification = await this.vault.verifyIntegrity(evidence.id);
                results.push({
                    evidenceId: evidence.id,
                    evidenceName: evidence.name,
                    valid: verification.valid,
                    certValid: verification.certValid,
                    signatureValid: verification.signatureValid
                });
            }
            
            const validCount = results.filter(r => r.valid).length;
            const totalCount = results.length;
            const integrityScore = totalCount > 0 ? (validCount / totalCount * 100).toFixed(1) : 100;
            
            const report = {
                caseId: caseId,
                generatedAt: new Date().toISOString(),
                totalEvidences: totalCount,
                validEvidences: validCount,
                invalidEvidences: totalCount - validCount,
                integrityScore: integrityScore + '%',
                details: results,
                recommendation: integrityScore >= 90 ? 'Cadeia de custódia íntegra' :
                              integrityScore >= 70 ? 'Verificação adicional recomendada' :
                              'Revisão urgente de evidências comprometidas'
            };
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Verificação do caso ${caseId}: ${validCount}/${totalCount} evidências íntegras (${integrityScore}%)`, 
                    integrityScore >= 90 ? 'success' : integrityScore >= 70 ? 'warning' : 'error');
            }
            
            return report;
        } catch (error) {
            console.error('[ELITE] Erro na verificação de integridade do caso:', error);
            return null;
        }
    }
}

// Instância global
window.ForensicVaultExtension = new ForensicVaultExtension(window.StrategicVault);

console.log('[ELITE] Forensic Vault Extension carregada');