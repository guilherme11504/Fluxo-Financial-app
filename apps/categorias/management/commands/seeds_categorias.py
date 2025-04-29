from django.core.management.base import BaseCommand
from apps.categorias.models import Categoria

class Command(BaseCommand):
    help = 'Popula categorias iniciais no banco de dados'

    def handle(self, *args, **options):
        categorias = [
            {"nome": "Salário", "tipo": "receita", "icone": "fa-briefcase"},
            {"nome": "Renda Extra", "tipo": "receita", "icone": "fa-coins"},
            {"nome": "Aluguel Recebido", "tipo": "receita", "icone": "fa-home"},
            {"nome": "Alimentação", "tipo": "despesa", "icone": "fa-utensils"},
            {"nome": "Aluguel", "tipo": "despesa", "icone": "fa-home"},
            {"nome": "Transporte", "tipo": "despesa", "icone": "fa-bus"},
            {"nome": "Educação", "tipo": "despesa", "icone": "fa-graduation-cap"},
            {"nome": "Saúde", "tipo": "despesa", "icone": "fa-heartbeat"},
            {"nome": "Lazer", "tipo": "despesa", "icone": "fa-gamepad"},
            {"nome": "Compras", "tipo": "despesa", "icone": "fa-shopping-cart"},
            {"nome": "Contas", "tipo": "despesa", "icone": "fa-file-invoice-dollar"},
            {"nome": "Cartão de Crédito", "tipo": "despesa", "icone": "fa-credit-card"},
            {"nome": "Viagem", "tipo": "despesa", "icone": "fa-plane"},
            {"nome": "Investimentos", "tipo": "despesa", "icone": "     "},
        ]

        for cat in categorias:
            Categoria.objects.get_or_create(nome=cat["nome"], tipo=cat["tipo"], icone=cat["icone"])

        self.stdout.write(self.style.SUCCESS('Categorias criadas com sucesso!'))
