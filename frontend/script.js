const hqImage = document.getElementById("hqImage");
const categoryName = document.getElementById("categoryName");
const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const categoryInput = document.getElementById("categoryInput");
const hqArea = document.querySelector(".hq-area");

const API = "http://localhost:3000/api/hqs";

async function buscarHq(url) {
  hqArea.classList.add("loading");
  hqImage.removeAttribute("src");
  categoryName.textContent = "";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      categoryName.textContent = data.message || "Não foi possível encontrar essa categoria.";
      return;
    }

    if (!data.image || !data.categoria) {
      console.error("Resposta inesperada da API:", data);
      categoryName.textContent = "A API respondeu em um formato inesperado. Confira os dados retornados pelo servidor.";
      return;
    }

    hqImage.src = data.image;
    categoryName.textContent = data.categoria.replace(/[-_]/g, " ");
  } catch (error) {
    categoryName.textContent = "Não foi possível conectar à API. Confira se o servidor está ligado.";
    console.error("Erro ao buscar HQ:", error);
  } finally {
    hqArea.classList.remove("loading");
  }
}

hqImage.addEventListener("error", () => {
  hqImage.removeAttribute("src");
  categoryName.textContent = "A API respondeu, mas a imagem não carregou. Confira a URL, a rota /fotos e se o arquivo existe.";
});

function hqAleatoria() {
  buscarHq(`${API}/aleatorio`);
}

function buscarPorCategoria() {
  const categoria = categoryInput.value.trim().toLowerCase();

  if (!categoria) {
    categoryName.textContent = "Digite uma categoria para buscar.";
    return;
  }

  buscarHq(`${API}/${encodeURIComponent(categoria)}`);
}

randomBtn.addEventListener("click", hqAleatoria);
searchBtn.addEventListener("click", buscarPorCategoria);

categoryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscarPorCategoria();
  }
});

hqAleatoria();
