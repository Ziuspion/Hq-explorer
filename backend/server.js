const express = require("express");
const cors = require("cors");
const path = require("path");
const hqs = require("./data/hq.json");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use("/fotos", express.static(path.join(__dirname, "data", "img")));

function sortear(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return null;
    }

    return array[Math.floor(Math.random() * array.length)];
}

function responderComImagem(res, imagePath, categoria) {
    return res.json({
        status: "success",
        categoria,
        image: `http://localhost:${PORT}/fotos/${imagePath}`
    });
}

app.get("/api/hqs/aleatorio", (_req, res) => {
    const categorias = Object.entries(hqs);
    const escolhida = sortear(categorias);

    if (!escolhida) {
        return res.status(404).json({
            status: "error",
            message: "Nenhuma HQ está disponível."
        });
    }

    const [categoria, imagens] = escolhida;
    const imagePath = sortear(imagens);
    if (!imagePath) {
        return res.status(404).json({
            status: "error",
            message: `Nenhuma HQ disponível na categoria "${categoria}".`
        });
    }

    return responderComImagem(res, imagePath, categoria);
});

app.get("/api/hqs/:categoria", (req, res) => {
    const categoria = req.params.categoria.toLowerCase();
    const imagens = hqs[categoria];

    if (!imagens) {
        return res.status(404).json({
            status: "error",
            message: `A categoria "${categoria}" não existe. Categorias disponíveis: ${Object.keys(hqs).join(", ")}.`
        });
    }

    const imagePath = sortear(imagens);
    if (!imagePath) {
        return res.status(404).json({
            status: "error",
            message: `Nenhuma HQ disponível na categoria "${categoria}".`
        });
    }

    return responderComImagem(res, imagePath, categoria);
});

app.listen(PORT, () => {
    console.log(`Servidor de HQs rodando em http://localhost:${PORT}`);
    console.log(`Imagens servidas de: ${path.join(__dirname, "data", "img")}`);
});
