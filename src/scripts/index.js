/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import {
  addCard,
  changeLikeCardStatus,
  deleteCardById,
  getCardList,
  getUserInfo,
  setUserAvatar,
  setUserInfo,
} from "./components/api.js";
import { createCardElement, removeCardElement, updateCardLikesView } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { clearValidation, enableValidation } from "./components/validation.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const profileSubmitButton = profileForm.querySelector(".popup__button");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardSubmitButton = cardForm.querySelector(".popup__button");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const avatarSubmitButton = avatarForm.querySelector(".popup__button");
const removeCardModalWindow = document.querySelector(".popup_type_remove-card");
const removeCardForm = removeCardModalWindow.querySelector(".popup__form");
const removeCardSubmitButton = removeCardForm.querySelector(".popup__button");

const logoElement = document.querySelector(".logo");
const infoModalWindow = document.querySelector(".popup_type_info");
const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template");
const infoUserPreviewTemplate = document.querySelector("#popup-info-user-preview-template");
const infoDefinitionList = infoModalWindow?.querySelector(".popup__info");
const infoTitle = infoModalWindow?.querySelector(".popup__title");
const infoText = infoModalWindow?.querySelector(".popup__text");
const infoList = infoModalWindow?.querySelector(".popup__list");

let currentUserId = null;
let cardToDelete = null;
let cardsState = [];

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const renderLoading = (buttonElement, isLoading, defaultText, loadingText) => {
  buttonElement.textContent = isLoading ? loadingText : defaultText;
};

const setFormPending = (formElement, isPending) => {
  const fields = formElement.querySelectorAll("input, textarea, button[type='submit']");
  fields.forEach((el) => {
    el.disabled = isPending;
  });
};

const syncFormValidationAfterPending = (formElement) => {
  formElement.querySelectorAll(".popup__input").forEach((inputElement) => {
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  renderLoading(profileSubmitButton, true, "Сохранить", "Сохранение...");
  setFormPending(profileForm, true);
  setUserInfo({
    name: profileTitleInput.value.trim(),
    about: profileDescriptionInput.value.trim(),
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setFormPending(profileForm, false);
      syncFormValidationAfterPending(profileForm);
      renderLoading(profileSubmitButton, false, "Сохранить", "Сохранение...");
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();

  renderLoading(avatarSubmitButton, true, "Сохранить", "Сохранение...");
  setFormPending(avatarForm, true);
  setUserAvatar(avatarInput.value.trim())
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setFormPending(avatarForm, false);
      syncFormValidationAfterPending(avatarForm);
      renderLoading(avatarSubmitButton, false, "Сохранить", "Сохранение...");
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  renderLoading(cardSubmitButton, true, "Создать", "Создание...");
  setFormPending(cardForm, true);
  addCard({
    name: cardNameInput.value.trim(),
    link: cardLinkInput.value.trim(),
  })
    .then((cardData) => {
      cardsState = [cardData, ...cardsState];
      placesWrap.prepend(
        createCardElement(cardData, currentUserId, {
          onPreviewPicture: handlePreviewPicture,
          onLike: handleLikeCard,
          onDelete: handleDeleteCard,
        })
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setFormPending(cardForm, false);
      syncFormValidationAfterPending(cardForm);
      renderLoading(cardSubmitButton, false, "Создать", "Создание...");
    });
};

const handleLikeCard = (likeButton, cardElement) => {
  if (likeButton.disabled) return;

  const cardId = cardElement.dataset.cardId;
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  likeButton.disabled = true;
  likeButton.classList.add("card__like-button_pending");

  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      cardsState = cardsState.map((card) => (card._id === updatedCard._id ? updatedCard : card));
      updateCardLikesView(cardElement, updatedCard.likes, currentUserId);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      likeButton.classList.remove("card__like-button_pending");
      likeButton.disabled = false;
    });
};

const handleDeleteCard = (cardElement) => {
  cardToDelete = cardElement;
  openModalWindow(removeCardModalWindow);
};

const handleDeleteCardConfirmSubmit = (evt) => {
  evt.preventDefault();
  if (!cardToDelete) return;

  const cardId = cardToDelete.dataset.cardId;
  renderLoading(removeCardSubmitButton, true, "Да", "Удаление...");
  removeCardSubmitButton.disabled = true;

  deleteCardById(cardId)
    .then(() => {
      cardsState = cardsState.filter((card) => card._id !== cardId);
      removeCardElement(cardToDelete);
      closeModalWindow(removeCardModalWindow);
      cardToDelete = null;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(removeCardSubmitButton, false, "Да", "Удаление...");
      removeCardSubmitButton.disabled = false;
    });
};

const renderCards = (cards) => {
  cardsState = [...cards];
  placesWrap.replaceChildren();
  cards.forEach((cardData) => {
    placesWrap.append(
      createCardElement(cardData, currentUserId, {
        onPreviewPicture: handlePreviewPicture,
        onLike: handleLikeCard,
        onDelete: handleDeleteCard,
      })
    );
  });
};

const renderUser = (userData) => {
  currentUserId = userData._id;
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
};

const renderCardsStats = (cards) => {
  if (!infoModalWindow || !infoDefinitionList || !infoTitle || !infoText || !infoList) return;
  if (!infoDefinitionTemplate || !infoUserPreviewTemplate) return;

  infoTitle.textContent = "Статистика карточек";

  if (!cards.length) {
    infoDefinitionList.replaceChildren();
    infoList.replaceChildren();
    infoText.textContent = "Популярные карточки:";
    const emptyItem = infoDefinitionTemplate.content.firstElementChild.cloneNode(true);
    emptyItem.querySelector(".popup__info-term").textContent = "Нет данных";
    emptyItem.querySelector(".popup__info-description").textContent = "Карточки не загружены";
    infoDefinitionList.append(emptyItem);
    return;
  }

  const uniqueOwners = new Set();
  let totalLikes = 0;
  let likesChampionName = "—";
  let likesChampionValue = 0;

  cards.forEach((card) => {
    if (card.owner?._id) {
      uniqueOwners.add(card.owner._id);
    }

    const likesCount = card.likes?.length ?? 0;
    totalLikes += likesCount;

    if (likesCount > likesChampionValue) {
      likesChampionValue = likesCount;
      likesChampionName = `${card.owner?.name ?? "Без имени"} (${likesCount})`;
    }
  });

  const topLikedCards = [...cards]
    .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
    .slice(0, 12);

  infoText.textContent = "Популярные карточки:";

  infoDefinitionList.replaceChildren();
  const definitionFragment = document.createDocumentFragment();
  const definitions = [
    ["Всего пользователей", String(uniqueOwners.size)],
    ["Всего лайков", String(totalLikes)],
    ["Максимально лайков от одного", String(likesChampionValue)],
    ["Чемпион лайков", likesChampionName],
  ];

  definitions.forEach(([term, value]) => {
    const item = infoDefinitionTemplate.content.firstElementChild.cloneNode(true);
    item.querySelector(".popup__info-term").textContent = term;
    item.querySelector(".popup__info-description").textContent = value;
    definitionFragment.append(item);
  });

  infoDefinitionList.append(definitionFragment);

  infoList.replaceChildren();
  const listFragment = document.createDocumentFragment();
  topLikedCards.forEach((card) => {
    const item = infoUserPreviewTemplate.content.firstElementChild.cloneNode(true);
    item.textContent = card.name;
    listFragment.append(item);
  });
  infoList.append(listFragment);
};

const handleInfoOpen = () => {
  if (!infoModalWindow) return;

  // Показываем статистику сразу по текущим данным на странице.
  renderCardsStats(cardsState);
  openModalWindow(infoModalWindow);

  // Пытаемся подтянуть более свежие данные с сервера.
  getCardList()
    .then((cards) => {
      cardsState = [...cards];
      renderCardsStats(cardsState);
    })
    .catch((err) => {
      console.log(err);
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);
removeCardForm.addEventListener("submit", handleDeleteCardConfirmSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModalWindow(cardFormModalWindow);
});

if (logoElement) {
  logoElement.addEventListener("click", handleInfoOpen);
}

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationConfig);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    renderUser(userData);
    renderCards(cards);
  })
  .catch((err) => {
    console.log(err);
  });
