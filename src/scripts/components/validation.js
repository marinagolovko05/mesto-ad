const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!errorElement) return;

  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!errorElement) return;

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
};

const setCustomNameError = (inputElement) => {
  inputElement.setCustomValidity("");

  const hasPattern = inputElement.hasAttribute("pattern");

  if (!hasPattern) return;

  if (inputElement.value.length > 0 && inputElement.value.trim().length === 0) {
    inputElement.setCustomValidity("Поле не может состоять только из пробелов.");
    return;
  }

  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(
      "Разрешены только латинские и кириллические буквы, дефис и пробел."
    );
  }
};

const checkInputValidity = (formElement, inputElement, config) => {
  setCustomNameError(inputElement);

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const disableSubmitButton = (buttonElement, config) => {
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
};

const enableSubmitButton = (buttonElement, config) => {
  buttonElement.classList.remove(config.inactiveButtonClass);
  buttonElement.disabled = false;
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, config);
  } else {
    enableSubmitButton(buttonElement, config);
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

export const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, config);
  });

  disableSubmitButton(buttonElement, config);
};

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });

    setEventListeners(formElement, config);
  });
};