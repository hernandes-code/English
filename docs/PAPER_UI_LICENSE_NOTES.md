# Paper UI asset handling notes

Source pack: `Humble Gift - Paper UI System v1.1` by Humble Pixel / `@Humblepixel`.

The included license states that the assets may be used in commercial and non-commercial projects and may be modified, but may not be redistributed, shared, or resold in original or modified form, and may not be used as a logo/trademark/service mark. Credit is appreciated but not mandatory.

## Source-control policy

The `hernandes-code/English` repository is public, so do **not** commit the full Humble Pixel source pack, sprite sheets, Aseprite source files, contact sheets, or bulk raw PNG directories to GitHub.

For implementation, prefer one of these approaches before introducing runtime images:

1. Make the project repository private, then keep only the selected runtime assets needed by the app; or
2. Keep licensed source assets outside the public repository and serve only the required runtime derivatives through a controlled deployment/storage path consistent with the license.

Do not copy all 1,410 PNGs into `public/`.

The canonical asset-selection map is `docs/PAPER_UI_ASSET_GUIDE.md`, and the compact registry is `docs/paper-ui-selected-assets.csv`.

Before adding a new licensed asset, record its source path, runtime role, and planned alias in the guide/registry first.
