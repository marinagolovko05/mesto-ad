let activePopup = null;

const onEscapeKey = (evt) => {
  if (evt.key === "Escape" && activePopup) {
    closeModalWindow(activePopup);
  }
};

export const openModalWindow = (modalWindow) => {
  modalWindow.classList.add("popup_is-opened");
  activePopup = modalWindow;
  document.addEventListener("keydown", onEscapeKey);
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");

  if (activePopup === modalWindow) {
    activePopup = null;
  }

  document.removeEventListener("keydown", onEscapeKey);
};

export const setCloseModalWindowEventListeners = (modalWindow) => {
  const closeButton = modalWindow.querySelector(".popup__close");

  closeButton.addEventListener("click", () => {
    closeModalWindow(modalWindow);
  });

  modalWindow.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModalWindow(modalWindow);
    }
  });
};