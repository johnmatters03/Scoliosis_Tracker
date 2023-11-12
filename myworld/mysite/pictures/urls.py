from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin

app_name = 'pictures'

urlpatterns = [
    path("", views.upload_picture, name='upload_picture'),
    path('view/<int:picture_id>/', views.view_picture, name='view_picture'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)