document.addEventListener("DOMContentLoaded", () => {
    console.log("O DOM foi completamente carregado e analisado!");

    const cpf = document.querySelector("#cpf");
    const telefone = document.querySelector("#telefone");
    const cep = document.querySelector("#cep");
    const formulario = document.querySelector("#formCadastro");
    const mensagem = document.querySelector("#mensagemFormulario");

    const botaoMenu = document.querySelector(".menu-hamburguer");
    const menuPrincipal = document.querySelector("#lista-navegacao");
    const seletorTema = document.querySelector("#seletor-tema");
    const linkAbrirDialog = document.querySelector("#abrir-aviso-dados");
    const dialogoDados = document.querySelector("#aviso-dados");

    if (seletorTema) {
        const preferenciasValidas = ["system", "light", "dark", "contrast"];
        let preferenciaTema = "system";

        try {
            const temaSalvo = localStorage.getItem("ong-tema");
            if (preferenciasValidas.includes(temaSalvo)) {
                preferenciaTema = temaSalvo;
            }
        } catch (erro) {
            console.error("Não foi possível ler a preferência de aparência:", erro);
        }

        function aplicarTema(tema) {
            if (tema === "system") {
                document.documentElement.removeAttribute("data-theme");
            } else {
                document.documentElement.setAttribute("data-theme", tema);
            }

            seletorTema.value = tema;
        }

        aplicarTema(preferenciaTema);

        seletorTema.addEventListener("change", () => {
            preferenciaTema = preferenciasValidas.includes(seletorTema.value)
                ? seletorTema.value
                : "system";
            aplicarTema(preferenciaTema);

            try {
                localStorage.setItem("ong-tema", preferenciaTema);
            } catch (erro) {
                console.error("Não foi possível guardar a preferência de aparência:", erro);
            }
        });
    }

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

            const dataAtual = new Date();
            const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }).format(dataAtual).replace(", ", " às ");

            const novoCadastro = {
                cpf: cpf.value,
                telefone: telefone.value,
                cep: cep.value,
                criadoEm: dataFormatada
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

    if (document.querySelector("#container-acoes")) {
        renderizarAcoes(acoesSociais);
    }

    /* =========================
       MENU HAMBÚRGUER
    ========================= */
    if (botaoMenu && menuPrincipal) {
        function definirEstadoMenu(aberto, devolverFoco = false) {
            menuPrincipal.classList.toggle("menu-aberto", aberto);
            botaoMenu.setAttribute("aria-expanded", String(aberto));
            botaoMenu.setAttribute(
                "aria-label",
                aberto ? "Fechar menu principal" : "Abrir menu principal"
            );

            if (devolverFoco) {
                botaoMenu.focus();
            }
        }

        botaoMenu.addEventListener("click", () => {
            definirEstadoMenu(
                botaoMenu.getAttribute("aria-expanded") !== "true"
            );
        });

        menuPrincipal.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => definirEstadoMenu(false));
        });

        document.addEventListener("keydown", (evento) => {
            if (
                evento.key === "Escape" &&
                botaoMenu.getAttribute("aria-expanded") === "true"
            ) {
                definirEstadoMenu(false, true);
            }
        });

        window.matchMedia("(min-width: 769px)").addEventListener("change", () => {
            definirEstadoMenu(false);
        });
    }

    if (
        linkAbrirDialog &&
        dialogoDados &&
        typeof dialogoDados.showModal === "function"
    ) {
        const botaoFecharDialog = dialogoDados.querySelector("[data-fechar-dialog]");

        linkAbrirDialog.addEventListener("click", () => {
            dialogoDados.showModal();
        });

        botaoFecharDialog?.addEventListener("click", () => {
            dialogoDados.close();
        });

        dialogoDados.addEventListener("cancel", (evento) => {
            evento.preventDefault();
            dialogoDados.close();
        });

        dialogoDados.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") {
                evento.preventDefault();
                dialogoDados.close();
            }
        });

        dialogoDados.addEventListener("close", () => {
            linkAbrirDialog.focus();
        });

        dialogoDados.addEventListener("click", (evento) => {
            if (evento.target === dialogoDados) {
                dialogoDados.close();
            }
        });
    }
});