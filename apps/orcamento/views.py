from django.shortcuts import render

from django.contrib.auth.decorators import login_required

def orcamento(request):
    """
    View para exibir a página de orçamento.
    """
    user = request.user
    # Aqui você pode buscar dados relacionados ao orçamento do usuário, se necessário.
    
    return render(request, 'orcamento.html', {'user': user})
