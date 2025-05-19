from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CharacterViewSet, AgeByMediaType
from .views import VideoDetailView,VideoListCreateView,VideoDownloadView, RegisterView, LoginView, LogTableView, MonitorTableView
from django.conf.urls.static import static
from django.conf import settings

router = DefaultRouter()
router.register(r'characters', CharacterViewSet, basename='character')

urlpatterns = [
    path('', include(router.urls)),
    path('videos/', VideoListCreateView.as_view(), name='video-list'),
    path('videos/<int:pk>/', VideoDetailView.as_view(), name='video-detail'),
    # Add a download view if needed
    path('videos/<int:pk>/download/', VideoDownloadView.as_view(), name='video-download'),
    path("statistics/age-by-media/", AgeByMediaType.as_view(), name="age-by-media"),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('log', LogTableView.as_view(), name='log-table'),
    path('monitored', MonitorTableView.as_view(), name='monitor-table')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)