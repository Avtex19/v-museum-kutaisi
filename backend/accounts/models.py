from django.contrib.auth.models import User
from django.db import models


class UserTokenVersion(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='token_version')
    version = models.PositiveIntegerField(default=0)

    def increment(self):
        self.version += 1
        self.save(update_fields=['version'])
