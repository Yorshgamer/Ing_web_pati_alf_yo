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
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-name="${item.name}">-</button>
          <span class="item-quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-name="${item.name}">+</button>
        </div>
        <p>S/ ${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-item" data-name="${item.name}">Eliminar</button>
      </div>
    </div>
  `).join('');
  
  // Actualizar total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productName = e.target.dataset.name;
      const item = cart.find(item => item.name === productName);
      
      if (e.target.classList.contains('plus')) {
        item.quantity++;
      } else if (e.target.classList.contains('minus')) {
        item.quantity = Math.max(1, item.quantity - 1);
      }
      
      updateCart();
    });
  });
  // Agregar eventos de eliminación
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', async () => {
      const productName = button.dataset.name;
      
      const { isConfirmed } = await Swal.fire({
        title: '¿Eliminar producto?',
        text: '¿Estás seguro que deseas eliminar este artículo del carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5c3d2e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#fff9f0',
        iconColor: '#5c3d2e'
      });
      
      if (isConfirmed) {
        cart = cart.filter(item => item.name !== productName);
        updateCart();
        
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido removido del carrito',
          icon: 'success',
          confirmButtonColor: '#5c3d2e',
          background: '#fff9f0'
        });
      }
    });
  });
}

// Manejar checkout
document.querySelector('.checkout').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  cartModal.classList.remove('active');
  document.querySelector('.checkout-modal').style.display = 'flex';
});

// Cerrar checkout
document.querySelector('.close-checkout').addEventListener('click', () => {
  document.querySelector('.checkout-modal').style.display = 'none';
});

// Seleccionar método de pago
document.querySelectorAll('.payment-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
  });
});

// Manejar confirmación de compra
document.getElementById('checkout-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Validación básica
  const inputs = document.querySelectorAll('#checkout-form input');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) isValid = false;
  });
  
  if (!isValid) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  // Simular procesamiento
  document.querySelector('.confirm-purchase').innerHTML = 
    '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  
  setTimeout(() => {
    alert('¡Compra exitosa! Tu pedido está en camino');
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    document.querySelector('.checkout-modal').style.display = 'none';
    document.querySelector('.confirm-purchase').innerHTML = 'Confirmar Compra';
  }, 2000);
});

// Cerrar modales al hacer click fuera
window.onclick = function(e) {
  if (e.target == document.querySelector('.checkout-modal')) {
    document.querySelector('.checkout-modal').style.display = 'none';
  }
}
// Inicializar carrito
updateCart();
