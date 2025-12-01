from django.urls import path
from .views import analyze_tasks, suggest_tasks, create_task, list_tasks
urlpatterns = [
    path("analyze/", analyze_tasks),
    path("suggest/", suggest_tasks),
    path("create/", create_task),     
    path("all/", list_tasks),  
]