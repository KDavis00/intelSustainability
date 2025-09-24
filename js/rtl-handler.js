// RTL language codes
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

// Function to apply RTL/LTR styles
function applyDirectionStyles(isRTL) {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.body.style.textAlign = isRTL ? 'right' : 'left';

    // Update Bootstrap classes for RTL/LTR
    const carousel = document.getElementById('intelCarousel');
    if (carousel) {
        if (isRTL) {
            carousel.classList.add('carousel-rtl');
        } else {
            carousel.classList.remove('carousel-rtl');
        }
    }

    // Update any text-start/text-end classes
    const textAlignElements = document.querySelectorAll('.text-start, .text-end');
    textAlignElements.forEach(element => {
        if (isRTL) {
            element.classList.replace('text-start', 'text-end');
        } else {
            element.classList.replace('text-end', 'text-start');
        }
    });
}

// Function to get the current language from Google Translate
function getCurrentLanguage() {
    const translateElement = document.querySelector('.goog-te-combo');
    return translateElement ? translateElement.value : 'en';
}

// Function to handle language changes
function handleLanguageChange() {
    const currentLang = getCurrentLanguage();
    const isRTL = rtlLanguages.includes(currentLang);
    applyDirectionStyles(isRTL);

    // Store language preference
    localStorage.setItem('preferredLanguage', currentLang);
}

// Initialize language handling
document.addEventListener('DOMContentLoaded', function() {
    // Set up MutationObserver to watch for Google Translate widget changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('goog-te-combo')) {
                handleLanguageChange();
            }
        });
    });

    // Wait for Google Translate to load
    const watchForTranslate = setInterval(function() {
        const translateElement = document.querySelector('.goog-te-combo');
        if (translateElement) {
            clearInterval(watchForTranslate);
            
            // Observe the translate element
            observer.observe(translateElement, {
                attributes: true,
                characterData: true,
                childList: true
            });

            // Initial direction setup
            const storedLang = localStorage.getItem('preferredLanguage');
            if (storedLang && rtlLanguages.includes(storedLang)) {
                // Wait for Google Translate to complete initialization
                setTimeout(() => {
                    translateElement.value = storedLang;
                    handleLanguageChange();
                }, 1000);
            }
        }
    }, 100);
});