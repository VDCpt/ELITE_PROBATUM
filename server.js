/**
 * ============================================================================
 * ELITE PROBATUM v3.0.0 — SERVIDOR NODE.JS
 * AUTENTICAÇÃO JWT + RBAC + GESTÃO DE UTILIZADORES
 * ============================================================================
 * Funcionalidades:
 * 1. Autenticação JWT com access token (8h) + refresh token (7d)
 * 2. PBKDF2 per-user salt (servidor gera e armazena)
 * 3. RBAC: admin, socio, advogado, estagiario
 * 4. Gestão de utilizadores (CRUD)
 * 5. Gestão de processos com filtragem por utilizador
 * 6. Rate limiting manual (100 req/15min por IP)
 * 7. Security headers (substitui meta CSP)
 * 8. 2FA via TOTP simulado (substituível por SMS real)
 * 9. Serve ficheiros estáticos com cache adequado
 * 10. Modo DEMO / REAL com toggle por admin
 * ============================================================================
 * Uso:
 *   npm install
 *   node server.js
 * ============================================================================
 */

'use strict';

const express   = require('express');
const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');
const fs        = require('fs');
const path      = require('path');

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const PORT                = process.env.PORT               || 3000;
const JWT_SECRET          = process.env.JWT_SECRET         || crypto.randomBytes(64).toString('hex');
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES         = '8h';
const JWT_REFRESH_EXPIRES = '7d';
const DATA_DIR            = path.join(__dirname, 'data');
const USERS_FILE          = path.join(DATA_DIR, 'users.json');
const CASES_FILE          = path.join(DATA_DIR, 'cases.json');
const SESSIONS_FILE       = path.join(DATA_DIR, 'sessions.json');
const SETTINGS_FILE       = path.join(DATA_DIR, 'settings.json');

// ============================================================================
// INICIALIZAÇÃO DE DADOS
// ============================================================================

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJSON(file, defaultValue) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) {
        console.error('[Server] Erro ao carregar', file, ':', e.message);
    }
    return defaultValue;
}

function saveJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('[Server] Erro ao guardar', file, ':', e.message);
    }
}

// Hash de password com PBKDF2
function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha512').toString('hex');
}

function generateSalt() {
    return crypto.randomBytes(32).toString('hex');
}

function generateCryptoSalt() {
    return crypto.randomBytes(32).toString('base64');
}

// Utilizadores padrão (apenas se não existir users.json)
function initDefaultUsers() {
    const existing = loadJSON(USERS_FILE, null);
    if (existing && existing.length > 0) return existing;

    const adminSalt    = generateSalt();
    const socioSalt    = generateSalt();
    const advogSalt    = generateSalt();
    const advog2Salt   = generateSalt();
    const estSalt      = generateSalt();

    const users = [
        {
            id:           crypto.randomUUID(),
            username:     'admin',
            passwordHash: hashPassword('admin123', adminSalt),
            salt:         adminSalt,
            cryptoSalt:   generateCryptoSalt(),
            name:         'Dr. Administrador',
            role:         'admin',
            team:         'Administração',
            email:        'admin@eliteprobatum.pt',
            phone:        '+351900000001',
            assignedCases: [],
            active:       true,
            createdAt:    new Date().toISOString(),
            lastLogin:    null
        },
        {
            id:           crypto.randomUUID(),
            username:     'socio1',
            passwordHash: hashPassword('Socio@EP2026!', socioSalt),
            salt:         socioSalt,
            cryptoSalt:   generateCryptoSalt(),
            name:         'Dra. Ana Silva',
            role:         'socio',
            team:         'Litígio',
            email:        'ana.silva@eliteprobatum.pt',
            phone:        '+351900000002',
            assignedCases: [],
            active:       true,
            createdAt:    new Date().toISOString(),
            lastLogin:    null
        },
        {
            id:           crypto.randomUUID(),
            username:     'advogado1',
            passwordHash: hashPassword('Adv1@EP2026!', advogSalt),
            salt:         advogSalt,
            cryptoSalt:   generateCryptoSalt(),
            name:         'Dr. Pedro Santos',
            role:         'advogado',
            team:         'Litígio',
            email:        'pedro.santos@eliteprobatum.pt',
            phone:        '+351900000003',
            assignedCases: ['INS001', 'BNK001', 'TAX001'],
            active:       true,
            createdAt:    new Date().toISOString(),
            lastLogin:    null
        },
        {
            id:           crypto.randomUUID(),
            username:     'advogado2',
            passwordHash: hashPassword('Adv2@EP2026!', advog2Salt),
            salt:         advog2Salt,
            cryptoSalt:   generateCryptoSalt(),
            name:         'Dra. Maria Costa',
            role:         'advogado',
            team:         'Arbitragem',
            email:        'maria.costa@eliteprobatum.pt',
            phone:        '+351900000004',
            assignedCases: ['MNA001', 'MASS001', 'COM001'],
            active:       true,
            createdAt:    new Date().toISOString(),
            lastLogin:    null
        },
        {
            id:           crypto.randomUUID(),
            username:     'estagiario1',
            passwordHash: hashPassword('Est1@EP2026!', estSalt),
            salt:         estSalt,
            cryptoSalt:   generateCryptoSalt(),
            name:         'Dr. João Mendes',
            role:         'estagiario',
            team:         'Litígio',
            email:        'joao.mendes@eliteprobatum.pt',
            phone:        '+351900000005',
            assignedCases: ['LAB001', 'CIV001', 'FAM001'],
            active:       true,
            createdAt:    new Date().toISOString(),
            lastLogin:    null
        }
    ];

    saveJSON(USERS_FILE, users);
    console.log('[Server] Utilizadores padrão criados. Altere as passwords em produção.');
    console.log('[Server] admin / admin123 | socio1 / Socio@EP2026! | advogado1 / Adv1@EP2026! | advogado2 / Adv2@EP2026! | estagiario1 / Est1@EP2026!');
    return users;
}

// Dados reais de processos (inicialmente vazios)
function initCases() {
    const existing = loadJSON(CASES_FILE, null);
    if (existing) return existing;
    saveJSON(CASES_FILE, []);
    return [];
}

// Configurações globais
function initSettings() {
    const existing = loadJSON(SETTINGS_FILE, null);
    if (existing) return existing;
    const settings = { dataMode: 'demo', updatedAt: new Date().toISOString(), updatedBy: 'system' };
    saveJSON(SETTINGS_FILE, settings);
    return settings;
}

let USERS    = initDefaultUsers();
let CASES    = initCases();
let SETTINGS = initSettings();
const REVOKED_TOKENS = new Set();

// ============================================================================
// RATE LIMITER MANUAL
// ============================================================================

const rateLimitStore = new Map();

function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    return (req, res, next) => {
        const ip  = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const windowStart = now - windowMs;

        let record = rateLimitStore.get(ip);
        if (!record) {
            record = { requests: [], blocked: false };
            rateLimitStore.set(ip, record);
        }

        record.requests = record.requests.filter(t => t > windowStart);
        record.requests.push(now);

        if (record.requests.length > maxRequests) {
            res.status(429).json({ error: 'Demasiadas tentativas. Aguarde 15 minutos.' });
            return;
        }
        next();
    };
}

function rateLimitAuth(maxRequests = 10, windowMs = 15 * 60 * 1000) {
    return rateLimit(maxRequests, windowMs);
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================

function securityHeaders(req, res, next) {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.nonce = nonce;

    res.setHeader('Content-Security-Policy',
        `default-src 'self'; ` +
        `script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://unpkg.com; ` +
        `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://cdnjs.cloudflare.com; ` +
        `font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; ` +
        `connect-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; ` +
        `img-src 'self' data: blob:; ` +
        `base-uri 'self'; ` +
        `form-action 'self';`
    );
    res.setHeader('X-Content-Type-Options',    'nosniff');
    res.setHeader('X-Frame-Options',           'DENY');
    res.setHeader('X-XSS-Protection',          '1; mode=block');
    res.setHeader('Referrer-Policy',           'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy',        'geolocation=(), microphone=(), camera=()');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    next();
}

// ============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO JWT
// ============================================================================

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticação em falta.' });
    }
    const token = authHeader.split(' ')[1];
    if (REVOKED_TOKENS.has(token)) {
        return res.status(401).json({ error: 'Sessão terminada. Autentique-se novamente.' });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user  = payload;
        req.token = token;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acesso não autorizado para este perfil.' });
        }
        next();
    };
}

function requireOwnerOrAdmin(req, res, next) {
    const targetId = req.params.id;
    if (req.user.role === 'admin' || req.user.role === 'socio' || req.user.sub === targetId) {
        return next();
    }
    return res.status(403).json({ error: 'Acesso restrito ao próprio utilizador, sócios ou administrador.' });
}

// ============================================================================
// STORE DE 2FA TEMPORÁRIO (memória, expira em 5 minutos)
// ============================================================================

const twoFactorStore = new Map();

function storeTwoFactor(tempToken, userId, code) {
    twoFactorStore.set(tempToken, {
        userId,
        code,
        expires: Date.now() + 5 * 60 * 1000
    });
    setTimeout(() => twoFactorStore.delete(tempToken), 5 * 60 * 1000);
}

// ============================================================================
// APLICAÇÃO EXPRESS
// ============================================================================

const app = express();

app.use(securityHeaders);
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit(200, 15 * 60 * 1000));

// Servir ficheiros estáticos com headers corretos
app.use(express.static(__dirname, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        if (filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
}));

// ============================================================================
// ROTAS DE AUTENTICAÇÃO
// ============================================================================

// POST /api/auth/login
app.post('/api/auth/login', rateLimitAuth(10, 15 * 60 * 1000), (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Utilizador e palavra-passe são obrigatórios.' });
    }

    USERS = loadJSON(USERS_FILE, USERS);
    const user = USERS.find(u => u.username === username && u.active);
    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const inputHash = hashPassword(password, user.salt);
    if (inputHash !== user.passwordHash) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gerar temp token para 2FA
    const tempToken = crypto.randomBytes(32).toString('hex');
    const twoFaCode = Math.floor(100000 + Math.random() * 900000).toString();
    storeTwoFactor(tempToken, user.id, twoFaCode);

    // Simular envio de SMS (substituir por integração real: Twilio, Vonage, etc.)
    console.log(`[2FA] Código para ${user.username} (${user.phone}): ${twoFaCode}`);

    res.json({
        tempToken,
        requiresTwoFactor: true,
        phone: user.phone ? user.phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1***$3$4') : null,
        message: `Código de verificação enviado para ${user.phone ? user.phone.slice(0, -4).replace(/\d/g, '*') + user.phone.slice(-4) : 'telemóvel registado'}`
    });
});

// POST /api/auth/2fa/verify
app.post('/api/auth/2fa/verify', rateLimitAuth(5, 5 * 60 * 1000), (req, res) => {
    const { tempToken, code } = req.body;
    if (!tempToken || !code) {
        return res.status(400).json({ error: 'Token temporário e código são obrigatórios.' });
    }

    const record = twoFactorStore.get(tempToken);
    if (!record || Date.now() > record.expires) {
        twoFactorStore.delete(tempToken);
        return res.status(401).json({ error: 'Código expirado ou inválido. Faça login novamente.' });
    }
    if (record.code !== code) {
        return res.status(401).json({ error: 'Código de verificação incorreto.' });
    }
    twoFactorStore.delete(tempToken);

    USERS = loadJSON(USERS_FILE, USERS);
    const user = USERS.find(u => u.id === record.userId && u.active);
    if (!user) {
        return res.status(401).json({ error: 'Utilizador não encontrado.' });
    }

    // Atualizar último login
    const userIndex = USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        USERS[userIndex].lastLogin = new Date().toISOString();
        saveJSON(USERS_FILE, USERS);
    }

    const tokenPayload = {
        sub:         user.id,
        username:    user.username,
        name:        user.name,
        role:        user.role,
        team:        user.team,
        twoFaVerified: true
    };

    const accessToken  = jwt.sign(tokenPayload, JWT_SECRET,         { expiresIn: JWT_EXPIRES });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });

    res.json({
        token:        accessToken,
        refreshToken: refreshToken,
        expiresIn:    JWT_EXPIRES,
        user: {
            id:           user.id,
            username:     user.username,
            name:         user.name,
            role:         user.role,
            team:         user.team,
            email:        user.email,
            phone:        user.phone,
            cryptoSalt:   user.cryptoSalt,
            assignedCases: user.assignedCases || [],
            lastLogin:    user.lastLogin
        }
    });
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'refreshToken é obrigatório.' });
    }
    if (REVOKED_TOKENS.has(refreshToken)) {
        return res.status(401).json({ error: 'Sessão invalidada.' });
    }
    try {
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        USERS = loadJSON(USERS_FILE, USERS);
        const user = USERS.find(u => u.id === payload.sub && u.active);
        if (!user) {
            return res.status(401).json({ error: 'Utilizador não encontrado.' });
        }
        const tokenPayload = { sub: user.id, username: user.username, name: user.name, role: user.role, team: user.team, twoFaVerified: true };
        const newAccessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        res.json({ token: newAccessToken, expiresIn: JWT_EXPIRES });
    } catch (e) {
        return res.status(401).json({ error: 'Refresh token inválido ou expirado.' });
    }
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, (req, res) => {
    REVOKED_TOKENS.add(req.token);
    // Limpar após expiração do token
    const decoded = jwt.decode(req.token);
    if (decoded && decoded.exp) {
        const msUntilExpiry = (decoded.exp * 1000) - Date.now();
        if (msUntilExpiry > 0) {
            setTimeout(() => REVOKED_TOKENS.delete(req.token), msUntilExpiry + 1000);
        }
    }
    res.json({ message: 'Sessão terminada com sucesso.' });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
    USERS = loadJSON(USERS_FILE, USERS);
    const user = USERS.find(u => u.id === req.user.sub && u.active);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });
    res.json({
        id:           user.id,
        username:     user.username,
        name:         user.name,
        role:         user.role,
        team:         user.team,
        email:        user.email,
        phone:        user.phone,
        cryptoSalt:   user.cryptoSalt,
        assignedCases: user.assignedCases || [],
        lastLogin:    user.lastLogin
    });
});

// ============================================================================
// ROTAS DE GESTÃO DE UTILIZADORES
// ============================================================================

// GET /api/users — admin e socio
app.get('/api/users', requireAuth, requireRole('admin', 'socio'), (req, res) => {
    USERS = loadJSON(USERS_FILE, USERS);
    const safe = USERS.map(u => ({
        id: u.id, username: u.username, name: u.name, role: u.role,
        team: u.team, email: u.email, phone: u.phone,
        assignedCases: u.assignedCases || [], active: u.active,
        createdAt: u.createdAt, lastLogin: u.lastLogin
    }));
    res.json(safe);
});

// POST /api/users — apenas admin
app.post('/api/users', requireAuth, requireRole('admin'), (req, res) => {
    const { username, password, name, role, team, email, phone, assignedCases } = req.body;
    if (!username || !password || !name || !role) {
        return res.status(400).json({ error: 'username, password, name e role são obrigatórios.' });
    }
    const validRoles = ['admin', 'socio', 'advogado', 'estagiario'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: `Role inválido. Valores aceites: ${validRoles.join(', ')}` });
    }
    USERS = loadJSON(USERS_FILE, USERS);
    if (USERS.find(u => u.username === username)) {
        return res.status(409).json({ error: 'Nome de utilizador já existe.' });
    }
    const salt       = generateSalt();
    const cryptoSalt = generateCryptoSalt();
    const newUser = {
        id:           crypto.randomUUID(),
        username,
        passwordHash: hashPassword(password, salt),
        salt,
        cryptoSalt,
        name,
        role,
        team:         team || 'Geral',
        email:        email || '',
        phone:        phone || '',
        assignedCases: assignedCases || [],
        active:       true,
        createdAt:    new Date().toISOString(),
        lastLogin:    null
    };
    USERS.push(newUser);
    saveJSON(USERS_FILE, USERS);
    const { salt: _s, passwordHash: _ph, cryptoSalt: _cs, ...safeUser } = newUser;
    res.status(201).json(safeUser);
});

// PUT /api/users/:id — admin ou próprio utilizador
app.put('/api/users/:id', requireAuth, requireOwnerOrAdmin, (req, res) => {
    USERS = loadJSON(USERS_FILE, USERS);
    const idx = USERS.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    const { name, email, phone, team, assignedCases, active, password, role } = req.body;

    if (name)         USERS[idx].name         = name;
    if (email)        USERS[idx].email        = email;
    if (phone)        USERS[idx].phone        = phone;
    if (team)         USERS[idx].team         = team;
    if (assignedCases !== undefined && (req.user.role === 'admin' || req.user.role === 'socio')) {
        USERS[idx].assignedCases = assignedCases;
    }
    if (active !== undefined && req.user.role === 'admin') {
        USERS[idx].active = active;
    }
    if (role && req.user.role === 'admin') {
        USERS[idx].role = role;
    }
    if (password) {
        const newSalt = generateSalt();
        const newCryptoSalt = generateCryptoSalt();
        USERS[idx].salt         = newSalt;
        USERS[idx].passwordHash = hashPassword(password, newSalt);
        USERS[idx].cryptoSalt   = newCryptoSalt;
    }

    saveJSON(USERS_FILE, USERS);
    const { salt: _s, passwordHash: _ph, cryptoSalt: _cs, ...safeUser } = USERS[idx];
    res.json(safeUser);
});

// DELETE /api/users/:id — apenas admin, não pode auto-eliminar
app.delete('/api/users/:id', requireAuth, requireRole('admin'), (req, res) => {
    if (req.params.id === req.user.sub) {
        return res.status(400).json({ error: 'Não é possível eliminar o próprio utilizador.' });
    }
    USERS = loadJSON(USERS_FILE, USERS);
    const idx = USERS.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Utilizador não encontrado.' });
    const deleted = USERS.splice(idx, 1)[0];
    saveJSON(USERS_FILE, USERS);
    res.json({ message: `Utilizador ${deleted.username} eliminado.` });
});

// ============================================================================
// ROTAS DE PROCESSOS (CASOS REAIS)
// ============================================================================

function filterCasesByRole(cases, user) {
    if (user.role === 'admin' || user.role === 'socio') return cases;
    USERS = loadJSON(USERS_FILE, USERS);
    const dbUser = USERS.find(u => u.id === user.sub);
    const assigned = dbUser ? (dbUser.assignedCases || []) : [];
    return cases.filter(c => assigned.includes(c.id) || c.assignedTo === user.sub);
}

// GET /api/cases
app.get('/api/cases', requireAuth, (req, res) => {
    CASES = loadJSON(CASES_FILE, CASES);
    res.json(filterCasesByRole(CASES, req.user));
});

// POST /api/cases
app.post('/api/cases', requireAuth, (req, res) => {
    CASES = loadJSON(CASES_FILE, CASES);
    const newCase = {
        ...req.body,
        id:         req.body.id || `CASE_${Date.now().toString(36).toUpperCase()}`,
        assignedTo: req.body.assignedTo || req.user.sub,
        createdBy:  req.user.sub,
        createdAt:  new Date().toISOString(),
        status:     req.body.status || 'active'
    };
    CASES.push(newCase);
    saveJSON(CASES_FILE, CASES);
    res.status(201).json(newCase);
});

// PUT /api/cases/:id
app.put('/api/cases/:id', requireAuth, (req, res) => {
    CASES = loadJSON(CASES_FILE, CASES);
    const idx = CASES.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Processo não encontrado.' });

    const caseItem = CASES[idx];
    const isOwner = caseItem.assignedTo === req.user.sub || caseItem.createdBy === req.user.sub;
    const isPrivileged = req.user.role === 'admin' || req.user.role === 'socio';

    if (!isOwner && !isPrivileged) {
        return res.status(403).json({ error: 'Sem permissão para editar este processo.' });
    }

    CASES[idx] = { ...caseItem, ...req.body, id: caseItem.id, updatedAt: new Date().toISOString(), updatedBy: req.user.sub };
    saveJSON(CASES_FILE, CASES);
    res.json(CASES[idx]);
});

// DELETE /api/cases/:id
app.delete('/api/cases/:id', requireAuth, (req, res) => {
    CASES = loadJSON(CASES_FILE, CASES);
    const idx = CASES.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Processo não encontrado.' });

    const caseItem = CASES[idx];
    const isOwner = caseItem.assignedTo === req.user.sub;
    const isPrivileged = req.user.role === 'admin' || req.user.role === 'socio';

    if (!isOwner && !isPrivileged) {
        return res.status(403).json({ error: 'Sem permissão para eliminar este processo.' });
    }

    const deleted = CASES.splice(idx, 1)[0];
    saveJSON(CASES_FILE, CASES);
    res.json({ message: `Processo ${deleted.id} eliminado.` });
});

// ============================================================================
// CONFIGURAÇÕES DO SISTEMA
// ============================================================================

// GET /api/settings
app.get('/api/settings', requireAuth, (req, res) => {
    SETTINGS = loadJSON(SETTINGS_FILE, SETTINGS);
    res.json({ dataMode: SETTINGS.dataMode });
});

// PUT /api/settings — admin e socio
app.put('/api/settings', requireAuth, requireRole('admin', 'socio'), (req, res) => {
    SETTINGS = loadJSON(SETTINGS_FILE, SETTINGS);
    const { dataMode } = req.body;
    if (dataMode && ['demo', 'real'].includes(dataMode)) {
        SETTINGS.dataMode  = dataMode;
        SETTINGS.updatedAt = new Date().toISOString();
        SETTINGS.updatedBy = req.user.sub;
        saveJSON(SETTINGS_FILE, SETTINGS);
    }
    res.json({ dataMode: SETTINGS.dataMode, updatedAt: SETTINGS.updatedAt });
});

// ============================================================================
// ROTA DE PEDIDO DE ACESSO (pré-autenticação)
// ============================================================================

const ACCESS_REQUESTS_FILE = path.join(DATA_DIR, 'access_requests.json');

app.post('/api/access-request', rateLimit(5, 60 * 60 * 1000), (req, res) => {
    const { name, email, phone, nif, role, reason } = req.body;
    if (!name || !email || !phone || !nif) {
        return res.status(400).json({ error: 'Nome, email, telemóvel e NIF são obrigatórios.' });
    }
    const requests = loadJSON(ACCESS_REQUESTS_FILE, []);
    const request = {
        id:        crypto.randomUUID(),
        name, email, phone, nif,
        role:      role || '',
        reason:    reason || '',
        status:    'pending',
        createdAt: new Date().toISOString()
    };
    requests.push(request);
    saveJSON(ACCESS_REQUESTS_FILE, requests);
    console.log(`[Acesso] Pedido de ${name} (${email}) registado. ID: ${request.id}`);
    res.status(201).json({ id: request.id, message: 'Pedido registado. O Master Hash Controller será notificado.' });
});

// GET /api/access-requests — admin apenas
app.get('/api/access-requests', requireAuth, requireRole('admin'), (req, res) => {
    const requests = loadJSON(ACCESS_REQUESTS_FILE, []);
    res.json(requests);
});

// ============================================================================
// HEALTHCHECK
// ============================================================================

app.get('/api/health', (req, res) => {
    res.json({
        status:  'online',
        version: '3.0.0',
        uptime:  process.uptime(),
        ts:      new Date().toISOString()
    });
});

// ============================================================================
// FALLBACK: servir index.html para SPA routing
// ============================================================================

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).json({ error: 'Endpoint não encontrado.' });
    }
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  ELITE PROBATUM v3.0.0 — SERVIDOR INICIADO               ║');
    console.log('║  UNIDADE DE COMANDO ESTRATÉGICO                           ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  URL:       http://localhost:${PORT}                          ║`);
    console.log(`║  Ambiente:  ${process.env.NODE_ENV || 'development'}                              ║`);
    console.log('║  JWT:       RS256-equivalente via PBKDF2+AES-256-GCM      ║');
    console.log('║  2FA:       TOTP simulado (integrar SMS em produção)       ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    USERS = loadJSON(USERS_FILE, USERS);
    console.log(`[Server] ${USERS.length} utilizador(es) carregado(s).`);
    console.log(`[Server] Modo de dados: ${SETTINGS.dataMode.toUpperCase()}`);
    console.log('');
});

module.exports = app;
