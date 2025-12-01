from django.test import TestCase
from datetime import date, timedelta
from .scoring import compute_score
class ScoringTests(TestCase):
    def test_overdue_task_gets_high_score(self):
        task = {
            "title": "Test",
            "due_date": date.today() - timedelta(days=2),
            "importance": 5,
            "estimated_hours": 2,
            "dependencies": []
        }
        score, _ = compute_score(task, "smart")
        self.assertTrue(score > 10)
    def test_low_effort_quick_win(self):
        task = {
            "title": "Quick",
            "due_date": date.today() + timedelta(days=3),
            "importance": 5,
            "estimated_hours": 1,
            "dependencies": []
        }
        score, _ = compute_score(task, "smart")
        self.assertTrue(score >= 10)
    def test_high_importance_strategy(self):
        task = {
            "title": "Important",
            "due_date": date.today(),
            "importance": 10,
            "estimated_hours": 5,
            "dependencies": []
        }
        score, _ = compute_score(task, "impact")
        self.assertEqual(score, 10)