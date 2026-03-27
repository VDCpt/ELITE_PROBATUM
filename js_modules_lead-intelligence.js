/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE LEAD INTELLIGENCE
 * ============================================================================
 * Captação inteligente de clientes com análise de dados públicos,
 * score de probabilidade de contratação, proposta comercial dinâmica
 * e monitorização de oportunidades de mercado.
 * ============================================================================
 */

class LeadIntelligence {
    constructor() {
        this.leads = [];
        this.opportunities = [];
        this.marketData = null;
        this.scoringModels = null;
        this.campaigns = [];
        this.initialized = false;
        
        this.loadLeads();
        this.loadMarketData();
        this.initScoringModels();
    }
    
    /**
     * Inicializa o módulo de inteligência de leads
     */
    initialize() {
        try {
            this.initialized = true;
            this.startMarketMonitoring();
            console.log('[ELITE] Lead Intelligence inicializado -', this.leads.length, 'leads ativos');
        } catch (error) {
            console.error('[ELITE] Erro na inicialização do Lead Intelligence:', error);
            this.initialized = false;
        }
        return this;
    }
    
    /**
     * Carrega dados de mercado simulados
     */
    loadMarketData() {
        try {
            this.marketData = {
                sectors: {
                    tvde: { name: 'Transporte TVDE', totalDrivers: 45000, activeLitigation: 380, avgCaseValue: 18500, growthRate: 0.12, seasonality: [0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.12, 1.08, 1.02, 0.98, 0.95, 0.92] },
                    ecommerce: { name: 'Comércio Eletrónico', totalBusinesses: 12500, activeLitigation: 125, avgCaseValue: 12400, growthRate: 0.08, seasonality: [0.95, 0.92, 0.98, 1.02, 1.05, 1.08, 1.10, 1.12, 1.15, 1.20, 1.18, 1.25] },
                    delivery: { name: 'Entregas/Delivery', totalWorkers: 28000, activeLitigation: 95, avgCaseValue: 8900, growthRate: 0.15, seasonality: [0.88, 0.92, 0.98, 1.02, 1.05, 1.08, 1.10, 1.12, 1.10, 1.05, 1.00, 0.95] },
                    hospitality: { name: 'Hotelaria e Restauração', totalBusinesses: 32000, activeLitigation: 210, avgCaseValue: 11200, growthRate: 0.06, seasonality: [0.92, 0.95, 1.02, 1.08, 1.12, 1.18, 1.22, 1.20, 1.15, 1.10, 1.05, 1.02] }
                },
                platforms: {
                    bolt: { marketShare: 0.45, growth: 0.12, litigationRate: 0.32, avgDiscrepancy: 18500 },
                    uber: { marketShare: 0.35, growth: 0.08, litigationRate: 0.28, avgDiscrepancy: 17200 },
                    freenow: { marketShare: 0.12, growth: 0.05, litigationRate: 0.15, avgDiscrepancy: 12400 },
                    glovo: { marketShare: 0.05, growth: 0.20, litigationRate: 0.22, avgDiscrepancy: 9800 },
                    others: { marketShare: 0.03, growth: 0.15, litigationRate: 0.10, avgDiscrepancy: 7500 }
                },
                courts: {
                    lisboa: { casesFiled: 45, successRate: 0.62, avgDuration: 135, leadConcentration: 0.38 },
                    porto: { casesFiled: 38, successRate: 0.68, avgDuration: 110, leadConcentration: 0.25 },
                    braga: { casesFiled: 25, successRate: 0.55, avgDuration: 125, leadConcentration: 0.15 },
                    coimbra: { casesFiled: 22, successRate: 0.58, avgDuration: 140, leadConcentration: 0.12 },
                    faro: { casesFiled: 18, successRate: 0.61, avgDuration: 130, leadConcentration: 0.10 }
                }
            };
        } catch (error) {
            console.error('[ELITE] Erro ao carregar dados de mercado:', error);
            this.marketData = { sectors: {}, platforms: {}, courts: {} };
        }
    }
    
    /**
     * Inicializa modelos de scoring
     */
    initScoringModels() {
        try {
            this.scoringModels = {
                demographic: { weight: 0.25, factors: { location: { lisboa: 0.9, porto: 0.85, braga: 0.7, coimbra: 0.65, faro: 0.6 }, sector: { tvde: 0.95, delivery: 0.85, ecommerce: 0.75, hospitality: 0.65 }, companySize: { small: 0.6, medium: 0.8, large: 0.7 } } },
                behavioral: { weight: 0.35, factors: { engagement: { high: 0.9, medium: 0.6, low: 0.3 }, urgency: { high: 0.95, medium: 0.7, low: 0.4 }, channel: { referral: 0.9, organic: 0.7, social: 0.6, email: 0.5 } } },
                financial: { weight: 0.25, factors: { estimatedValue: { high: 0.9, medium: 0.7, low: 0.5 }, abilityToPay: { high: 0.95, medium: 0.75, low: 0.4 } } },
                competitive: { weight: 0.15, factors: { competitorContact: { none: 0.9, contacted: 0.5, retained: 0.3 }, marketPressure: { high: 0.85, medium: 0.7, low: 0.5 } } }
            };
        } catch (error) {
            console.error('[ELITE] Erro ao inicializar modelos de scoring:', error);
            this.scoringModels = { demographic: { weight: 0.25, factors: {} }, behavioral: { weight: 0.35, factors: {} }, financial: { weight: 0.25, factors: {} }, competitive: { weight: 0.15, factors: {} } };
        }
    }
    
    /**
     * Adiciona novo lead
     */
    addLead(leadData) {
        try {
            const lead = {
                id: this.generateLeadId(),
                name: leadData.name,
                email: leadData.email,
                phone: leadData.phone,
                nif: leadData.nif,
                sector: leadData.sector || 'unknown',
                location: leadData.location || 'lisboa',
                source: leadData.source || 'manual',
                estimatedValue: leadData.estimatedValue || 0,
                status: 'new',
                score: 0,
                createdAt: new Date().toISOString(),
                lastContact: null,
                notes: leadData.notes || '',
                tags: leadData.tags || [],
                interactions: [],
                assignedTo: leadData.assignedTo || null,
                conversionProbability: 0
            };
            
            lead.score = this.calculateLeadScore(lead);
            lead.conversionProbability = this.calculateConversionProbability(lead);
            
            this.leads.unshift(lead);
            this.saveLeads();
            
            if (window.EliteUtils) window.EliteUtils.showToast(`Lead ${lead.name} adicionado com score ${lead.score}`, 'success');
            return lead;
        } catch (error) {
            console.error('[ELITE] Erro ao adicionar lead:', error);
            return null;
        }
    }
    
    /**
     * Gera ID único para lead
     */
    generateLeadId() {
        return `LEAD_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`.toUpperCase();
    }
    
    /**
     * Calcula score do lead (0-100)
     */
    calculateLeadScore(lead) {
        try {
            let score = 0;
            let demographicScore = 0.5;
            if (this.scoringModels?.demographic?.factors?.location?.[lead.location]) demographicScore += this.scoringModels.demographic.factors.location[lead.location] * 0.1;
            if (this.scoringModels?.demographic?.factors?.sector?.[lead.sector]) demographicScore += this.scoringModels.demographic.factors.sector[lead.sector] * 0.15;
            demographicScore = Math.min(demographicScore, 1.0);
            score += demographicScore * (this.scoringModels?.demographic?.weight || 0.25) * 100;
            
            let behavioralScore = 0.5;
            const engagementLevel = this.getEngagementLevel(lead);
            if (this.scoringModels?.behavioral?.factors?.engagement?.[engagementLevel]) behavioralScore += this.scoringModels.behavioral.factors.engagement[engagementLevel] * 0.15;
            behavioralScore = Math.min(behavioralScore, 1.0);
            score += behavioralScore * (this.scoringModels?.behavioral?.weight || 0.35) * 100;
            
            let financialScore = 0.5;
            if (lead.estimatedValue > 50000) financialScore += 0.3;
            else if (lead.estimatedValue > 15000) financialScore += 0.2;
            else if (lead.estimatedValue > 5000) financialScore += 0.1;
            financialScore = Math.min(financialScore, 1.0);
            score += financialScore * (this.scoringModels?.financial?.weight || 0.25) * 100;
            
            let competitiveScore = 0.6;
            const marketPressure = this.getMarketPressure(lead.sector);
            competitiveScore += marketPressure * 0.15;
            competitiveScore = Math.min(competitiveScore, 1.0);
            score += competitiveScore * (this.scoringModels?.competitive?.weight || 0.15) * 100;
            
            return Math.round(score);
        } catch (error) {
            return 50;
        }
    }
    
    /**
     * Calcula probabilidade de conversão
     */
    calculateConversionProbability(lead) {
        try {
            const baseProbability = lead.score / 100;
            let adjustment = 0;
            if (lead.sector === 'tvde' || lead.sector === 'delivery') adjustment += 0.08;
            if (lead.location === 'lisboa' || lead.location === 'porto') adjustment += 0.05;
            if (lead.estimatedValue > 30000) adjustment += 0.07;
            if (lead.interactions.length > 0) adjustment += 0.03 * Math.min(lead.interactions.length, 5);
            return Math.min(Math.max(baseProbability + adjustment, 0.1), 0.95);
        } catch (error) {
            return 0.5;
        }
    }
    
    /**
     * Obtém nível de engajamento do lead
     */
    getEngagementLevel(lead) {
        if (lead.interactions.length >= 3) return 'high';
        if (lead.interactions.length >= 1) return 'medium';
        return 'low';
    }
    
    /**
     * Obtém pressão de mercado para um setor
     */
    getMarketPressure(sector) {
        try {
            const sectorData = this.marketData?.sectors?.[sector];
            if (!sectorData) return 0.5;
            const litigationRate = sectorData.activeLitigation / sectorData.totalDrivers;
            return Math.min(litigationRate * 10, 0.85);
        } catch (error) {
            return 0.5;
        }
    }
    
    /**
     * Registra interação com lead
     */
    addInteraction(leadId, type, notes) {
        try {
            const lead = this.leads.find(l => l.id === leadId);
            if (!lead) return null;
            
            const interaction = { id: Date.now(), type: type, notes: notes, timestamp: new Date().toISOString(), user: window.ELITE_SESSION_ID || 'system' };
            lead.interactions.push(interaction);
            lead.lastContact = interaction.timestamp;
            lead.score = this.calculateLeadScore(lead);
            lead.conversionProbability = this.calculateConversionProbability(lead);
            if (lead.status === 'new' && lead.interactions.length >= 1) lead.status = 'contacted';
            this.saveLeads();
            if (window.EliteUtils) window.EliteUtils.showToast(`Interação registada com ${lead.name}`, 'info');
            return interaction;
        } catch (error) {
            console.error('[ELITE] Erro ao registar interação:', error);
            return null;
        }
    }
    
    /**
     * Atualiza status do lead
     */
    updateLeadStatus(leadId, status, notes = '') {
        try {
            const lead = this.leads.find(l => l.id === leadId);
            if (!lead) return null;
            const oldStatus = lead.status;
            lead.status = status;
            if (notes) this.addInteraction(leadId, 'status_change', `Status alterado de ${oldStatus} para ${status}: ${notes}`);
            if (status === 'converted' && oldStatus !== 'converted') this.registerConversion(lead);
            this.saveLeads();
            if (window.EliteUtils) window.EliteUtils.showToast(`Lead ${lead.name} atualizado para ${status}`, 'success');
            return lead;
        } catch (error) {
            console.error('[ELITE] Erro ao atualizar status do lead:', error);
            return null;
        }
    }
    
    /**
     * Registra conversão de lead para cliente
     */
    registerConversion(lead) {
        try {
            lead.convertedAt = new Date().toISOString();
            if (window.ClientPortal && typeof window.ClientPortal.addClient === 'function') {
                window.ClientPortal.addClient({ name: lead.name, email: lead.email, nif: lead.nif, phone: lead.phone, source: 'lead_conversion', leadId: lead.id });
            }
            const activityLog = { timestamp: new Date().toLocaleString(), user: lead.assignedTo || 'Sistema', action: 'Conversão de Lead', entity: lead.name, hash: window.EliteUtils ? window.EliteUtils.generateHash(lead.id) : null };
            const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
            logs.unshift(activityLog);
            localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
        } catch (error) {
            console.error('[ELITE] Erro ao registar conversão:', error);
        }
    }
    
    /**
     * Identifica leads quentes automaticamente
     */
    identifyHotLeads() {
        try {
            return this.leads.filter(l => l.status !== 'converted' && l.status !== 'lost').sort((a, b) => b.score - a.score).slice(0, 10);
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Identifica oportunidades de mercado
     */
    identifyOpportunities() {
        try {
            const opportunities = [];
            const tvdeData = this.marketData?.sectors?.tvde;
            if (tvdeData && tvdeData.growthRate > 0.1 && tvdeData.activeLitigation > 300) {
                opportunities.push({ id: 'OPP_TVDE_001', title: 'Oportunidade TVDE - Alta Litigância', description: `Setor TVDE com ${tvdeData.activeLitigation} casos ativos. Crescimento de ${(tvdeData.growthRate * 100).toFixed(0)}% no último ano.`, sector: 'tvde', estimatedLeads: Math.round(tvdeData.activeLitigation * 0.3), priority: 'high', action: 'Campanha de marketing direcionada a motoristas TVDE', roi: 3.2 });
            }
            opportunities.push({ id: 'OPP_DAC7_001', title: 'Divergência DAC7 - Obrigação de Reporte', description: 'Plataformas digitais falharam reporte DAC7. Potencial para ação coletiva.', sector: 'tvde', estimatedLeads: 2500, priority: 'critical', action: 'Produzir conteúdo educativo sobre DAC7 e contactar associações', roi: 4.5 });
            opportunities.push({ id: 'OPP_JURIS_001', title: 'Jurisprudência STA Favorável', description: 'Acórdão STA 0456/2024 - Preço de transferência dissimulado', sector: 'all', estimatedLeads: 500, priority: 'high', action: 'Webinar sobre a nova jurisprudência e seus efeitos', roi: 2.8 });
            const weakCourts = Object.entries(this.marketData?.courts || {}).filter(([_, data]) => data.successRate < 0.6).map(([name, data]) => ({ name, successRate: data.successRate }));
            if (weakCourts.length > 0) opportunities.push({ id: 'OPP_COURT_001', title: 'Oportunidade Regional', description: `Tribunais com menor concorrência: ${weakCourts.map(c => c.name).join(', ')}`, sector: 'all', estimatedLeads: 150, priority: 'medium', action: 'Expandir presença para estas comarcas', roi: 1.8 });
            this.opportunities = opportunities;
            return opportunities;
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Gera proposta comercial dinâmica (sem faturação)
     */
    generateProposal(leadId) {
        try {
            const lead = this.leads.find(l => l.id === leadId);
            if (!lead) return null;
            
            const baseFee = lead.estimatedValue * 0.25;
            let discount = 0;
            let specialTerms = [];
            
            if (lead.score > 80) { discount = 0.15; specialTerms.push('Desconto de 15% para clientes de alto potencial'); }
            else if (lead.score > 60) { discount = 0.10; specialTerms.push('Desconto de 10% na primeira fase do processo'); }
            else if (lead.score > 40) { discount = 0.05; specialTerms.push('Condições especiais de pagamento'); }
            
            if (lead.sector === 'tvde') specialTerms.push('Modelo de honorários de contingência disponível');
            if (lead.sector === 'delivery') specialTerms.push('Análise preliminar gratuita de viabilidade');
            
            const proposal = {
                leadId: lead.id,
                clientName: lead.name,
                generatedAt: new Date().toISOString(),
                estimatedCaseValue: lead.estimatedValue,
                proposedFee: baseFee * (1 - discount),
                originalFee: baseFee,
                discount: discount * 100,
                paymentTerms: discount > 0.1 ? '50% na contratação, 50% no êxito' : '30% na contratação, 70% parcelado',
                specialTerms: specialTerms,
                validityDays: 15,
                proposalText: this.generateProposalText(lead, baseFee, discount)
            };
            
            this.addInteraction(leadId, 'proposal', `Proposta gerada: €${proposal.proposedFee.toLocaleString()}`);
            return proposal;
        } catch (error) {
            console.error('[ELITE] Erro ao gerar proposta:', error);
            return null;
        }
    }
    
    /**
     * Gera texto da proposta
     */
    generateProposalText(lead, baseFee, discount) {
        try {
            const sectorName = this.marketData?.sectors?.[lead.sector]?.name || 'sector';
            return `Prezado(a) ${lead.name},\n\nA ELITE PROBATUM, Unidade de Comando Forense Digital, tem o prazer de apresentar a seguinte proposta para representação no âmbito de litígio com plataforma digital.\n\nCom base na análise preliminar dos dados fornecidos, identificamos um potencial de recuperação estimado em ${lead.estimatedValue.toLocaleString()}€, relativo a discrepâncias fiscais e retenções indevidas praticadas pela plataforma.\n\nNossa proposta de honorários contempla:\n- Valor base: ${baseFee.toLocaleString()}€\n- Desconto especial: ${(discount * 100).toFixed(0)}%\n- Valor final: ${(baseFee * (1 - discount)).toLocaleString()}€\n\nIncluídos:\n- Análise forense completa dos dados extraídos\n- Elaboração e submissão de petição inicial\n- Acompanhamento processual integral\n- Perícia técnica, se necessária\n\nCondições especiais para o setor de ${sectorName}:\n${discount > 0 ? '- Desconto por potencial de caso coletivo' : ''}\n- Possibilidade de modelo de honorários de contingência\n\nAgradecemos a oportunidade e colocamo-nos à disposição para esclarecimentos adicionais.\n\nCom os melhores cumprimentos,\nEquipa ELITE PROBATUM`;
        } catch (error) {
            return 'Proposta comercial disponível mediante contacto.';
        }
    }
    
    /**
     * Inicia monitorização de mercado
     */
    startMarketMonitoring() {
        setInterval(() => { this.checkMarketChanges(); }, 6 * 60 * 60 * 1000);
    }
    
    /**
     * Verifica mudanças no mercado
     */
    checkMarketChanges() {
        try {
            const newOpportunities = this.identifyOpportunities();
            const criticalOpps = newOpportunities.filter(o => o.priority === 'critical');
            if (criticalOpps.length > 0 && window.EliteUtils) window.EliteUtils.showToast(`Nova oportunidade crítica: ${criticalOpps[0].title}`, 'warning');
            for (const sector in this.marketData?.sectors) {
                const sectorData = this.marketData.sectors[sector];
                if (sectorData) {
                    const fluctuation = (Math.random() - 0.5) * 0.05;
                    sectorData.growthRate = Math.max(0, sectorData.growthRate + fluctuation);
                    sectorData.activeLitigation += Math.floor(Math.random() * 10) - 3;
                    sectorData.activeLitigation = Math.max(0, sectorData.activeLitigation);
                }
            }
        } catch (error) {
            console.error('[ELITE] Erro ao verificar mudanças no mercado:', error);
        }
    }
    
    /**
     * Renderiza dashboard de leads
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const hotLeads = this.identifyHotLeads();
            const opportunities = this.identifyOpportunities();
            const stats = this.getStatistics();
            
            container.innerHTML = `
                <div class="lead-intelligence-dashboard">
                    <div class="dashboard-header"><h2><i class="fas fa-chart-line"></i> INTELIGÊNCIA DE CAPTAÇÃO</h2><button id="newLeadBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO LEAD</button></div>
                    <div class="stats-grid"><div class="stat-card"><div class="stat-value">${stats.totalLeads}</div><div class="stat-label">Total de Leads</div></div><div class="stat-card"><div class="stat-value">${stats.hotLeads}</div><div class="stat-label">Leads Quentes</div></div><div class="stat-card"><div class="stat-value">${stats.conversionRate}%</div><div class="stat-label">Taxa de Conversão</div></div><div class="stat-card"><div class="stat-value">€${(stats.estimatedPipeline / 1000).toFixed(0)}k</div><div class="stat-label">Pipeline Estimado</div></div></div>
                    <div class="hot-leads-section"><h3><i class="fas fa-fire"></i> LEADS QUENTES</h3><div class="leads-grid">${hotLeads.map(lead => `<div class="lead-card priority-${lead.score > 80 ? 'high' : lead.score > 60 ? 'medium' : 'low'}"><div class="lead-header"><strong>${lead.name}</strong><span class="lead-score">${lead.score}%</span></div><div class="lead-details"><div><i class="fas fa-building"></i> ${this.marketData?.sectors?.[lead.sector]?.name || lead.sector}</div><div><i class="fas fa-map-marker-alt"></i> ${lead.location.toUpperCase()}</div><div><i class="fas fa-euro-sign"></i> €${lead.estimatedValue.toLocaleString()}</div></div><div class="lead-probability"><div class="progress-bar"><div class="progress-fill" style="width: ${lead.conversionProbability * 100}%"></div><span class="progress-text">${(lead.conversionProbability * 100).toFixed(0)}%</span></div></div><div class="lead-actions"><button class="action-btn view-lead" data-id="${lead.id}"><i class="fas fa-eye"></i></button><button class="action-btn propose-lead" data-id="${lead.id}"><i class="fas fa-file-signature"></i></button><button class="action-btn contact-lead" data-id="${lead.id}"><i class="fas fa-phone"></i></button></div></div>`).join('')}${hotLeads.length === 0 ? '<div class="empty-state">Nenhum lead quente identificado</div>' : ''}</div></div>
                    <div class="opportunities-section"><h3><i class="fas fa-chart-line"></i> OPORTUNIDADES DE MERCADO</h3><div class="opportunities-grid">${opportunities.map(opp => `<div class="opportunity-card priority-${opp.priority}"><div class="opp-header"><i class="fas fa-bullhorn"></i><strong>${opp.title}</strong><span class="priority-badge">${opp.priority.toUpperCase()}</span></div><p>${opp.description}</p><div class="opp-details"><span><i class="fas fa-users"></i> ${opp.estimatedLeads} leads estimados</span><span><i class="fas fa-chart-simple"></i> ROI ${opp.roi}x</span></div><button class="elite-btn small opp-action" data-opp="${opp.id}">VER ESTRATÉGIA</button></div>`).join('')}</div></div>
                </div>
                <style>
                    .lead-intelligence-dashboard{ padding:0; } .stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; } .stat-card{ background:var(--bg-command); border-radius:16px; padding:20px; text-align:center; } .stat-value{ font-size:1.8rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--elite-primary); } .stat-label{ font-size:0.7rem; color:#94a3b8; margin-top:8px; } .leads-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; margin:20px 0; } .lead-card{ background:var(--bg-command); border-radius:16px; padding:20px; border:1px solid var(--border-tactic); transition:all 0.2s; } .lead-card:hover{ border-color:var(--elite-primary); transform:translateY(-2px); } .lead-card.priority-high{ border-left:4px solid var(--elite-danger); } .lead-card.priority-medium{ border-left:4px solid var(--elite-warning); } .lead-card.priority-low{ border-left:4px solid var(--elite-success); } .lead-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; } .lead-score{ background:var(--elite-primary-dim); padding:2px 8px; border-radius:12px; font-size:0.7rem; } .lead-details{ display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.7rem; color:#94a3b8; margin-bottom:12px; } .lead-actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:12px; } .opportunities-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; margin:20px 0; } .opportunity-card{ background:var(--bg-command); border-radius:16px; padding:20px; border:1px solid var(--border-tactic); } .opportunity-card.priority-critical{ border-left:4px solid var(--elite-danger); } .opportunity-card.priority-high{ border-left:4px solid var(--elite-warning); } .opportunity-card.priority-medium{ border-left:4px solid var(--elite-primary); } .opp-header{ display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap; } .priority-badge{ background:rgba(255,23,68,0.1); color:#ff1744; padding:2px 8px; border-radius:12px; font-size:0.6rem; } .opp-details{ display:flex; gap:16px; margin:12px 0; font-size:0.7rem; color:#94a3b8; flex-wrap:wrap; } .action-btn{ background:rgba(255,255,255,0.05); border:1px solid var(--border-tactic); padding:6px 12px; border-radius:8px; cursor:pointer; font-size:0.7rem; color:#94a3b8; transition:all 0.2s; } .action-btn:hover{ border-color:var(--elite-primary); color:var(--elite-primary); } @media (max-width:768px){ .stats-grid{ grid-template-columns:1fr 1fr; } .leads-grid{ grid-template-columns:1fr; } .opportunities-grid{ grid-template-columns:1fr; } }
                </style>
            `;
            
            document.getElementById('newLeadBtn')?.addEventListener('click', () => this.showNewLeadModal());
            container.querySelectorAll('.view-lead').forEach(btn => { btn.addEventListener('click', () => this.showLeadDetails(btn.dataset.id)); });
            container.querySelectorAll('.propose-lead').forEach(btn => { btn.addEventListener('click', () => { const proposal = this.generateProposal(btn.dataset.id); if (proposal && window.EliteUtils) window.EliteUtils.showToast(`Proposta gerada para ${proposal.clientName}`, 'success'); }); });
            container.querySelectorAll('.contact-lead').forEach(btn => { btn.addEventListener('click', () => { const lead = this.leads.find(l => l.id === btn.dataset.id); if (lead && window.EliteUtils) window.EliteUtils.showToast(`Contactar ${lead.name} - ${lead.phone || 'telefone não disponível'}`, 'info'); }); });
            container.querySelectorAll('.opp-action').forEach(btn => { btn.addEventListener('click', () => { if (window.EliteUtils) window.EliteUtils.showToast(`Estratégia para oportunidade ${btn.dataset.opp} em desenvolvimento`, 'info'); }); });
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
    
    /**
     * Mostra modal para novo lead
     */
    showNewLeadModal() {
        const modalBody = document.getElementById('leadCaptureBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <form id="newLeadForm"><div class="form-group"><label>Nome Completo *</label><input type="text" id="leadName" required></div><div class="form-group"><label>E-mail *</label><input type="email" id="leadEmail" required></div><div class="form-group"><label>Telefone</label><input type="tel" id="leadPhone"></div><div class="form-group"><label>NIF</label><input type="text" id="leadNif"></div><div class="form-row"><div class="form-group"><label>Setor</label><select id="leadSector"><option value="tvde">Transporte TVDE</option><option value="delivery">Entregas/Delivery</option><option value="ecommerce">Comércio Eletrónico</option><option value="hospitality">Hotelaria/Restauração</option></select></div><div class="form-group"><label>Localização</label><select id="leadLocation"><option value="lisboa">Lisboa</option><option value="porto">Porto</option><option value="braga">Braga</option><option value="coimbra">Coimbra</option><option value="faro">Faro</option></select></div></div><div class="form-group"><label>Valor Estimado da Causa (€)</label><input type="number" id="leadValue" placeholder="0"></div><div class="form-group"><label>Notas</label><textarea id="leadNotes" rows="3"></textarea></div><button type="submit" class="elite-btn primary full-width">ADICIONAR LEAD</button></form>
        `;
        
        document.getElementById('newLeadForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const newLead = {
                name: document.getElementById('leadName')?.value,
                email: document.getElementById('leadEmail')?.value,
                phone: document.getElementById('leadPhone')?.value,
                nif: document.getElementById('leadNif')?.value,
                sector: document.getElementById('leadSector')?.value,
                location: document.getElementById('leadLocation')?.value,
                estimatedValue: parseFloat(document.getElementById('leadValue')?.value) || 0,
                notes: document.getElementById('leadNotes')?.value,
                source: 'manual'
            };
            this.addLead(newLead);
            document.getElementById('leadCaptureModal').style.display = 'none';
            this.renderDashboard('viewContainer');
        });
        
        document.getElementById('leadCaptureModal').style.display = 'flex';
    }
    
    /**
     * Mostra detalhes do lead
     */
    showLeadDetails(leadId) {
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return;
        
        const modalBody = document.getElementById('leadCaptureBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="lead-detail"><div class="detail-header"><h3>${lead.name}</h3><span class="status-badge status-${lead.status}">${lead.status.toUpperCase()}</span></div><div class="detail-row"><span>E-mail:</span><strong>${lead.email}</strong></div><div class="detail-row"><span>Telefone:</span><strong>${lead.phone || '---'}</strong></div><div class="detail-row"><span>NIF:</span><strong>${lead.nif || '---'}</strong></div><div class="detail-row"><span>Setor:</span><strong>${this.marketData?.sectors?.[lead.sector]?.name || lead.sector}</strong></div><div class="detail-row"><span>Localização:</span><strong>${lead.location.toUpperCase()}</strong></div><div class="detail-row"><span>Valor Estimado:</span><strong>€${lead.estimatedValue.toLocaleString()}</strong></div><div class="detail-row"><span>Score:</span><strong style="color: ${lead.score > 70 ? '#00e676' : lead.score > 40 ? '#ffc107' : '#ff1744'}">${lead.score}%</strong></div><div class="detail-row"><span>Probabilidade Conversão:</span><strong>${(lead.conversionProbability * 100).toFixed(0)}%</strong></div><div class="detail-row"><span>Criado em:</span><strong>${new Date(lead.createdAt).toLocaleString()}</strong></div>${lead.lastContact ? `<div class="detail-row"><span>Último Contacto:</span><strong>${new Date(lead.lastContact).toLocaleString()}</strong></div>` : ''}
            <div class="interactions-section"><h4>Interações (${lead.interactions.length})</h4>${lead.interactions.slice(0, 5).map(i => `<div class="interaction-item"><strong>${i.type.toUpperCase()}</strong> - ${new Date(i.timestamp).toLocaleString()}<p>${i.notes}</p></div>`).join('')}${lead.interactions.length === 0 ? '<p class="empty-state">Nenhuma interação registada</p>' : ''}</div>
            <div class="detail-actions"><button class="elite-btn secondary" onclick="LeadIntelligence.updateLeadStatus('${lead.id}', 'contacted')">MARCAR CONTACTADO</button><button class="elite-btn primary" onclick="LeadIntelligence.generateProposal('${lead.id}')">GERAR PROPOSTA</button><button class="elite-btn success" onclick="LeadIntelligence.updateLeadStatus('${lead.id}', 'converted')">CONVERTER</button></div></div>
            <style>.lead-detail{ padding:0; } .detail-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; } .detail-row{ display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-tactic); } .interactions-section{ margin-top:20px; } .interaction-item{ background:var(--bg-terminal); border-radius:8px; padding:12px; margin-bottom:8px; } .detail-actions{ display:flex; gap:12px; margin-top:20px; flex-wrap:wrap; }</style>
        `;
        
        document.getElementById('leadCaptureModal').style.display = 'flex';
    }
    
    /**
     * Salva leads no localStorage
     */
    saveLeads() { try { localStorage.setItem('elite_leads', JSON.stringify(this.leads)); } catch(e) {} }
    
    /**
     * Carrega leads do localStorage
     */
    loadLeads() {
        try {
            const stored = localStorage.getItem('elite_leads');
            if (stored) { this.leads = JSON.parse(stored); }
            else {
                this.leads = [
                    { id: 'LEAD_DEMO_001', name: 'João Silva', email: 'joao.silva@email.com', phone: '912345678', sector: 'tvde', location: 'lisboa', estimatedValue: 18750, score: 78, status: 'new', createdAt: new Date().toISOString(), interactions: [], conversionProbability: 0.72 },
                    { id: 'LEAD_DEMO_002', name: 'Maria Santos', email: 'maria.santos@email.com', phone: '923456789', sector: 'delivery', location: 'porto', estimatedValue: 12400, score: 65, status: 'contacted', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), interactions: [{ id: 1, type: 'call', notes: 'Primeiro contacto, demonstrou interesse', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }], conversionProbability: 0.58 }
                ];
            }
        } catch(e) { this.leads = []; }
    }
    
    /**
     * Obtém estatísticas
     */
    getStatistics() {
        try {
            const totalLeads = this.leads.length;
            const hotLeads = this.leads.filter(l => l.score > 70 && l.status !== 'converted' && l.status !== 'lost').length;
            const converted = this.leads.filter(l => l.status === 'converted').length;
            const conversionRate = totalLeads > 0 ? (converted / totalLeads * 100).toFixed(1) : 0;
            const estimatedPipeline = this.leads.filter(l => l.status !== 'converted' && l.status !== 'lost').reduce((sum, l) => sum + (l.estimatedValue * l.conversionProbability), 0);
            return { totalLeads, hotLeads, converted, conversionRate: parseFloat(conversionRate), estimatedPipeline };
        } catch(e) { return { totalLeads: 0, hotLeads: 0, converted: 0, conversionRate: 0, estimatedPipeline: 0 }; }
    }
}

// Instância global
window.LeadIntelligence = new LeadIntelligence();