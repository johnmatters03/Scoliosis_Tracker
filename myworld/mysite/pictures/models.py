from django.db import models

class Picture(models.Model):
    image = models.ImageField(upload_to='postures/')
    #upload_date = models.DateTimeField(auto_now_add=True)
    #shoulder_displacement = models.FloatField(null=True, blank=True)

