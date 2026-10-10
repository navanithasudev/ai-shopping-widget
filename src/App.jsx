import { useEffect, useMemo, useRef, useState } from "react";

import "./App.css";



const products = [

   {

      id: 1,

      name: "Cloud Wireless Headphones",

      category: "Audio",

      price: 2499,

      emoji: "🎧",
      image: "https://images.unsplash.com/photo-1505740106531-4243f3831c78?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",

      color: "#e8e7ff",

      description: "Comfortable wireless headphones with rich, balanced sound.",

   },

   {

      id: 2,

      name: "Aura Smart Watch",

      category: "Wearables",

      price: 3299,

      emoji: "⌚",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",

      color: "#e0f2e9",

      description: "Track your activity and stay connected throughout the day.",

   },

   {

      id: 3,

      name: "Studio Bluetooth Speaker",

      category: "Audio",

      price: 1799,

      emoji: "🔊",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",

      color: "#ffeadb",

      description: "A compact speaker with room-filling sound.",

   },

   {

      id: 4,

      name: "Everyday Backpack",

      category: "Accessories",

      price: 1499,

      emoji: "🎒",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",

      color: "#f7e4ed",

      description: "A lightweight everyday bag with smart storage.",

   },

   {

      id: 5,

      name: "Minimal Desk Lamp",

      category: "Home",

      price: 999,

      emoji: "💡",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",

      color: "#fff1c9",

      description: "A minimalist lamp for your workspace or bedside.",

   },

   {

      id: 6,

      name: "Mechanical Keyboard",

      category: "Accessories",

      price: 2899,

      emoji: "⌨️",
      image: "https://plus.unsplash.com/premium_photo-1661628680845-39b71e9be303?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",

      color: "#dceafa",

      description: "A satisfying typing experience for work and play.",

   },

   {

      id: 7,

      name: "Travel Tumbler",

      category: "Home",

      price: 699,

      emoji: "🥤",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",

      color: "#d9f0ed",

      description: "A reusable tumbler for your daily commute.",

   },

   {

      id: 8,

      name: "Classic Sunglasses",

      category: "Accessories",

      price: 1199,

      emoji: "🕶️",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",

      color: "#eee5d9",

      description: "A timeless design for sunny days.",

   },

];



const money = (amount) =>

   new Intl.NumberFormat("en-IN", {

      style: "currency",

      currency: "INR",

      maximumFractionDigits: 0,

   }).format(amount);



function App() {

   const [category, setCategory] = useState("All");

   const [search, setSearch] = useState("");

   const [cart, setCart] = useState([]);

   const [cartOpen, setCartOpen] = useState(false);

   const [chatOpen, setChatOpen] = useState(false);



   const [messages, setMessages] = useState([

      {

         role: "assistant",

         text: "Hi there! 👋 I'm Aura, your shopping assistant. Ask me about our products or let me help you find something you'll love.",

      },

   ]);



   const [message, setMessage] = useState("");

   const [checkoutOpen, setCheckoutOpen] = useState(false);

   const [customerName, setCustomerName] = useState("");

   const [order, setOrder] = useState(null);

   const [notice, setNotice] = useState("");



   // Voice interaction state

   const [voiceEnabled, setVoiceEnabled] = useState(false);

   const [listening, setListening] = useState(false);

   const [voiceError, setVoiceError] = useState("");

   const [voiceSupported, setVoiceSupported] = useState(false);

   const [speechSupported, setSpeechSupported] = useState(false);



   const recognitionRef = useRef(null);

   const voiceEnabledRef = useRef(false);

   const sendMessageRef = useRef(null);

   const noticeTimeoutRef = useRef(null);

   const chatMessagesRef = useRef(null);



   useEffect(() => {

      const SpeechRecognition =

         window.SpeechRecognition || window.webkitSpeechRecognition;



      setSpeechSupported(

         typeof window !== "undefined" &&

            "speechSynthesis" in window &&

            "SpeechSynthesisUtterance" in window

      );



      if (!SpeechRecognition) {

         setVoiceSupported(false);

         setVoiceError("Voice input is not supported in this browser.");

         return undefined;

      }



      const recognition = new SpeechRecognition();



      recognition.lang = "en-IN";

      recognition.continuous = false;

      recognition.interimResults = false;

      recognition.maxAlternatives = 1;



      recognition.onstart = () => {

         setListening(true);

         setVoiceError("");

      };



      recognition.onresult = (event) => {

         const transcript = event.results?.[0]?.[0]?.transcript?.trim();



         if (transcript) {

            sendMessageRef.current?.(transcript);

         }

      };



      recognition.onerror = (event) => {

         if (event.error === "not-allowed") {

            setVoiceError(

               "Microphone access was denied. Allow microphone access in your browser settings."

            );

         } else if (event.error === "no-speech") {

            setVoiceError("No speech detected. Please try speaking again.");

         } else if (event.error !== "aborted") {

            setVoiceError("Voice input failed. Please try again.");

         }

      };



      recognition.onend = () => {

         setListening(false);

      };



      recognitionRef.current = recognition;

      setVoiceSupported(true);

      setVoiceError("");



      return () => {

         recognition.onstart = null;

         recognition.onresult = null;

         recognition.onerror = null;

         recognition.onend = null;



         try {

            recognition.abort();

         } catch {

            // Recognition may already have stopped.

         }



         recognitionRef.current = null;



         if ("speechSynthesis" in window) {

            window.speechSynthesis.cancel();

         }

      };

   }, []);



   useEffect(() => {

      if (chatMessagesRef.current) {

         chatMessagesRef.current.scrollTop =

            chatMessagesRef.current.scrollHeight;

      }

   }, [messages, chatOpen]);



   useEffect(() => {

      return () => {

         if (noticeTimeoutRef.current) {

            window.clearTimeout(noticeTimeoutRef.current);

         }

      };

   }, []);



   const categories = [

      "All",

      ...new Set(products.map((product) => product.category)),

   ];



   const filteredProducts = useMemo(

      () =>

         products.filter((product) => {

            const matchesCategory =

               category === "All" || product.category === category;



            const searchableText =

               `${product.name} ${product.description} ${product.category}`.toLowerCase();



            const matchesSearch = searchableText.includes(search.toLowerCase());



            return matchesCategory && matchesSearch;

         }),

      [category, search]

   );



   const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);



   const total = cart.reduce(

      (sum, item) => sum + item.price * item.quantity,

      0

   );



   function showNotice(text) {

      setNotice(text);



      if (noticeTimeoutRef.current) {

         window.clearTimeout(noticeTimeoutRef.current);

      }



      noticeTimeoutRef.current = window.setTimeout(() => {

         setNotice("");

         noticeTimeoutRef.current = null;

      }, 2400);

   }



   function addToCart(product) {

      setCart((current) => {

         const existing = current.find((item) => item.id === product.id);



         if (existing) {

            return current.map((item) =>

               item.id === product.id

                  ? { ...item, quantity: item.quantity + 1 }

                  : item

            );

         }



         return [...current, { ...product, quantity: 1 }];

      });



      showNotice(`${product.name} added to your bag`);

   }



   function changeQuantity(id, amount) {

      setCart((current) =>

         current

            .map((item) =>

               item.id === id

                  ? { ...item, quantity: item.quantity + amount }

                  : item

            )

            .filter((item) => item.quantity > 0)

      );

   }



   function assistantReply(input) {

      const q = input.toLowerCase().trim();



      const addIntent = /\b(add|put)\b/.test(q);



      const product = products.find((item) => {

         const name = item.name.toLowerCase();



         return (

            q.includes(name) ||

            name

               .split(" ")

               .some((word) => word.length > 4 && q.includes(word))

         );

      });



      if (addIntent && product) {

         addToCart(product);



         return `I've added ${product.name} to your bag for ${money(

            product.price

         )}. Would you like to explore more products?`;

      }



      if (

         q.includes("cart") ||

         q.includes("bag") ||

         q.includes("basket")

      ) {

         if (!cart.length) {

            return "Your bag is empty at the moment. Browse our catalogue and add something you like!";

         }



         const items = cart

            .map((item) => `${item.quantity} × ${item.name}`)

            .join(", ");



         return `Your bag has ${cartCount} item(s), with a total of ${money(

            total

         )}. Your items are: ${items}.`;

      }



      if (

         q.includes("cheap") ||

         q.includes("lowest") ||

         q.includes("affordable") ||

         q.includes("least expensive")

      ) {

         const cheapest = [...products].sort(

            (a, b) => a.price - b.price

         )[0];



         return `Our most affordable product is ${cheapest.name} at ${money(

            cheapest.price

         )}. ${cheapest.description}`;

      }



      if (

         q.includes("recommend") ||

         q.includes("suggest") ||

         q.includes("popular")

      ) {

         const recommendations = products

            .slice(0, 3)

            .map((item) => `${item.name} (${money(item.price)})`)

            .join(", ");



         return `Here are a few picks to explore: ${recommendations}. Tell me which one interests you!`;

      }



      if (

         q.includes("all products") ||

         q.includes("show products") ||

         q.includes("catalogue") ||

         q.includes("catalog") ||

         q.includes("what do you sell")

      ) {

         return `We have ${products.length} products across Audio, Wearables, Accessories, and Home. Some options are ${products

            .slice(0, 4)

            .map((item) => item.name)

            .join(", ")}. You can browse the full collection on this page.`;

      }



      if (

         q.includes("price") ||

         q.includes("cost") ||

         q.includes("how much")

      ) {

         if (product) {

            return `${product.name} costs ${money(product.price)}. ${product.description}`;

         }



         return "Which product would you like to know the price of? You can ask about the headphones, smartwatch, speaker, backpack, desk lamp, keyboard, tumbler, or sunglasses.";

      }



      if (product) {

         return `${product.name} costs ${money(product.price)}. ${

            product.description

         } You can add it to your bag from its product card, or ask me to add it for you.`;

      }



      const matches = products.filter((item) => {

         const searchableText =

            `${item.name} ${item.description} ${item.category}`.toLowerCase();



         return (

            q.length > 0 &&

            q.split(/\s+/).some(

               (word) => word.length > 3 && searchableText.includes(word)

            )

         );

      });



      if (matches.length > 0) {

         return `I found these products that may interest you: ${matches

            .slice(0, 3)

            .map((item) => `${item.name} (${money(item.price)})`)

            .join(", ")}. Would you like more details about one of them?`;

      }



      return "I can help you explore our catalogue, compare prices, find affordable products, and check your bag. Try asking me to recommend a product, find our cheapest item, or tell you the price of a product.";

   }



   function sendMessage(text = message) {

      const trimmed = text.trim();



      if (!trimmed) return;



      const reply = assistantReply(trimmed);



      setMessages((current) => [

         ...current,

         { role: "user", text: trimmed },

         { role: "assistant", text: reply },

      ]);



      setMessage("");



      if (

         voiceEnabledRef.current &&

         "speechSynthesis" in window &&

         "SpeechSynthesisUtterance" in window

      ) {

         window.speechSynthesis.cancel();



         const utterance = new SpeechSynthesisUtterance(reply);

         utterance.lang = "en-IN";

         utterance.rate = 1;



         window.speechSynthesis.speak(utterance);

      }

   }



   // Keep the latest sendMessage function available to speech recognition.

   sendMessageRef.current = sendMessage;



   function toggleVoice() {

      const next = !voiceEnabled;



      setVoiceEnabled(next);

      voiceEnabledRef.current = next;



      if (!next && "speechSynthesis" in window) {

         window.speechSynthesis.cancel();

      }



      if (next && !speechSupported) {

         setVoiceError("Voice responses are not supported in this browser.");

      } else if (next) {

         setVoiceError("");

      }

   }



   function startListening() {

      if (!recognitionRef.current) {

         setVoiceError("Voice input is not available in this browser.");

         return;

      }



      try {

         setVoiceError("");

         recognitionRef.current.start();

      } catch {

         setVoiceError(

            "Voice recognition is already active. Stop listening before trying again."

         );

      }

   }



   function stopListening() {

      try {

         recognitionRef.current?.stop();

      } catch {

         setListening(false);

      }

   }



   function stopAudio() {

      if ("speechSynthesis" in window) {

         window.speechSynthesis.cancel();

      }

   }



   function completeOrder(event) {

      event.preventDefault();



      if (!cart.length || !customerName.trim()) return;



      setOrder({

         id: `AU-${Math.random()

            .toString(36)

            .slice(2, 8)

            .toUpperCase()}`,

         name: customerName.trim(),

         total,

         count: cartCount,

      });



      setCart([]);

      setCheckoutOpen(false);

      setCartOpen(false);

      setCustomerName("");

   }



   return (

      <div className="app-shell">

         <div className="promo-bar">Free delivery on orders above <strong>999</strong> · Use code <span>WELCOME10</span></div>

      <header className="topbar">

            <a className="brand" href="#home">

               <span className="brand-mark">a.</span> aurelia

               <span className="brand-dot">.</span>

            </a>



            <nav>

               <a href="#products">Shop</a>

               <a href="#about">Our story</a>

            </nav>



            <button

               className="bag-button"

               onClick={() => setCartOpen(true)}

               aria-label={`Open shopping bag with ${cartCount} items`}

            >

               Bag <span>{cartCount}</span>

            </button>

         </header>



         <main id="home">

            <section className="hero">

               <div className="hero-copy">

                  <div className="eyebrow">

                     <span /> THE EVERYDAY EDITION

                  </div>



                  <h1>

                     Little things.

                     <br />

                     <em>Better living.</em>

                  </h1>



                  <p>

                     Thoughtfully chosen essentials for your everyday rituals.

                     Discover something you&apos;ll love.

                  </p>



                  <a className="primary-button" href="#products">

                     Explore collection <span>↗</span>

                  </a>



                  <div className="hero-footnote">

                     CURATED FOR YOUR EVERYDAY&nbsp; · &nbsp;MADE TO LAST

                  </div>

               </div>



               <div className="hero-art" aria-label="Featured products">

                  <div className="art-orbit orbit-one" />

                  <div className="art-orbit orbit-two" />



                  <div className="hero-product product-one">

                     <span>🎧</span>

                     <small>01 / SOUND</small>

                  </div>



                  <div className="hero-product product-two">

                     <span>⌚</span>

                     <small>02 / TIME</small>

                  </div>



                  <div className="hero-product product-three">

                     <span>☕</span>

                     <small>03 / RITUAL</small>

                  </div>



                  <div className="art-note">

                     OBJECTS

                     <br />

                     OF AFFECTION

                  </div>

               </div>



               

            </section>



            <section className="catalogue" id="products">

               <div className="section-heading">

                  <div>

                     <div className="eyebrow">THE COLLECTION</div>

                     <h2>

                        Find your <em>favourite.</em>

                     </h2>

                  </div>



                  <p>Useful things, chosen with care.</p>

               </div>



               <div className="catalogue-tools">

                  <div className="category-list">

                     {categories.map((item) => (

                        <button

                           key={item}

                           className={

                              category === item ? "category active" : "category"

                           }

                           onClick={() => setCategory(item)}

                           aria-pressed={category === item}

                        >

                           {item}

                        </button>

                     ))}

                  </div>



                  <input

                     aria-label="Search products"

                     className="search-input"

                     placeholder="Search the collection..."

                     value={search}

                     onChange={(event) => setSearch(event.target.value)}

                  />

               </div>



               <div className="product-grid">

                  {filteredProducts.map((product, index) => (

                     <article className="product-card" key={product.id}>

                        <div

                           className="product-image"

                           style={{ background: product.color }}

                        >

                           <span className="product-number">

                              {String(index + 1).padStart(2, "0")}

                           </span>



                           <img
                      className="product-photo"
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />



                           <button

                              className="quick-add"

                              aria-label={`Add ${product.name} to cart`}

                              onClick={() => addToCart(product)}

                           >

                              +

                           </button>

                        </div>



                        <div className="product-meta">

                           <span>{product.category}</span>

                           <span>{money(product.price)}</span>

                        </div>



                        <h3>{product.name}</h3>

                        <p>{product.description}</p>



                        <button

                           className="add-button"

                           onClick={() => addToCart(product)}

                        >

                           Add to bag <span>↗</span>

                        </button>

                     </article>

                  ))}



                  {!filteredProducts.length && (

                     <p className="empty-state">

                        No products found. Try another search or category.

                     </p>

                  )}

               </div>

            </section>



            <section className="assistant-banner" id="about">

               <div>

                  <div className="eyebrow">A LITTLE HELP, WHEN YOU NEED IT</div>

                  <h2>

                     Meet your personal

                     <br />

                     <em>shopping companion.</em>

                  </h2>

               </div>



               <button

                  className="primary-button"

                  onClick={() => setChatOpen(true)}

               >

                  Ask Aura <span>↗</span>

               </button>

            </section>

         </main>



         <footer className="footer">

            <a className="brand" href="#home">

               <span className="brand-mark">a.</span> aurelia

               <span className="brand-dot">.</span>

            </a>



            <span>Considered essentials, for every day.</span>

            <span>STOREFRONT · 2026</span>

         </footer>



         {notice && (

            <div className="toast" role="status">

               {notice}

            </div>

         )}



         {cartOpen && (

            <div

               className="overlay"

               onMouseDown={(event) => {

                  if (event.target === event.currentTarget) {

                     setCartOpen(false);

                  }

               }}

            >

               <aside className="drawer" aria-label="Shopping bag">

                  <div className="drawer-heading">

                     <div>

                        <div className="eyebrow">YOUR SELECTION</div>

                        <h2>

                           Your bag <span>({cartCount})</span>

                        </h2>

                     </div>



                     <button

                        className="icon-button"

                        onClick={() => setCartOpen(false)}

                        aria-label="Close shopping bag"

                     >

                        ✕

                     </button>

                  </div>



                  {!cart.length ? (

                     <div className="empty-cart">

                        <span>◇</span>

                        <h3>Your bag is taking a little break.</h3>

                        <p>Find something lovely in the collection.</p>



                        <button

                           className="primary-button"

                           onClick={() => {

                              setCartOpen(false);

                              document

                                 .querySelector("#products")

                                 ?.scrollIntoView({ behavior: "smooth" });

                           }}

                        >

                           Explore products ↗

                        </button>

                     </div>

                  ) : (

                     <>

                        <div className="cart-items">

                           {cart.map((item) => (

                              <div className="cart-item" key={item.id}>

                                 <div

                                    className="cart-thumb"

                                    style={{ background: item.color }}

                                 >

                                    <img src={item.image} alt={item.name} loading="lazy" />

                                 </div>



                                 <div className="cart-item-info">

                                    <h3>{item.name}</h3>

                                    <p>{money(item.price)}</p>



                                    <div className="quantity">

                                       <button

                                          onClick={() => changeQuantity(item.id, -1)}

                                          aria-label={`Decrease quantity of ${item.name}`}

                                       >

                                          −

                                       </button>



                                       <span>{item.quantity}</span>



                                       <button

                                          onClick={() => changeQuantity(item.id, 1)}

                                          aria-label={`Increase quantity of ${item.name}`}

                                       >

                                          +

                                       </button>



                                       <button

                                          className="remove-item"

                                          onClick={() =>

                                             setCart((current) =>

                                                current.filter(

                                                   (cartItem) => cartItem.id !== item.id

                                                )

                                             )

                                          }

                                       >

                                          Remove

                                       </button>

                                    </div>

                                 </div>



                                 <strong>

                                    {money(item.price * item.quantity)}

                                 </strong>

                              </div>

                           ))}

                        </div>



                        <div className="cart-summary">

                           <div>

                              <span>Subtotal</span>

                              <strong>{money(total)}</strong>

                           </div>



                           



                           <button

                              className="primary-button full-button"

                              onClick={() => {

                                 setCartOpen(false);

                                 setCheckoutOpen(true);

                              }}

                           >

                              Continue to checkout <span>↗</span>

                           </button>

                        </div>

                     </>

                  )}

               </aside>

            </div>

         )}



         {checkoutOpen && (

            <div

               className="overlay"

               onMouseDown={(event) => {

                  if (event.target === event.currentTarget) {

                     setCheckoutOpen(false);

                  }

               }}

            >

               <section className="checkout-modal">

                  <div className="drawer-heading">

                     <div>

                        <div className="eyebrow">ALMOST YOURS</div>

                        <h2>Checkout</h2>

                     </div>



                     <button

                        className="icon-button"

                        onClick={() => setCheckoutOpen(false)}

                        aria-label="Close checkout"

                     >

                        ✕

                     </button>

                  </div>



                  


                  <form onSubmit={completeOrder}>

                     <label>

                        Your name

                        <input

                           required

                           value={customerName}

                           onChange={(event) => setCustomerName(event.target.value)}

                           placeholder="Enter your name"

                        />

                     </label>



                     <div className="checkout-total">

                        <span>{cartCount} item(s)</span>

                        <strong>{money(total)}</strong>

                     </div>



                     <button

                        className="primary-button full-button"

                        type="submit"

                        disabled={!cart.length}

                     >

                        Place your order <span>↗</span>

                     </button>

                  </form>

               </section>

            </div>

         )}



         {order && (

            <div className="overlay">

               <section className="checkout-modal success-modal">

                  <div className="success-mark">✓</div>

                  <div className="eyebrow">ORDER CONFIRMED</div>



                  <h2>Thank you, {order.name}.</h2>



                  <p>

                     Your order has been placed successfully. No payment was

                     processed.

                  </p>



                  <div className="order-number">ORDER {order.id}</div>



                  <div className="checkout-total">

                     <span>{order.count} item(s)</span>

                     <strong>{money(order.total)}</strong>

                  </div>



                  <button

                     className="primary-button full-button"

                     onClick={() => setOrder(null)}

                  >

                     Back to shopping

                  </button>

               </section>

            </div>

         )}



         <div className="chat-widget">

            {chatOpen && (

               <section

                  className="chat-panel"

                  aria-label="Aura shopping assistant"

               >

                  <div className="chat-header">

                     <div className="assistant-avatar">a.</div>



                     <div className="chat-title">

                        <strong>

                           Aura <span className="online-dot" />

                        </strong>

                        <small>Your shopping companion</small>

                     </div>



                     <button

                        className="chat-close"

                        onClick={() => setChatOpen(false)}

                        aria-label="Close chat"

                     >

                        ✕

                     </button>

                  </div>



                  <div className="chat-suggestions">

                     <button onClick={() => sendMessage("Gift ideas under 800")}>

                        Recommend a product

                     </button>



                     <button

                        onClick={() => sendMessage("Track order")}

                     >

                        Lowest price

                     </button>

                  </div>



                  <div className="chat-messages" ref={chatMessagesRef}>

                     {messages.map((msg, index) => (

                        <div

                           key={index}

                           className={`message ${msg.role}`}

                        >

                           {msg.text}

                        </div>

                     ))}

                  </div>





                     <div className="chat-composer">

                        {listening ? (

                           <div className="recording-indicator" role="status">

                              <span className="recording-dot" />

                              <span>Listening...</span>

                              <span className="recording-wave" aria-hidden="true">

                                 ▂ ▅ ▃ ▇ ▄ ▆ ▂

                              </span>

                           </div>

                        ) : (

                           <form

                              className="chat-input"

                              onSubmit={(e) => {

                                 e.preventDefault();

                                 sendMessage();

                              }}

                           >

                              <input

                                 aria-label="Message Aura"

                                 value={message}

                                 onChange={(e) => setMessage(e.target.value)}

                                 placeholder="Ask me anything..."

                              />



                              <button

                                 type="submit"

                                 aria-label="Send message"

                                 disabled={!message.trim()}

                              >

                                 ↑

                              </button>

                           </form>

                        )}



                        <button

                           type="button"

                           className={`composer-action ${listening ? "recording" : ""}`}

                           aria-label={

                              listening

                                 ? "Stop recording"

                                 : message.trim()

                                    ? "Send message"

                                    : "Start voice input"

                           }

                           onClick={() => {

                              if (listening) {

                                 recognitionRef.current?.stop();

                                 return;

                              }



                              if (message.trim()) {

                                 sendMessage();

                                 return;

                              }



                              if (!recognitionRef.current) {

                                 setVoiceError(

                                    "Voice input is not supported in this browser."

                                 );

                                 return;

                              }



                              setVoiceError("");



                              try {

                                 recognitionRef.current.start();

                              } catch {

                                 setVoiceError(

                                    "Unable to start recording. Please try again."

                                 );

                              }

                           }}

                        >

                           {listening ? "Ⅱ" : message.trim() ? "↑" : "🎤"}

                        </button>

                     </div>



                     {voiceError && (

                        <p className="voice-error" role="status">

                           {voiceError}

                        </p>

                     )}



                     <div className="voice-preference">

                        <button

                           type="button"

                           onClick={() => {

                              const next = !voiceEnabled;



                              setVoiceEnabled(next);

                              voiceEnabledRef.current = next;



                              if (!next) {

                                 window.speechSynthesis.cancel();

                              }

                           }}

                        >

                           {voiceEnabled

                              ? "🔊 Spoken replies on"

                              : "🔇 Spoken replies off"}

                        </button>



                        {voiceEnabled && (

                           <button

                              type="button"

                              onClick={() => window.speechSynthesis.cancel()}

                           >

                              Stop audio

                           </button>

                        )}

                     </div>





                  <div className="chat-disclaimer">

                     Aura, your personal assistant for shopping.

                  </div>

               </section>

            )}



            <button

               className="chat-launcher"

               onClick={() => setChatOpen((open) => !open)}

               aria-label={chatOpen ? "Close assistant" : "Open shopping assistant"}

               aria-expanded={chatOpen}

            >

               <span>{chatOpen ? "×" : "✳"}</span>

               {!chatOpen && <span className="launcher-label">Ask Aura</span>}

            </button>

         </div>

      </div>

   );

}



export default App;