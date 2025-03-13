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
Swiper.use([Navigation]);

jQuery(document).ready(function($) {

    const categoriesData = {
        kitchens: [
            { img: 'img/pic-1.jpg', title: 'Снежная королева', subtitle: 'кухня', price: '999 ₽' },
            { img: 'img/pic-1.jpg', title: 'Современная кухня', subtitle: 'кухня', price: '1200 ₽' },
            { img: 'img/pic-1.jpg', title: 'Минималистская кухня', subtitle: 'кухня', price: '1050 ₽' },
            { img: 'img/pic-1.jpg', title: 'Стильная кухня', subtitle: 'кухня', price: '950 ₽' }
        ],
        wardrobes: [
            { img: 'img/pic-1.jpg', title: 'Гардероб 1', subtitle: 'гардеробная', price: '5000 ₽' },
            { img: 'img/pic-1.jpg', title: 'Гардероб 2', subtitle: 'гардеробная', price: '4500 ₽' },
            { img: 'img/pic-1.jpg', title: 'Гардероб 3', subtitle: 'гардеробная', price: '4000 ₽' },
            { img: 'img/pic-1.jpg', title: 'Гардероб 4', subtitle: 'гардеробная', price: '5500 ₽' }
        ],
        hallways: [
            { img: 'img/pic-1.jpg', title: 'Прихожая 1', subtitle: 'прихожая', price: '1500 ₽' },
            { img: 'img/pic-1.jpg', title: 'Прихожая 2', subtitle: 'прихожая', price: '2000 ₽' },
            { img: 'img/pic-1.jpg', title: 'Прихожая 3', subtitle: 'прихожая', price: '1700 ₽' },
            { img: 'img/pic-1.jpg', title: 'Прихожая 4', subtitle: 'прихожая', price: '1800 ₽' }
        ],
        wardrobesSliding: [
            { img: 'img/pic-1.jpg', title: 'Шкаф-купе 1', subtitle: 'шкаф-купе', price: '3000 ₽' },
            { img: 'img/pic-1.jpg', title: 'Шкаф-купе 2', subtitle: 'шкаф-купе', price: '3500 ₽' },
            { img: 'img/pic-1.jpg', title: 'Шкаф-купе 3', subtitle: 'шкаф-купе', price: '4000 ₽' },
            { img: 'img/pic-1.jpg', title: 'Шкаф-купе 4', subtitle: 'шкаф-купе', price: '4500 ₽' }
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
    initModal()

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
        event.preventDefault(); // Отменяем стандартное поведение ссылки
        const target = $(this).attr("href"); // Получаем ID секции
        $("html, body").animate({ scrollTop: $(target).offset().top }, 800); // Плавно скроллим
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