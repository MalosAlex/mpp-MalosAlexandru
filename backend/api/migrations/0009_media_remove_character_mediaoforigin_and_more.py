# Generated by Django 5.2 on 2025-05-05 09:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_character_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('typeOfMedia', models.CharField(max_length=200)),
            ],
        ),
        migrations.RemoveField(
            model_name='character',
            name='mediaOfOrigin',
        ),
        migrations.RemoveField(
            model_name='character',
            name='typeOfMedia',
        ),
        migrations.AddField(
            model_name='character',
            name='media',
            field=models.ManyToManyField(related_name='characters', to='api.media'),
        ),
    ]
