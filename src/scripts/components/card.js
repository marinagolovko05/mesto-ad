const getCardTemplate = () => {
  const template = document.querySelector("#card-template");
  return template.content.querySelector(".card").cloneNode(true);
};

export const isCardLiked = (likeButton) =>
  likeButton.classList.contains("card__like-button_is-active");

export const createCardElement = (cardData, currentUserId, handlers) => {
  const cardElement = getCardTemplate();

  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardId = cardData._id;

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  const isOwner = cardData.owner?._id === currentUserId;
  if (!isOwner) {
    deleteButton.remove();
  }

  const isLikedByMe = Boolean(cardData.likes?.some((user) => user._id === currentUserId));
  if (isLikedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (likeCountElement) {
    likeCountElement.textContent = String(cardData.likes?.length ?? 0);
  }

  if (handlers?.onLike) {
    likeButton.addEventListener("click", () =>
      handlers.onLike({
        cardId,
        cardElement,
        likeButton,
      })
    );
  }

  if (handlers?.onDelete && isOwner) {
    deleteButton.addEventListener("click", () =>
      handlers.onDelete({
        cardId,
        cardElement,
      })
    );
  }

  if (handlers?.onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      handlers.onPreviewPicture({
        name: cardData.name,
        link: cardData.link,
      })
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