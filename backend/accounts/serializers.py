from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserTokenVersion


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        version, _ = UserTokenVersion.objects.get_or_create(user=user)
        token['token_version'] = version.version
        return token
