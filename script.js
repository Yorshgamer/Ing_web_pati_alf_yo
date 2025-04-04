document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll('.tabs button');
    const items = document.querySelectorAll('.gallery .item');
  
    botones.forEach(boton => {
      boton.addEventListener('click', () => {
        const categoria = boton.dataset.categoria.toLowerCase();
  
        botones.forEach(b => b.classList.remove('active'));
        boton.classList.add('active');
  
        items.forEach(item => {
          if (categoria === 'todos' || item.classList.contains(categoria)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
  
// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elementos del DOM
const cartModal = document.querySelector('.cart-modal');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const cartCount = document.querySelector('.cart-count');

// Abrir/cerrar carrito
document.querySelector('.cart-icon').addEventListener('click', () => {
  cartModal.classList.add('active');
});

document.querySelector('.close-cart').addEventListener('click', () => {
  cartModal.classList.remove('active');
});

// Agregar productos
document.querySelectorAll('.card button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.parentElement;
    const product = {
      name: card.querySelector('h3').textContent,
      price: parseFloat(card.querySelector('p').textContent.replace('S/', '')),
      image: card.querySelector('img').src,
      quantity: 1
    };
    
    addToCart(product);
  });
});

function addToCart(product) {
  const existingItem = cart.find(item => item.name === product.name);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push(product);
  }
  
  updateCart();
}

function updateCart() {
  // Guardar en localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Actualizar contador
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Actualizar items
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>S/ ${item.price.toFixed(2)} x ${item.quantity}</p>
        <button class="remove-item" data-name="${item.name}">Eliminar</button>
      </div>
    </div>
  `).join('');
  
  // Actualizar total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
  
  // Agregar eventos de eliminación
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const productName = button.dataset.name;
      cart = cart.filter(item => item.name !== productName);
      updateCart();
    });
  });
}

// Inicializar carrito
updateCart();