// Elementos do DOM
const giftSplash = document.getElementById('giftSplash');
const giftBox = document.getElementById('giftBox');
const questionMarks = document.getElementById('questionMarks');
const mainContent = document.getElementById('mainContent');
const balloons = document.querySelectorAll('.balloon');
const revealSection = document.getElementById('revealSection');
const result = document.getElementById('result');
const revealText = document.getElementById('revealText');
const babyName = document.getElementById('babyName');

// Audio
const backgroundMusic = document.getElementById('backgroundMusic');
const audioButton = document.getElementById('audioButton');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const audioText = document.querySelector('.audio-text');

let isPlaying = false;

// Setup do presente
if (giftBox) {
    giftBox.addEventListener('click', function() {
        // Adiciona classe de clique
        this.classList.add('clicked');
        
        // Explode os pontos de interrogação
        const questions = questionMarks.querySelectorAll('.question');
        questions.forEach((q, index) => {
            const angle = (index * 45) * (Math.PI / 180);
            q.style.setProperty('--tx', Math.cos(angle));
            q.style.setProperty('--ty', Math.sin(angle));
        });
        
        // Aguarda as animações e mostra o conteúdo principal
        setTimeout(() => {
            giftSplash.classList.add('hidden');
            mainContent.style.display = 'block';
            
            // Pequeno delay para a animação de entrada
            setTimeout(() => {
                mainContent.style.opacity = '0';
                mainContent.style.transition = 'opacity 0.8s ease';
                mainContent.style.opacity = '1';
            }, 100);
        }, 1000);
    });
}

// Dados dos nomes
const babyData = {
    boy: {
        name: 'Théo',
        message: 'É um MENINO! 💙',
        class: 'boy'
    },
    girl: {
        name: 'Louise',
        message: 'É uma MENINA! 💗',
        class: 'girl'
    }
};

// Função para criar confetti
function createConfetti() {
    const confettiCount = 50;
    const colors = ['#FF69B4', '#4A90E2', '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.opacity = Math.random();
        
        result.querySelector('.confetti').appendChild(confetti);
    }
}

// Função para revelar o sexo do bebê
function reveal(gender) {
    const data = babyData[gender];
    
    // Salva o voto do usuário no localStorage
    const voto = gender === 'boy' ? 'Menino' : 'Menina';
    localStorage.setItem('votoGenero', voto);
    
    // Atualiza o link do WhatsApp com o voto
    updateWhatsAppLink(voto);
    
    // Adiciona efeito de explosão nos balões
    balloons.forEach(balloon => {
        balloon.style.transform = 'scale(0)';
        balloon.style.opacity = '0';
    });
    
    // Aguarda a animação dos balões
    setTimeout(() => {
        // Esconde a seção de revelação
        revealSection.style.display = 'none';
        
        // Mostra o resultado
        result.classList.remove('hidden');
        result.classList.add('show', data.class);
        
        // Define o texto
        revealText.textContent = data.message;
        babyName.textContent = data.name;
        
        // Cria confetti
        createConfetti();
        
        // Toca som de celebração (opcional - descomente se tiver um arquivo de áudio)
        // const audio = new Audio('path/to/celebration-sound.mp3');
        // audio.play();
    }, 500);
}

// Função para atualizar o link do WhatsApp
function updateWhatsAppLink(voto) {
    const whatsappButton = document.getElementById('whatsappButton');
    const mensagem = `Olá!%20Confirmo%20minha%20presença%20no%20chá%20revelação!%0A%0AMeu%20voto:%20${voto}%20🎈`;
    whatsappButton.href = `https://wa.me/5519995393168?text=${mensagem}`;
}

// Adiciona evento de clique nos balões
balloons.forEach(balloon => {
    balloon.addEventListener('click', function() {
        const gender = this.getAttribute('data-gender');
        reveal(gender);
    });
    
    // Adiciona efeito de hover
    balloon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-20px) scale(1.1)';
    });
    
    balloon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Adiciona animação de entrada suave
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Verifica se já existe um voto salvo
    const votoSalvo = localStorage.getItem('votoGenero');
    if (votoSalvo) {
        updateWhatsAppLink(votoSalvo);
    }
    
    // Tenta tocar a música automaticamente
    if (backgroundMusic) {
        backgroundMusic.play()
            .then(() => {
                isPlaying = true;
                updateAudioButton();
            })
            .catch(() => {
                isPlaying = false;
                updateAudioButton();
            });
    }
});

// Funções de controle de áudio
function toggleAudio() {
    if (isPlaying) {
        backgroundMusic.pause();
        isPlaying = false;
    } else {
        backgroundMusic.play();
        isPlaying = true;
    }
    updateAudioButton();
}

function updateAudioButton() {
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        audioText.textContent = 'Música tocando';
        audioButton.style.animation = 'pulse 2s ease infinite';
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        audioText.textContent = 'Clique para ouvir a música';
        audioButton.style.animation = 'none';
    }
}

// Event listener do botão de áudio
if (audioButton) {
    audioButton.addEventListener('click', toggleAudio);
}

// Easter egg: Se clicar nos dois balões rapidamente, mostra uma mensagem especial
let clickCount = 0;
let lastClickTime = 0;

balloons.forEach(balloon => {
    balloon.addEventListener('click', function() {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 500) {
            clickCount++;
            if (clickCount >= 2) {
                console.log('🎉 Você descobriu o easter egg! 🎉');
                // Pode adicionar algo especial aqui
            }
        } else {
            clickCount = 0;
        }
        lastClickTime = currentTime;
    });
});
