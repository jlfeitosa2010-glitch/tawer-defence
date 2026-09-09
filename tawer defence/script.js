// ============================================================
// CONFIGURAÇÕES E DIFICULDADES
// ============================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE = 40;
const COLS = canvas.width / TILE;
const ROWS = canvas.height / TILE;

const DIFFICULTIES = {
    easy: {
        name: 'Fácil', icon: '🌱', color: '#2ecc71',
        lives: 30, goldMultiplier: 1.5, enemyHpMult: 0.7, enemySpeedMult: 0.85,
        startGold: 300, bossHpMult: 0.6, rewardMult: 1.3, interestRate: 0.08
    },
    normal: {
        name: 'Normal', icon: '⚔️', color: '#f1c40f',
        lives: 20, goldMultiplier: 1.0, enemyHpMult: 1.0, enemySpeedMult: 1.0,
        startGold: 200, bossHpMult: 1.0, rewardMult: 1.0, interestRate: 0.05
    },
    hard: {
        name: 'Difícil', icon: '🔥', color: '#e67e22',
        lives: 15, goldMultiplier: 0.7, enemyHpMult: 1.5, enemySpeedMult: 1.15,
        startGold: 150, bossHpMult: 1.5, rewardMult: 0.8, interestRate: 0.04
    },
    nightmare: {
        name: 'Pesadelo', icon: '💀', color: '#e74c3c',
        lives: 10, goldMultiplier: 0.5, enemyHpMult: 2.5, enemySpeedMult: 1.3,
        startGold: 100, bossHpMult: 2.5, rewardMult: 0.6, interestRate: 0.03
    }
};

// ============================================================
// SKINS DE MAPA
// ============================================================
const MAP_SKINS = {
    forest: { name:'Floresta', emoji:'🌲', bg:'#2d5016', path:'#8b6f47', pathBorder:'#5d4a2f', enemy:'#c0392b', enemyOutline:'#7b1f12', borderColor:'#00d4ff' },
    desert: { name:'Deserto', emoji:'🏜️', bg:'#c2956a', path:'#a0522d', pathBorder:'#6b3410', enemy:'#8e44ad', enemyOutline:'#4a235a', borderColor:'#f39c12' },
    ice: { name:'Gelo', emoji:'❄️', bg:'#b8d4e3', path:'#5d7c99', pathBorder:'#2c3e50', enemy:'#16a085', enemyOutline:'#0b5345', borderColor:'#3498db' },
    volcano: { name:'Vulcão', emoji:'🌋', bg:'#3a1a0a', path:'#5a2a1a', pathBorder:'#2a0a00', enemy:'#ff4500', enemyOutline:'#8b0000', borderColor:'#ff6b00' },
    space: { name:'Espaço', emoji:'🌌', bg:'#0a0a2e', path:'#2a2a5e', pathBorder:'#000033', enemy:'#9b59b6', enemyOutline:'#4a235a', borderColor:'#9b59b6' }
};

const MAPS = [
    { skin:'forest', path:[{x:0,y:2},{x:6,y:2},{x:6,y:6},{x:2,y:6},{x:2,y:10},{x:10,y:10},{x:10,y:4},{x:16,y:4},{x:16,y:12},{x:19,y:12}] },
    { skin:'desert', path:[{x:0,y:1},{x:18,y:1},{x:18,y:13},{x:3,y:13},{x:3,y:4},{x:15,y:4},{x:15,y:10},{x:7,y:10},{x:7,y:7},{x:10,y:7}] },
    { skin:'ice', path:[{x:0,y:7},{x:5,y:7},{x:5,y:2},{x:10,y:2},{x:10,y:12},{x:15,y:12},{x:15,y:5},{x:19,y:5}] },
    { skin:'volcano', path:[{x:0,y:13},{x:4,y:13},{x:4,y:9},{x:8,y:9},{x:8,y:5},{x:12,y:5},{x:12,y:9},{x:16,y:9},{x:16,y:3},{x:19,y:3}] },
    { skin:'space', path:[{x:10,y:0},{x:10,y:4},{x:4,y:4},{x:4,y:8},{x:14,y:8},{x:14,y:12},{x:10,y:12},{x:10,y:14}] }
];

// ============================================================
// SKINS DE PERSONAGENS (balanceadas)
// ============================================================
const HERO_SKINS = {
    archer: [
        { name:'Floresta', cost:0, body:'#27ae60', body2:'#1e8449', skin:'#f5cba7', hat:'hood', hatColor:'#6b3a1f', weapon:'bow', weaponColor:'#8b4513', cape:'#2ecc71', eye:'#2c3e50', hair:'#6b3a1f', aura:null, projColor:'#f1c40f' },
        { name:'Sombra', cost:100, body:'#4a235a', body2:'#1a0a2e', skin:'#d5b8a0', hat:'hood', hatColor:'#1a0a2e', weapon:'bow', weaponColor:'#333', cape:'#6c3483', eye:'#e74c3c', hair:'#111', aura:'rgba(108,52,131,.3)', projColor:'#9b59b6' },
        { name:'Fogo', cost:200, body:'#e74c3c', body2:'#c0392b', skin:'#f5cba7', hat:'flame', hatColor:'#f39c12', weapon:'bow', weaponColor:'#e67e22', cape:'#ff6b00', eye:'#f1c40f', hair:'#ff4500', aura:'rgba(255,69,0,.3)', projColor:'#ff4500' },
        { name:'Gelo', cost:200, body:'#3498db', body2:'#2471a3', skin:'#e8daef', hat:'crown', hatColor:'#85c1e9', weapon:'bow', weaponColor:'#aed6f1', cape:'#d4e6f1', eye:'#1abc9c', hair:'#d6eaf8', aura:'rgba(52,152,219,.3)', projColor:'#00bcd4' }
    ],
    cannon: [
        { name:'Clássico', cost:0, body:'#8b6914', body2:'#6b4f10', skin:'#f5cba7', hat:'hardhat', hatColor:'#f1c40f', weapon:'bomb', weaponColor:'#333', cape:null, eye:'#2c3e50', hair:'#8b4513', aura:null, projColor:'#333' },
        { name:'Pirata', cost:150, body:'#c0392b', body2:'#922b21', skin:'#f0c27a', hat:'pirate', hatColor:'#1a1a1a', weapon:'cannon', weaponColor:'#555', cape:null, eye:'#000', hair:'#111', aura:null, projColor:'#555' },
        { name:'Robô', cost:250, body:'#7f8c8d', body2:'#566573', skin:'#bdc3c7', hat:'antenna', hatColor:'#e74c3c', weapon:'launcher', weaponColor:'#34495e', cape:null, eye:'#00ff00', hair:null, aura:'rgba(0,255,0,.2)', projColor:'#00ff00' },
        { name:'Ninja', cost:200, body:'#1a1a2e', body2:'#0a0a1e', skin:'#d5b8a0', hat:'mask', hatColor:'#1a1a2e', weapon:'shuriken', weaponColor:'#c0c0c0', cape:'#2c3e50', eye:'#e74c3c', hair:'#111', aura:'rgba(231,76,60,.2)', projColor:'#c0c0c0' }
    ],
    sniper: [
        { name:'Militar', cost:0, body:'#2d5016', body2:'#1a3a0a', skin:'#f5cba7', hat:'beret', hatColor:'#2d5016', weapon:'rifle', weaponColor:'#333', cape:null, eye:'#2c3e50', hair:'#4a3728', aura:null, projColor:'#fff' },
        { name:'Deserto', cost:150, body:'#c2956a', body2:'#a07850', skin:'#d4a574', hat:'goggles', hatColor:'#8b6914', weapon:'rifle', weaponColor:'#6b4f10', cape:'#c2956a', eye:'#2c3e50', hair:'#c2956a', aura:null, projColor:'#ffd700' },
        { name:'Cyber', cost:250, body:'#0a0a2e', body2:'#1a1a4e', skin:'#b0c4de', hat:'visor', hatColor:'#00d4ff', weapon:'laserrifle', weaponColor:'#00d4ff', cape:null, eye:'#00d4ff', hair:'#00d4ff', aura:'rgba(0,212,255,.3)', projColor:'#00d4ff' },
        { name:'Vampiro', cost:200, body:'#4a0000', body2:'#2a0000', skin:'#e8daef', hat:'tophat', hatColor:'#1a1a1a', weapon:'crossbow', weaponColor:'#555', cape:'#8b0000', eye:'#e74c3c', hair:'#111', aura:'rgba(139,0,0,.3)', projColor:'#e74c3c' }
    ],
    ice: [
        { name:'Mago', cost:0, body:'#2471a3', body2:'#1a5276', skin:'#f5cba7', hat:'wizard', hatColor:'#2471a3', weapon:'staff', weaponColor:'#85c1e9', cape:'#3498db', eye:'#2c3e50', hair:'#d6eaf8', aura:null, projColor:'#b3e5fc' },
        { name:'Yeti', cost:200, body:'#ecf0f1', body2:'#bdc3c7', skin:'#ecf0f1', hat:'horns', hatColor:'#bdc3c7', weapon:'crystal', weaponColor:'#85c1e9', cape:null, eye:'#3498db', hair:'#ecf0f1', aura:'rgba(133,193,233,.3)', projColor:'#85c1e9' },
        { name:'Cristal', cost:250, body:'#8e44ad', body2:'#6c3483', skin:'#e8daef', hat:'crown', hatColor:'#d2b4de', weapon:'gemstaff', weaponColor:'#e040fb', cape:'#9b59b6', eye:'#e040fb', hair:'#d2b4de', aura:'rgba(224,64,251,.3)', projColor:'#e040fb' },
        { name:'Sombrio', cost:200, body:'#1a1a2e', body2:'#0a0a1e', skin:'#b0b0b0', hat:'skull', hatColor:'#ecf0f1', weapon:'staff', weaponColor:'#5dade2', cape:'#2c3e50', eye:'#00bcd4', hair:'#555', aura:'rgba(0,188,212,.3)', projColor:'#00bcd4' }
    ],
    poison: [
        { name:'Alquimista', cost:0, body:'#1e8449', body2:'#145a32', skin:'#f5cba7', hat:'plague', hatColor:'#ecf0f1', weapon:'potion', weaponColor:'#76ff03', cape:'#27ae60', eye:'#2c3e50', hair:'#8b4513', aura:null, projColor:'#76ff03' },
        { name:'Bruxa', cost:150, body:'#4a235a', body2:'#1a0a2e', skin:'#d5b8a0', hat:'witch', hatColor:'#1a1a2e', weapon:'cauldron', weaponColor:'#333', cape:'#6c3483', eye:'#27ae60', hair:'#111', aura:'rgba(108,52,131,.3)', projColor:'#9b59b6' },
        { name:'Cientista', cost:200, body:'#ecf0f1', body2:'#bdc3c7', skin:'#f5cba7', hat:'goggles', hatColor:'#f1c40f', weapon:'syringe', weaponColor:'#76ff03', cape:null, eye:'#2c3e50', hair:'#f39c12', aura:null, projColor:'#76ff03' },
        { name:'Natureza', cost:200, body:'#6b4f10', body2:'#4a3708', skin:'#a0d468', hat:'leaves', hatColor:'#27ae60', weapon:'vinestaff', weaponColor:'#2ecc71', cape:'#27ae60', eye:'#f1c40f', hair:'#27ae60', aura:'rgba(46,204,113,.3)', projColor:'#2ecc71' }
    ],
    laser: [
        { name:'Tecno', cost:0, body:'#ecf0f1', body2:'#bdc3c7', skin:'#f5cba7', hat:'goggles', hatColor:'#e91e63', weapon:'lasergun', weaponColor:'#e91e63', cape:null, eye:'#e91e63', hair:'#333', aura:null, projColor:'#ff1744' },
        { name:'Cyberpunk', cost:200, body:'#1a1a2e', body2:'#0a0a1e', skin:'#d5b8a0', hat:'mohawk', hatColor:'#ff1744', weapon:'plasma', weaponColor:'#ff1744', cape:null, eye:'#ff1744', hair:'#ff1744', aura:'rgba(255,23,68,.3)', projColor:'#ff1744' },
        { name:'Steampunk', cost:250, body:'#8b6914', body2:'#6b4f10', skin:'#f5cba7', hat:'tophat', hatColor:'#5d4a2f', weapon:'raygun', weaponColor:'#c0a050', cape:'#8b6914', eye:'#f39c12', hair:'#8b4513', aura:'rgba(243,156,18,.2)', projColor:'#f39c12' },
        { name:'Alien', cost:200, body:'#27ae60', body2:'#1e8449', skin:'#76ff03', hat:'antenna', hatColor:'#76ff03', weapon:'beam', weaponColor:'#76ff03', cape:null, eye:'#000', hair:null, aura:'rgba(118,255,3,.3)', projColor:'#76ff03' }
    ],
    tesla: [
        { name:'Tempestade', cost:0, body:'#f1c40f', body2:'#d4ac0d', skin:'#f5cba7', hat:'storm', hatColor:'#f39c12', weapon:'lstaff', weaponColor:'#f1c40f', cape:'#f39c12', eye:'#2c3e50', hair:'#f1c40f', aura:null, projColor:'#ffff00' },
        { name:'Viking', cost:200, body:'#8b6914', body2:'#5d4a2f', skin:'#f0c27a', hat:'viking', hatColor:'#7f8c8d', weapon:'hammer', weaponColor:'#7f8c8d', cape:'#c0392b', eye:'#3498db', hair:'#f39c12', aura:'rgba(241,196,15,.3)', projColor:'#f1c40f' },
        { name:'Elétrico', cost:250, body:'#1a1a4e', body2:'#0a0a2e', skin:'#b0c4de', hat:'sparks', hatColor:'#ffff00', weapon:'coils', weaponColor:'#00d4ff', cape:null, eye:'#ffff00', hair:'#ffff00', aura:'rgba(255,255,0,.3)', projColor:'#ffff00' },
        { name:'Xamã', cost:200, body:'#6b4f10', body2:'#4a3708', skin:'#a0785a', hat:'feathers', hatColor:'#e74c3c', weapon:'totem', weaponColor:'#8b6914', cape:'#27ae60', eye:'#f1c40f', hair:'#111', aura:'rgba(231,76,60,.2)', projColor:'#e74c3c' }
    ],
    magic: [
        { name:'Arcano', cost:0, body:'#6c3483', body2:'#4a235a', skin:'#f5cba7', hat:'wizard', hatColor:'#6c3483', weapon:'mstaff', weaponColor:'#e040fb', cape:'#8e44ad', eye:'#2c3e50', hair:'#d2b4de', aura:null, projColor:'#e040fb' },
        { name:'Sombrio', cost:200, body:'#1a1a1a', body2:'#0a0a0a', skin:'#b0b0b0', hat:'skullcrown', hatColor:'#c0c0c0', weapon:'darkorb', weaponColor:'#9b59b6', cape:'#2c3e50', eye:'#e74c3c', hair:'#333', aura:'rgba(155,89,182,.4)', projColor:'#9b59b6' },
        { name:'Celestial', cost:300, body:'#f7dc6f', body2:'#d4ac0d', skin:'#fdebd0', hat:'halo', hatColor:'#f1c40f', weapon:'starstaff', weaponColor:'#f1c40f', cape:'#ecf0f1', eye:'#3498db', hair:'#f7dc6f', aura:'rgba(241,196,15,.4)', projColor:'#f1c40f' },
        { name:'Sangue', cost:250, body:'#8b0000', body2:'#4a0000', skin:'#e8daef', hat:'horns', hatColor:'#8b0000', weapon:'bloodorb', weaponColor:'#e74c3c', cape:'#c0392b', eye:'#e74c3c', hair:'#8b0000', aura:'rgba(231,76,60,.4)', projColor:'#e74c3c' }
    ]
};

// ============================================================
// TORRES E ARMADILHAS (BALANCEADAS)
// ============================================================
const TOWER_TYPES = {
    archer:  { cost:50,  damage:18, range:120, fireRate:28, projectileSpeed:9,  splash:0,  icon:'🏹', effect:null,     desc:'Rápido e barato' },
    cannon:  { cost:100, damage:45, range:110, fireRate:65, projectileSpeed:5,  splash:55, icon:'💣', effect:null,     desc:'Dano em área' },
    sniper:  { cost:150, damage:90, range:250, fireRate:85, projectileSpeed:16, splash:0,  icon:'🎯', effect:null,     desc:'Longo alcance' },
    ice:     { cost:120, damage:10, range:130, fireRate:38, projectileSpeed:7,  splash:0,  icon:'❄️', effect:'slow',   desc:'Desacelera' },
    poison:  { cost:130, damage:6,  range:140, fireRate:48, projectileSpeed:6,  splash:0,  icon:'☠️', effect:'poison', desc:'Dano contínuo' },
    laser:   { cost:200, damage:28, range:160, fireRate:5,  projectileSpeed:0,  splash:0,  icon:'⚡', effect:'laser',  desc:'Feixe contínuo' },
    tesla:   { cost:250, damage:35, range:140, fireRate:55, projectileSpeed:0,  splash:0,  icon:'🔌', effect:'chain',  desc:'Corrente elétrica' },
    magic:   { cost:300, damage:70, range:150, fireRate:75, projectileSpeed:10, splash:35, icon:'🔮', effect:'magic',  desc:'Ignora armadura' }
};

const TRAP_TYPES = {
    mine:     { cost:40, damage:120, radius:55, icon:'💣', desc:'Explode ao pisar' },
    spikes:   { cost:30, damage:18,  radius:38, icon:'🗡️', desc:'Dano contínuo' },
    slowfield:{ cost:60, damage:0,   radius:65, icon:'🕸️', desc:'Desacelera área' }
};

// ============================================================
// INIMIGOS (BALANCEADOS)
// ============================================================
const ENEMY_TYPES = {
    normal:  { hp:35,  speed:1.2, reward:6,  size:14, color:null, outline:null, armor:0 },
    fast:    { hp:22,  speed:2.3, reward:8,  size:11, color:'#f1c40f', outline:'#c29d0b', armor:0 },
    tank:    { hp:120, speed:0.65, reward:18, size:18, color:'#34495e', outline:'#1a252f', armor:6 },
    flying:  { hp:28,  speed:1.5, reward:12, size:12, color:'#3498db', outline:'#1f6391', armor:0, flying:true },
    healer:  { hp:45,  speed:0.95, reward:14, size:14, color:'#2ecc71', outline:'#1e8449', armor:0, healer:true },
    armored: { hp:70,  speed:0.95, reward:14, size:15, color:'#7f8c8d', outline:'#34495e', armor:12 }
};

// ============================================================
// PERFIL E SAVE (localStorage)
// ============================================================
const PROFILE_KEY = 'td_profile';
const GAME_KEY = 'td_game_save';

let profile = {
    username: '',
    coins: 0,
    totalGames: 0,
    totalWins: 0,
    bestWave: 0,
    unlockedSkins: {}
};

function loadProfile() {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
        try { profile = JSON.parse(raw); return true; } catch(e) {}
    }
    return false;
}

function saveProfile() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function addCoins(amount) {
    profile.coins += amount;
    saveProfile();
    document.getElementById('coins').textContent = profile.coins;
}

// ============================================================
// ESTADO DO JOGO
// ============================================================
let difficulty = 'normal';
let diff = DIFFICULTIES.normal;
let gold = 200, lives = 20, wave = 0, waveInLevel = 0, currentMapIndex = 0;
let enemies = [], towers = [], traps = [], projectiles = [], particles = [], floatingTexts = [], lasers = [], lightnings = [];
let selectedTowerType = null, selectedTrapType = null, selectedTower = null, selectedSkinIndex = 0;
let waveInProgress = false, enemiesToSpawn = 0, spawnTimer = 0;
let mouseX = 0, mouseY = 0, hoverCell = null;
let pathSet = new Set(), waypoints = [];
let bossActive = null, bossWarning = false;
let gameSpeed = 1, autoWave = false, autoWaveTimer = 0, infiniteMode = false, globalFreeze = 0;
let comboCount = 0, comboTimer = 0;
const COMBO_WINDOW = 60;
let screenShake = 0;
let stats = { totalKills:0, totalDamage:0, totalGoldEarned:0, towersBuilt:0, towersSold:0, bossesKilled:0, maxCombo:0, damageTaken:0, wavesCompleted:0, startTime:Date.now() };
let playerXP = 0, playerLevel = 1, xpToNext = 100;
let talents = { damageBonus:0, rangeBonus:0, goldBonus:0, cooldownReduction:0, interestRate:0, comboBonus:0 };
let skillCooldowns = { meteor:0, heal:0, freeze:0, gold:0 };
const SKILL_CD_MAX = { meteor:900, heal:1200, freeze:1000, gold:1500 };
const SKILL_COST = { meteor:50, heal:80, freeze:60, gold:100 };
const TOWER_LIMITS = { archer:6, cannon:5, sniper:4, ice:4, poison:4, laser:3, tesla:3, magic:2 };
const TRAP_LIMITS = { mine:8, spikes:6, slowfield:4 };
const MAX_TOWERS = 20, MAX_TRAPS = 12, MAX_LEVEL = 5;

// ============================================================
// TELA DE BEM-VINDO
// ============================================================
function initWelcome() {
    const hasProfile = loadProfile();
    if (hasProfile && profile.username) {
        document.getElementById('savedProfile').classList.remove('hidden');
        document.getElementById('savedName').textContent = profile.username;
        document.getElementById('continueBtn').addEventListener('click', () => {
            document.getElementById('welcomeScreen').classList.add('hidden');
            document.getElementById('gameWrapper').classList.remove('hidden');
            document.getElementById('displayName').textContent = profile.username;
            document.getElementById('coins').textContent = profile.coins;
            startGame(profile.lastDifficulty || 'normal');
        });
    }

    document.getElementById('usernameInput').addEventListener('input', (e) => {
        document.getElementById('startBtn').disabled = e.target.value.trim().length < 2;
    });

    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            difficulty = btn.dataset.diff;
        });
    });

    document.getElementById('startBtn').addEventListener('click', () => {
        const name = document.getElementById('usernameInput').value.trim();
        if (name.length < 2) return;
        profile.username = name;
        profile.lastDifficulty = difficulty;
        profile.totalGames++;
        saveProfile();
        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('gameWrapper').classList.remove('hidden');
        document.getElementById('displayName').textContent = name;
        document.getElementById('coins').textContent = profile.coins;
        startGame(difficulty);
    });
}

function startGame(diffKey) {
    difficulty = diffKey;
    diff = DIFFICULTIES[diffKey];
    gold = Math.floor(diff.startGold * diff.goldMultiplier);
    lives = diff.lives;
    wave = 0; waveInLevel = 0; currentMapIndex = 0;
    enemies = []; towers = []; traps = []; projectiles = []; particles = []; floatingTexts = []; lasers = []; lightnings = [];
    waveInProgress = false; enemiesToSpawn = 0; spawnTimer = 0;
    bossActive = null; bossWarning = false; infiniteMode = false; globalFreeze = 0;
    comboCount = 0; comboTimer = 0; screenShake = 0;
    stats = { totalKills:0, totalDamage:0, totalGoldEarned:0, towersBuilt:0, towersSold:0, bossesKilled:0, maxCombo:0, damageTaken:0, wavesCompleted:0, startTime:Date.now() };
    playerXP = 0; playerLevel = 1; xpToNext = 100;
    talents = { damageBonus:0, rangeBonus:0, goldBonus:0, cooldownReduction:0, interestRate:0, comboBonus:0 };
    skillCooldowns = { meteor:0, heal:0, freeze:0, gold:0 };

    document.getElementById('diffBadge').textContent = `${diff.icon} ${diff.name}`;
    document.getElementById('diffBadge').style.borderColor = diff.color;
    document.getElementById('diffBadge').style.color = diff.color;

    loadMap(0);
    updateUI();
    showMessage(`🎮 ${diff.name} selecionado! Boa sorte!`);
    gameLoop();
}

// ============================================================
// LOAD/SAVE MAP
// ============================================================
function loadMap(index) {
    const map = MAPS[index], skin = MAP_SKINS[map.skin];
    canvas.style.borderColor = skin.borderColor;
    document.getElementById('levelBadge').textContent = `🗺️ ${infiniteMode ? 'MODO INFINITO' : `Nível ${index + 1} - ${skin.name}`}`;
    waypoints = map.path.map(c => ({ x: c.x * TILE + TILE/2, y: c.y * TILE + TILE/2 }));
    pathSet.clear();
    for (let i = 0; i < map.path.length - 1; i++) {
        const a = map.path[i], b = map.path[i+1];
        const dx = Math.sign(b.x - a.x), dy = Math.sign(b.y - a.y);
        let cx = a.x, cy = a.y;
        while (cx !== b.x || cy !== b.y) { pathSet.add(`${cx},${cy}`); cx += dx; cy += dy; }
        pathSet.add(`${b.x},${b.y}`);
    }
    towers = towers.filter(t => !pathSet.has(`${t.cx},${t.cy}`));
    traps = traps.filter(t => !pathSet.has(`${t.cx},${t.cy}`));
}

// ============================================================
// HELPERS
// ============================================================
function getUpgradeCost(l) { return [0, 80, 160, 320, 640][l] || 0; }
function getSellValue(t) { let v = TOWER_TYPES[t.type].cost; for (let i = 1; i < t.level; i++) v += getUpgradeCost(i); return Math.floor(v * 0.6); }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function createParticles(x, y, color, count = 8, spread = 4) { for (let i = 0; i < count; i++) particles.push({ x, y, vx: (Math.random()-.5)*spread, vy: (Math.random()-.5)*spread, life: 20+Math.random()*10, color, size: 2+Math.random()*2 }); }
function createFloatingText(x, y, text, color, size = 16) { floatingTexts.push({ x, y, text, color, life: 60, size }); }
function showMessage(t) { document.getElementById('message').textContent = t; }

// ============================================================
// UI
// ============================================================
function updateUI() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('lives').textContent = lives;
    document.getElementById('wave').textContent = `${waveInLevel} / ${infiniteMode ? '∞' : '15'}`;
    document.getElementById('towerCount').textContent = towers.length;
    document.getElementById('playerLevel').textContent = playerLevel;
    document.getElementById('xp').textContent = playerXP;
    document.getElementById('xpMax').textContent = xpToNext;

    for (const type of Object.keys(TOWER_LIMITS)) {
        const b = document.querySelector(`.tower-btn[data-type="${type}"]`);
        if (!b) continue;
        const c = towers.filter(t => t.type === type).length;
        b.querySelector('.count').textContent = `${c}/${TOWER_LIMITS[type]}`;
        b.disabled = c >= TOWER_LIMITS[type] || towers.length >= MAX_TOWERS;
    }
    for (const type of Object.keys(TRAP_LIMITS)) {
        const b = document.querySelector(`.trap-btn[data-type="${type}"]`);
        if (!b) continue;
        const c = traps.filter(t => t.type === type).length;
        b.querySelector('.count').textContent = `${c}/${TRAP_LIMITS[type]}`;
        b.disabled = c >= TRAP_LIMITS[type] || traps.length >= MAX_TRAPS;
    }
    for (const sk of Object.keys(skillCooldowns)) {
        const b = document.querySelector(`.skill-btn[data-skill="${sk}"]`);
        if (!b) continue;
        if (skillCooldowns[sk] > 0) { b.classList.add('cooldown'); b.dataset.cd = Math.ceil(skillCooldowns[sk]/60); }
        else { b.classList.remove('cooldown'); b.dataset.cd = ''; }
    }
    const ce = document.getElementById('comboDisplay');
    if (comboCount > 1) { ce.classList.remove('hidden'); document.getElementById('comboCount').textContent = comboCount; }
    else ce.classList.add('hidden');
}

function createTowerButtons() {
    const c = document.getElementById('towerButtons'); c.innerHTML = '';
    for (const [type, data] of Object.entries(TOWER_TYPES)) {
        const b = document.createElement('button');
        b.className = 'tower-btn'; b.dataset.type = type;
        b.innerHTML = `${data.icon} ${type.charAt(0).toUpperCase()+type.slice(1)} <span class="count">0/${TOWER_LIMITS[type]}</span><br><small>${data.cost}g | ${data.desc}</small>`;
        b.addEventListener('click', () => selectTowerType(type));
        c.appendChild(b);
    }
}

function createTrapButtons() {
    const c = document.getElementById('trapButtons'); c.innerHTML = '';
    for (const [type, data] of Object.entries(TRAP_TYPES)) {
        const b = document.createElement('button');
        b.className = 'trap-btn'; b.dataset.type = type;
        b.innerHTML = `${data.icon} ${type} <span class="count">0/${TRAP_LIMITS[type]}</span><br><small>${data.cost}g | ${data.desc}</small>`;
        b.addEventListener('click', () => {
            selectedTowerType = null; selectedTower = null;
            document.getElementById('towerInfo').classList.add('hidden');
            document.getElementById('skinSelector').classList.add('hidden');
            document.querySelectorAll('.tower-btn,.trap-btn').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected'); selectedTrapType = type;
            showMessage(`Coloque ${type}`);
        });
        c.appendChild(b);
    }
}

function selectTowerType(type) {
    selectedTrapType = null; selectedTower = null;
    document.getElementById('towerInfo').classList.add('hidden');
    document.querySelectorAll('.tower-btn,.trap-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.querySelector(`.tower-btn[data-type="${type}"]`);
    if (btn.disabled) return;
    btn.classList.add('selected'); selectedTowerType = type; selectedSkinIndex = 0;
    showSkinSelector(type);
    showMessage(`Escolha a skin e clique no mapa`);
}

function showSkinSelector(type) {
    const sel = document.getElementById('skinSelector');
    sel.classList.remove('hidden');
    const opts = document.getElementById('skinOptions');
    opts.innerHTML = '';
    HERO_SKINS[type].forEach((sk, i) => {
        const card = document.createElement('div');
        card.className = 'skin-card' + (i === selectedSkinIndex ? ' selected' : '');
        const cvs = document.createElement('canvas');
        cvs.width = 50; cvs.height = 50;
        card.appendChild(cvs);
        const name = document.createElement('div');
        name.className = 'skin-name'; name.textContent = sk.name;
        card.appendChild(name);
        if (!profile.unlockedSkins[`${type}_${i}`] && sk.cost > 0) {
            const cost = document.createElement('div');
            cost.className = 'skin-cost'; cost.textContent = `🔒 ${sk.cost}g`;
            card.appendChild(cost);
        }
        card.addEventListener('click', () => {
            const key = `${type}_${i}`;
            if (!profile.unlockedSkins[key] && sk.cost > 0) {
                if (gold >= sk.cost) {
                    gold -= sk.cost;
                    profile.unlockedSkins[key] = true;
                    saveProfile(); updateUI();
                    showMessage(`✅ Skin ${sk.name} desbloqueada!`);
                } else { showMessage('❌ Ouro insuficiente!'); return; }
            }
            selectedSkinIndex = i;
            document.querySelectorAll('.skin-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
        opts.appendChild(card);
        drawHeroPreview(cvs, type, i);
    });
}

function updateTowerInfo() {
    if (!selectedTower) { document.getElementById('towerInfo').classList.add('hidden'); return; }
    document.getElementById('towerInfo').classList.remove('hidden');
    const t = selectedTower, type = TOWER_TYPES[t.type], sk = HERO_SKINS[t.type][t.skinIdx], sv = getSellValue(t);
    let ef = '';
    if (t.effect === 'slow') ef = '<div class="stat-line"><span>🐌</span><span>Lentidão</span></div>';
    if (t.effect === 'poison') ef = '<div class="stat-line"><span>☠️</span><span>Veneno</span></div>';
    if (t.effect === 'laser') ef = '<div class="stat-line"><span>⚡</span><span>Feixe</span></div>';
    if (t.effect === 'chain') ef = '<div class="stat-line"><span>🔌</span><span>Corrente</span></div>';
    if (t.effect === 'magic') ef = '<div class="stat-line"><span>🔮</span><span>Ignora armadura</span></div>';
    let html = `<div class="stat-line"><span>${sk.name}</span><span>Nv ${t.level}/${MAX_LEVEL}</span></div>
        <div class="stat-line"><span>⚔️ Dano:</span><span>${t.damage}</span></div>
        <div class="stat-line"><span>📏 Alcance:</span><span>${t.range}</span></div>
        <div class="stat-line"><span>⏱️ Cadência:</span><span>${t.fireRate}</span></div>${ef}`;
    if (t.level < MAX_LEVEL) {
        const c = getUpgradeCost(t.level);
        html += `<div style="color:#2ecc71;font-size:9px;margin-top:3px;border-top:1px dashed #555;padding-top:3px">⬆️ ${c}g</div>`;
        document.getElementById('upgradeBtn').textContent = `⬆️ (${c}g)`;
        document.getElementById('upgradeBtn').disabled = false;
    } else {
        html += `<div style="color:#ffd700;font-size:9px;margin-top:3px">✨ MÁXIMO</div>`;
        document.getElementById('upgradeBtn').textContent = '✨ Max';
        document.getElementById('upgradeBtn').disabled = true;
    }
    document.getElementById('towerStats').innerHTML = html;
    document.getElementById('sellBtn').textContent = `💸 Vender (${sv}g)`;
    document.getElementById('targetMode').value = t.targetMode;
}

// ============================================================
// EVENTS
// ============================================================
document.getElementById('cancelBtn').addEventListener('click', () => {
    selectedTowerType = null; selectedTrapType = null; selectedTower = null;
    document.querySelectorAll('.tower-btn,.trap-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('towerInfo').classList.add('hidden');
    document.getElementById('skinSelector').classList.add('hidden');
    showMessage('Cancelado');
});
document.getElementById('nextWaveBtn').addEventListener('click', startWave);
document.getElementById('resetBtn').addEventListener('click', () => { if (confirm('⚠️ Reiniciar jogo?')) location.reload(); });
document.getElementById('statsBtn').addEventListener('click', () => {
    const m = document.getElementById('statsModal'), c = document.getElementById('statsContent');
    const e = Math.floor((Date.now() - stats.startTime) / 1000);
    c.innerHTML = `<div>⚔️ Kills: <b>${stats.totalKills}</b></div><div>💥 Dano: <b>${Math.floor(stats.totalDamage)}</b></div><div>💰 Ouro: <b>${stats.totalGoldEarned}</b></div><div>🏗️ Torres: <b>${stats.towersBuilt}</b></div><div>👹 Bosses: <b>${stats.bossesKilled}</b></div><div>🔥 Max combo: <b>x${stats.maxCombo}</b></div><div>🌊 Waves: <b>${stats.wavesCompleted}</b></div><div>⏱️ Tempo: <b>${Math.floor(e/60)}m ${e%60}s</b></div>`;
    m.classList.remove('hidden');
});
document.getElementById('closeStats').addEventListener('click', () => document.getElementById('statsModal').classList.add('hidden'));
document.querySelectorAll('.speed-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.speed-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); gameSpeed = parseInt(b.dataset.speed);
}));
document.getElementById('autoWaveBtn').addEventListener('click', e => { autoWave = !autoWave; e.target.classList.toggle('active', autoWave); });
document.querySelectorAll('.skill-btn').forEach(b => b.addEventListener('click', () => useSkill(b.dataset.skill)));
document.getElementById('upgradeBtn').addEventListener('click', () => {
    if (!selectedTower || selectedTower.level >= MAX_LEVEL) return;
    const c = getUpgradeCost(selectedTower.level);
    if (gold < c) { showMessage('❌ Ouro!'); return; }
    gold -= c; selectedTower.level++;
    selectedTower.damage = Math.floor(selectedTower.damage * 1.4);
    selectedTower.range = Math.floor(selectedTower.range * 1.1);
    selectedTower.fireRate = Math.max(5, Math.floor(selectedTower.fireRate * 0.88));
    updateUI(); updateTowerInfo();
    createFloatingText(selectedTower.x, selectedTower.y, `⬆️ Nv ${selectedTower.level}!`, '#ffd700');
});
document.getElementById('sellBtn').addEventListener('click', () => {
    if (!selectedTower) return;
    const v = getSellValue(selectedTower);
    gold += v; towers = towers.filter(t => t !== selectedTower); stats.towersSold++;
    selectedTower = null; document.getElementById('towerInfo').classList.add('hidden');
    updateUI(); showMessage(`💸 ${v}g!`);
});
document.getElementById('targetMode').addEventListener('change', e => { if (selectedTower) selectedTower.targetMode = e.target.value; });
canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
    hoverCell = { x: Math.floor(mouseX / TILE), y: Math.floor(mouseY / TILE) };
});
canvas.addEventListener('click', () => {
    if (!hoverCell) return;
    const { x, y } = hoverCell;
    const ct = towers.find(t => t.cx === x && t.cy === y);
    if (ct) {
        selectedTower = ct; selectedTowerType = null; selectedTrapType = null;
        document.querySelectorAll('.tower-btn,.trap-btn').forEach(b => b.classList.remove('selected'));
        document.getElementById('skinSelector').classList.add('hidden');
        updateTowerInfo(); return;
    }
    if (selectedTowerType) {
        const key = `${x},${y}`, type = TOWER_TYPES[selectedTowerType];
        if (pathSet.has(key)) { showMessage('❌ Caminho!'); return; }
        if (towers.some(t => t.cx === x && t.cy === y) || traps.some(t => t.cx === x && t.cy === y)) { showMessage('❌ Ocupado!'); return; }
        if (towers.length >= MAX_TOWERS) { showMessage('❌ Limite!'); return; }
        if (towers.filter(t => t.type === selectedTowerType).length >= TOWER_LIMITS[selectedTowerType]) { showMessage('❌ Limite tipo!'); return; }
        if (gold < type.cost) { showMessage('❌ Ouro!'); return; }
        gold -= type.cost;
        const sk = HERO_SKINS[selectedTowerType][selectedSkinIndex];
        const dm = 1 + talents.damageBonus * 0.05, rm = 1 + talents.rangeBonus * 0.03, rtm = 1 - talents.cooldownReduction * 0.03;
        towers.push({
            cx: x, cy: y, x: x*TILE+TILE/2, y: y*TILE+TILE/2,
            type: selectedTowerType, level: 1,
            damage: Math.floor(type.damage * dm), range: Math.floor(type.range * rm),
            fireRate: Math.max(5, Math.floor(type.fireRate * rtm)),
            projectileSpeed: type.projectileSpeed, splash: type.splash, effect: type.effect,
            cooldown: 0, angle: 0, targetMode: 'first', skinIdx: selectedSkinIndex,
            projColor: sk.projColor, attackAnim: 0
        });
        stats.towersBuilt++; updateUI();
        showMessage(`✅ ${sk.name} posicionado!`);
        return;
    }
    if (selectedTrapType) {
        const key = `${x},${y}`, type = TRAP_TYPES[selectedTrapType];
        if (pathSet.has(key) || towers.some(t => t.cx === x && t.cy === y) || traps.some(t => t.cx === x && t.cy === y)) { showMessage('❌ Ocupado!'); return; }
        if (traps.length >= MAX_TRAPS || traps.filter(t => t.type === selectedTrapType).length >= TRAP_LIMITS[selectedTrapType]) { showMessage('❌ Limite!'); return; }
        if (gold < type.cost) { showMessage('❌ Ouro!'); return; }
        gold -= type.cost;
        traps.push({ cx: x, cy: y, x: x*TILE+TILE/2, y: y*TILE+TILE/2, type: selectedTrapType, ...type });
        updateUI(); showMessage('✅ Armadilha!');
    }
});

function useSkill(skill) {
    if (skillCooldowns[skill] > 0) { showMessage(`⏳ ${Math.ceil(skillCooldowns[skill]/60)}s`); return; }
    if (gold < SKILL_COST[skill]) { showMessage('❌ Ouro!'); return; }
    gold -= SKILL_COST[skill]; skillCooldowns[skill] = SKILL_CD_MAX[skill];
    if (skill === 'meteor') {
        const cx = canvas.width/2, cy = canvas.height/2;
        for (const e of enemies) if (dist({x:cx,y:cy}, e) < 150) { e.hp -= 200; stats.totalDamage += 200; }
        createParticles(cx, cy, '#ff4500', 50, 8);
        createFloatingText(cx, cy, '☄️ METEOR!', '#ff4500', 24);
        screenShake = 15;
    } else if (skill === 'heal') {
        lives += 5; createFloatingText(canvas.width/2, canvas.height/2, '+5 ❤️', '#2ecc71', 24);
    } else if (skill === 'freeze') {
        globalFreeze = 300; createFloatingText(canvas.width/2, canvas.height/2, '❄️ FREEZE!', '#00bcd4', 24);
    } else if (skill === 'gold') {
        const b = Math.floor((100 + playerLevel * 20) * diff.goldMultiplier);
        gold += b; createFloatingText(canvas.width/2, canvas.height/2, `+${b}💰`, '#ffd700', 24);
    }
    updateUI();
}

// ============================================================
// WAVES E INIMIGOS (BALANCEADOS)
// ============================================================
function startWave() {
    if (waveInProgress) return;
    if (!infiniteMode && waveInLevel >= 15) return;
    wave++; waveInLevel++; waveInProgress = true;
    const isBossWave = !infiniteMode && waveInLevel === 15;
    if (isBossWave) {
        enemiesToSpawn = 8; bossWarning = true;
        document.getElementById('bossAlert').classList.remove('hidden');
        showMessage('👹 BOSS CHEGANDO!');
    } else {
        enemiesToSpawn = Math.floor((5 + waveInLevel * 2) * (1 + currentMapIndex * 0.2));
        showMessage(`🌊 Wave ${waveInLevel}${infiniteMode ? '' : '/15'}`);
    }
    spawnTimer = 0; updateUI();
}

function spawnEnemy() {
    let type = 'normal';
    const r = Math.random();
    if (wave > 3 && r < 0.15) type = 'fast';
    else if (wave > 5 && r < 0.25) type = 'tank';
    else if (wave > 7 && r < 0.35) type = 'flying';
    else if (wave > 10 && r < 0.42) type = 'healer';
    else if (wave > 8 && r < 0.50) type = 'armored';
    const b = ENEMY_TYPES[type];
    const hpMult = diff.enemyHpMult * (1 + currentMapIndex * 0.3 + (infiniteMode ? wave * 0.08 : 0));
    const hp = Math.floor(b.hp * hpMult);
    const reward = Math.floor(b.reward * diff.rewardMult * (1 + wave * 0.1));
    enemies.push({
        x: waypoints[0].x, y: waypoints[0].y,
        hp, maxHp: hp,
        speed: b.speed * diff.enemySpeedMult, baseSpeed: b.speed * diff.enemySpeedMult,
        waypointIndex: 1, reward, size: b.size, type,
        armor: b.armor, flying: b.flying || false, healer: b.healer || false,
        color: b.color || MAP_SKINS[MAPS[currentMapIndex].skin].enemy,
        outline: b.outline || MAP_SKINS[MAPS[currentMapIndex].skin].enemyOutline,
        isBoss: false, effects: { slow: 0, poison: 0, poisonDmg: 0, frozen: 0 }, healCooldown: 0
    });
}

function spawnBoss() {
    const hpMult = diff.bossHpMult * (1 + currentMapIndex * 0.5 + (infiniteMode ? wave * 0.1 : 0));
    const hp = Math.floor(1200 * hpMult);
    const bossTypes = ['summoner', 'healer', 'berserker'];
    const bt = bossTypes[currentMapIndex % 3];
    const reward = Math.floor(250 * diff.rewardMult * (1 + currentMapIndex * 0.3));
    enemies.push({
        x: waypoints[0].x, y: waypoints[0].y,
        hp, maxHp: hp, speed: 0.7 * diff.enemySpeedMult, baseSpeed: 0.7 * diff.enemySpeedMult,
        waypointIndex: 1, reward, size: 30, type: 'boss', armor: 15,
        flying: false, healer: false, color: '#8b0000', outline: '#ff4444',
        isBoss: true, bossType: bt, abilityCooldown: 200, healCooldown: 0,
        effects: { slow: 0, poison: 0, poisonDmg: 0, frozen: 0 }
    });
    bossActive = enemies[enemies.length - 1];
    bossWarning = false;
    createFloatingText(canvas.width/2, 50, `👹 BOSS ${bt.toUpperCase()}!`, '#ff0000', 24);
    screenShake = 10;
}

function addXP(a) {
    playerXP += a;
    while (playerXP >= xpToNext) {
        playerXP -= xpToNext; playerLevel++; xpToNext = Math.floor(xpToNext * 1.5);
        showLevelUpModal();
    }
    updateUI();
}

function showLevelUpModal() {
    const m = document.getElementById('levelUpModal');
    document.getElementById('levelUpText').textContent = `Nível ${playerLevel}! Escolha um talento:`;
    const all = [
        { key:'damageBonus', icon:'⚔️', name:'Força', desc:'+5% dano' },
        { key:'rangeBonus', icon:'📏', name:'Alcance', desc:'+3% alcance' },
        { key:'goldBonus', icon:'💰', name:'Fortuna', desc:'+5% ouro' },
        { key:'cooldownReduction', icon:'⏱️', name:'Rapidez', desc:'-3% cadência' },
        { key:'interestRate', icon:'🏦', name:'Juros', desc:'+1% juros' },
        { key:'comboBonus', icon:'🔥', name:'Combo', desc:'+10% combo' }
    ];
    const ch = []; const p = [...all];
    for (let i = 0; i < 3 && p.length; i++) { const idx = Math.floor(Math.random()*p.length); ch.push(p.splice(idx,1)[0]); }
    const c = document.getElementById('talentChoices'); c.innerHTML = '';
    for (const t of ch) {
        const d = document.createElement('div');
        d.className = 'talent-choice';
        d.innerHTML = `<div class="icon">${t.icon}</div><div class="name">${t.name}</div><div class="desc">${t.desc} (Nv ${talents[t.key]})</div>`;
        d.addEventListener('click', () => { talents[t.key]++; m.classList.add('hidden'); });
        c.appendChild(d);
    }
    m.classList.remove('hidden');
}

// ============================================================
// GAME OVER / VICTORY
// ============================================================
function showGameOver() {
    const reward = Math.floor(stats.totalKills * 2 * diff.rewardMult);
    addCoins(reward);
    profile.totalGames++;
    if (stats.wavesCompleted > profile.bestWave) profile.bestWave = stats.wavesCompleted;
    saveProfile();
    document.getElementById('goReward').textContent = reward;
    document.getElementById('gameOverStats').innerHTML = `
        <div>🌊 Waves: <b>${stats.wavesCompleted}</b></div>
        <div>⚔️ Kills: <b>${stats.totalKills}</b></div>
        <div>👹 Bosses: <b>${stats.bossesKilled}</b></div>
        <div>🔥 Max combo: <b>x${stats.maxCombo}</b></div>
    `;
    document.getElementById('gameOverModal').classList.remove('hidden');
}

function showVictory() {
    const reward = Math.floor(500 * diff.rewardMult);
    addCoins(reward);
    profile.totalWins++;
    profile.bestWave = 75;
    saveProfile();
    document.getElementById('vicReward').textContent = reward;
    document.getElementById('victoryStats').innerHTML = `
        <div>🏆 Todos os 5 mapas completos!</div>
        <div>⚔️ Kills: <b>${stats.totalKills}</b></div>
        <div>👹 Bosses: <b>${stats.bossesKilled}</b></div>
    `;
    document.getElementById('victoryModal').classList.remove('hidden');
}

document.getElementById('restartBtn').addEventListener('click', () => location.reload());
document.getElementById('continuePlayBtn').addEventListener('click', () => {
    document.getElementById('victoryModal').classList.add('hidden');
    infiniteMode = true; waveInLevel = 0;
    showMessage('🎊 MODO INFINITO ATIVADO!');
});
document.getElementById('vicRestartBtn').addEventListener('click', () => location.reload());

// ============================================================
// UPDATE
// ============================================================
function update() {
    for (let s = 0; s < gameSpeed; s++) {
        if (gameSpeed === 0) break;
        updateOnce();
    }
}

function updateOnce() {
    if (lives <= 0) { showGameOver(); return; }
    if (autoWave && !waveInProgress && lives > 0) { autoWaveTimer++; if (autoWaveTimer >= 180) { startWave(); autoWaveTimer = 0; } }
    for (const sk of Object.keys(skillCooldowns)) if (skillCooldowns[sk] > 0) skillCooldowns[sk]--;
    if (comboCount > 0) { comboTimer--; if (comboTimer <= 0) comboCount = 0; }
    if (globalFreeze > 0) globalFreeze--;
    if (screenShake > 0) screenShake--;
    if (waveInProgress && enemiesToSpawn > 0) { spawnTimer++; if (spawnTimer >= 40) { spawnEnemy(); enemiesToSpawn--; spawnTimer = 0; } }
    if (waveInProgress && enemiesToSpawn === 0 && bossWarning && !bossActive) spawnBoss();
    if (waveInProgress && enemiesToSpawn === 0 && enemies.length === 0 && !bossWarning) {
        waveInProgress = false; stats.wavesCompleted++;
        const interest = Math.floor(gold * (diff.interestRate + talents.interestRate * 0.01));
        if (interest > 0) { gold += interest; createFloatingText(canvas.width/2, 100, `🏦+${interest}g`, '#ffd700'); }
        const bonus = Math.floor((20 + waveInLevel * 5) * diff.goldMultiplier);
        gold += bonus; stats.totalGoldEarned += bonus + interest;
        createFloatingText(canvas.width/2, canvas.height/2, `+${bonus}g`, '#ffd700');
        if (!infiniteMode && waveInLevel >= 15) {
            if (currentMapIndex >= MAPS.length - 1) { showVictory(); return; }
            else { currentMapIndex++; waveInLevel = 0; gold += Math.floor(200 * diff.goldMultiplier); loadMap(currentMapIndex); showMessage('🎉 NÍVEL COMPLETO!'); }
        }
        updateUI();
    }
    // Inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (e.effects.frozen > 0 || globalFreeze > 0) { e.effects.frozen = Math.max(0, e.effects.frozen - 1); }
        else {
            if (e.effects.slow > 0) { e.speed = e.baseSpeed * 0.5; e.effects.slow--; } else e.speed = e.baseSpeed;
            if (e.effects.poison > 0) { e.hp -= e.effects.poisonDmg; stats.totalDamage += e.effects.poisonDmg; e.effects.poison--; }
            if (e.healer) { e.healCooldown--; if (e.healCooldown <= 0) { for (const o of enemies) if (o !== e && dist(e, o) < 80 && o.hp < o.maxHp) { o.hp = Math.min(o.maxHp, o.hp + 6); createParticles(o.x, o.y, '#2ecc71', 3, 2); } e.healCooldown = 60; } }
            if (e.isBoss) { e.abilityCooldown--; if (e.abilityCooldown <= 0) { if (e.bossType === 'summoner') { for (let j = 0; j < 3; j++) enemies.push({ x: e.x + (Math.random()-.5)*30, y: e.y + (Math.random()-.5)*30, hp: 35, maxHp: 35, speed: 1.5, baseSpeed: 1.5, waypointIndex: e.waypointIndex, reward: 4, size: 10, type: 'minion', armor: 0, color: '#ff4444', outline: '#8b0000', isBoss: false, flying: false, healer: false, effects: { slow: 0, poison: 0, poisonDmg: 0, frozen: 0 } }); createParticles(e.x, e.y, '#ff4444', 20, 5); } else if (e.bossType === 'healer') { e.hp = Math.min(e.maxHp, e.hp + 150); createParticles(e.x, e.y, '#2ecc71', 20, 5); } else { e.speed = e.baseSpeed * 2; setTimeout(() => { if (enemies.includes(e)) e.speed = e.baseSpeed; }, 3000); createParticles(e.x, e.y, '#ff0000', 20, 5); } e.abilityCooldown = 300; } }
            const target = waypoints[e.waypointIndex], dx = target.x - e.x, dy = target.y - e.y, d = Math.hypot(dx, dy);
            if (d < e.speed) { e.x = target.x; e.y = target.y; e.waypointIndex++; if (e.waypointIndex >= waypoints.length) { enemies.splice(i, 1); const dmg = e.isBoss ? 5 : 1; lives -= dmg; stats.damageTaken += dmg; if (e.isBoss) bossActive = null; updateUI(); if (lives <= 0) return; continue; } }
            else { e.x += (dx/d)*e.speed; e.y += (dy/d)*e.speed; }
        }
        if (e.hp <= 0) {
            const reward = Math.floor(e.reward * (1 + talents.goldBonus * 0.05) * (1 + comboCount * 0.1 * (1 + talents.comboBonus * 0.1)));
            gold += reward; stats.totalGoldEarned += reward; stats.totalKills++;
            comboCount++; comboTimer = COMBO_WINDOW; if (comboCount > stats.maxCombo) stats.maxCombo = comboCount;
            addXP(e.isBoss ? 60 : 5);
            createParticles(e.x, e.y, e.color, e.isBoss ? 40 : 10, e.isBoss ? 6 : 4);
            createFloatingText(e.x, e.y, `+${reward}g`, '#ffd700');
            if (comboCount > 2) createFloatingText(e.x, e.y - 20, `x${comboCount}!`, '#ff6b00', 14);
            if (e.isBoss) { bossActive = null; stats.bossesKilled++; createFloatingText(canvas.width/2, canvas.height/2-30, '👑 BOSS!', '#ffd700', 28); gold += Math.floor(100 * diff.goldMultiplier); screenShake = 12; }
            enemies.splice(i, 1); updateUI();
        }
    }
    // Armadilhas
    for (let i = traps.length - 1; i >= 0; i--) {
        const tr = traps[i];
        if (tr.type === 'mine') { for (const e of enemies) if (dist(tr, e) < tr.radius) { for (const o of enemies) if (dist(tr, o) < tr.radius) { o.hp -= tr.damage; stats.totalDamage += tr.damage; } createParticles(tr.x, tr.y, '#ff4500', 30, 6); screenShake = 8; traps.splice(i, 1); break; } }
        else if (tr.type === 'spikes') { for (const e of enemies) if (dist(tr, e) < tr.radius) { e.hp -= tr.damage / 60; stats.totalDamage += tr.damage / 60; } }
        else if (tr.type === 'slowfield') { for (const e of enemies) if (dist(tr, e) < tr.radius && e.effects.slow < 10) e.effects.slow = 10; }
    }
    // Torres
    for (const t of towers) {
        if (t.cooldown > 0) t.cooldown--; if (t.attackAnim > 0) t.attackAnim--;
        let target = null, best = -Infinity;
        for (const e of enemies) { if (dist(t, e) > t.range) continue; let v = 0;
            switch (t.targetMode) { case 'first': v = e.waypointIndex; break; case 'last': v = -e.waypointIndex; break; case 'strong': v = e.hp; break; case 'weak': v = -e.hp; break; case 'close': v = -dist(t, e); break; }
            if (v > best) { best = v; target = e; } }
        if (target) { t.angle = Math.atan2(target.y - t.y, target.x - t.x);
            if (t.effect === 'laser') { if (t.cooldown <= 0) { let d = t.damage; if (target.armor > 0) d = Math.max(1, d - target.armor); target.hp -= d; stats.totalDamage += d; lasers.push({ x1: t.x, y1: t.y, x2: target.x, y2: target.y, color: t.projColor, life: 3 }); t.cooldown = t.fireRate; t.attackAnim = 5; } }
            else if (t.effect === 'chain') { if (t.cooldown <= 0) { const ct = [target]; let lt = target; for (let c = 0; c < 3; c++) { let nt = null, md = 100; for (const e of enemies) { if (ct.includes(e)) continue; const d = dist(lt, e); if (d < md) { md = d; nt = e; } } if (nt) { ct.push(nt); lt = nt; } } let prev = { x: t.x, y: t.y }; for (const c of ct) { let d = t.damage; if (c.armor > 0) d = Math.max(1, d - c.armor); c.hp -= d; stats.totalDamage += d; lightnings.push({ x1: prev.x, y1: prev.y, x2: c.x, y2: c.y, life: 10 }); createParticles(c.x, c.y, '#ffff00', 5, 3); prev = c; } t.cooldown = t.fireRate; t.attackAnim = 10; } }
            else if (t.cooldown <= 0) { projectiles.push({ x: t.x, y: t.y, target, speed: t.projectileSpeed, damage: t.damage, color: t.projColor, splash: t.splash, effect: t.effect, size: t.splash > 0 ? 6 : 3 }); t.cooldown = t.fireRate; t.attackAnim = 5; }
        }
    }
    // Projéteis
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!enemies.includes(p.target)) { projectiles.splice(i, 1); continue; }
        const dx = p.target.x - p.x, dy = p.target.y - p.y, d = Math.hypot(dx, dy);
        if (d < p.speed + p.target.size) {
            let dmg = p.damage; if (p.target.armor > 0 && p.effect !== 'magic') dmg = Math.max(1, dmg - p.target.armor);
            p.target.hp -= dmg; stats.totalDamage += dmg;
            createParticles(p.x, p.y, p.color, 4, 3);
            if (p.effect === 'slow') { p.target.effects.slow = 90; createParticles(p.x, p.y, '#b3e5fc', 6, 3); }
            else if (p.effect === 'poison') { p.target.effects.poison = 180; p.target.effects.poisonDmg = Math.max(1, Math.floor(p.damage * 0.3)); }
            if (p.splash > 0) { for (const e of enemies) if (e !== p.target && dist(p, e) < p.splash) { let sd = p.damage * 0.5; if (e.armor > 0 && p.effect !== 'magic') sd = Math.max(1, sd - e.armor); e.hp -= sd; stats.totalDamage += sd; if (p.effect === 'slow') e.effects.slow = 60; if (p.effect === 'poison') { e.effects.poison = 120; e.effects.poisonDmg = Math.max(1, Math.floor(p.damage * 0.15)); } } createParticles(p.x, p.y, '#ff8800', 15, 5); }
            projectiles.splice(i, 1);
        } else { p.x += (dx/d)*p.speed; p.y += (dy/d)*p.speed; }
    }
    for (let i = lasers.length - 1; i >= 0; i--) { lasers[i].life--; if (lasers[i].life <= 0) lasers.splice(i, 1); }
    for (let i = lightnings.length - 1; i >= 0; i--) { lightnings[i].life--; if (lightnings[i].life <= 0) lightnings.splice(i, 1); }
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vx *= .95; p.vy *= .95; p.life--; if (p.life <= 0) particles.splice(i, 1); }
    for (let i = floatingTexts.length - 1; i >= 0; i--) { const t = floatingTexts[i]; t.y -= 1; t.life--; if (t.life <= 0) floatingTexts.splice(i, 1); }
    updateUI();
}

// ============================================================
// DESENHO DE PERSONAGENS (mesmo do anterior)
// ============================================================
function drawHero(ctx, x, y, type, skinIdx, level, angle, attackAnim) {
    const s = HERO_SKINS[type][skinIdx];
    const sc = 1 + level * 0.04;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    if (s.aura || level >= 3) { const ac = s.aura || 'rgba(255,215,0,.2)'; ctx.fillStyle = ac; ctx.beginPath(); ctx.arc(0, 0, 18 + Math.sin(Date.now()/300)*2, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0, 16, 10, 4, 0, 0, Math.PI*2); ctx.fill();
    if (s.cape) { ctx.fillStyle = s.cape; ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(-10, 14); ctx.lineTo(10, 14); ctx.lineTo(6, -2); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = s.body2; ctx.fillRect(-6, 8, 5, 8); ctx.fillRect(1, 8, 5, 8);
    ctx.fillStyle = '#333'; ctx.fillRect(-7, 14, 6, 3); ctx.fillRect(1, 14, 6, 3);
    ctx.fillStyle = s.body; ctx.fillRect(-7, -4, 14, 13);
    ctx.fillStyle = s.body2; ctx.fillRect(-5, -2, 10, 2);
    ctx.save(); ctx.rotate(angle); ctx.fillStyle = s.skin; ctx.fillRect(0, -2, 14, 4); drawWeapon(ctx, s, attackAnim); ctx.restore();
    ctx.fillStyle = s.skin; ctx.fillRect(-12, -2, 6, 4);
    ctx.fillStyle = s.skin; ctx.beginPath(); ctx.arc(0, -10, 8, 0, Math.PI*2); ctx.fill();
    if (s.hair) { ctx.fillStyle = s.hair; ctx.beginPath(); ctx.arc(0, -13, 7, Math.PI, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = s.eye; ctx.fillRect(-4, -11, 3, 3); ctx.fillRect(1, -11, 3, 3);
    ctx.fillStyle = '#000'; ctx.fillRect(-3, -10, 1, 1); ctx.fillRect(2, -10, 1, 1);
    ctx.fillStyle = '#c0392b'; ctx.fillRect(-2, -7, 4, 1);
    drawHat(ctx, s);
    if (level > 1) { ctx.fillStyle = '#ffd700'; ctx.font = 'bold 7px Arial'; ctx.textAlign = 'center'; ctx.fillText('★'.repeat(Math.min(level-1, 4)), 0, -22); }
    ctx.restore();
}

function drawWeapon(ctx, s, anim) {
    ctx.fillStyle = s.weaponColor;
    const w = s.weapon;
    if (w === 'bow') { ctx.strokeStyle = s.weaponColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(12, 0, 8, -.8, .8); ctx.stroke(); ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(12, 6); ctx.stroke(); }
    else if (w === 'bomb' || w === 'cannon') { ctx.fillRect(8, -4, 12, 8); ctx.fillStyle = '#555'; ctx.fillRect(18, -3, 4, 6); }
    else if (w === 'rifle' || w === 'laserrifle') { ctx.fillRect(6, -2, 16, 4); ctx.fillStyle = '#555'; ctx.fillRect(20, -3, 3, 6); }
    else if (w === 'crossbow') { ctx.fillRect(6, -2, 14, 4); ctx.fillRect(14, -6, 2, 12); }
    else if (w.includes('staff')) { ctx.fillRect(6, -1, 16, 3); ctx.beginPath(); ctx.arc(22, 0, 4, 0, Math.PI*2); ctx.fill(); }
    else if (w === 'potion' || w === 'cauldron') { ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(14, 0, 5, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = s.weaponColor; ctx.beginPath(); ctx.arc(14, 0, 3, 0, Math.PI*2); ctx.fill(); }
    else { ctx.fillRect(6, -3, 14, 6); ctx.fillStyle = s.weaponColor; ctx.globalAlpha = .6 + Math.sin(Date.now()/100)*.4; ctx.beginPath(); ctx.arc(20, 0, 3, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1; }
}

function drawHat(ctx, s) {
    ctx.fillStyle = s.hatColor;
    const h = s.hat;
    if (h === 'hood') { ctx.beginPath(); ctx.arc(0, -12, 9, Math.PI, Math.PI*2); ctx.fill(); ctx.fillRect(-9, -12, 18, 4); }
    else if (h === 'wizard') { ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(-9, -12); ctx.lineTo(9, -12); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(0, -20, 2, 0, Math.PI*2); ctx.fill(); }
    else if (h === 'crown') { ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-6, -20); ctx.lineTo(-3, -16); ctx.lineTo(0, -22); ctx.lineTo(3, -16); ctx.lineTo(6, -20); ctx.lineTo(8, -14); ctx.closePath(); ctx.fill(); }
    else if (h === 'horns') { ctx.beginPath(); ctx.moveTo(-6, -16); ctx.lineTo(-10, -24); ctx.lineTo(-3, -16); ctx.fill(); ctx.beginPath(); ctx.moveTo(6, -16); ctx.lineTo(10, -24); ctx.lineTo(3, -16); ctx.fill(); }
    else if (h === 'halo') { ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 2; ctx.globalAlpha = .6 + Math.sin(Date.now()/400)*.3; ctx.beginPath(); ctx.ellipse(0, -20, 8, 3, 0, 0, Math.PI*2); ctx.stroke(); ctx.globalAlpha = 1; }
    else { ctx.beginPath(); ctx.arc(0, -13, 8, Math.PI, Math.PI*2); ctx.fill(); ctx.fillRect(-8, -13, 16, 3); }
}

function drawHeroPreview(cvs, type, skinIdx) {
    const pctx = cvs.getContext('2d');
    pctx.clearRect(0, 0, cvs.width, cvs.height);
    drawHero(pctx, cvs.width/2, cvs.height/2 + 4, type, skinIdx, 1, 0, 0);
}

// ============================================================
// RENDER (GRÁFICOS MELHORADOS)
// ============================================================
function draw() {
    const skin = MAP_SKINS[MAPS[currentMapIndex].skin];
    ctx.save();
    if (screenShake > 0) {
        ctx.translate((Math.random()-.5)*screenShake, (Math.random()-.5)*screenShake);
    }
    // Fundo com gradiente
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, 500);
    grad.addColorStop(0, skin.bg);
    grad.addColorStop(1, shadeColor(skin.bg, -30));
    ctx.fillStyle = grad;
    ctx.fillRect(-10, -10, canvas.width+20, canvas.height+20);
    // Textura
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 60; i++) {
        ctx.fillRect((i * 73) % canvas.width, (i * 137) % canvas.height, 2, 2);
    }
    ctx.globalAlpha = 1;
    // Grid
    ctx.strokeStyle = 'rgba(0,0,0,.08)'; ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += TILE) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y <= canvas.height; y += TILE) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    // Caminho com borda
    ctx.strokeStyle = skin.pathBorder; ctx.lineWidth = TILE + 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i].x, waypoints[i].y);
    ctx.stroke();
    ctx.strokeStyle = skin.path; ctx.lineWidth = TILE - 4;
    ctx.beginPath(); ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i].x, waypoints[i].y);
    ctx.stroke();
    // Início/Fim
    ctx.fillStyle = '#2ecc71'; ctx.fillRect(0, waypoints[0].y - TILE/2, TILE/2, TILE);
    ctx.fillStyle = '#e74c3c'; const last = waypoints[waypoints.length-1]; ctx.fillRect(canvas.width - TILE/2, last.y - TILE/2, TILE/2, TILE);
    // Preview
    if ((selectedTowerType || selectedTrapType) && hoverCell) {
        const { x, y } = hoverCell;
        const blocked = pathSet.has(`${x},${y}`) || towers.some(t => t.cx === x && t.cy === y) || traps.some(t => t.cx === x && t.cy === y);
        if (selectedTowerType) {
            const type = TOWER_TYPES[selectedTowerType], cnt = towers.filter(t => t.type === selectedTowerType).length;
            const ok = !blocked && cnt < TOWER_LIMITS[selectedTowerType] && towers.length < MAX_TOWERS && gold >= type.cost;
            ctx.fillStyle = ok ? 'rgba(0,255,0,.15)' : 'rgba(255,0,0,.15)';
            ctx.strokeStyle = ok ? 'rgba(0,255,0,.5)' : 'rgba(255,0,0,.5)';
            ctx.beginPath(); ctx.arc(x*TILE+TILE/2, y*TILE+TILE/2, type.range, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = ok ? 'rgba(0,255,0,.4)' : 'rgba(255,0,0,.4)'; ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
            if (ok) drawHero(ctx, x*TILE+TILE/2, y*TILE+TILE/2, selectedTowerType, selectedSkinIndex, 1, 0, 0);
        }
    }
    // Armadilhas
    for (const tr of traps) {
        if (tr.type === 'slowfield') { ctx.fillStyle = 'rgba(100,100,255,.2)'; ctx.beginPath(); ctx.arc(tr.x, tr.y, tr.radius, 0, Math.PI*2); ctx.fill(); }
        ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(tr.x-15, tr.y-15, 30, 30);
        ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tr.icon, tr.x, tr.y);
    }
    // Torres
    for (const t of towers) {
        const isSel = t === selectedTower;
        if (isSel) { ctx.fillStyle = 'rgba(0,212,255,.1)'; ctx.strokeStyle = 'rgba(0,212,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(t.x, t.y, t.range, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
        drawHero(ctx, t.x, t.y, t.type, t.skinIdx, t.level, t.angle, t.attackAnim);
        if (isSel) { ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2; ctx.strokeRect(t.x-18, t.y-18, 36, 36); }
    }
    // Lasers
    for (const l of lasers) { ctx.strokeStyle = l.color; ctx.lineWidth = 3; ctx.globalAlpha = l.life/3; ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke(); ctx.globalAlpha = 1; }
    // Lightnings
    for (const l of lightnings) { ctx.strokeStyle = '#ffff00'; ctx.lineWidth = 2; ctx.globalAlpha = l.life/10; ctx.beginPath(); let px = l.x1, py = l.y1; ctx.moveTo(px, py); for (let i = 1; i <= 5; i++) { const t = i/5; ctx.lineTo(l.x1+(l.x2-l.x1)*t+(Math.random()-.5)*10, l.y1+(l.y2-l.y1)*t+(Math.random()-.5)*10); } ctx.stroke(); ctx.globalAlpha = 1; }
    // Inimigos
    for (const e of enemies) {
        ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(e.x, e.y+e.size, e.size, e.size/2, 0, 0, Math.PI*2); ctx.fill();
        if (e.isBoss) {
            ctx.fillStyle = 'rgba(255,0,0,.2)'; ctx.beginPath(); ctx.arc(e.x, e.y, e.size+8, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = e.outline; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.moveTo(e.x-18, e.y-e.size-2); ctx.lineTo(e.x-12, e.y-e.size-14); ctx.lineTo(e.x-6, e.y-e.size-6); ctx.lineTo(e.x, e.y-e.size-18); ctx.lineTo(e.x+6, e.y-e.size-6); ctx.lineTo(e.x+12, e.y-e.size-14); ctx.lineTo(e.x+18, e.y-e.size-2); ctx.closePath(); ctx.fill();
        } else {
            ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = e.outline; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(e.x-3, e.y-2, 2, 0, Math.PI*2); ctx.arc(e.x+3, e.y-2, 2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(e.x-3, e.y-2, 1, 0, Math.PI*2); ctx.arc(e.x+3, e.y-2, 1, 0, Math.PI*2); ctx.fill();
        }
        if (e.effects.slow > 0 || globalFreeze > 0) { ctx.strokeStyle = '#00bcd4'; ctx.lineWidth = 2; ctx.setLineDash([3,3]); ctx.beginPath(); ctx.arc(e.x, e.y, e.size+3, 0, Math.PI*2); ctx.stroke(); ctx.setLineDash([]); }
        if (e.effects.poison > 0) { ctx.fillStyle = 'rgba(118,255,3,.4)'; ctx.beginPath(); ctx.arc(e.x, e.y, e.size+2, 0, Math.PI*2); ctx.fill(); }
        const bw = e.isBoss ? 80 : 30, bh = e.isBoss ? 8 : 4, hr = e.hp/e.maxHp;
        ctx.fillStyle = '#000'; ctx.fillRect(e.x-bw/2, e.y-e.size-(e.isBoss?28:10), bw, bh);
        const hpGrad = ctx.createLinearGradient(e.x-bw/2, 0, e.x+bw/2, 0);
        if (hr > .5) { hpGrad.addColorStop(0, '#2ecc71'); hpGrad.addColorStop(1, '#27ae60'); }
        else if (hr > .25) { hpGrad.addColorStop(0, '#f39c12'); hpGrad.addColorStop(1, '#e67e22'); }
        else { hpGrad.addColorStop(0, '#e74c3c'); hpGrad.addColorStop(1, '#c0392b'); }
        ctx.fillStyle = hpGrad; ctx.fillRect(e.x-bw/2, e.y-e.size-(e.isBoss?28:10), bw*hr, bh);
        if (e.isBoss) { ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.fillText(`BOSS ${Math.floor(hr*100)}%`, e.x, e.y-e.size-32); }
    }
    // Projéteis
    for (const p of projectiles) { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke(); }
    // Partículas
    for (const p of particles) { ctx.fillStyle = p.color; ctx.globalAlpha = Math.min(1, p.life/20); ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1; }
    // Textos
    for (const t of floatingTexts) { ctx.fillStyle = t.color; ctx.globalAlpha = Math.min(1, t.life/30); ctx.font = `bold ${t.size}px Arial`; ctx.textAlign = 'center'; ctx.fillText(t.text, t.x, t.y); ctx.globalAlpha = 1; }
    if (globalFreeze > 0) { ctx.fillStyle = 'rgba(173,216,230,.15)'; ctx.fillRect(-10, -10, canvas.width+20, canvas.height+20); }
    if (lives <= 0) { ctx.fillStyle = 'rgba(0,0,0,.8)'; ctx.fillRect(-10, -10, canvas.width+20, canvas.height+20); ctx.fillStyle = '#ff4444'; ctx.font = 'bold 48px Arial'; ctx.textAlign = 'center'; ctx.fillText('💀 GAME OVER', canvas.width/2, canvas.height/2); }
    ctx.restore();
}

function shadeColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + percent));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent));
    return `rgb(${r},${g},${b})`;
}

// ============================================================
// GAME LOOP
// ============================================================
let gameRunning = false;
function gameLoop() {
    if (!gameRunning) { gameRunning = true; }
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// ============================================================
// INIT
// ============================================================
createTowerButtons();
createTrapButtons();
initWelcome();