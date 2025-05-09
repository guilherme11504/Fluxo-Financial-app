document.addEventListener("DOMContentLoaded", () => {
  const cadastrarBtn = document.querySelector("#btn-cadastrar-cartao");

  if (cadastrarBtn) {
      cadastrarBtn.addEventListener("click", () => {
          // Evita múltiplos modais
          if (document.querySelector("#modal-cadastro-cartao")) return;

          const modalHTML = `
              <div id="modal-cadastro-cartao" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-2xl text-white relative">
                      <h2 class="text-2xl font-bold mb-4">Cadastrar Novo Cartão</h2>

                      <div class="mb-4 ErrorContainer">
                          <p class="text-sm text-red-500 Error"></p>
                      </div>

                      <!-- Cartão visual -->
                      <div class="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-xl shadow mb-6">
                          <h3 class="text-xl font-semibold" id="preview-nome">Nome do Cartão</h3>
                          <p class="text-sm mt-1" id="preview-bandeira">Bandeira</p>
                          <p class="text-sm mt-1" id="preview-banco">Banco</p>
                          <p class="text-sm mt-1" id="preview-limite">Limite: R$ 0.00</p>
                          <p class="text-sm mt-1" id="preview-dia">Fechamento: -- | Pagamento: --</p>
                      </div>

                      <form id="form-cadastro-cartao">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" name="nome" placeholder="Nome do Cartão"class="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" oninput="atualizaPreview()" required>
                              <input type="text" name="bandeira" placeholder="Bandeira" class="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" oninput="atualizaPreview()" required>
                              <input type="text" name="banco" placeholder="Banco" class="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" oninput="atualizaPreview()" required>
                              <input type="number" step="0.01" name="limite" placeholder="Limite (R$)" class="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" oninput="atualizaPreview()" required>
                              <input type="number" name="dia_fechamento" placeholder="Dia do Fechamento" class="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" oninput="atualizaPreview()" required>
                              <input type="number" name="dia_pagamento" placeholder="Dia do Pagamento" class="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" oninput="atualizaPreview()" required>
                              <label class="flex items-center mt-2 col-span-2">
                                  <input type="checkbox" name="ativo" class="mr-2" checked> Cartão Ativo
                              </label>
                          </div>
                          <div class="mt-6 flex justify-end gap-4">
                              <button type="button" id="btn-cancelar" class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">Cancelar</button>
                              <button type="submit" class="px-6 py-2 bg-purple-500 rounded hover:bg-purple-600">Salvar</button>
                          </div>
                      </form>
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
