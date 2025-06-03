document.addEventListener("DOMContentLoaded", () => {
  const cadastrarBtn = document.querySelector("#btn-cadastrar-cartao");

  if (cadastrarBtn) {
      cadastrarBtn.addEventListener("click", () => {
          // Evita múltiplos modais
          if (document.querySelector("#modal-cadastro-cartao")) return;

          const modalHTML = `
              <div id="modal-cadastro-cartao" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-5xl text-white relative">
    <h2 class="text-3xl font-bold mb-6 text-center">Cadastrar Novo Cartão</h2>

    <div class="mb-4 ErrorContainer">
      <p class="text-sm text-red-500 Error text-center"></p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 items-center">
      <!-- Formulário -->
      <form id="form-cadastro-cartao" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1" for="nome">Nome do Cartão</label>
          <input type="text" name="nome" id="nome"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            oninput="atualizaPreview()" required>
        </div>

        <label class="block text-sm font-semibold mb-1" for="bandeira">Bandeira</label>
        <select name="bandeira" id="bandeira"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        onchange="atualizaPreview()" required>
        <option value="" disabled selected>Selecione a bandeira</option>
        <option value="Visa">Visa</option>
        <option value="MasterCard">MasterCard</option>
        <option value="Elo">Elo</option>
        <option value="American Express">American Express</option>
        <option value="Hipercard">Hipercard</option>
        <option value="Diners Club">Diners Club</option>
        <option value="Discover">Discover</option>
        </select>


        <div>
          <label class="block text-sm font-semibold mb-1" for="banco">Banco</label>
          <input type="text" name="banco" id="banco"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            oninput="atualizaPreview()" required>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="limite">Limite (R$)</label>
          <input type="number" step="0.01" name="limite" id="limite"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            oninput="atualizaPreview()" required>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="dia_fechamento">Dia do Fechamento</label>
          <input type="number" name="dia_fechamento" id="dia_fechamento"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            oninput="atualizaPreview()" required>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1" for="dia_pagamento">Dia do Pagamento</label>
          <input type="number" name="dia_pagamento" id="dia_pagamento"
            class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            oninput="atualizaPreview()" required>
        </div>

        <!-- Toggle Ativo -->
        <div class="flex items-center justify-between mt-4">
        <label for="ativo" class="text-sm font-semibold">Cartão Ativo</label>
        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" name="ativo" id="ativo" class="sr-only peer" checked>
            <div
            class="w-11 h-6 bg-gray-600 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:bg-purple-500 relative transition-colors duration-300">
            <span
                class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></span>
            </div>
        </label>
        </div>


        <!-- Botões -->
        <div class="mt-6 flex justify-end gap-4">
          <button type="button" id="btn-cancelar"
            class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit"
            class="px-6 py-2 bg-purple-500 rounded hover:bg-purple-600 transition">Salvar</button>
        </div>
      </form>

      <!-- Cartão visual -->
      <div
        class="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-xl shadow w-full max-w-md mx-auto">
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

          // Ativa preview inicial
          atualizaPreview();

          // Fechar modal
          document.querySelector("#btn-cancelar").addEventListener("click", () => {
              document.querySelector("#modal-cadastro-cartao").remove();
          });

          // Submeter via AJAX
          const form = document.querySelector("#form-cadastro-cartao");
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
                const response = await fetch("/cartoes/register_card/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "X-CSRFToken": getCookie("csrftoken"),
                    },
                    body: data.toString(),
                });
        
                const json = await response.json();
        
                if (response.ok && json.id) {
                    // Sucesso: fecha modal
                    document.querySelector("#modal-cadastro-cartao").remove();
                
                    // Ícone de sucesso visível
                    const check = document.createElement("div");
                    check.innerHTML = `<i class="fa-solid fa-check"></i> Cartão cadastrado!`;
                    check.classList.add(
                        "fixed", "top-4", "right-4", "text-green-500", "text-xl", "bg-gray-800",
                        "px-4", "py-2", "rounded-lg", "shadow-lg", "z-50", "flex", "items-center", "gap-2", "animate-fade"
                    );
                    document.body.appendChild(check);
                    setTimeout(() => check.remove(), 3000);
                
                    // Insere novo cartão na tabela
                    const cartoesContainer = document.querySelector("#cartoes-container");
                    const cartaoHTML = `
                        <tr class="border-b border-gray-700 hover:bg-gray-700">
                            <td class="px-4 py-2">${json.id}</td>
                            <td class="px-4 py-2">${json.nome}</td>
                            <td class="px-4 py-2">${json.data_criacao}</td>
                            <td class="px-4 py-2">
                                <button class="px-4 py-2 bg-red-500 rounded hover:bg-red-600">Excluir</button>
                            </td>
                        </tr>
                    `;
                    cartoesContainer.insertAdjacentHTML("beforeend", cartaoHTML);
                
                    // Remove aviso "sem cartões" se existir
                    const no_cards = document.querySelector("#sem-cartoes");
                    if (no_cards) {
                        no_cards.remove();
                    }
                }else {
                    const errorContainer = document.querySelector(".Error");
                    errorContainer.textContent = json.error || "Erro ao cadastrar cartão.";
                    errorContainer.style.display = "block";
                    setTimeout(() => {
                        errorContainer.style.display = "none";
                    }, 3000);
                }
            } catch (err) {
                console.error(err);
                alert("Erro de conexão com o servidor.");
            }
        });        
      });
  }

  // CSRF helper
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
});

// Preview dinâmico
function atualizaPreview() {
  const nome = document.querySelector('[name="nome"]')?.value || "Nome do Cartão";
  const bandeira = document.querySelector('[name="bandeira"]')?.value || "Bandeira";
  const banco = document.querySelector('[name="banco"]')?.value || "Banco";
  const limite = document.querySelector('[name="limite"]')?.value || "0.00";
  const fechamento = document.querySelector('[name="dia_fechamento"]')?.value || "--";
  const pagamento = document.querySelector('[name="dia_pagamento"]')?.value || "--";

  document.getElementById("preview-nome").textContent = nome;
  document.getElementById("preview-bandeira").textContent = bandeira;
  document.getElementById("preview-banco").textContent = banco;
  document.getElementById("preview-limite").textContent = `Limite: R$ ${limite}`;
  document.getElementById("preview-dia").textContent = `Fechamento: ${fechamento} | Pagamento: ${pagamento}`;
}
