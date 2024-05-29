const container = document.querySelectorAll('[read-time-container]');

container.forEach((item) => {
  const content = item.querySelector('[read-time-content]');
  const duration = item.querySelector('[read-time-duration]');
  const wordsPerMinute = item.getAttribute('read-time-words-per-minute') || 200;
  const secondsPerImage = item.getAttribute('read-time-seconds-per-image') || 5;

  const clonedContent = content.cloneNode(true);
  clonedContent.querySelectorAll('script, style, iframe, embed, object').forEach((el) => el.remove());

  const text = clonedContent.textContent.trim();
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  const imageCount = content.querySelectorAll('img').length;

  const readTime = Math.ceil(((wordCount / wordsPerMinute) * 60 + (imageCount * secondsPerImage)) / 60);
  duration.textContent = readTime > 1 ? `${readTime} mins` : `${readTime} min`;
});