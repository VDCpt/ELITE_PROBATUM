/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE GAMIFICATION EXTENSION (COMPLEMENTAR)
 * ============================================================================
 * Extensão complementar do Gamification System com funcionalidades adicionais:
 * - Sistema de níveis e evolução
 * - Desafios personalizados
 * - Recompensas dinâmicas
 * - Rankings sazonais
 * ============================================================================
 */

class GamificationExtensionExtended {
    constructor(gamification) {
        this.gamification = gamification || window.GamificationSystem;
        this.initialized = false;
        this.levelSystem = new Map();
        this.challenges = new Map();
        this.seasonalRankings = new Map();
        
        this.loadLevelSystem();
        this.loadChallenges();
        this.loadSeasonalRankings();
    }
    
    /**
     * Inicializa a extensão
     */
    initialize() {
        try {
            if (!this.gamification) {
                console.warn('[ELITE] Gamification System não disponível para extensão');
                return false;
            }
            this.initialized = true;
            this.initLevelSystem();
            this.initChallenges();
            console.log('[ELITE] Gamification Extension Extended inicializada');
            return true;
        } catch (error) {
            console.error('[ELITE] Erro na inicialização da extensão:', error);
            return false;
        }
    }
    
    /**
     * Carrega sistema de níveis
     */
    loadLevelSystem() {
        try {
            const stored = localStorage.getItem('elite_level_system');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.levelSystem.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar sistema de níveis:', e);
        }
    }
    
    /**
     * Salva sistema de níveis
     */
    saveLevelSystem() {
        try {
            const levelsObj = {};
            for (const [key, value] of this.levelSystem) {
                levelsObj[key] = value;
            }
            localStorage.setItem('elite_level_system', JSON.stringify(levelsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar sistema de níveis:', e);
        }
    }
    
    /**
     * Carrega desafios
     */
    loadChallenges() {
        try {
            const stored = localStorage.getItem('elite_challenges_ext');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.challenges.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar desafios:', e);
        }
    }
    
    /**
     * Salva desafios
     */
    saveChallenges() {
        try {
            const challengesObj = {};
            for (const [key, value] of this.challenges) {
                challengesObj[key] = value;
            }
            localStorage.setItem('elite_challenges_ext', JSON.stringify(challengesObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar desafios:', e);
        }
    }
    
    /**
     * Carrega rankings sazonais
     */
    loadSeasonalRankings() {
        try {
            const stored = localStorage.getItem('elite_seasonal_rankings');
            if (stored) {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.seasonalRankings.set(key, value);
                }
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar rankings sazonais:', e);
        }
    }
    
    /**
     * Salva rankings sazonais
     */
    saveSeasonalRankings() {
        try {
            const rankingsObj = {};
            for (const [key, value] of this.seasonalRankings) {
                rankingsObj[key] = value;
            }
            localStorage.setItem('elite_seasonal_rankings', JSON.stringify(rankingsObj));
        } catch (e) {
            console.error('[ELITE] Erro ao salvar rankings sazonais:', e);
        }
    }
    
    /**
     * Inicializa sistema de níveis
     */
    initLevelSystem() {
        if (this.levelSystem.size === 0) {
            for (let i = 1; i <= 20; i++) {
                this.levelSystem.set(i, {
                    level: i,
                    xpRequired: Math.floor(100 * Math.pow(1.2, i - 1)),
                    title: this.getLevelTitle(i),
                    rewards: this.getLevelRewards(i),
                    badge: this.getLevelBadge(i)
                });
            }
            this.saveLevelSystem();
        }
    }
    
    /**
     * Obtém título do nível
     */
    getLevelTitle(level) {
        if (level === 1) return 'Estagiário';
        if (level <= 3) return 'Analista';
        if (level <= 5) return 'Associado';
        if (level <= 8) return 'Advogado';
        if (level <= 12) return 'Sénior';
        if (level <= 16) return 'Coordenador';
        return 'Master';
    }
    
    /**
     * Obtém recompensas do nível
     */
    getLevelRewards(level) {
        const rewards = [];
        if (level === 5) rewards.push('Badge de Prata');
        if (level === 10) rewards.push('Badge de Ouro');
        if (level === 15) rewards.push('Acesso a cursos avançados');
        if (level === 20) rewards.push('Certificado de Excelência');
        return rewards;
    }
    
    /**
     * Obtém badge do nível
     */
    getLevelBadge(level) {
        if (level >= 15) return 'diamond';
        if (level >= 10) return 'platinum';
        if (level >= 5) return 'gold';
        return 'silver';
    }
    
    /**
     * Inicializa desafios
     */
    initChallenges() {
        if (this.challenges.size === 0) {
            const challenges = [
                { id: 'CHAL_001', name: 'Mestre das Vitórias', description: 'Vencer 5 casos consecutivos', reward: { points: 500, xp: 1000, badge: 'champion' }, target: 5, type: 'win_streak' },
                { id: 'CHAL_002', name: 'Eficiência Total', description: 'Manter eficiência > 85% por 30 dias', reward: { points: 300, xp: 600 }, target: 30, type: 'efficiency' },
                { id: 'CHAL_003', name: 'Mentor do Mês', description: 'Ajudar 3 colegas a completar quests', reward: { points: 400, xp: 800, badge: 'mentor' }, target: 3, type: 'mentoring' },
                { id: 'CHAL_004', name: 'Caçador de Leads', description: 'Converter 5 leads em clientes', reward: { points: 600, xp: 1200 }, target: 5, type: 'conversion' }
            ];
            for (const challenge of challenges) {
                this.challenges.set(challenge.id, challenge);
            }
            this.saveChallenges();
        }
    }
    
    /**
     * Calcula progressão de nível do usuário
     */
    calculateLevelProgression(userId) {
        try {
            const user = this.gamification.users.find(u => u.id === userId);
            if (!user) return null;
            
            const currentLevel = user.level;
            const currentXP = user.xp;
            const currentLevelData = this.levelSystem.get(currentLevel);
            const nextLevelData = this.levelSystem.get(currentLevel + 1);
            
            const xpToNextLevel = currentLevelData?.xpRequired || 0;
            const progress = (currentXP / xpToNextLevel * 100).toFixed(0);
            
            return {
                userId: userId,
                name: user.name,
                currentLevel: currentLevel,
                currentLevelTitle: this.getLevelTitle(currentLevel),
                currentXP: currentXP,
                xpToNextLevel: xpToNextLevel,
                progress: progress + '%',
                nextLevelTitle: nextLevelData ? this.getLevelTitle(currentLevel + 1) : 'Max Level',
                rewardsAtNextLevel: nextLevelData?.rewards || [],
                recommendations: this.getLevelRecommendations(currentXP, xpToNextLevel)
            };
        } catch (error) {
            console.error('[ELITE] Erro no cálculo de progressão:', error);
            return null;
        }
    }
    
    /**
     * Obtém recomendações de nível
     */
    getLevelRecommendations(currentXP, xpToNextLevel) {
        const remainingXP = xpToNextLevel - currentXP;
        if (remainingXP <= 0) return 'Parabéns! Pronto para próximo nível!';
        if (remainingXP < 100) return 'Falta pouco para o próximo nível - complete mais uma quest!';
        if (remainingXP < 300) return 'Continue completando quests diárias para avançar';
        return 'Complete desafios especiais para acelerar sua progressão';
    }
    
    /**
     * Cria desafio personalizado
     */
    createCustomChallenge(challengeData) {
        try {
            const challenge = {
                id: `CHAL_${Date.now()}`,
                name: challengeData.name,
                description: challengeData.description,
                reward: challengeData.reward,
                target: challengeData.target,
                type: challengeData.type,
                startDate: new Date().toISOString(),
                endDate: challengeData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                participants: [],
                status: 'active'
            };
            
            this.challenges.set(challenge.id, challenge);
            this.saveChallenges();
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Desafio "${challenge.name}" criado com sucesso!`, 'success');
            }
            
            return challenge;
        } catch (error) {
            console.error('[ELITE] Erro na criação de desafio:', error);
            return null;
        }
    }
    
    /**
     * Atualiza ranking sazonal
     */
    updateSeasonalRanking(season = 'Q1_2025') {
        try {
            const users = [...this.gamification.users];
            const ranking = users
                .map(u => ({
                    userId: u.id,
                    name: u.name,
                    team: u.team,
                    points: u.points,
                    level: u.level,
                    streak: u.streak,
                    score: u.points * 0.5 + u.level * 100 + u.streak * 10
                }))
                .sort((a, b) => b.score - a.score)
                .map((u, idx) => ({ ...u, rank: idx + 1 }));
            
            this.seasonalRankings.set(season, {
                season: season,
                ranking: ranking,
                updatedAt: new Date().toISOString(),
                topPerformer: ranking[0],
                seasonRewards: this.getSeasonRewards(season)
            });
            
            this.saveSeasonalRankings();
            
            return this.seasonalRankings.get(season);
        } catch (error) {
            console.error('[ELITE] Erro na atualização do ranking sazonal:', error);
            return null;
        }
    }
    
    /**
     * Obtém recompensas sazonais
     */
    getSeasonRewards(season) {
        return {
            first: { points: 1000, xp: 2000, badge: 'season_champion' },
            second: { points: 500, xp: 1000, badge: 'season_runner_up' },
            third: { points: 250, xp: 500, badge: 'season_bronze' }
        };
    }
    
    /**
     * Gera relatório de gamificação
     */
    generateGamificationReport() {
        try {
            const users = this.gamification.users;
            const levelDistribution = {};
            const teamScores = {};
            
            for (const user of users) {
                const level = user.level;
                levelDistribution[level] = (levelDistribution[level] || 0) + 1;
                
                if (!teamScores[user.team]) {
                    teamScores[user.team] = { totalPoints: 0, memberCount: 0, avgLevel: 0 };
                }
                teamScores[user.team].totalPoints += user.points;
                teamScores[user.team].memberCount++;
                teamScores[user.team].avgLevel += user.level;
            }
            
            for (const team in teamScores) {
                teamScores[team].avgLevel = (teamScores[team].avgLevel / teamScores[team].memberCount).toFixed(1);
            }
            
            const currentSeason = this.updateSeasonalRanking();
            
            return {
                generatedAt: new Date().toISOString(),
                levelDistribution: levelDistribution,
                teamScores: teamScores,
                currentSeason: currentSeason,
                activeChallenges: Array.from(this.challenges.values()).filter(c => c.status === 'active'),
                totalPoints: users.reduce((s, u) => s + u.points, 0),
                totalAchievements: users.reduce((s, u) => s + u.badges.length, 0),
                recommendations: this.getGamificationRecommendations(levelDistribution, teamScores)
            };
        } catch (error) {
            console.error('[ELITE] Erro na geração de relatório:', error);
            return { error: true, message: 'Erro na geração do relatório' };
        }
    }
    
    /**
     * Obtém recomendações de gamificação
     */
    getGamificationRecommendations(levelDistribution, teamScores) {
        const recs = [];
        const highLevels = Object.keys(levelDistribution).filter(l => l > 15);
        const lowLevels = Object.keys(levelDistribution).filter(l => l < 5);
        
        if (highLevels.length > 0) {
            recs.push(`🏆 ${highLevels.length} usuários em nível alto - considerar desafios avançados`);
        }
        
        if (lowLevels.length > 0) {
            recs.push(`📈 ${lowLevels.length} usuários em níveis iniciais - reforçar onboarding`);
        }
        
        const bestTeam = Object.entries(teamScores).sort((a, b) => b[1].totalPoints - a[1].totalPoints)[0];
        if (bestTeam) {
            recs.push(`🥇 Equipe ${bestTeam[0]} lidera o ranking - reconhecer performance`);
        }
        
        return recs;
    }
    
    /**
     * Renderiza dashboard de gamificação avançada
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const report = this.generateGamificationReport();
            
            container.innerHTML = `
                <div class="gamification-ext">
                    <div class="dashboard-header"><h2><i class="fas fa-gamepad"></i> GAMIFICATION EXTENSION - SISTEMA DE NÍVEIS</h2><div class="stats-badge">${report.totalPoints} pts totais</div></div>
                    
                    <div class="gamification-summary"><div class="summary-card"><div class="summary-value">${Object.keys(report.levelDistribution).length}</div><div class="summary-label">Níveis Alcançados</div><div class="summary-sub">Máx: ${Math.max(...Object.keys(report.levelDistribution).map(Number))}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.totalAchievements}</div><div class="summary-label">Conquistas Totais</div><div class="summary-sub">Média: ${(report.totalAchievements / this.gamification.users.length).toFixed(1)}</div></div>
                    <div class="summary-card"><div class="summary-value">${report.activeChallenges?.length || 0}</div><div class="summary-label">Desafios Ativos</div><div class="summary-sub">${report.activeChallenges?.filter(c => c.status === 'active').length || 0} em andamento</div></div>
                    <div class="summary-card"><div class="summary-value">${report.currentSeason?.season || 'Q1_2025'}</div><div class="summary-label">Temporada Atual</div><div class="summary-sub">Top: ${report.currentSeason?.topPerformer?.name || 'N/A'}</div></div></div>
                    
                    <div class="level-section"><h3><i class="fas fa-chart-line"></i> SISTEMA DE NÍVEIS</h3><div class="level-grid">${Array.from(this.levelSystem.entries()).slice(0, 5).map(([level, data]) => `
                        <div class="level-card level-${data.badge}">
                            <div class="level-number">Nível ${level}</div>
                            <div class="level-title">${data.title}</div>
                            <div class="level-xp">${data.xpRequired} XP</div>
                            <div class="level-rewards">${data.rewards.join(', ') || 'Sem recompensas'}</div>
                        </div>
                    `).join('')}<div class="level-card more">...</div></div></div>
                    
                    <div class="challenges-section"><h3><i class="fas fa-trophy"></i> DESAFIOS ATIVOS</h3><div class="challenges-grid">${report.activeChallenges?.slice(0, 4).map(c => `
                        <div class="challenge-card">
                            <div class="challenge-header"><strong>${c.name}</strong><span class="challenge-reward">+${c.reward?.xp || 0} XP</span></div>
                            <div class="challenge-desc">${c.description}</div>
                            <div class="challenge-target">Meta: ${c.target}</div>
                            <div class="challenge-deadline">Termina: ${new Date(c.endDate).toLocaleDateString('pt-PT')}</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="ranking-section"><h3><i class="fas fa-crown"></i> RANKING SAZONAL - ${report.currentSeason?.season || 'Q1_2025'}</h3><div class="ranking-grid">${report.currentSeason?.ranking?.slice(0, 5).map(r => `
                        <div class="ranking-card rank-${r.rank}">
                            <div class="ranking-position">${r.rank}º</div>
                            <div class="ranking-name"><strong>${r.name}</strong></div>
                            <div class="ranking-team">${r.team}</div>
                            <div class="ranking-score">${r.score} pts</div>
                        </div>
                    `).join('')}</div></div>
                    
                    <div class="recommendations-section"><h3><i class="fas fa-clipboard-list"></i> RECOMENDAÇÕES</h3><div class="recommendations-list"><ul>${report.recommendations?.map(r => `<li>${r}</li>`).join('')}</ul></div></div>
                </div>
                <style>
                    .gamification-ext{ padding:0; } .gamification-summary{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; } .level-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px; margin-bottom:24px; } .level-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; text-align:center; } .level-card.level-gold{ border-left:3px solid #ffd700; } .level-card.level-silver{ border-left:3px solid #c0c0c0; } .level-number{ font-size:1.2rem; font-weight:bold; color:var(--elite-primary); } .challenges-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; } .challenge-card{ background:var(--bg-terminal); border-radius:12px; padding:16px; } .challenge-header{ display:flex; justify-content:space-between; margin-bottom:8px; } .challenge-reward{ background:var(--elite-success-dim); padding:2px 8px; border-radius:12px; font-size:0.6rem; } .ranking-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; } .ranking-card{ background:var(--bg-terminal); border-radius:12px; padding:12px; display:flex; align-items:center; gap:12px; } .ranking-card.rank-1{ border-left:3px solid #ffd700; } .ranking-card.rank-2{ border-left:3px solid #c0c0c0; } .ranking-card.rank-3{ border-left:3px solid #cd7f32; } .ranking-position{ font-size:1.2rem; font-weight:bold; min-width:40px; } @media (max-width:768px){ .gamification-summary{ grid-template-columns:1fr 1fr; } }
                </style>
            `;
        } catch (error) {
            console.error('[ELITE] Erro ao renderizar dashboard:', error);
            container.innerHTML = `<div class="alert-item error"><i class="fas fa-exclamation-triangle"></i><div><strong>Erro ao Carregar</strong><p>${error.message}</p></div></div>`;
        }
    }
}

// Instância global
window.GamificationExtensionExtended = new GamificationExtensionExtended(window.GamificationSystem);

console.log('[ELITE] Gamification Extension Extended carregada - Sistema de Níveis e Desafios Ativo');