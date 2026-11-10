(() => {
  const config = window.LOVE_STORY;
  const grid = document.getElementById("memory-grid");
  const dialog = document.getElementById("lightbox");
  const image = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  const date = document.getElementById("lightbox-date");
  let activeIndex = 0;

  function renderGallery() {
    grid.innerHTML = config.photos.map((photo, index) => `
      <figure class="memory-item shape-${photo.shape || "square"} reveal" role="button" tabindex="0" aria-label="View photo: ${photo.caption}">
        <div class="memory-image-wrap"><img src="${photo.src}" alt="${photo.alt}" loading="lazy"></div>
        <figcaption>${photo.caption}<span>${photo.date}</span></figcaption>
      </figure>
    `).join("");
    document.dispatchEvent(new CustomEvent("content:rendered"));
  }

  function showPhoto(index) {
    activeIndex = (index + config.photos.length) % config.photos.length;
    const photo = config.photos[activeIndex];
    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.caption;
    date.textContent = photo.date;
  }

  grid.addEventListener("click", (event) => {
    const item = event.target.closest(".memory-item");
    if (!item) return;
    showPhoto([...grid.children].indexOf(item));
    dialog.showModal();
  });

  grid.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".memory-item")) {
      event.preventDefault();
      showPhoto([...grid.children].indexOf(event.target));
      dialog.showModal();
    }
  });

  document.getElementById("lightbox-close").addEventListener("click", () => dialog.close());
  document.getElementById("lightbox-prev").addEventListener("click", () => showPhoto(activeIndex - 1));
  document.getElementById("lightbox-next").addEventListener("click", () => showPhoto(activeIndex + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });

  window.renderMemoryGallery = renderGallery;
  renderGallery();
})();