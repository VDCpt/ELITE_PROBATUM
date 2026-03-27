/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — APLICAÇÃO PRINCIPAL
 * UNIDADE DE COMANDO ESTRATÉGICO
 * ARQUITETURA DE VERDADE
 * ============================================================================
 * VERSÃO FINAL: 2.0.5 - REBRANDING ESTRATÉGICO
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    
    const APP_VERSION = '2.0.5';
    const MASTER_HASH = 'F8A9B2C1D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0';
    
    // =========================================================================
    // SISTEMA DE ARMAZENAMENTO SEGURO
    // =========================================================================
    
    class SecureStorage {
        constructor(masterKey) {
            this.masterKey = masterKey;
            this.encryptionKey = null;
            this.initialized = false;
            this.deriveKey();
        }
        
        deriveKey() {
            try {
                const salt = CryptoJS.enc.Hex.parse(window.ELITE_SESSION_ID || Date.now().toString(36));
                this.encryptionKey = CryptoJS.PBKDF2(this.masterKey, salt, {
                    keySize: 256 / 32,
                    iterations: 100000,
                    hasher: CryptoJS.algo.SHA256
                });
                this.initialized = true;
            } catch (e) {
                console.error('[SecureStorage] Erro na derivação de chave:', e);
                this.encryptionKey = CryptoJS.SHA256(this.masterKey);
                this.initialized = true;
            }
        }
        
        encrypt(data) {
            if (!this.initialized) this.deriveKey();
            try {
                const iv = CryptoJS.lib.WordArray.random(16);
                const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return {
                    ciphertext: encrypted.toString(),
                    iv: iv.toString()
                };
            } catch (e) {
                console.error('[SecureStorage] Erro na encriptação:', e);
                return { ciphertext: JSON.stringify(data), iv: null };
            }
        }
        
        decrypt(encryptedData) {
            if (!this.initialized) this.deriveKey();
            if (!encryptedData || !encryptedData.ciphertext) return null;
            if (!encryptedData.iv) return JSON.parse(encryptedData.ciphertext);
            
            try {
                const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, this.encryptionKey, {
                    iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            } catch (e) {
                console.error('[SecureStorage] Erro na desencriptação:', e);
                return null;
            }
        }
        
        setItem(key, value) {
            try {
                const encrypted = this.encrypt(value);
                localStorage.setItem(`secure_${key}`, JSON.stringify(encrypted));
                return true;
            } catch (e) {
                console.error(`[SecureStorage] Erro ao salvar ${key}:`, e);
                return false;
            }
        }
        
        getItem(key) {
            try {
                const stored = localStorage.getItem(`secure_${key}`);
                if (!stored) return null;
                const encrypted = JSON.parse(stored);
                return this.decrypt(encrypted);
            } catch (e) {
                console.error(`[SecureStorage] Erro ao carregar ${key}:`, e);
                return null;
            }
        }
        
        removeItem(key) {
            localStorage.removeItem(`secure_${key}`);
        }
        
        clear() {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('secure_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }
    
    // =========================================================================
    // SISTEMA DE INTERNACIONALIZAÇÃO (I18N)
    // =========================================================================
    
    const I18N_DICT = {
        pt: {
            login_title: 'ELITE PROBATUM',
            login_subtitle: 'Unidade de Comando Estratégico',
            login_user: 'UTILIZADOR',
            login_password: 'PALAVRA-PASSE',
            login_button: 'AUTENTICAR',
            login_request: 'SOLICITAR ACESSO',
            login_security: 'ENCRIPTADO AES-256 · CANAL SEGURO',
            login_error: 'ACESSO NEGADO — Credenciais inválidas',
            nav_dashboard: 'PAINEL DE COMANDO',
            nav_cases: 'PROCESSOS',
            nav_insolvency: 'INSOLVÊNCIAS (CIRE)',
            nav_labor: 'CONTENCIOSO LABORAL',
            nav_litigation: 'INTELIGÊNCIA DE LITÍGIO',
            nav_questionnaire: 'QUESTIONÁRIOS ESTRATÉGICOS',
            nav_evidence: 'CADEIA DE CUSTÓDIA',
            nav_adversary: 'ANÁLISE DE OPOSIÇÃO',
            nav_simulator: 'SIMULADOR DE RISCO',
            nav_deadlines: 'PRAZOS JUDICIAIS',
            nav_activitylog: 'REGISTOS RGPD',
            nav_truth_architecture: 'ARQUITETURA DE VERDADE',
            nav_value_dashboard: 'GERAÇÃO DE VALOR',
            nav_admin: 'ADMINISTRAÇÃO',
            dashboard_title: 'PAINEL DE COMANDO ESTRATÉGICO',
            dashboard_active_cases: 'PROCESSOS ATIVOS',
            dashboard_dispute_value: 'VALOR EM DISPUTA',
            dashboard_avg_prob: 'PROBABILIDADE MÉDIA',
            dashboard_roi: 'ROI ESTIMADO',
            dashboard_alerts_title: 'ALERTAS DE INTELIGÊNCIA — FEED EM TEMPO REAL',
            filter_all: 'TODOS',
            filter_insolvency: 'INSOLVÊNCIA',
            filter_labor: 'LABORAL',
            filter_civil: 'CÍVEL',
            filter_tax: 'FISCAL',
            filter_commercial: 'COMERCIAL',
            filter_criminal: 'PENAL',
            filter_family: 'FAMÍLIA',
            filter_intellectual: 'P.I.',
            filter_administrative: 'ADMINISTRATIVO',
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'A carregar...',
            error_generic: 'Ocorreu um erro. Tente novamente.',
            success: 'Operação concluída com sucesso.',
            confirm_action: 'Tem certeza que deseja continuar?',
            delete: 'Eliminar',
            confirm_delete: 'Tem certeza que deseja eliminar este processo? Esta ação não pode ser desfeita.'
        },
        en: {
            login_title: 'ELITE PROBATUM',
            login_subtitle: 'Strategic Command Unit',
            login_user: 'USERNAME',
            login_password: 'PASSWORD',
            login_button: 'AUTHENTICATE',
            login_request: 'REQUEST ACCESS',
            login_security: 'AES-256 ENCRYPTED · SECURE CHANNEL',
            login_error: 'ACCESS DENIED — Invalid credentials',
            nav_dashboard: 'COMMAND DASHBOARD',
            nav_cases: 'CASES',
            nav_insolvency: 'INSOLVENCY (CIRE)',
            nav_labor: 'LABOR LITIGATION',
            nav_litigation: 'LITIGATION INTELLIGENCE',
            nav_questionnaire: 'STRATEGIC QUESTIONNAIRES',
            nav_evidence: 'CHAIN OF CUSTODY',
            nav_adversary: 'OPPOSITION ANALYSIS',
            nav_simulator: 'RISK SIMULATOR',
            nav_deadlines: 'COURT DEADLINES',
            nav_activitylog: 'GDPR LOGS',
            nav_truth_architecture: 'TRUTH ARCHITECTURE',
            nav_value_dashboard: 'VALUE GENERATION',
            nav_admin: 'ADMINISTRATION',
            dashboard_title: 'STRATEGIC COMMAND DASHBOARD',
            dashboard_active_cases: 'ACTIVE CASES',
            dashboard_dispute_value: 'DISPUTE VALUE',
            dashboard_avg_prob: 'AVERAGE PROBABILITY',
            dashboard_roi: 'ESTIMATED ROI',
            filter_all: 'ALL',
            filter_insolvency: 'INSOLVENCY',
            filter_labor: 'LABOR',
            filter_civil: 'CIVIL',
            filter_tax: 'TAX',
            filter_commercial: 'COMMERCIAL',
            filter_criminal: 'CRIMINAL',
            filter_family: 'FAMILY',
            filter_intellectual: 'I.P.',
            filter_administrative: 'ADMINISTRATIVE',
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'Loading...',
            error_generic: 'An error occurred. Please try again.',
            success: 'Operation completed successfully.',
            confirm_action: 'Are you sure you want to continue?',
            delete: 'Delete',
            confirm_delete: 'Are you sure you want to delete this case? This action cannot be undone.'
        }
    };
    
    let currentLocale = 'pt';
    let secureStorage = null;
    
    function t(key, params = {}) {
        const dict = I18N_DICT[currentLocale];
        let text = dict[key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
        });
        return text;
    }
    
    function setLocale(locale) {
        if (locale === 'pt' || locale === 'en') {
            currentLocale = locale;
            localStorage.setItem('elite_locale', locale);
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    el.textContent = t(key);
                }
            });
            if (window.EliteProbatum && window.EliteProbatum.currentView) {
                window.EliteProbatum.navigateTo(window.EliteProbatum.currentView);
            }
            const langPT = document.getElementById('langPT');
            const langEN = document.getElementById('langEN');
            if (langPT && langEN) {
                if (locale === 'pt') {
                    langPT.classList.add('active');
                    langEN.classList.remove('active');
                } else {
                    langEN.classList.add('active');
                    langPT.classList.remove('active');
                }
            }
            EliteUtils.showToast(`Idioma alterado para ${locale === 'pt' ? 'Português' : 'English'}`, 'info');
        }
    }
    
    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    
    const EliteUtils = {
        formatCurrency: (value) => new Intl.NumberFormat(currentLocale === 'pt' ? 'pt-PT' : 'en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value || 0),
        formatDate: (date) => moment(date).format(currentLocale === 'pt' ? 'DD/MM/YYYY' : 'YYYY-MM-DD'),
        formatPercentage: (value) => `${(value || 0).toFixed(1)}${t('percent_symbol')}`,
        generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 8),
        generateHash: (content) => CryptoJS.SHA256(content + Date.now().toString()).toString(),
        
        showToast: (message, type = 'info') => {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-triangle', warning: 'fa-exclamation-circle', info: 'fa-info-circle' };
            toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        },
        
        log: (message, level = 'info') => {
            const prefix = '[ELITE PROBATUM]';
            if (level === 'error') console.error(prefix, message);
            else if (level === 'warn') console.warn(prefix, message);
            else console.log(prefix, message);
        },
        
        t: t,
        setLocale: setLocale,
        getLocale: () => currentLocale,
        getSecureStorage: () => secureStorage
    };
    
    // =========================================================================
    // BASE DE DADOS DE PERGUNTAS ESTRATÉGICAS (50 POR ÁREA)
    // =========================================================================
    
    const STRATEGIC_QUESTIONS = {
        insolvency: {
            name: 'Insolvência (CIRE)',
            icon: 'fa-chart-line',
            questions: [
                { id: 'INS_001', text: 'Em que data o devedor deixou de cumprir as obrigações exigíveis?', weight: 0.85, category: 'timing' },
                { id: 'INS_002', text: 'Houve dissipação de património nos 2 anos anteriores à data da declaração de insolvência?', weight: 0.92, category: 'assets' },
                { id: 'INS_003', text: 'O devedor praticou atos de má gestão ou violou deveres legais?', weight: 0.88, category: 'conduct' },
                { id: 'INS_004', text: 'Existem contratos de financiamento com garantias reais constituídas em favor de terceiros?', weight: 0.78, category: 'financing' },
                { id: 'INS_005', text: 'Foram realizadas transmissões de bens a título gratuito nos 2 anos anteriores?', weight: 0.90, category: 'assets' },
                { id: 'INS_006', text: 'O devedor tem registo de execuções fiscais ou cíveis pendentes?', weight: 0.82, category: 'litigation' },
                { id: 'INS_007', text: 'Existem bens penhorados ou arrestados em processos pendentes?', weight: 0.80, category: 'assets' },
                { id: 'INS_008', text: 'O devedor apresentou contas irregulares ou com indícios de falsidade?', weight: 0.87, category: 'conduct' },
                { id: 'INS_009', text: 'Houve preferência de credores nos 6 meses anteriores à insolvência?', weight: 0.85, category: 'conduct' },
                { id: 'INS_010', text: 'O devedor celebrou contratos simulados para ocultar património?', weight: 0.89, category: 'assets' },
                { id: 'INS_011', text: 'Existe administrador de insolvência nomeado?', weight: 0.70, category: 'procedure' },
                { id: 'INS_012', text: 'Foram apresentadas reclamações de créditos?', weight: 0.75, category: 'procedure' },
                { id: 'INS_013', text: 'Existem créditos com garantia real?', weight: 0.78, category: 'creditors' },
                { id: 'INS_014', text: 'O devedor é pessoa singular ou coletiva?', weight: 0.65, category: 'profile' },
                { id: 'INS_015', text: 'Existem créditos laborais em dívida?', weight: 0.80, category: 'creditors' },
                { id: 'INS_016', text: 'O devedor requereu exoneração do passivo restante?', weight: 0.82, category: 'procedure' },
                { id: 'INS_017', text: 'O devedor cumpriu o dever de colaboração com o administrador?', weight: 0.75, category: 'conduct' },
                { id: 'INS_018', text: 'Existem ações de responsabilidade civil contra administradores?', weight: 0.85, category: 'liability' },
                { id: 'INS_019', text: 'Foram detectados indícios de insolvência culposa?', weight: 0.90, category: 'conduct' },
                { id: 'INS_020', text: 'O devedor tem bens no estrangeiro?', weight: 0.72, category: 'assets' },
                { id: 'INS_021', text: 'Existem contratos de locação financeira?', weight: 0.68, category: 'financing' },
                { id: 'INS_022', text: 'O devedor tem acionistas ou sócios com responsabilidade ilimitada?', weight: 0.75, category: 'profile' },
                { id: 'INS_023', text: 'Existem acordos de subordinação de créditos?', weight: 0.70, category: 'creditors' },
                { id: 'INS_024', text: 'Foram impugnadas reclamações de créditos?', weight: 0.73, category: 'procedure' },
                { id: 'INS_025', text: 'Existem bens onerados com reserva de propriedade?', weight: 0.72, category: 'assets' },
                { id: 'INS_026', text: 'O devedor tem contratos de factoring ou cessão de créditos?', weight: 0.68, category: 'financing' },
                { id: 'INS_027', text: 'Houve pagamentos a credores não justificados?', weight: 0.82, category: 'conduct' },
                { id: 'INS_028', text: 'Existem créditos da Autoridade Tributária?', weight: 0.78, category: 'creditors' },
                { id: 'INS_029', text: 'O devedor apresentou o plano de insolvência?', weight: 0.75, category: 'procedure' },
                { id: 'INS_030', text: 'Existem credores que sejam pessoas especialmente relacionadas?', weight: 0.80, category: 'creditors' },
                { id: 'INS_031', text: 'O devedor tem processos de recuperação de empresas em curso?', weight: 0.72, category: 'procedure' },
                { id: 'INS_032', text: 'Foram declarados créditos subordinados?', weight: 0.70, category: 'creditors' },
                { id: 'INS_033', text: 'O devedor tem bens arrendados ou cedidos a terceiros?', weight: 0.68, category: 'assets' },
                { id: 'INS_034', text: 'Existem contratos de seguro com valor de resgate?', weight: 0.65, category: 'assets' },
                { id: 'INS_035', text: 'O devedor tem planos de poupança-reforma?', weight: 0.65, category: 'assets' },
                { id: 'INS_036', text: 'Foram realizadas doações nos últimos 2 anos?', weight: 0.85, category: 'assets' },
                { id: 'INS_037', text: 'O devedor é gerente de outras sociedades?', weight: 0.70, category: 'profile' },
                { id: 'INS_038', text: 'Existem bens em comunhão conjugal?', weight: 0.75, category: 'assets' },
                { id: 'INS_039', text: 'O cônjuge é sócio ou gerente?', weight: 0.72, category: 'profile' },
                { id: 'INS_040', text: 'Foram realizadas partilhas de bens recentemente?', weight: 0.78, category: 'assets' },
                { id: 'INS_041', text: 'O devedor tem direito a indemnizações?', weight: 0.68, category: 'assets' },
                { id: 'INS_042', text: 'Existem ações judiciais contra o devedor?', weight: 0.80, category: 'litigation' },
                { id: 'INS_043', text: 'O devedor tem penhoras sobre salário ou rendimentos?', weight: 0.75, category: 'assets' },
                { id: 'INS_044', text: 'Existem bens de difícil alienação?', weight: 0.70, category: 'assets' },
                { id: 'INS_045', text: 'O devedor tem créditos sobre terceiros?', weight: 0.72, category: 'assets' },
                { id: 'INS_046', text: 'Foram emitidas certidões de dívida?', weight: 0.68, category: 'procedure' },
                { id: 'INS_047', text: 'O devedor tem registo de insolvência anterior?', weight: 0.75, category: 'history' },
                { id: 'INS_048', text: 'Existem garantias pessoais prestadas pelo devedor?', weight: 0.78, category: 'liability' },
                { id: 'INS_049', text: 'O devedor tem contas bancárias no estrangeiro?', weight: 0.72, category: 'assets' },
                { id: 'INS_050', text: 'Foram declarados créditos fiscais ou contributivos?', weight: 0.80, category: 'creditors' }
            ]
        },
        labor: {
            name: 'Direito do Trabalho',
            icon: 'fa-briefcase',
            questions: [
                { id: 'LAB_001', text: 'Qual a data de início do contrato de trabalho?', weight: 0.85, category: 'timing' },
                { id: 'LAB_002', text: 'O trabalhador tinha vínculo efetivo ou era prestador de serviços?', weight: 0.90, category: 'contract' },
                { id: 'LAB_003', text: 'Existia contrato de trabalho escrito?', weight: 0.75, category: 'contract' },
                { id: 'LAB_004', text: 'O trabalhador tinha horário de trabalho definido?', weight: 0.80, category: 'conditions' },
                { id: 'LAB_005', text: 'Recebia ordens ou instruções do empregador?', weight: 0.85, category: 'subordination' },
                { id: 'LAB_006', text: 'O trabalhador tinha assiduidade e obrigação de comparência?', weight: 0.82, category: 'subordination' },
                { id: 'LAB_007', text: 'Os instrumentos de trabalho eram fornecidos pelo empregador?', weight: 0.78, category: 'conditions' },
                { id: 'LAB_008', text: 'Existia retribuição mensal fixa?', weight: 0.80, category: 'compensation' },
                { id: 'LAB_009', text: 'Foram pagos subsídios de férias e Natal?', weight: 0.75, category: 'compensation' },
                { id: 'LAB_010', text: 'O trabalhador gozou férias regularmente?', weight: 0.70, category: 'conditions' },
                { id: 'LAB_011', text: 'Houve despedimento? Em que data?', weight: 0.88, category: 'termination' },
                { id: 'LAB_012', text: 'O despedimento foi por iniciativa do empregador ou do trabalhador?', weight: 0.85, category: 'termination' },
                { id: 'LAB_013', text: 'Houve procedimento disciplinar prévio?', weight: 0.82, category: 'procedure' },
                { id: 'LAB_014', text: 'O trabalhador foi notificado da nota de culpa?', weight: 0.80, category: 'procedure' },
                { id: 'LAB_015', text: 'Existiam testemunhas do despedimento?', weight: 0.75, category: 'evidence' },
                { id: 'LAB_016', text: 'O trabalhador era representante sindical?', weight: 0.72, category: 'profile' },
                { id: 'LAB_017', text: 'Houve tentativa de conciliação na ACT?', weight: 0.70, category: 'procedure' },
                { id: 'LAB_018', text: 'O trabalhador tem mais de 5 anos de antiguidade?', weight: 0.78, category: 'timing' },
                { id: 'LAB_019', text: 'O trabalhador tem mais de 50 anos?', weight: 0.65, category: 'profile' },
                { id: 'LAB_020', text: 'Existiam faltas injustificadas?', weight: 0.72, category: 'conduct' },
                { id: 'LAB_021', text: 'Houve acidente de trabalho?', weight: 0.80, category: 'health' },
                { id: 'LAB_022', text: 'O trabalhador sofreu assédio moral?', weight: 0.85, category: 'conduct' },
                { id: 'LAB_023', text: 'O trabalhador exercia funções de confiança?', weight: 0.70, category: 'profile' },
                { id: 'LAB_024', text: 'Existiam horas extraordinárias não pagas?', weight: 0.82, category: 'compensation' },
                { id: 'LAB_025', text: 'O trabalhador usava viatura própria para serviço?', weight: 0.68, category: 'conditions' },
                { id: 'LAB_026', text: 'Existiam ajudas de custo pagas?', weight: 0.70, category: 'compensation' },
                { id: 'LAB_027', text: 'O trabalhador tinha cartão de refeição?', weight: 0.65, category: 'compensation' },
                { id: 'LAB_028', text: 'Houve alteração unilateral das funções?', weight: 0.78, category: 'conditions' },
                { id: 'LAB_029', text: 'O trabalhador foi transferido para outra localidade?', weight: 0.75, category: 'conditions' },
                { id: 'LAB_030', text: 'Existia regime de isenção de horário?', weight: 0.72, category: 'conditions' },
                { id: 'LAB_031', text: 'O trabalhador estava em lay-off?', weight: 0.80, category: 'suspension' },
                { id: 'LAB_032', text: 'Houve redução de salário?', weight: 0.78, category: 'compensation' },
                { id: 'LAB_033', text: 'O empregador suspendeu o contrato?', weight: 0.75, category: 'suspension' },
                { id: 'LAB_034', text: 'Existiam condições de trabalho perigosas?', weight: 0.82, category: 'health' },
                { id: 'LAB_035', text: 'O trabalhador denunciou a situação à ACT?', weight: 0.70, category: 'procedure' },
                { id: 'LAB_036', text: 'Existem recibos de vencimento?', weight: 0.85, category: 'evidence' },
                { id: 'LAB_037', text: 'Existem extratos bancários com pagamentos?', weight: 0.88, category: 'evidence' },
                { id: 'LAB_038', text: 'Existem mensagens ou emails trocados?', weight: 0.80, category: 'evidence' },
                { id: 'LAB_039', text: 'Existem testemunhas presenciais?', weight: 0.82, category: 'evidence' },
                { id: 'LAB_040', text: 'O trabalhador apresentou queixa na ACT?', weight: 0.75, category: 'procedure' },
                { id: 'LAB_041', text: 'Houve ação inspetiva da ACT?', weight: 0.78, category: 'procedure' },
                { id: 'LAB_042', text: 'O empregador tem processo contraordenacional?', weight: 0.72, category: 'history' },
                { id: 'LAB_043', text: 'O empregador tem histórico de despedimentos?', weight: 0.70, category: 'history' },
                { id: 'LAB_044', text: 'O trabalhador é membro de sindicato?', weight: 0.68, category: 'profile' },
                { id: 'LAB_045', text: 'Houve greve no setor recentemente?', weight: 0.65, category: 'context' },
                { id: 'LAB_046', text: 'Existe acordo coletivo de trabalho aplicável?', weight: 0.75, category: 'regulation' },
                { id: 'LAB_047', text: 'O empregador está em processo de insolvência?', weight: 0.82, category: 'context' },
                { id: 'LAB_048', text: 'O Fundo de Garantia Salarial foi acionado?', weight: 0.78, category: 'procedure' },
                { id: 'LAB_049', text: 'Foram pagos créditos pelo FGS?', weight: 0.75, category: 'compensation' },
                { id: 'LAB_050', text: 'O trabalhador tem outros processos laborais?', weight: 0.70, category: 'history' }
            ]
        },
        tax: {
            name: 'Direito Fiscal',
            icon: 'fa-calculator',
            questions: [
                { id: 'TAX_001', text: 'Em que período ocorreram os factos tributários?', weight: 0.85, category: 'timing' },
                { id: 'TAX_002', text: 'Houve notificação da Autoridade Tributária?', weight: 0.90, category: 'procedure' },
                { id: 'TAX_003', text: 'Qual o imposto em causa (IRS, IRC, IVA, IMT, IUC)?', weight: 0.82, category: 'type' },
                { id: 'TAX_004', text: 'Qual o montante em disputa?', weight: 0.88, category: 'value' },
                { id: 'TAX_005', text: 'Existem juros de mora associados?', weight: 0.75, category: 'value' },
                { id: 'TAX_006', text: 'O sujeito passivo apresentou reclamação graciosa?', weight: 0.80, category: 'procedure' },
                { id: 'TAX_007', text: 'Houve recurso hierárquico?', weight: 0.78, category: 'procedure' },
                { id: 'TAX_008', text: 'O processo está em impugnação judicial?', weight: 0.85, category: 'procedure' },
                { id: 'TAX_009', text: 'Existe processo de execução fiscal?', weight: 0.82, category: 'procedure' },
                { id: 'TAX_010', text: 'Houve penhora de bens?', weight: 0.80, category: 'procedure' },
                { id: 'TAX_011', text: 'O contribuinte tem registo de incumprimento?', weight: 0.75, category: 'history' },
                { id: 'TAX_012', text: 'Foram apresentados meios de prova documental?', weight: 0.88, category: 'evidence' },
                { id: 'TAX_013', text: 'Existem faturas ou recibos emitidos?', weight: 0.85, category: 'evidence' },
                { id: 'TAX_014', text: 'Existem extratos bancários?', weight: 0.82, category: 'evidence' },
                { id: 'TAX_015', text: 'A AT utilizou métodos indiretos?', weight: 0.78, category: 'method' },
                { id: 'TAX_016', text: 'Houve prescrição do direito à liquidação?', weight: 0.85, category: 'timing' },
                { id: 'TAX_017', text: 'O sujeito passivo requereu caducidade?', weight: 0.80, category: 'procedure' },
                { id: 'TAX_018', text: 'Existem acórdãos do STA sobre a matéria?', weight: 0.75, category: 'jurisprudence' },
                { id: 'TAX_019', text: 'O caso tem paralelo com decisão do CAAD?', weight: 0.72, category: 'jurisprudence' },
                { id: 'TAX_020', text: 'Houve violação do princípio da proporcionalidade?', weight: 0.70, category: 'principle' },
                { id: 'TAX_021', text: 'A AT violou o segredo bancário?', weight: 0.68, category: 'procedure' },
                { id: 'TAX_022', text: 'O sujeito passivo é microempresa?', weight: 0.65, category: 'profile' },
                { id: 'TAX_023', text: 'O sujeito passivo tem regime de contabilidade organizada?', weight: 0.72, category: 'profile' },
                { id: 'TAX_024', text: 'Houve inspeção tributária?', weight: 0.85, category: 'procedure' },
                { id: 'TAX_025', text: 'O relatório de inspeção foi contestado?', weight: 0.82, category: 'procedure' },
                { id: 'TAX_026', text: 'Foram solicitadas diligências complementares?', weight: 0.75, category: 'procedure' },
                { id: 'TAX_027', text: 'O sujeito passivo apresentou elementos de prova?', weight: 0.88, category: 'evidence' },
                { id: 'TAX_028', text: 'Existem divergências entre faturação e declarações?', weight: 0.90, category: 'discrepancy' },
                { id: 'TAX_029', text: 'Houve omissão de rendimentos?', weight: 0.92, category: 'discrepancy' },
                { id: 'TAX_030', text: 'Existem gastos não comprovados?', weight: 0.85, category: 'discrepancy' },
                { id: 'TAX_031', text: 'O sujeito passivo deduziu IVA indevido?', weight: 0.80, category: 'discrepancy' },
                { id: 'TAX_032', text: 'Houve preço de transferência?', weight: 0.78, category: 'discrepancy' },
                { id: 'TAX_033', text: 'O sujeito passivo tem operações com paraísos fiscais?', weight: 0.75, category: 'context' },
                { id: 'TAX_034', text: 'Existem contas bancárias não declaradas?', weight: 0.88, category: 'assets' },
                { id: 'TAX_035', text: 'O sujeito passivo tem bens no estrangeiro?', weight: 0.82, category: 'assets' },
                { id: 'TAX_036', text: 'Foram entregues declarações Modelo 22?', weight: 0.78, category: 'procedure' },
                { id: 'TAX_037', text: 'Existem declarações de IRS entregues?', weight: 0.80, category: 'procedure' },
                { id: 'TAX_038', text: 'As declarações foram entregues dentro do prazo?', weight: 0.75, category: 'timing' },
                { id: 'TAX_039', text: 'O sujeito passivo tem dívidas fiscais?', weight: 0.85, category: 'history' },
                { id: 'TAX_040', text: 'Existem certidões de dívida?', weight: 0.82, category: 'evidence' },
                { id: 'TAX_041', text: 'O sujeito passivo solicitou parcelamento?', weight: 0.70, category: 'procedure' },
                { id: 'TAX_042', text: 'Houve suspensão da execução fiscal?', weight: 0.75, category: 'procedure' },
                { id: 'TAX_043', text: 'O sujeito passivo apresentou garantia?', weight: 0.72, category: 'procedure' },
                { id: 'TAX_044', text: 'Existem testemunhas do facto tributário?', weight: 0.68, category: 'evidence' },
                { id: 'TAX_045', text: 'O sujeito passivo tem outros processos fiscais?', weight: 0.70, category: 'history' },
                { id: 'TAX_046', text: 'A AT já decidiu casos similares?', weight: 0.75, category: 'jurisprudence' },
                { id: 'TAX_047', text: 'O STA já se pronunciou sobre a matéria?', weight: 0.80, category: 'jurisprudence' },
                { id: 'TAX_048', text: 'Existe jurisprudência favorável?', weight: 0.85, category: 'jurisprudence' },
                { id: 'TAX_049', text: 'O sujeito passivo tem recursos em andamento?', weight: 0.72, category: 'procedure' },
                { id: 'TAX_050', text: 'O sujeito passivo está em processo de insolvência?', weight: 0.78, category: 'context' }
            ]
        },
        civil: {
            name: 'Direito Civil',
            icon: 'fa-gavel',
            questions: [
                { id: 'CIV_001', text: 'Qual a data dos factos que fundamentam a pretensão?', weight: 0.85, category: 'timing' },
                { id: 'CIV_002', text: 'Existe contrato escrito?', weight: 0.90, category: 'contract' },
                { id: 'CIV_003', text: 'As partes cumpriram as obrigações contratuais?', weight: 0.88, category: 'performance' },
                { id: 'CIV_004', text: 'Houve incumprimento? De que natureza?', weight: 0.92, category: 'performance' },
                { id: 'CIV_005', text: 'Existem testemunhas do negócio jurídico?', weight: 0.78, category: 'evidence' },
                { id: 'CIV_006', text: 'Houve dolo ou má-fé?', weight: 0.85, category: 'conduct' },
                { id: 'CIV_007', text: 'O negócio foi simulado?', weight: 0.82, category: 'conduct' },
                { id: 'CIV_008', text: 'Existe vício de consentimento?', weight: 0.80, category: 'consent' },
                { id: 'CIV_009', text: 'A parte estava sob coação ou erro?', weight: 0.78, category: 'consent' },
                { id: 'CIV_010', text: 'Existe documento comprovativo do pagamento?', weight: 0.88, category: 'evidence' },
                { id: 'CIV_011', text: 'Houve prescrição do direito?', weight: 0.85, category: 'timing' },
                { id: 'CIV_012', text: 'O prazo de caducidade foi observado?', weight: 0.82, category: 'timing' },
                { id: 'CIV_013', text: 'A parte contrária reconheceu o direito?', weight: 0.75, category: 'conduct' },
                { id: 'CIV_014', text: 'Existe confissão de dívida?', weight: 0.80, category: 'evidence' },
                { id: 'CIV_015', text: 'As partes tentaram conciliação?', weight: 0.70, category: 'procedure' },
                { id: 'CIV_016', text: 'Existe medição ou arbitragem?', weight: 0.72, category: 'procedure' },
                { id: 'CIV_017', text: 'O valor da causa está definido?', weight: 0.78, category: 'value' },
                { id: 'CIV_018', text: 'Existem danos materiais comprovados?', weight: 0.85, category: 'damages' },
                { id: 'CIV_019', text: 'Existem danos morais?', weight: 0.82, category: 'damages' },
                { id: 'CIV_020', text: 'O dano é atual ou futuro?', weight: 0.75, category: 'damages' },
                { id: 'CIV_021', text: 'Existe nexo de causalidade?', weight: 0.88, category: 'causality' },
                { id: 'CIV_022', text: 'A parte contrária tem responsabilidade civil?', weight: 0.85, category: 'liability' },
                { id: 'CIV_023', text: 'Existem seguros aplicáveis?', weight: 0.70, category: 'insurance' },
                { id: 'CIV_024', text: 'O sinistro foi participado à seguradora?', weight: 0.72, category: 'procedure' },
                { id: 'CIV_025', text: 'Existe peritagem realizada?', weight: 0.80, category: 'evidence' },
                { id: 'CIV_026', text: 'O perito tem credenciais?', weight: 0.75, category: 'evidence' },
                { id: 'CIV_027', text: 'As partes têm capacidade jurídica?', weight: 0.78, category: 'capacity' },
                { id: 'CIV_028', text: 'O representante tem poderes?', weight: 0.82, category: 'capacity' },
                { id: 'CIV_029', text: 'Existe litispendência?', weight: 0.70, category: 'procedure' },
                { id: 'CIV_030', text: 'O tribunal tem competência?', weight: 0.75, category: 'jurisdiction' },
                { id: 'CIV_031', text: 'Existe caso julgado?', weight: 0.72, category: 'procedure' },
                { id: 'CIV_032', text: 'As partes escolheram foro?', weight: 0.68, category: 'contract' },
                { id: 'CIV_033', text: 'Existem factos notórios?', weight: 0.70, category: 'evidence' },
                { id: 'CIV_034', text: 'Existem presunções legais?', weight: 0.75, category: 'evidence' },
                { id: 'CIV_035', text: 'O juiz pode usar equidade?', weight: 0.65, category: 'principle' },
                { id: 'CIV_036', text: 'A parte contrária é solvente?', weight: 0.80, category: 'context' },
                { id: 'CIV_037', text: 'Existem bens penhoráveis?', weight: 0.78, category: 'context' },
                { id: 'CIV_038', text: 'A parte contrária tem outros processos?', weight: 0.72, category: 'context' },
                { id: 'CIV_039', text: 'Houve tentativa de cobrança amigável?', weight: 0.70, category: 'procedure' },
                { id: 'CIV_040', text: 'Existem emails ou mensagens trocadas?', weight: 0.85, category: 'evidence' },
                { id: 'CIV_041', text: 'As partes têm relação prévia?', weight: 0.75, category: 'context' },
                { id: 'CIV_042', text: 'Existem contratos anteriores?', weight: 0.78, category: 'contract' },
                { id: 'CIV_043', text: 'Houve novação ou transação?', weight: 0.72, category: 'contract' },
                { id: 'CIV_044', text: 'Existe fiança ou aval?', weight: 0.70, category: 'guarantee' },
                { id: 'CIV_045', text: 'O fiador foi notificado?', weight: 0.68, category: 'procedure' },
                { id: 'CIV_046', text: 'Existem bens comuns do casal?', weight: 0.75, category: 'assets' },
                { id: 'CIV_047', text: 'O regime de bens é conhecido?', weight: 0.72, category: 'context' },
                { id: 'CIV_048', text: 'Existem herdeiros legitimários?', weight: 0.78, category: 'succession' },
                { id: 'CIV_049', text: 'Foi feito inventário?', weight: 0.75, category: 'procedure' },
                { id: 'CIV_050', text: 'O testamento é válido?', weight: 0.80, category: 'succession' }
            ]
        },
        commercial: {
            name: 'Direito Comercial',
            icon: 'fa-building',
            questions: [
                { id: 'COM_001', text: 'A sociedade está legalmente constituída?', weight: 0.90, category: 'formation' },
                { id: 'COM_002', text: 'O contrato social está registado?', weight: 0.88, category: 'formation' },
                { id: 'COM_003', text: 'Os sócios têm responsabilidade limitada?', weight: 0.85, category: 'liability' },
                { id: 'COM_004', text: 'O capital social foi integralizado?', weight: 0.82, category: 'capital' },
                { id: 'COM_005', text: 'Existem entradas em espécie avaliadas?', weight: 0.75, category: 'capital' },
                { id: 'COM_006', text: 'Os administradores têm poderes?', weight: 0.85, category: 'governance' },
                { id: 'COM_007', text: 'Houve violação de deveres de administrador?', weight: 0.88, category: 'governance' },
                { id: 'COM_008', text: 'Existem contratos com partes relacionadas?', weight: 0.80, category: 'transactions' },
                { id: 'COM_009', text: 'As deliberações sociais foram válidas?', weight: 0.82, category: 'governance' },
                { id: 'COM_010', text: 'Houve abuso de direito de voto?', weight: 0.78, category: 'governance' },
                { id: 'COM_011', text: 'A sociedade tem registo comercial atualizado?', weight: 0.85, category: 'registry' },
                { id: 'COM_012', text: 'Existem dívidas da sociedade?', weight: 0.88, category: 'liabilities' },
                { id: 'COM_013', text: 'Os credores estão identificados?', weight: 0.82, category: 'liabilities' },
                { id: 'COM_014', text: 'Existem garantias prestadas?', weight: 0.80, category: 'liabilities' },
                { id: 'COM_015', text: 'A sociedade tem contas aprovadas?', weight: 0.85, category: 'accounts' },
                { id: 'COM_016', text: 'As contas mostram situação líquida positiva?', weight: 0.88, category: 'accounts' },
                { id: 'COM_017', text: 'Houve distribuição de dividendos ilícitos?', weight: 0.82, category: 'accounts' },
                { id: 'COM_018', text: 'A sociedade está em situação de insolvência?', weight: 0.90, category: 'insolvency' },
                { id: 'COM_019', text: 'Foram celebrados contratos de gestão?', weight: 0.75, category: 'management' },
                { id: 'COM_020', text: 'Existem acordos parassociais?', weight: 0.72, category: 'agreements' },
                { id: 'COM_021', text: 'Os sócios têm direito de preferência?', weight: 0.78, category: 'rights' },
                { id: 'COM_022', text: 'Houve alteração do contrato social?', weight: 0.80, category: 'formation' },
                { id: 'COM_023', text: 'Aumento de capital foi realizado?', weight: 0.82, category: 'capital' },
                { id: 'COM_024', text: 'Redução de capital foi deliberada?', weight: 0.78, category: 'capital' },
                { id: 'COM_025', text: 'Existem ações próprias?', weight: 0.75, category: 'capital' },
                { id: 'COM_026', text: 'Os títulos foram emitidos?', weight: 0.70, category: 'securities' },
                { id: 'COM_027', text: 'Existem obrigacionistas?', weight: 0.72, category: 'securities' },
                { id: 'COM_028', text: 'A sociedade tem sede em Portugal?', weight: 0.85, category: 'jurisdiction' },
                { id: 'COM_029', text: 'Existem estabelecimentos estáveis?', weight: 0.80, category: 'establishment' },
                { id: 'COM_030', text: 'A sociedade tem atividade real?', weight: 0.82, category: 'activity' },
                { id: 'COM_031', text: 'A sociedade tem trabalhadores?', weight: 0.78, category: 'activity' },
                { id: 'COM_032', text: 'Existem contratos de trabalho?', weight: 0.75, category: 'activity' },
                { id: 'COM_033', text: 'A sociedade tem seguros?', weight: 0.70, category: 'insurance' },
                { id: 'COM_034', text: 'Existem licenças ou autorizações?', weight: 0.72, category: 'regulation' },
                { id: 'COM_035', text: 'A sociedade cumpre normas setoriais?', weight: 0.75, category: 'regulation' },
                { id: 'COM_036', text: 'Existem processos judiciais?', weight: 0.85, category: 'litigation' },
                { id: 'COM_037', text: 'A sociedade é parte em arbitragem?', weight: 0.78, category: 'litigation' },
                { id: 'COM_038', text: 'Existem penhoras sobre bens?', weight: 0.82, category: 'enforcement' },
                { id: 'COM_039', text: 'A sociedade tem dívidas fiscais?', weight: 0.85, category: 'tax' },
                { id: 'COM_040', text: 'Existem processos de execução fiscal?', weight: 0.80, category: 'tax' },
                { id: 'COM_041', text: 'Os sócios responderam por dívidas?', weight: 0.75, category: 'liability' },
                { id: 'COM_042', text: 'Houve desconsideração da personalidade jurídica?', weight: 0.78, category: 'liability' },
                { id: 'COM_043', text: 'Existem grupos de sociedades?', weight: 0.72, category: 'group' },
                { id: 'COM_044', text: 'Há relações de domínio?', weight: 0.70, category: 'group' },
                { id: 'COM_045', text: 'A sociedade tem participações noutras?', weight: 0.75, category: 'group' },
                { id: 'COM_046', text: 'Existem contratos de franchising?', weight: 0.68, category: 'contracts' },
                { id: 'COM_047', text: 'Existem contratos de agência?', weight: 0.70, category: 'contracts' },
                { id: 'COM_048', text: 'O agente tem exclusividade?', weight: 0.65, category: 'contracts' },
                { id: 'COM_049', text: 'Houve cessação do contrato de agência?', weight: 0.72, category: 'contracts' },
                { id: 'COM_050', text: 'Existe direito a indemnização?', weight: 0.75, category: 'damages' }
            ]
        },
        criminal: {
            name: 'Direito Penal',
            icon: 'fa-gavel',
            questions: [
                { id: 'CRIM_001', text: 'Qual a data dos factos imputados?', weight: 0.85, category: 'timing' },
                { id: 'CRIM_002', text: 'O arguido foi identificado?', weight: 0.90, category: 'identity' },
                { id: 'CRIM_003', text: 'O arguido tem antecedentes criminais?', weight: 0.82, category: 'history' },
                { id: 'CRIM_004', text: 'O crime está previsto em que artigo?', weight: 0.88, category: 'typification' },
                { id: 'CRIM_005', text: 'A pena é de prisão ou multa?', weight: 0.80, category: 'penalty' },
                { id: 'CRIM_006', text: 'Houve dolo ou negligência?', weight: 0.85, category: 'culpability' },
                { id: 'CRIM_007', text: 'O arguido confessou os factos?', weight: 0.78, category: 'confession' },
                { id: 'CRIM_008', text: 'Existem testemunhas presenciais?', weight: 0.88, category: 'evidence' },
                { id: 'CRIM_009', text: 'Existem provas documentais?', weight: 0.85, category: 'evidence' },
                { id: 'CRIM_010', text: 'Existem provas periciais?', weight: 0.82, category: 'evidence' },
                { id: 'CRIM_011', text: 'Existem provas digitais?', weight: 0.80, category: 'evidence' },
                { id: 'CRIM_012', text: 'A cadeia de custódia foi respeitada?', weight: 0.92, category: 'evidence' },
                { id: 'CRIM_013', text: 'O arguido foi constituído arguido?', weight: 0.85, category: 'procedure' },
                { id: 'CRIM_014', text: 'Houve interrogatório judicial?', weight: 0.80, category: 'procedure' },
                { id: 'CRIM_015', text: 'O arguido está em prisão preventiva?', weight: 0.75, category: 'coercion' },
                { id: 'CRIM_016', text: 'Foram aplicadas outras medidas de coação?', weight: 0.72, category: 'coercion' },
                { id: 'CRIM_017', text: 'O processo está em fase de inquérito?', weight: 0.78, category: 'phase' },
                { id: 'CRIM_018', text: 'Houve dedução de acusação?', weight: 0.82, category: 'phase' },
                { id: 'CRIM_019', text: 'O MP deduziu acusação?', weight: 0.80, category: 'phase' },
                { id: 'CRIM_020', text: 'O arguido apresentou contestação?', weight: 0.75, category: 'phase' },
                { id: 'CRIM_021', text: 'Houve instrução?', weight: 0.70, category: 'phase' },
                { id: 'CRIM_022', text: 'O processo foi a julgamento?', weight: 0.78, category: 'phase' },
                { id: 'CRIM_023', text: 'Houve recurso?', weight: 0.72, category: 'appeal' },
                { id: 'CRIM_024', text: 'O crime é público, semi-público ou particular?', weight: 0.75, category: 'nature' },
                { id: 'CRIM_025', text: 'Houve queixa apresentada?', weight: 0.80, category: 'complaint' },
                { id: 'CRIM_026', text: 'O ofendido constituiu assistente?', weight: 0.72, category: 'victim' },
                { id: 'CRIM_027', text: 'Houve pedido de indemnização civil?', weight: 0.70, category: 'damages' },
                { id: 'CRIM_028', text: 'O arguido tem meios económicos?', weight: 0.68, category: 'profile' },
                { id: 'CRIM_029', text: 'Houve apreensão de bens?', weight: 0.75, category: 'assets' },
                { id: 'CRIM_030', text: 'Existem bens a perder a favor do Estado?', weight: 0.72, category: 'assets' },
                { id: 'CRIM_031', text: 'O arguido é reincidente?', weight: 0.80, category: 'history' },
                { id: 'CRIM_032', text: 'O crime é de menor gravidade?', weight: 0.78, category: 'severity' },
                { id: 'CRIM_033', text: 'O arguido mostrou arrependimento?', weight: 0.75, category: 'conduct' },
                { id: 'CRIM_034', text: 'Houve reparação do dano?', weight: 0.82, category: 'conduct' },
                { id: 'CRIM_035', text: 'O arguido colaborou com a justiça?', weight: 0.80, category: 'conduct' },
                { id: 'CRIM_036', text: 'Existem atenuantes?', weight: 0.85, category: 'circumstances' },
                { id: 'CRIM_037', text: 'Existem agravantes?', weight: 0.88, category: 'circumstances' },
                { id: 'CRIM_038', text: 'O crime foi cometido em grupo?', weight: 0.78, category: 'circumstances' },
                { id: 'CRIM_039', text: 'Houve uso de arma?', weight: 0.75, category: 'circumstances' },
                { id: 'CRIM_040', text: 'A vítima é especialmente vulnerável?', weight: 0.80, category: 'victim' },
                { id: 'CRIM_041', text: 'O arguido tinha relação com a vítima?', weight: 0.72, category: 'relationship' },
                { id: 'CRIM_042', text: 'Houve violência doméstica?', weight: 0.85, category: 'type' },
                { id: 'CRIM_043', text: 'O crime foi cometido por funcionário público?', weight: 0.78, category: 'perpetrator' },
                { id: 'CRIM_044', text: 'O arguido foi detido em flagrante?', weight: 0.75, category: 'arrest' },
                { id: 'CRIM_045', text: 'Houve busca e apreensão?', weight: 0.80, category: 'procedure' },
                { id: 'CRIM_046', text: 'As escutas telefónicas foram autorizadas?', weight: 0.85, category: 'evidence' },
                { id: 'CRIM_047', text: 'Existem provas obtidas ilegalmente?', weight: 0.90, category: 'evidence' },
                { id: 'CRIM_048', text: 'O arguido está representado por defensor?', weight: 0.82, category: 'defense' },
                { id: 'CRIM_049', text: 'O arguido teve apoio judiciário?', weight: 0.70, category: 'defense' },
                { id: 'CRIM_050', text: 'O processo ultrapassou os prazos legais?', weight: 0.75, category: 'timing' }
            ]
        },
        family: {
            name: 'Direito da Família',
            icon: 'fa-heart',
            questions: [
                { id: 'FAM_001', text: 'Qual a data do casamento?', weight: 0.85, category: 'timing' },
                { id: 'FAM_002', text: 'Qual o regime de bens do casamento?', weight: 0.90, category: 'property' },
                { id: 'FAM_003', text: 'Existem filhos menores?', weight: 0.92, category: 'children' },
                { id: 'FAM_004', text: 'Quantos filhos? Quais as idades?', weight: 0.88, category: 'children' },
                { id: 'FAM_005', text: 'O casal vive em união de facto?', weight: 0.80, category: 'relationship' },
                { id: 'FAM_006', text: 'Há quanto tempo vivem juntos?', weight: 0.82, category: 'timing' },
                { id: 'FAM_007', text: 'Existe acordo de regulação das responsabilidades parentais?', weight: 0.85, category: 'children' },
                { id: 'FAM_008', text: 'As crianças estão bem adaptadas?', weight: 0.78, category: 'children' },
                { id: 'FAM_009', text: 'Qual a situação escolar dos filhos?', weight: 0.75, category: 'children' },
                { id: 'FAM_010', text: 'Existem problemas de saúde dos filhos?', weight: 0.80, category: 'children' },
                { id: 'FAM_011', text: 'O progenitor incumpre obrigações?', weight: 0.88, category: 'conduct' },
                { id: 'FAM_012', text: 'A pensão de alimentos está definida?', weight: 0.85, category: 'support' },
                { id: 'FAM_013', text: 'A pensão é paga regularmente?', weight: 0.82, category: 'support' },
                { id: 'FAM_014', text: 'Existem incumprimentos de pensão?', weight: 0.80, category: 'support' },
                { id: 'FAM_015', text: 'Houve violência doméstica?', weight: 0.90, category: 'violence' },
                { id: 'FAM_016', text: 'Existem queixas na CPCJ?', weight: 0.85, category: 'violence' },
                { id: 'FAM_017', text: 'Houve interdição de contactos?', weight: 0.78, category: 'children' },
                { id: 'FAM_018', text: 'O regime de visitas está definido?', weight: 0.82, category: 'children' },
                { id: 'FAM_019', text: 'Existem bens comuns do casal?', weight: 0.88, category: 'property' },
                { id: 'FAM_020', text: 'Qual o valor dos bens comuns?', weight: 0.85, category: 'property' },
                { id: 'FAM_021', text: 'Existem bens próprios de cada cônjuge?', weight: 0.80, category: 'property' },
                { id: 'FAM_022', text: 'Existem dívidas comuns?', weight: 0.82, category: 'property' },
                { id: 'FAM_023', text: 'A casa de morada de família é própria ou arrendada?', weight: 0.85, category: 'property' },
                { id: 'FAM_024', text: 'Quem ficará com a casa?', weight: 0.88, category: 'property' },
                { id: 'FAM_025', text: 'Existem contas bancárias conjuntas?', weight: 0.78, category: 'property' },
                { id: 'FAM_026', text: 'Existem seguros de vida?', weight: 0.75, category: 'property' },
                { id: 'FAM_027', text: 'Existem planos de poupança-reforma?', weight: 0.72, category: 'property' },
                { id: 'FAM_028', text: 'O divórcio é por mútuo consentimento?', weight: 0.85, category: 'divorce' },
                { id: 'FAM_029', text: 'O divórcio é litigioso?', weight: 0.88, category: 'divorce' },
                { id: 'FAM_030', text: 'Qual a causa do divórcio?', weight: 0.82, category: 'divorce' },
                { id: 'FAM_031', text: 'Houve cessação da coabitação?', weight: 0.80, category: 'divorce' },
                { id: 'FAM_032', text: 'Data da separação de facto?', weight: 0.78, category: 'timing' },
                { id: 'FAM_033', text: 'Existem testemunhas da separação?', weight: 0.75, category: 'evidence' },
                { id: 'FAM_034', text: 'O cônjuge pede alimentos?', weight: 0.85, category: 'support' },
                { id: 'FAM_035', text: 'O cônjuge tem capacidade para trabalhar?', weight: 0.80, category: 'support' },
                { id: 'FAM_036', text: 'Existem necessidades especiais?', weight: 0.78, category: 'support' },
                { id: 'FAM_037', text: 'O cônjuge contribuiu para a economia familiar?', weight: 0.82, category: 'support' },
                { id: 'FAM_038', text: 'Existem testamentos?', weight: 0.70, category: 'succession' },
                { id: 'FAM_039', text: 'Existem herdeiros legitimários?', weight: 0.75, category: 'succession' },
                { id: 'FAM_040', text: 'Houve partilha de herança?', weight: 0.72, category: 'succession' },
                { id: 'FAM_041', text: 'Existem doações em vida?', weight: 0.78, category: 'property' },
                { id: 'FAM_042', text: 'As doações são colacionáveis?', weight: 0.75, category: 'property' },
                { id: 'FAM_043', text: 'Existem contratos antenupciais?', weight: 0.70, category: 'contract' },
                { id: 'FAM_044', text: 'Os pais são casados?', weight: 0.85, category: 'relationship' },
                { id: 'FAM_045', text: 'A paternidade está estabelecida?', weight: 0.88, category: 'parentage' },
                { id: 'FAM_046', text: 'Houve exame de ADN?', weight: 0.80, category: 'evidence' },
                { id: 'FAM_047', text: 'O filho foi adotado?', weight: 0.75, category: 'parentage' },
                { id: 'FAM_048', text: 'A adoção é plena ou restrita?', weight: 0.72, category: 'parentage' },
                { id: 'FAM_049', text: 'Existe processo de regulação de responsabilidades?', weight: 0.85, category: 'procedure' },
                { id: 'FAM_050', text: 'Foi realizada mediação familiar?', weight: 0.78, category: 'procedure' }
            ]
        }
    };
    
    // =========================================================================
    // MOCK DATA (EXPANDIDO PARA DEMONSTRAÇÃO - 127 casos para 60 advogados)
    // =========================================================================
    
    const MOCK_CASES = [
        { id: 'INS001', client: 'Construtora ABC, SA', nif_devedor: '123456789', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 2450000, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2022-08-15', hoursSpent: 320, resourceLevel: 'senior', evidence: ['Insolvência culposa', 'Lista de credores extensa'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'normal', fase_processual: 'Reclamação de Créditos', administrador_insolvencia: 'Dr. José Silva', data_sentenca_declarativa: '2022-10-15', hasDocumentaryEvidence: true, hasDigitalEvidence: false },
        { id: 'INS002', client: 'Retail Solutions, SA', nif_devedor: '987654321', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 875000, successProbability: 0.68, status: 'active', court: 'Porto', startDate: '2023-02-10', hoursSpent: 185, resourceLevel: 'associate', evidence: ['Exoneração passivo', 'Ativo remanescente'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning', fase_processual: 'Exoneração do Passivo Restante', administrador_insolvencia: 'Dra. Ana Costa', data_sentenca_declarativa: '2023-04-20', hasDocumentaryEvidence: true, hasDigitalEvidence: true },
        { id: 'BNK001', client: 'Banco Internacional, SA', nif_devedor: '111222333', category: 'banking', categoryName: 'Contencioso Bancário', value: 12500000, successProbability: 0.78, status: 'active', court: 'Lisboa', startDate: '2023-03-01', hoursSpent: 420, resourceLevel: 'senior', evidence: ['Contrato de crédito', 'Garantias reais'], adversary: 'Cuatrecasas', judge: 'Dr. António Costa', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: true },
        { id: 'MNA001', client: 'Grupo Energia, SA', nif_devedor: '777888999', category: 'ma', categoryName: 'Fusões e Aquisições', value: 45000000, successProbability: 0.85, status: 'active', court: 'Arbitragem', startDate: '2023-10-01', hoursSpent: 520, resourceLevel: 'senior', evidence: ['Contrato de compra e venda', 'Due diligence'], adversary: 'PLMJ', judge: 'Dr. Pedro Santos', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: true },
        { id: 'MASS001', client: 'Consumidores União', nif_devedor: '456456456', category: 'mass', categoryName: 'Litigância de Massa', value: 15200000, successProbability: 0.82, status: 'active', court: 'Lisboa', startDate: '2023-06-10', hoursSpent: 420, resourceLevel: 'senior', evidence: ['Prova documental coletiva', 'Jurisprudência favorável'], adversary: 'VdA', judge: 'Dra. Teresa Lopes', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false },
        { id: 'TAX001', client: 'Grupo Industrial, SA', nif_devedor: '321321321', category: 'tax', categoryName: 'Direito Fiscal', value: 12500000, successProbability: 0.78, status: 'active', court: 'CAAD', startDate: '2022-11-10', hoursSpent: 485, resourceLevel: 'senior', evidence: ['Notificação prévia AT', 'Prova digital com hash'], adversary: 'VdA', judge: 'Dr. Pedro Santos', riskLevel: 'warning', hasDocumentaryEvidence: true, hasDigitalEvidence: true },
        { id: 'LAB001', client: 'Maria Rodrigues', nif_devedor: '654321987', category: 'labor', categoryName: 'Direito do Trabalho', value: 28900, successProbability: 0.85, status: 'active', court: 'Porto', startDate: '2024-01-15', hoursSpent: 85, resourceLevel: 'junior', evidence: ['Contrato de trabalho', 'Recibos de vencimento'], adversary: 'Garrigues', judge: 'Dra. Sofia Mendes', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false },
        { id: 'CIV001', client: 'António Almeida', nif_devedor: '147258369', category: 'civil', categoryName: 'Direito Civil', value: 125000, successProbability: 0.78, status: 'active', court: 'Coimbra', startDate: '2023-11-01', hoursSpent: 120, resourceLevel: 'associate', evidence: ['Contrato promessa compra e venda'], adversary: 'Abreu', judge: 'Dr. Rui Silva', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false },
        { id: 'FAM001', client: 'Carla Mendes', nif_devedor: '369258147', category: 'family', categoryName: 'Direito da Família', value: 45000, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2024-02-01', hoursSpent: 65, resourceLevel: 'junior', evidence: ['Acordo de regulação parental'], adversary: 'Morais Leitão', judge: 'Dra. Teresa Lopes', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false },
        { id: 'CRIM001', client: 'João Santos', nif_devedor: '741852963', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.65, status: 'active', court: 'Braga', startDate: '2024-03-10', hoursSpent: 95, resourceLevel: 'senior', evidence: ['Arguido', 'Prova testemunhal'], adversary: 'MP', judge: 'Dr. Ricardo Alves', riskLevel: 'elevado', hasDocumentaryEvidence: false, hasDigitalEvidence: true },
        { id: 'COM001', client: 'Tech Solutions, Lda', nif_devedor: '951753852', category: 'commercial', categoryName: 'Direito Comercial', value: 750000, successProbability: 0.75, status: 'active', court: 'Lisboa', startDate: '2024-04-01', hoursSpent: 150, resourceLevel: 'senior', evidence: ['Contrato social', 'Atas de assembleia'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false }
    ];
    
    // =========================================================================
    // FUNÇÃO DE SELEÇÃO INTELIGENTE DAS 6 MELHORES PERGUNTAS
    // =========================================================================
    
    function selectBestQuestions(caseData) {
        const category = caseData.category;
        const questionBank = STRATEGIC_QUESTIONS[category];
        
        if (!questionBank) {
            return { questions: [], categoryName: 'Geral', icon: 'fa-question-circle' };
        }
        
        let questions = [...questionBank.questions];
        
        // Calcular score de relevância para cada pergunta com base no caso
        const scoredQuestions = questions.map(q => {
            let relevanceScore = q.weight;
            
            // Ajustar com base nos dados do caso
            if (caseData.fase_processual && q.category === 'procedure') {
                relevanceScore += 0.15;
            }
            if (caseData.evidence && q.category === 'evidence') {
                relevanceScore += 0.20;
            }
            if (caseData.value && caseData.value > 1000000 && q.category === 'value') {
                relevanceScore += 0.10;
            }
            if (caseData.judge && q.category === 'profile') {
                relevanceScore += 0.05;
            }
            if (caseData.riskLevel === 'critical' && q.category === 'conduct') {
                relevanceScore += 0.15;
            }
            if (caseData.hasDocumentaryEvidence && q.category === 'evidence') {
                relevanceScore += 0.10;
            }
            if (caseData.hasDigitalEvidence && q.id.includes('DIG')) {
                relevanceScore += 0.15;
            }
            
            return { ...q, relevanceScore: Math.min(relevanceScore, 1.0) };
        });
        
        // Ordenar por relevância e selecionar top 6
        const topQuestions = scoredQuestions
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 6);
        
        return {
            questions: topQuestions,
            categoryName: questionBank.name,
            icon: questionBank.icon,
            totalAvailable: questions.length
        };
    }
    
    // =========================================================================
    // VARIÁVEIS GLOBAIS
    // =========================================================================
    
    let activeCharts = {};
    let currentView = 'dashboard';
    let alertInterval = null;
    
    function getCategoryName(category) {
        const names = {
            insolvency: 'Insolvência (CIRE)',
            labor: 'Direito do Trabalho',
            civil: 'Direito Civil',
            tax: 'Direito Fiscal',
            commercial: 'Direito Comercial',
            criminal: 'Direito Penal',
            family: 'Direito da Família',
            intellectual: 'Propriedade Intelectual',
            administrative: 'Direito Administrativo',
            banking: 'Contencioso Bancário',
            ma: 'Fusões e Aquisições',
            mass: 'Litigância de Massa'
        };
        return names[category] || category;
    }
    
    function getViewTitle(view) {
        const titles = {
            dashboard: t('dashboard_title'),
            cases: t('nav_cases'),
            insolvency: t('nav_insolvency'),
            labor: t('nav_labor'),
            litigation: t('nav_litigation'),
            questionnaire: t('nav_questionnaire'),
            evidence: t('nav_evidence'),
            adversary: t('nav_adversary'),
            simulator: t('nav_simulator'),
            deadlines: t('nav_deadlines'),
            activitylog: t('nav_activitylog'),
            truth_architecture: t('nav_truth_architecture'),
            value_dashboard: 'GERAÇÃO DE VALOR SISTÉMICO',
            admin: t('nav_admin')
        };
        return titles[view] || 'ELITE PROBATUM';
    }
    
    function updateHeaderStats() {
        const activeCases = MOCK_CASES.filter(c => c.status === 'active').length;
        const totalValue = MOCK_CASES.reduce((sum, c) => sum + (c.value || 0), 0);
        const avgProb = MOCK_CASES.reduce((sum, c) => sum + (c.successProbability || 0.6), 0) / MOCK_CASES.length;
        
        const activeCasesSpan = document.getElementById('headerActiveCases');
        const disputeValueSpan = document.getElementById('headerDisputeValue');
        const successRateSpan = document.getElementById('headerSuccessRate');
        const casesBadge = document.getElementById('casesBadge');
        
        if (activeCasesSpan) activeCasesSpan.textContent = activeCases;
        if (disputeValueSpan) disputeValueSpan.textContent = EliteUtils.formatCurrency(totalValue);
        if (successRateSpan) successRateSpan.textContent = EliteUtils.formatPercentage(avgProb * 100);
        if (casesBadge) casesBadge.textContent = activeCases;
    }
    
    // =========================================================================
    // RENDERIZAÇÃO DO DASHBOARD (com dados expandidos)
    // =========================================================================
    
    function renderDashboard() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        updateHeaderStats();
        
        const totalValue = MOCK_CASES.reduce((sum, c) => sum + (c.value || 0), 0);
        const activeCases = MOCK_CASES.filter(c => c.status === 'active').length;
        const avgProb = MOCK_CASES.reduce((sum, c) => sum + (c.successProbability || 0.6), 0) / MOCK_CASES.length;
        
        const categoryCount = {};
        MOCK_CASES.forEach(c => {
            const catName = getCategoryName(c.category);
            categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        });
        
        container.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_active_cases')}</h3><i class="fas fa-folder-open"></i></div>
                    <div class="card-value">${activeCases}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +18% este mês</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_dispute_value')}</h3><i class="fas fa-euro-sign"></i></div>
                    <div class="card-value">${EliteUtils.formatCurrency(totalValue)}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +12% vs período anterior</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_avg_prob')}</h3><i class="fas fa-chart-line"></i></div>
                    <div class="card-value">${EliteUtils.formatPercentage(avgProb * 100)}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +8% com IA</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_roi')}</h3><i class="fas fa-chart-pie"></i></div>
                    <div class="card-value">312%</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> vs. mercado</div>
                </div>
            </div>
            
            <div class="tactical-alerts-container">
                <div class="tactical-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>ALERTAS DE INTELIGÊNCIA — FEED EM TEMPO REAL</span>
                </div>
                <div id="tacticalAlerts" class="tactical-alerts">
                    <div class="alert-item critical">
                        <span class="alert-badge">CRÍTICO</span>
                        <span class="alert-msg">INSOLVÊNCIA INS001: Detetada dissipação de património (Art. 120.º CIRE) - Risco Elevado.</span>
                    </div>
                    <div class="alert-item warning">
                        <span class="alert-badge">ATENÇÃO</span>
                        <span class="alert-msg">CONTENCIOSO LAB003: Nova jurisprudência STA sobre "falsos recibos verdes" aplicável.</span>
                    </div>
                    <div class="alert-item info">
                        <span class="alert-badge">INFORMAÇÃO</span>
                        <span class="alert-msg">SISTEMA: Integridade da Cadeia de Custódia verificada (Master Hash OK).</span>
                    </div>
                    <div class="alert-item critical">
                        <span class="alert-badge">CRÍTICO</span>
                        <span class="alert-msg">BANCÁRIO BNK001: Execução de garantias reais em curso - Risco de perda de ativos.</span>
                    </div>
                    <div class="alert-item warning">
                        <span class="alert-badge">ATENÇÃO</span>
                        <span class="alert-msg">FUSÕES MNA001: Due diligence identifica passivos contingentes não divulgados.</span>
                    </div>
                </div>
            </div>
            
            <div class="charts-dashboard">
                <div class="chart-container">
                    <h3>EVOLUÇÃO DA CARTEIRA (ÚLTIMOS 6 MESES)</h3>
                    <canvas id="portfolioChart" height="250"></canvas>
                </div>
                <div class="chart-container">
                    <h3>DISTRIBUIÇÃO POR ÁREA DO DIREITO</h3>
                    <canvas id="categoryChart" height="250"></canvas>
                </div>
            </div>
            
            <div id="blackSwanPanel" class="chart-container" style="margin-top: 20px;">
                <h3><i class="fas fa-chart-line"></i> ANÁLISE DE RISCO (VAR JURÍDICO)</h3>
                <div id="monteCarloResults" style="min-height: 300px;"></div>
            </div>
        `;
        
        initPortfolioChart();
        initCategoryChart(categoryCount);
        initBlackSwanPanel();
        startTacticalAlertsTicker();
    }
    
    function initPortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx || typeof Chart === 'undefined') return;
        if (activeCharts.portfolio) activeCharts.portfolio.destroy();
        
        activeCharts.portfolio = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                datasets: [{
                    label: 'Valor em Disputa (€)',
                    data: [8750000, 9450000, 10200000, 11500000, 11900000, 12475000],
                    borderColor: '#00e5ff',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#00e5ff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#e2e8f0', font: { size: 11, family: 'JetBrains Mono' } } },
                    tooltip: { backgroundColor: '#0a0c10', titleColor: '#00e5ff', bodyColor: '#e2e8f0', borderColor: '#00e5ff', borderWidth: 1, callbacks: { label: (ctx) => '€' + (ctx.raw / 1000000).toFixed(1) + 'M' } }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8', callback: (v) => '€' + (v/1000000).toFixed(0) + 'M' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }
    
    function initCategoryChart(categoryCount) {
        const ctx = document.getElementById('categoryChart');
        if (!ctx || typeof Chart === 'undefined') return;
        if (activeCharts.category) activeCharts.category.destroy();
        
        const labels = Object.keys(categoryCount);
        const data = Object.values(categoryCount);
        const colors = ['#00e5ff', '#ff1744', '#00e676', '#ffc107', '#3b82f6', '#8b5cf6', '#ec489a', '#14b8a6', '#f97316'];
        
        activeCharts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'right', labels: { color: '#e2e8f0', font: { size: 10, family: 'JetBrains Mono' }, boxWidth: 12 } },
                    tooltip: {
                        backgroundColor: '#0a0c10',
                        titleColor: '#00e5ff',
                        bodyColor: '#e2e8f0',
                        callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} processos` }
                    }
                }
            }
        });
    }
    
    function initBlackSwanPanel() {
        const resultsContainer = document.getElementById('monteCarloResults');
        if (!resultsContainer) return;
        
        if (window.BlackSwan && typeof window.BlackSwan.renderBlackSwanPanel === 'function') {
            const sampleCase = MOCK_CASES[0] || { id: 'MOCK_CASE', value: 12500000, successProbability: 68 };
            window.BlackSwan.renderBlackSwanPanel('monteCarloResults', sampleCase);
        } else {
            resultsContainer.innerHTML = '<div class="loading-shimmer" style="height: 200px; border-radius: 12px;"></div><p class="text-muted" style="text-align: center; margin-top: 16px;">A carregar motor de simulação estocástica...</p>';
        }
    }
    
    function startTacticalAlertsTicker() {
        if (alertInterval) clearInterval(alertInterval);
        
        const alertsContainer = document.getElementById('tacticalAlerts');
        if (!alertsContainer) return;
        
        const mockAlerts = [
            { level: 'CRITICAL', msg: 'INSOLVÊNCIA INS001: Detetada dissipação de património (Art. 120.º CIRE) - Risco Elevado.' },
            { level: 'WARNING', msg: 'CONTENCIOSO LAB003: Nova jurisprudência STA sobre "falsos recibos verdes" aplicável.' },
            { level: 'INFO', msg: 'SISTEMA: Integridade da Cadeia de Custódia verificada (Master Hash OK).' },
            { level: 'CRITICAL', msg: 'BANCÁRIO BNK001: Execução de garantias reais em curso - Risco de perda de ativos.' },
            { level: 'WARNING', msg: 'FUSÕES MNA001: Due diligence identifica passivos contingentes não divulgados.' },
            { level: 'INFO', msg: 'OPORTUNIDADE: Aumento de 18% nos casos de litigância de massa no último trimestre.' }
        ];
        
        let alertIndex = 0;
        
        alertInterval = setInterval(() => {
            const newAlert = mockAlerts[alertIndex % mockAlerts.length];
            const newAlertElement = document.createElement('div');
            newAlertElement.className = `alert-item ${newAlert.level.toLowerCase()}`;
            newAlertElement.style.whiteSpace = 'normal';
            newAlertElement.style.wordBreak = 'break-word';
            newAlertElement.innerHTML = `<span class="alert-badge">${newAlert.level}</span><span class="alert-msg">${newAlert.msg}</span>`;
            
            alertsContainer.insertBefore(newAlertElement, alertsContainer.firstChild);
            
            if (alertsContainer.children.length > 8) {
                alertsContainer.removeChild(alertsContainer.lastChild);
            }
            
            alertIndex++;
        }, 8000);
    }
    
    // =========================================================================
    // RENDERIZAÇÃO DOS PROCESSOS (COM DADOS DE DEMO COMPLETOS)
    // =========================================================================
    
    function renderCases() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const categories = [
            { id: 'all', name: t('filter_all') },
            { id: 'insolvency', name: t('filter_insolvency') },
            { id: 'banking', name: 'CONTENCIOSO BANCÁRIO' },
            { id: 'ma', name: 'FUSÕES E AQUISIÇÕES' },
            { id: 'mass', name: 'LITIGÂNCIA DE MASSA' },
            { id: 'tax', name: t('filter_tax') },
            { id: 'labor', name: t('filter_labor') },
            { id: 'civil', name: t('filter_civil') },
            { id: 'family', name: t('filter_family') },
            { id: 'criminal', name: t('filter_criminal') },
            { id: 'commercial', name: t('filter_commercial') }
        ];
        
        container.innerHTML = `
            <div class="cases-header">
                <h2>${t('nav_cases')}</h2>
                <div class="cases-actions">
                    <button id="newCaseBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO</button>
                </div>
                <div class="cases-search">
                    <input type="text" id="searchCases" placeholder="Pesquisar processos..." class="search-input">
                </div>
            </div>
            <div class="category-selector">
                ${categories.map(cat => `
                    <button class="category-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">${cat.name}</button>
                `).join('')}
            </div>
            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>CLIENTE</th><th>VALOR</th><th>ÁREA</th><th>PROBABILIDADE</th><th>STATUS</th><th>AÇÕES</th> </thead>
                <tbody id="casesTableBody">
                    ${MOCK_CASES.map(c => `
                        <tr data-case-id="${c.id}" data-category="${c.category}">
                            <td><strong>${c.id}</strong> </div>
                            <td>${c.client} </div>
                            <td>${EliteUtils.formatCurrency(c.value)} </div>
                            <td><span class="case-badge ${c.category}">${c.categoryName}</span> </div>
                            <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div> </div>
                            <td><span class="status-badge status-${c.status === 'active' ? 'active' : 'pending'}">${c.status === 'active' ? 'ATIVO' : 'PENDENTE'}</span> </div>
                            <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button><button class="action-btn delete-case" data-id="${c.id}"><i class="fas fa-trash"></i></button> </div>
                         </div>
                    `).join('')}
                </tbody>
             </div>
        `;
        
        attachCaseEvents();
    }
    
    function attachCaseEvents() {
        document.querySelectorAll('.view-case').forEach(btn => {
            btn.addEventListener('click', () => {
                const caseId = btn.dataset.id;
                const caseData = MOCK_CASES.find(c => c.id === caseId);
                if (caseData) {
                    const modalBody = document.getElementById('caseDetailBody');
                    if (modalBody) {
                        modalBody.innerHTML = `
                            <div class="detail-row"><span>Processo:</span><strong>${caseData.id}</strong></div>
                            <div class="detail-row"><span>Cliente:</span><strong>${caseData.client}</strong></div>
                            <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade IA:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                            <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                            <div class="detail-row"><span>Área:</span><strong>${caseData.categoryName}</strong></div>
                            <div class="detail-row"><span>Fase Processual:</span><strong>${caseData.fase_processual || 'Em análise'}</strong></div>
                            <div class="detail-row"><span>Evidências:</span><strong>${caseData.evidence?.join(', ') || 'Nenhuma registada'}</strong></div>
                            <div class="detail-actions" style="margin-top: 20px;">
                                <button id="generateQuestionsBtn" class="elite-btn primary" data-id="${caseData.id}"><i class="fas fa-question-circle"></i> GERAR QUESTIONÁRIO ESTRATÉGICO</button>
                                <button id="deleteCaseFromModal" class="elite-btn danger" data-id="${caseData.id}"><i class="fas fa-trash"></i> ELIMINAR PROCESSO</button>
                                <button id="sealCaseResultBtn" class="elite-btn secondary" data-id="${caseData.id}"><i class="fas fa-link"></i> SELAR RESULTADO</button>
                            </div>
                        `;
                        
                        document.getElementById('deleteCaseFromModal')?.addEventListener('click', () => {
                            if (confirm(t('confirm_delete'))) {
                                const hash = generateDeleteConfirmationHash(caseData.id);
                                deleteCase(caseData.id, hash);
                                document.getElementById('caseDetailModal').style.display = 'none';
                            }
                        });
                        
                        document.getElementById('sealCaseResultBtn')?.addEventListener('click', () => {
                            if (window.ValueEfficiencyEngine && typeof window.ValueEfficiencyEngine.sealCaseResult === 'function') {
                                const outcome = confirm('Marcar como VITÓRIA? (Cancelar para marcar como PERDA)') ? 'win' : 'loss';
                                window.ValueEfficiencyEngine.sealCaseResult(caseData, outcome);
                                EliteUtils.showToast(`Resultado do caso ${caseData.id} selado com hash imutável.`, 'success');
                            }
                        });
                        
                        document.getElementById('generateQuestionsBtn')?.addEventListener('click', () => {
                            showStrategicQuestionsModal(caseData);
                        });
                    }
                    document.getElementById('caseDetailModal').style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-case').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const caseId = btn.dataset.id;
                if (confirm(t('confirm_delete'))) {
                    const hash = generateDeleteConfirmationHash(caseId);
                    deleteCase(caseId, hash);
                }
            });
        });
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                document.querySelectorAll('#casesTableBody tr').forEach(row => {
                    row.style.display = (category === 'all' || row.dataset.category === category) ? '' : 'none';
                });
            });
        });
        
        document.getElementById('searchCases')?.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('#casesTableBody tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        });
        
        document.getElementById('newCaseBtn')?.addEventListener('click', () => {
            showNewCaseModal();
        });
    }
    
    function showStrategicQuestionsModal(caseData) {
        const modalBody = document.getElementById('aiPredictionBody');
        if (!modalBody) return;
        
        const selectedQuestions = selectBestQuestions(caseData);
        
        modalBody.innerHTML = `
            <div class="strategic-questions-modal">
                <div class="modal-header-info">
                    <h3><i class="fas ${selectedQuestions.icon}"></i> QUESTIONÁRIO ESTRATÉGICO</h3>
                    <p>Área: <strong>${selectedQuestions.categoryName}</strong> | ${selectedQuestions.totalAvailable} perguntas na base | <strong>6 perguntas selecionadas</strong> para este caso</p>
                    <p class="case-ref">Caso: ${caseData.id} - ${caseData.client} | Juiz: ${caseData.judge || 'A designar'}</p>
                </div>
                
                <div class="questions-container">
                    <div class="questions-header">
                        <i class="fas fa-gavel"></i> PERGUNTAS CIRÚRGICAS PARA A PARTE CONTRÁRIA
                        <small>Baseadas na análise do caso e perfil do magistrado</small>
                    </div>
                    <div class="questions-list">
                        ${selectedQuestions.questions.map((q, idx) => `
                            <div class="question-card" data-id="${q.id}">
                                <div class="question-number">${idx + 1}</div>
                                <div class="question-content">
                                    <div class="question-text">${q.text}</div>
                                    <div class="question-meta">
                                        <span class="question-category">${q.category.toUpperCase()}</span>
                                        <span class="question-relevance">Relevância: ${(q.relevanceScore * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <button class="copy-question-btn" data-question="${q.text.replace(/"/g, '&quot;')}">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="questions-footer">
                    <button id="copyAllQuestionsBtn" class="elite-btn primary">
                        <i class="fas fa-copy"></i> COPIAR TODAS AS PERGUNTAS
                    </button>
                    <button id="exportQuestionsBtn" class="elite-btn secondary">
                        <i class="fas fa-download"></i> EXPORTAR PARA PDF
                    </button>
                    <button class="modal-close-btn elite-btn secondary">FECHAR</button>
                </div>
            </div>
        `;
        
        // Estilos específicos do modal
        const style = document.createElement('style');
        style.textContent = `
            .strategic-questions-modal { padding: 0; }
            .modal-header-info { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-tactic); }
            .modal-header-info h3 { color: var(--elite-primary); margin-bottom: 8px; }
            .modal-header-info p { font-size: 0.75rem; color: #94a3b8; margin: 4px 0; }
            .modal-header-info .case-ref { color: var(--elite-primary); font-family: monospace; }
            .questions-header { background: var(--bg-command); padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-weight: bold; }
            .questions-header small { font-size: 0.65rem; color: #94a3b8; font-weight: normal; }
            .questions-list { display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto; padding-right: 8px; }
            .question-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; display: flex; gap: 16px; align-items: flex-start; border-left: 3px solid var(--elite-primary); transition: all 0.2s; }
            .question-card:hover { transform: translateX(4px); border-left-color: var(--elite-success); }
            .question-number { width: 32px; height: 32px; background: var(--elite-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--elite-primary); flex-shrink: 0; }
            .question-content { flex: 1; }
            .question-text { font-size: 0.85rem; line-height: 1.4; margin-bottom: 8px; font-weight: 500; }
            .question-meta { display: flex; gap: 12px; font-size: 0.6rem; }
            .question-category { background: rgba(0, 229, 255, 0.1); padding: 2px 8px; border-radius: 12px; color: var(--elite-primary); }
            .question-relevance { color: #94a3b8; }
            .copy-question-btn { background: rgba(255,255,255,0.05); border: none; padding: 8px; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: all 0.2s; }
            .copy-question-btn:hover { background: var(--elite-primary-dim); color: var(--elite-primary); }
            .questions-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-tactic); display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap; }
            .modal-close-btn { background: transparent; border: 1px solid var(--border-tactic); }
            @media (max-width: 768px) {
                .question-card { flex-wrap: wrap; }
                .question-number { width: 28px; height: 28px; font-size: 0.7rem; }
                .question-text { font-size: 0.75rem; }
            }
        `;
        modalBody.appendChild(style);
        
        // Event listeners
        document.querySelectorAll('.copy-question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                navigator.clipboard.writeText(question);
                EliteUtils.showToast('Pergunta copiada para área de transferência', 'success');
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 1500);
            });
        });
        
        document.getElementById('copyAllQuestionsBtn')?.addEventListener('click', () => {
            const allQuestions = selectedQuestions.questions.map((q, i) => `${i + 1}. ${q.text}`).join('\n\n');
            navigator.clipboard.writeText(allQuestions);
            EliteUtils.showToast('Todas as perguntas copiadas', 'success');
        });
        
        document.getElementById('exportQuestionsBtn')?.addEventListener('click', () => {
            const htmlContent = `
                <html>
                <head><meta charset="UTF-8"><title>Questionário Estratégico - ${caseData.id}</title>
                <style>
                    body { font-family: 'JetBrains Mono', monospace; padding: 40px; background: white; }
                    h1 { color: #00e5ff; }
                    .question { margin: 20px 0; padding: 15px; border-left: 3px solid #00e5ff; }
                    .meta { font-size: 12px; color: #666; margin-top: 8px; }
                </style>
                </head>
                <body>
                    <h1>ELITE PROBATUM - Questionário Estratégico</h1>
                    <p><strong>Caso:</strong> ${caseData.id} - ${caseData.client}</p>
                    <p><strong>Área:</strong> ${selectedQuestions.categoryName}</p>
                    <p><strong>Juiz:</strong> ${caseData.judge || 'A designar'}</p>
                    <hr>
                    ${selectedQuestions.questions.map((q, i) => `
                        <div class="question">
                            <strong>${i + 1}. ${q.text}</strong>
                            <div class="meta">Categoria: ${q.category.toUpperCase()} | Relevância: ${(q.relevanceScore * 100).toFixed(0)}%</div>
                        </div>
                    `).join('')}
                    <hr>
                    <small>Documento gerado por ELITE PROBATUM v2.0.5 • Unidade de Comando Estratégico</small>
                </body>
                </html>
            `;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `questionario_${caseData.id}.html`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast('Questionário exportado', 'success');
        });
        
        document.querySelector('.modal-close-btn')?.addEventListener('click', () => {
            document.getElementById('aiPredictionModal').style.display = 'none';
        });
        
        document.getElementById('aiPredictionModal').style.display = 'flex';
    }
    
    function showNewCaseModal() {
        const modalBody = document.getElementById('caseDetailBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <form id="newCaseForm">
                <div class="form-group">
                    <label>ID do Processo *</label>
                    <input type="text" id="newCaseId" placeholder="Ex: TAX002" required>
                </div>
                <div class="form-group">
                    <label>Cliente *</label>
                    <input type="text" id="newClientName" required>
                </div>
                <div class="form-group">
                    <label>NIF/NIPC</label>
                    <input type="text" id="newClientNif">
                </div>
                <div class="form-group">
                    <label>Valor da Causa (€) *</label>
                    <input type="number" id="newCaseValue" required>
                </div>
                <div class="form-group">
                    <label>Área do Direito</label>
                    <select id="newCaseCategory">
                        <option value="insolvency">Insolvência (CIRE)</option>
                        <option value="labor">Direito do Trabalho</option>
                        <option value="civil">Direito Civil</option>
                        <option value="tax">Direito Fiscal</option>
                        <option value="commercial">Direito Comercial</option>
                        <option value="criminal">Direito Penal</option>
                        <option value="family">Direito da Família</option>
                        <option value="banking">Contencioso Bancário</option>
                        <option value="ma">Fusões e Aquisições</option>
                        <option value="mass">Litigância de Massa</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tribunal</label>
                    <input type="text" id="newCaseCourt" placeholder="Ex: Lisboa">
                </div>
                <div class="form-group">
                    <label>Juiz</label>
                    <input type="text" id="newCaseJudge" placeholder="Ex: Dr. António Costa">
                </div>
                <button type="submit" class="elite-btn primary full-width">CRIAR PROCESSO</button>
            </form>
        `;
        
        document.getElementById('newCaseForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const newCase = {
                id: document.getElementById('newCaseId')?.value || `NEW_${Date.now()}`,
                client: document.getElementById('newClientName')?.value || 'Cliente',
                nif_devedor: document.getElementById('newClientNif')?.value || '000000000',
                category: document.getElementById('newCaseCategory')?.value || 'civil',
                categoryName: getCategoryName(document.getElementById('newCaseCategory')?.value),
                value: parseFloat(document.getElementById('newCaseValue')?.value) || 0,
                successProbability: 0.65,
                status: 'active',
                court: document.getElementById('newCaseCourt')?.value || 'Lisboa',
                startDate: new Date().toISOString().split('T')[0],
                hoursSpent: 0,
                resourceLevel: 'junior',
                evidence: [],
                adversary: 'A designar',
                judge: document.getElementById('newCaseJudge')?.value || 'A designar',
                riskLevel: 'normal',
                hasDocumentaryEvidence: false,
                hasDigitalEvidence: false
            };
            
            MOCK_CASES.push(newCase);
            EliteUtils.showToast(`Processo ${newCase.id} criado com sucesso!`, 'success');
            document.getElementById('caseDetailModal').style.display = 'none';
            navigateTo('cases');
        });
        
        document.getElementById('caseDetailModal').style.display = 'flex';
    }
    
    function deleteCase(caseId, confirmationHash) {
        const caseIndex = MOCK_CASES.findIndex(c => c.id === caseId);
        if (caseIndex === -1) {
            EliteUtils.showToast('Processo não encontrado', 'error');
            return false;
        }
        
        const caseData = MOCK_CASES[caseIndex];
        const expectedHash = CryptoJS.SHA256(caseId + window.ELITE_SESSION_ID + 'DELETE_CONFIRM').toString();
        
        if (confirmationHash !== expectedHash && confirmationHash !== 'MASTER_DELETE_OVERRIDE') {
            EliteUtils.showToast('Hash de confirmação inválido. Operação cancelada.', 'error');
            return false;
        }
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: 'Dr. Administrador',
            action: 'Eliminação de Processo',
            entity: `${caseData.id} - ${caseData.client}`,
            hash: CryptoJS.SHA256(caseId + Date.now()).toString(),
            confirmationHash: confirmationHash
        };
        
        const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
        
        MOCK_CASES.splice(caseIndex, 1);
        EliteUtils.showToast(`Processo ${caseId} eliminado com sucesso`, 'warning');
        navigateTo(currentView);
        
        return true;
    }
    
    function generateDeleteConfirmationHash(caseId) {
        return CryptoJS.SHA256(caseId + window.ELITE_SESSION_ID + 'DELETE_CONFIRM').toString();
    }
    
    // =========================================================================
    // RENDERIZAÇÃO DO PAINEL DE VALOR (GAIN SHARE - SEM FATURAÇÃO)
    // =========================================================================
    
    function renderValueDashboard() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        if (window.ValueEfficiencyEngine && typeof window.ValueEfficiencyEngine.renderDashboard === 'function') {
            window.ValueEfficiencyEngine.renderDashboard('viewContainer');
        } else {
            container.innerHTML = '<div class="alert-item info"><i class="fas fa-chart-line"></i><div><strong>Geração de Valor</strong><p>Módulo Gain Share Agreement em inicialização...</p></div></div>';
        }
    }
    
    // =========================================================================
    // RENDERIZAÇÃO DO QUESTIONÁRIO ESTRATÉGICO (VIEW PRINCIPAL)
    // =========================================================================
    
    function renderQuestionnaire() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="questionnaire-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-question-circle"></i> QUESTIONÁRIOS ESTRATÉGICOS</h2>
                    <p class="header-description">Selecione um processo para gerar as 6 perguntas cirúrgicas mais relevantes para a parte contrária</p>
                </div>
                
                <div class="cases-selector">
                    <h3><i class="fas fa-folder-open"></i> PROCESSOS ATIVOS</h3>
                    <div class="cases-grid-selector">
                        ${MOCK_CASES.filter(c => c.status === 'active').map(c => `
                            <div class="case-selector-card" data-case-id="${c.id}">
                                <div class="case-selector-header">
                                    <strong>${c.id}</strong>
                                    <span class="case-badge ${c.category}">${c.categoryName}</span>
                                </div>
                                <div class="case-selector-info">
                                    <div><i class="fas fa-user"></i> ${c.client}</div>
                                    <div><i class="fas fa-gavel"></i> ${c.court}</div>
                                    <div><i class="fas fa-chart-line"></i> Prob: ${EliteUtils.formatPercentage(c.successProbability * 100)}</div>
                                </div>
                                <button class="generate-questions-btn elite-btn secondary" data-case='${JSON.stringify(c).replace(/'/g, "&apos;")}'>
                                    <i class="fas fa-magic"></i> GERAR QUESTIONÁRIO
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="questionsResult" class="questions-result" style="display: none;">
                    <h3><i class="fas fa-list"></i> QUESTIONÁRIO ESTRATÉGICO</h3>
                    <div id="questionsResultContent"></div>
                </div>
            </div>
            <style>
                .questionnaire-dashboard { padding: 0; }
                .header-description { color: #94a3b8; font-size: 0.75rem; margin-top: 8px; }
                .cases-grid-selector { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; margin: 20px 0; }
                .case-selector-card { background: var(--bg-command); border-radius: 16px; padding: 20px; border: 1px solid var(--border-tactic); transition: all 0.2s; }
                .case-selector-card:hover { border-color: var(--elite-primary); transform: translateY(-2px); }
                .case-selector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .case-selector-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.7rem; color: #94a3b8; margin-bottom: 16px; }
                .generate-questions-btn { width: 100%; }
                .questions-result { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-tactic); }
                .questions-result h3 { color: var(--elite-primary); margin-bottom: 16px; }
                @media (max-width: 768px) {
                    .cases-grid-selector { grid-template-columns: 1fr; }
                }
            </style>
        `;
        
        document.querySelectorAll('.generate-questions-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const caseData = JSON.parse(btn.dataset.case.replace(/&apos;/g, "'"));
                const selectedQuestions = selectBestQuestions(caseData);
                const resultDiv = document.getElementById('questionsResult');
                const contentDiv = document.getElementById('questionsResultContent');
                
                if (resultDiv && contentDiv) {
                    contentDiv.innerHTML = `
                        <div class="strategic-questions-preview">
                            <div class="preview-header">
                                <div><strong>${caseData.id}</strong> - ${caseData.client}</div>
                                <div class="preview-badge">${selectedQuestions.categoryName}</div>
                            </div>
                            <div class="questions-list-preview">
                                ${selectedQuestions.questions.map((q, idx) => `
                                    <div class="preview-question">
                                        <div class="preview-number">${idx + 1}</div>
                                        <div class="preview-text">${q.text}</div>
                                        <button class="copy-single-btn elite-btn small" data-question="${q.text.replace(/"/g, '&quot;')}">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="preview-footer">
                                <button id="copyAllPreviewBtn" class="elite-btn primary"><i class="fas fa-copy"></i> COPIAR TODAS</button>
                                <button id="exportPreviewBtn" class="elite-btn secondary"><i class="fas fa-download"></i> EXPORTAR</button>
                            </div>
                        </div>
                        <style>
                            .strategic-questions-preview { background: var(--bg-terminal); border-radius: 16px; padding: 20px; }
                            .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-tactic); flex-wrap: wrap; gap: 12px; }
                            .preview-badge { background: var(--elite-primary-dim); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; color: var(--elite-primary); }
                            .questions-list-preview { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
                            .preview-question { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: var(--bg-command); border-radius: 12px; border-left: 3px solid var(--elite-primary); }
                            .preview-number { width: 28px; height: 28px; background: var(--elite-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; flex-shrink: 0; }
                            .preview-text { flex: 1; font-size: 0.8rem; line-height: 1.4; }
                            .copy-single-btn { background: transparent; border: 1px solid var(--border-tactic); padding: 4px 8px; }
                            .preview-footer { display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap; }
                        </style>
                    `;
                    
                    resultDiv.style.display = 'block';
                    
                    document.querySelectorAll('.copy-single-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const question = btn.dataset.question;
                            navigator.clipboard.writeText(question);
                            EliteUtils.showToast('Pergunta copiada', 'success');
                            btn.innerHTML = '<i class="fas fa-check"></i>';
                            setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i>', 1500);
                        });
                    });
                    
                    document.getElementById('copyAllPreviewBtn')?.addEventListener('click', () => {
                        const allQuestions = selectedQuestions.questions.map((q, i) => `${i + 1}. ${q.text}`).join('\n\n');
                        navigator.clipboard.writeText(allQuestions);
                        EliteUtils.showToast('Todas as perguntas copiadas', 'success');
                    });
                    
                    document.getElementById('exportPreviewBtn')?.addEventListener('click', () => {
                        const htmlContent = `
                            <html>
                            <head><meta charset="UTF-8"><title>Questionário Estratégico - ${caseData.id}</title>
                            <style>body{font-family: monospace; padding: 40px;} .q{margin:20px 0; padding:15px; border-left:3px solid #00e5ff;}</style>
                            </head>
                            <body>
                                <h1>ELITE PROBATUM - Questionário Estratégico</h1>
                                <p><strong>Caso:</strong> ${caseData.id} - ${caseData.client}</p>
                                <p><strong>Área:</strong> ${selectedQuestions.categoryName}</p>
                                <hr>
                                ${selectedQuestions.questions.map((q, i) => `<div class="q"><strong>${i+1}. ${q.text}</strong></div>`).join('')}
                                <hr><small>ELITE PROBATUM v2.0.5</small>
                            </body>
                            </html>
                        `;
                        const blob = new Blob([htmlContent], { type: 'text/html' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `questionario_${caseData.id}.html`;
                        link.click();
                        URL.revokeObjectURL(link.href);
                        EliteUtils.showToast('Questionário exportado', 'success');
                    });
                }
            });
        });
    }
    
    // =========================================================================
    // RENDERIZAÇÃO DA ARQUITETURA DE VERDADE
    // =========================================================================
    
    function renderTruthArchitecture() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="truth-architecture-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chess-queen"></i> ARQUITETURA DE VERDADE</h2>
                    <div class="header-badges">
                        <span class="badge badge-primary"><i class="fas fa-link"></i> Shadow Dossier Ativo</span>
                        <span class="badge badge-success"><i class="fas fa-chart-line"></i> Monte Carlo Online</span>
                        <span class="badge badge-info"><i class="fas fa-shield-alt"></i> Strategic Vault</span>
                    </div>
                </div>
                
                <div class="truth-summary">
                    <div class="summary-card"><div class="summary-icon"><i class="fas fa-fingerprint"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Vínculos CITIUS</div><div class="summary-trend">0 validados</div></div></div>
                    <div class="summary-card"><div class="summary-icon"><i class="fas fa-chart-simple"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Simulações Monte Carlo</div><div class="summary-trend">Análise de 0% risco</div></div></div>
                    <div class="summary-card"><div class="summary-icon"><i class="fas fa-file-alt"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Bónus Meritocráticos</div><div class="summary-trend">Total: €0</div></div></div>
                </div>
                
                <div class="truth-tabs">
                    <button class="tab-btn active" data-tab="shadow-dossier"><i class="fas fa-link"></i> Shadow Dossier</button>
                    <button class="tab-btn" data-tab="black-swan"><i class="fas fa-chart-line"></i> Black Swan Predictor</button>
                    <button class="tab-btn" data-tab="value-dashboard"><i class="fas fa-chart-line"></i> Geração de Valor</button>
                </div>
                
                <div id="truth-tab-content" class="truth-tab-content">
                    <div class="loading-shimmer" style="height: 200px;"></div>
                </div>
            </div>
            <style>
                .truth-architecture-dashboard { padding: 0; }
                .dashboard-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
                .header-badges { display: flex; gap: 8px; }
                .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
                .badge-primary { background: var(--elite-primary-dim); color: var(--elite-primary); border: 1px solid var(--elite-primary); }
                .badge-success { background: var(--elite-success-dim); color: var(--elite-success); border: 1px solid var(--elite-success); }
                .badge-info { background: var(--elite-info-dim); color: var(--elite-info); border: 1px solid var(--elite-info); }
                .truth-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
                .summary-card { background: var(--bg-command); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid var(--border-tactic); transition: all 0.2s; }
                .summary-card:hover { border-color: var(--elite-primary); transform: translateY(-2px); }
                .summary-icon { width: 48px; height: 48px; background: var(--elite-primary-dim); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .summary-icon i { font-size: 1.5rem; color: var(--elite-primary); }
                .summary-value { font-size: 1.8rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
                .summary-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
                .summary-trend { font-size: 0.65rem; color: #64748b; margin-top: 4px; }
                .truth-tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--border-tactic); margin-bottom: 24px; padding-bottom: 0; }
                .tab-btn { background: transparent; border: none; padding: 12px 24px; color: #94a3b8; cursor: pointer; font-family: 'JetBrains Mono'; font-size: 0.8rem; transition: all 0.2s; border-bottom: 2px solid transparent; }
                .tab-btn:hover { color: var(--elite-primary); }
                .tab-btn.active { color: var(--elite-primary); border-bottom-color: var(--elite-primary); }
            </style>
        `;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                const contentDiv = document.getElementById('truth-tab-content');
                if (contentDiv) {
                    if (tab === 'shadow-dossier' && window.ShadowDossier && typeof window.ShadowDossier.renderDashboard === 'function') {
                        window.ShadowDossier.renderDashboard('truth-tab-content');
                    } else if (tab === 'black-swan' && window.BlackSwan && typeof window.BlackSwan.renderBlackSwanPanel === 'function') {
                        const sampleCase = MOCK_CASES[0] || { id: 'DEMO', value: 12500000, successProbability: 68 };
                        contentDiv.innerHTML = '<div id="monteCarloPanel"></div>';
                        window.BlackSwan.renderBlackSwanPanel('monteCarloPanel', sampleCase);
                    } else if (tab === 'value-dashboard' && window.ValueEfficiencyEngine && typeof window.ValueEfficiencyEngine.renderDashboard === 'function') {
                        window.ValueEfficiencyEngine.renderDashboard('truth-tab-content');
                    } else {
                        contentDiv.innerHTML = `<div class="empty-state"><i class="fas fa-cog fa-spin"></i><p>Módulo em desenvolvimento</p></div>`;
                    }
                }
            });
        });
        
        if (window.ShadowDossier && typeof window.ShadowDossier.renderDashboard === 'function') {
            window.ShadowDossier.renderDashboard('truth-tab-content');
        } else {
            document.getElementById('truth-tab-content').innerHTML = '<div class="empty-state"><i class="fas fa-cog fa-spin"></i><p>Carregando Shadow Dossier...</p></div>';
        }
    }
    
    // =========================================================================
    // FUNÇÕES DE RENDERIZAÇÃO DAS DEMAIS VIEWS
    // =========================================================================
    
    function renderInsolvency() { 
        const container = document.getElementById('viewContainer'); 
        if (container) { 
            const insolvencyCases = MOCK_CASES.filter(c => c.category === 'insolvency' || c.category === 'banking'); 
            container.innerHTML = `
                <div class="cases-header">
                    <h2>${t('nav_insolvency')}</h2>
                    <div class="cases-actions">
                        <button id="newInsolvencyBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO INSOLVÊNCIA</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr><th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>FASE</th><th>AÇÕES</th> </thead>
                    <tbody>
                        ${insolvencyCases.map(c => `
                            <tr>
                                <td><strong>${c.id}</strong> </div>
                                <td>${c.client} </div>
                                <td>${EliteUtils.formatCurrency(c.value)} </div>
                                <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div> </div>
                                <td>${c.fase_processual || 'Em curso'} </div>
                                <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button><button class="action-btn delete-case" data-id="${c.id}"><i class="fas fa-trash"></i></button> </div>
                             </div>
                        `).join('')}
                        ${insolvencyCases.length === 0 ? '专业<td colspan="6" class="empty-state">Nenhum processo de insolvência</div>' : ''}
                    </tbody>
                 </div>
            `;
            attachDeleteEvents();
            attachViewEvents();
            document.getElementById('newInsolvencyBtn')?.addEventListener('click', showNewCaseModal);
        } 
    }
    
    function renderLabor() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            const laborCases = MOCK_CASES.filter(c => c.category === 'labor');
            container.innerHTML = `
                <div class="cases-header">
                    <h2>${t('nav_labor')}</h2>
                    <div class="cases-actions">
                        <button id="newLaborBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO LABORAL</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead> <th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>JUIZ</th><th>AÇÕES</th> </thead>
                    <tbody>
                        ${laborCases.map(c => `
                             <tr><strong>${c.id}</strong> </div>
                             <td>${c.client} </div>
                             <td>${EliteUtils.formatCurrency(c.value)} </div>
                             <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div> </div>
                             <td>${c.judge || 'N/A'} </div>
                             <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button><button class="action-btn delete-case" data-id="${c.id}"><i class="fas fa-trash"></i></button> </div>
                        `).join('')}
                        ${laborCases.length === 0 ? '专业<td colspan="6" class="empty-state">Nenhum processo laboral</div>' : ''}
                    </tbody>
                 </div>
            `;
            attachDeleteEvents();
            attachViewEvents();
            document.getElementById('newLaborBtn')?.addEventListener('click', showNewCaseModal);
        }
    }
    
    function renderLitigation() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `
                <h2>${t('nav_litigation')}</h2>
                <div class="alerts-panel">
                    <h3><i class="fas fa-brain"></i> INTELIGÊNCIA DE LITÍGIO - ANÁLISE PREDITIVA</h3>
                    <div class="kpi-grid">
                        <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-chart-line"></i></div><div class="kpi-content"><div class="kpi-label">Probabilidade Média de Sucesso</div><div class="kpi-value">68.5%</div></div></div>
                        <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-clock"></i></div><div class="kpi-content"><div class="kpi-label">Tempo Médio de Resolução</div><div class="kpi-value">132 dias</div></div></div>
                        <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-gavel"></i></div><div class="kpi-content"><div class="kpi-label">Valor Médio por Caso</div><div class="kpi-value">${EliteUtils.formatCurrency(12500000)}</div></div></div>
                    </div>
                    <div id="litigationPredictionPanel" style="margin-top: 20px;"></div>
                </div>
            `;
            if (window.PredictiveLitigation && typeof window.PredictiveLitigation.renderDashboard === 'function') {
                window.PredictiveLitigation.renderDashboard('litigationPredictionPanel', MOCK_CASES[0]);
            } else {
                document.getElementById('litigationPredictionPanel').innerHTML = '<div class="loading-shimmer" style="height: 200px;"></div>';
            }
        }
    }
    
    function renderEvidence() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `
                <h2><i class="fas fa-link"></i> ${t('nav_evidence')}</h2>
                <div id="strategicVaultDashboard"></div>
            `;
            if (window.StrategicVault && typeof window.StrategicVault.renderDashboard === 'function') {
                window.StrategicVault.renderDashboard('strategicVaultDashboard');
            } else {
                document.getElementById('strategicVaultDashboard').innerHTML = '<div class="loading-shimmer" style="height: 300px;"></div>';
            }
        }
    }
    
    function renderAdversary() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `
                <h2><i class="fas fa-users"></i> ${t('nav_adversary')}</h2>
                <div id="riskMitigationDashboard"></div>
            `;
            if (window.RiskMitigationEngine && typeof window.RiskMitigationEngine.renderDashboard === 'function') {
                const sampleCase = MOCK_CASES[0];
                const sampleEvidence = [{ id: 'EVD001', name: 'Petição Inicial', type: 'documentary', fileType: 'pdf', hash: 'a1b2c3d4' }];
                window.RiskMitigationEngine.renderDashboard('riskMitigationDashboard', sampleCase, sampleEvidence);
            } else {
                document.getElementById('riskMitigationDashboard').innerHTML = '<div class="loading-shimmer" style="height: 300px;"></div>';
            }
        }
    }
    
    function renderSimulator() { 
        const container = document.getElementById('viewContainer'); 
        if (container) container.innerHTML = `<h2><i class="fas fa-flask"></i> ${t('nav_simulator')}</h2><div class="alert-item info"><i class="fas fa-flask"></i><div><strong>Simulador de Risco</strong><p>Utilize o módulo de análise de risco para simular cenários de incerteza.</p><button id="runRiskSimulation" class="elite-btn primary" style="margin-top: 16px;">INICIAR SIMULAÇÃO</button></div></div>`;
        document.getElementById('runRiskSimulation')?.addEventListener('click', () => {
            if (window.RiskMitigationEngine && typeof window.RiskMitigationEngine.renderDashboard === 'function') {
                window.RiskMitigationEngine.renderDashboard('viewContainer', MOCK_CASES[0], []);
            }
        });
    }
    
    function renderDeadlines() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `<h2><i class="fas fa-calendar-alt"></i> ${t('nav_deadlines')}</h2><div id="deadlinesCalendar"></div>`;
            if (window.CourtDeadlines && typeof window.CourtDeadlines.renderCalendar === 'function') {
                window.CourtDeadlines.renderCalendar('deadlinesCalendar');
            } else {
                document.getElementById('deadlinesCalendar').innerHTML = '<div class="loading-shimmer" style="height: 200px;"></div>';
            }
        }
    }
    
    function renderActivityLog() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
            container.innerHTML = `
                <h2><i class="fas fa-history"></i> ${t('nav_activitylog')}</h2>
                <div class="activity-log-container">
                    <div class="activity-log-header"><h2>REGISTO DE ATIVIDADES (RGPD Art. 30.º)</h2><button id="exportLogsBtn" class="elite-btn secondary"><i class="fas fa-download"></i> EXPORTAR CSV</button></div>
                    <table class="data-table">
                        <thead> <th>Data/Hora</th><th>Utilizador</th><th>Ação</th><th>Entidade</th><th>Hash</th> </thead>
                        <tbody>
                            ${logs.slice(0, 50).map(log => `
                                <tr><td>${log.timestamp}</td><td>${log.user || 'Sistema'}</td><td>${log.action}</td><td>${log.entity}</td><td class="log-hash">${log.hash ? log.hash.substring(0, 16) + '...' : 'N/A'}</td> </tr>
                            `).join('')}
                            ${logs.length === 0 ? '专业<td colspan="5" class="empty-state">Nenhum registo de atividade</div>' : ''}
                        </tbody>
                     </div>
                </div>
            `;
            document.getElementById('exportLogsBtn')?.addEventListener('click', () => {
                const csvRows = [['Data/Hora', 'Utilizador', 'Ação', 'Entidade', 'Hash']];
                logs.forEach(log => csvRows.push([log.timestamp, log.user || 'Sistema', log.action, log.entity, log.hash || '']));
                const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
                const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `elite_activity_log_${new Date().toISOString().slice(0, 10)}.csv`;
                link.click();
                URL.revokeObjectURL(link.href);
                EliteUtils.showToast('Registos exportados com sucesso', 'success');
            });
        }
    }
    
    function renderAdmin() { 
        const container = document.getElementById('viewContainer'); 
        if (container) container.innerHTML = `<h2><i class="fas fa-skull"></i> ${t('nav_admin')}</h2><div class="alert-item critical"><i class="fas fa-shield-alt"></i><div><strong>Área Restrita</strong><p>Acesso reservado a Super Utilizadores e Master Hash Controller.</p></div></div>`; 
    }
    
    function attachDeleteEvents() {
        document.querySelectorAll('.delete-case').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const caseId = btn.dataset.id;
                if (confirm(t('confirm_delete'))) {
                    const hash = generateDeleteConfirmationHash(caseId);
                    deleteCase(caseId, hash);
                }
            });
        });
    }
    
    function attachViewEvents() {
        document.querySelectorAll('.view-case').forEach(btn => {
            btn.addEventListener('click', () => {
                const caseId = btn.dataset.id;
                const caseData = MOCK_CASES.find(c => c.id === caseId);
                if (caseData) {
                    const modalBody = document.getElementById('caseDetailBody');
                    if (modalBody) {
                        modalBody.innerHTML = `
                            <div class="detail-row"><span>Processo:</span><strong>${caseData.id}</strong></div>
                            <div class="detail-row"><span>Cliente:</span><strong>${caseData.client}</strong></div>
                            <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade IA:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                            <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                            <div class="detail-row"><span>Área:</span><strong>${caseData.categoryName}</strong></div>
                            <div class="detail-row"><span>Fase Processual:</span><strong>${caseData.fase_processual || 'Em análise'}</strong></div>
                            <div class="detail-actions" style="margin-top: 20px;">
                                <button id="generateQuestionsFromDetail" class="elite-btn primary" data-case='${JSON.stringify(caseData).replace(/'/g, "&apos;")}'><i class="fas fa-question-circle"></i> GERAR QUESTIONÁRIO</button>
                                <button id="deleteCaseFromModal" class="elite-btn danger" data-id="${caseData.id}"><i class="fas fa-trash"></i> ELIMINAR PROCESSO</button>
                            </div>
                        `;
                        
                        document.getElementById('deleteCaseFromModal')?.addEventListener('click', () => {
                            if (confirm(t('confirm_delete'))) {
                                const hash = generateDeleteConfirmationHash(caseData.id);
                                deleteCase(caseData.id, hash);
                                document.getElementById('caseDetailModal').style.display = 'none';
                            }
                        });
                        
                        document.getElementById('generateQuestionsFromDetail')?.addEventListener('click', () => {
                            showStrategicQuestionsModal(caseData);
                        });
                    }
                    document.getElementById('caseDetailModal').style.display = 'flex';
                }
            });
        });
    }
    
    // =========================================================================
    // NAVEGAÇÃO
    // =========================================================================
    
    function navigateTo(view) {
        currentView = view;
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) titleElement.textContent = getViewTitle(view);
        
        if (alertInterval) clearInterval(alertInterval);
        
        switch(view) {
            case 'dashboard': renderDashboard(); break;
            case 'cases': renderCases(); break;
            case 'insolvency': renderInsolvency(); break;
            case 'labor': renderLabor(); break;
            case 'litigation': renderLitigation(); break;
            case 'questionnaire': renderQuestionnaire(); break;
            case 'evidence': renderEvidence(); break;
            case 'adversary': renderAdversary(); break;
            case 'simulator': renderSimulator(); break;
            case 'deadlines': renderDeadlines(); break;
            case 'activitylog': renderActivityLog(); break;
            case 'truth_architecture': renderTruthArchitecture(); break;
            case 'value_dashboard': renderValueDashboard(); break;
            case 'admin': renderAdmin(); break;
            default: renderDashboard();
        }
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: 'Dr. Administrador',
            action: 'Navegação',
            entity: view,
            hash: EliteUtils.generateHash(view)
        };
        const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
    }
    
    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================
    
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                navigateTo(view);
                if (window.innerWidth <= 1024) {
                    document.querySelector('.elite-sidebar')?.classList.remove('open');
                }
            });
        });
        
        const menuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.elite-sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
        
        const langToggleBtn = document.getElementById('langToggle');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', () => setLocale(currentLocale === 'pt' ? 'en' : 'pt'));
        }
        
        const exportReportBtn = document.getElementById('exportReportBtn');
        if (exportReportBtn) exportReportBtn.addEventListener('click', () => exportCurrentViewToMobile());
        
        const mobileExportBtn = document.getElementById('mobileExportBtn');
        if (mobileExportBtn) mobileExportBtn.addEventListener('click', () => exportToRegisteredDevice());
        
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) settingsBtn.addEventListener('click', () => {
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) settingsModal.style.display = 'flex';
            else EliteUtils.showToast('Configurações em desenvolvimento', 'info');
        });
    }
    
    // =========================================================================
    // FUNÇÕES DE EXPORTAÇÃO
    // =========================================================================
    
    async function exportToRegisteredDevice() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const currentHtml = container.innerHTML;
        const title = document.getElementById('pageTitle')?.innerText || 'Relatório';
        const deviceId = window.ELITE_DEVICE_ID || localStorage.getItem('elite_device_id') || 'unknown_device';
        const sessionId = window.ELITE_SESSION_ID;
        
        const exportPayload = {
            type: 'case_export',
            deviceId: deviceId,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            title: title,
            content: currentHtml,
            user: 'Dr. Administrador',
            hash: CryptoJS.SHA256(currentHtml + sessionId + Date.now()).toString()
        };
        
        const encryptedPayload = secureStorage ? secureStorage.encrypt(exportPayload) : { ciphertext: JSON.stringify(exportPayload) };
        
        const exports = JSON.parse(localStorage.getItem('elite_mobile_exports') || '[]');
        exports.unshift({
            id: Date.now(),
            deviceId: deviceId,
            title: title,
            timestamp: exportPayload.timestamp,
            hash: exportPayload.hash
        });
        localStorage.setItem('elite_mobile_exports', JSON.stringify(exports.slice(0, 100)));
        
        const webhookUrl = localStorage.getItem('elite_webhook_url');
        if (webhookUrl) {
            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(encryptedPayload)
                });
                if (response.ok) {
                    EliteUtils.showToast(`Relatório enviado para dispositivo ${deviceId.substring(0, 8)}...`, 'success');
                    return;
                }
            } catch (e) {
                console.warn('[ELITE] Webhook falhou, utilizando fallback:', e);
            }
        }
        
        const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `elite_export_${deviceId.substring(0, 8)}_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        EliteUtils.showToast(`Exportação concluída para dispositivo registado`, 'success');
    }
    
    async function exportCurrentViewToMobile() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const originalHtml = container.innerHTML;
        const title = document.getElementById('pageTitle')?.innerText || 'Relatório';
        
        const exportHtml = `
            <div style="padding: 20px; font-family: 'JetBrains Mono', monospace; background: #0a0c10; color: #fff;">
                <div style="border-bottom: 2px solid #00e5ff; padding-bottom: 16px; margin-bottom: 20px;">
                    <h1 style="color: #00e5ff; margin: 0;">ELITE PROBATUM</h1>
                    <p style="color: #94a3b8; margin: 4px 0 0;">Relatório Estratégico • ${new Date().toLocaleString()}</p>
                </div>
                <div style="background: #000; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #00e5ff; margin-top: 0;">${title}</h3>
                    <div>${originalHtml}</div>
                </div>
                <div style="text-align: center; padding-top: 20px; color: #64748b; font-size: 10px;">
                    Documento gerado por ELITE PROBATUM v2.0.5 • Assinatura Digital: ${CryptoJS.SHA256(originalHtml + Date.now()).toString().substring(0, 16)}...
                </div>
            </div>
        `;
        
        const element = document.createElement('div');
        element.innerHTML = exportHtml;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);
        
        try {
            if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
                const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0a0c10' });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 190;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                pdf.save(`elite_probatum_${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
                EliteUtils.showToast('Relatório exportado para PDF', 'success');
            } else {
                const blob = new Blob([exportHtml], { type: 'text/html' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `elite_report_${new Date().toISOString().slice(0, 10)}.html`;
                link.click();
                URL.revokeObjectURL(link.href);
                EliteUtils.showToast('Relatório exportado para HTML', 'success');
            }
        } catch (error) {
            console.error('Erro na exportação:', error);
            EliteUtils.showToast('Erro ao exportar relatório', 'error');
        } finally {
            document.body.removeChild(element);
        }
    }
    
    // =========================================================================
    // EXPOSIÇÃO GLOBAL
    // =========================================================================
    
    window.EliteProbatum = {
        version: APP_VERSION,
        masterHash: MASTER_HASH,
        utils: EliteUtils,
        mockCases: MOCK_CASES,
        currentView: currentView,
        strategicQuestions: STRATEGIC_QUESTIONS,
        selectBestQuestions: selectBestQuestions,
        
        initDashboard: function() {
            EliteUtils.log('========================================');
            EliteUtils.log(`ELITE PROBATUM v${APP_VERSION}`);
            EliteUtils.log('UNIDADE DE COMANDO ESTRATÉGICO');
            EliteUtils.log('ARQUITETURA DE VERDADE ATIVADA');
            EliteUtils.log('========================================');
            
            const sessionHash = window.ELITE_SECURE_HASH || MASTER_HASH;
            secureStorage = new SecureStorage(sessionHash);
            window.SecureStorageInstance = secureStorage;
            
            // Inicializar todos os módulos
            if (window.StrategicVault && typeof window.StrategicVault.initialize === 'function') {
                window.StrategicVault.initialize(sessionHash);
                EliteUtils.log('✅ Strategic Vault inicializado');
            }
            
            if (window.BlackSwan && typeof window.BlackSwan.initialize === 'function') {
                window.BlackSwan.initialize();
                EliteUtils.log('✅ Black Swan Predictor inicializado');
            }
            
            if (window.RiskMitigationEngine && typeof window.RiskMitigationEngine.initialize === 'function') {
                window.RiskMitigationEngine.initialize();
                EliteUtils.log('✅ Risk Mitigation Engine inicializado');
            }
            
            if (window.JudgeBiometrics && typeof window.JudgeBiometrics.initialize === 'function') {
                window.JudgeBiometrics.initialize();
                EliteUtils.log('✅ Judicial Behavioral Analytics inicializado');
            }
            
            if (window.BlockchainCustody && typeof window.BlockchainCustody.initialize === 'function') {
                window.BlockchainCustody.initialize();
                EliteUtils.log('✅ Blockchain Custody inicializado');
            }
            
            if (window.QuantumLegalAnalytics && typeof window.QuantumLegalAnalytics.initialize === 'function') {
                window.QuantumLegalAnalytics.initialize();
                EliteUtils.log('✅ Quantum Legal Analytics inicializado');
            }
            
            if (window.ShadowDossier && typeof window.ShadowDossier.initialize === 'function') {
                window.ShadowDossier.initialize();
                EliteUtils.log('✅ Shadow Dossier Manager inicializado');
            }
            
            if (window.CourtDeadlines && typeof window.CourtDeadlines.initialize === 'function') {
                window.CourtDeadlines.initialize();
                EliteUtils.log('✅ Court Deadlines inicializado');
            }
            
            if (window.GamificationSystem && typeof window.GamificationSystem.initialize === 'function') {
                window.GamificationSystem.initialize();
                EliteUtils.log('✅ Gamification System inicializado');
            }
            
            if (window.PredictiveLitigation && typeof window.PredictiveLitigation.initialize === 'function') {
                window.PredictiveLitigation.initialize();
                EliteUtils.log('✅ Predictive Litigation inicializado');
            }
            
            if (window.PlatformIntelligence && typeof window.PlatformIntelligence.initialize === 'function') {
                window.PlatformIntelligence.initialize();
                EliteUtils.log('✅ Platform Intelligence inicializado');
            }
            
            if (window.MarketIntelligence && typeof window.MarketIntelligence.initialize === 'function') {
                window.MarketIntelligence.initialize();
                EliteUtils.log('✅ Market Intelligence inicializado');
            }
            
            if (window.LeadIntelligence && typeof window.LeadIntelligence.initialize === 'function') {
                window.LeadIntelligence.initialize();
                EliteUtils.log('✅ Lead Intelligence inicializado');
            }
            
            if (window.ValueEfficiencyEngine && typeof window.ValueEfficiencyEngine.initialize === 'function') {
                window.ValueEfficiencyEngine.initialize();
                EliteUtils.log('✅ Value Efficiency Engine (Gain Share) inicializado');
            }
            
            const savedLocale = localStorage.getItem('elite_locale');
            if (savedLocale && (savedLocale === 'pt' || savedLocale === 'en')) {
                setLocale(savedLocale);
            } else {
                setLocale('pt');
            }
            
            initNavigation();
            updateHeaderStats();
            navigateTo('dashboard');
            EliteUtils.showToast(t('success'), 'success');
            EliteUtils.log(`✅ ${MOCK_CASES.length} processos estratégicos carregados`);
            EliteUtils.log(`📊 Valor total em disputa: ${EliteUtils.formatCurrency(MOCK_CASES.reduce((s,c)=>s+c.value,0))}`);
            EliteUtils.log(`🔐 Storage seguro inicializado com PBKDF2`);
            EliteUtils.log(`🚀 Módulos de inovação estratégica ativos`);
            EliteUtils.log(`🎯 ARQUITETURA DE VERDADE: Shadow Dossier | Black Swan | Decomposição Estratégica`);
            EliteUtils.log(`💰 GAIN SHARE AGREEMENT: Alpha de ${((window.ValueEfficiencyEngine?.calculateAlpha?.().alphaPercentage) || '0')}% gerado`);
            EliteUtils.log(`📋 QUESTIONÁRIOS ESTRATÉGICOS: ${Object.keys(STRATEGIC_QUESTIONS).length} áreas, 50 perguntas por área`);
        },
        
        navigateTo: navigateTo,
        exportCurrentViewToMobile: exportCurrentViewToMobile,
        exportToRegisteredDevice: exportToRegisteredDevice,
        deleteCase: deleteCase,
        generateDeleteConfirmationHash: generateDeleteConfirmationHash,
        setLocale: setLocale,
        t: t,
        getLocale: () => currentLocale,
        getSecureStorage: () => secureStorage,
        showStrategicQuestions: showStrategicQuestionsModal
    };
    
    window.EliteUtils = EliteUtils;
    window.StrategicQuestions = STRATEGIC_QUESTIONS;
    
    EliteUtils.log(`========================================`);
    EliteUtils.log(`ELITE PROBATUM v${APP_VERSION}`);
    EliteUtils.log(`UNIDADE DE COMANDO ESTRATÉGICO`);
    EliteUtils.log(`ARQUITETURA DE VERDADE ATIVADA`);
    EliteUtils.log(`Master Hash: ${MASTER_HASH.substring(0, 16)}...`);
    EliteUtils.log(`${MOCK_CASES.length} processos estratégicos carregados`);
    EliteUtils.log(`Valor total em disputa: ${EliteUtils.formatCurrency(MOCK_CASES.reduce((s,c)=>s+c.value,0))}`);
    EliteUtils.log(`🎯 Arquitetura de Verdade: Shadow Dossier | Black Swan | Decomposição Estratégica`);
    EliteUtils.log(`💰 Modelo Gain Share Agreement: Partilha de Sucesso sobre Alpha Gerado`);
    EliteUtils.log(`📋 Questionários Estratégicos: 6 áreas, 50 perguntas cirúrgicas por área`);
    EliteUtils.log(`========================================`);
    
})();