from django.shortcuts import render

# Create your views here.


def cartoes(request):
    return render(request, 'cartoes.html')