// Importação da biblioteca Day.js via CDN (ES Module)
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm';

document.addEventListener("DOMContentLoaded", () => {
    console.log("O DOM foi completamente carregado e analisado!");
    

    const cpf = document.querySelector("#cpf");
    const telefone = document.querySelector("#telefone");
    const cep = document.querySelector("#cep");
    const formulario = document.querySelector("#formCadastro");
    const mensagem = document.querySelector("#mensagemFormulario");

    const botaoMenu = document.querySelector(".menu-hamburguer");
    const menuPrincipal = document.querySelector("#menu-principal");
    const dropdowns = document.querySelectorAll(".dropdown");
    const linksMenu = document.querySelectorAll("#menu-principal a");

    function somenteNumeros(valor) {
        return valor.replace(/\D/g, "");
    }

    /* =========================
       INJETAR FRAGMENTO HTML
    ========================= */
    function atualizarContainer(seletor, novoHTML) {
        const container = document.querySelector(seletor);

        if (!container) {
            console.warn(`Contêiner não encontrado: ${seletor}`);
            return false;
        }

        container.replaceChildren();
        container.insertAdjacentHTML("afterbegin", novoHTML);
        return true;
    }

    /* =========================
       MANIPULAÇÃO DE HASH
    ========================= */
    function navegarParaHash(hash) {
        if (!hash) return;

        const elemento = document.querySelector(hash);
        if (elemento) {
            elemento.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    navegarParaHash(window.location.hash);

    window.addEventListener("hashchange", () => {
        navegarParaHash(window.location.hash);
    });

    /* =========================
       MÁSCARAS DE ENTRADA
    ========================= */
    if (cpf) {
        cpf.addEventListener("input", (evento) => {
            let valor = somenteNumeros(evento.target.value).substring(0, 11);

            if (valor.length > 9) {
                valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            } else if (valor.length > 6) {
                valor = valor.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
            } else if (valor.length > 3) {
                valor = valor.replace(/(\d{3})(\d{3})/, "$1.$2");
            }

            evento.target.value = valor;
        });
    }

    if (telefone) {
        telefone.addEventListener("input", (evento) => {
            let valor = somenteNumeros(evento.target.value).substring(0, 11);

            if (valor.length > 10) {
                valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            } else if (valor.length > 6) {
                valor = valor.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
            } else if (valor.length > 2) {
                valor = valor.replace(/(\d{2})(\d+)/, "($1) $2");
            }

            evento.target.value = valor;
        });
    }

    if (cep) {
        cep.addEventListener("input", (evento) => {
            let valor = somenteNumeros(evento.target.value).substring(0, 8);

            if (valor.length > 5) {
                valor = valor.replace(/(\d{5})(\d{3})/, "$1-$2");
            }

            evento.target.value = valor;
        });
    }

    /* =========================
       VALIDAÇÃO E PERSISTÊNCIA (JSON + DAYJS)
    ========================= */
    if (formulario && mensagem) {
        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            if (!formulario.checkValidity()) {
                mensagem.textContent = "Por favor, verifique os campos destacados e corrija as informações.";
                mensagem.setAttribute("aria-live", "assertive");
                formulario.reportValidity();
                return;
            }

            const novoCadastro = {
                cpf: cpf.value,
                telefone: telefone.value,
                cep: cep.value,
                criadoEm: dayjs().format("DD/MM/YYYY [às] HH:mm")
            };

            let cadastrosSalvos = [];
            try {
                const dadosArmazenados = localStorage.getItem("cadastros_ong");
                if (dadosArmazenados) {
                    cadastrosSalvos = JSON.parse(dadosArmazenados);
                }
            } catch (erro) {
                console.error("Erro ao analisar dados do localStorage:", erro);
            }

            cadastrosSalvos.push(novoCadastro);
            localStorage.setItem("cadastros_ong", JSON.stringify(cadastrosSalvos));

            mensagem.textContent = "Cadastro realizado com sucesso! Obrigado por fazer parte da ONG Esperança.";
            mensagem.setAttribute("aria-live", "polite");
            formulario.reset();
        });
    }

    /* =========================
       ELEMENTOS DINÂMICOS (TEMPLATE LITERALS)
    ========================= */
    const acoesSociais = [
        { titulo: "Reforço Escolar", descricao: "Aulas de apoio para crianças e adolescentes da comunidade." },
        { titulo: "Distribuição de Alimentos", descricao: "Entrega mensal de cestas básicas para famílias cadastradas." },
        { titulo: "Inclusão Digital", descricao: "Oficinas básicas de informática para jovens e adultos." }
    ];

    function renderizarAcoes(dados) {
        const htmlCards = dados.map(acao => `
            <article class="card-acao">
                <h3>${acao.titulo}</h3>
                <p>${acao.descricao}</p>
            </article>
        `).join("");

        atualizarContainer("#container-acoes", htmlCards);
    }

    renderizarAcoes(acoesSociais);

    /* =========================
       MENU HAMBÚRGUER
    ========================= */
    if (botaoMenu && menuPrincipal) {
        botaoMenu.addEventListener("click", () => {
            const aberto = menuPrincipal.classList.toggle("menu-aberto");

            botaoMenu.classList.toggle("ativo", aberto);
            botaoMenu.setAttribute("aria-expanded", aberto);
            botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
        });
    }

    /* =========================
       MENU DROPDOWN
    ========================= */
    dropdowns.forEach((dropdown) => {
        const botao = dropdown.querySelector(".dropdown-botao");
        if (!botao) return;

        botao.addEventListener("click", (evento) => {
            evento.stopPropagation();
            const aberto = dropdown.classList.toggle("aberto");
            botao.setAttribute("aria-expanded", aberto);

            dropdowns.forEach((outroDropdown) => {
                if (outroDropdown !== dropdown) {
                    outroDropdown.classList.remove("aberto");
                    const outroBotao = outroDropdown.querySelector(".dropdown-botao");
                    if (outroBotao) {
                        outroBotao.setAttribute("aria-expanded", "false");
                    }
                }
            });
        });
    });

    /* =========================
       FECHAR AO CLICAR FORA
    ========================= */
    document.addEventListener("click", (evento) => {
        dropdowns.forEach((dropdown) => {
            if (!dropdown.contains(evento.target)) {
                dropdown.classList.remove("aberto");
                const botao = dropdown.querySelector(".dropdown-botao");
                if (botao) {
                    botao.setAttribute("aria-expanded", "false");
                }
            }
        });
    });

    /* =========================
       FECHAR MENU MOBILE AO CLICAR EM LINKS
    ========================= */
    linksMenu.forEach((link) => {
        link.addEventListener("click", () => {
            if (menuPrincipal && botaoMenu) {
                menuPrincipal.classList.remove("menu-aberto");
                botaoMenu.classList.remove("ativo");
                botaoMenu.setAttribute("aria-expanded", "false");
                botaoMenu.setAttribute("aria-label", "Abrir menu");
            }
        });
    });
});