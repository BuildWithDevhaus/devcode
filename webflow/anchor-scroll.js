function scrollToCenter(targetId) {
  var targetElement = document.querySelector(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }
}

document.querySelectorAll('[anchor-scroll]').forEach((element) => {
  element.addEventListener('click', (e) => {
    e.preventDefault();
    var targetId = element.getAttribute('anchor-scroll');
    scrollToCenter(targetId);
  });
});