# Generated by Django 5.2 on 2025-05-07 13:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_character_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='media',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='characters', to='api.media'),
        ),
    ]
