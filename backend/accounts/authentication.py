from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from .models import UserTokenVersion


class TokenVersionAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)

        token_version = validated_token.get('token_version')
        if token_version is None:
            raise AuthenticationFailed('Token version missing')

        current, _ = UserTokenVersion.objects.get_or_create(user=user)
        if token_version != current.version:
            raise AuthenticationFailed('Token has been invalidated')

        return user
