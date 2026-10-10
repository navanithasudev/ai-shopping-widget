# Aurelia AI Shopping Widget

This project contains the original Aurelia storefront and a separate embeddable shopping widget. The widget is a demo: product data, assistant replies, cart, and checkout run in the browser; no backend or payment service is connected.

## Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm (included with Node.js)

## Run the original storefront

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The original storefront remains the default app.

## Build the embeddable widget

```bash
npm run build:widget
```

This generates:

- `dist-widget/aurelia-widget.js`
- `dist-widget/aurelia-widget.css`

Keep both files together when hosting the widget. The script loads its matching CSS file from the same directory. The widget registers the custom element `<aurelia-shopping-widget>` and uses Shadow DOM to isolate its styles from the host website.

## Test the embed locally

1. Build the storefront and widget with `npm run build:all`.
2. Copy the generated widget files into the storefront's `dist` folder:

   ```powershell
   Copy-Item dist-widget/aurelia-widget.js dist/aurelia-widget.js -Force
   Copy-Item dist-widget/aurelia-widget.css dist/aurelia-widget.css -Force
   ```

3. Start the production preview with `npm run preview -- --host=127.0.0.1 --port=4173 --strictPort`.
4. Open `http://localhost:4173/embed-demo.html`.
5. Use the floating **Ask Aura** button. Test chat, product search, add-to-cart, quantity changes, mock checkout, and voice controls.

The demo page loads `/aurelia-widget.js`, so copy the generated widget files into the `dist` folder before opening it. The demo page is a separate host page, not the main storefront.

## Embed it on another website

Upload `aurelia-widget.js` and `aurelia-widget.css` to the same publicly accessible folder on your site/CDN, then add this before `</body>`:

```html
<aurelia-shopping-widget></aurelia-shopping-widget>
<script src="https://YOUR-DOMAIN.example/widgets/aurelia-widget.js"></script>
```

Replace the example URL with the real URL where you hosted the JavaScript file. Do not use that placeholder literally. The CSS file must be in the same directory as the JavaScript file.

## Voice support

Voice input uses the browser Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition`); availability differs by browser. It generally requires a secure context (HTTPS, or localhost for testing) and microphone permission. Spoken responses use the browser's Speech Synthesis API and can be enabled in the chat panel.

## Scope and limitations

- This is a mock assistant with deterministic local replies, not a generative AI model.
- Cart and order state are not saved to a server.
- Checkout is simulated; no payment is collected.
- For a real deployment, host both build assets over HTTPS and test on the target host website.
