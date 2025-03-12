// Переменные для управления слайдами
let currentSlide = 1;
const totalSlides = 9;

// Функция для перехода к определенному слайду
function goToSlide(slideNumber) {
    // Скрываем все слайды
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Показываем нужный слайд
    document.getElementById(`slide${slideNumber}`).style.display = 'flex';
    
    // Обновляем активную точку навигации
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index + 1 === slideNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Обновляем текущий слайд
    currentSlide = slideNumber;
}

// Функция для перехода к следующему слайду
function nextSlide() {
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }
}

// Функция для перехода к предыдущему слайду
function prevSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

// Обработчик свайпов для мобильных устройств
document.addEventListener('DOMContentLoaded', function() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const presentation = document.querySelector('.presentation');
    
    presentation.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    presentation.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        // Определяем минимальное расстояние для свайпа (в пикселях)
        const swipeThreshold = 50;
        
        // Свайп влево (следующий слайд)
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
        }
        
        // Свайп вправо (предыдущий слайд)
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
        }
    }
    
    // Добавляем обработчик для кнопки CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Не нужно предотвращать действие по умолчанию, так как теперь это ссылка
            // Можно добавить аналитику или другие действия перед переходом
            console.log('Переход на Telegram');
        });
    }
});

// Добавляем обработчик клавиш для навигации
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
}); 