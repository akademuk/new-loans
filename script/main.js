document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initDropdownMenu();
  initCreditRanges();
  initTabSwitching();
  initAccordion();
  initReviewsSlider();
  initNewsSlider();
  initSmoothScroll();
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

    a11y: true,
     on: {
            slideChange: function () {
                // Обновляем aria-label для текущего слайда
                const currentSlide = this.slides[this.activeIndex];
                const currentLabel = currentSlide.getAttribute('aria-label');
                this.el.setAttribute('aria-label', currentLabel);
            }
        }
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
    breakpoints: {
      1280: {
        spaceBetween: 24,
      }
    }
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


// Инициализация плавного скролла к якорям
function initSmoothScroll() {
  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // отключаем стандартный прыжок

      const targetId = this.getAttribute('href'); // получаем ID якоря
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Получаем смещение для фиксированной шапки
        const headerOffset = window.innerWidth >= 1280 ? 110 : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


document.addEventListener("DOMContentLoaded", function () {
	function setActiveBlock() {
		const blocks = document.querySelectorAll('.document');
		blocks.forEach(block => {
			block.classList.remove('active');
		});

		const radio1 = document.getElementById('radioDok');
		const radio2 = document.getElementById('radioDok2');

		if (radio1 && radio1.checked) {
			const document1 = document.getElementById('document1');
			if (document1) {
				document1.classList.add('active');
			}
		} else if (radio2 && radio2.checked) {
			const document2 = document.getElementById('document2');
			if (document2) {
				document2.classList.add('active');
			}
		}
	}

	const radioButtons = document.querySelectorAll('.form__checkbox');
	if (radioButtons.length > 0) {
		radioButtons.forEach(radio => {
			radio.addEventListener('change', setActiveBlock);
		});
	}

	setActiveBlock();
});

document.addEventListener("DOMContentLoaded", function () {
	function setActiveBlocks() {
		const blocks = document.querySelectorAll('.documents');
		blocks.forEach(block => {
			block.classList.remove('active');
		});

		const radio3 = document.getElementById('radioDok3');
		const radio4 = document.getElementById('radioDok4');

		if (radio3 && radio3.checked) {
			const document3 = document.getElementById('document3');
			if (document3) {
				document3.classList.add('active');
			}
		} else if (radio4 && radio4.checked) {
			const document4 = document.getElementById('document4');
			if (document4) {
				document4.classList.add('active');
			}
		}
	}

	const radioButtons = document.querySelectorAll('[name="indifacation"]');
	if (radioButtons.length > 0) {
		radioButtons.forEach(radio => {
			radio.addEventListener('change', setActiveBlocks);
		});
	}

	setActiveBlocks();
});



const addressDisableCheckbox = document.getElementById('addressDisable');
if (addressDisableCheckbox) {
	addressDisableCheckbox.addEventListener('change', function () {
		const formBoxDisable = document.querySelector('.form__box-disable');
		if (this.checked) {
			formBoxDisable.style.maxHeight = '600px';
		} else {
			formBoxDisable.style.maxHeight = '0';
		}
	});
}


const FULL_DASH_ARRAY = 283;
const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;

// DOM elements
let timer = document.querySelector("#base-timer-path-remaining");
let timeLabel = document.getElementById("base-timer-label");

// Time related vars
const TIME_LIMIT = 120; // in seconds
let timePassed = -1;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

// Условие, проверяющее, нужно ли запускать таймер
const shouldRunTimer = timer !== null && timeLabel !== null;

if (shouldRunTimer) {
	window.addEventListener("load", () => {
		timeLabel.innerHTML = formatTime(TIME_LIMIT);
		start(); // Auto-start the timer when the page loads
	});

	function start() {
		startTimer();
	}

	function startTimer() {
		timerInterval = setInterval(() => {
			timePassed = timePassed += 1;
			timeLeft = TIME_LIMIT - timePassed;
			timeLabel.innerHTML = formatTime(timeLeft);
			setCircleDasharray();

			if (timeLeft === 0) {
				clearInterval(timerInterval); // Stop the timer when it reaches 0
			}
		}, 1000);
	}

	//---------------------------------------------
	// HELPER METHODS
	//---------------------------------------------
	function formatTime(time) {
		const minutes = Math.floor(time / 60);
		let seconds = time % 60;

		if (seconds < 10) {
			seconds = `0${seconds}`;
		}

		return `${minutes}:${seconds}`;
	}

	function calculateTimeFraction() {
		const rawTimeFraction = timeLeft / TIME_LIMIT;
		return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
	}

	function setCircleDasharray() {
		const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
		timer.setAttribute("stroke-dasharray", circleDasharray);
	}
}


const openButtons = document.querySelectorAll('.open-popup');
const closeButtons = document.querySelectorAll('.close-popup');
const overlay = document.getElementById('popup-overlay');

if (openButtons.length > 0 && closeButtons.length > 0 && overlay) {
	function openPopup() {
		overlay.classList.add('show');
		document.body.classList.add('no-scroll');
	}

	function closePopup() {
		overlay.classList.remove('show');
		document.body.classList.remove('no-scroll');
	}

	openButtons.forEach(btn => {
		btn.addEventListener('click', openPopup);
	});

	closeButtons.forEach(btn => {
		btn.addEventListener('click', closePopup);
	});

	overlay.addEventListener('click', e => {
		if (e.target === overlay) closePopup();
	});
}

document.addEventListener('DOMContentLoaded', function () {
  const deleteButtons = document.querySelectorAll('.personal-account__form-card-delate');

  deleteButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const cardContainer = this.closest('.form__box-labels');
      if (cardContainer) {
        cardContainer.remove();
      }
    });
  });
});


$('input[type="tel"]').mask('+38(999) 999-99-99');







document.addEventListener("DOMContentLoaded", () => {
  initSwitcher();
});

function initSwitcher() {
  const switchButtons = document.querySelectorAll(".theme-toggle");
  const hero1Elements = document.querySelectorAll(".hero1");
  const hero2Elements = document.querySelectorAll(".hero2");
  const toggleTexts = document.querySelectorAll(".togle-text");
  const savedState = localStorage.getItem("heroState1"); // Уникальный ключ
  
  if (hero1Elements.length === 0 || hero2Elements.length === 0 || switchButtons.length === 0) {
    return;
  }
  
  let isShowingHero1 = savedState !== "second";
  
  function updateTextStates() {
    toggleTexts.forEach(textElement => {
      const text = textElement.textContent.trim();
      textElement.classList.remove("active");
      
      if ((text === "Hydria Perform" && isShowingHero1) || 
          (text === "Hydria Daily" && !isShowingHero1)) {
        textElement.classList.add("active");
      }
    });
  }
  
  function showHero1() {
    hero1Elements.forEach(el => {
      el.style.display = "block";
    });
    hero2Elements.forEach(el => {
      el.style.display = "none";
    });
    isShowingHero1 = true;
    updateTextStates();
  }
  
  function showHero2() {
    hero1Elements.forEach(el => {
      el.style.display = "none";
    });
    hero2Elements.forEach(el => {
      el.style.display = "block";
    });
    isShowingHero1 = false;
    updateTextStates();
  }
  
  function toggleHero() {
    if (isShowingHero1) {
      showHero2();
      localStorage.setItem("heroState1", "second"); // Уникальный ключ
    } else {
      showHero1();
      localStorage.setItem("heroState1", "first"); // Уникальный ключ
    }
  }
  
  function switchToHero(targetHero) {
    if (targetHero === "hero1" && !isShowingHero1) {
      showHero1();
      localStorage.setItem("heroState1", "first"); // Уникальный ключ
    } else if (targetHero === "hero2" && isShowingHero1) {
      showHero2();
      localStorage.setItem("heroState1", "second"); // Уникальный ключ
    }
  }
  
  if (savedState === "second") {
    showHero2();
  } else {
    showHero1();
  }
  
  switchButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      toggleHero();
    });
  });
  
  toggleTexts.forEach(textElement => {
    textElement.addEventListener("click", (event) => {
      event.preventDefault();
      const text = textElement.textContent.trim();
      
      if (text === "Hydria Perform") {
        switchToHero("hero1");
      } else if (text === "Hydria Daily") {
        switchToHero("hero2");
      }
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth <= 768) {
    initSwitcher2();
  }
});

function initSwitcher2() {
  const switchButtons2 = document.querySelectorAll(".theme-toggle2");
  const hero1Elements2 = document.querySelectorAll(".hero3");
  const hero2Elements2 = document.querySelectorAll(".hero4");
  const toggleTexts2 = document.querySelectorAll(".togle-text2");
  const savedState2 = localStorage.getItem("heroState2"); // Уникальный ключ
  
  if (hero1Elements2.length === 0 || hero2Elements2.length === 0 || switchButtons2.length === 0) {
    return;
  }
  
  let isShowingHero1 = savedState2 !== "second";
  
  function updateTextStates() {
    toggleTexts2.forEach(textElement => {
      const text = textElement.textContent.trim();
      textElement.classList.remove("active");
      
      if ((text === "Hydria Perform" && isShowingHero1) || 
          (text === "Hydria Daily" && !isShowingHero1)) {
        textElement.classList.add("active");
      }
    });
  }
  
  function showHero1() {
    hero1Elements2.forEach(el => {
      el.style.display = "block";
    });
    hero2Elements2.forEach(el => {
      el.style.display = "none";
    });
    isShowingHero1 = true;
    updateTextStates();
  }
  
  function showHero2() {
    hero1Elements2.forEach(el => {
      el.style.display = "none";
    });
    hero2Elements2.forEach(el => {
      el.style.display = "block";
    });
    isShowingHero1 = false;
    updateTextStates();
  }
  
  function toggleHero() {
    if (isShowingHero1) {
      showHero2();
      localStorage.setItem("heroState2", "second"); // Уникальный ключ
    } else {
      showHero1();
      localStorage.setItem("heroState2", "first"); // Уникальный ключ
    }
  }
  
  function switchToHero(targetHero) {
    if (targetHero === "hero3" && !isShowingHero1) {
      showHero1();
      localStorage.setItem("heroState2", "first"); // Уникальный ключ
    } else if (targetHero === "hero4" && isShowingHero1) {
      showHero2();
      localStorage.setItem("heroState2", "second"); // Уникальный ключ
    }
  }
  
  if (savedState2 === "second") {
    showHero2();
  } else {
    showHero1();
  }
  
  switchButtons2.forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      toggleHero();
    });
  });
  
  toggleTexts2.forEach(textElement => {
    textElement.addEventListener("click", (event) => {
      event.preventDefault();
      const text = textElement.textContent.trim();
      
      if (text === "Hydria Perform") {
        switchToHero("hero3");
      } else if (text === "Hydria Daily") {
        switchToHero("hero4");
      }
    });
  });
}

	
	
	document.addEventListener("DOMContentLoaded", () => {
		 if (window.innerWidth <= 768) {
     initSecondSwitcher();

  }
});

function initSecondSwitcher() {
  const switchButtons = document.querySelectorAll(".mode-toggle");
  const section1Elements = document.querySelectorAll(".section1");
  const section2Elements = document.querySelectorAll(".section2");
  const toggleLabels = document.querySelectorAll(".toggle-label");
  const savedMode = localStorage.getItem("sectionState"); // Уникальный ключ
  
  if (section1Elements.length === 0 || section2Elements.length === 0 || switchButtons.length === 0) {
    return;
  }
  
  let isShowingSection1 = savedMode !== "second";
  
  function updateLabelStates() {
    toggleLabels.forEach(labelElement => {
      const text = labelElement.textContent.trim();
      labelElement.classList.remove("active");
      
      if ((text === "Hydria Perform" && isShowingSection1) || 
          (text === "Hydria Daily" && !isShowingSection1)) {
        labelElement.classList.add("active");
      }
    });
  }
  
  function showSection1() {
    section1Elements.forEach(el => {
      el.style.display = "block";
    });
    section2Elements.forEach(el => {
      el.style.display = "none";
    });
    isShowingSection1 = true;
    updateLabelStates();
  }
  
  function showSection2() {
    section1Elements.forEach(el => {
      el.style.display = "none";
    });
    section2Elements.forEach(el => {
      el.style.display = "block";
    });
    isShowingSection1 = false;
    updateLabelStates();
  }
  
  function toggleSection() {
    if (isShowingSection1) {
      showSection2();
      localStorage.setItem("sectionState", "second"); // Уникальный ключ
    } else {
      showSection1();
      localStorage.setItem("sectionState", "first"); // Уникальный ключ
    }
  }
  
  function switchToSection(targetSection) {
    if (targetSection === "section1" && !isShowingSection1) {
      showSection1();
      localStorage.setItem("sectionState", "first"); // Уникальный ключ
    } else if (targetSection === "section2" && isShowingSection1) {
      showSection2();
      localStorage.setItem("sectionState", "second"); // Уникальный ключ
    }
  }
  
  if (savedMode === "second") {
    showSection2();
  } else {
    showSection1();
  }
  
  switchButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      toggleSection();
    });
  });
  
  toggleLabels.forEach(labelElement => {
    labelElement.addEventListener("click", (event) => {
      event.preventDefault();
      const text = labelElement.textContent.trim();
      
      if (text === "Hydria Perform") {
        switchToSection("section1");
      } else if (text === "Hydria Daily") {
        switchToSection("section2");
      }
    });
  });
}


// Простой и надежный скрипт для перезагрузки слайдеров при переключении блоков
document.addEventListener("DOMContentLoaded", () => {
  initSwiperReloader();
});

function initSwiperReloader() {
  
  // Функция для полной перезагрузки всех видимых слайдеров
  function reloadVisibleSwipers() {
    setTimeout(() => {
      // Находим все слайдеры
      const allSwipers = document.querySelectorAll('.swiper');
      
      allSwipers.forEach(swiperEl => {
        // Проверяем видимость элемента
        const isVisible = swiperEl.offsetParent !== null;
        
        if (isVisible && swiperEl.swiper) {
          const swiperInstance = swiperEl.swiper;
          const originalSettings = swiperInstance.params;
          
          // Уничтожаем старый инстанс
          swiperInstance.destroy(true, true);
          
          // Создаем новый инстанс с теми же настройками
          setTimeout(() => {
            new Swiper(swiperEl, originalSettings);
          }, 50);
        }
      });
    }, 200); // Даем время на переключение блоков
  }

  // Более агрессивный подход - слушаем все возможные события
  const switchSelectors = [
    '.theme-toggle',
    '.theme-toggle2', 
    '.togle-text',
    '.togle-text2'
  ];

  // Обработчик клика
  const handleClick = (event) => {
    const target = event.target;
    
    // Проверяем, что клик был по переключателю
    const isSwitch = switchSelectors.some(selector => 
      target.matches(selector) || target.closest(selector)
    );
    
    if (isSwitch) {
      console.log('Переключатель нажат, перезагружаем слайдеры...');
      reloadVisibleSwipers();
    }
  };

  // Добавляем слушатель на весь document
  document.addEventListener('click', handleClick, true);

  // Дополнительно - прямое подключение к элементам
  switchSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.addEventListener('click', () => {
        console.log('Прямой клик по переключателю, перезагружаем...');
        reloadVisibleSwipers();
      });
    });
  });

  // Отслеживаем изменения в localStorage как дополнительный триггер
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    
    if (key === 'heroState1' || key === 'heroState2') {
      console.log('LocalStorage изменен, перезагружаем слайдеры...');
      reloadVisibleSwipers();
    }
  };

  // Наблюдаем за изменениями display стилей hero блоков
  const observer = new MutationObserver((mutations) => {
    let shouldReload = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const target = mutation.target;
        
        if (target.classList.contains('hero1') || 
            target.classList.contains('hero2') || 
            target.classList.contains('hero3') || 
            target.classList.contains('hero4')) {
          shouldReload = true;
        }
      }
    });
    
    if (shouldReload) {
      console.log('Hero блок изменился, перезагружаем слайдеры...');
      reloadVisibleSwipers();
    }
  });

  // Подключаем observer ко всем hero блокам
  const heroBlocks = document.querySelectorAll('.hero1, .hero2, .hero3, .hero4');
  heroBlocks.forEach(block => {
    observer.observe(block, {
      attributes: true,
      attributeFilter: ['style']
    });
  });

  console.log('Swiper Reloader инициализирован');
}

// Глобальная функция для ручной перезагрузки
window.reloadSwipers = function() {
  console.log('Ручная перезагрузка слайдеров...');
  
  setTimeout(() => {
    const visibleSwipers = document.querySelectorAll('.swiper');
    
    visibleSwipers.forEach(swiperEl => {
      if (swiperEl.offsetParent !== null && swiperEl.swiper) {
        const swiperInstance = swiperEl.swiper;
        const originalSettings = swiperInstance.params;
        
        swiperInstance.destroy(true, true);
        
        setTimeout(() => {
          new Swiper(swiperEl, originalSettings);
        }, 50);
      }
    });
  }, 100);
};






















































