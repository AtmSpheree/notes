from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Note
from django.contrib.auth.models import User


# Create your views here.
class UserView(APIView):
    @authentication_classes([JWTAuthentication])
    @permission_classes([IsAuthenticated])
    def get(self, request: Request):
        return Response({
            'data': UserSerializer(request.user).data
        })


@api_view(['GET', 'POST'])
def note_view(request: Request, id: int = None):
    if request.method == 'GET':
        note = Note.objects.filter(user=request.user, id=id).first()
        if not note:
            return Response(status=400)
        serializer = NoteSerializer(note)
        if serializer.is_valid():
            return Response({"data": serializer.data})
        return Response(status=500)
    elif request.method == 'POST':
        if id is not None:
            return Response(status=400)
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            note = Note(**serializer.data)
            note.user = request.user
            note.save()
            return Response(status=201)
        return Response(status=400)


@api_view(['GET', 'POST'])
def notes_view(request: Request, user_id: int = None):
    if request.method == 'GET':
        if user_id is not None:
            notes = Note.objects.filter(user=User.objects.filter(id=user_id).first()).all()
            if not notes:
                return Response(status=400)
            serializer = NoteSerializer(data=notes, many=True)
            if serializer.is_valid():
                return Response({"data": serializer.data})
            return Response(status=500)
        else:
            if request.user.is_superuser:
                notes = Note.objects.all()
                serializer = NoteSerializer(data=notes, many=True)
                if serializer.is_valid():
                    return Response({"data": serializer.data})
                return Response(status=500)
            return Response(status=403)
    elif request.method == 'POST':
        if user_id is not None:
            return Response(status=400)
        if request.user.is_superuser:
            serializer = NoteSerializer(data=request.data, many=True)
            if not serializer.data:
                return Response(400)
            for note in serializer.data:
                try:
                    note_obj = Note(title=note.title, description=note.description)
                    note_obj.user = request.user
                    note_obj.save()
                except Exception:
                    return Response(400)
            return Response(200)
        return Response(status=403)
