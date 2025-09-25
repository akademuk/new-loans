document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initDropdownMenu();
  initCreditRanges();
  initTabSwitching();
  initAccordion();
  initReviewsSlider();
  initNewsSlider();
});

// Инициализация мобильного бургер-меню
function initBurgerMenu() {
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__mobile-nav");
  const body = document.body;
  const overlay = document.querySelector(".menu-overlay");

  if (burger && menu && overlay) {
    function toggleMobileMenu() {
      menu.classList.toggle("open");
      burger.classList.toggle("open");

      const isMenuOpen = menu.classList.contains("open");
      menu.setAttribute("aria-hidden", !isMenuOpen);
      burger.setAttribute("aria-expanded", String(isMenuOpen));

      if (isMenuOpen) {
        overlay.classList.add("active");
        body.style.overflow = "hidden";
        body.classList.add("menu-open");
      } else {
        overlay.classList.remove("active");
        body.style.overflow = "";
        body.classList.remove("menu-open");
      }
    }

    burger.addEventListener("click", toggleMobileMenu);

    document.addEventListener("click", (event) => {
      if (
        !menu.contains(event.target) &&
        !burger.contains(event.target) &&
        menu.classList.contains("open")
      ) {
        toggleMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        toggleMobileMenu();
      }
    });
  }
}

// Инициализация выпадающих подменю в мобильной навигации
function initDropdownMenu() {
  const dropdownItems = document.querySelectorAll('.header__mobile-nav-item--dropdown');

  dropdownItems.forEach(item => {
    const link = item.querySelector('.header__mobile-nav-link');
    const dropdownMenu = item.querySelector('.header__mobile-nav-dropdown');

    if (link && dropdownMenu) {
      item.classList.add('has-dropdown');

      link.addEventListener('click', function(e) {
        e.preventDefault();

        const isExpanded = link.getAttribute('aria-expanded') === 'true'; 
        
        dropdownItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherLink = otherItem.querySelector('.header__mobile-nav-link');
            const otherDropdown = otherItem.querySelector('.header__mobile-nav-dropdown');
            if (otherLink && otherDropdown) {
              otherLink.setAttribute('aria-expanded', 'false');
              otherDropdown.classList.remove('open');
              otherItem.classList.remove('dropdown-open');
            }
          }
        });

        if (!isExpanded) {
          link.setAttribute('aria-expanded', 'true');
          dropdownMenu.classList.add('open');
          item.classList.add('dropdown-open');
        } else {
          link.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('open');
          item.classList.remove('dropdown-open');
        }
      });

      const dropdownLinks = dropdownMenu.querySelectorAll('a');
      dropdownLinks.forEach(dropdownLink => {
        dropdownLink.addEventListener('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
        });
      });
    }
  });
}

// Инициализация слайдеров для выбора суммы кредита
function initCreditRanges() {
  const ranges = document.querySelectorAll(".credit-form__range");
  
  if (ranges.length === 0) return;

  const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };

  const updateRangeBackground = (el) => {
    const min = parseInt(el.min) || 0;
    const max = parseInt(el.max) || 100;
    const val = parseInt(el.value);
    const percent = ((val - min) * 100) / (max - min);
    
    el.style.setProperty('background', `linear-gradient(to right, #ff6f00 ${percent}%, #F5F5F5 ${percent}%)`, 'important');
  };

  const inputField = document.querySelector('.credit-form__amount');
  let inputListenersAdded = false;

  ranges.forEach((range) => {
    range.step = "100";
    
    setTimeout(() => {
      updateRangeBackground(range);
    }, 0);
    
    if (inputField && !inputListenersAdded) {
      const updateFromInput = () => {
        const inputValue = parseInt(inputField.value.replace(/\D/g, ''));
        
        if (!isNaN(inputValue)) {
          ranges.forEach(r => {
            const min = parseInt(r.min) || 0;
            const max = parseInt(r.max) || 100;
            
            if (inputValue >= min && inputValue <= max) {
              const roundedValue = Math.round(inputValue / 100) * 100;
              r.value = roundedValue;
              updateRangeBackground(r);
            }
          });
        }
      };
      
      inputField.addEventListener('blur', updateFromInput);
      inputField.addEventListener('input', updateFromInput);
      inputListenersAdded = true;
    }
    
    const updateFromRange = () => {
      if (inputField) {
        inputField.value = range.value;
      }
      updateRangeBackground(range);
    };
    
    const throttledUpdate = throttle(updateFromRange, 16);
    range.addEventListener("input", throttledUpdate, { passive: true });
  });
}

// Инициализация переключения табов в форме заявки
function initTabSwitching() {
  document.querySelectorAll('.loan-application__tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.loan-application__tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.loan-application__tab-content').forEach(content => {
        if(content.id === targetTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

// Инициализация аккордеона с автозакрытием других элементов
function initAccordion() {
  const detailsElements = document.querySelectorAll('details');

  detailsElements.forEach(detail => {
    detail.addEventListener('click', function () {
      detailsElements.forEach(d => {
        if (d !== detail) {
          d.removeAttribute('open');
        }
      });
    });
  });
}

// Инициализация слайдера отзывов
function initReviewsSlider() {
  var swiper = new Swiper(".reviews__slider", {
    slidesPerView: 'auto',
    spaceBetween: 16,
    navigation: {
      nextEl: ".reviews__nav-button--next",
      prevEl: ".reviews__nav-button--prev",
    },
  });
}

function initNewsSlider() {
  var swiper = new Swiper(".news__slider", {
    slidesPerView: 'auto',
    spaceBetween: 16,
    navigation: {
      nextEl: ".news__nav-button--next",
      prevEl: ".news__nav-button--prev",
    },
  });
}

class Accordion {
  constructor(element, options = {}) {
    this.accordion = element;
    this.options = {
      allowMultiple: options.allowMultiple || false,
      animationDuration: options.animationDuration || 300,
      ...options
    };
    
    this.init();
  }

  init() {
    const headers = this.accordion.querySelectorAll('.faq__accordion-header');
    
    headers.forEach(header => {
      header.addEventListener('click', (e) => this.toggleItem(e));
      header.addEventListener('keydown', (e) => this.handleKeydown(e));
    });
  }

  toggleItem(e) {
    const header = e.currentTarget;
    const item = header.closest('.faq__accordion-item');
    const content = item.querySelector('.faq__accordion-content');
    const isOpen = header.getAttribute('aria-expanded') === 'true';

    // Закрыть другие элементы если не разрешено множественное открытие
    if (!this.options.allowMultiple && !isOpen) {
      this.closeAllItems();
    }

    if (isOpen) {
      this.closeItem(header, content);
    } else {
      this.openItem(header, content);
    }
  }

  openItem(header, content) {
    header.setAttribute('aria-expanded', 'true');
    
    // Получаем реальную высоту контента
    const body = content.querySelector('.faq__accordion-body');
    const height = body.scrollHeight;
    
    content.style.maxHeight = height + 'px';
    content.classList.add('open');
    
    // Убираем inline стиль после завершения анимации
    setTimeout(() => {
      if (content.classList.contains('open')) {
        content.style.maxHeight = 'none';
      }
    }, this.options.animationDuration);
  }

  closeItem(header, content) {
    header.setAttribute('aria-expanded', 'false');
    
    // Устанавливаем текущую высоту перед закрытием
    const height = content.scrollHeight;
    content.style.maxHeight = height + 'px';
    
    // Принудительный reflow
    content.offsetHeight;
    
    content.style.maxHeight = '0px';
    content.classList.remove('open');
    
    // Убираем inline стиль после завершения анимации
    setTimeout(() => {
      if (!content.classList.contains('open')) {
        content.style.maxHeight = '';
      }
    }, this.options.animationDuration);
  }

  closeAllItems() {
    const headers = this.accordion.querySelectorAll('.faq__accordion-header');
    headers.forEach(header => {
      if (header.getAttribute('aria-expanded') === 'true') {
        const item = header.closest('.faq__accordion-item');
        const content = item.querySelector('.faq__accordion-content');
        this.closeItem(header, content);
      }
    });
  }

  handleKeydown(e) {
    const { key } = e;
    
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this.toggleItem(e);
    }
  }

  // Публичные методы
  open(index) {
    const items = this.accordion.querySelectorAll('.faq__accordion-item');
    if (items[index]) {
      const header = items[index].querySelector('.faq__accordion-header');
      const content = items[index].querySelector('.faq__accordion-content');
      if (header.getAttribute('aria-expanded') === 'false') {
        this.openItem(header, content);
      }
    }
  }

  close(index) {
    const items = this.accordion.querySelectorAll('.faq__accordion-item');
    if (items[index]) {
      const header = items[index].querySelector('.faq__accordion-header');
      const content = items[index].querySelector('.faq__accordion-content');
      if (header.getAttribute('aria-expanded') === 'true') {
        this.closeItem(header, content);
      }
    }
  }

  closeAll() {
    this.closeAllItems();
  }
}

// Автоинициализация
document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.faq__accordion');
  accordions.forEach(accordion => {
    new Accordion(accordion);
  });
});

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Accordion;
}