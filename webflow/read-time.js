const container = document.querySelectorAll('[read-time-container]');

container.forEach((item) => {
  const content = item.querySelector('[read-time-content]');
  const duration = item.querySelector('[read-time-duration]');
  const wordsPerMinute = 200;

  const text = content.textContent;
  const wordCount = text.split(/\s/g).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  duration.textContent = readTime;
});