import './scss/base.scss';
import './scss/fonts.scss';
import validate from 'jquery-validation/dist/jquery.validate.js';
import mask from 'jquery-mask-plugin';
import $ from "jquery";
import "jquery-validation";
import Swiper from 'swiper';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
Swiper.use([Navigation, Pagination]);

jQuery(document).ready(function($) {

    // Данные для попапа проектов: слайды (картинки) по индексу проекта
    const projectsSlides = {
        1: [
            require('./img/catalog/garderob/garderob-1.jpg'),
            require('./img/catalog/garderob/garderob-1.jpg'),
            require('./img/catalog/garderob/garderob-1.jpg'),
            require('./img/catalog/garderob/garderob-1.jpg'),
        ],
        2: [
            require('./img/catalog/kitchen/kitchen-1.jpg'),
            require('./img/catalog/kitchen/kitchen-2.jpg'),
        ],
        3: [
            require('./img/catalog/wardrobe/wardrope-1.jpg'),
            require('./img/catalog/wardrobe/wardrope-2.jpg'),
            require('./img/catalog/wardrobe/wardrope-3.jpg'),
            require('./img/catalog/wardrobe/wardrope-4.jpg'),
            require('./img/catalog/wardrobe/wardrope-5.jpg'),

        ],
        4: [
            require('./img/catalog/other/other-1.jpg'),
            require('./img/catalog/other/other-2.jpg'),
            require('./img/catalog/other/other-3.jpg'),
            require('./img/catalog/other/other-4.jpg'),
        ]
    };

    class MyModal {
        constructor($modal, $btn) {
            this._modal = typeof ($modal) === 'string' ? $($modal) : $modal;
            this._closeModal = this._modal.find('.js-close-modal');
            this._body = $('body');
            this._dynamicContent = this._modal.find('.js-modal-dynamic-content');
            this._btn = $btn;

            this._openModal = this._openModal.bind(this);
            this.close = this.close.bind(this);
        }

        init() {
            if(this._modal.length) {
                this._openModal();

                this._closeModal.on('click', this.close);
            }
        }

        _fillDynamicContent() {
            if(!this._dynamicContent.length) {
                return;
            }

            const insertContent = (dataAttr, isVal = false) => {
                if (!isVal) {
                    this._modal.find(`.js-modal-dynamic-content[${dataAttr}]`).text(this._btn.data(`${dataAttr.slice(5)}`));
                } else {
                    this._modal.find(`.js-modal-dynamic-content[${dataAttr}]`).val(this._btn.data(`${dataAttr.slice(5)}`));
                }
            }

            insertContent('data-selected-title');
            insertContent('data-value', true);
        }

        close() {
            $('#imageOverlay').removeClass('active');
            this._modal.removeClass('active');
            this._body.css('overflow', '');
            this._modal.trigger('afterClose');
        }

        _openModal() {
            this._modal.trigger('beforeOpen');
            this._fillDynamicContent();
            this._modal.addClass('active');
            this._body.css('overflow', 'hidden');
        }
    }

//валидация форм
    $("form").each(function() {
        $(this).validate({
            rules: {
                username: {
                    required: true,
                    minlength: 3
                },
                phone: {
                    required: true,
                },
                mail: {
                    required: true
                },
            },
            errorClass: "error fail-alert",
            validClass: "valid success-alert",
            errorLabelContainer: $(this).find(".err-container"), // Привязываем контейнер ошибок к текущей форме
            errorElement: "span",
            messages: {
                username: {
                    required: "Пожалуйста, введите свое имя",
                    minlength: "Имя должно содержать не менее 3 символов"
                },
                phone: {
                    required: "Пожалуйста, введите номер телефона",
                },

                mail: {
                    required: "Пожалуйста, введите свой эл. адрес",
                },
            }
        });
    });

    let swiperInstance = null;
    let currentSlideTitle = ''

    function updateModalContent(category) {
        const categoryData = categoriesData[category];
        Swiper.use([Navigation]);
        if (!categoryData) return;

        const modalContent = $('.js-modal-dynamic-content'); // Этот контейнер будет изменяться
        modalContent.empty(); // Очищаем старое содержимое

        categoryData.forEach(item => {
            const slide = `
            <div class="swiper-slide">
                <div class="modal__list-item">
                    <div class="modal__list-pic">
                        <img src="${item.img}" alt="${item.title}">
                    </div>
                    <div class="modal__list-title">${item.title}</div>
                    <div class="modal__list-subtitle">${item.subtitle}</div>
                    <div class="modal__list-price"><span>${item.price}</span></div>
                </div>
            </div>
        `;
            modalContent.append(slide);
        });

        if (swiperInstance) {
            swiperInstance.destroy(true, true); // Дестроим слайдер
        }

        // После добавления нового контента, инициализируем новый слайдер
        swiperInstance = new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        swiperInstance.on('slideChange', () => {
            const currentSlide = swiperInstance.slides[swiperInstance.activeIndex];
            currentSlideTitle = $(currentSlide).find('.modal__list-title').text();
        });
    }

    function initModal() {
        $(document).on('click', '.js-open-modal', function() {
            const $btn = $(this);
            const modalId = $btn.data('src');
            const category = $btn.data('category');
            const openedModal = new MyModal($(`${modalId}`), $btn);
            openedModal.init();

            updateModalContent(category);

            setTimeout(() => {
                if (!swiperInstance) {
                    swiperInstance = new Swiper('.swiper', {
                        slidesPerView: 1,
                        spaceBetween: 20,
                        loop: true,
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    });
                } else {
                    swiperInstance.update(); // Если слайдер уже есть, обновляем его
                }
            }, 300); // Даем время модалке открыться
        });
    }
    initModal();

    // Попап проектов: открытие по клику на projects__list-item, Swiper внутри
    let projectsSwiperInstance = null;
    const $modalProjects = $('#modal-projects');
    const $projectsTitle = $('.js-projects-modal-title');
    const $projectsSwiperWrapper = $('.js-projects-swiper-wrapper');

    function openProjectsModal($item) {
        const title = $item.data('title') || '';
        const index = parseInt($item.data('index'), 10) || 1;
        const images = projectsSlides[index] || projectsSlides[1];

        $projectsTitle.text(title);
        $projectsSwiperWrapper.empty();
        images.forEach(function(src) {
            $projectsSwiperWrapper.append(
                '<div class="swiper-slide"><img src="' + src + '" alt=""></div>'
            );
        });

        if (projectsSwiperInstance) {
            projectsSwiperInstance.destroy(true, true);
            projectsSwiperInstance = null;
        }

        $modalProjects.addClass('active');
        $('body').css('overflow', 'hidden');
        $modalProjects.find('.js-close-modal').off('click').on('click', closeProjectsModal);

        setTimeout(function() {
            projectsSwiperInstance = new Swiper('.swiper--projects', {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                pagination: {
                    el: '.modal-projects__pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next--projects',
                    prevEl: '.swiper-button-prev--projects'
                }
            });
        }, 50);
    }

    function closeProjectsModal() {
        $modalProjects.removeClass('active');
        $('body').css('overflow', '');
        if (projectsSwiperInstance) {
            projectsSwiperInstance.destroy(true, true);
            projectsSwiperInstance = null;
        }
    }

    $(document).on('click', '.js-open-projects-modal', function(e) {
        e.preventDefault();
        openProjectsModal($(this));
    });

    // Добавляем обработчик для закрытия модалки и прокрутки страницы
    $(document).on('click', '.js-order', function() {
        const $modal = $(this).closest('.modal'); // Находим ближайшую модалку
        const $commentField = $('#comment'); // Поле комментария (например, с id "comment")

        // Прокручиваем страницу к первому блоку с формой
        $('html, body').animate({
            scrollTop: $commentField.offset().top - 500 // Прокручиваем немного выше поля
        }, 500);

        // Заполняем поле комментария текстом из текущего слайда
        if ($commentField.length) {
            $commentField.val(currentSlideTitle);
        }

        // Закрываем модалку
        $modal.removeClass('active');

        const $form = $('#main-form');
        if ($form.length) {
            $form.submit(); // Триггерим отправку формы
        }
    });

    $(".header-nav a").on("click", function(event) {
        const href = $(this).attr("href");
        if (!href || href.charAt(0) !== "#") return;
        event.preventDefault();
        const $target = $(href);
        if (!$target.length) return;
        const headerHeight = $(".header").outerHeight() || 0;
        const scrollTo = Math.max(0, $target.offset().top - headerHeight);
        $("html, body").animate({ scrollTop: scrollTo }, 600);
    });

    $(document).on('submit', '.js-checkout', function (e) {
        e.preventDefault(); // Останавливаем стандартную отправку формы

        const $form = $(this);
        const formData = $form.serialize(); // Собираем данные формы

        $.ajax({
            type: "POST",
            url: $form.attr("action"), // Берём URL из атрибута action
            data: formData,
            success: function () {
                const $modalThanks = new MyModal($('#modal-success'), $(document));
                $modalThanks.init(); // Показываем модалку "Спасибо"
                $form.trigger('reset'); // Очищаем форму
            },
            error: function () {
                alert("Ошибка при отправке формы. Попробуйте ещё раз.");
            }
        });
    });

    //маска
    $('.js-phone').mask('+7 (000) 000-00-00', {placeholder: 'Ваш телефон'});

    $(document).on('click', '.modal__list-pic img', function() {
        const imgSrc = $(this).attr('src');
        $('#imageOverlay img').attr('src', imgSrc);
        $('#imageOverlay').addClass('active');
    });

// Закрываем при клике на затемненный фон
    $('#imageOverlay').on('click', function() {
        $(this).removeClass('active');
    });
})