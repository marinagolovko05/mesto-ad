const getCardTemplate = () => {
  const template = document.querySelector("#card-template");
  return template.content.querySelector(".card").cloneNode(true);
};

const isCardLikedByUser = (cardData, currentUserId) => {
  return Boolean(cardData.likes?.some((user) => user._id === currentUserId));
};

const isCardOwner = (cardData, currentUserId) => {
  return cardData.owner?._id === currentUserId;
};

export const createCardElement = (cardData, currentUserId, handlers) => {
  const cardElement = getCardTemplate();

  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  const cardId = cardData._id;

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;

  const owner = isCardOwner(cardData, currentUserId);
  if (!owner) {
    deleteButton.remove();
  }

  const likedByMe = isCardLikedByUser(cardData, currentUserId);

  if (likedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (likeCountElement) {
    likeCountElement.textContent = String(cardData.likes?.length ?? 0);
  }

  if (handlers?.onLike) {
    likeButton.addEventListener("click", () => {
      const isLiked = likeButton.classList.contains("card__like-button_is-active");
      handlers.onLike(likeButton, cardId, isLiked);
    });
  }

  if (handlers?.onDelete && owner) {
    deleteButton.addEventListener("click", () => {
      handlers.onDelete(cardElement, cardId);
    });
  }

  if (handlers?.onPreviewPicture) {
    cardImage.addEventListener("click", () => {
      handlers.onPreviewPicture({ name: cardData.name, link: cardData.link });
    });
  }

  return cardElement;
};

export const updateCardLikesView = (cardElement, likes, currentUserId) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  const isLikedByMe = Boolean(likes?.some((user) => user._id === currentUserId));

  if (isLikedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }

  if (likeCountElement) {
    likeCountElement.textContent = String(likes?.length ?? 0);
  }
};

export const removeCardElement = (cardElement) => {
  cardElement.remove();
};