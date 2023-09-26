import './scss/base.scss';
import './scss/fonts.scss';
import validate from 'jquery-validation/dist/jquery.validate.js';
import mask from 'jquery-mask-plugin';


jQuery(document).ready(function($) {
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
//валидация формы
    $("form").validate({
        rules: {
            username: {
                required: true,
                minlength: 3
            },
            phone: {
                required: true,
            },
            agreement: {
                required: true
            },
        },
        errorClass: "error fail-alert",
        validClass: "valid success-alert",
        errorLabelContainer: ".err-container",
        errorElement: "span",
        messages : {
            username: {
                required: "Пожалуйста, введите свое имя",
                minlength: "Имя должно содержать не менее 3 символов"
            },
            phone: {
                required: "Пожалуйста, введите номер телефона",
            },
            agreement: {
                required: "Пожалуйста, подтвердите согласие на обработку ваших персональный данных",
            },
        }
    });

//маска
    $('.js-phone').mask('+7 (000) 000-00-00', {placeholder: '+7(___) ___-__-__'});

    function initModal() {
        $(document).on('click', '.js-open-modal', function() {
            const $btn = $(this);
            const modalId = $btn.data('src');
            const openedModal = new MyModal($(`${modalId}`), $btn);
            openedModal.init();
        });
    }

    function ajaxForm() {
        $(document).on('submit', '.js-checkout', function(e) {
            e.preventDefault();
            const $form = $(this);
            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: '',
                dataType: 'json',
                success: function(response) {
                    if(response) {
                        if(response.success) {
                            $form.trigger('reset');
                            const $modalThanks = new MyModal($('#modal-success'), $(document));
                            $modalThanks.init();
                        } else if(response.errors) {
                            // initNotification(response.errors.join('. '), 'error', true, true, 5000);
                        }
                    }
                }
            });
        });
    }
    ajaxForm();

    // $(document).on('click', '.js-checkout', function(e) {
    //     const $form = $(this).closest('.js-form');
    //     $form.trigger('submit');
    //     // const $modalThanks = new MyModal($('#modal-success'), $(document));
    //     // $modalThanks.init();
    // });
})