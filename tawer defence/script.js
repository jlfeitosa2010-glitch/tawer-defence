// ============================================================
// CONFIGURAÇÕES GLOBAIS
// ============================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE = 40;
const COLS = canvas.width / TILE;
const ROWS = canvas.height / TILE;

// ============================================================
// SKINS / TEMAS
// ============================================================
const SKINS = {
    forest: { name: 'Floresta', emoji: '🌲', bg: '#2d5016', path: '#8b6f47', pathBorder: '#5d4a2f', enemy: '#c0392b', enemyOutline: '#7b1f12', borderColor: '#00d4ff', badge: 'rgba(46, 204, 113, 0.2)', badgeBorder: '#2ecc71' },
    desert: { name: 'Deserto', emoji: '🏜️', bg: '#c2956a', path: '#a0522d', pathBorder: '#6b3410', enemy: '#8e44ad', enemyOutline: '#4a235a', borderColor: '#f39c12', badge: 'rgba(243, 156, 18, 0.2)', badgeBorder: '#f39c12' },
    ice: { name: 'Gelo', emoji: '❄️', bg: '#b8d4e3', path: '#5d7c99', pathBorder: '#2c3e50', enemy: '#16a085', enemyOutline: '#0b5345', borderColor: '#3498db', badge: 'rgba(52, 152, 219, 0.2)', badgeBorder: '#3498db' },
    volcano: { name: 'Vulcão', emoji: '🌋', bg: '#3a1a0a', path: '#5a2a1a', pathBorder: '#2a0a00', enemy: '#ff4500', enemyOutline: '#8b0000', borderColor: '#ff6b00', badge: 'rgba(255, 107, 0, 0.2)', badgeBorder: '#ff6b00' },
    space: { name: 'Espaço', emoji: '🌌', bg: '#0a0a2e', path: '#2a2a5e', pathBorder: '#000033', enemy: '#9b59b6', enemyOutline: '#4a235a', borderColor: '#9b59b6', badge: 'rgba(155, 89, 182, 0.2)', badgeBorder: '#9b59b6' }
};

// ============================================================
// MAPAS COM TERRENOS ESPECIAIS
// ============================================================
const MAPS = [
    { skin: 'forest', path: [{x:0,y:2},{x:6,y:2},{x:6,y:6},{x:2,y:6},{x:2,y:10},{x:10,y:10},{x:10,y:4},{x:16,y:4},{x:16,y:12},{x:19,y:12}],
      terrains: [{x:4,y:4,type:'hill'},{x:8,y:8,type:'hill'},{x:14,y:8,type:'hill'}] },
    { skin: 'desert', path: [{x:0,y:1},{x:18,y:1},{x:18,y:13},{x:3,y:13},{x:3,y:4},{x:15,y:4},{x:15,y:10},{x:7,y:10},{x:7,y:7},{x:10,y:7}],
      terrains: [{x:9,y:2,type:'sand'},{x:12,y:9,type:'sand'}] },
    { skin: 'ice', path: [{x:0,y:7},{x:5,y:7},{x:5,y:2},{x:10,y:2},{x:10,y:12},{x:15,y:12},{x:15,y:5},{x:19,y:5}],
      terrains: [{x:3,y:4,type:'ice'},{x:12,y:8,type:'ice'}] },
    { skin: 'volcano', path: [{x:0,y:13},{x:4,y:13},{x:4,y:9},{x:8,y:9},{x:8,y:5},{x:12,y:5},{x:12,y:9},{x:16,y:9},{x:16,y:3},{x:19,y:3}],
      terrains: [{x:6,y:7,type:'lava'},{x:14,y:7,type:'lava'}] },
    { skin: 'space', path: [{x:10,y:0},{x:10,y:4},{x:4,y:4},{x:4,y:8},{x:14,y:8},{x:14,y:12},{x:10,y:12},{x:10,y:14}],
      terrains: [{x:7,y:6,type:'void'},{x:13,y:6,type:'void'}] }
];

// ============================================================
// DEFINIÇÕES DE TORRES (8 tipos!)
// ============================================================
const TOWER_TYPES = {
    archer:  { cost: 50,  damage: 15, range: 120, fireRate: 30, color: '#27ae60', projectileColor: '#f1c40f', projectileSpeed: 8,  splash: 0,  icon: '🏹', effect: null,     category: 'basic',   desc: 'Rápido e barato' },
    cannon:  { cost: 100, damage: 40, range: 110, fireRate: 70, color: '#e67e22', projectileColor: '#333',    projectileSpeed: 5,  splash: 50, icon: '💣', effect: null,     category: 'basic',   desc: 'Dano em área' },
    sniper:  { cost: 150, damage: 80, range: 250, fireRate: 90, color: '#3498db', projectileColor: '#fff',    projectileSpeed: 15, splash: 0,  icon: '🎯', effect: null,     category: 'basic',   desc: 'Longo alcance' },
    ice:     { cost: 120, damage: 8,  range: 130, fireRate: 40, color: '#00bcd4', projectileColor: '#b3e5fc', projectileSpeed: 7,  splash: 0,  icon: '❄️', effect: 'slow',   category: 'special', desc: 'Desacelera' },
    poison:  { cost: 130, damage: 5,  range: 140, fireRate: 50, color: '#9c27b0', projectileColor: '#76ff03', projectileSpeed: 6,  splash: 0,  icon: '☠️', effect: 'poison', category: 'special', desc: 'Dano contínuo' },
    laser:   { cost: 200, damage: 25, range: 160, fireRate: 5,  color: '#e91e63', projectileColor: '#ff1744', projectileSpeed: 0,  splash: 0,  icon: '⚡', effect: 'laser',  category: 'advanced',desc: 'Feixe contínuo' },
    tesla:   { cost: 250, damage: 30, range: 140, fireRate: 60, color: '#ffeb3b', projectileColor: '#ffff00', projectileSpeed: 0,  splash: 0,  icon: '🔌', effect: 'chain',  category: 'advanced',desc: 'Corrente elétrica' },
    magic:   { cost: 300, damage: 60, range: 150, fireRate: 80, color: '#9c27b0', projectileColor: '#e040fb', projectileSpeed: 10, splash: 30, icon: '🔮', effect: 'magic',  category: 'advanced',desc: 'Ignora armadura' }
};

// ============================================================
// DEFINIÇÕES DE ARMADILHAS
// ============================================================
const TRAP_TYPES = {
    mine:    { cost: 40,  damage: 100, radius: 50,  icon: '💣', desc: 'Explode ao pisar', duration: 0 },
    spikes:  { cost: 30,  damage: 15,  radius: 35,  icon: '🗡️', desc: 'Dano contínuo', duration: -1 },
    slowfield:{ cost: 60, damage: 0,   radius: 60,  icon: '🕸️', desc: 'Desacelera área', duration: -1, slowAmount: 0.5 }
};

// ============================================================
// TIPOS DE INIMIGOS
// ============================================================
const ENEMY_TYPES = {
    normal:   { hp: 30, speed: 1.2, reward: 5,  size: 14, color: null, outline: null, armor: 0 },
    fast:     { hp: 20, speed: 2.2, reward: 7,  size: 11, color: '#f1c40f', outline: '#c29d0b', armor: 0 },
    tank:     { hp: 100,speed: 0.7, reward: 15, size: 18, color: '#34495e', outline: '#1a252f', armor: 5 },
    flying:   { hp: 25, speed: 1.5, reward: 10, size: 12, color: '#3498db', outline: '#1f6391', armor: 0, flying: true },
    healer:   { hp: 40, speed: 1.0, reward: 12, size: 14, color: '#2ecc71', outline: '#1e8449', armor: 0, healer: true },
    armored:  { hp: 60, speed: 1.0, reward: 12, size: 15, color: '#7f8c8d', outline: '#34495e', armor: 10 }
};

// ============================================================
// ESTADO DO JOGO
// ============================================================
let gold = 200;
let lives = 20;
let wave = 0;
let waveInLevel = 0;
let currentMapIndex = 0;
let enemies = [];
let towers = [];
let traps = [];
let projectiles = [];
let particles = [];
let floatingTexts = [];
let lasers = [];
let lightnings = [];
let selectedTowerType = null;
let selectedTrapType = null;
let selectedTower = null;
let waveInProgress = false;
let enemiesToSpawn = 0;
let spawnTimer = 0;
let mouseX = 0, mouseY = 0;
let hoverCell = null;
let pathSet = new Set();
let waypoints = [];
let bossActive = null;
let bossWarning = false;
let gameSpeed = 1;
let autoWave = false;
let autoWaveTimer = 0;
let infiniteMode = false;
let globalFreeze = 0;

// Sistema de combos
let comboCount = 0;
let comboTimer = 0;
const COMBO_WINDOW = 60; // frames

// Estatísticas
let stats = {
    totalKills: 0,
    totalDamage: 0,
    totalGoldEarned: 0,
    towersBuilt: 0,
    towersSold: 0,
    bossesKilled: 0,
    maxCombo: 0,
    damageTaken: 0,
    wavesCompleted: 0,
    startTime: Date.now()
};

// Sistema de XP e talentos
let playerXP = 0;
let playerLevel = 1;
let xpToNext = 100;
let talents = {
    damageBonus: 0,      // +5% dano por nível
    rangeBonus: 0,       // +3% alcance por nível
    goldBonus: 0,        // +5% ouro por nível
    startGold: 0,        // +50 ouro inicial por nível
    livesBonus: 0,       // +2 vidas iniciais por nível
    cooldownReduction: 0,// -3% cadência por nível
    interestRate: 0,     // +1% juros por nível
    comboBonus: 0        // +10% bônus combo por nível
};

// Cooldowns de habilidades
let skillCooldowns = { meteor: 0, heal: 0, freeze: 0, gold: 0 };
const SKILL_CD_MAX = { meteor: 900, heal: 1200, freeze: 1000, gold: 1500 };
const SKILL_COST = { meteor: 50, heal: 80, freeze: 60, gold: 100 };

// Limites
const TOWER_LIMITS = { archer: 6, cannon: 5, sniper: 4, ice: 4, poison: 4, laser: 3, tesla: 3, magic: 2 };
const TRAP_LIMITS = { mine: 8, spikes: 6, slowfield: 4 };
const MAX_TOWERS = 20;
const MAX_TRAPS = 12;
const MAX_LEVEL = 5;

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================
function getUpgradeCost(level) { return [0, 75, 150, 300, 600][level] || 0; }
function getSellValue(tower) {
    let total = TOWER_TYPES[tower.type].cost;
    for (let i = 1; i < tower.level; i++) total += getUpgradeCost(i);
    return Math.floor(total * 0.6);
}
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    const b = Math.min(255, (num & 0x0000FF) + percent);
    return `rgb(${r},${g},${b})`;
}

function createParticles(x, y, color, count = 8, spread = 4) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * spread,
            vy: (Math.random() - 0.5) * spread,
            life: 20 + Math.random() * 10,
            color: color,
            size: 2 + Math.random() * 2
        });
    }
}

function createFloatingText(x, y, text, color, size = 16) {
    floatingTexts.push({ x, y, text, color, life: 60, size });
}

// ============================================================
// SISTEMA DE SAVE
// ============================================================
const SAVE_KEY = 'tdUltimateSave_v2';

function saveGame() {
    const data = {
        gold, lives, wave, waveInLevel, currentMapIndex, infiniteMode,
        playerXP, playerLevel, xpToNext, talents, stats,
        towers: towers.map(t => ({
            cx: t.cx, cy: t.cy, type: t.type, level: t.level,
            damage: t.damage, range: t.range, fireRate: t.fireRate,
            targetMode: t.targetMode
        })),
        traps: traps.map(t => ({ cx: t.cx, cy: t.cy, type: t.type }))
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        gold = data.gold; lives = data.lives; wave = data.wave;
        waveInLevel = data.waveInLevel; currentMapIndex = data.currentMapIndex;
        infiniteMode = data.infiniteMode || false;
        playerXP = data.playerXP || 0;
        playerLevel = data.playerLevel || 1;
        xpToNext = data.xpToNext || 100;
        if (data.talents) Object.assign(talents, data.talents);
        if (data.stats) Object.assign(stats, data.stats);
        loadMap(currentMapIndex);
        towers = [];
        for (const t of data.towers || []) {
            if (!pathSet.has(`${t.cx},${t.cy}`)) {
                const type = TOWER_TYPES[t.type];
                towers.push({
                    cx: t.cx, cy: t.cy,
                    x: t.cx * TILE + TILE/2, y: t.cy * TILE + TILE/2,
                    type: t.type, level: t.level,
                    damage: t.damage, range: t.range, fireRate: t.fireRate,
                    color: type.color, projectileColor: type.projectileColor,
                    projectileSpeed: type.projectileSpeed, splash: type.splash,
                    effect: type.effect, cooldown: 0, angle: 0,
                    targetMode: t.targetMode || 'first'
                });
            }
        }
        traps = [];
        for (const t of data.traps || []) {
            if (!pathSet.has(`${t.cx},${t.cy}`)) {
                const type = TRAP_TYPES[t.type];
                traps.push({
                    cx: t.cx, cy: t.cy,
                    x: t.cx * TILE + TILE/2, y: t.cy * TILE + TILE/2,
                    type: t.type, ...type
                });
            }
        }
        return true;
    } catch (e) {
        console.error('Erro ao carregar save:', e);
        return false;
    }
}

function resetSave() {
    if (confirm('⚠️ Tem certeza? Todo o progresso será perdido!')) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// ============================================================
// CARREGAR MAPA
// ============================================================
function loadMap(index) {
    const map = MAPS[index];
    const skin = SKINS[map.skin];
    
    canvas.style.borderColor = skin.borderColor;
    document.getElementById('title').textContent = `${skin.emoji} Tower Defense`;
    document.getElementById('levelBadge').textContent = `🗺️ ${infiniteMode ? 'MODO INFINITO' : `Nível ${index + 1} - ${skin.name}`}`;
    document.getElementById('levelBadge').style.background = skin.badge;
    document.getElementById('levelBadge').style.borderColor = skin.badgeBorder;
    
    waypoints = map.path.map(c => ({ x: c.x * TILE + TILE/2, y: c.y * TILE + TILE/2 }));
    
    pathSet.clear();
    for (let i = 0; i < map.path.length - 1; i++) {
        const a = map.path[i], b = map.path[i+1];
        const dx = Math.sign(b.x - a.x);
        const dy = Math.sign(b.y - a.y);
        let cx = a.x, cy = a.y;
        while (cx !== b.x || cy !== b.y) {
            pathSet.add(`${cx},${cy}`);
            cx += dx; cy += dy;
        }
        pathSet.add(`${b.x},${b.y}`);
    }
    
    towers = towers.filter(t => !pathSet.has(`${t.cx},${t.cy}`));
    traps = traps.filter(t => !pathSet.has(`${t.cx},${t.cy}`));
}

// ============================================================
// INTERFACE - CRIAR BOTÕES
// ============================================================
function createTowerButtons() {
    const container = document.getElementById('towerButtons');
    container.innerHTML = '';
    for (const [type, data] of Object.entries(TOWER_TYPES)) {
        const btn = document.createElement('button');
        btn.className = 'tower-btn';
        btn.dataset.type = type;
        btn.innerHTML = `${data.icon} ${type.charAt(0).toUpperCase()+type.slice(1)} <span class="count">0/${TOWER_LIMITS[type]}</span><br><small>${data.cost}g | ${data.desc}</small>`;
        btn.addEventListener('click', () => selectTowerType(type));
        container.appendChild(btn);
    }
}

function createTrapButtons() {
    const container = document.getElementById('trapButtons');
    container.innerHTML = '';
    for (const [type, data] of Object.entries(TRAP_TYPES)) {
        const btn = document.createElement('button');
        btn.className = 'trap-btn';
        btn.dataset.type = type;
        btn.innerHTML = `${data.icon} ${type.charAt(0).toUpperCase()+type.slice(1)} <span class="count">0/${TRAP_LIMITS[type]}</span><br><small>${data.cost}g | ${data.desc}</small>`;
        btn.addEventListener('click', () => selectTrapType(type));
        container.appendChild(btn);
    }
}

function selectTowerType(type) {
    selectedTrapType = null;
    selectedTower = null;
    document.getElementById('towerInfo').classList.add('hidden');
    document.querySelectorAll('.tower-btn, .trap-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.querySelector(`.tower-btn[data-type="${type}"]`);
    if (btn.disabled) return;
    btn.classList.add('selected');
    selectedTowerType = type;
    showMessage(`Coloque ${type} no mapa`);
}

function selectTrapType(type) {
    selectedTowerType = null;
    selectedTower = null;
    document.getElementById('towerInfo').classList.add('hidden');
    document.querySelectorAll('.tower-btn, .trap-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.querySelector(`.trap-btn[data-type="${type}"]`);
    if (btn.disabled) return;
    btn.classList.add('selected');
    selectedTrapType = type;
    showMessage(`Coloque armadilha ${type}`);
}

// ============================================================
// EVENTOS
// ============================================================
document.getElementById('cancelBtn').addEventListener('click', () => {
    selectedTowerType = null;
    selectedTrapType = null;
    selectedTower = null;
    document.querySelectorAll('.tower-btn, .trap-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('towerInfo').classList.add('hidden');
    showMessage('Seleção cancelada');
});

document.getElementById('nextWaveBtn').addEventListener('click', startWave);
document.getElementById('resetBtn').addEventListener('click', resetSave);

document.getElementById('statsBtn').addEventListener('click', () => {
    const modal = document.getElementById('statsModal');
    const content = document.getElementById('statsContent');
    const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    content.innerHTML = `
        <div>⚔️ Inimigos mortos: <b>${stats.totalKills}</b></div>
        <div>💥 Dano total causado: <b>${stats.totalDamage}</b></div>
        <div>💰 Ouro total ganho: <b>${stats.totalGoldEarned}</b></div>
        <div>🏗️ Torres construídas: <b>${stats.towersBuilt}</b></div>
        <div>💸 Torres vendidas: <b>${stats.towersSold}</b></div>
        <div>👹 Bosses derrotados: <b>${stats.bossesKilled}</b></div>
        <div>🔥 Combo máximo: <b>x${stats.maxCombo}</b></div>
        <div>💔 Dano recebido: <b>${stats.damageTaken}</b></div>
        <div>🌊 Waves completas: <b>${stats.wavesCompleted}</b></div>
        <div>⏱️ Tempo jogado: <b>${mins}m ${secs}s</b></div>
        <div>⭐ Nível do jogador: <b>${playerLevel}</b></div>
    `;
    modal.classList.remove('hidden');
});

document.getElementById('closeStats').addEventListener('click', () => {
    document.getElementById('statsModal').classList.add('hidden');
});

document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameSpeed = parseInt(btn.dataset.speed);
    });
});

document.getElementById('autoWaveBtn').addEventListener('click', (e) => {
    autoWave = !autoWave;
    e.target.classList.toggle('active', autoWave);
    showMessage(autoWave ? '🔄 Auto-wave ATIVADO' : '🔄 Auto-wave DESATIVADO');
});

document.querySelectorAll('.skill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const skill = btn.dataset.skill;
        useSkill(skill);
    });
});

document.getElementById('upgradeBtn').addEventListener('click', () => {
    if (!selectedTower) return;
    if (selectedTower.level >= MAX_LEVEL) {
        showMessage('❌ Nível máximo!');
        return;
    }
    const cost = getUpgradeCost(selectedTower.level);
    if (gold < cost) {
        showMessage('❌ Ouro insuficiente!');
        return;
    }
    gold -= cost;
    selectedTower.level++;
    selectedTower.damage = Math.floor(selectedTower.damage * 1.4);
    selectedTower.range = Math.floor(selectedTower.range * 1.1);
    selectedTower.fireRate = Math.max(5, Math.floor(selectedTower.fireRate * 0.88));
    updateUI();
    updateTowerInfo();
    saveGame();
    createFloatingText(selectedTower.x, selectedTower.y, `⬆️ Nv ${selectedTower.level}!`, '#ffd700');
    showMessage(`⬆️ Nível ${selectedTower.level}!`);
});

document.getElementById('sellBtn').addEventListener('click', () => {
    if (!selectedTower) return;
    const value = getSellValue(selectedTower);
    gold += value;
    towers = towers.filter(t => t !== selectedTower);
    stats.towersSold++;
    selectedTower = null;
    document.getElementById('towerInfo').classList.add('hidden');
    updateUI();
    saveGame();
    showMessage(`💸 Vendida por ${value}g!`);
});

document.getElementById('targetMode').addEventListener('change', (e) => {
    if (selectedTower) {
        selectedTower.targetMode = e.target.value;
        showMessage(`🎯 Modo: ${e.target.value}`);
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    hoverCell = { x: Math.floor(mouseX / TILE), y: Math.floor(mouseY / TILE) };
});

canvas.addEventListener('click', () => {
    if (!hoverCell) return;
    const {x, y} = hoverCell;
    
    // Clicou em torre existente
    const clickedTower = towers.find(t => t.cx === x && t.cy === y);
    if (clickedTower) {
        selectedTower = clickedTower;
        selectedTowerType = null;
        selectedTrapType = null;
        document.querySelectorAll('.tower-btn, .trap-btn').forEach(b => b.classList.remove('selected'));
        updateTowerInfo();
        showMessage('Torre selecionada');
        return;
    }
    
    // Construir torre
    if (selectedTowerType) {
        const key = `${x},${y}`;
        const type = TOWER_TYPES[selectedTowerType];
        if (pathSet.has(key)) { showMessage('❌ Não pode construir no caminho!'); return; }
        if (towers.some(t => t.cx === x && t.cy === y)) { showMessage('❌ Já existe uma torre!'); return; }
        if (traps.some(t => t.cx === x && t.cy === y)) { showMessage('❌ Já existe armadilha!'); return; }
        if (towers.length >= MAX_TOWERS) { showMessage(`❌ Limite de ${MAX_TOWERS} torres!`); return; }
        const count = towers.filter(t => t.type === selectedTowerType).length;
        if (count >= TOWER_LIMITS[selectedTowerType]) { showMessage(`❌ Limite de ${selectedTowerType}s!`); return; }
        if (gold < type.cost) { showMessage('❌ Ouro insuficiente!'); return; }
        
        gold -= type.cost;
        const dmgMult = 1 + talents.damageBonus * 0.05;
        const rangeMult = 1 + talents.rangeBonus * 0.03;
        const rateMult = 1 - talents.cooldownReduction * 0.03;
        towers.push({
            cx: x, cy: y,
            x: x * TILE + TILE/2, y: y * TILE + TILE/2,
            type: selectedTowerType, level: 1,
            damage: Math.floor(type.damage * dmgMult),
            range: Math.floor(type.range * rangeMult),
            fireRate: Math.max(5, Math.floor(type.fireRate * rateMult)),
            color: type.color, projectileColor: type.projectileColor,
            projectileSpeed: type.projectileSpeed, splash: type.splash,
            effect: type.effect, cooldown: 0, angle: 0,
            targetMode: 'first'
        });
        stats.towersBuilt++;
        updateUI();
        saveGame();
        showMessage(`✅ ${selectedTowerType} construído!`);
        return;
    }
    
    // Construir armadilha
    if (selectedTrapType) {
        const key = `${x},${y}`;
        const type = TRAP_TYPES[selectedTrapType];
        if (pathSet.has(key)) { showMessage('❌ Não pode colocar no caminho!'); return; }
        if (towers.some(t => t.cx === x && t.cy === y)) { showMessage('❌ Já existe torre!'); return; }
        if (traps.some(t => t.cx === x && t.cy === y)) { showMessage('❌ Já existe armadilha!'); return; }
        if (traps.length >= MAX_TRAPS) { showMessage(`❌ Limite de armadilhas!`); return; }
        const count = traps.filter(t => t.type === selectedTrapType).length;
        if (count >= TRAP_LIMITS[selectedTrapType]) { showMessage(`❌ Limite de ${selectedTrapType}s!`); return; }
        if (gold < type.cost) { showMessage('❌ Ouro insuficiente!'); return; }
        
        gold -= type.cost;
        traps.push({
            cx: x, cy: y,
            x: x * TILE + TILE/2, y: y * TILE + TILE/2,
            type: selectedTrapType, ...type,
            triggered: false, lifetime: type.duration === -1 ? Infinity : 0
        });
        updateUI();
        saveGame();
        showMessage(`✅ Armadilha colocada!`);
        return;
    }
});

// ============================================================
// HABILIDADES GLOBAIS
// ============================================================
function useSkill(skill) {
    if (skillCooldowns[skill] > 0) {
        showMessage(`❌ Aguarde ${Math.ceil(skillCooldowns[skill]/60)}s`);
        return;
    }
    if (gold < SKILL_COST[skill]) {
        showMessage('❌ Ouro insuficiente!');
        return;
    }
    gold -= SKILL_COST[skill];
    skillCooldowns[skill] = SKILL_CD_MAX[skill];
    
    switch(skill) {
        case 'meteor':
            // Dano massivo em área no centro do mapa
            const cx = canvas.width/2, cy = canvas.height/2;
            for (const e of enemies) {
                if (dist({x:cx,y:cy}, e) < 150) {
                    e.hp -= 200;
                    stats.totalDamage += 200;
                }
            }
            createParticles(cx, cy, '#ff4500', 50, 8);
            createParticles(cx, cy, '#ffaa00', 40, 6);
            createFloatingText(cx, cy, '☄️ METEOR!', '#ff4500', 24);
            break;
        case 'heal':
            lives += 5;
            createFloatingText(canvas.width/2, canvas.height/2, '+5 ❤️', '#2ecc71', 24);
            break;
        case 'freeze':
            globalFreeze = 300; // 5 segundos
            createFloatingText(canvas.width/2, canvas.height/2, '❄️ CONGELADO!', '#00bcd4', 24);
            break;
        case 'gold':
            const bonus = 100 + playerLevel * 20;
            gold += bonus;
            createFloatingText(canvas.width/2, canvas.height/2, `+${bonus} 💰`, '#ffd700', 24);
            break;
    }
    updateUI();
}

// ============================================================
// UI
// ============================================================
function showMessage(text) {
    document.getElementById('message').textContent = text;
}

function updateUI() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('lives').textContent = lives;
    document.getElementById('wave').textContent = `${waveInLevel} / ${infiniteMode ? '∞' : '15'}`;
    document.getElementById('towerCount').textContent = towers.length;
    document.getElementById('playerLevel').textContent = playerLevel;
    document.getElementById('xp').textContent = playerXP;
    document.getElementById('xpMax').textContent = xpToNext;
    
    for (const type of Object.keys(TOWER_LIMITS)) {
        const btn = document.querySelector(`.tower-btn[data-type="${type}"]`);
        if (!btn) continue;
        const count = towers.filter(t => t.type === type).length;
        btn.querySelector('.count').textContent = `${count}/${TOWER_LIMITS[type]}`;
        btn.disabled = count >= TOWER_LIMITS[type] || towers.length >= MAX_TOWERS;
    }
    
    for (const type of Object.keys(TRAP_LIMITS)) {
        const btn = document.querySelector(`.trap-btn[data-type="${type}"]`);
        if (!btn) continue;
        const count = traps.filter(t => t.type === type).length;
        btn.querySelector('.count').textContent = `${count}/${TRAP_LIMITS[type]}`;
        btn.disabled = count >= TRAP_LIMITS[type] || traps.length >= MAX_TRAPS;
    }
    
    // Atualiza cooldowns das skills
    for (const skill of Object.keys(skillCooldowns)) {
        const btn = document.querySelector(`.skill-btn[data-skill="${skill}"]`);
        if (!btn) continue;
        if (skillCooldowns[skill] > 0) {
            btn.classList.add('cooldown');
            btn.dataset.cd = Math.ceil(skillCooldowns[skill] / 60);
        } else {
            btn.classList.remove('cooldown');
            btn.dataset.cd = '';
        }
    }
    
    // Combo display
    const comboEl = document.getElementById('comboDisplay');
    if (comboCount > 1) {
        comboEl.classList.remove('hidden');
        document.getElementById('comboCount').textContent = comboCount;
    } else {
        comboEl.classList.add('hidden');
    }
}

function updateTowerInfo() {
    if (!selectedTower) {
        document.getElementById('towerInfo').classList.add('hidden');
        return;
    }
    document.getElementById('towerInfo').classList.remove('hidden');
    const t = selectedTower;
    const type = TOWER_TYPES[t.type];
    const sellValue = getSellValue(t);
    
    let effectText = '';
    if (t.effect === 'slow') effectText = '<div class="stat-line"><span>🐌 Efeito:</span><span>Desacelera</span></div>';
    if (t.effect === 'poison') effectText = '<div class="stat-line"><span>☠️ Efeito:</span><span>Veneno 3s</span></div>';
    if (t.effect === 'laser') effectText = '<div class="stat-line"><span>⚡ Efeito:</span><span>Feixe contínuo</span></div>';
    if (t.effect === 'chain') effectText = '<div class="stat-line"><span>🔌 Efeito:</span><span>Corrente</span></div>';
    if (t.effect === 'magic') effectText = '<div class="stat-line"><span>🔮 Efeito:</span><span>Ignora armadura</span></div>';
    
    let html = `
        <div class="stat-line"><span>${type.icon} ${t.type.toUpperCase()}</span><span>Nv ${t.level}/${MAX_LEVEL}</span></div>
        <div class="stat-line"><span>⚔️ Dano:</span><span>${t.damage}</span></div>
        <div class="stat-line"><span>📏 Alcance:</span><span>${t.range}</span></div>
        <div class="stat-line"><span>⏱️ Cadência:</span><span>${t.fireRate}</span></div>
        ${effectText}
    `;
    
    if (t.level < MAX_LEVEL) {
        const cost = getUpgradeCost(t.level);
        html += `<div style="color:#2ecc71;font-size:10px;margin-top:3px;border-top:1px dashed #555;padding-top:3px;">⬆️ Custo: ${cost}g</div>`;
        document.getElementById('upgradeBtn').textContent = `⬆️ Aprimorar (${cost}g)`;
        document.getElementById('upgradeBtn').disabled = false;
    } else {
        html += `<div style="color:#ffd700;font-size:10px;margin-top:3px;border-top:1px dashed #555;padding-top:3px;">✨ NÍVEL MÁXIMO</div>`;
        document.getElementById('upgradeBtn').textContent = `✨ Nível Máximo`;
        document.getElementById('upgradeBtn').disabled = true;
    }
    
    document.getElementById('towerStats').innerHTML = html;
    document.getElementById('sellBtn').textContent = `💸 Vender (${sellValue}g)`;
    document.getElementById('targetMode').value = t.targetMode;
}

// ============================================================
// WAVES E INIMIGOS
// ============================================================
function startWave() {
    if (waveInProgress) return;
    if (!infiniteMode && waveInLevel >= 15) { showMessage('❌ Complete o nível!'); return; }
    
    wave++;
    waveInLevel++;
    waveInProgress = true;
    
    const levelMultiplier = 1 + currentMapIndex * 0.3 + (infiniteMode ? wave * 0.1 : 0);
    const isBossWave = !infiniteMode && waveInLevel === 15;
    
    if (isBossWave) {
        enemiesToSpawn = 8;
        bossWarning = true;
        document.getElementById('bossAlert').classList.remove('hidden');
        showMessage(`👹 BOSS CHEGANDO!`);
    } else {
        enemiesToSpawn = Math.floor((5 + waveInLevel * 2) * levelMultiplier);
        showMessage(`🌊 Wave ${waveInLevel}${infiniteMode ? '' : '/15'}`);
    }
    spawnTimer = 0;
    updateUI();
}

function spawnEnemy() {
    const levelMultiplier = 1 + currentMapIndex * 0.3 + (infiniteMode ? wave * 0.1 : 0);
    
    // Escolhe tipo baseado na wave
    let type = 'normal';
    const roll = Math.random();
    if (wave > 3 && roll < 0.15) type = 'fast';
    else if (wave > 5 && roll < 0.25) type = 'tank';
    else if (wave > 7 && roll < 0.35) type = 'flying';
    else if (wave > 10 && roll < 0.42) type = 'healer';
    else if (wave > 8 && roll < 0.50) type = 'armored';
    
    const base = ENEMY_TYPES[type];
    const hp = Math.floor(base.hp * levelMultiplier);
    enemies.push({
        x: waypoints[0].x, y: waypoints[0].y,
        hp: hp, maxHp: hp,
        speed: base.speed, baseSpeed: base.speed,
        waypointIndex: 1,
        reward: Math.floor(base.reward * levelMultiplier),
        size: base.size,
        type: type,
        armor: base.armor,
        flying: base.flying || false,
        healer: base.healer || false,
        color: base.color || SKINS[MAPS[currentMapIndex].skin].enemy,
        outline: base.outline || SKINS[MAPS[currentMapIndex].skin].enemyOutline,
        isBoss: false,
        effects: { slow: 0, poison: 0, poisonDmg: 0, frozen: 0 },
        healCooldown: 0
    });
}

function spawnBoss() {
    const levelMultiplier = 1 + currentMapIndex * 0.3 + (infiniteMode ? wave * 0.1 : 0);
    const hp = Math.floor(1000 * levelMultiplier * (1 + currentMapIndex * 0.5));
    const bossTypes = ['summoner', 'healer', 'berserker'];
    const bossType = bossTypes[currentMapIndex % bossTypes.length];
    
    enemies.push({
        x: waypoints[0].x, y: waypoints[0].y,
        hp: hp, maxHp: hp,
        speed: 0.7, baseSpeed: 0.7,
        waypointIndex: 1,
        reward: Math.floor(200 * levelMultiplier),
        size: 30,
        type: 'boss',
        armor: 10,
        flying: false,
        healer: false,
        color: '#8b0000',
        outline: '#ff4444',
        isBoss: true,
        bossType: bossType,
        effects: { slow: 0, poison: 0, poisonDmg: 0, frozen: 0 },
        abilityCooldown: 180,
        healCooldown: 0
    });
    bossActive = enemies[enemies.length - 1];
    bossWarning = false;
    createFloatingText(canvas.width/2, 50, `👹 BOSS ${bossType.toUpperCase()}!`, '#ff0000', 24);
}

// ============================================================
// SISTEMA DE XP E TALENTOS
// ============================================================
function addXP(amount) {
    playerXP += amount;
    while (playerXP >= xpToNext) {
        playerXP -= xpToNext;
        playerLevel++;
        xpToNext = Math.floor(xpToNext * 1.5);
        showLevelUpModal();
    }
    updateUI();
}

function showLevelUpModal() {
    const modal = document.getElementById('levelUpModal');
    document.getElementById('levelUpText').textContent = `Você alcançou o nível ${playerLevel}! Escolha um talento:`;
    
    const allTalents = [
        { key: 'damageBonus', icon: '⚔️', name: 'Força', desc: '+5% dano torres' },
        { key: 'rangeBonus', icon: '📏', name: 'Alcance', desc: '+3% alcance torres' },
        { key: 'goldBonus', icon: '💰', name: 'Fortuna', desc: '+5% ouro ganho' },
        { key: 'cooldownReduction', icon: '⏱️', name: 'Rapidez', desc: '-3% cadência' },
        { key: 'interestRate', icon: '🏦', name: 'Banqueiro', desc: '+1% juros/wave' },
        { key: 'comboBonus', icon: '🔥', name: 'Combo', desc: '+10% bônus combo' }
    ];
    
    // Escolhe 3 aleatórios
    const choices = [];
    const pool = [...allTalents];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        choices.push(pool.splice(idx, 1)[0]);
    }
    
    const container = document.getElementById('talentChoices');
    container.innerHTML = '';
    for (const talent of choices) {
        const div = document.createElement('div');
        div.className = 'talent-choice';
        div.innerHTML = `
            <div class="icon">${talent.icon}</div>
            <div class="name">${talent.name}</div>
            <div class="desc">${talent.desc}</div>
            <div class="desc">Nível atual: ${talents[talent.key]}</div>
        `;
        div.addEventListener('click', () => {
            talents[talent.key]++;
            modal.classList.add('hidden');
            showMessage(`✨ ${talent.name} melhorado!`);
            saveGame();
        });
        container.appendChild(div);
    }
    
    modal.classList.remove('hidden');
}

// ============================================================
// ATUALIZAÇÃO
// ============================================================
function update() {
    for (let step = 0; step < gameSpeed; step++) {
        if (gameSpeed === 0) break;
        updateOnce();
    }
}

function updateOnce() {
    if (lives <= 0) return;
    
    // Auto-wave
    if (autoWave && !waveInProgress && lives > 0) {
        autoWaveTimer++;
        if (autoWaveTimer >= 180) { // 3 segundos
            startWave();
            autoWaveTimer = 0;
        }
    }
    
    // Cooldowns de skills
    for (const skill of Object.keys(skillCooldowns)) {
        if (skillCooldowns[skill] > 0) skillCooldowns[skill]--;
    }
    
    // Combo timer
    if (comboCount > 0) {
        comboTimer--;
        if (comboTimer <= 0) comboCount = 0;
    }
    
    // Global freeze
    if (globalFreeze > 0) globalFreeze--;
    
    // Spawn
    if (waveInProgress && enemiesToSpawn > 0) {
        spawnTimer++;
        if (spawnTimer >= 40) {
            spawnEnemy();
            enemiesToSpawn--;
            spawnTimer = 0;
        }
    }
    
    // Spawn do boss
    if (waveInProgress && enemiesToSpawn === 0 && bossWarning && !bossActive) {
        spawnBoss();
    }
    
    // Fim da wave
    if (waveInProgress && enemiesToSpawn === 0 && enemies.length === 0 && !bossWarning) {
        waveInProgress = false;
        stats.wavesCompleted++;
        
        // Juros sobre ouro
        const interestRate = 0.05 + talents.interestRate * 0.01;
        const interest = Math.floor(gold * interestRate);
        if (interest > 0) {
            gold += interest;
            createFloatingText(canvas.width/2, 100, `🏦 +${interest}g juros`, '#ffd700');
        }
        
        const bonus = 20 + waveInLevel * 5;
        gold += bonus;
        stats.totalGoldEarned += bonus + interest;
        createFloatingText(canvas.width/2, canvas.height/2, `+${bonus}g`, '#ffd700');
        
        if (!infiniteMode && waveInLevel >= 15) {
            if (currentMapIndex >= MAPS.length - 1) {
                // Ativa modo infinito
                infiniteMode = true;
                waveInLevel = 0;
                gold += 500;
                createFloatingText(canvas.width/2, canvas.height/2 - 50, '🎊 MODO INFINITO!', '#ffd700', 28);
                showMessage('🎊 Parabéns! Modo infinito desbloqueado!');
            } else {
                currentMapIndex++;
                waveInLevel = 0;
                gold += 200;
                loadMap(currentMapIndex);
                showMessage(`🎉 NÍVEL COMPLETO! +200g`);
            }
        } else {
            showMessage(`✅ Wave ${waveInLevel}${infiniteMode ? '' : '/15'}`);
        }
        updateUI();
        saveGame();
    }
    
    // Inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        
        // Efeitos
        if (e.effects.frozen > 0 || globalFreeze > 0) {
            e.effects.frozen = Math.max(0, e.effects.frozen - 1);
            // Não se move nem age
        } else {
            if (e.effects.slow > 0) {
                e.speed = e.baseSpeed * 0.5;
                e.effects.slow--;
            } else {
                e.speed = e.baseSpeed;
            }
            
            // Veneno
            if (e.effects.poison > 0) {
                e.hp -= e.effects.poisonDmg;
                stats.totalDamage += e.effects.poisonDmg;
                e.effects.poison--;
                if (Math.random() < 0.3) createParticles(e.x, e.y, '#76ff03', 1, 2);
            }
            
            // Curandeiro cura aliados
            if (e.healer) {
                e.healCooldown--;
                if (e.healCooldown <= 0) {
                    for (const other of enemies) {
                        if (other !== e && dist(e, other) < 80 && other.hp < other.maxHp) {
                            other.hp = Math.min(other.maxHp, other.hp + 5);
                            createParticles(other.x, other.y, '#2ecc71', 3, 2);
                        }
                    }
                    e.healCooldown = 60;
                }
            }
            
            // Boss abilities
            if (e.isBoss) {
                e.abilityCooldown--;
                if (e.abilityCooldown <= 0) {
                    switch(e.bossType) {
                        case 'summoner':
                            // Invoca 3 minions
                            for (let j = 0; j < 3; j++) {
                                const minion = {
                                    x: e.x + (Math.random()-0.5)*30,
                                    y: e.y + (Math.random()-0.5)*30,
                                    hp: 30, maxHp: 30,
                                    speed: 1.5, baseSpeed: 1.5,
                                    waypointIndex: e.waypointIndex,
                                    reward: 3, size: 10,
                                    type: 'minion', armor: 0,
                                    color: '#ff4444', outline: '#8b0000',
                                    isBoss: false, flying: false, healer: false,
                                    effects: { slow: 0, poison: 0, poisonDmg: 0, frozen: 0 }
                                };
                                enemies.push(minion);
                            }
                            createParticles(e.x, e.y, '#ff4444', 20, 5);
                            createFloatingText(e.x, e.y, '👥 INVOCOU!', '#ff4444');
                            break;
                        case 'healer':
                            // Cura a si mesmo
                            e.hp = Math.min(e.maxHp, e.hp + 100);
                            createParticles(e.x, e.y, '#2ecc71', 20, 5);
                            createFloatingText(e.x, e.y, '💚 CURA!', '#2ecc71');
                            break;
                        case 'berserker':
                            // Aumenta velocidade temporariamente
                            e.speed = e.baseSpeed * 2;
                            setTimeout(() => { if (enemies.includes(e)) e.speed = e.baseSpeed; }, 3000);
                            createParticles(e.x, e.y, '#ff0000', 20, 5);
                            createFloatingText(e.x, e.y, '💢 FÚRIA!', '#ff0000');
                            break;
                    }
                    e.abilityCooldown = 300;
                }
            }
            
            // Movimento
            const target = waypoints[e.waypointIndex];
            const dx = target.x - e.x;
            const dy = target.y - e.y;
            const d = Math.hypot(dx, dy);
            
            if (d < e.speed) {
                e.x = target.x; e.y = target.y;
                e.waypointIndex++;
                if (e.waypointIndex >= waypoints.length) {
                    enemies.splice(i, 1);
                    const damage = e.isBoss ? 5 : 1;
                    lives -= damage;
                    stats.damageTaken += damage;
                    if (e.isBoss) {
                        bossActive = null;
                        createFloatingText(canvas.width/2, 50, `💀 BOSS PASSOU! -${damage}❤️`, '#ff0000');
                    }
                    updateUI();
                    if (lives <= 0) {
                        showMessage('💀 GAME OVER!');
                        waveInProgress = false;
                    }
                    continue;
                }
            } else {
                e.x += (dx / d) * e.speed;
                e.y += (dy / d) * e.speed;
            }
        }
        
        // Verifica morte
        if (e.hp <= 0) {
            const reward = Math.floor(e.reward * (1 + talents.goldBonus * 0.05) * (1 + comboCount * 0.1 * (1 + talents.comboBonus * 0.1)));
            gold += reward;
            stats.totalGoldEarned += reward;
            stats.totalKills++;
            
            // Combo
            comboCount++;
            comboTimer = COMBO_WINDOW;
            if (comboCount > stats.maxCombo) stats.maxCombo = comboCount;
            
            // XP
            addXP(e.isBoss ? 50 : (e.type === 'tank' || e.type === 'armored' ? 8 : 5));
            
            createParticles(e.x, e.y, e.color, e.isBoss ? 40 : 10, e.isBoss ? 6 : 4);
            createFloatingText(e.x, e.y, `+${reward}g`, '#ffd700');
            
            if (comboCount > 2) {
                createFloatingText(e.x, e.y - 20, `x${comboCount} COMBO!`, '#ff6b00', 14);
            }
            
            if (e.isBoss) {
                bossActive = null;
                stats.bossesKilled++;
                createFloatingText(canvas.width/2, canvas.height/2 - 30, '👑 BOSS DERROTADO!', '#ffd700', 28);
                gold += 100;
            }
            
            enemies.splice(i, 1);
            updateUI();
            saveGame();
        }
    }
    
    // Armadilhas
    for (let i = traps.length - 1; i >= 0; i--) {
        const trap = traps[i];
        
        if (trap.type === 'mine' && !trap.triggered) {
            for (const e of enemies) {
                if (dist(trap, e) < trap.radius) {
                    // Explode!
                    for (const other of enemies) {
                        if (dist(trap, other) < trap.radius) {
                            other.hp -= trap.damage;
                            stats.totalDamage += trap.damage;
                        }
                    }
                    createParticles(trap.x, trap.y, '#ff4500', 30, 6);
                    createParticles(trap.x, trap.y, '#ffaa00', 20, 5);
                    createFloatingText(trap.x, trap.y, '💥 BOOM!', '#ff4500', 20);
                    traps.splice(i, 1);
                    break;
                }
            }
        } else if (trap.type === 'spikes') {
            for (const e of enemies) {
                if (dist(trap, e) < trap.radius) {
                    e.hp -= trap.damage / 60; // dano por frame
                    stats.totalDamage += trap.damage / 60;
                    if (Math.random() < 0.1) createParticles(e.x, e.y, '#c0c0c0', 1, 2);
                }
            }
        } else if (trap.type === 'slowfield') {
            for (const e of enemies) {
                if (dist(trap, e) < trap.radius && e.effects.slow < 10) {
                    e.effects.slow = 10;
                }
            }
        }
    }
    
    // Torres
    for (const t of towers) {
        if (t.cooldown > 0) t.cooldown--;
        
        let target = null;
        let bestValue = -Infinity;
        
        for (const e of enemies) {
            if (dist(t, e) > t.range) continue;
            
            let value = 0;
            switch(t.targetMode) {
                case 'first': value = e.waypointIndex + (1 - dist(e, waypoints[Math.min(e.waypointIndex, waypoints.length-1)]) / 1000); break;
                case 'last': value = -e.waypointIndex; break;
                case 'strong': value = e.hp; break;
                case 'weak': value = -e.hp; break;
                case 'close': value = -dist(t, e); break;
            }
            
            if (value > bestValue) {
                bestValue = value;
                target = e;
            }
        }
        
        if (target) {
            t.angle = Math.atan2(target.y - t.y, target.x - t.x);
            
            if (t.effect === 'laser') {
                // Laser contínuo
                if (t.cooldown <= 0) {
                    let dmg = t.damage;
                    if (target.armor > 0 && t.effect !== 'magic') dmg = Math.max(1, dmg - target.armor);
                    target.hp -= dmg;
                    stats.totalDamage += dmg;
                    lasers.push({ x1: t.x, y1: t.y, x2: target.x, y2: target.y, color: t.projectileColor, life: 3 });
                    t.cooldown = t.fireRate;
                }
            } else if (t.effect === 'chain') {
                // Tesla - corrente entre inimigos
                if (t.cooldown <= 0) {
                    const chainTargets = [target];
                    let lastTarget = target;
                    for (let c = 0; c < 3; c++) {
                        let nextTarget = null;
                        let minDist = 100;
                        for (const e of enemies) {
                            if (chainTargets.includes(e)) continue;
                            const d = dist(lastTarget, e);
                            if (d < minDist) {
                                minDist = d;
                                nextTarget = e;
                            }
                        }
                        if (nextTarget) {
                            chainTargets.push(nextTarget);
                            lastTarget = nextTarget;
                        }
                    }
                    
                    let prev = { x: t.x, y: t.y };
                    for (const ct of chainTargets) {
                        let dmg = t.damage;
                        if (ct.armor > 0) dmg = Math.max(1, dmg - ct.armor);
                        ct.hp -= dmg;
                        stats.totalDamage += dmg;
                        lightnings.push({ x1: prev.x, y1: prev.y, x2: ct.x, y2: ct.y, life: 10 });
                        createParticles(ct.x, ct.y, '#ffff00', 5, 3);
                        prev = ct;
                    }
                    t.cooldown = t.fireRate;
                }
            } else if (t.cooldown <= 0) {
                // Projétil normal
                projectiles.push({
                    x: t.x, y: t.y, target: target,
                    speed: t.projectileSpeed, damage: t.damage,
                    color: t.projectileColor, splash: t.splash,
                    effect: t.effect,
                    size: t.splash > 0 ? 6 : 3
                });
                t.cooldown = t.fireRate;
            }
        }
    }
    
    // Projéteis
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!enemies.includes(p.target)) {
            projectiles.splice(i, 1);
            continue;
        }
        const dx = p.target.x - p.x;
        const dy = p.target.y - p.y;
        const d = Math.hypot(dx, dy);
        
        if (d < p.speed + p.target.size) {
            let dmg = p.damage;
            if (p.target.armor > 0 && p.effect !== 'magic') {
                dmg = Math.max(1, dmg - p.target.armor);
            }
            p.target.hp -= dmg;
            stats.totalDamage += dmg;
            createParticles(p.x, p.y, p.color, 4, 3);
            
            if (p.effect === 'slow') {
                p.target.effects.slow = 90;
                createParticles(p.x, p.y, '#b3e5fc', 6, 3);
            } else if (p.effect === 'poison') {
                p.target.effects.poison = 180;
                p.target.effects.poisonDmg = Math.max(1, Math.floor(p.damage * 0.3));
            }
            
            if (p.splash > 0) {
                for (const e of enemies) {
                    if (e !== p.target && dist(p, e) < p.splash) {
                        let splashDmg = p.damage * 0.5;
                        if (e.armor > 0 && p.effect !== 'magic') splashDmg = Math.max(1, splashDmg - e.armor);
                        e.hp -= splashDmg;
                        stats.totalDamage += splashDmg;
                        if (p.effect === 'slow') e.effects.slow = 60;
                        if (p.effect === 'poison') {
                            e.effects.poison = 120;
                            e.effects.poisonDmg = Math.max(1, Math.floor(p.damage * 0.15));
                        }
                    }
                }
                createParticles(p.x, p.y, '#ff8800', 15, 5);
            }
            projectiles.splice(i, 1);
        } else {
            p.x += (dx / d) * p.speed;
            p.y += (dy / d) * p.speed;
        }
    }
    
    // Lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].life--;
        if (lasers[i].life <= 0) lasers.splice(i, 1);
    }
    
    // Lightnings
    for (let i = lightnings.length - 1; i >= 0; i--) {
        lightnings[i].life--;
        if (lightnings[i].life <= 0) lightnings.splice(i, 1);
    }
    
    // Partículas
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.95; p.vy *= 0.95;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }
    
    // Textos flutuantes
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const t = floatingTexts[i];
        t.y -= 1; t.life--;
        if (t.life <= 0) floatingTexts.splice(i, 1);
    }
    
    updateUI();
}

// ============================================================
// DESENHO
// ============================================================
function draw() {
    const skin = SKINS[MAPS[currentMapIndex].skin];
    
    // Fundo
    ctx.fillStyle = skin.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Textura do fundo
    ctx.globalAlpha = 0.15;
    if (currentMapIndex === 0) {
        ctx.fillStyle = '#1a3a0a';
        for (let i = 0; i < 40; i++) ctx.fillRect((i * 73) % canvas.width, (i * 137) % canvas.height, 3, 3);
    } else if (currentMapIndex === 1) {
        ctx.fillStyle = '#8b4513';
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc((i * 91) % canvas.width, (i * 113) % canvas.height, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (currentMapIndex === 2) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) ctx.fillRect((i * 67) % canvas.width, (i * 149) % canvas.height, 2, 2);
    } else if (currentMapIndex === 3) {
        ctx.fillStyle = '#ff4500';
        for (let i = 0; i < 25; i++) {
            ctx.beginPath();
            ctx.arc((i * 101) % canvas.width, (i * 151) % canvas.height, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 80; i++) {
            ctx.fillRect((i * 47) % canvas.width, (i * 83) % canvas.height, 1, 1);
        }
    }
    ctx.globalAlpha = 1;
    
    // Terrenos especiais
    const map = MAPS[currentMapIndex];
    for (const terrain of map.terrains || []) {
        const tx = terrain.x * TILE;
        const ty = terrain.y * TILE;
        switch(terrain.type) {
            case 'hill':
                ctx.fillStyle = 'rgba(139, 90, 43, 0.5)';
                ctx.beginPath();
                ctx.arc(tx + TILE/2, ty + TILE/2, TILE/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#8b5a2b';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⛰️', tx + TILE/2, ty + TILE/2 + 7);
                break;
            case 'sand':
                ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.fillRect(tx, ty, TILE, TILE);
                break;
            case 'ice':
                ctx.fillStyle = 'rgba(173, 216, 230, 0.5)';
                ctx.fillRect(tx, ty, TILE, TILE);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(tx+2, ty+2, TILE-4, TILE-4);
                break;
            case 'lava':
                ctx.fillStyle = 'rgba(255, 69, 0, 0.6)';
                ctx.fillRect(tx, ty, TILE, TILE);
                ctx.fillStyle = '#ffaa00';
                ctx.beginPath();
                ctx.arc(tx + TILE/2, ty + TILE/2, 8, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'void':
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(tx, ty, TILE, TILE);
                ctx.strokeStyle = '#9b59b6';
                ctx.lineWidth = 2;
                ctx.strokeRect(tx+2, ty+2, TILE-4, TILE-4);
                break;
        }
    }
    
    // Grid
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += TILE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += TILE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    
    // Caminho
    ctx.strokeStyle = skin.pathBorder;
    ctx.lineWidth = TILE + 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i].x, waypoints[i].y);
    ctx.stroke();
    
    ctx.strokeStyle = skin.path;
    ctx.lineWidth = TILE - 4;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i].x, waypoints[i].y);
    ctx.stroke();
    
    // Início e fim
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(0, waypoints[0].y - TILE/2, TILE/2, TILE);
    ctx.fillStyle = '#e74c3c';
    const last = waypoints[waypoints.length-1];
    ctx.fillRect(canvas.width - TILE/2, last.y - TILE/2, TILE/2, TILE);
    
    // Preview
    if ((selectedTowerType || selectedTrapType) && hoverCell) {
        const {x, y} = hoverCell;
        const key = `${x},${y}`;
        const blocked = pathSet.has(key) || towers.some(t => t.cx === x && t.cy === y) || traps.some(t => t.cx === x && t.cy === y);
        
        if (selectedTowerType) {
            const type = TOWER_TYPES[selectedTowerType];
            const count = towers.filter(t => t.type === selectedTowerType).length;
            const atLimit = count >= TOWER_LIMITS[selectedTowerType] || towers.length >= MAX_TOWERS;
            const canAfford = gold >= type.cost;
            const valid = !blocked && !atLimit && canAfford;
            
            ctx.fillStyle = valid ? 'rgba(0, 255, 0, 0.15)' : 'rgba(255, 0, 0, 0.15)';
            ctx.strokeStyle = valid ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(x * TILE + TILE/2, y * TILE + TILE/2, type.range, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            
            ctx.fillStyle = valid ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)';
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        } else if (selectedTrapType) {
            const type = TRAP_TYPES[selectedTrapType];
            const count = traps.filter(t => t.type === selectedTrapType).length;
            const atLimit = count >= TRAP_LIMITS[selectedTrapType] || traps.length >= MAX_TRAPS;
            const canAfford = gold >= type.cost;
            const valid = !blocked && !atLimit && canAfford;
            
            ctx.fillStyle = valid ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(x * TILE + TILE/2, y * TILE + TILE/2, type.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
    }
    
    // Armadilhas
    for (const trap of traps) {
        if (trap.type === 'slowfield') {
            ctx.fillStyle = 'rgba(100, 100, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(trap.x - 15, trap.y - 15, 30, 30);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(trap.icon, trap.x, trap.y);
    }
    
    // Torres
    for (const t of towers) {
        const isSelected = t === selectedTower;
        
        if (isSelected) {
            ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }
        
        ctx.fillStyle = '#555';
        ctx.fillRect(t.x - 16, t.y - 16, 32, 32);
        
        const levelColors = [t.color, lightenColor(t.color, 15), lightenColor(t.color, 30), lightenColor(t.color, 45), lightenColor(t.color, 60)];
        ctx.fillStyle = levelColors[Math.min(t.level - 1, 4)];
        ctx.beginPath();
        ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
        ctx.fill();
        
        if (t.level > 1) {
            ctx.strokeStyle = t.level >= 4 ? '#ffd700' : t.level >= 3 ? '#ff6b00' : '#c0c0c0';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x + Math.cos(t.angle) * 18, t.y + Math.sin(t.angle) * 18);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        if (t.level > 1) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('★'.repeat(t.level - 1), t.x, t.y - 18);
        }
        
        if (isSelected) {
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(t.x - 18, t.y - 18, 36, 36);
        }
    }
    
    // Lasers
    for (const l of lasers) {
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = l.life / 3;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // Lightnings
    for (const l of lightnings) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.globalAlpha = l.life / 10;
        ctx.beginPath();
        let px = l.x1, py = l.y1;
        ctx.moveTo(px, py);
        const segments = 5;
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const nx = l.x1 + (l.x2 - l.x1) * t + (Math.random() - 0.5) * 10;
            const ny = l.y1 + (l.y2 - l.y1) * t + (Math.random() - 0.5) * 10;
            ctx.lineTo(nx, ny);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // Inimigos
    for (const e of enemies) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(e.x, e.y + e.size, e.size, e.size/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        if (e.isBoss) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size + 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = e.outline;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Coroa
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(e.x - 18, e.y - e.size - 2);
            ctx.lineTo(e.x - 12, e.y - e.size - 14);
            ctx.lineTo(e.x - 6, e.y - e.size - 6);
            ctx.lineTo(e.x, e.y - e.size - 18);
            ctx.lineTo(e.x + 6, e.y - e.size - 6);
            ctx.lineTo(e.x + 12, e.y - e.size - 14);
            ctx.lineTo(e.x + 18, e.y - e.size - 2);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(e.x - 10, e.y - 5, 5, 0, Math.PI * 2);
            ctx.arc(e.x + 10, e.y - 5, 5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = e.outline;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Ícones específicos
            if (e.flying) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🦅', e.x, e.y - e.size - 5);
            } else if (e.healer) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('✚', e.x, e.y + 4);
            } else if (e.type === 'tank' || e.type === 'armored') {
                ctx.strokeStyle = '#c0c0c0';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.size - 3, 0, Math.PI * 2);
                ctx.stroke();
            } else if (e.type === 'fast') {
                ctx.fillStyle = '#ffffff';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('»', e.x, e.y + 3);
            } else {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(e.x - 3, e.y - 2, 2, 0, Math.PI * 2);
                ctx.arc(e.x + 3, e.y - 2, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(e.x - 3, e.y - 2, 1, 0, Math.PI * 2);
                ctx.arc(e.x + 3, e.y - 2, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Efeitos visuais
        if (e.effects.slow > 0 || e.effects.frozen > 0 || globalFreeze > 0) {
            ctx.strokeStyle = '#00bcd4';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size + 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        if (e.effects.poison > 0) {
            ctx.fillStyle = 'rgba(118, 255, 3, 0.4)';
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size + 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Barra de vida
        const barW = e.isBoss ? 80 : 30;
        const barH = e.isBoss ? 8 : 4;
        const hpRatio = e.hp / e.maxHp;
        ctx.fillStyle = '#000';
        ctx.fillRect(e.x - barW/2, e.y - e.size - (e.isBoss ? 28 : 10), barW, barH);
        ctx.fillStyle = hpRatio > 0.5 ? '#2ecc71' : hpRatio > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(e.x - barW/2, e.y - e.size - (e.isBoss ? 28 : 10), barW * hpRatio, barH);
        
        if (e.isBoss) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`BOSS ${Math.floor(hpRatio * 100)}%`, e.x, e.y - e.size - 32);
        }
    }
    
    // Projéteis
    for (const p of projectiles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        if (p.effect === 'slow') {
            ctx.fillStyle = 'rgba(179, 229, 252, 0.3)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.effect === 'poison') {
            ctx.fillStyle = 'rgba(118, 255, 3, 0.3)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Partículas
    for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, p.life / 20);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    // Textos flutuantes
    for (const t of floatingTexts) {
        ctx.fillStyle = t.color;
        ctx.globalAlpha = Math.min(1, t.life / 30);
        ctx.font = `bold ${t.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
        ctx.globalAlpha = 1;
    }
    
    // Global freeze overlay
    if (globalFreeze > 0) {
        ctx.fillStyle = 'rgba(173, 216, 230, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Game over overlay
    if (lives <= 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💀 GAME OVER 💀', canvas.width/2, canvas.height/2 - 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Waves: ${stats.wavesCompleted} | Kills: ${stats.totalKills}`, canvas.width/2, canvas.height/2 + 20);
        ctx.fillText('Pressione F5 para recomeçar', canvas.width/2, canvas.height/2 + 60);
    }
}

// ============================================================
// LOOP
// ============================================================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
createTowerButtons();
createTrapButtons();

const loaded = loadGame();
if (loaded) {
    showMessage('💾 Save carregado!');
} else {
    // Aplica talentos iniciais
    gold += talents.startGold * 50;
    lives += talents.livesBonus * 2;
    loadMap(0);
    showMessage('🏰 Bem-vindo ao Ultimate Edition!');
}
updateUI();
gameLoop();