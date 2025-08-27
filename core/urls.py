from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),

    # Com namespace para cada APP
    path('auth/', include(('apps.autenticacao.urls', 'auth'), namespace='auth')),
    path('dashboard/', include(('apps.dashboard.urls', 'dashboard'), namespace='dashboard')),
    path('cartoes/', include(('apps.cartoes.urls', 'cartoes'), namespace='cartoes')),
    path('categorias/', include(('apps.categorias.urls', 'categorias'), namespace='categorias')),
    path('emails/', include(('apps.emails.urls', 'emails'), namespace='emails')),
    path('orcamento/', include(('apps.orcamento.urls', 'orcamento'), namespace='orcamento')),

    # Redireciona a URL raiz para o login
    path('', lambda request: redirect('auth:login', permanent=False)),
]
