import app from "./app.js";

const PORT = process.env.PORT || 8081;
if (!process.env.JWT_SECRET) {
    throw new Error("Defina JWT_SECRET no backend/.env");
}

app.listen(PORT, () => {
    console.log(
        `Servidor rodando na portinha => http://localhost:${PORT}/`
    );
});
