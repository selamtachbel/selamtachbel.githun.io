/* ---------- Simple Cart (localStorage) ---------- */
function getCart() {
return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
localStorage.setItem('cart', JSON.stringify(cart));
}

/* Add from the store pages */
function addToCart(name, price) {
const cart = getCart();
const found = cart.find(x => x.name === name);
if (found) found.qty += 1;
else cart.push({ name, price, qty: 1 });
saveCart(cart);
if (typeof window !== 'undefined') alert(`${name} added to cart`);
}

/* Cart operations used on cart.html */
function removeItem(index) {
const cart = getCart();
cart.splice(index, 1);
saveCart(cart);
const root = document.getElementById('cart-root');
if (root) renderCart(root);
}
function setQty(index, qty) {
const cart = getCart();
if (qty <= 0) cart.splice(index, 1);
else cart[index].qty = qty;
saveCart(cart);
const root = document.getElementById('cart-root');
if (root) renderCart(root);
}

/* ---------- Cart Renderer (used by cart.html) ---------- */
function renderCart(root) {
if (!root) return;
const cart = getCart();

if (cart.length === 0) {
root.innerHTML = `<div class="empty muted">Your cart is empty.</div>`;
// hide the Continue button when empty
const actions = document.getElementById('checkout-actions');
if (actions) actions.style.display = 'none';
return;
}

const rows = cart.map((item, i) => `
<tr>
<td>${item.name}</td>
<td>$${item.price.toFixed(2)}</td>
<td>
<div class="qty">
<button onclick="setQty(${i}, ${item.qty - 1})">−</button>
<span>${item.qty}</span>
<button onclick="setQty(${i}, ${item.qty + 1})">+</button>
</div>
</td>
<td>$${(item.price * item.qty).toFixed(2)}</td>
<td><button class="btn alt" onclick="removeItem(${i})">Remove</button></td>
</tr>
`).join('');

const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

root.innerHTML = `
<table>
<thead>
<tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
</thead>
<tbody>${rows}</tbody>
</table>
<div class="total">Total: $${total.toFixed(2)}</div>
`;

// show the Continue button when there are items
const actions = document.getElementById('checkout-actions');
if (actions) actions.style.display = 'flex';
}

/* ---------- Continue → Checkout ---------- */
function goToCheckout() {
const cart = getCart();
if (!cart.length) { alert('Your cart is empty.'); return; }
const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
sessionStorage.setItem('checkout_total', total.toFixed(2)); // pass total
location.href = 'checkout.html';
}