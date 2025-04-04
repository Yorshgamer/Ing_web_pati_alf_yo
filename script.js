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
  
