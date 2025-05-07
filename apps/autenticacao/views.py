# autenticacao/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        senha = request.POST['senha']
        user = authenticate(request, username=username, password=senha)
        if user:
            login(request, user)
            return redirect('dashboard') 
        else:
            messages.error(request, 'Usuário ou(e) senha incorretos.')
            return render(request, 'login.html')
    return render(request, 'login.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        senha = request.POST['senha']
        #verifica se o e-mail já existe
        if User.objects.filter(email=email).exists():
            messages.error(request, 'E-mail ja cadastrado.')
            return render(request, 'register.html')
        user = User.objects.create_user(username=username, email=email, password=senha)
        return redirect('login')
    return render(request, 'register.html')
