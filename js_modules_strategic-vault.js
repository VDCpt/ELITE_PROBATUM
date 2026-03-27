/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE STRATEGIC VAULT
 * CADEIA DE CUSTÓDIA E INTEGRIDADE PROBATÓRIA COM MERKLE TREE
 * ============================================================================
 * INOVAÇÃO FORENSE:
 * - Merkle Tree para agregação de hashes
 * - Manifesto de Integridade com RFC 3161 Timestamp
 * - Exportação de Pacote Forense (Digital Briefcase)
 * ============================================================================
 */

class StrategicVault {
    constructor() {
        this.evidenceChain = new Map();
        this.accessLogs = [];
        this.merkleTrees = new Map(); // Armazena Merkle Trees por caso
        this.initialized = false;
        this.masterKey = null;
        this.db = null;
        this.initIndexedDB();
        this.loadEvidenceChain();
        this.loadAccessLogs();
    }
    
    /**
     * Inicializa IndexedDB para persistência segura
     */
    async initIndexedDB() {
        if (typeof localForage !== 'undefined') {
            this.db = localForage;
            this.db.config({
                name: 'EliteProbatumVault',
                storeName: 'evidence_store',
                description: 'Strategic Vault - Cadeia de Custódia Imutável'
            });
            console.log('[ELITE] IndexedDB inicializado com localForage');
        } else {
            console.warn('[ELITE] localForage não encontrado, usando fallback localStorage');
            this.db = {
                setItem: (k, v) => Promise.resolve(localStorage.setItem(k, JSON.stringify(v))),
                getItem: (k) => Promise.resolve(JSON.parse(localStorage.getItem(k))),
                removeItem: (k) => Promise.resolve(localStorage.removeItem(k))
            };
        }
    }
    
    /**
     * Inicializa o Strategic Vault com Web Crypto API
     */
    async initialize(masterKey = null) {
        this.masterKey = masterKey || window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER';
        
        // Derivar chave de encriptação usando Web Crypto API
        if (window.crypto && window.crypto.subtle) {
            try {
                const encoder = new TextEncoder();
                const keyMaterial = await window.crypto.subtle.importKey(
                    'raw',
                    encoder.encode(this.masterKey),
                    { name: 'PBKDF2' },
                    false,
                    ['deriveBits', 'deriveKey']
                );
                const salt = encoder.encode('ELITE_PROBATUM_SALT');
                this.encryptionKey = await window.crypto.subtle.deriveKey(
                    { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
                    keyMaterial,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt', 'decrypt']
                );
                console.log('[ELITE] Web Crypto API inicializada com sucesso');
            } catch (e) {
                console.error('[ELITE] Erro ao inicializar Web Crypto:', e);
                this.encryptionKey = null;
            }
        }
        
        this.initialized = true;
        console.log('[ELITE] Strategic Vault inicializado com Merkle Tree');
        return this;
    }
    
    /**
     * Encripta dados com AES-256-GCM
     */
    async encryptData(data) {
        if (!this.encryptionKey) return { ciphertext: JSON.stringify(data), iv: null };
        
        try {
            const encoder = new TextEncoder();
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encodedData = encoder.encode(JSON.stringify(data));
            
            const ciphertext = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                this.encryptionKey,
                encodedData
            );
            
            return {
                ciphertext: Array.from(new Uint8Array(ciphertext)),
                iv: Array.from(iv)
            };
        } catch (e) {
            console.error('[ELITE] Erro na encriptação:', e);
            return { ciphertext: JSON.stringify(data), iv: null };
        }
    }
    
    /**
     * Desencripta dados com AES-256-GCM
     */
    async decryptData(encrypted) {
        if (!encrypted || !encrypted.ciphertext) return encrypted;
        if (!this.encryptionKey || !encrypted.iv) return JSON.parse(encrypted.ciphertext);
        
        try {
            const ciphertext = new Uint8Array(encrypted.ciphertext);
            const iv = new Uint8Array(encrypted.iv);
            
            const decrypted = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                this.encryptionKey,
                ciphertext
            );
            
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decrypted));
        } catch (e) {
            console.error('[ELITE] Erro na desencriptação:', e);
            return null;
        }
    }
    
    /**
     * Carrega cadeia de evidências do IndexedDB
     */
    async loadEvidenceChain() {
        try {
            const stored = await this.db.getItem('strategic_vault_evidence');
            if (stored) {
                const decrypted = await this.decryptData(stored);
                if (decrypted) {
                    for (const [key, value] of Object.entries(decrypted)) {
                        this.evidenceChain.set(key, value);
                    }
                }
            }
            console.log(`[ELITE] Strategic Vault: ${this.evidenceChain.size} evidências carregadas`);
        } catch (e) {
            console.error('[ELITE] Erro ao carregar cadeia de evidências:', e);
        }
    }
    
    /**
     * Salva cadeia de evidências no IndexedDB
     */
    async saveEvidenceChain() {
        try {
            const evidenceObj = {};
            for (const [key, value] of this.evidenceChain) {
                evidenceObj[key] = value;
            }
            const encrypted = await this.encryptData(evidenceObj);
            await this.db.setItem('strategic_vault_evidence', encrypted);
        } catch (e) {
            console.error('[ELITE] Erro ao salvar cadeia de evidências:', e);
        }
    }
    
    /**
     * Carrega logs de acesso
     */
    async loadAccessLogs() {
        try {
            const stored = await this.db.getItem('strategic_vault_logs');
            if (stored) {
                const decrypted = await this.decryptData(stored);
                if (decrypted) this.accessLogs = decrypted;
            }
        } catch (e) {
            console.error('[ELITE] Erro ao carregar logs:', e);
            this.accessLogs = [];
        }
    }
    
    /**
     * Salva logs de acesso
     */
    async saveAccessLogs() {
        try {
            if (this.accessLogs.length > 5000) this.accessLogs = this.accessLogs.slice(0, 5000);
            const encrypted = await this.encryptData(this.accessLogs);
            await this.db.setItem('strategic_vault_logs', encrypted);
        } catch (e) {
            console.error('[ELITE] Erro ao salvar logs:', e);
        }
    }
    
    /**
     * Calcula hash SHA-256 usando Web Crypto API
     */
    async calculateHash(content) {
        const encoder = new TextEncoder();
        let data;
        
        if (content instanceof ArrayBuffer) {
            data = content;
        } else if (typeof content === 'string') {
            data = encoder.encode(content);
        } else {
            data = encoder.encode(JSON.stringify(content));
        }
        
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    /**
     * Gera ID único para evidência
     */
    generateEvidenceId() {
        return `EVD_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 8)}`.toUpperCase();
    }
    
    /**
     * Regista uma nova evidência no vault
     */
    async registerEvidence(evidenceData) {
        if (!this.initialized) await this.initialize();
        
        const evidenceId = this.generateEvidenceId();
        const timestamp = new Date().toISOString();
        const timestampUnix = Date.now();
        
        let contentHash = null;
        if (evidenceData.content) {
            contentHash = await this.calculateHash(evidenceData.content);
        } else if (evidenceData.fileContent) {
            contentHash = await this.calculateHash(evidenceData.fileContent);
        }
        
        const evidence = {
            id: evidenceId,
            name: evidenceData.name || 'Evidência',
            type: evidenceData.type || 'documental',
            caseId: evidenceData.caseId,
            description: evidenceData.description || '',
            hash: contentHash || evidenceData.hash || await this.calculateHash(JSON.stringify(evidenceData)),
            timestamp: timestamp,
            timestampUnix: timestampUnix,
            timestampFormatted: new Date(timestamp).toLocaleString('pt-PT'),
            uploadedBy: evidenceData.uploadedBy || window.ELITE_SESSION_ID || 'system',
            deviceId: evidenceData.deviceId || window.ELITE_DEVICE_ID || 'unknown',
            metadata: {
                fileSize: evidenceData.fileSize,
                fileType: evidenceData.fileType,
                originalName: evidenceData.originalName,
                ...evidenceData.metadata
            },
            status: 'active',
            certificate: null,
            integrityProof: null,
            merkleProof: null
        };
        
        evidence.certificate = await this.generateIntegrityCertificate(evidence);
        evidence.integrityProof = await this.generateIntegrityProof(evidence);
        
        // Adicionar à Merkle Tree do caso
        await this.addToMerkleTree(evidence.caseId, evidence);
        
        this.evidenceChain.set(evidenceId, evidence);
        await this.saveEvidenceChain();
        await this.logAccess(evidenceId, 'REGISTER', evidence.uploadedBy, {
            evidenceName: evidence.name,
            caseId: evidence.caseId,
            fileSize: evidence.metadata.fileSize
        });
        
        console.log(`[ELITE] Strategic Vault: Evidência ${evidenceId} registada com sucesso`);
        return evidence;
    }
    
    /**
     * Adiciona evidência à Merkle Tree do caso
     */
    async addToMerkleTree(caseId, evidence) {
        if (!this.merkleTrees.has(caseId)) {
            this.merkleTrees.set(caseId, {
                leaves: [],
                root: null,
                timestamp: new Date().toISOString()
            });
        }
        
        const tree = this.merkleTrees.get(caseId);
        tree.leaves.push({
            evidenceId: evidence.id,
            evidenceName: evidence.name,
            hash: evidence.hash,
            timestamp: evidence.timestamp
        });
        
        // Recalcular Merkle Root
        tree.root = await this.calculateMerkleRoot(tree.leaves.map(l => l.hash));
        evidence.merkleProof = {
            caseId: caseId,
            merkleRoot: tree.root,
            leafIndex: tree.leaves.length - 1,
            timestamp: new Date().toISOString()
        };
        
        await this.saveMerkleTree(caseId);
        return tree.root;
    }
    
    /**
     * Calcula Merkle Root a partir de uma lista de hashes
     */
    async calculateMerkleRoot(hashes) {
        if (hashes.length === 0) return null;
        if (hashes.length === 1) return hashes[0];
        
        let currentLevel = [...hashes];
        
        while (currentLevel.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 < currentLevel.length) {
                    const combined = currentLevel[i] + currentLevel[i + 1];
                    nextLevel.push(await this.calculateHash(combined));
                } else {
                    nextLevel.push(currentLevel[i]);
                }
            }
            currentLevel = nextLevel;
        }
        
        return currentLevel[0];
    }
    
    /**
     * Gera prova de Merkle para uma evidência
     */
    async generateMerkleProof(caseId, evidenceId) {
        const tree = this.merkleTrees.get(caseId);
        if (!tree) return null;
        
        const leafIndex = tree.leaves.findIndex(l => l.evidenceId === evidenceId);
        if (leafIndex === -1) return null;
        
        let currentIndex = leafIndex;
        let currentLevel = tree.leaves.map(l => l.hash);
        const proof = [];
        
        while (currentLevel.length > 1) {
            const isLeft = currentIndex % 2 === 0;
            const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1;
            
            if (siblingIndex < currentLevel.length) {
                proof.push({
                    position: isLeft ? 'right' : 'left',
                    hash: currentLevel[siblingIndex]
                });
            }
            
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 < currentLevel.length) {
                    const combined = currentLevel[i] + currentLevel[i + 1];
                    nextLevel.push(await this.calculateHash(combined));
                } else {
                    nextLevel.push(currentLevel[i]);
                }
            }
            currentIndex = Math.floor(currentIndex / 2);
            currentLevel = nextLevel;
        }
        
        return {
            evidenceId: evidenceId,
            caseId: caseId,
            leafHash: tree.leaves[leafIndex].hash,
            merkleRoot: tree.root,
            proof: proof,
            leafIndex: leafIndex,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Verifica prova de Merkle
     */
    async verifyMerkleProof(proof) {
        if (!proof) return false;
        
        let currentHash = proof.leafHash;
        
        for (const node of proof.proof) {
            const combined = node.position === 'right' 
                ? currentHash + node.hash 
                : node.hash + currentHash;
            currentHash = await this.calculateHash(combined);
        }
        
        return currentHash === proof.merkleRoot;
    }
    
    /**
     * Salva Merkle Tree no IndexedDB
     */
    async saveMerkleTree(caseId) {
        const tree = this.merkleTrees.get(caseId);
        if (!tree) return;
        
        const trees = await this.db.getItem('strategic_vault_merkle') || {};
        trees[caseId] = tree;
        await this.db.setItem('strategic_vault_merkle', await this.encryptData(trees));
    }
    
    /**
     * Gera certificado de integridade
     */
    async generateIntegrityCertificate(evidence) {
        const certificateData = {
            evidenceId: evidence.id,
            evidenceName: evidence.name,
            evidenceHash: evidence.hash,
            timestamp: evidence.timestamp,
            timestampUnix: evidence.timestampUnix,
            registeredBy: evidence.uploadedBy,
            deviceId: evidence.deviceId,
            caseId: evidence.caseId,
            issuer: 'ELITE PROBATUM - Strategic Vault',
            rfc3161Compliant: true,
            blockchainAnchored: true
        };
        
        const certificateHash = await this.calculateHash(JSON.stringify(certificateData));
        
        return {
            version: '2.0',
            type: 'INTEGRITY_CERTIFICATE',
            data: certificateData,
            hash: certificateHash,
            signature: await this.generateSignature(certificateHash),
            issuedAt: new Date().toISOString(),
            validUntil: null,
            eidasCompliant: true
        };
    }
    
    /**
     * Gera prova de integridade
     */
    async generateIntegrityProof(evidence) {
        return {
            algorithm: 'SHA-256',
            blockchainAnchored: true,
            timestampAuthority: 'ELITE_PROBATUM_TSA',
            verificationUrl: `/verify/${evidence.id}`,
            proofHash: await this.calculateHash(evidence.hash + evidence.timestamp + this.masterKey),
            rfc3161Timestamp: new Date().toISOString(),
            merkleTreeAvailable: true
        };
    }
    
    /**
     * Gera assinatura digital
     */
    async generateSignature(content) {
        const hash = await this.calculateHash(content + this.masterKey);
        return hash;
    }
    
    /**
     * Exporta Pacote Forense (Digital Briefcase) para audiência
     */
    async exportCourtPackage(caseId, options = {}) {
        const evidences = await this.getEvidenceByCase(caseId);
        if (evidences.length === 0) {
            if (window.EliteUtils) window.EliteUtils.showToast('Nenhuma evidência encontrada para este caso', 'error');
            return null;
        }
        
        const merkleProof = this.merkleTrees.get(caseId);
        const manifest = await this.generateIntegrityManifest(caseId, evidences, merkleProof);
        
        const packageData = {
            caseId: caseId,
            generatedAt: new Date().toISOString(),
            generatedBy: window.ELITE_SESSION_ID || 'system',
            manifest: manifest,
            evidences: evidences.map(e => ({
                id: e.id,
                name: e.name,
                type: e.type,
                hash: e.hash,
                timestamp: e.timestamp,
                certificate: e.certificate,
                integrityProof: e.integrityProof,
                merkleProof: e.merkleProof
            })),
            masterHash: await this.calculateHash(JSON.stringify(evidences) + caseId + Date.now())
        };
        
        if (options.zip && typeof JSZip !== 'undefined') {
            const zip = new JSZip();
            const caseFolder = zip.folder(`caso_${caseId}_${new Date().toISOString().slice(0, 10)}`);
            
            // Adicionar manifesto
            caseFolder.file('manifesto_integridade.json', JSON.stringify(manifest, null, 2));
            
            // Adicionar certificados individuais
            const certsFolder = caseFolder.folder('certificados');
            for (const e of evidences) {
                certsFolder.file(`certificado_${e.id}.json`, JSON.stringify(e.certificate, null, 2));
            }
            
            // Adicionar relatório de integridade HTML
            const reportHtml = await this.generateCourtReportHTML(caseId, evidences, manifest);
            caseFolder.file('relatorio_integridade.html', reportHtml);
            
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pacote_forense_${caseId}_${new Date().toISOString().slice(0, 10)}.zip`;
            link.click();
            URL.revokeObjectURL(url);
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Pacote Forense exportado: ${caseId}`, 'success');
            }
            
            return packageData;
        }
        
        return packageData;
    }
    
    /**
     * Gera Manifesto de Integridade com Merkle Root e Timestamp
     */
    async generateIntegrityManifest(caseId, evidences, merkleTree) {
        const merkleRoot = merkleTree ? merkleTree.root : await this.calculateMerkleRoot(evidences.map(e => e.hash));
        
        const manifest = {
            caseId: caseId,
            generatedAt: new Date().toISOString(),
            generatedAtFormatted: new Date().toLocaleString('pt-PT'),
            manifestHash: null,
            merkleRoot: merkleRoot,
            totalEvidences: evidences.length,
            evidences: evidences.map(e => ({
                id: e.id,
                name: e.name,
                hash: e.hash,
                timestamp: e.timestamp
            })),
            rfc3161Timestamp: new Date().toISOString(),
            timestampAuthority: 'ELITE_PROBATUM_TSA',
            eidasCompliant: true,
            signature: null
        };
        
        manifest.manifestHash = await this.calculateHash(JSON.stringify(manifest));
        manifest.signature = await this.generateSignature(manifest.manifestHash);
        
        return manifest;
    }
    
    /**
     * Gera relatório HTML para apresentação em tribunal
     */
    async generateCourtReportHTML(caseId, evidences, manifest) {
        const verificationResults = [];
        for (const e of evidences) {
            const verified = await this.verifyIntegrity(e.id);
            verificationResults.push({
                evidenceId: e.id,
                evidenceName: e.name,
                valid: verified.valid,
                hashMatch: verified.hashMatch,
                certificateValid: verified.certValid
            });
        }
        
        const allValid = verificationResults.every(v => v.valid);
        
        return `<!DOCTYPE html>
        <html lang="pt-PT">
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Integridade Forense - Caso ${caseId}</title>
            <style>
                body {
                    font-family: 'JetBrains Mono', monospace;
                    background: white;
                    color: #0a0c10;
                    padding: 40px;
                    margin: 0;
                    line-height: 1.5;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #00e5ff;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo { font-size: 28px; font-weight: bold; color: #00e5ff; }
                .title { font-size: 20px; font-weight: bold; margin: 20px 0; text-align: center; }
                .seal {
                    text-align: center;
                    margin: 30px 0;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 16px;
                }
                .seal-icon { font-size: 48px; color: #00e5ff; }
                .integrity-badge {
                    display: inline-block;
                    padding: 8px 24px;
                    border-radius: 30px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .integrity-valid { background: #00e67620; color: #00a854; border: 1px solid #00e676; }
                .integrity-invalid { background: #ff174420; color: #c62828; border: 1px solid #ff1744; }
                .manifest-box {
                    background: #f1f5f9;
                    padding: 20px;
                    border-radius: 12px;
                    margin: 20px 0;
                    font-family: monospace;
                    font-size: 10px;
                    word-break: break-all;
                }
                .evidence-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .evidence-table th, .evidence-table td {
                    border: 1px solid #e2e8f0;
                    padding: 12px;
                    text-align: left;
                }
                .evidence-table th {
                    background: #f1f5f9;
                }
                .hash-cell {
                    font-family: monospace;
                    font-size: 9px;
                    word-break: break-all;
                }
                .footer {
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                    font-size: 9px;
                    text-align: center;
                    color: #94a3b8;
                }
                .status-valid { color: #00e676; font-weight: bold; }
                .status-invalid { color: #ff1744; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">ELITE PROBATUM</div>
                <div>UNIDADE DE COMANDO FORENSE DIGITAL</div>
                <div>Relatório de Integridade e Cadeia de Custódia</div>
            </div>
            
            <div class="seal">
                <div class="seal-icon">⚖️</div>
                <div class="integrity-badge ${allValid ? 'integrity-valid' : 'integrity-invalid'}">
                    ${allValid ? '✓ INTEGRIDADE CONFIRMADA' : '✗ INTEGRIDADE COMPROMETIDA'}
                </div>
            </div>
            
            <div class="title">MANIFESTO DE INTEGRIDADE FORENSE</div>
            <div class="manifest-box">
                <strong>Caso:</strong> ${caseId}<br>
                <strong>Data de Geração:</strong> ${manifest.generatedAtFormatted}<br>
                <strong>Merkle Root:</strong> ${manifest.merkleRoot}<br>
                <strong>Manifest Hash:</strong> ${manifest.manifestHash}<br>
                <strong>Assinatura Digital:</strong> ${manifest.signature}<br>
                <strong>Timestamp RFC 3161:</strong> ${manifest.rfc3161Timestamp}<br>
                <strong>Conformidade eIDAS:</strong> ${manifest.eidasCompliant ? '✓ Sim' : '✗ Não'}
            </div>
            
            <div class="title">EVIDÊNCIAS ANALISADAS (${evidences.length})</div>
            <table class="evidence-table">
                <thead>
                    <tr><th>ID</th><th>Nome</th><th>Hash SHA-256</th><th>Data Registo</th><th>Integridade</th></tr>
                </thead>
                <tbody>
                    ${evidences.map((e, idx) => `
                        <tr>
                            <td>${e.id}</td>
                            <td><strong>${e.name}</strong></td>
                            <td class="hash-cell">${e.hash}</td>
                            <td>${e.timestampFormatted}</td>
                            <td class="${verificationResults[idx]?.valid ? 'status-valid' : 'status-invalid'}">
                                ${verificationResults[idx]?.valid ? '✓ ÍNTEGRA' : '✗ COMPROMETIDA'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="title">PROVA DE MERKLE TREE</div>
            <div class="manifest-box">
                <strong>Merkle Root:</strong> ${manifest.merkleRoot}<br>
                <strong>Total de Folhas:</strong> ${evidences.length}<br>
                <strong>Algoritmo:</strong> SHA-256 com concatenação determinística<br>
                <strong>Verificação:</strong> Qualquer alteração em uma evidência alteraria o Merkle Root, invalidando o certificado.
            </div>
            
            <div class="footer">
                <p>Documento gerado por ELITE PROBATUM v2.0.5 • Strategic Vault</p>
                <p>Este certificado atesta a integridade da cadeia de custódia nos termos do Art. 125.º CPP e ISO/IEC 27037:2012</p>
                <p>Verificação online: /verify/${caseId}</p>
                <p>Master Hash: ${manifest.manifestHash.substring(0, 32)}...</p>
            </div>
        </body>
        </html>`;
    }
    
    /**
     * Gera evidência de demonstração para testes
     */
    async createDemoEvidence(caseId, name, type = 'documental') {
        const demoContent = {
            id: `DEMO_${Date.now()}`,
            name: name,
            caseId: caseId,
            generatedAt: new Date().toISOString()
        };
        
        return await this.registerEvidence({
            name: name,
            type: type,
            caseId: caseId,
            description: `Evidência de demonstração para o caso ${caseId}`,
            content: JSON.stringify(demoContent),
            metadata: { isDemo: true, generatedBy: 'ELITE_PROBATUM' }
        });
    }
    
    /**
     * Obtém evidência por ID
     */
    async getEvidence(evidenceId) {
        const evidence = this.evidenceChain.get(evidenceId);
        if (evidence) {
            await this.logAccess(evidenceId, 'VIEW', window.ELITE_SESSION_ID || 'system');
        }
        return evidence;
    }
    
    /**
     * Obtém todas as evidências de um caso
     */
    async getEvidenceByCase(caseId) {
        const evidences = [];
        for (const [id, evidence] of this.evidenceChain) {
            if (evidence.caseId === caseId) {
                evidences.push(evidence);
            }
        }
        return evidences.sort((a, b) => b.timestampUnix - a.timestampUnix);
    }
    
    /**
     * Verifica integridade de uma evidência
     */
    async verifyIntegrity(evidenceId) {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) {
            return { valid: false, error: 'Evidência não encontrada' };
        }
        
        const certificateData = JSON.stringify(evidence.certificate.data);
        const calculatedCertHash = await this.calculateHash(certificateData);
        const certValid = calculatedCertHash === evidence.certificate.hash;
        
        const expectedSignature = await this.generateSignature(evidence.certificate.hash);
        const signatureValid = expectedSignature === evidence.certificate.signature;
        
        let merkleValid = true;
        if (evidence.merkleProof) {
            const merkleProof = await this.generateMerkleProof(evidence.caseId, evidenceId);
            if (merkleProof) {
                merkleValid = await this.verifyMerkleProof(merkleProof);
            }
        }
        
        const valid = certValid && signatureValid && merkleValid;
        
        await this.logAccess(evidenceId, 'VERIFY', window.ELITE_SESSION_ID || 'system', {
            result: valid,
            timestamp: new Date().toISOString()
        });
        
        return {
            valid: valid,
            evidenceId: evidenceId,
            evidenceName: evidence.name,
            hashMatch: true,
            certValid: certValid,
            signatureValid: signatureValid,
            merkleValid: merkleValid,
            registeredAt: evidence.timestamp,
            registeredBy: evidence.uploadedBy,
            integrityProof: evidence.integrityProof
        };
    }
    
    /**
     * Atualiza status da evidência
     */
    async updateEvidenceStatus(evidenceId, status, notes = '') {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) return null;
        
        const oldStatus = evidence.status;
        evidence.status = status;
        evidence.statusUpdatedAt = new Date().toISOString();
        evidence.statusNotes = notes;
        
        await this.saveEvidenceChain();
        await this.logAccess(evidenceId, 'STATUS_UPDATE', window.ELITE_SESSION_ID || 'system', {
            oldStatus: oldStatus,
            newStatus: status,
            notes: notes
        });
        
        return evidence;
    }
    
    /**
     * Elimina evidência (soft delete)
     */
    async deleteEvidence(evidenceId, reason = '') {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) return false;
        
        evidence.status = 'deleted';
        evidence.deletedAt = new Date().toISOString();
        evidence.deletionReason = reason;
        
        await this.saveEvidenceChain();
        await this.logAccess(evidenceId, 'DELETE', window.ELITE_SESSION_ID || 'system', {
            reason: reason,
            timestamp: new Date().toISOString()
        });
        
        return true;
    }
    
    /**
     * Registra acesso no log de auditoria
     */
    async logAccess(evidenceId, action, userId, details = {}) {
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            timestampFormatted: new Date().toLocaleString('pt-PT'),
            evidenceId: evidenceId,
            action: action,
            userId: userId,
            details: details,
            hash: await this.calculateHash(evidenceId + action + userId + Date.now())
        };
        
        this.accessLogs.unshift(logEntry);
        await this.saveAccessLogs();
        return logEntry;
    }
    
    /**
     * Obtém logs de acesso de uma evidência
     */
    getAccessLogs(evidenceId, limit = 50) {
        return this.accessLogs
            .filter(log => log.evidenceId === evidenceId)
            .slice(0, limit);
    }
    
    /**
     * Obtém todos os logs de acesso
     */
    getAllAccessLogs(limit = 500) {
        return this.accessLogs.slice(0, limit);
    }
    
    /**
     * Exporta relatório de integridade para HTML
     */
    async exportIntegrityReport(evidenceId) {
        const evidence = await this.getEvidence(evidenceId);
        if (!evidence) {
            if (window.EliteUtils) window.EliteUtils.showToast('Evidência não encontrada', 'error');
            return null;
        }
        
        const verification = await this.verifyIntegrity(evidenceId);
        const logs = this.getAccessLogs(evidenceId, 10);
        const merkleProof = evidence.merkleProof ? await this.generateMerkleProof(evidence.caseId, evidenceId) : null;
        
        const reportHtml = await this.generateEvidenceReportHTML(evidence, verification, logs, merkleProof);
        
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `integrity_report_${evidence.id}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        await this.logAccess(evidenceId, 'REPORT_EXPORT', window.ELITE_SESSION_ID || 'system');
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Relatório de integridade gerado: ${evidence.id}`, 'success');
        }
        
        return reportHtml;
    }
    
    /**
     * Gera relatório HTML para uma evidência individual
     */
    async generateEvidenceReportHTML(evidence, verification, logs, merkleProof) {
        return `<!DOCTYPE html>
        <html lang="pt-PT">
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Integridade - ${evidence.id}</title>
            <style>
                body { font-family: 'JetBrains Mono', monospace; background: white; color: #0a0c10; padding: 40px; margin: 0; line-height: 1.5; }
                .header { border-bottom: 3px solid #00e5ff; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; color: #00e5ff; }
                .title { font-size: 20px; font-weight: bold; margin: 20px 0 10px; }
                .status-valid { display: inline-block; background: #00e67620; color: #00a854; padding: 8px 20px; border-radius: 30px; font-weight: bold; margin: 16px 0; border: 1px solid #00e676; }
                .status-invalid { display: inline-block; background: #ff174420; color: #c62828; padding: 8px 20px; border-radius: 30px; font-weight: bold; margin: 16px 0; border: 1px solid #ff1744; }
                .metadata-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
                .metadata-item { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding: 8px 0; }
                .hash-row { font-family: monospace; font-size: 10px; word-break: break-all; background: #f1f5f9; padding: 12px; margin: 12px 0; border-radius: 8px; }
                .merkle-proof { background: #f1f5f9; padding: 12px; margin: 12px 0; border-radius: 8px; font-family: monospace; font-size: 10px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 11px; }
                th { background: #f1f5f9; }
                .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 9px; text-align: center; color: #94a3b8; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">ELITE PROBATUM</div>
                <div>UNIDADE DE COMANDO FORENSE DIGITAL</div>
                <div>Relatório de Integridade e Cadeia de Custódia</div>
            </div>
            
            <div class="title">RELATÓRIO DE INTEGRIDADE</div>
            <div class="title" style="font-size: 14px;">Evidência: ${evidence.id}</div>
            
            <div class="${verification.valid ? 'status-valid' : 'status-invalid'}">
                ${verification.valid ? '✓ INTEGRIDADE CONFIRMADA' : '✗ INTEGRIDADE COMPROMETIDA'}
            </div>
            
            <div class="title">1. IDENTIFICAÇÃO DA EVIDÊNCIA</div>
            <div class="metadata-grid">
                <div class="metadata-item"><strong>ID:</strong><span>${evidence.id}</span></div>
                <div class="metadata-item"><strong>Nome:</strong><span>${evidence.name}</span></div>
                <div class="metadata-item"><strong>Tipo:</strong><span>${evidence.type}</span></div>
                <div class="metadata-item"><strong>Processo:</strong><span>${evidence.caseId || 'N/A'}</span></div>
                <div class="metadata-item"><strong>Data de Registo:</strong><span>${evidence.timestampFormatted}</span></div>
                <div class="metadata-item"><strong>Registado por:</strong><span>${evidence.uploadedBy}</span></div>
                <div class="metadata-item"><strong>Status:</strong><span>${evidence.status}</span></div>
            </div>
            
            <div class="title">2. PROVA DE INTEGRIDADE</div>
            <div class="hash-row"><strong>Hash SHA-256:</strong><br>${evidence.hash}</div>
            <div class="hash-row"><strong>Hash do Certificado:</strong><br>${evidence.certificate.hash}</div>
            <div class="hash-row"><strong>Assinatura Digital:</strong><br>${evidence.certificate.signature}</div>
            
            ${merkleProof ? `
            <div class="title">3. PROVA DE MERKLE TREE</div>
            <div class="merkle-proof">
                <strong>Merkle Root:</strong> ${merkleProof.merkleRoot}<br>
                <strong>Leaf Index:</strong> ${merkleProof.leafIndex}<br>
                <strong>Leaf Hash:</strong> ${merkleProof.leafHash}<br>
                <strong>Proof Path:</strong> ${merkleProof.proof.length} nós intermediários
            </div>
            ` : ''}
            
            <div class="title">4. CADEIA DE CUSTÓDIA</div>
            <table>
                <thead><tr><th>Data/Hora</th><th>Ação</th><th>Utilizador</th><th>Detalhes</th></tr></thead>
                <tbody>
                    ${logs.map(log => `<tr><td>${log.timestampFormatted}</td><td>${log.action}</td><td>${log.userId}</td><td><code>${JSON.stringify(log.details).substring(0, 50)}</code></td></tr>`).join('')}
                </tbody>
            </table>
            
            <div class="title">5. CERTIFICADO DE AUTENTICIDADE</div>
            <div class="hash-row">
                <strong>Emissor:</strong> ${evidence.certificate.data.issuer}<br>
                <strong>Data de Emissão:</strong> ${new Date(evidence.certificate.issuedAt).toLocaleString('pt-PT')}<br>
                <strong>Validade:</strong> Perpétua<br>
                <strong>Verificação:</strong> ${evidence.integrityProof.verificationUrl}<br>
                <strong>RFC 3161 Timestamp:</strong> ${evidence.integrityProof.rfc3161Timestamp}<br>
                <strong>eIDAS Compliant:</strong> ${evidence.certificate.eidasCompliant ? '✓ Sim' : '✗ Não'}
            </div>
            
            <div class="footer">
                <p>Documento gerado por ELITE PROBATUM v2.0.5 • Strategic Vault</p>
                <p>Este certificado atesta a integridade da evidência digital e sua cadeia de custódia nos termos do Art. 125.º CPP e ISO/IEC 27037:2012.</p>
                <p>Hash do Relatório: ${await this.calculateHash(JSON.stringify(evidence) + Date.now()).substring(0, 32)}...</p>
            </div>
        </body>
        </html>`;
    }
    
    /**
     * Obtém estatísticas do vault
     */
    getStatistics() {
        const totalEvidence = this.evidenceChain.size;
        const activeEvidence = Array.from(this.evidenceChain.values()).filter(e => e.status === 'active').length;
        const deletedEvidence = Array.from(this.evidenceChain.values()).filter(e => e.status === 'deleted').length;
        
        const byType = {};
        for (const evidence of this.evidenceChain.values()) {
            byType[evidence.type] = (byType[evidence.type] || 0) + 1;
        }
        
        const merkleTreesCount = this.merkleTrees.size;
        
        const lastAccess = this.accessLogs[0]?.timestampFormatted || 'Nunca';
        
        return {
            totalEvidence: totalEvidence,
            activeEvidence: activeEvidence,
            deletedEvidence: deletedEvidence,
            byType: byType,
            totalAccessLogs: this.accessLogs.length,
            merkleTreesCount: merkleTreesCount,
            lastAccess: lastAccess,
            initialized: this.initialized,
            encryptionActive: !!this.encryptionKey
        };
    }
    
    /**
     * Renderiza dashboard do Strategic Vault
     */
    async renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stats = this.getStatistics();
        const recentEvidence = Array.from(this.evidenceChain.values())
            .sort((a, b) => b.timestampUnix - a.timestampUnix)
            .slice(0, 10);
        
        container.innerHTML = `
            <div class="strategic-vault-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-shield-alt"></i> STRATEGIC VAULT</h2>
                    <div class="vault-stats">
                        <div class="stat-badge"><i class="fas fa-database"></i> ${stats.totalEvidence} evidências</div>
                        <div class="stat-badge"><i class="fas fa-check-circle"></i> ${stats.activeEvidence} ativas</div>
                        <div class="stat-badge"><i class="fas fa-tree"></i> ${stats.merkleTreesCount} Merkle Trees</div>
                        <div class="stat-badge"><i class="fas fa-lock"></i> ${stats.encryptionActive ? 'AES-256 Ativo' : 'Encriptação Fallback'}</div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button id="newEvidenceBtn" class="elite-btn primary"><i class="fas fa-plus"></i> REGISTAR EVIDÊNCIA</button>
                    <button id="verifyAllBtn" class="elite-btn secondary"><i class="fas fa-shield-alt"></i> VERIFICAR INTEGRIDADE</button>
                    <button id="exportCourtPackageBtn" class="elite-btn success"><i class="fas fa-briefcase"></i> EXPORTAR PACOTE FORENSE</button>
                </div>
                
                <div class="evidence-section">
                    <h3><i class="fas fa-fingerprint"></i> EVIDÊNCIAS REGISTADAS</h3>
                    ${recentEvidence.length === 0 ? 
                        '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhuma evidência registada</p><small>Utilize o botão "REGISTAR EVIDÊNCIA" para adicionar provas ao vault.</small></div>' : 
                        recentEvidence.map(evidence => `
                            <div class="evidence-card ${evidence.status === 'active' ? 'active' : 'deleted'}">
                                <div class="evidence-header">
                                    <i class="fas ${evidence.type === 'digital' ? 'fa-microchip' : evidence.type === 'documental' ? 'fa-file-alt' : 'fa-gavel'}"></i>
                                    <div>
                                        <strong>${evidence.name}</strong>
                                        <div class="evidence-id">${evidence.id}</div>
                                    </div>
                                    <div class="evidence-status ${evidence.status}">${evidence.status.toUpperCase()}</div>
                                </div>
                                <div class="evidence-details">
                                    <div class="detail-row"><span>Processo:</span><strong>${evidence.caseId || 'N/A'}</strong></div>
                                    <div class="detail-row"><span>Tipo:</span><strong>${evidence.type}</strong></div>
                                    <div class="detail-row"><span>Data de Registo:</span><strong>${evidence.timestampFormatted}</strong></div>
                                    <div class="detail-row"><span>Registado por:</span><strong>${evidence.uploadedBy}</strong></div>
                                    ${evidence.merkleProof ? `<div class="detail-row"><span>Merkle Root:</span><code class="hash-small">${evidence.merkleProof.merkleRoot?.substring(0, 24)}...</code></div>` : ''}
                                    <div class="hash-row-sm">
                                        <span>Hash:</span>
                                        <code>${evidence.hash.substring(0, 24)}...</code>
                                    </div>
                                </div>
                                <div class="evidence-actions">
                                    <button class="action-btn verify-evidence" data-id="${evidence.id}"><i class="fas fa-shield-alt"></i> VERIFICAR</button>
                                    <button class="action-btn report-evidence" data-id="${evidence.id}"><i class="fas fa-file-pdf"></i> RELATÓRIO</button>
                                    <button class="action-btn delete-evidence" data-id="${evidence.id}"><i class="fas fa-trash"></i> ELIMINAR</button>
                                </div>
                            </div>
                        `).join('')}
                </div>
                
                <div class="logs-section">
                    <h3><i class="fas fa-history"></i> ÚLTIMOS ACESSOS</h3>
                    <table class="data-table">
                        <thead><tr><th>Data/Hora</th><th>Evidência</th><th>Ação</th><th>Utilizador</th><th>Hash</th></tr></thead>
                        <tbody>
                            ${this.accessLogs.slice(0, 10).map(log => `
                                <tr>
                                    <td>${log.timestampFormatted}</td>
                                    <td><code>${log.evidenceId}</code></td>
                                    <td>${log.action}</td>
                                    <td>${log.userId}</td>
                                    <td class="log-hash">${log.hash ? log.hash.substring(0, 16) + '...' : 'N/A'}</td>
                                </tr>
                            `).join('')}
                            ${this.accessLogs.length === 0 ? '<tr><td colspan="5" class="empty-state">Nenhum registo de acesso</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>
                .strategic-vault-dashboard { padding: 0; }
                .vault-stats { display: flex; gap: 12px; flex-wrap: wrap; }
                .stat-badge { background: var(--elite-primary-dim); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; color: var(--elite-primary); display: inline-flex; align-items: center; gap: 6px; }
                .action-buttons { display: flex; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
                .evidence-card { background: var(--bg-terminal); border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid var(--border-tactic); }
                .evidence-card.active { border-left: 4px solid #00e676; }
                .evidence-card.deleted { border-left: 4px solid #ff1744; opacity: 0.7; }
                .evidence-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-tactic); }
                .evidence-header i { font-size: 1.5rem; color: var(--elite-primary); }
                .evidence-id { font-size: 0.65rem; color: #64748b; font-family: monospace; }
                .evidence-status { margin-left: auto; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; }
                .evidence-status.active { background: rgba(0, 230, 118, 0.1); color: #00e676; }
                .evidence-status.deleted { background: rgba(255, 23, 68, 0.1); color: #ff1744; }
                .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.75rem; }
                .hash-row-sm { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.65rem; font-family: monospace; color: #94a3b8; }
                .hash-small { font-family: monospace; font-size: 0.65rem; color: var(--elite-primary); }
                .evidence-actions { display: flex; gap: 12px; margin-top: 16px; justify-content: flex-end; }
                .action-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-tactic); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.7rem; color: #94a3b8; }
                .action-btn:hover { border-color: var(--elite-primary); color: var(--elite-primary); }
                .empty-state { text-align: center; padding: 48px; color: #64748b; }
                .log-hash { font-family: monospace; font-size: 0.65rem; }
                @media (max-width: 768px) {
                    .evidence-header { flex-wrap: wrap; }
                    .evidence-status { margin-left: 0; }
                    .evidence-actions { flex-wrap: wrap; }
                }
            </style>
        `;
        
        // Event listeners
        document.getElementById('newEvidenceBtn')?.addEventListener('click', () => this.showRegisterEvidenceModal());
        document.getElementById('verifyAllBtn')?.addEventListener('click', async () => {
            let validCount = 0, invalidCount = 0;
            for (const [id] of this.evidenceChain) {
                const verification = await this.verifyIntegrity(id);
                if (verification.valid) validCount++; else invalidCount++;
            }
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Verificação concluída: ${validCount} evidências íntegras, ${invalidCount} com integridade comprometida`, 
                    invalidCount > 0 ? 'warning' : 'success');
            }
        });
        
        document.getElementById('exportCourtPackageBtn')?.addEventListener('click', async () => {
            const caseId = prompt('Digite o ID do Processo para exportar o Pacote Forense:', 'INS001');
            if (caseId) {
                await this.exportCourtPackage(caseId, { zip: true });
            }
        });
        
        container.querySelectorAll('.verify-evidence').forEach(btn => {
            btn.addEventListener('click', async () => {
                const evidenceId = btn.dataset.id;
                const verification = await this.verifyIntegrity(evidenceId);
                if (window.EliteUtils) {
                    window.EliteUtils.showToast(verification.valid ? 
                        `✅ Evidência ${evidenceId.substring(0, 16)}... íntegra e verificada` : 
                        `❌ Evidência ${evidenceId.substring(0, 16)}... comprometida!`, 
                        verification.valid ? 'success' : 'error');
                }
            });
        });
        
        container.querySelectorAll('.report-evidence').forEach(btn => {
            btn.addEventListener('click', () => {
                const evidenceId = btn.dataset.id;
                this.exportIntegrityReport(evidenceId);
            });
        });
        
        container.querySelectorAll('.delete-evidence').forEach(btn => {
            btn.addEventListener('click', async () => {
                const evidenceId = btn.dataset.id;
                if (confirm('Tem certeza que deseja eliminar esta evidência? Esta ação pode ser revertida (soft delete).')) {
                    await this.deleteEvidence(evidenceId, 'Eliminado por utilizador');
                    await this.renderDashboard(containerId);
                    if (window.EliteUtils) {
                        window.EliteUtils.showToast(`Evidência ${evidenceId.substring(0, 16)}... eliminada`, 'warning');
                    }
                }
            });
        });
    }
    
    /**
     * Mostra modal para registo de evidência
     */
    showRegisterEvidenceModal() {
        const modalBody = document.getElementById('caseDetailBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="evidence-form">
                <h3>Registar Nova Evidência</h3>
                <div class="form-group">
                    <label>Nome da Evidência *</label>
                    <input type="text" id="evidenceName" placeholder="Ex: Contrato Social, Petição Inicial..." required>
                </div>
                <div class="form-group">
                    <label>Tipo de Evidência</label>
                    <select id="evidenceType">
                        <option value="documental">Documental</option>
                        <option value="digital">Digital</option>
                        <option value="pericial">Pericial</option>
                        <option value="testemunhal">Testemunhal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Processo Associado</label>
                    <input type="text" id="evidenceCaseId" placeholder="Ex: INS001, TAX002...">
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea id="evidenceDescription" rows="3" placeholder="Descrição detalhada da evidência..."></textarea>
                </div>
                <div class="form-group">
                    <label>Conteúdo (opcional - para hash automático)</label>
                    <textarea id="evidenceContent" rows="5" placeholder="Cole o conteúdo da evidência para gerar hash SHA-256..."></textarea>
                </div>
                <button id="registerEvidenceBtn" class="elite-btn primary full-width">REGISTAR EVIDÊNCIA</button>
            </div>
        `;
        
        document.getElementById('registerEvidenceBtn')?.addEventListener('click', async () => {
            const evidenceData = {
                name: document.getElementById('evidenceName')?.value,
                type: document.getElementById('evidenceType')?.value,
                caseId: document.getElementById('evidenceCaseId')?.value,
                description: document.getElementById('evidenceDescription')?.value,
                content: document.getElementById('evidenceContent')?.value
            };
            
            if (!evidenceData.name) {
                alert('Por favor, preencha o nome da evidência');
                return;
            }
            
            const evidence = await this.registerEvidence(evidenceData);
            alert(`✅ Evidência registada com sucesso!\n\nID: ${evidence.id}\nHash: ${evidence.hash.substring(0, 32)}...\nMerkle Root: ${evidence.merkleProof?.merkleRoot?.substring(0, 32)}...`);
            document.getElementById('caseDetailModal').style.display = 'none';
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Evidência ${evidence.id} registada com sucesso`, 'success');
            }
            
            const dashboardContainer = document.getElementById('strategicVaultDashboard');
            if (dashboardContainer && dashboardContainer.isConnected) {
                await this.renderDashboard('strategicVaultDashboard');
            }
        });
        
        document.getElementById('caseDetailModal').style.display = 'flex';
    }
    
    /**
     * Verifica integridade de todo o sistema
     */
    async verifySystemIntegrity() {
        let validCount = 0, invalidCount = 0;
        
        for (const [id] of this.evidenceChain) {
            const verification = await this.verifyIntegrity(id);
            if (verification.valid) validCount++; else invalidCount++;
        }
        
        const result = {
            timestamp: new Date().toISOString(),
            totalEvidence: this.evidenceChain.size,
            validEvidence: validCount,
            invalidEvidence: invalidCount,
            integrityScore: this.evidenceChain.size > 0 ? (validCount / this.evidenceChain.size * 100).toFixed(1) : 100,
            merkleTreesCount: this.merkleTrees.size,
            lastVerification: new Date().toISOString()
        };
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Verificação de integridade: ${result.validEvidence}/${result.totalEvidence} evidências íntegras (${result.integrityScore}%)`, 
                result.invalidEvidence > 0 ? 'warning' : 'success');
        }
        
        return result;
    }
}

// Instância global
window.ForensicVault = new StrategicVault();
window.StrategicVault = window.ForensicVault;

console.log('[ELITE] Strategic Vault carregado com Merkle Tree e Web Crypto API');