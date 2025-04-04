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

// === FUNCIONALIDAD DEL FORMULARIO ===
document.addEventListener("DOMContentLoaded", function() {
  // Controles de cantidad (+/-)
  document.querySelectorAll('.cantidad-btn').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input');
      let value = parseInt(input.value);
      
      if (button.dataset.action === 'increment') {
        value++;
      } else {
        value = value > 1 ? value - 1 : 1;
      }
      
      input.value = value;
    });
  });

  // Envío del formulario con SweetAlert2
  const formulario = document.getElementById('formulario-pedido');
  formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;

    // Validación simple
    if (!nombre || !producto || !cantidad) {
      Swal.fire({
        title: '¡Oops!',
        text: 'Por favor completa todos los campos',
        icon: 'error',
        confirmButtonColor: '#d2691e'
      });
      return;
    }

    // Modal de confirmación
    Swal.fire({
      title: '¿Confirmar pedido?',
      html: `
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Producto:</strong> ${producto} (x${cantidad})</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d2691e',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, enviar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¡Pedido enviado!',
          text: 'Gracias por tu compra. Nos contactaremos pronto.',
          icon: 'success',
          confirmButtonColor: '#d2691e'
        });
        formulario.reset(); // Limpiar formulario
      }
    });
  });
});

// Inicializar carrito
updateCart();