const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;
const ARQUIVO = path.join(__dirname, "voluntarios.json");

app.use(cors());
app.use(express.json());

/* =========================
   FUNÇÕES AUXILIARES
========================= */

function lerVoluntarios() {
    if (!fs.existsSync(ARQUIVO)) {
        fs.writeFileSync(ARQUIVO, "[]");
    }

    return JSON.parse(fs.readFileSync(ARQUIVO, "utf8"));
}

function salvarVoluntarios(voluntarios) {
    fs.writeFileSync(
        ARQUIVO,
        JSON.stringify(voluntarios, null, 2)
    );
}

/* =========================
   HASH
========================= */

function gerarHash(valor) {
    return crypto
        .createHash("sha256")
        .update(valor)
        .digest("hex");
}

/* =========================
   ROTA PRINCIPAL
========================= */

app.get("/api", (req, res) => {
    res.json({
        mensagem: "API da ONG Esperança funcionando!",
        versao: "1.0.0"
    });
});

/* =========================
   LISTAR VOLUNTÁRIOS
========================= */

app.get("/api/voluntarios", (req, res) => {
    const voluntarios = lerVoluntarios();

    res.json(voluntarios);
});

/* =========================
   BUSCAR VOLUNTÁRIO
========================= */

app.get("/api/voluntarios/:id", (req, res) => {
    const voluntarios = lerVoluntarios();

    const voluntario = voluntarios.find(
        item => item.id === req.params.id
    );

    if (!voluntario) {
        return res.status(404).json({
            erro: "Voluntário não encontrado."
        });
    }

    res.json(voluntario);
});

/* =========================
   CADASTRAR VOLUNTÁRIO
========================= */

app.post("/api/voluntarios", (req, res) => {
    const {
        nome,
        email,
        telefone,
        cpf,
        tipoParticipacao,
        areaInteresse
    } = req.body;

    if (!nome || !email || !cpf) {
        return res.status(400).json({
            erro: "Nome, e-mail e CPF são obrigatórios."
        });
    }

    const voluntarios = lerVoluntarios();

    const cpfHash = gerarHash(cpf);

    const cpfExistente = voluntarios.some(
        item => item.cpfHash === cpfHash
    );

    if (cpfExistente) {
        return res.status(409).json({
            erro: "Este CPF já possui cadastro."
        });
    }

    const novoVoluntario = {
        id: crypto.randomUUID(),
        nome,
        email,
        telefone: telefone || "",
        cpfHash,
        tipoParticipacao: tipoParticipacao || "",
        areaInteresse: areaInteresse || "",
        criadoEm: new Date().toISOString()
    };

    voluntarios.push(novoVoluntario);

    salvarVoluntarios(voluntarios);

    res.status(201).json({
        mensagem: "Voluntário cadastrado com sucesso.",
        voluntario: novoVoluntario
    });
});

/* =========================
   SERVIDOR
========================= */

app.listen(PORT, () => {
    console.log(
        `API disponível em http://localhost:${PORT}/api`
    );
});