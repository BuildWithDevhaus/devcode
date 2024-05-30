const reviewRating = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const reviewContainers = document.querySelectorAll('[review-container]');
  
    reviewContainers.forEach(container => {
      const starWrapper = container.querySelector('.review_star-icon-wrapper');
      const reviewCount = container.querySelector('[review-count]');
      const reviewRating = container.querySelector('[review-rating]').textContent.trim();

      const emptyStar = starWrapper.querySelector('[review-star="empty"]').cloneNode(true);
      const fullStar = starWrapper.querySelector('[review-star="full"]').cloneNode(true);
      const halfStar = starWrapper.querySelector('[review-star="half"]').cloneNode(true);

      starWrapper.querySelectorAll('[review-star]').forEach(star => star.style.display = 'none');

      const rating = parseFloat(reviewRating);
      const totalStars = 5;
      let remainingRating = Math.round(rating * 10);

      for (let i = 0; i < totalStars; i++) {
        if (remainingRating >= 6) {
          starWrapper.appendChild(fullStar.cloneNode(true));
          remainingRating -= 10;
        } else if (remainingRating >= 1) {
          starWrapper.appendChild(halfStar.cloneNode(true));
          remainingRating -= 5;
        } else {
          starWrapper.appendChild(emptyStar.cloneNode(true));
        }
      }

      reviewCount.textContent = container.querySelector('[review-count]').textContent.trim();
    });
  });
}

reviewRating();