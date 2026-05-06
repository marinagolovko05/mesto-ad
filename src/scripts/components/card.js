const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  cardData,
  currentUserId,
  { onPreviewPicture, onLike, onDelete }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;

  const isOwner = cardData.owner?._id === currentUserId;
  if (!isOwner) {
    deleteButton.remove();
  }

  cardElement.dataset.cardId = cardData._id;

  const isLikedByMe = Boolean(cardData.likes?.some((user) => user._id === currentUserId));
  if (isLikedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  }
  if (likeCountElement) {
    likeCountElement.textContent = String(cardData.likes?.length ?? 0);
  }

  if (onLike) {
    likeButton.addEventListener("click", () => onLike(likeButton, cardElement));
  }

  if (onDelete && isOwner) {
    deleteButton.addEventListener("click", () => onDelete(cardElement));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: cardData.name, link: cardData.link })
    );
  }

  return cardElement;
};

export const updateCardLikesView = (cardElement, likes, currentUserId) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  const isLikedByMe = Boolean(likes?.some((user) => user._id === currentUserId));
  likeButton.classList.toggle("card__like-button_is-active", isLikedByMe);

  if (likeCountElement) {
    likeCountElement.textContent = String(likes?.length ?? 0);
  }
};

export const removeCardElement = (cardElement) => {
  cardElement.remove();
};
