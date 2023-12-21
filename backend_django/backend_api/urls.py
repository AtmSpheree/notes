from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path


urlpatterns = [
    path('note/', views.note_view, name='note'),
    path('note/<int:note_id>', views.note_view, name='note'),
    path('notes', views.notes_view, name='notes'),
    path('notes/<int:user_id>', views.notes_view, name='notes'),
    path('user', views.user_view, name='user'),
    path('token/obtain', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh')
]