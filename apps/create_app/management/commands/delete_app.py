import os
import shutil
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Remove um app da pasta apps/ e do settings.py'

    def add_arguments(self, parser):
        parser.add_argument('app_name', type=str, help='Nome do app a ser removido (ex: cartoes)')

    def handle(self, *args, **options):
        app_name = options['app_name']
        project_root = os.getcwd()
        apps_dir = os.path.join(project_root, 'apps')
        app_path = os.path.join(apps_dir, app_name)

        if not os.path.exists(app_path):
            raise CommandError(f"O app '{app_name}' não existe em apps/")

        # 1. Remover o diretório
        shutil.rmtree(app_path)
        self.stdout.write(self.style.SUCCESS(f"Pasta apps/{app_name} removida."))

        # 2. Remover do settings.py
        settings_path = os.path.join(project_root, 'core', 'settings.py')
        with open(settings_path, 'r') as file:
            lines = file.readlines()

        app_ref = f"'apps.{app_name}',"
        new_lines = [line for line in lines if app_ref not in line]

        with open(settings_path, 'w') as file:
            file.writelines(new_lines)

        self.stdout.write(self.style.SUCCESS(f"App '{app_name}' removido de settings.py com sucesso."))
