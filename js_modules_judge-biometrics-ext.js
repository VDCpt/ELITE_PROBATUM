/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE JUDGE BIOMETRICS EXTENSION
 * ============================================================================
 * Extensão do Judge Biometrics com funcionalidades adicionais:
 * - Análise de padrões decisórios profundos
 * - Previsão de comportamento em casos similares
 * - Perfil evolutivo do magistrado
 * - Recomendações de argumentação personalizada
 * ============================================================================
 */

class JudgeBiometricsExtension {
    constructor(biometrics) {
        this.biometrics = biometrics || window.JudgeBiometrics;
        this.initialized = false;
        this.behavioralPatterns = new Map();
        this.evolutionProfiles = new Map();
        
        this.loadBehavioralPatterns();
        this.loadEvolutionProfiles();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.biometrics) {
                console.warn('[ELITE] Judge Biometrics não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initDemoPatterns();
            console.log('[ELITE] Judge Biometrics Extension inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega padrões comportamentais
     */
    loadBehavioralPatterns() {
        try {
            const stored = localStorage.getItem('elite_behavioral_patterns');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.behavioralPatterns.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar padrões comportamentais:', e);
        }
    }
    
    /**
     * Salva padrões comportamentais
     */
    saveBehavioralPatterns() {
        try {
            const patternsObj = {};
            for (const [key, value] of this.behavioralPatterns) {
                patternsObj[key] = value;
            }
            localStorage.setItem('elite_behavioral_patterns', JSON.stringify(patternsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar padrões comportamentais:', e);
        }
    }
    
    /**
     * Carrega perfis evolutivos
     */
    loadEvolutionProfiles() {
        try {
            const stored = localStorage.getItem('elite_evolution_profiles');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.evolutionProfiles.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar perfis evolutivos:', e);
        }
    }
    
    /**
     * Salva perfis evolutivos
     */
    saveEvolutionProfiles() {
        try {
            const profilesObj = {};
            for (const [key, value] of this.evolutionProfiles) {
                profilesObj[key] = value;
            }
            localStorage.setItem('elite_evolution_profiles', JSON.stringify(profilesObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar perfis evolutivos:', e);
        }
    }
    
    /**
     * Inicializa padrões de demonstração
     */
    initDemoPatterns() {
        if (this.behavioralPatterns.size === 0) {
            const patterns = {
                'Dr. António Costa': {
                    judgeName: 'Dr. António Costa',
                    consistencyScore: 0.85,
                    predictability: 0.78,
                    evolutionRate: 0.12,
                    recentTrend: 'stable',
                    preferredTheses: ['prova documental', 'fraude fiscal qualificada'],
                    avoidedTheses: ['equidade', 'interpretação extensiva'],
                    lastUpdated: new Date().toISOString()
                },
                'Dra. Sofia Mendes': {
                    judgeName: 'Dra. Sofia Mendes',
                    consistencyScore: 0.72,
                    predictability: 0.65,
                    evolutionRate: 0.18,
                    recentTrend: 'evolving',
                    preferredTheses: ['direitos do trabalhador', 'boa-fé'],
                    avoidedTheses: ['formalismo', 'caducidade'],
                    lastUpdated: new Date().toISOString()
                },
                'Dr. Ricardo Alves': {
                    judgeName: 'Dr. Ricardo Alves',
                    consistencyScore: 0.91,
                    predictability: 0.85,
                    evolutionRate: 0.05,
                    recentTrend: 'stable',
                    preferredTheses: ['precedente', 'jurisprudência consolidada'],
                    avoidedTheses: ['inovação', 'interpretação evolutiva'],
                    lastUpdated: new Date().toISOString()
                },
                'Dr. Pedro Santos': {
                    judgeName: 'Dr. Pedro Santos',
                    consistencyScore: 0.82,
                    predictability: 0.75,
                    evolutionRate: 0.15,
                    recentTrend: 'adapting',
                    preferredTheses: ['prova digital', 'eficiência', 'celeridade'],
                    avoidedTheses: ['formalismo', 'dilação'],
                    lastUpdated: new Date().toISOString()
                }
            };
            for (const [key, value] of Object.entries(patterns)) {
                this.behavioralPatterns.set(key, value);
            }
            this.saveBehavioralPatterns();
        }
    }
    
    /**
     * Analisa padrões decisórios profundos
     */
    analyzeDeepDecisionPatterns(judgeName) {
        try {
            const profile = this.biometrics.getJudgeBiometricProfile(judgeName);
            const patterns = this.behavioralPatterns.get(judgeName);
            
            if (!profile) return null;
            
            const analysis = {
                judgeName: judgeName,
                court: profile.court,
                consistencyScore: patterns?.consistencyScore || 0.75,
                predictability: patterns?.predictability || 0.7,
                evolutionRate: patterns?.evolutionRate || 0.1,
                recentTrend: patterns?.recentTrend || 'stable',
                
                decisionPatterns: {
                    averageLength: profile.biometrics.preferredLength,
                    technicalLevel: profile.biometrics.technicalTolerance,
                    citationPreference: profile.semanticProfile.preferredCitations,
                    argumentStructure: profile.semanticProfile.argumentStructure
                },
                
                thematicPreferences: {
                    preferred: patterns?.preferredTheses || profile.semanticProfile.preferredKeywords.slice(0, 3),
                    avoided: patterns?.avoidedTheses || profile.semanticProfile.avoidedKeywords.slice(0, 3)
                },
                
                statisticalProfile: {
                    totalDecisions: profile.decisionHistory.total,
                    favorableRate: (profile.decisionHistory.favorable / profile.decisionHistory.total * 100).toFixed(1) + '%',
                    avgDecisionTime: profile.biometrics.avgDecisionTime + ' dias',
                    injunctionRate: (profile.biometrics.injunctionRate * 100).toFixed(0) + '%'
                },
                
                evolutionAnalysis: this.analyzeEvolution(judgeName, patterns),
                recommendations: this.getDeepRecommendations(profile, patterns)
            };
            
            return analysis;
        } catch (error) {
            console.error('[ELITE] Erro na análise de padrões decisórios:', error);
            return null;
        }
    }
    
    /**
     * Analisa evolução do magistrado
     */
    analyzeEvolution(judgeName, patterns) {
        if (!patterns) return { trend: 'stable', description: 'Dados insuficientes para análise evolutiva' };
        
        let description = '';
        let recommendation = '';
        
        if (patterns.recentTrend === 'evolving') {
            description = 'Magistrado em evolução - padrões decisórios estão em transformação gradual';
            recommendation = 'Monitorizar decisões recentes para identificar novas tendências';
        } else if (patterns.recentTrend === 'adapting') {
            description = 'Magistrado em adaptação - possíveis mudanças na abordagem jurisprudencial';
            recommendation = 'Analisar últimas 10 decisões para confirmar direção da adaptação';
        } else {
            description = 'Magistrado com padrão estável - alta previsibilidade decisória';
            recommendation = 'Utilizar teses já validadas pelo magistrado';
        }
        
        return {
            trend: patterns.recentTrend,
            evolutionRate: (patterns.evolutionRate * 100).toFixed(0) + '%',
            description: description,
            recommendation: recommendation,
            confidence: patterns.consistencyScore > 0.8 ? 'Alta' : patterns.consistencyScore > 0.6 ? 'Média' : 'Baixa'
        };
    }
    
    /**
     * Obtém recomendações aprofundadas
     */
    getDeepRecommendations(profile, patterns) {
        const recs = [];
        
        // Recomendações baseadas no perfil
        if (profile.biometrics.preferredLength < 40) {
            recs.push('📄 Priorizar concisão - peças com até 30 páginas têm maior aceitação');
        } else {
            recs.push('📚 Detalhar fundamentação - magistrado valoriza desenvolvimento analítico');
        }
        
        // Recomendações baseadas em teses preferidas
        const preferredTheses = patterns?.preferredTheses || profile.semanticProfile.preferredKeywords;
        if (preferredTheses && preferredTheses.length > 0) {
            recs.push(`🎯 Incorporar teses preferidas: ${preferredTheses.slice(0, 3).join(', ')}`);
        }
        
        // Recomendações baseadas em teses evitadas
        const avoidedTheses = patterns?.avoidedTheses || profile.semanticProfile.avoidedKeywords;
        if (avoidedTheses && avoidedTheses.length > 0) {
            recs.push(`⚠️ Evitar argumentação baseada em: ${avoidedTheses.slice(0, 3).join(', ')}`);
        }
        
        // Recomendações baseadas em evolução
        if (patterns?.recentTrend === 'evolving') {
            recs.push('📊 Monitorar decisões recentes - possível mudança de paradigma');
        }
        
        if (recs.length === 0) {
            recs.push('✅ Alinhar argumentação ao perfil padrão do magistrado');
        }
        
        return recs;
    }
    
    /**
     * Prediz comportamento em caso específico
     */
    predictJudgeBehavior(judgeName, caseData) {
        try {
            const profile = this.biometrics.getJudgeBiometricProfile(judgeName);
            const patterns = this.behavioralPatterns.get(judgeName);
            
            if (!profile) return null;
            
            const baseProbability = profile.favorableRate;
            let adjustedProbability = baseProbability;
            let confidenceFactors = [];
            
            // Ajuste por tipo de caso
            if (caseData.category && profile.decisionHistory.byArea[caseData.category]) {
                const areaStats = profile.decisionHistory.byArea[caseData.category];
                const areaRate = areaStats.favorable / areaStats.total;
                adjustedProbability = (baseProbability + areaRate) / 2;
                confidenceFactors.push(`Área ${caseData.category}: taxa ${(areaRate * 100).toFixed(0)}%`);
            }
            
            // Ajuste por valor da causa
            if (caseData.value > 100000) {
                adjustedProbability += 0.03;
                confidenceFactors.push('Valor elevado (+3%)');
            }
            
            // Ajuste por qualidade probatória
            if (caseData.hasDocumentaryEvidence && profile.biometrics.evidencePreference > 70) {
                adjustedProbability += 0.08;
                confidenceFactors.push('Prova documental alinhada com perfil (+8%)');
            }
            
            if (caseData.hasDigitalEvidence && profile.semanticProfile.preferredKeywords.includes('prova digital')) {
                adjustedProbability += 0.10;
                confidenceFactors.push('Prova digital valorizada (+10%)');
            }
            
            // Ajuste por evolução recente
            if (patterns?.recentTrend === 'evolving') {
                adjustedProbability *= 0.95;
                confidenceFactors.push('Perfil em evolução - incerteza aumentada');
            }
            
            adjustedProbability = Math.min(Math.max(adjustedProbability, 0.2), 0.95);
            
            return {
                judgeName: judgeName,
                caseId: caseData.id,
                predictedOutcome: adjustedProbability > 0.65 ? 'favorable' : adjustedProbability > 0.45 ? 'neutral' : 'unfavorable',
                probability: (adjustedProbability * 100).toFixed(0) + '%',
                confidence: (patterns?.consistencyScore * 100 || 75).toFixed(0) + '%',
                confidenceFactors: confidenceFactors,
                recommendedArguments: this.getRecommendedArguments(profile, caseData),
                riskFactors: this.getRiskFactors(profile, caseData),
                timelineEstimate: this.estimateDecisionTimeline(profile, caseData)
            };
        } catch (error) {
            console.error('[ELITE] Erro na previsão de comportamento:', error);
            return null;
        }
    }
    
    /**
     * Obtém argumentos recomendados
     */
    getRecommendedArguments(profile, caseData) {
        const args = [];
        
        // Argumentos baseados em keywords preferidas
        const preferredKeywords = profile.semanticProfile.preferredKeywords;
        for (const keyword of preferredKeywords.slice(0, 3)) {
            args.push(`Incluir referência a: ${keyword}`);
        }
        
        // Argumentos baseados em citações preferidas
        const preferredCitations = profile.semanticProfile.preferredCitations;
        for (const citation of preferredCitations.slice(0, 2)) {
            args.push(`Citar jurisprudência do ${citation}`);
        }
        
        // Argumentos específicos do caso
        if (caseData.hasDocumentaryEvidence) {
            args.push('Art. 376.º CC - Força probatória do documento autêntico');
        }
        
        if (caseData.hasDigitalEvidence) {
            args.push('ISO/IEC 27037:2012 - Integridade da prova digital');
        }
        
        return args;
    }
    
    /**
     * Obtém fatores de risco
     */
    getRiskFactors(profile, caseData) {
        const risks = [];
        
        if (!caseData.hasDocumentaryEvidence && profile.biometrics.evidencePreference > 70) {
            risks.push('Ausência de prova documental - magistrado valoriza este tipo de prova');
        }
        
        if (caseData.value < 15000 && profile.biometrics.preferredLength > 50) {
            risks.push('Valor reduzido pode não justificar peça extensa');
        }
        
        const avoidedKeywords = profile.semanticProfile.avoidedKeywords;
        for (const keyword of avoidedKeywords) {
            if (caseData.description?.toLowerCase().includes(keyword.toLowerCase())) {
                risks.push(`Evitar termo "${keyword}" - magistrado tem rejeição documentada`);
                break;
            }
        }
        
        if (risks.length === 0) {
            risks.push('Riscos dentro dos padrões aceitáveis');
        }
        
        return risks;
    }
    
    /**
     * Estima timeline de decisão
     */
    estimateDecisionTimeline(profile, caseData) {
        const baseTime = profile.biometrics.avgDecisionTime;
        let adjustedTime = baseTime;
        
        if (caseData.value > 500000) adjustedTime *= 1.3;
        if (caseData.hasExpertEvidence) adjustedTime *= 1.2;
        if (profile.biometrics.preferredLength < 40) adjustedTime *= 0.9;
        
        return {
            estimatedDays: Math.round(adjustedTime),
            range: `${Math.round(adjustedTime * 0.8)}-${Math.round(adjustedTime * 1.2)} dias`,
            confidence: profile.biometrics.avgDecisionTime > 0 ? 'Média' : 'Baixa'
        };
    }
    
    /**
     * Gera relatório completo de biometria avançada
     */
    generateAdvancedBiometricReport(judgeName) {
        try {
            const deepAnalysis = this.analyzeDeepDecisionPatterns(judgeName);
            const profile = this.biometrics.getJudgeBiometricProfile(judgeName);
            
            if (!deepAnalysis || !profile) return null;
            
            return {
                generatedAt: new Date().toISOString(),
                judgeName: judgeName,
                court: profile.court,
                deepAnalysis: deepAnalysis,
                behavioralProfile: {
                    consistencyScore: (deepAnalysis.consistencyScore * 100).toFixed(0) + '%',
                    predictability: (deepAnalysis.predictability * 100).toFixed(0) + '%',
                    evolutionRate: deepAnalysis.evolutionRate,
                    recentTrend: deepAnalysis.recentTrend
                },
                thematicMap: {
                    preferredTheses: deepAnalysis.thematicPreferences.preferred,
                    avoidedTheses: deepAnalysis.thematicPreferences.avoided,
                    citationMap: deepAnalysis.decisionPatterns.citationPreference
                },
                statisticalSummary: deepAnalysis.statisticalProfile,
                evolutionAnalysis: deepAnalysis.evolutionAnalysis,
                strategicRecommendations: deepAnalysis.recommendations,
                confidenceScore: (deepAnalysis.consistencyScore * 0.6 + deepAnalysis.predictability * 0.4) * 100
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório avançado:', error);
            return null;
        }
    }
    
    /**
     * Renderiza dashboard de biometria avançada
     */
    renderDashboard(containerId, judgeName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateAdvancedBiometricReport(judgeName);
            if (!report) {
                container.innerHTML = '<div class="alert-item error">Magistrado não encontrado</div>';
                return;
            }
            
            container.innerHTML = `
                <div class="judge-biometrics-extension">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> JUDGE BIOMETRICS EXTENSION - ANÁLISE AVANÇADA</h2><div class="confidence-badge">Confiança: ${report.confidenceScore?.toFixed(0) || 'N/A'}%</div></div>
                    
                    <div class="judge-summary"><div class="summary-card"><div class="summary-value">${report.judgeName}</div><div class="summary-label">Magistrado</div><div class="summary-sub">${report.court}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.statisticalSummary?.favorableRate || 'N/A'}</div><div class="summary-label">Taxa Favorável</div><div class="summary-sub">${report.statisticalSummary?.totalDecisions || 0} decisões</div></div>
                    <div class="summary-card"><div class="summary-value">${report.behavioralProfile?.consistencyScore || 'N/A'}</div><div class="summary-label">Consistência</div><div class="summary-sub">Previsibilidade: ${report.behavioralProfile?.predictability || 'N/A'}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.statisticalSummary?.avgDecisionTime || 'N/A'}</div><div class="summary-label">Tempo Médio</div><div class="summary-sub">${report.evolutionAnalysis?.trend === 'evolving' ? '📈 Em evolução' : '📊 Estável'}</div></div></div>
                    
                    <div class="thematic-section"><h3><i class="fas fa-map"></i> MAPA TEMÁTICO</h3><div class="thematic-grid"><div class="thematic-card preferred"><strong>Teses Preferidas</strong><ul>${report.thematicMap?.preferredTheses?.map(t => `<li>✓ ${t}</li>`).join('')}</ul></div>
                    <div class="thematic-card avoided"><strong>Teses a Evitar</strong><ul>${report.thematicMap?.avoidedTheses?.map(t => `<li>✗ ${t}</li>`).join('')}</ul></div>
                    <div class="thematic-card citations"><strong>Citações Preferidas</strong><ul>${report.thematicMap?.citationMap?.map(c => `<li>📚 ${c}</li>`).join('')}</ul></div></div></div>
                    
                    <div class="evolution-section"><h3><i class="fas fa-chart-line"></i> ANÁLISE EVOLUTIVA</h3><div class="evolution-card"><div class="evolution-trend trend-${report.evolutionAnalysis?.trend}">Tendência: ${report.evolutionAnalysis?.trend === 'evolving' ? 'Em Evolução' : report.evolutionAnalysis?.trend === 'adapting' ? 'Em Adaptação' : 'Estável'}</div>
                    <div class="evolution-rate">Taxa de Evolução: ${report.evolutionAnalysis?.evolutionRate || 'N/A'}</div>
                    <div class="evolution-description">${report.evolutionAnalysis?.description || 'N/A'}</div>
                    <div class="evolution-recommendation"><strong>Recomendação:</strong> ${report.evolutionAnalysis?.recommendation || 'N/A'}</div></div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES ESTRATÉGICAS</h3><div class="recommendations-list"><ul>${report.strategicRecommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                    
                    <div class="statistical-section"><h3><i class="fas fa-chart-simple"></i> PERFIL ESTATÍSTICO</h3><div class="stats-grid"><div class="stat-card"><div class="stat-label">Extensão Ideal</div><div class="stat-value">${report.deepAnalysis?.decisionPatterns?.averageLength || 'N/A'} págs</div></div>
                    <div class="stat-card"><div class="stat-label">Nível Técnico</div><div class="stat-value">${report.deepAnalysis?.decisionPatterns?.technicalLevel || 'N/A'}%</div></div>
                    <div class="stat-card"><div class="stat-label">Estrutura</div><div class="stat-value">${report.deepAnalysis?.decisionPatterns?.argumentStructure === 'deductive' ? 'Dedutiva' : 'Indutiva'}</div></div>
                    <div class="stat-card"><div class="stat-label">Tutela Antecipada</div><div class="stat-value">${report.statisticalSummary?.injunctionRate || 'N/A'}</div></div></div></div>
                </div>
                <style>
                    .judge-biometrics-extension{ padding:0; } .confidence-badge{ background:var(--elite-primary-dim); padding:8px 16px; border-radius:20px; font-size:0.7rem; font-weight:bold; color:var(--elite-primary); } .judge-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .thematic-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; } .thematic-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .thematic-card.preferred{ border-left:3px solid #00e676; } .thematic-card.avoided{ border-left:3px solid #ff1744; } .thematic-card.citations{ border-left:3px solid #00e5ff; } .thematic-card ul{ margin:12px 0 0 20px; font-size:0.7rem; } .evolution-card{ background:var(--bg-terminal); border-radius:12px; padding:20px; } .evolution-trend{ font-size:1rem; font-weight:bold; margin-bottom:8px; } .evolution-trend.trend-evolving{ color:#ffc107; } .evolution-trend.trend-adapting{ color:#00e5ff; } .evolution-trend.trend-stable{ color:#00e676; } .stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; } @media (max-width:768px){ .judge-summary{ grid-template-columns:1fr 1fr; } .thematic-grid{ grid-template-columns:1fr; } .stats-grid{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.JudgeBiometricsExtension = new JudgeBiometricsExtension(window.JudgeBiometrics);

console.log('[ELITE] Judge Biometrics Extension carregada - Análise Avançada de Magistrados Ativa');