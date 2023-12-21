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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user_view(request: Request):
    return Response({
        'data': UserSerializer(request.user).data
    })


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def note_view(request: Request, note_id: int = None):
    if request.method == 'GET':
        try:
            if request.user.is_superuser:
                note = Note.objects.get(id=note_id)
            else:
                note = Note.objects.get(user=request.user, id=note_id)
        except Exception:
            return Response(status=400)
        serializer = NoteSerializer(note)
        try:
            return Response({"data": serializer.data})
        except Exception:
            return Response(status=500)
    elif request.method == 'POST':
        if note_id is not None:
            try:
                if request.user.is_superuser:
                    note = Note.objects.get(id=note_id)
                else:
                    note = Note.objects.get(user=request.user, id=note_id)
            except:
                return Response(status=400)
            try:
                serializer = NoteSerializer(data=request.data, instance=note)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(status=201)
            except Exception:
                return Response(status=400)
        serializer = NoteSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            note = Note(**serializer.data)
            note.user = request.user
            note.save()
            return Response(status=201)
        except Exception:
            return Response(status=400)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def notes_view(request: Request, user_id: int = None):
    if request.method == 'GET':
        if user_id is not None:
            notes = Note.objects.filter(user=User.objects.filter(id=user_id).first()).all()
            if not notes:
                return Response(status=400)
            serializer = NoteSerializer(notes, many=True)
            try:
                return Response({"data": serializer.data})
            except Exception:
                return Response(status=500)
        else:
            if request.user.is_superuser:
                notes = Note.objects.all()
                serializer = NoteSerializer(notes, many=True)
                try:
                    return Response({"data": serializer.data})
                except Exception:
                    return Response(status=500)
            return Response(status=403)
    elif request.method == 'POST':
        if user_id is not None:
            return Response(status=400)
        if request.user.is_superuser:
            serializer = NoteSerializer(data=request.data, many=True)
            if not serializer.is_valid():
                return Response(400)
            for note in serializer.data:
                try:
                    note_obj = Note(title=note['title'], description=note['description'])
                    note_obj.user = request.user
                    note_obj.save()
                except Exception:
                    return Response(400)
            return Response(201)
        return Response(status=403)
