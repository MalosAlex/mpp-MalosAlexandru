from django.apps import AppConfig
import threading
import time
from django.utils.timezone import now, timedelta

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
   
    def ready(self):
        # Only import models inside methods, not at module level
        def monitor_logs():
            # Import models here to avoid circular imports
            from .models import LogTable, MonitoredUsers, User
            
            # Give Django time to fully initialize
            time.sleep(5)
            
            while True:
                try:
                    time.sleep(10)  # every 10 seconds
                    cutoff = now() - timedelta(seconds=10)
                    log_entries = LogTable.objects.filter(timestamp__gte=cutoff)
                    user_action_counts = {}
                    print(log_entries)
                    
                    for entry in log_entries:
                        if entry.user:
                            user_action_counts[entry.user] = user_action_counts.get(entry.user, 0) + 1
                            
                    for user, count in user_action_counts.items():
                        if count >= 10:
                            obj, created = MonitoredUsers.objects.get_or_create(user=user)
                            if created:
                                print(f"Suspicious activity detected for user {user.username} with {count} actions.")
                            else:
                                obj.last_detected = now()
                                obj.save()
                except Exception as e:
                    print(f"Error in monitor_logs: {e}")
                    # Wait before trying again
                    time.sleep(10)
        
        # Only start thread if this is the main process (not in test or shell)
        import sys
        if not any(['test' in arg for arg in sys.argv]) and 'shell' not in sys.argv:
            thread = threading.Thread(target=monitor_logs, daemon=True)
            thread.start()