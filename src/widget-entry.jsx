import { createRoot } from 'react-dom/client';
import ShoppingWidget from './ShoppingWidget.jsx';
import './widget.css';

const scriptUrl = document.currentScript?.src || '';
const stylesheetUrl = scriptUrl ? new URL('aurelia-widget.css', scriptUrl).href : '';

class AureliaShoppingWidget extends HTMLElement {
  connectedCallback() {
    if (this._root) return;
    const shadow = this.attachShadow({ mode: 'open' });
    if (stylesheetUrl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = stylesheetUrl;
      shadow.appendChild(link);
    }
    const mount = document.createElement('div');
    mount.className = 'aura-widget-mount';
    shadow.appendChild(mount);
    this._root = createRoot(mount);
    this._root.render(<ShoppingWidget />);
  }
  disconnectedCallback() {
    this._root?.unmount();
    this._root = null;
  }
}

if (!customElements.get('aurelia-shopping-widget')) {
  customElements.define('aurelia-shopping-widget', AureliaShoppingWidget);
}
