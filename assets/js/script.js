// Ações de poker
document.getElementById("fold").onclick = () => alert("Você deu FOLD 🧤");
document.getElementById("limp").onclick = () => alert("Você deu LIMP 🟢");
document.getElementById("raise").onclick = () => alert("Você deu RAISE 2 💰");
document.getElementById("allin").onclick = () => alert("Você foi ALL-IN 🔥");

// Sistema de posições e dealer
let currentDealerPosition = 0; // BTN é a posição 0
const positions = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'LJ', 'HJ', 'CO'];

// Configuração de offsets por posição lógica (edite nesta ordem: BTN, SB, BB, UTG, UTG+1, LJ, HJ, CO)
// Cada entrada controla um deslocamento adicional em pixels aplicado ao botão do dealer
// Valores positivos: x -> direita, y -> baixo. Valores negativos: esquerda/cima.
const dealerOffsetsByLabel = {
    BTN: { x: -30, y: 0 },
    SB:  { x: 50, y: 50 },
    BB:  { x: 0, y: 0 },
    UTG: { x: 0, y: 0 },
    'UTG+1': { x: -30, y: -35 },
    LJ:  { x: 10, y: -28 },
    HJ:  { x: 0, y: 0 },
    CO:  { x: 0, y: 0 }
};

// Helpers para ajustar offsets em runtime (console)
function setDealerOffsetByLabel(label, x, y) {
    if (!dealerOffsetsByLabel.hasOwnProperty(label)) return;
    dealerOffsetsByLabel[label] = { x: Number(x) || 0, y: Number(y) || 0 };
}

// Posiciona as fichas (small / big) conforme as labels SB e BB
function updateChipsPosition() {
    const smallChip = document.getElementById('small-chip');
    const bigChip = document.getElementById('big-chip');
    const positionElements = document.querySelectorAll('.position');
    const tableRect = document.querySelector('.table-container').getBoundingClientRect();

    // helper para posicionar uma ficha em frente ao elemento que possui a label 'labelName'
    function positionChip(labelName, chipEl, offsetsMap, defaultPlacement) {
        for (let pos of positionElements) {
            const textEl = pos.querySelector('.position-text');
            if (textEl && textEl.textContent === labelName) {
                const rect = pos.getBoundingClientRect();
                // base: centro horizontal da caixa e logo abaixo dela
                let baseX = rect.left - tableRect.left + rect.width / 2;
                let baseY = rect.top - tableRect.top + rect.height + 6;
                // apply offsets if provided
                const off = (offsetsMap && offsetsMap[labelName]) ? offsetsMap[labelName] : { x: 0, y: 0 };
                const finalX = baseX + off.x;
                const finalY = baseY + off.y;
                chipEl.style.left = `${Math.round(finalX - chipEl.offsetWidth/2)}px`;
                chipEl.style.top = `${Math.round(finalY - chipEl.offsetHeight/2)}px`;
                return;
            }
        }
        // se não encontrou a label, esconder a ficha
        chipEl.style.left = '-9999px';
        chipEl.style.top = '-9999px';
    }

    if (smallChip) positionChip('SB', smallChip, smallChipOffsetsByLabel);
    if (bigChip) positionChip('BB', bigChip, bigChipOffsetsByLabel);
}

function getDealerOffsetsByLabel() {
    return JSON.parse(JSON.stringify(dealerOffsetsByLabel));
}

// ================================
// FICHAS: offsets por posição lógica
// Edite estes valores na ordem: BTN, SB, BB, UTG, UTG+1, LJ, HJ, CO
// Cada chave é uma posição lógica; ajuste x/y para deslocar a ficha relativa à posição
const smallChipOffsetsByLabel = {
    BTN: { x: 0, y: 0 },
    SB:  { x: 0, y: 8 },   // padrão: small chip fica um pouco abaixo do label
    BB:  { x: 0, y: 0 },
    UTG: { x: 0, y: 0 },
    'UTG+1': { x: 0, y: 0 },
    LJ:  { x: 0, y: 0 },
    HJ:  { x: 0, y: 0 },
    CO:  { x: 0, y: 0 }
};

const bigChipOffsetsByLabel = {
    BTN: { x: 0, y: 0 },
    SB:  { x: 0, y: 0 },
    BB:  { x: 0, y: 10 },  // padrão: big chip um pouco abaixo
    UTG: { x: 0, y: 0 },
    'UTG+1': { x: 0, y: 0 },
    LJ:  { x: 0, y: 0 },
    HJ:  { x: 0, y: 0 },
    CO:  { x: 0, y: 0 }
};

function setSmallChipOffsetByLabel(label, x, y) {
    if (!smallChipOffsetsByLabel.hasOwnProperty(label)) return;
    smallChipOffsetsByLabel[label] = { x: Number(x) || 0, y: Number(y) || 0 };
}
function setBigChipOffsetByLabel(label, x, y) {
    if (!bigChipOffsetsByLabel.hasOwnProperty(label)) return;
    bigChipOffsetsByLabel[label] = { x: Number(x) || 0, y: Number(y) || 0 };
}

function getSmallChipOffsetsByLabel() { return JSON.parse(JSON.stringify(smallChipOffsetsByLabel)); }
function getBigChipOffsetsByLabel() { return JSON.parse(JSON.stringify(bigChipOffsetsByLabel)); }

// Define as posições iniciais
function setInitialPositions() {
    const positionElements = document.querySelectorAll('.position');

    positionElements.forEach((pos, index) => {
        const textEl = pos.querySelector('.position-text');
        if (textEl) {
            textEl.textContent = positions[index];
        } else {
            pos.innerHTML = `<span class="position-text">${positions[index]}</span>`;
        }
        pos.setAttribute('data-position', positions[index]);
    });
}

// Atualiza as posições baseadas no dealer
function updatePositions() {
    const positionElements = document.querySelectorAll('.position');
    
    positionElements.forEach(pos => {
        pos.classList.remove('dealer-position');
        pos.style.background = '#000';
    });

    updateRelativePositions();

    const bottomPosition = positionElements[4];
    bottomPosition.classList.add('dealer-position');
    bottomPosition.style.background = 'rgba(255, 215, 0, 0.9)';

    updateHeroCards();
    updateDealerButtonPosition();
    updateChipsPosition();
}

// Atualiza as cartas do Hero
function updateHeroCards() {
    for (let i = 0; i < 8; i++) {
        const cardSet = document.getElementById(`cards-${i}`);
        if (cardSet) {
            const cards = cardSet.querySelectorAll('.card');
            if (i === 4) {
                const heroCard1 = 'A♠';
                const heroCard2 = 'K♠';
                cards.forEach((card, index) => {
                    card.classList.remove('card-back');
                    card.classList.add('card-face');
                    card.textContent = index === 0 ? heroCard1 : heroCard2;
                });
            } else {
                cards.forEach(card => {
                    card.classList.remove('card-face');
                    card.classList.add('card-back');
                    card.textContent = '';
                });
            }
        }
    }
}

// Posiciona o botão dealer
function updateDealerButtonPosition() {
    const dealerButton = document.getElementById('dealer-button');
    const positionElements = document.querySelectorAll('.position');
    let btnPosition = null;
    let btnIndex = -1;

    positionElements.forEach((pos, index) => {
        const textEl = pos.querySelector('.position-text');
        if (textEl && textEl.textContent === 'BTN') {
            btnPosition = pos;
            btnIndex = index;
        }
    });

    if (btnPosition) {
        const rect = btnPosition.getBoundingClientRect();
        const tableRect = document.querySelector('.table-container').getBoundingClientRect();
        let relativeX, relativeY;

        // determine base relative position based on which DOM index currently has the 'BTN' label
        switch (btnIndex) {
            case 0:
                relativeX = 200;
                relativeY = 67;
                break;
            case 1:
                relativeX = 240;
                relativeY = 105;
                break;
            case 2:
                relativeX = 250;
                relativeY = 257;
                break;
            case 3:
                relativeX = 230;
                relativeY = 357;
                break;
            case 4:
                relativeX = 130;
                relativeY = 360;
                break;        
            case 5:
                 // posição abaixo esquerda: subir um pouco mais o botão
                relativeX = 90;
                relativeY = 290;
                break;
            case 6:
                relativeX = 92;
                relativeY = 160;
                break;
            case 7:
                relativeX = 136;
                relativeY = 67;
                break;
            default:
                relativeX = 200;
                relativeY = 67;
                break;
        }

        // apply offset based on logical label present in this seat (BTN, SB, BB, ...)
        const labelEl = btnPosition.querySelector('.position-text');
        const label = labelEl ? labelEl.textContent : null;
        if (label && dealerOffsetsByLabel[label]) {
            const off = dealerOffsetsByLabel[label];
            relativeX += off.x;
            relativeY += off.y;
        }

        dealerButton.style.left = `${relativeX}px`;
        dealerButton.style.top = `${relativeY}px`;
        dealerButton.style.transform = 'none';
    }

    // (chips positioned by updateChipsPosition global function)
}

// Atualiza as posições relativas ao dealer (sem apagar blinds)
function updateRelativePositions() {
    const positionElements = document.querySelectorAll('.position');

    positionElements.forEach((pos, index) => {
        const relativeIndex = (index - currentDealerPosition + 8) % 8;
        const positionName = positions[relativeIndex];
        const textEl = pos.querySelector('.position-text');
        if (textEl) textEl.textContent = positionName;
        pos.setAttribute('data-position', positionName);
    });
}

// Rotaciona o dealer
function rotateDealer() {
    currentDealerPosition = (currentDealerPosition + 1) % 8;
    updatePositions();
    console.log(`Dealer agora está na posição: ${positions[currentDealerPosition]}`);
}

document.getElementById("rotate-dealer").onclick = rotateDealer;

document.addEventListener('DOMContentLoaded', function() {
    setInitialPositions();
    updatePositions();
});
