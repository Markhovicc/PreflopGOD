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

function getDealerOffsetsByLabel() {
    return JSON.parse(JSON.stringify(dealerOffsetsByLabel));
}

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
