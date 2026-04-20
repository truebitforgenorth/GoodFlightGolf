document.addEventListener('DOMContentLoaded', () => {
  const articles = [
    {
      title: "Next Up on the PGA TOUR: Zurich Classic 2026 Preview, Past Winners, Course Notes and Betting Watch",
      link: "zurich-classic-2026-preview-course-history-betting.html",
      summary:
        "A preview of the next PGA TOUR stop at TPC Louisiana, with the past five winners, course notes, and an early betting watchlist for the team event in New Orleans."
    },
    {
      title: "Matt Fitzpatrick Wins the 2026 RBC Heritage in a Playoff",
      link: "matt-fitzpatrick-rbc-heritage-2026-win.html",
      summary:
        "Matt Fitzpatrick beat Scottie Scheffler in a playoff on April 19, 2026 to win his second RBC Heritage title and second PGA TOUR event of the season."
    },
    {
      title: "Collin Morikawa's Back Injury: Recovery, Augusta Grit, and What's Next",
      link: "collin-morikawa-back-injury-recovery-and-future.html",
      summary:
        "A sourced look at Morikawa's March 2026 back injury, his Masters return, and what his short-term PGA Tour outlook looks like."
    },
    {
      title: "Viktor Hovland's 2025 PGA Tour Season: Momentum and Major Promise",
      link: "viktor-hovland-2025-pga-tour-season.html",
      summary:
        "A year of breakthrough moments, highlighted by his Valspar Championship win, strong U.S. Open performance, and rising Ryder Cup potential."
    },
    {
      title: "What Irons Should You Use Based on Your Handicap?",
      link: "what-irons-should-you-use-based-on-your-handicap.html",
      summary:
        "Regardless of handicap, a professional club fitting can optimize loft, lie angle, shaft, and grip size, potentially saving you multiple strokes per round."
    },
    {
      title: "Best Golf Clubs & Gear for a 10 Handicap",
      link: "best-golf-clubs-and-gear-for-a-10-handicap.html",
      summary:
        "For a 10 handicap, equipment matters, but fitting matters more. A custom fitting session can optimize your shaft, lofts, and lie angles to ensure every club works for your swing."
    },
    {
      title: "Winless Champion: Jon Rahm's $18 Million LIV Title Brings Glory and Frustration",
      link: "jon-rahm-liv-title-brings-glory-and-frustration.html",
      summary:
        "Jon Rahm clinched the 2025 LIV Golf individual season championship in Indianapolis, earning the league's $18 million bonus prize."
    }
  ];

  const articleList = document.getElementById('articleList');
  if (!articleList) return;

  articles.forEach(article => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<strong><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></strong>: ${article.summary}`;
    articleList.appendChild(li);
  });
});
