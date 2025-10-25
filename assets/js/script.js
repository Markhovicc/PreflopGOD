// Ações de poker
document.getElementById("fold").onclick = () => alert("Você deu FOLD 🧤");
document.getElementById("limp").onclick = () => alert("Você deu LIMP 🟢");
document.getElementById("raise").onclick = () => alert("Você deu RAISE 2 💰");
document.getElementById("allin").onclick = () => alert("Você foi ALL-IN 🔥");

// Sistema de posições e dealer
let currentDealerPosition = 0; // BTN é a posição 0
// Ordem fixa das posições: BTN, SB, BB, UTG, UTG+1, LJ, HJ, CO
const positions = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'LJ', 'HJ', 'CO'];

// Função para definir as posições iniciais
function setInitialPositions() {
    const positionElements = document.querySelectorAll('.position');
    
    positionElements.forEach((pos, index) => {
        pos.textContent = positions[index];
        pos.setAttribute('data-position', positions[index]);
    });
}

// Função para atualizar as posições baseadas no dealer
function updatePositions() {
    const dealerButton = document.getElementById('dealer-button');
    const positionElements = document.querySelectorAll('.position');
    
    // Remove destaque de todas as posições
    positionElements.forEach(pos => {
        pos.classList.remove('dealer-position');
        pos.style.background = '#000';
    });
    
    // Atualiza as posições relativas ao dealer (rotação)
    updateRelativePositions();
    
    // Ilumina a posição que está embaixo da mesa (posição 4 - índice 4)
    const bottomPosition = positionElements[4];
    bottomPosition.classList.add('dealer-position');
    bottomPosition.style.background = 'rgba(255, 215, 0, 0.9)';
    
    // Posiciona o botão dealer sobre a mesa
    updateDealerButtonPosition();
}

// Função para posicionar o botão dealer
function updateDealerButtonPosition() {
    const dealerButton = document.getElementById('dealer-button');
    
    // Encontra qual posição é o BTN atual
    const positionElements = document.querySelectorAll('.position');
    let btnPosition = null;
    let btnIndex = -1;
    
    // Procura pela posição que tem o texto "BTN"
    positionElements.forEach((pos, index) => {
        if (pos.textContent === 'BTN') {
            btnPosition = pos;
            btnIndex = index;
        }
    });
    
    if (btnPosition) {
        const rect = btnPosition.getBoundingClientRect();
        const tableRect = document.querySelector('.table-container').getBoundingClientRect();
        
        // Posiciona o botão D baseado na localização do BTN
        let relativeX, relativeY;
        
        switch(btnIndex) {
            case 0: // BTN no topo (cima)
                relativeX = rect.left - tableRect.left + (rect.width / 2) - 12.5;
                relativeY = rect.top - tableRect.top + rect.height + 10; // Abaixo do BTN
                break;
            case 1: // BTN diagonal superior direita
                relativeX = rect.left - tableRect.left - 20; // À esquerda do BTN
                relativeY = rect.top - tableRect.top + (rect.height / 2) - 12.5;
                break;
            case 2: // BTN na direita
                relativeX = rect.left - tableRect.left - 20; // À esquerda do BTN
                relativeY = rect.top - tableRect.top + (rect.height / 2) - 12.5;
                break;
            case 3: // BTN diagonal inferior direita
                relativeX = rect.left - tableRect.left - 20; // À esquerda do BTN
                relativeY = rect.top - tableRect.top - 20; // Acima do BTN
                break;
            case 4: // BTN embaixo (iluminado)
                relativeX = rect.left - tableRect.left - 30; // Mais à esquerda do BTN
                relativeY = rect.top - tableRect.top - 35; // Mais acima do BTN
                break;
            case 5: // BTN diagonal inferior esquerda
                relativeX = rect.left - tableRect.left + rect.width + 10; // À direita do BTN
                relativeY = rect.top - tableRect.top - 20; // Acima do BTN
                break;
            case 6: // BTN na esquerda
                relativeX = rect.left - tableRect.left + rect.width + 10; // À direita do BTN
                relativeY = rect.top - tableRect.top + (rect.height / 2) - 12.5;
                break;
            case 7: // BTN diagonal superior esquerda
                relativeX = rect.left - tableRect.left + rect.width + 10; // À direita do BTN
                relativeY = rect.top - tableRect.top + (rect.height / 2) - 12.5;
                break;
            default:
                relativeX = rect.left - tableRect.left + (rect.width / 2) - 12.5;
                relativeY = rect.top - tableRect.top - 15;
        }
        
        dealerButton.style.left = `${relativeX}px`;
        dealerButton.style.top = `${relativeY}px`;
        dealerButton.style.transform = 'none';
    }
}

// Função para atualizar as posições relativas ao dealer
function updateRelativePositions() {
    const positionElements = document.querySelectorAll('.position');
    
    positionElements.forEach((pos, index) => {
        const relativeIndex = (index - currentDealerPosition + 8) % 8;
        const positionName = positions[relativeIndex];
        pos.textContent = positionName;
        pos.setAttribute('data-position', positionName);
    });
}

// Função para rotacionar o dealer
function rotateDealer() {
    currentDealerPosition = (currentDealerPosition + 1) % 8;
    updatePositions();
    
    // Mostra qual posição é o dealer agora
    const dealerPosition = positions[currentDealerPosition];
    console.log(`Dealer agora está na posição: ${dealerPosition}`);
}

// Event listener para o botão de rotação
document.getElementById("rotate-dealer").onclick = rotateDealer;

// Inicializa as posições
document.addEventListener('DOMContentLoaded', function() {
    setInitialPositions();
    updatePositions();
});
