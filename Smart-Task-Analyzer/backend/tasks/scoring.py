from datetime import date
def days_until(due_date):
    if not due_date:
        return None
    return (due_date - date.today()).days
def detect_circular_dependencies(tasks):
    graph = {i: set(t.get("dependencies", [])) for i, t in enumerate(tasks)}
    visiting = set()
    visited = set()
    def dfs(node):
        if node in visiting:
            return True
        if node in visited:
            return False
        visiting.add(node)
        for dep in graph[node]:
            if dep < len(tasks) and dfs(dep):
                return True
        visiting.remove(node)
        visited.add(node)
        return False
    for n in graph:
        if dfs(n):
            return True

    return False
def strategy_deadline(task):
    d = days_until(task.get("due_date"))
    if d is None:
        return (1, "No deadline → low urgency")
    if d < 0:
        return (10, f"Overdue by {-d} days")
    if d == 0:
        return (9, "Due today")
    if d <= 3:
        return (8, f"Due soon in {d} days")
    return (5, f"Deadline in {d} days")
def strategy_fastest(task):
    hours = task.get("estimated_hours", 1)
    if hours <= 1:
        return (9, "Quick win (≤1 hr)")
    if hours <= 3:
        return (7, "Low effort task")
    return (4, "High effort task")
def strategy_high_impact(task):
    importance = task.get("importance", 5)
    return (importance, f"High-Impact score from importance {importance}")
def strategy_smart_balance(task):
    score = 0
    explanation = []
    d = days_until(task.get("due_date"))
    if d is None:
        score += 2
        explanation.append("No due date → neutral urgency")
    else:
        if d < 0:
            score += 10
            explanation.append(f"Overdue by {-d} days → high urgency")
        elif d == 0:
            score += 9
            explanation.append("Due today → urgent")
        elif d <= 3:
            score += 7
            explanation.append(f"Due soon (in {d} days)")
        else:
            score += 3
            explanation.append(f"Deadline in {d} days")
    importance = task.get("importance", 5)
    score += importance
    explanation.append(f"Importance = {importance}")
    hours = task.get("estimated_hours", 1)
    if hours <= 1:
        score += 4
        explanation.append("Quick task (≤1 hr)")
    elif hours <= 3:
        score += 2
        explanation.append("Moderate effort task")
    else:
        score -= 1
        explanation.append("High effort task")

    dep_count = len(task.get("dependencies", []))
    if dep_count > 0:
        score += dep_count * 2
        explanation.append(f"Blocks {dep_count} tasks")
    return score, "; ".join(explanation)
def compute_score(task, strategy):
    if strategy == "deadline":
        return strategy_deadline(task)
    if strategy == "fastest":
        return strategy_fastest(task)
    if strategy == "impact":
        return strategy_high_impact(task)
    return strategy_smart_balance(task)