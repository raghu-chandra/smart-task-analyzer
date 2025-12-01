from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskInputSerializer, TaskOutputSerializer
from .scoring import compute_score, detect_circular_dependencies
from .models import Task
@api_view(["POST"])
def analyze_tasks(request):
    tasks = request.data
    strategy = request.GET.get("strategy", "smart")
    serializer = TaskInputSerializer(data=tasks, many=True)
    serializer.is_valid(raise_exception=True)
    tasks = serializer.validated_data
    if detect_circular_dependencies(tasks):
        return Response({"error": "Circular dependency detected"}, status=400)
    output = []
    for t in tasks:
        score, explanation = compute_score(t, strategy)
        new = t.copy()
        new["score"] = score
        new["explanation"] = explanation
        output.append(new)
    output.sort(key=lambda x: x["score"], reverse=True)
    return Response(output)
@api_view(["POST"])
def suggest_tasks(request):
    strategy = request.GET.get("strategy", "smart")
    serializer = TaskInputSerializer(data=request.data, many=True)
    serializer.is_valid(raise_exception=True)
    tasks = serializer.validated_data
    if detect_circular_dependencies(tasks):
        return Response({"error": "Circular dependency detected"}, status=400)
    enriched = []
    for t in tasks:
        score, explanation = compute_score(t, strategy)
        t1 = t.copy()
        t1["score"] = score
        t1["explanation"] = explanation
        enriched.append(t1)
    enriched.sort(key=lambda x: x["score"], reverse=True)
    return Response({"top_tasks": enriched[:3]})
@api_view(["POST"])
def create_task(request):
    serializer = TaskInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    task = Task.objects.create(
        title=data["title"],
        due_date=data.get("due_date"),
        estimated_hours=data["estimated_hours"],
        importance=data["importance"],
        dependencies=data.get("dependencies", []),
    )
    return Response({"message": "Task created", "id": task.id})
@api_view(["GET"])
def list_tasks(request):
    tasks = Task.objects.all().values()
    return Response(list(tasks))