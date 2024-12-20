export const toggleVisibility = (triggerSelector, targetSelector) => {
  const trigger = document.querySelector(triggerSelector);
  const target = document.querySelector(targetSelector);

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    target.classList.toggle('hidden');
  });
};

export const closeModal = (modalSelector) => {
  document.querySelectorAll('.cancel').forEach((button) => {
    button.addEventListener('click', (e) => {
      const modal = e.target.closest(modalSelector);
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  });
};

export const closeDiv = (targetSelector) => {
  const target = document.querySelector(targetSelector);

  target.addEventListener('click', (e) => {
    e.preventDefault();
    target.classList.add('hidden');
  });
};
