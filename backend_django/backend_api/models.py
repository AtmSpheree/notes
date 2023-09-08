from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    title = models.CharField(max_length=25, null=False, blank=False)
    description = models.CharField(max_length=200, null=True, blank=True)
