from django.shortcuts import render, redirect
from .models import Picture
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.http import HttpResponse
import base64
from .forms import PictureForm
from django.template import loader
import json

@csrf_exempt  # Use csrf_exempt for demonstration purposes only
def upload_picture(request):
    
    
    if request.method == 'POST':
        if request.FILES.get('image'):
            form = PictureForm(request.POST, request.FILES)
            if form.is_valid():
                instance = form.save(commit=False)
                
                
                # Get the dictionary data as a JSON string from the POST request
                data_dict_str = request.POST.get('data_dict')
                if data_dict_str:
                    # Load the JSON string to a dictionary
                    instance.data_dict = json.loads(data_dict_str)
        
                form.save()
                return HttpResponse('successfully uploaded')
            # Redirect to a new URL to view the uploaded picture
           
            #return redirect('pictures:view_picture', picture_id=picture.id)
        else:
            # Handle the case where there is no file part
            return JsonResponse({'error': 'No image file provided.'}, status=400)

    # If GET request or any other method, just render the form page.
    template = loader.get_template('index.html')
    return HttpResponse(template.render())
   
    

def view_picture(request, picture_id):
    # This view is responsible for displaying the uploaded picture and any associated data.
    picture = Picture.objects.get(id=picture_id)
    return render(request, 'pictures/view_picture.html', {'picture': picture})

def success(request):
    return HttpResponse('successfully uploaded')