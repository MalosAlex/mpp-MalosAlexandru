# Generated by Django 5.2 on 2025-05-07 08:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_rename_isadmin_user_is_admin_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='characters', to='api.user'),
        ),
    ]
