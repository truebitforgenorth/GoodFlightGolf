//what in here?
//News api

document.addEventListener('DOMContentLoaded', () => {
  const pgaNewsContainer = document.getElementById('pga-news');
  if (!pgaNewsContainer) return;

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
    
