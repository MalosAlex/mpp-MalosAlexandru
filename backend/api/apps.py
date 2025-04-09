from django.apps import AppConfig



class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    

    def ready(self):
        from .entity_generator import start_entity_generator
        
        start_entity_generator()
