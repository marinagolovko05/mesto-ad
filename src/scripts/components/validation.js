// src/scripts/components/validation.js

// показать ошибку под инпутом
export const showInputError = (form, input, settings) => {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.add(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = input.validationMessage;
    errorElement.classList.add(settings.errorClass);
  }
};

// скрыть ошибку под инпутом
export const hideInputError = (form, input, settings) => {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.remove(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove(settings.errorClass);
  }
};

// проверка валидности конкретного инпута
export const checkInputValidity = (form, input, settings) => {
  if (!input.validity.valid) {
    showInputError(form, input, settings);
  } else {
    hideInputError(form, input, settings);
  }
};

// есть ли хотя бы один невалидный инпут в форме
export const hasInvalidInput = (inputs) => {
  return inputs.some(input => !input.validity.valid);
};

// заблокировать кнопку сабмита
export const disableSubmitButton = (button, settings) => {
  button.disabled = true;
  button.classList.add(settings.inactiveButtonClass);
};

// разблокировать кнопку сабмита
export const enableSubmitButton = (button, settings) => {
  button.disabled = false;
  button.classList.remove(settings.inactiveButtonClass);
};

// включение или отключение кнопки в зависимости от валидности полей
export const toggleButtonState = (inputs, button, settings) => {
  if (hasInvalidInput(inputs)) {
    disableSubmitButton(button, settings);
  } else {
    enableSubmitButton(button, settings);
  }
};

// добавление слушателей для всех полей формы
export const setEventListeners = (form, settings) => {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputs, button, settings);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });
};

// очистка ошибок и блокировка кнопки
export const clearValidation = (form, settings) => {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  inputs.forEach(input => hideInputError(form, input, settings));
  disableSubmitButton(button, settings);
};

// включение валидации для всех форм на странице
export const enableValidation = (settings) => {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach(form => setEventListeners(form, settings));
};