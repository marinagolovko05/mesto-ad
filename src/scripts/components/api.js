const apiSettings = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-203",
  headers: {
    authorization: "aeea0d6a-6483-4c8c-a867-f40bffc427c8",
    "Content-Type": "application/json",
  },
};

const handleResponse = (response) => {
  if (!response.ok) {
    return Promise.reject(`Ошибка HTTP: ${response.status}`);
  }
  return response.json();
};

const request = (endpoint, options = {}) => {
  return fetch(`${apiSettings.baseUrl}${endpoint}`, {
    headers: apiSettings.headers,
    ...options,
  }).then(handleResponse);
};

export const fetchCurrentUser = () => {
  return request("/users/me");
};

export const fetchInitialCards = () => {
  return request("/cards");
};

export const updateUserProfile = ({ name, about }) => {
  return request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      name,
      about,
    }),
  });
};

export const changeUserAvatar = (avatar) => {
  return request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
};

export const createNewCard = ({ name, link }) => {
  return request("/cards", {
    method: "POST",
    body: JSON.stringify({
      name,
      link,
    }),
  });
};

export const removeCardFromServer = (cardId) => {
  return request(`/cards/${cardId}`, {
    method: "DELETE",
  });
};

export const toggleLikeOnServer = (cardId, isCurrentlyLiked) => {
  return request(`/cards/likes/${cardId}`, {
    method: isCurrentlyLiked ? "DELETE" : "PUT",
  });
};