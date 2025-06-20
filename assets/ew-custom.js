document.addEventListener('DOMContentLoaded', function () {
  const addButtons = document.querySelectorAll('a[data-add-option]');

  async function openMiniCart() {
    document.body.classList.add('mini-cart--opening');

    setTimeout(() => {
      document.body.classList.remove('mini-cart--opening');
      document.body.classList.add('mini-cart--open');

      const cartDrawer = document.querySelector('.cart-drawer-container');
      if (cartDrawer) {
        cartDrawer.classList.add('menu-opening');
        cartDrawer.setAttribute('open', '');
      }
    }, 500);
  }

  // ✅ New function using section rendering
  async function renderMiniCartSection() {
    try {
      const res = await fetch('/?sections=mini-cart'); // change `mini-cart` to your actual section ID
      const data = await res.json();
      const miniCartContainer = document.querySelector('.mini-cart'); // wrapper in your HTML

      if (miniCartContainer && data['mini-cart']) {
        miniCartContainer.innerHTML = data['mini-cart'];
        console.log('Mini-cart section updated using section rendering');
      }
    } catch (err) {
      console.error('Failed to render mini-cart section:', err);
    }
  }

  addButtons.forEach(btn => {
    btn.addEventListener('click', async function () {
      const variantId = this.getAttribute('data-variant');

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              id: variantId,
              quantity: 1
            }]
          })
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData?.description || 'Something went wrong.');
          return;
        }

        await openMiniCart();
        await renderMiniCartSection(); // ✅ Use new section rendering method

      } catch (err) {
        console.error('Unexpected error:', err);
        alert('Something went wrong while adding the product.');
      }
    });
  });
});