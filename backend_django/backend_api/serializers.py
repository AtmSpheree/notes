from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Note


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'date_joined']


class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = ['title', 'description', 'date_created', 'date_updated']