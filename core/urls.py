"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.views.static import serve
from django.conf import settings
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),

    # Com namespace para cada APP
    path('auth/', include(('apps.autenticacao.urls', 'auth'), namespace='auth')),
    path('dashboard/', include(('apps.dashboard.urls', 'dashboard'), namespace='dashboard')),
    path('cartoes/', include(('apps.cartoes.urls', 'cartoes'), namespace='cartoes')),
    path('categorias/', include(('apps.categorias.urls', 'categorias'), namespace='categorias')),
    path('emails/', include(('apps.emails.urls', 'emails'), namespace='emails')),
    path('orcamento/', include(('apps.orcamento.urls', 'orcamento'), namespace='orcamento')),

    # Redirecionamento para dashboard
    path('', lambda request: redirect('login', permanent=True)),
]

