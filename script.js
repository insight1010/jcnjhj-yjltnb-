// Переменные для управления слайдами
let currentSlide = 1;
const totalSlides = 9;

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

// Инициализация презентации
function initPresentation() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    
    // Обновление состояния кнопок
    function updateButtons() {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
        
        // Вибрация при переключении слайдов (если поддерживается)
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
        
        // Отправка данных в Telegram о текущем слайде
        tg.MainButton.text = `Слайд ${currentSlide + 1} из ${slides.length}`;
        if (currentSlide === slides.length - 1) {
            tg.MainButton.text = "Завершить презентацию";
            tg.MainButton.show();
        } else if (currentSlide === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }
    
    // Показать слайд
    function showSlide(index) {
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'flex';
        currentSlide = index;
        updateButtons();
    }
    
    // Обработчики событий для кнопок
    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    });
    
    // Обработчик для главной кнопки Telegram
    tg.MainButton.onClick(function() {
        if (currentSlide === slides.length - 1) {
            // Завершение презентации
            tg.close();
        } else {
            // Переход к следующему слайду
            if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
            }
        }
    });
    
    // Инициализация первого слайда
    showSlide(0);
    
    // Добавление поддержки свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Свайп влево - следующий слайд
            if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
            }
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Свайп вправо - предыдущий слайд
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        }
    }
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
    // Обработка нажатий клавиш только если презентация инициализирована
    if (typeof currentSlide !== 'undefined') {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                // Следующий слайд
                if (currentSlide < slides.length - 1) {
                    showSlide(currentSlide + 1);
                }
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                // Предыдущий слайд
                if (currentSlide > 0) {
                    showSlide(currentSlide - 1);
                }
                break;
            case 'Home':
                // Первый слайд
                showSlide(0);
                break;
            case 'End':
                // Последний слайд
                showSlide(slides.length - 1);
                break;
        }
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