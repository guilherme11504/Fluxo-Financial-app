document.addEventListener("DOMContentLoaded", () => {
  // Botão principal de "Cadastrar novo cartão"
  const cadastrarBtn = document.querySelector("#btn-cadastrar-cartao");

  if (cadastrarBtn) {
    cadastrarBtn.addEventListener("click", () => {
      abrirModalCartao({ modo: "cadastrar" });
    });
  }

  // Adiciona listeners de edição e exclusão
  adicionarListenersCartoes();

  // Helpers
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

function adicionarListenersCartoes() {
  const container = document.querySelector("#cartoes-container");

  container.addEventListener("click", async (e) => {
    const excluirBtn = e.target.closest(".btn-excluir");
    const editarBtn = e.target.closest(".btn-editar");

    if (excluirBtn) {
      const id = excluirBtn.dataset.id;
      if (confirm("Tem certeza que deseja excluir este cartão?")) {
        try {
          const response = await fetch(`/cartoes/delete_card/${id}/`, {
            method: "POST",
            headers: {
              "X-CSRFToken": getCookie("csrftoken"),
            },
          });

          if (response.ok) {
            excluirBtn.closest("tr").remove();

            // Se a tabela ficou vazia, insere o aviso
            if (container.children.length === 0) {
              container.innerHTML = `
                <tr id="sem-cartoes">
                    <td colspan="4" class="px-4 py-4 text-center text-gray-400">
                        Nenhum cartão cadastrado ainda.
                    </td>
                </tr>
              `;
            }
          } else {
            alert("Erro ao excluir cartão.");
          }
        } catch (error) {
          console.error(error);
          alert("Erro de conexão.");
        }
      }
    }

    if (editarBtn) {
      abrirModalCartao({
        modo: "editar",
        id: editarBtn.dataset.id,
        nome: editarBtn.dataset.nome,
        banco: editarBtn.dataset.banco,
        bandeira: editarBtn.dataset.bandeira,
        limite: editarBtn.dataset.limite,
        dia_fechamento: editarBtn.dataset.dia_fechamento,
        dia_pagamento: editarBtn.dataset.dia_pagamento,
        ativo: editarBtn.dataset.ativo === "True",
      });
    }
  });
}


  // Função para abrir o modal (tanto cadastrar quanto editar)
  function abrirModalCartao({
    modo = "cadastrar",
    id = "",
    nome = "",
    banco = "",
    bandeira = "",
    limite = "",
    dia_fechamento = "",
    dia_pagamento = "",
    ativo = true,
  }) {
    if (document.querySelector("#modal-cadastro-cartao")) return;

    const titulo =
      modo === "editar" ? "Editar Cartão" : "Cadastrar Novo Cartão";
    const url =
      modo === "editar"
        ? `/cartoes/edit_card/${id}/`
        : "/cartoes/register_card/";

    const modalHTML = `
<div id="modal-cadastro-cartao" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-5xl text-white relative">
    <h2 class="text-3xl font-bold mb-6 text-center">${titulo}</h2>

    <div class="mb-4 ErrorContainer">
      <p class="text-sm text-red-500 Error text-center"></p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 items-center">
      <!-- Formulário -->
      <form id="form-cadastro-cartao" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1" for="nome">Nome do Cartão</label>
          <input type="text" name="nome" id="nome"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
            required>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="bandeira">Bandeira</label>
          <select name="bandeira" id="bandeira"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white" required>
            <option value="">Selecione a bandeira</option>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="Elo">Elo</option>
            <option value="American Express">American Express</option>
            <option value="Hipercard">Hipercard</option>
            <option value="Diners Club">Diners Club</option>
            <option value="Discover">Discover</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="banco">Banco</label>
          <input type="text" name="banco" id="banco"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600" required>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="limite">Limite (R$)</label>
          <input type="number" step="0.01" name="limite" id="limite"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600" required>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="dia_fechamento">Dia do Fechamento</label>
          <input type="number" name="dia_fechamento" id="dia_fechamento"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600" required>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="dia_pagamento">Dia do Pagamento</label>
          <input type="number" name="dia_pagamento" id="dia_pagamento"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600" required>
        </div>

        <div class="flex items-center justify-between mt-4">
          <label for="ativo" class="text-sm font-semibold">Cartão Ativo</label>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" name="ativo" id="ativo" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-500 relative transition-colors">
              <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
            </div>
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button type="button" id="btn-cancelar" class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">Cancelar</button>
          <button type="submit" class="px-6 py-2 bg-purple-500 rounded hover:bg-purple-600">Salvar</button>
        </div>
      </form>

      <!-- Cartão visual -->
      <div class="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-xl shadow w-full max-w-md mx-auto">
        <h3 class="text-xl font-semibold mb-2" id="preview-nome">Nome do Cartão</h3>
        <p class="text-sm" id="preview-bandeira">Bandeira</p>
        <p class="text-sm" id="preview-banco">Banco</p>
        <p class="text-sm" id="preview-limite">Limite: R$ 0.00</p>
        <p class="text-sm" id="preview-dia">Fechamento: -- | Pagamento: --</p>
      </div>
    </div>
  </div>
</div>
`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const form = document.querySelector("#form-cadastro-cartao");
    form.action = url;

    // Preencher campos no modo editar
    document.querySelector("#nome").value = nome;
    document.querySelector("#banco").value = banco;
    document.querySelector("#bandeira").value = bandeira;
    document.querySelector("#limite").value = parseFloat(limite.replace(",", "."));
    document.querySelector("#dia_fechamento").value = dia_fechamento;
    document.querySelector("#dia_pagamento").value = dia_pagamento;
    document.querySelector("#ativo").checked = ativo;

    atualizaPreview();

    document.querySelector("#btn-cancelar").addEventListener("click", () => {
      document.querySelector("#modal-cadastro-cartao").remove();
    });

    form.addEventListener("input", atualizaPreview);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = new URLSearchParams();
      formData.forEach((value, key) => {
        if (key === "ativo") {
          data.append(key, "on");
        } else {
          data.append(key, value);
        }
      });

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: data.toString(),
        });

        const json = await response.json();
        if (response.ok && json.id) {
          document.querySelector("#modal-cadastro-cartao").remove();
          location.reload(); // recarrega a página para refletir a atualização
        } else {
          const errorContainer = document.querySelector(".Error");
          errorContainer.textContent = json.error || "Erro ao salvar cartão.";
          errorContainer.style.display = "block";
          setTimeout(() => (errorContainer.style.display = "none"), 3000);
        }
      } catch (err) {
        console.error(err);
        alert("Erro de conexão.");
      }
    });
  }
});

// Preview dinâmico do cartão visual
function atualizaPreview() {
  document.getElementById("preview-nome").textContent =
    document.querySelector("#nome")?.value || "Nome do Cartão";
  document.getElementById("preview-bandeira").textContent =
    document.querySelector("#bandeira")?.value || "Bandeira";
  document.getElementById("preview-banco").textContent =
    document.querySelector("#banco")?.value || "Banco";
  document.getElementById("preview-limite").textContent =
    "Limite: R$ " + (document.querySelector("#limite")?.value || "0.00");
  document.getElementById("preview-dia").textContent =
    "Fechamento: " +
    (document.querySelector("#dia_fechamento")?.value || "--") +
    " | Pagamento: " +
    (document.querySelector("#dia_pagamento")?.value || "--");
}
