const container = document.querySelectorAll('[read-time-container]');

container.forEach((item) => {
  const content = item.querySelector('[read-time-content]');
  const duration = item.querySelector('[read-time-duration]');
  const wordsPerMinute = item.getAttribute('read-time-words-per-minute') || 200;
  const secondsPerImage = item.getAttribute('read-time-seconds-per-image') || 5;

  const text = content.textContent;
  const wordCount = text.split(/\s/g).length;
  const imageCount = content.querySelectorAll('img').length;
  const readTime = Math.ceil(((wordCount / wordsPerMinute) * 60 + (imageCount * secondsPerImage)) / 60);
  duration.textContent = readTime > 1 ? `${readTime} mins` : `${readTime} min`;
});