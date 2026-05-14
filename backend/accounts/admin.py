from django.contrib import admin

from .models import UserTokenVersion


@admin.register(UserTokenVersion)
class UserTokenVersionAdmin(admin.ModelAdmin):
    list_display = ['user', 'version']
    readonly_fields = ['user', 'version']
