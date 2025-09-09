[16:49, 09/09/2025] André D. Santos: import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND = {
  name: 'Sua Loja',
  phone: '+55 11 90000-0000',
  waNumberClean: '5511900000000',
  heroTags: ['JFG Metais', 'Loja Online', 'Scroll Style Social Shop', 'Qualidade Garantida'],
  logoImage: '/logo.jpg',
};

const productsSeed = [
  { id: 1, title: 'Jaqueta Mostarda', price: 249.9, img: '/logo.jpg', tag: 'Nova', description: 'Jaqueta moderna em tom mostarda, perfeita para estilo urbano.' },
  { id: 2, title: 'Tênis Casual', price: 189.0, img: '/placeholder.png', tag: 'Promo', description: 'Tênis casual confortável e estiloso para o dia a dia.' },
  { id: 3, title: 'Bolsa Minimal', price: 149.5, img: '/placeholder.png', descrip…
[16:50, 09/09/2025] André D. Santos: import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND = {
  name: 'Sua Loja',
  phone: '+55 11 90000-0000',
  waNumberClean: '5511900000000',
  heroTags: ['JFG Metais', 'Loja Online', 'Scroll Style Social Shop', 'Qualidade Garantida'],
  logoImage: '/mnt/data/24d21195918dfe52308431825a280fe5.jpg',
};

const productsSeed = [
  { id: 1, title: 'Jaqueta Mostarda', price: 249.9, img: BRAND.logoImage, tag: 'Nova', description: 'Jaqueta moderna em tom mostarda, perfeita para estilo urbano.' },
  { id: 2, title: 'Tênis Casual', price: 189.0, img: 'https://via.placeholder.com/800x800?text=Tenis', tag: 'Promo', description: 'Tênis casual confortável e estiloso para o dia a dia.' },
  { id: 3, title: 'Bolsa Minimal', price: 149.5, img: 'https://via.placeholder.com/800x800?text=Bolsa', description: 'Bolsa minimalista para compor qualquer look com elegância.' },
  { id: 4, title: 'Camiseta Clean', price: 79.9, img: 'https://via.placeholder.com/800x800?text=Camiseta', description: 'Camiseta básica, confortável e versátil para o cotidiano.' },
  { id: 5, title: 'Boné Urban', price: 59.9, img: 'https://via.placeholder.com/800x800?text=Bone', description: 'Boné estiloso para acompanhar o look.' },
];

export default function App() {
  const [route, setRoute] = useState('home');
  const [products] = useState(productsSeed);
  const [cart, setCart] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace('#', '');
      setRoute(h || 'home');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== route) window.location.hash = route;
  }, [route]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(message) {
    setToastMsg(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 2200);
  }

  function addToCart(product) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(${product.title} adicionado ao carrinho);
  }

  function updateQtyById(id, qty) {
    const q = Number(qty);
    if (isNaN(q) || q < 1) return;
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: q } : p)));
  }

  function changeQtyById(id, delta) {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, (p.qty || 1) + delta) } : p)));
  }

  function removeFromCartById(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function totalCount() {
    return cart.reduce((s, it) => s + (it.qty || 0), 0);
  }

  function totalPrice() {
    return cart.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0);
  }

  function checkoutToWhatsApp() {
    if (!cart.length) { showToast('Seu carrinho está vazio ☺️'); return; }
    const lines = [
      'Olá, tenho interesse em comprar:',
      ...cart.map((p, i) => ${i + 1}) ${p.title} x${p.qty} — R$ ${(p.price * p.qty).toFixed(2)}),
      Total: R$ ${totalPrice().toFixed(2)},
      'Nome: ',
      'Endereço: ',
      'Observações: ',
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const wa = https://wa.me/${BRAND.waNumberClean}?text=${text};
    window.open(wa, '_blank');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header route={route} setRoute={setRoute} totalQty={totalCount()} />
      <AnimatePresence mode="wait">
        <motion.main key={route} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }} className="pt-24">
          {route === 'home' && <Home products={products} addToCart={addToCart} setRoute={setRoute} />}
          {route === 'shop' && <Shop products={products} addToCart={addToCart} />}
          {route === 'blog' && <Blog />}
          {route === 'about' && <About />}
          {route === 'contact' && <Contact brand={BRAND} />}
        </motion.main>
      </AnimatePresence>
      <FloatingCart cart={cart} route={route} removeById={removeFromCartById} updateQtyById={updateQtyById} changeQtyById={changeQtyById} clearCart={clearCart} checkout={checkoutToWhatsApp} />
      <Footer setRoute={setRoute} />
      {toastMsg && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 -translate-x-1/2 bottom-24 bg-black text-white px-4 py-2 rounded-lg z-50">{toastMsg}</motion.div>
      )}
    </div>
  );
}

function Header({ route, setRoute, totalQty }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={BRAND.logoImage} alt="logo" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-bold">{BRAND.name}</div>
            <div className="text-xs text-gray-600">Scroll style • Social shop</div>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-3 text-sm">
          <NavButton label="Home" active={route === 'home'} onClick={() => setRoute('home')} />
          <NavButton label="Loja" active={route === 'shop'} onClick={() => setRoute('shop')} />
          <NavButton label="Blog" active={route === 'blog'} onClick={() => setRoute('blog')} />
          <NavButton label="Sobre" active={route === 'about'} onClick={() => setRoute('about')} />
          <NavButton label="Contato" active={route === 'contact'} onClick={() => setRoute('contact')} />
          <div className="ml-2 px-3 py-1 rounded-full bg-orange-500 text-white text-xs">Carrinho ({totalQty})</div>
        </nav>
        <div className="sm:hidden flex items-center gap-2">
          <button onClick={() => setRoute('shop')} className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm">Loja</button>
          <button onClick={() => setRoute('contact')} className="px-3 py-1 rounded-full border">Contato</button>
        </div>
      </div>
    </header>
  );
}

function NavButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={px-2 py-1 rounded ${active ? 'bg-orange-100 text-orange-600' : 'text-gray-700'}}>{label}</button>
  );
}

function Home({ products, addToCart, setRoute }) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveHeroIndex((s) => (s + 1) % BRAND.heroTags.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-auto touch-pan-y">
      <section className="snap-start min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">{BRAND.heroTags[activeHeroIndex]}</span>
            <motion.h1 key={activeHeroIndex} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="text-3xl md:text-5xl font-extrabold leading-tight">Fashion & Accessories</motion.h1>
            <p className="text-gray-600">Design inspirado nas redes sociais: rolagem fluida, cards grandes e foco no produto. Paleta laranja, tipografia forte e chamadas diretas.</p>
            <div className="flex gap-3">
              <button onClick={() => setRoute('shop')} className="px-4 py-2 rounded-full bg-orange-500 text-white font-semibold shadow">Explorar coleção</button>
              <button className="px-4 py-2 rounded-full border border-gray-200">Saiba mais</button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
            <img src={BRAND.logoImage} alt="hero" className="w-full h-[420px] object-cover" />
          </div>
        </div>
      </section>

      <section className="snap-start min-h-[70vh] px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Destaques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (<ProductCard key={p.id} product={p} addToCart={addToCart} />))}
          </div>
        </div>
      </section>

      <section className="snap-start min-h-[50vh] px-4 py-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="font-semibold">"Produto excelente!"</div>
              <div className="text-sm text-gray-600">Cliente satisfeito</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="font-semibold">"Entrega super rápida"</div>
              <div className="text-sm text-gray-600">Cliente satisfeito</div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => window.location.hash = 'contact'} className="px-4 py-2 rounded-full bg-orange-500 text-white">Deixe sua avaliação</button>
            <button className="px-4 py-2 rounded-full border" onClick={() => setRoute('shop')}>Ver produtos</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  const [showDesc, setShowDesc] = useState(false);
  return (
    <motion.article layout whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-3 shadow hover:shadow-lg transition-shadow">
      <div className="relative rounded-xl overflow-hidden">
        <img src={product.img} alt={product.title} className="w-full h-64 object-cover" />
        {product.tag && <span className="absolute top-3 left-3 px-2 py-1 text-xs rounded bg-orange-500 text-white">{product.tag}</span>}
      </div>
      <div className="mt-3">
        <h3 className="font-semibold cursor-pointer" onClick={() => setShowDesc((s) => !s)} onMouseEnter={() => setShowDesc(true)} onMouseLeave={() => setShowDesc(false)}>{product.title}</h3>
        <AnimatePresence>{showDesc && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-gray-600 mt-1">{product.description}</motion.p>}</AnimatePresence>
        <div className="flex items-center justify-between mt-2">
          <div className="text-lg font-bold">R$ {product.price.toFixed(2)}</div>
          <button onClick={() => addToCart(product)} className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm">Comprar</button>
        </div>
      </div>
    </motion.article>
  );
}

function Shop({ products, addToCart }) {
  return (
    <section className="pt-24 px-4 pb-12 max-w-6xl mx-auto">
      <div className="bg-orange-500 text-white rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Loja</h1>
          <div className="text-sm">Coleção atual • Explore</div>
        </div>
        <div className="text-sm">Promoções e novidades</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow">
            <img src={p.img} alt={p.title} className="w-full h-56 object-cover rounded-md" />
            <div className="mt-3 flex justify-between items-center">
              <div>
                <div className="font-semibold cursor-pointer">{p.title}</div>
                <div className="text-sm text-gray-500">R$ {p.price.toFixed(2)}</div>
              </div>
              <button onClick={() => addToCart(p)} className="px-3 py-1 rounded-full bg-orange-500 text-white">Adicionar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Blog() {
  const posts = [
    { id: 1, title: 'Como usar cores para vender mais', excerpt: 'Técnicas rápidas e práticas para aplicar paletas que convertem.' },
    { id: 2, title: 'Fotografia para ecommerce', excerpt: 'Dicas para fotos estilo social feed que chamam atenção.' },
  ];
  return (
    <section className="pt-24 px-4 pb-12 max-w-4xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold mb-4">Blog</h2>
      {posts.map((p) => (
        <article key={p.id} className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold text-lg">{p.title}</h3>
          <p className="text-gray-600 mt-2">{p.excerpt}</p>
          <div className="mt-3">
            <button className="text-orange-600">Ler mais →</button>
          </div>
        </article>
      ))}
    </section>
  );
}

function About() {
  const faqs = [
    { q: 'Qual o prazo de entrega?', a: 'O prazo varia conforme a região, em média 5-10 dias úteis.' },
    { q: 'Posso trocar o produto?', a: 'Sim, aceitamos trocas em até 7 dias após o recebimento.' },
    { q: 'Como acompanho meu pedido?', a: 'Você receberá um código de rastreio por WhatsApp/email.' },
  ];
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="pt-24 px-4 pb-12 max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold mb-4">Sobre</h2>
      <p className="text-gray-700">Somos uma loja com estética inspirada nas redes sociais. Rolagem vertical tipo "feed", foco no produto e processos simples de compra via WhatsApp.</p>
      <img src="https://via.placeholder.com/1200x600?text=Sobre" alt="Sobre" className="w-full rounded-xl shadow" />
      <p className="text-gray-700">Nossa missão é trazer praticidade e estilo para sua experiência de compra, unindo design e funcionalidade.</p>
      <div className="mt-6">
        <h3 className="text-2xl font-bold mb-3">Perguntas Frequentes</h3>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full text-left flex justify-between items-center">
                <span className="font-medium">{f.q}</span>
                <span className="text-gray-500">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <div className="mt-2 text-gray-600">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ brand }) {
  return (
    <section className="pt-24 px-4 pb-12 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Contato</h2>
      <p className="mb-4">Para compras rápidas, use nosso WhatsApp: <strong>{brand.phone}</strong></p>
      <form className="space-y-3">
        <input className="w-full p-3 rounded border" placeholder="Nome" />
        <input className="w-full p-3 rounded border" placeholder="Email" />
        <textarea className="w-full p-3 rounded border" placeholder="Mensagem" rows={4} />
        <button className="px-4 py-2 bg-orange-500 text-white rounded">Enviar</button>
      </form>
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-3">Redes Sociais</h3>
        <div className="flex gap-4 items-center">
          <a href="#" aria-label="Facebook" className="p-3 rounded bg-blue-600 text-white">Facebook</a>
          <a href="#" aria-label="Instagram" className="p-3 rounded bg-pink-500 text-white">Instagram</a>
          <a href="#" aria-label="LinkedIn" className="p-3 rounded bg-blue-700 text-white">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}

function FloatingCart({ cart, route, removeById, updateQtyById, changeQtyById, clearCart, checkout }) {
  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0);
  const qty = cart.reduce((s, it) => s + (it.qty || 0), 0);
  const minimizedRoutes = ['blog', 'about', 'contact'];
  const [minimized, setMinimized] = useState(false);

  useEffect(() => { if (minimizedRoutes.includes(route)) setMinimized(true); else setMinimized(false); }, [route]);

  if (minimized && qty === 0) return null;

  return (
    <div className="fixed right-4 bottom-6 z-50 w-80 max-w-xs">
      <AnimatePresence>
        {!minimized && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white rounded-2xl shadow-xl p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Carrinho</div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500">{qty} items</div>
                <button onClick={() => setMinimized(true)} aria-label="minimizar" className="p-1 rounded hover:bg-gray-100">—</button>
              </div>
            </div>
            <div className="mt-3 max-h-48 overflow-auto space-y-3">
              {cart.length === 0 && <div className="text-sm text-gray-500">Seu carrinho está vazio</div>}
              {cart.map((p) => (
                <motion.div layout key={p.id} className="flex items-center gap-3">
                  <img src={p.img} alt={p.title} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-gray-500">R$ {(p.price * p.qty).toFixed(2)}</div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <button onClick={() => changeQtyById(p.id, -1)} className="px-2 py-0.5 rounded border">-</button>
                      <input type="number" value={p.qty} onChange={(e) => updateQtyById(p.id, e.target.value)} className="w-12 text-center p-1 rounded border" />
                      <button onClick={() => changeQtyById(p.id, 1)} className="px-2 py-0.5 rounded border">+</button>
                      <button onClick={() => removeById(p.id)} className="ml-2 text-xs text-red-500">remover</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-bold">R$ {total.toFixed(2)}</div>
              <div className="flex gap-2">
                <button onClick={clearCart} className="px-3 py-1 rounded-full border">Limpar</button>
                <motion.button onClick={() => { checkout(); }} whileTap={{ scale: 0.98 }} className="px-3 py-1 rounded-full bg-green-600 text-white">Comprar (WhatsApp)</motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {minimized && qty > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-full shadow p-2 flex items-center gap-3">
            <div className="px-3">Carrinho • {qty}</div>
            <div className="text-sm">R$ {total.toFixed(2)}</div>
            <div className="flex gap-2">
              <button onClick={() => setMinimized(false)} aria-label="expandir" className="px-2 py-1 rounded border">▢</button>
              <button onClick={checkout} className="px-3 py-1 rounded-full bg-green-600 text-white">Comprar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Footer({ setRoute }) {
  return (
    <footer className="mt-12 py-10">
      <div className="max-w-5xl mx-auto text-center text-sm text-gray-600">
        <div>© {new Date().getFullYear()} {BRAND.name} — Design inspirado em social feeds • Paleta laranja</div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button onClick={() => setRoute('about')} className="underline">Sobre</button>
          <button onClick={() => setRoute('contact')} className="underline">Contato</button>
        </div>
      </div>
    </footer>
  );
}
