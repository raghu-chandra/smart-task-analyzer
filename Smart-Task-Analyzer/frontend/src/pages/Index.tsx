import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "@/components/TaskCard";
import { toast } from "sonner";
import { Brain, Sparkles, Target, Zap } from "lucide-react";
import { Task,SortingStrategy } from "@/lib/taskAnalyzer";
const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analyzedTasks, setAnalyzedTasks] = useState<Task[]>([]);
  const [strategy, setStrategy] = useState<SortingStrategy>("smart-balance");
  const [title, setTitle] = useState("");
  const [importance, setImportance] = useState("5");
  const [due_date, setDueDate] = useState("");
  const [estimated_hours, setEffort] = useState("5");
  const [jsonInput, setJsonInput] = useState("");
  const handleAddTask = () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      due_date: due_date ? due_date : null,
      estimated_hours: parseInt(estimated_hours),
      importance: parseInt(importance),
      dependencies: [],
    };
    setTasks([...tasks, newTask]);
    setTitle("");
    setDueDate("");
    setImportance("5");
    setEffort("5");
    toast.success("Task added successfully");
  };
  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const tasksArray = Array.isArray(parsed) ? parsed : [parsed];
      const validatedTasks = tasksArray.map((task: any, index: number) => ({
        id: task.id || `imported-${Date.now()}-${index}`,
        title: task.title || "Untitled Task",
        due_date: task.due_date || task.dueDate,
        importance: Math.min(10, Math.max(1, task.importance || 5)),
        estimated_hours: Math.min(10, Math.max(1, task.estimated_hours || task.effort || 5)),
        dependencies: task.dependencies || [],
      }));
      setTasks([...tasks, ...validatedTasks]);
      setJsonInput("");
      toast.success(`Imported ${validatedTasks.length} task(s)`);
    } catch (error) {
      toast.error("Invalid JSON format. Please check your input.");
    }
  };
  const handleAnalyze = async () => {
    if (tasks.length === 0) {
      toast.error("Please add some tasks first");
      return;
    }
    const strategyMap: Record<SortingStrategy, string> = {
      "fastest-wins": "fastest",
      "high-impact": "impact",
      "deadline-driven": "deadline",
      "smart-balance": "smart",
    };
    try {
      const response = await fetch(
        `https://smart-task-analyzer-odff.onrender.com/api/tasks/analyze/?strategy=${strategyMap[strategy]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tasks),
        }
      );
      if (!response.ok) {
        const err = await response.json();
        toast.error(`Backend error: ${err.error || "Failed to analyze tasks"}`);
        return;
      }
      const data = await response.json();
      setAnalyzedTasks(data);
      toast.success(`Tasks analyzed using ${getStrategyName(strategy)} strategy`);
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to backend");
    }
  };
  const handleClearTasks = () => {
    setTasks([]);
    setAnalyzedTasks([]);
    toast.info("All tasks cleared");
  };
  const getStrategyName = (strat: SortingStrategy) => {
    const names = {
      "fastest-wins": "Fastest Wins",
      "high-impact": "High Impact",
      "deadline-driven": "Deadline Driven",
      "smart-balance": "Smart Balance"
    };
    return names[strat];
  };
  const getStrategyIcon = (strat: SortingStrategy) => {
    const icons = {
      "fastest-wins": <Zap className="h-4 w-4" />,
      "high-impact": <Target className="h-4 w-4" />,
      "deadline-driven": <Brain className="h-4 w-4" />,
      "smart-balance": <Sparkles className="h-4 w-4" />
    };
    return icons[strat];
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Task Analyzer
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Intelligently prioritize your tasks with advanced algorithms
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <Card className="shadow-[var(--shadow-card)] border-border/50 bg-gradient-to-br from-card to-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Add Tasks
                </CardTitle>
                <CardDescription>
                  Create tasks manually or import from JSON
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="form">Manual Input</TabsTrigger>
                    <TabsTrigger value="json">JSON Import</TabsTrigger>
                  </TabsList>
                  <TabsContent value="form" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Complete project proposal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                      />
                    </div>                   
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date (Optional)</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={due_date}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>                   
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="importance">
                          Importance: {importance}
                        </Label>
                        <Input
                          id="importance"
                          type="range"
                          min="1"
                          max="10"
                          value={importance}
                          onChange={(e) => setImportance(e.target.value)}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>                     
                      <div className="space-y-2">
                        <Label htmlFor="effort">
                          Effort: {estimated_hours}
                        </Label>
                        <Input
                          id="effort"
                          type="range"
                          min="1"
                          max="10"
                          value={estimated_hours}
                          onChange={(e) => setEffort(e.target.value)}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>                    
                    <Button onClick={handleAddTask} className="w-full">
                      Add Task
                    </Button>
                  </TabsContent>                  
                  <TabsContent value="json" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jsonInput">JSON Task Data</Label>
                      <Textarea
                        id="jsonInput"
                        placeholder='[{"title": "Task 1", "dueDate": "2025-12-01", "importance": 8, "effort": 3}]'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="font-mono text-sm min-h-[200px]"
                      />
                    </div>                   
                    <Button onClick={handleJsonImport} className="w-full">
                      Import from JSON
                    </Button>
                  </TabsContent>
                </Tabs>
                {tasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">
                      {tasks.length} task(s) ready to analyze
                    </p>
                    <Button 
                      onClick={handleClearTasks} 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Clear All Tasks
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow-card)] border-border/50 bg-gradient-to-br from-card to-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Sorting Strategy
                </CardTitle>
                <CardDescription>
                  Choose how tasks should be prioritized
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={strategy} onValueChange={(v) => setStrategy(v as SortingStrategy)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="fastest-wins">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Fastest Wins - Low effort first
                      </div>
                    </SelectItem>
                    <SelectItem value="high-impact">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        High Impact - Importance over everything
                      </div>
                    </SelectItem>
                    <SelectItem value="deadline-driven">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Deadline Driven - Due date priority
                      </div>
                    </SelectItem>
                    <SelectItem value="smart-balance">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Smart Balance - Balanced algorithm
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>                
                <Button 
                  onClick={handleAnalyze} 
                  className="w-full" 
                  size="lg"
                  disabled={tasks.length === 0}
                >
                  {getStrategyIcon(strategy)}
                  <span className="ml-2">Analyze Tasks</span>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <Card className="shadow-[var(--shadow-elevated)] border-border/50 bg-gradient-to-br from-card to-card/80 min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Prioritized Tasks
                </CardTitle>
                <CardDescription>
                  {analyzedTasks.length > 0 
                    ? `${analyzedTasks.length} tasks sorted by ${getStrategyName(strategy)}`
                    : "Analyze your tasks to see prioritized results"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyzedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Brain className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      No analyzed tasks yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add tasks and click "Analyze" to see results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analyzedTasks.map((task, index) => (
                      <TaskCard key={task.id} task={task} rank={index + 1} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
