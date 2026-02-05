const LANE_MAPPING = {
    top: [
        'Aatrox', 'Akali', 'Ambessa', 'Anivia', 'Aurora', 'Camille', 'Cassiopeia', 
        'Chogath', 'Darius', 'DrMundo', 'Fiora', 'Gangplank', 'Garen', 'Gnar', 
        'Gragas', 'Gwen', 'Heimerdinger', 'Illaoi', 'Irelia', 'Jax', 'Jayce', 
        'KSante', 'Kayle', 'Kennen', 'Kled', 'Malphite', 'MasterYi', 'Mordekaiser', 
        'Naafiri', 'Nasus', 'Olaf', 'Ornn', 'Pantheon', 'Poppy', 'Quinn', 
        'Renekton', 'Riven', 'Rumble', 'Ryze', 'Sejuani', 'Sett', 'Shen', 
        'Singed', 'Sion', 'Swain', 'Sylas', 'TahmKench', 'Teemo', 'Trundle', 
        'Tryndamere', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Vladimir', 'Volibear', 
        'Warwick', 'MonkeyKing', 'Yasuo', 'Yone', 'Yorick', 'Zac'
    ],
    jungle: [
        'Aatrox', 'Ambessa', 'Amumu', 'Belveth', 'Briar', 'Diana', 'DrMundo', 
        'Ekko', 'Elise', 'Evelynn', 'Fiddlesticks', 'Gragas', 'Graves', 'Gwen', 
        'Hecarim', 'Ivern', 'JarvanIV', 'Jax', 'Jayce', 'Karthus', 'Kayn', 
        'Khazix', 'Kindred', 'LeeSin', 'Lillia', 'Malphite', 'MasterYi', 
        'Naafiri', 'Nidalee', 'Nocturne', 'Nunu', 'Pantheon', 'Qiyana', 
        'Rammus', 'RekSai', 'Rengar', 'Sejuani', 'Shaco', 'Shyvana', 'Skarner', 
        'Sylas', 'Taliyah', 'Talon', 'Trundle', 'Udyr', 'Vi', 'Viego', 
        'Volibear', 'Warwick', 'MonkeyKing', 'XinZhao', 'Zac', 'Zed', 
        'Zyra'
    ],
    mid: [
        'Ahri', 'Akali', 'Akshan', 'Anivia', 'Annie', 'AurelionSol', 'Aurora', 
        'Azir', 'Brand', 'Cassiopeia', 'Chogath', 'Corki', 'Diana', 'Ekko', 
        'Fizz', 'Galio', 'Hwei', 'Irelia', 'Kassadin', 'Katarina', 'Kayle', 
        'Kennen', 'Leblanc', 'Lissandra', 'Lux', 'Malphite', 'Malzahar', 'Mel', 
        'Morgana', 'Naafiri', 'Neeko', 'Orianna', 'Pantheon', 'Qiyana', 'Ryze', 
        'Sion', 'Smolder', 'Swain', 'Sylas', 'Syndra', 'Taliyah', 'Talon', 
        'Tristana', 'TwistedFate', 'Varus', 'Veigar', 'Velkoz', 'Vex', 'Viktor', 
        'Vladimir', 'Xerath', 'Yasuo', 'Yone', 'Zed', 'Ziggs', 'Zoe'
    ],
    bot: [
        'Aphelios', 'Ashe', 'Brand', 'Caitlyn', 'Corki', 'Draven', 'Ezreal', 
        'Jhin', 'Jinx', 'Kaisa', 'Kalista', 'KogMaw', 'Lucian', 'Lux', 'Mel', 
        'MissFortune', 'Nilah', 'Samira', 'Seraphine', 'Sivir', 'Smolder', 
        'Swain', 'Tristana', 'Twitch', 'Varus', 'Vayne', 'Veigar', 'Xayah', 
        'Yasuo', 'Zeri', 'Ziggs'
    ],
    support: [
        'Alistar', 'Ashe', 'Bard', 'Blitzcrank', 'Brand', 'Braum', 'Elise', 
        'Fiddlesticks', 'Janna', 'Karma', 'Leblanc', 'Leona', 'Lulu', 'Lux', 
        'Maokai', 'Mel', 'Milio', 'Morgana', 'Nami', 'Nautilus', 'Neeko', 
        'Pantheon', 'Poppy', 'Pyke', 'Rakan', 'Rell', 'Renata', 'Senna', 
        'Seraphine', 'Shaco', 'Sona', 'Soraka', 'Swain', 'TahmKench', 'Taric', 
        'Thresh', 'Velkoz', 'Xerath', 'Yuumi', 'Zilean', 'Zoe', 'Zyra'
    ]
};

let allChampionsData = {};
let currentLane = null;
let currentSkins = [];
let currentSkinIndex = 0;
let currentChampId = "";

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof DataDragonAPI === 'undefined') {
        alert("ERRO CRÍTICO: O arquivo 'js/data-dragon-api.js' não foi carregado.");
        return;
    }
    await initApp();
    setupLaneButtons();
    document.getElementById('randomize-btn').addEventListener('click', randomizeChampion);
    
    document.getElementById('prev-skin').addEventListener('click', (e) => {
        e.stopPropagation();
        changeSkin(-1);
    });
    document.getElementById('next-skin').addEventListener('click', (e) => {
        e.stopPropagation();
        changeSkin(1);
    });
});

async function initApp() {
    const data = await DataDragonAPI.fetchChampionsList();
    if (data) {
        allChampionsData = data;
        console.log('API pronta.');
    } else {
        alert('Erro ao conectar com a Riot Games. Verifique sua internet.');
    }
}

function setupLaneButtons() {
    const buttons = document.querySelectorAll('.lane-btn');
    const laneTitle = document.getElementById('current-lane');
    const randomizeBtn = document.getElementById('randomize-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLane = btn.dataset.lane;
            laneTitle.textContent = `Rota: ${currentLane.toUpperCase()}`;
            randomizeBtn.disabled = false;
        });
    });
}

async function randomizeChampion() {
    if (!currentLane || !allChampionsData) {
        alert("Por favor, selecione uma rota primeiro!");
        return;
    }

    const randomizeBtn = document.getElementById('randomize-btn');
    const card = document.getElementById('champion-card');

    if (randomizeBtn) randomizeBtn.disabled = true;

    clearCardData(); 

    const possibleChampions = LANE_MAPPING[currentLane];
    const randomId = possibleChampions[Math.floor(Math.random() * possibleChampions.length)];
    currentChampId = randomId;

    try {
        const fullDetails = await DataDragonAPI.fetchChampionDetails(randomId);
        
        if (!fullDetails) throw new Error("Detalhes não encontrados");

        currentSkins = fullDetails.skins;
        currentSkinIndex = 0;

        // Atualiza info básica (nome, titulo)
        updateBasicInfo(fullDetails);
        
        // Atualiza imagem com efeito suave
        updateSkinDisplay();

        // Atualiza habilidades
        updateAbilities(fullDetails);

        if (card) {
            card.classList.remove('hidden');
            requestAnimationFrame(() => {
                card.classList.add('visible');
            });
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao buscar campeão.");
    } finally {
        resetUI();
    }
}

function resetUI() {
    const btn = document.getElementById('randomize-btn');
    if (btn) btn.disabled = false;
}

function clearCardData() {
    const nameEl = document.getElementById('champion-name');
    const titleEl = document.getElementById('champion-title');
    
    if (nameEl) nameEl.textContent = 'Carregando...';
    if (titleEl) titleEl.textContent = '';
    
    // Limpa apenas as skills, NÃO mexe na imagem principal (#champion-img)
    const skills = ['passive', 'q', 'w', 'e', 'r'];
    skills.forEach(slot => {
        const img = document.getElementById(`${slot}-skill`);
        const name = document.getElementById(`${slot}-name`);
        const desc = document.getElementById(`${slot}-desc`);
        
        if(img) img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        if(name) name.textContent = slot === 'passive' ? 'Passiva' : slot.toUpperCase();
        if(desc) desc.textContent = '...';
    });
}

function updateBasicInfo(details) {
    const nameEl = document.getElementById('champion-name');
    if (nameEl) nameEl.textContent = details.name; 
    
    const titleEl = document.getElementById('champion-title');
    if (titleEl) titleEl.textContent = details.title; 
}

function updateSkinDisplay() {
    const skin = currentSkins[currentSkinIndex];
    const imgEl = document.getElementById('champion-img');
    const mobileSrcEl = document.getElementById('champion-mobile-src');
    const titleEl = document.getElementById('champion-title');
    const champData = allChampionsData[currentChampId];

    const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampId}_${skin.num}.jpg`;
    const loadingUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${currentChampId}_${skin.num}.jpg`;

    if (imgEl) {
        // 1. Aplica o desfoque na imagem ATUAL (que ainda está lá)
        imgEl.classList.add('loading');

        // 2. Pré-carrega a nova imagem na memória
        const tempImg = new Image();
        tempImg.src = splashUrl;

        // 3. Quando a nova imagem estiver baixada...
        tempImg.onload = () => {
            // Troca o source oficial
            imgEl.src = splashUrl;
            if (mobileSrcEl) mobileSrcEl.srcset = loadingUrl;
            
            // Remove o "vazio" e o desfoque
            imgEl.classList.remove('empty');
            imgEl.classList.remove('loading');

            // Atualiza título da skin
            if (titleEl && champData) {
                if (skin.num === 0 || skin.name.toLowerCase() === 'default') {
                    titleEl.textContent = champData.title; 
                } else {
                    titleEl.textContent = skin.name; 
                }
            }
        };

        // Fallback: Se der erro ao carregar, remove o blur mesmo assim
        tempImg.onerror = () => {
            imgEl.classList.remove('loading');
        };
    }
}

function changeSkin(step) {
    if (currentSkins.length === 0) return;
    
    currentSkinIndex += step;
    
    if (currentSkinIndex >= currentSkins.length) currentSkinIndex = 0;
    if (currentSkinIndex < 0) currentSkinIndex = currentSkins.length - 1;
    
    updateSkinDisplay();
}

function updateAbilities(details) {
    const spells = details.spells;
    const passive = details.passive;

    updateSkillUI('passive', passive.name, passive.description, passive.image.full, true);
    updateSkillUI('q', spells[0].name, spells[0].description, spells[0].image.full);
    updateSkillUI('w', spells[1].name, spells[1].description, spells[1].image.full);
    updateSkillUI('e', spells[2].name, spells[2].description, spells[2].image.full);
    updateSkillUI('r', spells[3].name, spells[3].description, spells[3].image.full);
}

function updateSkillUI(slot, name, desc, imgFile, isPassive = false) {
    const type = isPassive ? 'passive' : 'spell';
    const fullImgUrl = DataDragonAPI.getImageUrl(type, imgFile);

    const imgId = `${slot}-skill`;
    const imgEl = document.getElementById(imgId);
    
    if (imgEl) {
        imgEl.src = fullImgUrl;
        imgEl.classList.remove('empty');
    }

    const nameEl = document.getElementById(`${slot}-name`);
    if (nameEl) nameEl.textContent = name;

    const descEl = document.getElementById(`${slot}-desc`);
    if (descEl) descEl.innerHTML = desc;
}

// debug
/* window.testar = async (id) => {
    currentLane = 'mid'; 
    currentChampId = id;
    const details = await DataDragonAPI.fetchChampionDetails(id);
    currentSkins = details.skins;
    currentSkinIndex = 0;
    updateBasicInfo(details);
    updateSkinDisplay(); 
    updateAbilities(details);
    document.getElementById('champion-card').classList.remove('hidden');
    document.getElementById('champion-card').classList.add('visible');
    console.log(`Testando campeão: ${id}`);
};*/