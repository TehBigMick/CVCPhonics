# Weekly classroom content

`index.html` is the class selector. `ph1.html` and `ph2.html` hold the current
PH1 and PH2 pages. The earlier My Class/Aa–Bb page and My Family reader are
preserved at `week4.html`.

The current week is **12–16 October 2026**:

- PH1: Super Safari 1, Unit 2, My Colours; Cc; Aa/Bb review.
- PH2: Super Safari 2, Unit 3, My Body; Jj; practice with my, I and can.

## Add the new phonics videos

1. Add the Cc classroom video to `assets/videos/OPW-C.mp4`.
2. Add the Jj classroom video to `assets/videos/OPW-J.mp4`.
3. In `scripts/weekly-data.js`, change the relevant course's `video.ready`
   from `false` to `true`. Change `video.src` there if the supplied filename
   is different.

Until a video is ready, its page displays a coming-soon card and does not
request the missing MP4. The existing Aa/Bb videos and posters are reused
from `assets/videos/`.

## Update the week

Targets, word pictures, games, sentences and movements live in
`scripts/weekly-data.js`. The built-in illustrations live in
`scripts/weekly-pictures.js`. Titles, family activities and the class selector
are in the three current HTML files. Update those together, including the
week preview on the root home page. If changing JavaScript or styles,
increase the dated `v=` query string on the changed assets and the data
module import so returning families receive the new version.

Games use short rounds, explicit Next buttons and retries without penalties.
Word buttons use the device's English speech voice, with visible read-aloud
prompts when speech is unavailable. Audio never starts on page load.
