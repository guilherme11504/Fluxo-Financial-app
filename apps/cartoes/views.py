from django.contrib import messages
from django.shortcuts import render, redirect
from .models import Cartao
from django.contrib.auth.decorators import login_required    
from django.http import JsonResponse 



def cartoes(request):
    user = request.user
    cartoes = Cartao.objects.filter(usuario=user)
    return render(request, 'cartoes.html', {'cartoes': cartoes})

def register_view(request):
    if request.method != "POST":
        return redirect('dashboard:dashboard')

    user = request.user

    nome = request.POST.get('nome', '').strip()
    bandeira = request.POST.get('bandeira', '').strip()
    banco = request.POST.get('banco', '').strip()
    limite = request.POST.get('limite', '')
    dia_pagamento = request.POST.get('dia_pagamento', '')
    dia_fechamento = request.POST.get('dia_fechamento', '')
    ativo = request.POST.get('ativo') == 'on'

    # Validação de campos obrigatórios
    if not all([nome, bandeira, banco, limite, dia_pagamento, dia_fechamento]):
        messages.error(request, 'Preencha todos os campos obrigatórios.')
        return render(request, 'cartoes.html')

    # Conversões e validações numéricas
    try:
        limite = float(limite)
        dia_pagamento = int(dia_pagamento)
        dia_fechamento = int(dia_fechamento)
    except ValueError:
        return JsonResponse({'error': 'Valores inválidos para limite ou dias.'}, status=400)

    if limite <= 0:
        return JsonResponse({'error': 'Limite deve ser maior que zero.'}, status=400)

    if dia_fechamento == dia_pagamento:
        return JsonResponse({'error': 'Dia de fechamento e pagamento devem ser diferentes.'}, status=400)

    if dia_fechamento > dia_pagamento:
        return JsonResponse({'error': 'Dia de fechamento deve ser menor que o dia de pagamento.'}, status=400)

    if Cartao.objects.filter(nome=nome, usuario=user).exists():
        return JsonResponse({'error': 'Você já possui um cartão com esse nome.'}, status=400)

    # Criação do cartão
    try:
        Cartao.objects.create(
            nome=nome,
            bandeira=bandeira,
            banco=banco,
            limite=limite,
            dia_pagamento=dia_pagamento,
            dia_fechamento=dia_fechamento,
            ativo=ativo,
            usuario=user
        )

        cartao = Cartao.objects.get(nome=nome, usuario=user)
        
        return JsonResponse({
            'id': cartao.id,
            'nome': cartao.nome,
            'bandeira': cartao.bandeira,
            'banco': cartao.banco,
            'limite': cartao.limite,
            'dia_pagamento': cartao.dia_pagamento,
            'dia_fechamento': cartao.dia_fechamento,
            'ativo': cartao.ativo,
        }, status=201)              
    except Exception as e:
        return JsonResponse({'error': str(e)})


def delete_cartao(request):
    if request.method == 'POST':
        cartao_id = request.POST.get('cartao_id')
        try:
            cartao = Cartao.objects.get(id=cartao_id)
            cartao.delete()
            messages.success(request, 'Cartão excluído com sucesso.')
        except Cartao.DoesNotExist:
            messages.error(request, 'Cartão não encontrado.')
        except Exception as e:
            messages.error(request, f'Erro ao excluir cartão: {str(e)}')

    return redirect('cartoes:cartoes')

def update_cartao(request):
    if request.method == 'POST':
        cartao_id = request.POST.get('cartao_id')
        nome = request.POST.get('nome', '').strip()
        bandeira = request.POST.get('bandeira', '').strip()
        banco = request.POST.get('banco', '').strip()
        limite = request.POST.get('limite', '')
        dia_pagamento = request.POST.get('dia_pagamento', '')
        dia_fechamento = request.POST.get('dia_fechamento', '')
        ativo = request.POST.get('ativo') == 'on'

        # Validação de campos obrigatórios
        if not all([nome, bandeira, banco, limite, dia_pagamento, dia_fechamento]):
            messages.error(request, 'Preencha todos os campos obrigatórios.')
            return redirect('cartoes:cartoes')

        # Conversões e validações numéricas
        try:
            limite = float(limite)
            dia_pagamento = int(dia_pagamento)
            dia_fechamento = int(dia_fechamento)
        except ValueError:
            return JsonResponse({'error': 'Valores inválidos para limite ou dias.'}, status=400)

        if limite <= 0:
            return JsonResponse({'error': 'Limite deve ser maior que zero.'}, status=400)

        if dia_fechamento == dia_pagamento:
            return JsonResponse({'error': 'Dia de fechamento e pagamento devem ser diferentes.'}, status=400)

        if dia_fechamento > dia_pagamento:
            return JsonResponse({'error': 'Dia de fechamento deve ser menor que o dia de pagamento.'}, status=400)

        try:
            cartao = Cartao.objects.get(id=cartao_id)
            cartao.nome = nome
            cartao.bandeira = bandeira
            cartao.banco = banco
            cartao.limite = limite
            cartao.dia_pagamento = dia_pagamento
            cartao.dia_fechamento = dia_fechamento
            cartao.ativo = ativo
            cartao.save()

            return JsonResponse({
                'id': cartao.id,
                'nome': cartao.nome,
                'bandeira': cartao.bandeira,
                'banco': cartao.banco,
                'limite': cartao.limite,
                'dia_pagamento': cartao.dia_pagamento,
                'dia_fechamento': cartao.dia_fechamento,
                'ativo': cartao.ativo,
            }, status=200)
        except Cartao.DoesNotExist:
            return JsonResponse({'error': 'Cartão não encontrado.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método inválido.'}, status=405)
