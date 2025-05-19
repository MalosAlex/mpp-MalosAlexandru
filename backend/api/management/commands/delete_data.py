from django.core.management.base import BaseCommand
from api.models import Media, Character


class Command(BaseCommand):
    help = 'Delete from the database the fake data'

    def handle(self, *args, **kwargs):
        # Prefix used to identify generated entries
        GENERATED_PREFIX = "FAKEGEN_"

        # Delete only previously generated entries
        Character.objects.filter(name__startswith=GENERATED_PREFIX).delete()
        Media.objects.filter(name__startswith=GENERATED_PREFIX).delete()