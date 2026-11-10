(() => {
  const entries = window.LOVE_STORY.timeline;
  const list = document.getElementById("timeline-list");

  list.innerHTML = entries.map((entry) => `
    <article class="timeline-entry reveal">
      <div class="timeline-media"><img src="${entry.image}" alt="${entry.alt}" loading="lazy"></div>
      <span class="timeline-dot" aria-hidden="true"></span>
      <div class="timeline-copy">
        <p class="timeline-date">${entry.date}</p>
        <h3>${entry.title}</h3>
        <p>${entry.text}</p>
      </div>
    </article>
  `).join("");
})();