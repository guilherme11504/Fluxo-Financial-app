document.addEventListener("DOMContentLoaded", () => {
  const cadastrarBtn = document.querySelector("#btn-cadastrar-cartao");

  if (cadastrarBtn) {
      cadastrarBtn.addEventListener("click", () => {
        // Evita múltiplos modais
        if (document.querySelector("#modal-cartao")) return;
  
        const modalHTML = `
          <div id="modal-cartao" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white text-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <h2 class="text-xl font-semibold mb-4">Cadastrar Cartão</h2>
              <form id="form-cartao">
                <label class="block mb-2 font-medium">Nome do Cartão</label>
                <input name="nome" type="text" required
                       class="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-emerald-500"/>
  
                <div class="flex justify-end gap-2">
                  <button type="button" id="btn-cancelar" 
                          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800">
                    Cancelar
                  </button>
                  <button type="submit" 
                          class="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        `;
  
        document.body.insertAdjacentHTML("beforeend", modalHTML);
  
        // Fechar modal
        document.querySelector("#btn-cancelar").addEventListener("click", () => {
          document.querySelector("#modal-cartao").remove();
        });
  
        // Submeter formulário
        document.querySelector("#form-cartao").addEventListener("submit", async (e) => {
          e.preventDefault();
          const nome = e.target.nome.value;
  
          try {
            const response = await fetch("/cartoes/cadastrar/", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": getCookie("csrftoken"),
              },
              body: new URLSearchParams({ nome }),
            });
        
            try {
                const response = await fetch("/cartoes/register/", {
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
