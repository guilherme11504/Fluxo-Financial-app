import os
import shutil
import subprocess
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Cria um novo app, move para apps/, ajusta apps.py, adiciona static/, urls.py e registra no settings.py'

    def add_arguments(self, parser):
        parser.add_argument('app_name', type=str, help='Nome do app (ex: cartoes)')

    def handle(self, *args, **options):
        app_name = options['app_name']
        project_root = os.getcwd()
        apps_dir = os.path.join(project_root, 'apps')
        app_path = os.path.join(apps_dir, app_name)

        if os.path.exists(app_path):
            raise CommandError(f"O app '{app_name}' já existe em apps/")

        # 1. Criar o app com django-admin
        subprocess.run(['django-admin', 'startapp', app_name])

        # 2. Mover para apps/
        shutil.move(app_name, apps_dir)

        # 3. Ajustar apps.py
        apps_file = os.path.join(app_path, 'apps.py')
        with open(apps_file, 'r') as file:
            content = file.read()

        content = content.replace(
            f"name = '{app_name}'",
            f"name = 'apps.{app_name}'"
        )

        with open(apps_file, 'w') as file:
            file.write(content)

        # 4. Criar urls.py básico
        urls_file = os.path.join(app_path, 'urls.py')
        with open(urls_file, 'w') as file:
            file.write(
                "from django.urls import path\n"
                "from . import views\n\n"
                "urlpatterns = [\n"
                "    # path('', views.index, name='index'),\n"
                "]\n"
            )

        # 5. Criar estrutura static
        static_base = os.path.join(app_path, 'static', app_name)
        os.makedirs(os.path.join(static_base, 'css'), exist_ok=True)
        os.makedirs(os.path.join(static_base, 'js'), exist_ok=True)
        os.makedirs(os.path.join(static_base, 'images'), exist_ok=True)

        # 6. Registrar no settings.py
        settings_path = os.path.join(project_root, 'core', 'settings.py')
        with open(settings_path, 'r') as file:
            settings_content = file.read()

        new_app = f"'apps.{app_name}',"
        if new_app not in settings_content:
            if 'INSTALLED_APPS = [' in settings_content:
                settings_content = settings_content.replace(
                    'INSTALLED_APPS = [',
                    f'INSTALLED_APPS = [\n    {new_app}'
                )
            else:
                raise CommandError("INSTALLED_APPS não encontrado no settings.py")

            with open(settings_path, 'w') as file:
                file.write(settings_content)

        self.stdout.write(self.style.SUCCESS(f"App '{app_name}' criado e configurado com sucesso."))
