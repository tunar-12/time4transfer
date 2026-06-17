# Fleet interior photos

Drop your vehicle interior photos in this folder using these exact filenames
(the `FleetGrid` component picks them up automatically):

| File                          | Vehicle               | Reference page                                                                                |
| ----------------------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| `vito-standard.jpg`           | Standard Vito         | https://tr.motor1.com/news/441362/guncellenen-mercedes-benz-vito-tourer-turkiyede/            |
| `vito-premium.jpg`            | Premium Vito          | https://www.pinterest.com/pin/45247171250008021/                                              |
| `sprinter-premium.jpg`        | Premium Sprinter      | https://www.pinterest.com/pin/651333164897538414/                                             |
| `sprinter-standard.jpg`       | Standard Sprinter     | https://www.pinterest.com/pin/9570217952811305/                                               |

Recommendations:

- **Aspect ratio:** roughly 16:9 to 16:10. The component crops with `object-cover`, so wider is fine.
- **Resolution:** at least 1200 px on the long edge so the photo stays sharp on retina screens. ~250–400 KB after compression is a good target.
- **Format:** `.jpg` works as wired. To swap to `.webp`/`.avif`, update the `src` paths in `src/components/FleetGrid.tsx` (`PHOTO_SOURCES` map).
- **Falls back gracefully:** until these files exist, the card shows its inline SVG illustration. No broken-image icons.

If you license the Pinterest images for use, please verify the rights of the
original photographer before publishing.
