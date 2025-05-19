from django.core.management.base import BaseCommand
from faker import Faker
from api.models import Media, Character
from django.db.models import Avg
import random

class Command(BaseCommand):
    help = 'Populate the database with fake data'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Prefix used to identify generated entries
        GENERATED_PREFIX = "FAKEGEN_"
        
        media_objs = []
        for _ in range(100000):
            name = GENERATED_PREFIX + fake.unique.company() + str(random.randint(1, 100000)) + '_' + str(random.randint(1, 100000))
            media_objs.append(Media(name=name, typeOfMedia=random.choice(['Movie', 'Video Game', 'Books', 'Series'])))

        Media.objects.bulk_create(media_objs)
        all_media = list(Media.objects.filter(name__startswith=GENERATED_PREFIX))

        characters = []
        for _ in range(100000):
            name = GENERATED_PREFIX + fake.first_name() + fake.last_name() + str(random.randint(1, 100000)) + '_' + str(random.randint(1, 100000))
            characters.append(Character(
                name=name,
                age=random.randint(10, 80),
                typeOfCharacter=random.choice(['Protagonist', 'Antagonist', 'Love Option']),
                backstory=fake.text(),
                image=fake.image_url(),
                media=random.choice(all_media)
            ))

        Character.objects.bulk_create(characters)
        self.stdout.write(self.style.SUCCESS("Populated 100,000 characters and 100,000 media entries"))

        Character.objects.select_related('media').values('media__typeOfMedia').annotate(avg_age=Avg('age')).order_by('media__typeOfMedia')

    def delete():
        # Prefix used to identify generated entries
        GENERATED_PREFIX = "FAKEGEN_"

        # Delete only previously generated entries
        Character.objects.filter(name__startswith=GENERATED_PREFIX).delete()
        Media.objects.filter(name__startswith=GENERATED_PREFIX).delete()