from django.db import models
import json

class Picture(models.Model):
    """image = models.ImageField(upload_to='postures/')
    data_dict = models.JSONField(default=dict)"""
    image = models.ImageField(upload_to='postures/')
    data_dict = models.JSONField(default=dict)
    upload_date = models.DateTimeField(auto_now_add=True)
    #shoulder_displacement = models.FloatField(null=True, blank=True)

