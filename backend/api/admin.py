from django.contrib import admin
from .models import Character, Media, User, LogTable, MonitoredUsers

# Register your models here.
admin.site.register(Character)
admin.site.register(Media)
admin.site.register(User)
admin.site.register(LogTable)
admin.site.register(MonitoredUsers)