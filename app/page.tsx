'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Check, Clock3, Eye, EyeOff, LogOut, Minus, Plus, Search, ShoppingBag } from 'lucide-react';

type Snack = { id: number; name: string; description: string; price: number; emoji: string; tone: string; category: string; popular?: boolean };

const snacks: Snack[] = [
  { id: 1, name: 'X-Salada da Casa', description: 'Carne, queijo, salada e molho especial', price: 13.9, emoji: '🍔', tone: 'yellow', category: 'Lanches', popular: true },
  { id: 2, name: 'Misto Quentinho', description: 'Presunto e queijo no pão prensado', price: 7.5, emoji: '🥪', tone: 'green', category: 'Lanches' },
  { id: 3, name: 'Coxinha Cremosa', description: 'Frango temperado e massa crocante', price: 7, emoji: '🍗', tone: 'purple', category: 'Salgados', popular: true },
  { id: 4, name: 'Pão de Queijo', description: 'Porção com 4 unidades assadas na hora', price: 6, emoji: '🧀', tone: 'peach', category: 'Salgados' },
  { id: 5, name: 'Suco de Laranja', description: 'Natural, geladinho e feito no dia', price: 6.5, emoji: '🍊', tone: 'orange', category: 'Bebidas' },
  { id: 6, name: 'Brownie', description: 'Chocolate macio com casquinha', price: 5.5, emoji: '🍫', tone: 'pink', category: 'Doces' },
];

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Home() {
  const [access, setAccess] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [ticket, setTicket] = useState<number | null>(null);
  const [orders, setOrders] = useState(false);

  const visibleSnacks = useMemo(() => snacks.filter((snack) => {
    const term = search.toLowerCase();
    return (filter === 'Todos' || snack.category === filter) && (!term || snack.name.toLowerCase().includes(term));
  }), [filter, search]);
  const items = snacks.filter((snack) => cart[snack.id]).map((snack) => ({ ...snack, qty: cart[snack.id] }));
  const total = items.reduce((sum, snack) => sum + snack.price * snack.qty, 0);
  const count = items.reduce((sum, snack) => sum + snack.qty, 0);

  const changeQty = (id: number, delta: number) => setCart((current) => {
    const next = { ...current };
    const value = (next[id] ?? 0) + delta;
    if (value <= 0) delete next[id]; else next[id] = value;
    return next;
  });

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user === 'admin' && password === 'admin') { setAccess(true); setError(''); }
    else setError('Use admin para usuário e senha.');
  };

  const submitOrder = () => {
    setTicket(Math.floor(Math.random() * 700) + 101);
    setCart({});
    setCartOpen(false);
  };

  if (!access) return (
    <main className="login-page">
      <div className="bubble bubble-a" /><div className="bubble bubble-b" />
      <section className="login-card">
        <div className="logo">F<span>✦</span></div>
        <p className="kicker">CANTINA DA ESCOLA</p>
        <h1>Fila Zero</h1>
        <p className="intro">Seu lanche pronto, sem perder o recreio na fila.</p>
        <form onSubmit={login}>
          <label>Usuário<input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Digite seu usuário" autoComplete="username" /></label>
          <label>Senha<div className="password-row"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Mostrar ou ocultar senha">{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="main-action" type="submit">Entrar no cardápio <span>→</span></button>
        </form>
        <p className="hint">Acesso de teste: <b>admin</b> / <b>admin</b></p>
      </section>
    </main>
  );

  return (
    <main className="app-bg"><div className="phone">
      <header><div><div className="brand"><i>F</i> Fila Zero</div><small>Olá, Admin! 👋</small></div><button className="logout" onClick={() => setAccess(false)} aria-label="Sair"><LogOut /></button></header>
      {orders ? <section className="orders-view"><div className="receipt">▤</div><p className="kicker">SEUS PEDIDOS</p><h1>{ticket ? 'Já estamos preparando!' : 'Nenhum pedido por aqui'}</h1>{ticket ? <div className="order-card"><div><span>SENHA</span><b>#{ticket}</b></div><p><strong><Clock3 /> Em preparo</strong>Aguarde este número aparecer no balcão.</p></div> : <p>Faça seu primeiro pedido e acompanhe por aqui.</p>}<button className="main-action" onClick={() => setOrders(false)}>Ver cardápio <span>→</span></button></section> : <section className="content">
        <div className="status"><i />Cantina aberta agora <span>até 18h</span></div>
        <section className="hero"><div><em>MAIS PEDIDO</em><h1>Combo do recreio</h1><p>X-Salada + fritas + suco</p><b>{brl.format(19.9)}</b><button onClick={() => changeQty(1, 1)}>Adicionar <Plus /></button></div><img src="combo-cantina.png" alt="Hambúrguer, batata frita e suco" /></section>
        <div className="section-title"><div><p className="kicker">ESCOLHA O SEU</p><h2>Cardápio de hoje</h2></div><small>{visibleSnacks.length} itens</small></div>
        <label className="search"><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar no cardápio" /></label>
        <div className="filters">{['Todos', 'Lanches', 'Salgados', 'Bebidas', 'Doces'].map((name) => <button key={name} className={filter === name ? 'selected' : ''} onClick={() => setFilter(name)}>{name}</button>)}</div>
        <div className="snacks">{visibleSnacks.map((snack) => <article key={snack.id} className="snack"><div className={`emoji ${snack.tone}`}>{snack.emoji}</div><div className="snack-text"><h3>{snack.name}{snack.popular && <span>Popular</span>}</h3><p>{snack.description}</p><div><b>{brl.format(snack.price)}</b>{cart[snack.id] ? <div className="stepper"><button onClick={() => changeQty(snack.id, -1)}><Minus /></button><strong>{cart[snack.id]}</strong><button onClick={() => changeQty(snack.id, 1)}><Plus /></button></div> : <button className="add" onClick={() => changeQty(snack.id, 1)}><Plus /></button>}</div></div></article>)}</div>
      </section>}
      {count > 0 && !orders && <button className="cart-bar" onClick={() => setCartOpen(true)}><span>{count}</span><p><b>Ver meu pedido</b><small>{count} {count === 1 ? 'item' : 'itens'}</small></p><b>{brl.format(total)}</b></button>}
      <nav><button className={!orders ? 'nav-active' : ''} onClick={() => setOrders(false)}>⌂<span>Cardápio</span></button><button className={orders ? 'nav-active' : ''} onClick={() => setOrders(true)}><ShoppingBag /><span>Pedidos</span>{ticket && <i />}</button></nav>
      {cartOpen && <div className="modal-bg"><section className="cart-modal"><button className="close" onClick={() => setCartOpen(false)}>×</button><h2>Seu pedido</h2><p>Confira os itens antes de enviar para a cantina.</p><div className="cart-items">{items.map((item) => <div key={item.id}><span>{item.emoji}</span><p><b>{item.name}</b><small>{brl.format(item.price)}</small></p><div className="stepper"><button onClick={() => changeQty(item.id, -1)}><Minus /></button><strong>{item.qty}</strong><button onClick={() => changeQty(item.id, 1)}><Plus /></button></div></div>)}</div><label className="note">Alguma observação?<textarea placeholder="Ex.: sem tomate" /></label><div className="total"><span>Total</span><b>{brl.format(total)}</b></div><button className="main-action" onClick={submitOrder}>Enviar pedido para a cantina <span>→</span></button></section></div>}
      {ticket && !cartOpen && <div className="modal-bg"><section className="success"><div>✓</div><h2>Pedido enviado!</h2><p>A cantina já recebeu seu pedido. Guarde a senha abaixo.</p><strong>#{ticket}</strong><article><Check /> Agora é só acompanhar. Quando ficar pronto, retire no balcão.</article><button className="main-action" onClick={() => { setTicket(ticket); setOrders(true); }}>Acompanhar pedido <span>→</span></button></section></div>}
    </div></main>
  );
}
