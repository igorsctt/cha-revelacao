// Elementos do DOM
const splashScreen = document.getElementById('splashScreen');
const mainContent = document.getElementById('mainContent');
const splashBalloons = document.querySelectorAll('.splash-balloon');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('dotsContainer');
const progressFill = document.getElementById('progressFill');
const revealButtonContainer = document.getElementById('revealButtonContainer');

// Audio
const backgroundMusic = document.getElementById('backgroundMusic');
const audioButton = document.getElementById('audioButton');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const audioText = document.querySelector('.audio-text');

let currentSlide = 0;
const totalSlides = slides.length;
let isPlaying = false;

// Inicialização
function init() {
    createDots();
    updateSlideshow();
    setupSplashScreen();
}

// Setup da tela splash
function setupSplashScreen() {
    splashBalloons.forEach(balloon => {
        balloon.addEventListener('click', function() {
            // Adiciona efeito de clique
            this.style.transform = 'scale(0) rotate(180deg)';
            
            // Aguarda a animação e esconde a splash
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                mainContent.classList.add('visible');
                
                // Inicia a música automaticamente
                backgroundMusic.play()
                    .then(() => {
                        isPlaying = true;
                        updateAudioButton();
                    })
                    .catch(error => {
                        console.log('Não foi possível tocar a música automaticamente:', error);
                        isPlaying = false;
                        updateAudioButton();
                    });
                
                // Inicia o autoplay dos slides
                setTimeout(() => {
                    startAutoplay();
                }, 1000);
            }, 500);
        });
        
        // Efeito hover nos balões
        balloon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-30px) scale(1.15)';
        });
        
        balloon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Criar dots de navegação
function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// Atualizar slideshow
function updateSlideshow() {
    // Atualizar slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    // Atualizar dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
    });

    // Atualizar barra de progresso
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;

    // Mostrar botão de revelação no último slide e manter visível
    if (currentSlide === totalSlides - 1) {
        setTimeout(() => {
            revealButtonContainer.classList.add('show');
        }, 500);
        // Para o autoplay quando chega na última foto
        stopAutoplay();
    } else {
        revealButtonContainer.classList.remove('show');
    }
}

// Ir para slide específico
function goToSlide(index) {
    currentSlide = index;
    updateSlideshow();
}

// Slide anterior
function prevSlide() {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    updateSlideshow();
}

// Próximo slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide = currentSlide + 1;
    } else {
        // Se chegou na última imagem, para o autoplay
        stopAutoplay();
        currentSlide = 0; // Só volta ao início se clicar manualmente
    }
    updateSlideshow();
}

// Setup do áudio (removido autoplay - agora só toca após clicar no balão)
function setupAudio() {
    // Não toca automaticamente mais, aguarda o clique no balão
    isPlaying = false;
    updateAudioButton();
}

// Toggle do áudio
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

// Atualizar botão de áudio
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

// Event Listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
audioButton.addEventListener('click', toggleAudio);

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Navegação por swipe (touch)
let touchStartX = 0;
let touchEndX = 0;

const slideshowElement = document.querySelector('.slideshow');

slideshowElement.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

slideshowElement.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - próximo slide
            nextSlide();
        } else {
            // Swipe right - slide anterior
            prevSlide();
        }
        // Pausa temporariamente ao fazer swipe
        pauseAutoplay();
    }
}

// Slideshow automático
let autoplayInterval;
let autoplayPaused = false;

function startAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
    autoplayInterval = setInterval(() => {
        if (!autoplayPaused && currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlideshow();
        } else if (currentSlide === totalSlides - 1) {
            // Para o autoplay quando chega na última foto
            stopAutoplay();
        }
    }, 4000); // Muda a cada 4 segundos
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

function pauseAutoplay(duration = 8000) {
    autoplayPaused = true;
    setTimeout(() => {
        autoplayPaused = false;
    }, duration);
}

// Pausar autoplay temporariamente ao interagir
prevBtn.addEventListener('click', () => {
    pauseAutoplay();
});

nextBtn.addEventListener('click', () => {
    pauseAutoplay();
});

// Pausar ao passar o mouse sobre o slideshow
const slideshow = document.querySelector('.slideshow');
slideshow.addEventListener('mouseenter', () => {
    autoplayPaused = true;
});

slideshow.addEventListener('mouseleave', () => {
    autoplayPaused = false;
});

// Animação de entrada suave
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Preload de imagens
function preloadImages() {
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
}

// Inicializar tudo
init();
preloadImages();

// Easter egg: Apertar espaço também avança o slide
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        nextSlide();
    }
});
