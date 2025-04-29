import os
import shutil
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Cria um novo app, move para pasta apps/, ajusta apps.py e registra no settings.py'

    def add_arguments(self, parser):
        parser.add_argument('app_name', type=str, help='Nome do app (ex: cartoes)')

    def handle(self, *args, **options):
        app_name = options['app_name']
        project_root = os.getcwd()
        apps_dir = os.path.join(project_root, 'apps')
        app_path = os.path.join(apps_dir, app_name)

        if os.path.exists(app_path):
            raise CommandError(f"O app '{app_name}' já existe em apps/")

        # 1. Cria o app normalmente
        os.system(f"django-admin startapp {app_name}")

        # 2. Move o app para a pasta apps/
        shutil.move(app_name, apps_dir)

        # 3. Edita apps.py
        apps_file = os.path.join(app_path, 'apps.py')
        with open(apps_file, 'r') as file:
            content = file.read()
        content = content.replace(
            f"name = '{app_name}'",
            f"name = 'apps.{app_name}'"
        )
        content = content.replace(
            "verbose_name = ''",
            f"verbose_name = '{app_name.capitalize()}'"
        )
        
        with open(apps_file, 'w') as file:
            file.write(content)

        # 4. Adiciona ao settings.py
        settings_path = os.path.join(project_root, 'core', 'settings.py')  
        with open(settings_path, 'r') as file:
            settings = file.read()

        if f"'apps.{app_name}'" not in settings:
            new_app = f"'apps.{app_name}',"
            settings = settings.replace("INSTALLED_APPS = [", f"INSTALLED_APPS = [\n    {new_app}")
            with open(settings_path, 'w') as file:
                file.write(settings)

        self.stdout.write(self.style.SUCCESS(f"App '{app_name}' criado e configurado com sucesso."))
