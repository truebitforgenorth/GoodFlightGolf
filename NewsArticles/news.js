//what in here?
//News api

document.addEventListener('DOMContentLoaded', () => {
  const pgaNewsContainer = document.getElementById('pga-news');

  const apiKey = 'a1caf8725d194029aeb578342d287a1b';
  const url = `https://newsapi.org/v2/everything?q=pgatour OR golf&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;

  function displayError(message) {
    pgaNewsContainer.innerHTML = `<div class="col-12 text-center text-danger">${message}</div>`;
  }

  fetch(url)
    .then(response => {
      console.log('Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.articles || data.articles.length === 0) {
        displayError('No PGA news articles found.');
        return;
      }

      pgaNewsContainer.innerHTML = ''; // Clear loading text

      data.articles.forEach(article => {
        const articleHtml = `
          <div class="col-md-6 col-lg-4">
            <div class="card h-100">
              <img src="${article.urlToImage || 'photos/GFGlogo.png'}" class="card-img-top" alt="News image" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description || ''}</p>
                <a href="${article.url}" target="_blank" class="mt-auto btn btn-primary">Read More</a>
              </div>
              <div class="card-footer text-muted">
                ${new Date(article.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        `;
        pgaNewsContainer.insertAdjacentHTML('beforeend', articleHtml);
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
      displayError('Failed to load PGA news. Please try again later.');
    });
});

//ARTICLELIST scroll
      (function () {
        function setArticlesScroll() {
          const leftCard = document.querySelector('.row > .col-md-6:first-child .card');
          const rightCard = document.querySelector('#articles .card');
          const rightCardBody = document.querySelector('#articles .card-body');
          if (!leftCard || !rightCard || !rightCardBody) return;

          // Total height of left card
          const leftH = leftCard.getBoundingClientRect().height;

          // Heights of right card header/footer (if any)
          const rightHeader = document.querySelector('#articles .card-header');
          const rightFooter = document.querySelector('#articles .card-footer');
          const headerH = rightHeader ? rightHeader.getBoundingClientRect().height : 0;
          const footerH = rightFooter ? rightFooter.getBoundingClientRect().height : 0;

          // Compute body height to fill same card height and set it
          const bodyH = Math.max(0, Math.floor(leftH - headerH - footerH - 2)); // 2px buffer
          rightCardBody.style.maxHeight = bodyH + 'px';
          rightCardBody.style.overflowY = 'auto';
          rightCardBody.style.webkitOverflowScrolling = 'touch';
        }

        // Run after DOM ready and on resize
        document.addEventListener('DOMContentLoaded', setArticlesScroll);
        window.addEventListener('resize', setTimeout.bind(null, setArticlesScroll, 50));
      })();
    
