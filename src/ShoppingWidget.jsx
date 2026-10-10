import { useEffect, useMemo, useRef, useState } from 'react';

const products = [

   { id: 1, name: 'Cloud Wireless Headphones', category: 'Audio', price: 2499, emoji: '🎧', description: 'Comfortable wireless headphones with rich, balanced sound.', image: 'https://images.unsplash.com/photo-1505740106531-4243f3831c78?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D' },

   { id: 2, name: 'Aura Smart Watch', category: 'Wearables', price: 3299, emoji: '⌚', description: 'Track activity and stay connected throughout the day.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85' },

   { id: 3, name: 'Studio Bluetooth Speaker', category: 'Audio', price: 1799, emoji: '🔊', description: 'A compact speaker with room-filling sound.', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85' },

   { id: 4, name: 'Everyday Backpack', category: 'Accessories', price: 1499, emoji: '🎒', description: 'A lightweight everyday bag with smart storage.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85' },

   { id: 5, name: 'Minimal Desk Lamp', category: 'Home', price: 999, emoji: '💡', description: 'A minimalist lamp for your workspace.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85' },

   { id: 6, name: 'Mechanical Keyboard', category: 'Accessories', price: 2899, emoji: '⌨️', description: 'A satisfying typing experience for work and play.', image: 'https://plus.unsplash.com/premium_photo-1661628680845-39b71e9be303?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D' },

   { id: 7, name: 'Travel Tumbler', category: 'Home', price: 699, emoji: '🥤', description: 'A reusable tumbler for your daily commute.', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85' },

   { id: 8, name: 'Classic Sunglasses', category: 'Accessories', price: 1199, emoji: '🕶️', description: 'A timeless design for sunny days.', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85' },

];

const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function answerFor(input) {

   const q = input.toLowerCase();

   const product = products.find(p => q.includes(p.name.toLowerCase()) || q.includes(p.category.toLowerCase()));

   if (/cheapest|lowest price|least expensive/.test(q)) {

      const p = [...products].sort((a, b) => a.price - b.price)[0];

      return `Our lowest-priced item is ${p.name} at ${money(p.price)}. ${p.description}`;

   }

   if (/recommend|suggest|gift|best/.test(q)) return `I'd recommend the ${products[0].name} for everyday listening, or the ${products[1].name} if you prefer a wearable. Tell me what you're shopping for and I'll narrow it down.`;

   if (/catalog|products|what do you sell|show me/.test(q)) return `We have audio, wearables, accessories and home essentials. Try asking about headphones, the smart watch, speaker, backpack, desk lamp, keyboard, tumbler or sunglasses.`;

   if (product) return `${product.name} costs ${money(product.price)}. ${product.description} You can add it from the product catalogue below.`;

   if (/cart|checkout|buy|purchase|order/.test(q)) return 'You can add products to your cart below, review quantities, and complete the checkout.';

   return 'I can help you explore our products, compare prices and find something suitable. Ask about a product or say “show me products”.';

}

export default function ShoppingWidget() {

   const [open, setOpen] = useState(false);

   const [catalogOpen, setCatalogOpen] = useState(false);

   const [search, setSearch] = useState('');

   const [cart, setCart] = useState([]);

   const [message, setMessage] = useState('');

   const [messages, setMessages] = useState([{ role: 'assistant', text: "Hi! I'm Aura, your shopping assistant. Ask me about products or browse the catalogue below." }]);

   const [voiceOn, setVoiceOn] = useState(false);

   const [listening, setListening] = useState(false);

   const [voiceError, setVoiceError] = useState('');

   const [customerName, setCustomerName] = useState('');

   const [checkout, setCheckout] = useState(false);

   const [order, setOrder] = useState(null);

   const recognition = useRef(null);

   const bottomRef = useRef(null);

   const sendRef = useRef(null);

   const filtered = useMemo(() => products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())), [search]);

   const count = cart.reduce((n, p) => n + p.quantity, 0);

   const total = cart.reduce((n, p) => n + p.price * p.quantity, 0);

   useEffect(() => {

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) { setVoiceError('Voice input is not supported in this browser.'); return; }

      const instance = new SpeechRecognition();

      instance.lang = 'en-IN'; instance.continuous = false; instance.interimResults = false;

      instance.onstart = () => { setListening(true); setVoiceError(''); };

      instance.onresult = event => { const transcript = event.results?.[0]?.[0]?.transcript?.trim(); if (transcript) sendRef.current?.(transcript); };

      instance.onerror = event => { if (event.error === 'not-allowed') setVoiceError('Allow microphone access in your browser settings.'); else if (event.error !== 'aborted') setVoiceError('Could not hear that. Please try again.'); };

      instance.onend = () => setListening(false);

      recognition.current = instance;

      return () => { try { instance.abort(); } catch {} if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };

   }, []);

   useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

   function add(product) {

      setCart(current => { const existing = current.find(item => item.id === product.id); return existing ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]; });

   }

   function quantity(id, change) { setCart(current => current.map(p => p.id === id ? { ...p, quantity: p.quantity + change } : p).filter(p => p.quantity > 0)); }

   function send(text = message) {

      const input = text.trim(); if (!input) return;

      const reply = answerFor(input);

      setMessages(current => [...current, { role: 'user', text: input }, { role: 'assistant', text: reply }]);

      setMessage('');

      if (voiceOn && 'speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(reply)); }

   }

   sendRef.current = send;

   function startVoice() { if (!recognition.current) { setVoiceError('Voice input is not supported in this browser. Try Chrome or Edge.'); return; } try { recognition.current.start(); } catch { setVoiceError('Voice input is already active. Please wait a moment.'); } }

   function completeOrder(event) { event.preventDefault(); if (!customerName.trim() || !cart.length) return; setOrder({ id: `AU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, name: customerName.trim(), total, count }); setCart([]); setCheckout(false); setCustomerName(''); }

   return <div className="aura-widget-root">

      <div className="aura-launcher-wrap">{open && <section className="aura-panel" aria-label="Aura shopping assistant">

         <header className="aura-head"><div className="aura-avatar">a.</div><div className="aura-head-copy"><strong>Aura <i /></strong><small>Your shopping companion</small></div><button className="aura-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>

         <div className="aura-tabs"><button className={!catalogOpen ? 'active' : ''} onClick={() => setCatalogOpen(false)}>Chat</button><button className={catalogOpen ? 'active' : ''} onClick={() => setCatalogOpen(true)}>Products ({products.length})</button><button onClick={() => setCheckout(true)}>Cart ({count})</button></div>

         {catalogOpen ? <div className="aura-catalog"><label className="aura-search"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products" /></label><div className="aura-product-list">{filtered.map(p => <article className="aura-product" key={p.id}><div className="aura-product-art">

               <img src={p.image} alt={p.name} loading="lazy" />

            </div><div className="aura-product-info"><strong>{p.name}</strong><small>{p.category}</small><b>{money(p.price)}</b></div><button className="aura-add" onClick={() => add(p)} aria-label={`Add ${p.name} to cart`}>+</button></article>)}{!filtered.length && <p className="aura-muted">No products match your search.</p>}</div></div> : <>

            <div className="aura-messages">{messages.map((m, i) => <div className={`aura-message ${m.role}`} key={i}>{m.text}</div>)}<div ref={bottomRef} /></div>

            <div className="aura-prompts"><button onClick={() => send('Recommend a product')}>Recommend a product</button><button onClick={() => send('What is your cheapest product?')}>Lowest price</button><button onClick={() => setCatalogOpen(true)}>Browse products</button></div>

            <form className="aura-composer" onSubmit={e => { e.preventDefault(); send(); }}><input value={message} onChange={e => setMessage(e.target.value)} placeholder={listening ? 'Listening…' : 'Ask Aura anything…'} aria-label="Message Aura" /><button type="submit" disabled={!message.trim()} aria-label="Send message">↑</button><button type="button" className={listening ? 'is-listening' : ''} onClick={() => listening ? recognition.current?.stop() : startVoice()} aria-label={listening ? 'Stop voice input' : 'Start voice input'}>{listening ? 'Ⅱ' : '🎙'}</button></form>

            {voiceError && <p className="aura-error" role="status">{voiceError}</p>}

            <div className="aura-foot"><button onClick={() => { const next = !voiceOn; setVoiceOn(next); if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }}>{voiceOn ? '🔊 Spoken replies on' : '🔇 Spoken replies off'}</button><span>Your assistant</span></div>

         </>}

         {checkout && <div className="aura-modal-backdrop"><section className="aura-modal"><button className="aura-modal-close" onClick={() => setCheckout(false)} aria-label="Close cart">×</button><h3>Your cart ({count})</h3>{cart.length ? <div className="aura-cart-lines">{cart.map(p => <div className="aura-cart-line" key={p.id}><span className="aura-cart-product">

               <img src={p.image} alt="" />

               <span>{p.name}<small>{money(p.price)} each</small></span>

            </span><div><button onClick={() => quantity(p.id, -1)} aria-label={`Remove one ${p.name}`}>−</button><b>{p.quantity}</b><button onClick={() => quantity(p.id, 1)} aria-label={`Add one ${p.name}`}>+</button></div></div>)}</div> : <p className="aura-muted">Your cart is empty. Browse products to add something.</p>}<div className="aura-total"><span>Total</span><strong>{money(total)}</strong></div>{cart.length > 0 && <form onSubmit={completeOrder}><label className="aura-name-label">Name for your order<input required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Enter your name" /></label><button className="aura-primary" type="submit">Place order</button><small className="aura-muted">No payment will be collected.</small></form>}</section></div>}

         {order && <div className="aura-modal-backdrop"><section className="aura-modal"><div className="aura-success">✓</div><h3>Thank you, {order.name}!</h3><p>Your order was placed successfully.</p><p className="aura-order-id">ORDER {order.id}</p><div className="aura-total"><span>{order.count} item(s)</span><strong>{money(order.total)}</strong></div><button className="aura-primary" onClick={() => setOrder(null)}>Continue shopping</button></section></div>}

      </section>}<button className="aura-launcher" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close Aura shopping assistant' : 'Open Aura shopping assistant'} aria-expanded={open}><span>{open ? '×' : '✳'}</span>{!open && <b>Ask Aura</b>}</button></div>

   </div>;

}
