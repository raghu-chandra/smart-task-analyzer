from rest_framework import serializers
class TaskInputSerializer(serializers.Serializer):
    title = serializers.CharField()
    due_date = serializers.DateField(required=False)
    estimated_hours = serializers.IntegerField()
    importance = serializers.IntegerField(min_value=1, max_value=10)
    dependencies = serializers.ListField(child=serializers.IntegerField(), required=False)
class TaskOutputSerializer(serializers.Serializer):
    title = serializers.CharField()
    due_date = serializers.DateField(required=False)
    estimated_hours = serializers.IntegerField()
    importance = serializers.IntegerField()
    dependencies = serializers.ListField()
    score = serializers.FloatField()
    explanation = serializers.CharField()