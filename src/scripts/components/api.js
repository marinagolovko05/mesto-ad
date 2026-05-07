// Объект конфигурации для работы с API
const config = {
  // Базовый URL API сервера (путь к конкретной группе apf-cohort-203)
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-203",
  // Заголовки запросов, отправляемые на сервер
  headers: {
    // Токен авторизации для идентификации пользователя
    authorization: "aeea0d6a-6483-4c8c-a867-f40bffc427c8",
    // Указываем, что отправляем и получаем данные в формате JSON
    "Content-Type": "application/json",
  },
};

// Функция для обработки ответа от сервера
const getResponseData = (res) => {
  // Если ответ успешен (статус 200-299), преобразуем его в JSON
  // Иначе отклоняем промис с сообщением об ошибке и статусом
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

// Экспортируемая функция для получения данных о пользователе
export const getUserInfo = () => {
  // Отправляем GET запрос на эндпоинт users/me (текущий пользователь)
  return fetch(`${config.baseUrl}/users/me`, {
    // Передаем заголовки из конфига для авторизации
    headers: config.headers,
    // Обрабатываем ответ через вспомогательную функцию
  }).then(getResponseData);
};

// Экспортируемая функция для получения списка карточек
export const getCardList = () => {
  // Отправляем GET запрос на эндпоинт cards (все карточки)
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
};

// Экспортируемая функция для обновления информации о пользователе
export const setUserInfo = ({ name, about }) => {
  // Отправляем PATCH запрос (частичное обновление) на эндпоинт users/me
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH", // Метод для частичного обновления ресурса
    headers: config.headers,
    // Преобразуем объект с именем и описанием в JSON строку для отправки
    body: JSON.stringify({ name, about }),
  }).then(getResponseData);
};

// Экспортируемая функция для обновления аватара пользователя
export const setUserAvatar = (avatar) => {
  // Отправляем PATCH запрос на эндпоинт users/me/avatar (аватар пользователя)
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    // Преобразуем ссылку на аватар в JSON строку
    body: JSON.stringify({ avatar }),
  }).then(getResponseData);
};

// Экспортируемая функция для добавления новой карточки
export const addCard = ({ name, link }) => {
  // Отправляем POST запрос на эндпоинт cards (создание новой карточки)
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST", // Метод для создания нового ресурса
    headers: config.headers,
    // Преобразуем название карточки и ссылку на изображение в JSON
    body: JSON.stringify({ name, link }),
  }).then(getResponseData);
};

// Экспортируемая функция для удаления карточки по ID
export const deleteCardById = (cardId) => {
  // Отправляем DELETE запрос на эндпоинт cards/{id} (удаление конкретной карточки)
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE", // Метод для удаления ресурса
    headers: config.headers,
  }).then(getResponseData);
};

// Экспортируемая функция для изменения статуса лайка карточки
export const changeLikeCardStatus = (cardId, isLiked) => {
  // Отправляем запрос на эндпоинт cards/likes/{id} (управление лайками)
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    // Тернарный оператор: если лайк уже стоит (isLiked true), то удаляем (DELETE)
    // иначе ставим лайк (PUT)
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  }).then(getResponseData);
};