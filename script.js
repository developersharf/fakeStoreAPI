const productContainer = document.getElementById("productContainer");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const shippingEl = document.getElementById("shipping");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const couponInput = document.getElementById("couponInput");
const applyCouponBtn = document.getElementById("applyCoupon");
const balanceEl = document.getElementById("balance");
const addMoneyBtn = document.getElementById("addMoney");
const balanceWarning = document.getElementById("balanceWarning");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutMessage = document.getElementById("checkoutMessage");

let cart = [];
let discountValue = 0;
let balance = localStorage.getItem("userBalance")
  ? parseFloat(localStorage.getItem("userBalance"))
  : 1000;

balanceEl.textContent = `${balance.toFixed(2)} BDT`;

function saveBalance() {
  localStorage.setItem("userBalance", balance.toFixed(2));
}

function updateCart() {
  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price;

    const li = document.createElement("li");
    li.className = "flex justify-between items-center py-3";
    li.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-cover rounded">
        <span class="text-gray-700 text-sm">${item.title}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-gray-900 font-medium">${item.price.toFixed(2)} BDT</span>
        <button class="text-red-500 hover:text-red-700 text-sm">Remove</button>
      </div>
    `;
    li.querySelector("button").addEventListener("click", () => removeFromCart(index));
    cartItems.appendChild(li);
  });

  const delivery = cart.length ? 50 : 0;
  const shipping = cart.length ? 30 : 0;
  const discount = subtotal * discountValue;
  const total = subtotal + delivery + shipping - discount;

  subtotalEl.textContent = `${subtotal.toFixed(2)} BDT`;
  deliveryEl.textContent = `${delivery.toFixed(2)} BDT`;
  shippingEl.textContent = `${shipping.toFixed(2)} BDT`;
  discountEl.textContent = `-${discount.toFixed(2)} BDT`;
  totalEl.textContent = `${total.toFixed(2)} BDT`;

  balanceWarning.textContent = total > balance ? "⚠️ Not enough balance!" : "";
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

applyCouponBtn.addEventListener("click", () => {
  const code = couponInput.value.trim().toUpperCase();
  if (code === "SMART10") {
    discountValue = 0.1;
    alert("Coupon applied! 10% discount added.");
  } else {
    discountValue = 0;
    alert("Invalid coupon code.");
  }
  updateCart();
});

addMoneyBtn.addEventListener("click", () => {
  balance += 1000;
  saveBalance();
  balanceEl.textContent = `${balance.toFixed(2)} BDT`;
  updateCart();
});


fetch("https://fakestoreapi.com/products")
  .then(res => {
    if (!res.ok) throw new Error("Network response error");
    return res.json();
  })
  .then(data => {
    const limitedProducts = data.slice(0, 6);
    limitedProducts.forEach(product => {
      const card = document.createElement("div");
      card.className = "group relative bg-white p-4 rounded-md shadow hover:shadow-lg transition";

      const rating = product.rating?.rate ? product.rating.rate.toFixed(2) : "N/A";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" 
          class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-64"/>
        <div class="mt-4">
          <h3 class="text-sm text-gray-700 font-semibold">${product.title}</h3>
          <p class="text-sm text-gray-500">Rating: ${rating} ⭐</p>
          <p class="text-sm font-medium text-gray-900 mb-2">${product.price.toFixed(2)} BDT</p>
          <button class="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 transition w-full">
            Add to Cart
          </button>
        </div>
      `;

      card.querySelector("button").addEventListener("click", () => addToCart(product));
      productContainer.appendChild(card);
    });
  })
  .catch(err => {
    productContainer.innerHTML = `<p class="text-red-500">Error loading products. Please try again.</p>`;
    console.error("Fetch error:", err);
  });

checkoutBtn.addEventListener("click", () => {
  let subtotal = 0;
  cart.forEach(item => subtotal += item.price);
  const delivery = cart.length ? 50 : 0;
  const shipping = cart.length ? 30 : 0;
  const discount = subtotal * discountValue;
  const total = subtotal + delivery + shipping - discount;

  if (cart.length === 0) {
    checkoutMessage.textContent = "Your cart is empty.";
    checkoutMessage.classList.add("text-red-600");
    return;
  }

  if (total > balance) {
    checkoutMessage.textContent = "Insufficient balance. Please add more money.";
    checkoutMessage.classList.add("text-red-600");
    return;
  }

  balance -= total;
  saveBalance();
  balanceEl.textContent = `${balance.toFixed(2)} BDT`;
  cart = [];
  updateCart();

  checkoutMessage.textContent = "✅ Purchase successful! Thank you for shopping.";
  checkoutMessage.classList.remove("text-red-600");
  checkoutMessage.classList.add("text-green-600");

  setTimeout(() => {
    checkoutMessage.textContent = "";
  }, 4000);
});



const backToTopBtn = document.getElementById("backToTop");

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTopBtn.style.display = "inline-block";
  } else {
    backToTopBtn.style.display = "none";
  }
});




const themeToggleBtn = document.getElementById("themeToggle");


const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}


themeToggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});


