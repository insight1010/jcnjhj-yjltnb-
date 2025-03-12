// Переменные для управления слайдами
let currentSlide = 1;
const totalSlides = 10;

// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    tg.expand();
    tg.ready();
    
    // Применение цветов темы Telegram
    applyTelegramTheme();
    
    // Инициализация презентации
    initPresentation();
});

// Применение цветов темы Telegram
function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.documentElement.style.setProperty('--tg-theme-bg-color', '#222');
        document.documentElement.style.setProperty('--tg-theme-text-color', '#fff');
    }
    
    // Применение цветов из Telegram WebApp
    if (tg.themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
    }
    if (tg.themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
    }
    if (tg.themeParams.button_color) {
        document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
    }
    if (tg.themeParams.button_text_color) {
        document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
    }
}

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
    
    // Вибрация при переключении слайдов (если поддерживается)
    if ('vibrate' in navigator) {
        navigator.vibrate(30);
    }
    
    // Обновляем MainButton Telegram
    tg.MainButton.text = `Слайд ${currentSlide} из ${totalSlides}`;
    if (currentSlide === totalSlides) {
        tg.MainButton.text = "Завершить презентацию";
        tg.MainButton.show();
    } else if (currentSlide === 1) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.show();
    }
}

// Инициализация презентации
function initPresentation() {
    // Инициализация Telegram MainButton
    tg.MainButton.text = `Слайд 1 из ${totalSlides}`;
    tg.MainButton.onClick(function() {
        if (currentSlide === totalSlides) {
            // Завершение презентации
            tg.close();
        } else {
            // Переход к следующему слайду
            if (currentSlide < totalSlides) {
                goToSlide(currentSlide + 1);
            }
        }
    });
    
    // Показываем первый слайд при инициализации
    if (currentSlide !== 1) {
        goToSlide(1);
    }
    
    // Отключаем свайпы для предотвращения скроллов
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
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

// Добавляем обработчик клавиш для навигации
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
            // Следующий слайд
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            // Предыдущий слайд
            prevSlide();
            break;
        case 'Home':
            // Первый слайд
            goToSlide(1);
            break;
        case 'End':
            // Последний слайд
            goToSlide(totalSlides);
            break;
    }
});

// Обработка событий Telegram WebApp
window.addEventListener('message', function(event) {
    if (event.data && event.data.eventType === 'viewportChanged') {
        // Обработка изменения размера окна
        console.log('Viewport changed:', event.data);
    }
});

// Обработка события закрытия приложения
tg.onEvent('viewportChanged', function() {
    // Обновление интерфейса при изменении размера окна
    console.log('Viewport size changed');
});

// Обработка события закрытия приложения
tg.onEvent('mainButtonClicked', function() {
    // Действие при нажатии на главную кнопку
    console.log('Main button clicked');
});

// Обработка события возврата в Telegram
window.addEventListener('beforeunload', function() {
    // Сохранение состояния или отправка данных перед закрытием
    console.log('App is closing');
}); 