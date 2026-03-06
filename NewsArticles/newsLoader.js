document.addEventListener('DOMContentLoaded', () => {
  // Inline JSON for articles
  const articles = [
    {
      "title": "Viktor Hovland’s 2025 PGA Tour Season: Momentum and Major Promise",
      "link": "article1VH081025.html",
      "summary": "A year of breakthrough moments, highlighted by his Valspar Championship win, strong U.S. Open performance, and rising Ryder Cup potential."
    },
    {
      "title": "What Irons Should You Use Based on Your Handicap?",
      "link": "article2VH08142025.html",
      "summary": "Regardless of handicap, a professional club fitting can optimize loft, lie angle, shaft, and grip size—potentially saving you multiple strokes per round."
    },
    {
      "title": "Best Golf Clubs & Gear for a 10 Handicap",
      "link": "article3VH08172025.html",
      "summary": "For a 10 handicap, equipment matters — but fitting matters more. A custom fitting session can optimize your shaft, lofts, and lie angles to ensure every club works for your swing."
    },
    {
      "title": "Winless Champion: Jon Rahm’s $18 Million LIV Title Brings Glory and Frustration",
      "link": "article4H08242025.html",
      "summary": "Jon Rahm clinched the 2025 LIV Golf individual season championship on Sunday in Indianapolis, earning the league’s $18 million bonus prize."
    }
  ];

  // Get the UL element
  const articleList = document.getElementById('articleList');

  // Populate the list
  articles.forEach(article => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `🧮 <strong><a href="${article.link}" target="_blank">${article.title}: </a></strong>${article.summary}`;
    articleList.appendChild(li);
  });
});
