
# forms.py
from django import forms
from .models import Picture
 
 
class PictureForm(forms.ModelForm):
 
    class Meta:
        model = Picture
        fields = ('image', 'data_dict',)
        #fields = ('image', 'data_dict', 'upload_date')
        #fields = ('image',)