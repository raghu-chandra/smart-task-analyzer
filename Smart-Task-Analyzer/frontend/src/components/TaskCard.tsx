import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/taskAnalyzer";
import { Calendar, Gauge, Target, Trophy } from "lucide-react";
interface TaskCardProps {
  task: Task;
  rank: number;
}
const TaskCard = ({ task, rank }: TaskCardProps) => {
  const getPriorityLevel = (score: number) => {
    if (score >= 8)
      return { level: "HIGH", class: "bg-priority-high text-white" };
    if (score >= 5)
      return { level: "MEDIUM", class: "bg-priority-medium text-white" };
    return { level: "LOW", class: "bg-priority-low text-white" };
  };
  const priority = getPriorityLevel(task.score || 5);
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <Card className="shadow-[var(--shadow-card)] border-border/40 bg-gradient-to-br from-card to-card/70 animate-in fade-in duration-500">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="flex items-center gap-1 bg-primary text-white px-2 py-1">
            <Trophy className="h-4 w-4" />
            #{rank}
          </Badge>
          <Badge className={`${priority.class} px-2 py-1`}>
            {priority.level}
          </Badge>
        </div>
        <h2 className="text-lg font-semibold">{task.title}</h2>
        <div className="grid grid-cols-2 gap-3 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(task.due_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Importance: {task.importance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span>Effort: {task.estimated_hours}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Score: {task.score?.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-muted/40 text-sm text-muted-foreground border border-border/40">
          <strong className="text-foreground">Why this rank?</strong>
          <p className="mt-1">{task.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
};
export default TaskCard;