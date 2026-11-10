# Our Little Universe

A responsive, single-page keepsake built with HTML, CSS, and vanilla JavaScript. No build step or framework is required.

## Run it

Open `index.html` in a browser, or open this folder in VS Code and use Live Server. Google Fonts, Lucide icons, and the sample photographs load from the internet; the core layout and interactions are local.

## Make it yours

Edit `js/config.js` to update names, dates, your story, letter, reasons, all 12 gallery memories, timeline events, and music metadata. Image entries accept local paths such as `assets/images/our-photo.jpg`. The opening hero, story, and closing photos can also be changed there.

Put your audio file in `assets/music/`, then update `song.src` in `js/config.js`, for example `assets/music/our-song.mp3`. Playback starts only after the play button is pressed.

The placeholder photos currently use remote Unsplash image URLs. Replace them with your own files in `assets/images/` when ready. Add your own icon files to `assets/icons/` if you want to extend the design; interface icons use Lucide from its CDN.

## Project map

- `index.html` contains the accessible page structure and all story sections.
- `css/style.css` contains the visual system and desktop styles.
- `css/responsive.css` adapts layouts for smaller screens.
- `css/animations.css` contains motion and reduced-motion handling.
- `js/config.js` is the content customization file.
- `js/main.js` handles the opening, navigation, reveal motion, letter, cursor, and hearts.
- `js/gallery.js`, `js/timeline.js`, and `js/music.js` handle their respective features.