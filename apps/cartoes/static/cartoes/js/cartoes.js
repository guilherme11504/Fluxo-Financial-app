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
  
            if (response.ok) {
              location.reload();
            } else {
              alert("Erro ao cadastrar cartão.");
            }
          } catch (err) {
            console.error(err);
            alert("Erro de conexão.");
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
  