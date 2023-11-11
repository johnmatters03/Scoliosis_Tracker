from django.urls import path
from . import views

app_name = 'pictures'

urlpatterns = [
    path("", views.upload_picture, name='upload_picture'),
    path('view/<int:picture_id>/', views.view_picture, name='view_picture'),
]
