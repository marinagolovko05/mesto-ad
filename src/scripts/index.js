import {
  fetchCurrentUser,
  fetchInitialCards,
  updateUserProfile,
  changeUserAvatar,
  createNewCard,
  removeCardFromServer,
  toggleLikeOnServer,
} from "./components/api.js";

import {
  createCardElement,
  removeCardElement,
  updateCardLikesView,
} from "./components/card.js";

import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";

import {
  clearValidation,
  enableValidation,
} from "./components/validation.js";

const placesList = document.querySelector(".places__list");

const editPopup = document.querySelector(".popup_type_edit");
const editForm = editPopup.querySelector(".popup__form");
const editNameInput = editForm.querySelector(".popup__input_type_name");
const editJobInput = editForm.querySelector(".popup__input_type_description");
const editSubmitBtn = editForm.querySelector(".popup__button");

const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = addCardPopup.querySelector(".popup__form");
const cardName = addCardForm.querySelector(".popup__input_type_card-name");
const cardLink = addCardForm.querySelector(".popup__input_type_url");
const addCardBtn = addCardForm.querySelector(".popup__button");

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

const editProfileBtn = document.querySelector(".profile__edit-button");
const addNewCardBtn = document.querySelector(".profile__add-button");

const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const profileAvatarImg = document.querySelector(".profile__image");

const avatarPopup = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarPopup.querySelector(".popup__form");
const avatarUrl = avatarForm.querySelector(".popup__input");
const avatarSubmitBtn = avatarForm.querySelector(".popup__button");

const deletePopup = document.querySelector(".popup_type_remove-card");
const deleteForm = deletePopup.querySelector(".popup__form");
const deleteConfirmBtn = deleteForm.querySelector(".popup__button");

const logoIcon = document.querySelector(".logo");
const infoPopup = document.querySelector(".popup_type_info");
const infoDefTemplate = document.querySelector("#popup-info-definition-template");
const infoListTemplate = document.querySelector("#popup-info-user-preview-template");
const infoDefContainer = infoPopup?.querySelector(".popup__info");
const infoPopupTitle = infoPopup?.querySelector(".popup__title");
const infoPopupText = infoPopup?.querySelector(".popup__text");
const infoListContainer = infoPopup?.querySelector(".popup__list");

let myUserId = null;
let cardForDelete = null;

const validationOptions = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const changeButtonText = (button, isLoading, defaultText, loadingText) => {
  button.textContent = isLoading ? loadingText : defaultText;
};

const setSubmitState = (button, isLoading, defaultText, loadingText) => {
  button.disabled = isLoading;
  changeButtonText(button, isLoading, defaultText, loadingText);
};

const openImagePreview = ({ name, link }) => {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModalWindow(imagePopup);
};

const handleEditProfileSubmit = (evt) => {
  evt.preventDefault();

  setSubmitState(editSubmitBtn, true, "Сохранить", "Сохранение...");

  updateUserProfile({
    name: editNameInput.value.trim(),
    about: editJobInput.value.trim(),
  })
    .then((user) => {
      profileName.textContent = user.name;
      profileJob.textContent = user.about;
      closeModalWindow(editPopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setSubmitState(editSubmitBtn, false, "Сохранить", "Сохранение...");
    });
};

const handleAvatarSubmit = (evt) => {
  evt.preventDefault();

  setSubmitState(avatarSubmitBtn, true, "Сохранить", "Сохранение...");

  changeUserAvatar(avatarUrl.value.trim())
    .then((user) => {
      profileAvatarImg.style.backgroundImage = `url(${user.avatar})`;
      closeModalWindow(avatarPopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setSubmitState(avatarSubmitBtn, false, "Сохранить", "Сохранение...");
    });
};

const handleAddCardSubmit = (evt) => {
  evt.preventDefault();

  setSubmitState(addCardBtn, true, "Создать", "Создание...");

  createNewCard({
    name: cardName.value.trim(),
    link: cardLink.value.trim(),
  })
    .then((newCard) => {
      placesList.prepend(
        createCardElement(newCard, myUserId, {
          onPreviewPicture: openImagePreview,
          onLike: handleLikeClick,
          onDelete: handleDeleteClick,
        })
      );
      closeModalWindow(addCardPopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setSubmitState(addCardBtn, false, "Создать", "Создание...");
    });
};

const handleLikeClick = (likeButton, cardId, isLiked) => {
  if (likeButton.disabled) return;

  likeButton.disabled = true;

  toggleLikeOnServer(cardId, isLiked)
    .then((updatedCard) => {
      updateCardLikesView(likeButton.closest(".card"), updatedCard.likes, myUserId);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      likeButton.disabled = false;
    });
};

const handleDeleteClick = (cardElement, cardId) => {
  cardForDelete = { cardElement, cardId };
  openModalWindow(deletePopup);
};

const handleDeleteConfirm = (evt) => {
  evt.preventDefault();

  if (!cardForDelete) return;

  setSubmitState(deleteConfirmBtn, true, "Да", "Удаление...");

  removeCardFromServer(cardForDelete.cardId)
    .then(() => {
      removeCardElement(cardForDelete.cardElement);
      closeModalWindow(deletePopup);
      cardForDelete = null;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setSubmitState(deleteConfirmBtn, false, "Да", "Удаление...");
    });
};

const renderAllCards = (cards) => {
  placesList.replaceChildren();

  cards.forEach((card) => {
    placesList.append(
      createCardElement(card, myUserId, {
        onPreviewPicture: openImagePreview,
        onLike: handleLikeClick,
        onDelete: handleDeleteClick,
      })
    );
  });
};

const renderUserInfo = (user) => {
  myUserId = user._id;
  profileName.textContent = user.name;
  profileJob.textContent = user.about;
  profileAvatarImg.style.backgroundImage = `url(${user.avatar})`;
};

const buildStats = (cards) => {
  if (!infoPopup || !infoDefContainer || !infoPopupTitle || !infoPopupText || !infoListContainer) return;
  if (!infoDefTemplate || !infoListTemplate) return;

  infoPopupTitle.textContent = "Статистика карточек";

  if (!cards.length) {
    infoDefContainer.replaceChildren();
    infoListContainer.replaceChildren();
    infoPopupText.textContent = "Популярные карточки:";

    const empty = infoDefTemplate.content.firstElementChild.cloneNode(true);
    empty.querySelector(".popup__info-term").textContent = "Нет данных";
    empty.querySelector(".popup__info-description").textContent = "Карточки не загружены";
    infoDefContainer.append(empty);
    return;
  }

  const owners = new Set();
  let totalLikes = 0;
  let topOwner = "—";
  let topLikesCount = 0;

  cards.forEach((card) => {
    if (card.owner?._id) {
      owners.add(card.owner._id);
    }

    const likesAmount = card.likes?.length ?? 0;
    totalLikes += likesAmount;

    if (likesAmount > topLikesCount) {
      topLikesCount = likesAmount;
      topOwner = `${card.owner?.name ?? "Без имени"} (${likesAmount})`;
    }
  });

  const topCards = [...cards]
    .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
    .slice(0, 12);

  infoPopupText.textContent = "Популярные карточки:";

  infoDefContainer.replaceChildren();
  const defFragment = document.createDocumentFragment();

  const statsData = [
    ["Всего пользователей", String(owners.size)],
    ["Всего лайков", String(totalLikes)],
    ["Максимально лайков от одного", String(topLikesCount)],
    ["Чемпион лайков", topOwner],
  ];

  statsData.forEach(([term, val]) => {
    const item = infoDefTemplate.content.firstElementChild.cloneNode(true);
    item.querySelector(".popup__info-term").textContent = term;
    item.querySelector(".popup__info-description").textContent = val;
    defFragment.append(item);
  });

  infoDefContainer.append(defFragment);

  infoListContainer.replaceChildren();
  const listFragment = document.createDocumentFragment();

  topCards.forEach((card) => {
    const item = infoListTemplate.content.firstElementChild.cloneNode(true);
    item.textContent = card.name;
    listFragment.append(item);
  });

  infoListContainer.append(listFragment);
};

const openStats = () => {
  if (!infoPopup) return;

  fetchInitialCards()
    .then((cards) => {
      buildStats(cards);
      openModalWindow(infoPopup);
    })
    .catch((err) => {
      console.error(err);
    });
};

editForm.addEventListener("submit", handleEditProfileSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteConfirm);

editProfileBtn.addEventListener("click", () => {
  editNameInput.value = profileName.textContent;
  editJobInput.value = profileJob.textContent;
  clearValidation(editForm, validationOptions);
  openModalWindow(editPopup);
});

profileAvatarImg.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationOptions);
  openModalWindow(avatarPopup);
});

addNewCardBtn.addEventListener("click", () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationOptions);
  openModalWindow(addCardPopup);
});

if (logoIcon) {
  logoIcon.addEventListener("click", openStats);
}

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationOptions);

Promise.all([fetchInitialCards(), fetchCurrentUser()])
  .then(([cards, user]) => {
    renderUserInfo(user);
    renderAllCards(cards);
  })
  .catch((err) => {
    console.error(err);
  });