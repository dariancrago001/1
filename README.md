# Stiletto Invoice Generator (Desktop)

Desktop app for Stiletto Piercing Supply that turns a Shopify orders CSV export
into printable Mejuri invoices, saved as PDFs.

Built with [Electron](https://www.electronjs.org/). The whole UI lives in
`index.html`; `main.js` opens the window and provides a native **Save as PDF**
dialog (via Electron's `printToPDF`), so saving an invoice writes a real PDF
file directly — no browser print dialog needed. The invoice ID is used as the
suggested filename, and the file is revealed in Finder/Explorer after saving.

## How it works

1. Drop a Shopify **orders export CSV** (or tab-separated file) onto the app,
   or click the upload zone to browse for it.
2. Orders are grouped by order number and auto-matched to a Mejuri store by
   the store-leader email or the shipping/billing company name. Unmatched
   orders are flagged.
3. Click an order, confirm (or pick / type) the store, and the invoice is
   generated with an ID like `Mejuri-<Store>-<MMDDYY>` — duplicate store+date
   combinations get an `a`, `b`, … suffix.
4. Click **Save as PDF** to save the invoice.

## Run from source

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm start
```

## Build installers

```bash
npm run dist
```

This uses electron-builder and produces, per platform:

- **Windows:** NSIS installer (`dist/*.exe`)
- **macOS:** DMG (`dist/*.dmg`)
- **Linux:** AppImage (`dist/*.AppImage`)

Build on the platform you're targeting (e.g. run it on Windows to get the
`.exe` installer). `npm run pack` builds an unpackaged app folder for quick
testing.
