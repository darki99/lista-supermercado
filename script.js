/*************************************************
 * VARIABLES GLOBALES
 *************************************************/
const form = document.getElementById("product-form");
const productName = document.getElementById("product-name");
const productQuantity = document.getElementById("product-quantity");
const productList = document.getElementById("product-list");
const errorMessage = document.getElementById("error-message");

const totalSpan = document.getElementById("total");
const completedSpan = document.getElementById("completed");
const pendingSpan = document.getElementById("pending");

/*************************************************
 * FUNCIÓN: Crear un producto dinámicamente
 *************************************************/
function createProduct(name, quantity) {
  const li = document.createElement("li");

  // Texto del producto
  li.textContent = `${name} (${quantity})`;

  // Botón eliminar
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", () => {
    li.remove();
    updateCounters();
  });

  // Marcar como comprado
  li.addEventListener("click", () => {
    li.classList.toggle("comprado");
    updateCounters();
  });

  li.appendChild(deleteBtn);
  productList.appendChild(li);
}

/*************************************************
 * VALIDACIÓN Y ENVÍO DEL FORMULARIO
 *************************************************/
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = productName.value.trim();
  const quantity = Number(productQuantity.value);

  if (name === "" || quantity <= 0) {
    errorMessage.textContent =
      "⚠️ El nombre no puede estar vacío y la cantidad debe ser mayor a 0.";
    return;
  }

  errorMessage.textContent = "";

  createProduct(name, quantity);
  updateCounters();
  form.reset();
});

/*************************************************
 * CONTADORES
 *************************************************/
function updateCounters() {
  const total = document.querySelectorAll("#product-list li").length;
  const completed = document.querySelectorAll("#product-list li.comprado").length;

  totalSpan.textContent = total;
  completedSpan.textContent = completed;
  pendingSpan.textContent = total - completed;
}

/*************************************************
 * LOCAL STORAGE - GUARDAR
 *************************************************/
function updateStorage() {
  const products = [];

  document.querySelectorAll("#product-list li").forEach(li => {
    const text = li.firstChild.textContent;
    const [name, qty] = text.replace(")", "").split(" (");

    products.push({
      name: name,
      quantity: Number(qty),
      bought: li.classList.contains("comprado")
    });
  });

  localStorage.setItem("products", JSON.stringify(products));
}

/*************************************************
 * LOCAL STORAGE - CARGAR
 *************************************************/
function loadStorage() {
  const data = JSON.parse(localStorage.getItem("products")) || [];

  data.forEach(p => {
    createProduct(p.name, p.quantity);
    const lastItem = productList.lastChild;

    if (p.bought) {
      lastItem.classList.add("comprado");
    }
  });

  updateCounters();
}

/*************************************************
 * ACTUALIZA STORAGE EN CADA CAMBIO
 *************************************************/
// Sobrescribimos eventos para guardar cambios
productList.addEventListener("click", updateStorage);
form.addEventListener("submit", updateStorage);

// Aqui cargamos productos al iniciar la página
loadStorage();
