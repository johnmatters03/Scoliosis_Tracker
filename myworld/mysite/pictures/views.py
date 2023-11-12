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
from django.http import JsonResponse
from .models import Picture  # Replace with your actual model name
from django.core.serializers import serialize

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
   

def graph_view(request):
    data_query = Picture.objects.all().order_by('upload_date')
    data_for_graph = []
    #print(len(data_query))
    for entry in data_query:
        data_dict = entry.data_dict
        # Use .get() to avoid KeyError if the key does not exist
        left_shoulder = data_dict.get('left_shoulder')
        right_shoulder = data_dict.get('right_shoulder')
        rldiff = data_dict.get('rldiff')

        #print(left_shoulder)
        #print(right_shoulder)
        #print(rldiff)

        # Check if the required keys are present and calculate 'rldiff_abs' accordingly
        if left_shoulder and right_shoulder and rldiff is not None:
            rldiff_abs = abs(float(rldiff[0]) / (float(left_shoulder[0]) - float(right_shoulder[0])))
        else:
            # Handle the case where the data is not available
            # You can choose to skip this entry, use a default value, or log an error
            continue  # or use a default value like rldiff_abs = 0

        
        data_for_graph.append({
            'timestamp': entry.upload_date.strftime('%Y-%m-%d %H:%M:%S'),
            'abs_rldiff': rldiff_abs,
        })
    print(data_for_graph)
    template = loader.get_template('graph_temp.html')
    
    # Create context with the data

  
    context = {
    'graph_data': json.dumps(data_for_graph).replace("'", "&apos;")  # This ensures single quotes are HTML encoded
    }
    rendered_template = template.render(context, request)
    # Return an HttpResponse with the rendered template
    return HttpResponse(rendered_template)
    #return render(request, 'your_template.html', context)

def view_picture(request, picture_id):
    # This view is responsible for displaying the uploaded picture and any associated data.
    picture = Picture.objects.get(id=picture_id)
    return render(request, 'pictures/view_picture.html', {'picture': picture})

def success(request):
    return HttpResponse('successfully uploaded')