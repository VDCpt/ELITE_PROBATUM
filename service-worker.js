/**
 * ============================================================================
 * ELITE PROBATUM v3.0.0 — SERVICE WORKER
 * PWA OFFLINE-FIRST PARA ACESSO EM AUDIÊNCIA
 * ============================================================================
 * Funcionalidades:
 * 1. Cache de recursos estáticos (CSS, JS, HTML)
 * 2. Cache on-demand para artefactos de caso (Digital Briefcase)
 * 3. Sincronização em background para uploads pendentes
 * 4. Notificações push para prazos judiciais
 * 5. NÃO cacheia respostas de API autenticadas (/api/)
 * 6. Limpa todo o cache no logout (CLEAR_ALL_CACHE)
 * ============================================================================
 */

const CACHE_VERSION = 'v3.0.0';
const STATIC_CACHE  = `elite-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `elite-dynamic-${CACHE_VERSION}`;
const CASE_CACHE    = `elite-cases-${CACHE_VERSION}`;

// Recursos estáticos a serem cacheados na instalação
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css_main.css',
    '/css_components.css',
    '/js_core_app.js',
    '/js_auth.js',
    '/js_modules_rbac.js',
    '/js_components_charts.js',
    '/js_components_tables.js',
    '/js_modules_ai-assistant.js',
    '/js_modules_black-swan.js',
    '/js_modules_blockchain-custody.js',
    '/js_modules_client-experience.js',
    '/js_modules_court-deadlines.js',
    '/js_modules_gamification.js',
    '/js_modules_judge-biometrics.js',
    '/js_modules_judicial-analytics.js',
    '/js_modules_lead-intelligence.js',
    '/js_modules_market-intelligence.js',
    '/js_modules_mass-litigation.js',
    '/js_modules_neural-litigation.js',
    '/js_modules_platform-intel.js',
    '/js_modules_quantum-analytics.js',
    '/js_modules_risk-mitigation.js',
    '/js_modules_shadow-dossier.js',
    '/js_modules_strategic-vault.js',
    '/js_modules_value-efficiency.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Evento de instalação - cache dos recursos estáticos
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Instalando v3.0.0...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[ServiceWorker] Cacheando recursos estáticos');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Evento de ativação - limpeza de caches antigos
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Ativando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE &&
                        cacheName !== DYNAMIC_CACHE &&
                        cacheName !== CASE_CACHE) {
                        console.log('[ServiceWorker] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Requisições de API: NUNCA cachear (dados autenticados + sensíveis)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkOnly(event.request));
        return;
    }

    // Requisições de artefactos de caso (Digital Briefcase) - usar Cache Only
    if (url.pathname.startsWith('/case/') || url.searchParams.has('caseId')) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // index.html: sempre rede primeiro (pode ter sido atualizado)
    if (url.pathname === '/' || url.pathname === '/index.html') {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Recursos estáticos - usar Cache First
    if (STATIC_ASSETS.some(asset => event.request.url.includes(asset))) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // Demais requisições - usar Stale While Revalidate
    event.respondWith(staleWhileRevalidate(event.request));
});

/**
 * Network Only - para endpoints de API (dados sensíveis nunca cacheados)
 */
async function networkOnly(request) {
    try {
        return await fetch(request);
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Sem ligação à rede. API não disponível offline.' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * Cache First - busca no cache, fallback para rede
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.error('[ServiceWorker] Erro na requisição:', error);
        return new Response('Recurso não disponível offline', { status: 404 });
    }
}

/**
 * Network First - tenta rede primeiro, fallback para cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Sem conexão e recurso não disponível em cache', { status: 503 });
    }
}

/**
 * Stale While Revalidate - serve cache, atualiza em background
 */
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then((c) => c.put(request, networkResponse.clone()));
        return networkResponse;
    }).catch((error) => {
        console.error('[ServiceWorker] Erro na atualização:', error);
    });

    return cachedResponse || fetchPromise;
}

// ============================================================================
// FUNCIONALIDADES ESPECÍFICAS PARA O ELITE PROBATUM
// ============================================================================

self.addEventListener('message', async (event) => {

    if (event.data && event.data.type === 'CACHE_CASE_ARTEFACTS') {
        console.log('[ServiceWorker] Cacheando artefactos do caso:', event.data.caseId);
        event.waitUntil(cacheCaseArtefacts(event.data.caseId, event.data.artefacts));
    }

    if (event.data && event.data.type === 'GET_CACHED_CASES') {
        event.waitUntil(getCachedCases(event));
    }

    if (event.data && event.data.type === 'CLEAR_CASE_CACHE') {
        event.waitUntil(clearCaseCache(event.data.caseId));
    }

    // Limpar todo o cache no logout (segurança)
    if (event.data && event.data.type === 'CLEAR_ALL_CACHE') {
        console.log('[ServiceWorker] Limpando todos os caches por logout...');
        event.waitUntil(
            caches.keys().then((names) => Promise.all(names.map(n => {
                if (n === CASE_CACHE || n === DYNAMIC_CACHE) return caches.delete(n);
            }))).then(() => {
                const clients = self.clients.matchAll();
                clients.then(list => list.forEach(c => c.postMessage({ type: 'CACHE_CLEARED' })));
            })
        );
    }

    if (event.data && event.data.type === 'REGISTER_SYNC') {
        try {
            await self.registration.sync.register('sync-submissions');
            if (event.ports[0]) event.ports[0].postMessage({ success: true });
        } catch (error) {
            if (event.ports[0]) event.ports[0].postMessage({ success: false, error: error.message });
        }
    }

    if (event.data && event.data.type === 'CHECK_CACHE_STATUS') {
        const cache = await caches.open(CASE_CACHE);
        const keys = await cache.keys();
        const cachedCases = new Set();

        for (const key of keys) {
            const match = key.url.match(/case_(.+)_manifest/);
            if (match) cachedCases.add(match[1]);
        }

        if (event.ports[0]) {
            event.ports[0].postMessage({
                cachedCases:  Array.from(cachedCases),
                totalCached:  keys.length,
                cacheSize:    await getCacheSize(cache)
            });
        }
    }
});

/**
 * Cacheia artefactos de um caso específico
 */
async function cacheCaseArtefacts(caseId, artefacts) {
    const cache    = await caches.open(CASE_CACHE);
    const caseKey  = `case_${caseId}_manifest`;

    await cache.put(caseKey, new Response(JSON.stringify(artefacts.manifest), {
        headers: { 'Content-Type': 'application/json' }
    }));

    for (const evidence of artefacts.evidences) {
        const evidenceKey = `case_${caseId}_evidence_${evidence.id}`;
        await cache.put(evidenceKey, new Response(JSON.stringify(evidence), {
            headers: { 'Content-Type': 'application/json' }
        }));
    }

    for (const cert of artefacts.certificates) {
        if (!cert) continue;
        const certKey = `case_${caseId}_cert_${cert.id || Date.now()}`;
        await cache.put(certKey, new Response(JSON.stringify(cert), {
            headers: { 'Content-Type': 'application/json' }
        }));
    }

    console.log(`[ServiceWorker] Artefactos do caso ${caseId} cacheados`);

    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({ type: 'CACHE_COMPLETE', caseId, timestamp: new Date().toISOString() });
    });
}

/**
 * Obtém casos cacheados
 */
async function getCachedCases(event) {
    const cache = await caches.open(CASE_CACHE);
    const keys  = await cache.keys();
    const cases = new Set();

    for (const key of keys) {
        const match = key.url.match(/case_(.+)_manifest/);
        if (match) cases.add(match[1]);
    }

    if (event.ports[0]) event.ports[0].postMessage(Array.from(cases));
}

/**
 * Limpa cache de um caso específico
 */
async function clearCaseCache(caseId) {
    const cache = await caches.open(CASE_CACHE);
    const keys  = await cache.keys();

    for (const key of keys) {
        if (key.url.includes(`case_${caseId}`)) {
            await cache.delete(key);
        }
    }
    console.log(`[ServiceWorker] Cache do caso ${caseId} limpo`);
}

// ============================================================================
// BACKGROUND SYNC
// ============================================================================

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-submissions') {
        console.log('[ServiceWorker] Sincronizando submissões pendentes');
        event.waitUntil(syncPendingSubmissions());
    }
});

async function syncPendingSubmissions() {
    const submissions = await getPendingSubmissions();

    for (const submission of submissions) {
        try {
            const response = await fetch('/api/submissions', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(submission.data)
            });
            if (response.ok) {
                await removePendingSubmission(submission.id);
                console.log(`[ServiceWorker] Submissão ${submission.id} sincronizada`);
            }
        } catch (error) {
            console.error(`[ServiceWorker] Erro ao sincronizar ${submission.id}:`, error);
        }
    }
}

async function getPendingSubmissions() {
    return new Promise((resolve) => {
        const request = indexedDB.open('EliteProbatumDB', 1);
        request.onerror = () => resolve([]);
        request.onsuccess = (event) => {
            const db          = event.target.result;
            const transaction = db.transaction(['pending_submissions'], 'readonly');
            const store       = transaction.objectStore('pending_submissions');
            const getAll      = store.getAll();
            getAll.onsuccess  = () => resolve(getAll.result);
            getAll.onerror    = () => resolve([]);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pending_submissions')) {
                db.createObjectStore('pending_submissions', { keyPath: 'id' });
            }
        };
    });
}

async function removePendingSubmission(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('EliteProbatumDB', 1);
        request.onerror   = () => reject();
        request.onsuccess = (event) => {
            const db          = event.target.result;
            const transaction = db.transaction(['pending_submissions'], 'readwrite');
            const store       = transaction.objectStore('pending_submissions');
            const del         = store.delete(id);
            del.onsuccess = () => resolve();
            del.onerror   = () => reject();
        };
    });
}

// ============================================================================
// NOTIFICAÇÕES PUSH
// ============================================================================

self.addEventListener('push', (event) => {
    let data = {};
    if (event.data) {
        try { data = event.data.json(); } catch (e) { data = { title: 'ELITE PROBATUM', body: event.data.text() }; }
    }

    const options = {
        body:    data.body  || 'Novo prazo judicial próximo',
        icon:    '/icon-192x192.png',
        badge:   '/badge-72x72.png',
        vibrate: [200, 100, 200],
        data:    { url: data.url || '/', caseId: data.caseId },
        actions: [
            { action: 'view',    title: 'Ver Processo' },
            { action: 'dismiss', title: 'Ignorar' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'ELITE PROBATUM', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url    = event.notification.data?.url  || '/';
    const caseId = event.notification.data?.caseId;

    if (event.action === 'view' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes(url) && 'focus' in client) return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow(caseId ? `${url}?view=case&id=${caseId}` : url);
                }
            })
        );
    }
});

/**
 * Calcula tamanho aproximado do cache
 */
async function getCacheSize(cache) {
    let size = 0;
    const keys = await cache.keys();
    for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
            const blob  = await response.blob();
            size       += blob.size;
        }
    }
    return size;
}

console.log('[ServiceWorker] ELITE PROBATUM Service Worker v3.0.0 carregado');
