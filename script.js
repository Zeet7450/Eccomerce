// Script for navigation bar
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// Fungsi Notifikasi (Hanya untuk Mobile)
function showNotification(message) {
    // Cek apakah dalam mode mobile
    if (window.innerWidth <=  799 && 477) { // Sesuaikan dengan breakpoint responsive Anda
        try {
            // Hapus notifikasi sebelumnya jika ada
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.classList.add('notification');
            notification.textContent = message;
            
            // Tambahkan ke body
            document.body.appendChild(notification);
            
            // Event listener untuk animasi
            notification.addEventListener('animationend', (event) => {
                if (event.animationName === 'slideOut') {
                    notification.remove();
                }
            });

            // Tambahkan timeout untuk menghapus notifikasi
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 3000);
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    }
}

// CSS untuk Notifikasi (Hanya Mobile)
const style = document.createElement('style');
style.textContent = `
    @media screen and (max-width: 799px) {
        .notification {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: #06402B;
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 1000;
            animation: slideIn 0.5s ease, slideOut 0.5s ease 2.5s forwards;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-100%);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideOut {
            0% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-100%);
            }
        }
    }

    /* Sembunyikan notifikasi di desktop */
    @media screen and (min-width: 800px) {
        .notification {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Fungsi untuk menambahkan ke keranjang dengan notifikasi mobile
function addToCart(event) {
    // Cari elemen produk terdekat
    const productElement = event.target.closest('.pro');
    
    if (!productElement) return;

    // Ambil detail produk
    const product = {
        id: productElement.dataset.productId || Date.now().toString(),
        name: productElement.querySelector('.des h5').textContent,
        price: productElement.querySelector('.des h4').textContent,
        image: productElement.querySelector('img').src
    };

    // Dapatkan cart items dari localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Cek apakah produk sudah ada di keranjang
    const existingProductIndex = cartItems.findIndex(
        item => item.id === product.id
    );

    if (existingProductIndex > -1) {
        // Jika produk sudah ada, tambahkan kuantitas
        cartItems[existingProductIndex].quantity = 
            (cartItems[existingProductIndex].quantity || 1) + 1;
    } else {
        // Jika produk baru, tambahkan ke keranjang
        cartItems.push({
            ...product,
            quantity: 1
        });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update badge keranjang
    updateCartBadge();

    // Tampilkan notifikasi HANYA di mobile
    if (window.innerWidth <= 799) {
        showNotification(`${product.name} berhasil ditambahkan ke keranjang`);
    }
}

// Pastikan untuk menambahkan event listener
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan event listener ke semua tombol keranjang
    const cartButtons = document.querySelectorAll('.fal.fa-shopping-cart.cart');
    cartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
});