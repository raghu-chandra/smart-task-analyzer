Smart Task Analyzer is a full-stack application that analyzes user-provided tasks and assigns priority scores based on deadlines, estimated effort, importance, and dependencies. The backend uses Django and Django REST Framework to expose REST APIs. The frontend is built using React and TypeScript and provides a clear and simple user interface for creating tasks, importing task lists, analyzing priorities, and displaying results.
## Setup Instructions
Clone the repository:
git clone https://github.com/Umesh594/Smart-Task-Analyzer.git
cd task-analyzer
# Backend setup using Django:
Create a virtual environment:
python -m venv venv
Activate it:
venv\Scripts\activate (Windows)
Install all dependencies:
pip install -r requirements.txt
Run database migrations:
python manage.py migrate
Start the backend server:
python manage.py runserver
## Frontend setup using React and Vite:
cd frontend
npm install
npm run dev
## Algorithm Explanation
The Smart Task Analyzer assigns priority scores to tasks by combining several practical productivity factors such as deadlines, task importance, estimated effort, and task dependencies. The backend implements four scoring strategies, each suitable for a different way of thinking about productivity.
The first strategy is the Deadline Strategy. This strategy ranks tasks entirely based on their urgency. If a task is overdue, it receives a very high score because it requires immediate attention. Tasks due today also receive a high priority, while tasks due within a few days receive medium priority. Tasks with no deadlines receive the lowest urgency. This type of ranking is helpful for users who need to strictly follow time-based planning.
The second strategy is called Fastest-Wins. It focuses entirely on estimated effort. Tasks that require less than or equal to one hour are treated as quick wins and are given the highest score. This motivates users to complete many small tasks quickly. Tasks requiring one to three hours get moderate scores, and tasks requiring more than three hours get lower scores. This method is ideal for users who prefer clearing many small tasks first to build momentum.
The third strategy is the High-Impact Strategy. It depends only on the importance value of the task. Tasks with higher importance move up automatically in priority, regardless of deadlines or how long they take. This is useful for outcome-driven workflows, especially when importance is more relevant than urgency or effort.
The most advanced strategy is Smart Balance, which combines deadlines, importance, effort, and dependencies into one balanced weighted score. Deadline-based points are added to ensure that overdue or urgent tasks appear higher but without overpowering all other factors. Importance values are also included so that high-impact tasks remain visible at the top. Effort is given moderate influence, rewarding quick tasks and slightly penalizing very long tasks. Dependencies also contribute to the score; tasks that block other tasks are considered more critical to complete earlier. This combined scoring approach closely resembles real-world productivity systems and avoids the shortcomings of using only one factor.
Overall, the Smart Balance strategy gives users a realistic, well-rounded prioritization that minimizes workflow delays while highlighting meaningful work.
## Design Decisions and Trade-offs
The backend uses Django’s JSONField for storing task dependencies. This gives flexibility without requiring a separate table solely for relations. The limitation is that this structure is not ideal for extremely complex dependency networks, but it is perfectly suitable for a lightweight task-analysis tool.
Multiple scoring strategies were implemented so users can choose the perspective that best fits their workflow. This increases complexity but provides more value than a single fixed method.
The application intentionally does not include authentication. Since this project focuses on correct analysis and user interaction, it keeps the setup simpler. The trade-off is that it is not ready for multi-user production without additional work.
Circular dependency detection was included to ensure that users do not receive misleading or impossible task sequences. Although this adds computation, it prevents errors and maintains reliability.
The frontend stores tasks in local React state for instant interaction without requiring database storage. While tasks are not persisted between sessions, this approach is ideal for an interactive single-user tool.
## Time Breakdown
Backend setup required about one hour. Designing the scoring algorithms took around two hours. Implementing circular dependency detection took one hour. Developing the REST API took approximately one and a half hours. Writing unit tests required forty-five minutes. Building the React interface, including forms and display components, took about three hours. Adding JSON import, scoring strategy controls, and API integration took around one and a half hours. Final debugging and polishing took one hour. The total time required was around twelve hours.
## Unit Tests
Unit tests are located at backend/tasks/tests.py. Tests include coverage for overdue task scoring, quick task prioritization, and verification of the high-impact strategy’s scoring behavior. All written tests pass successfully.
## Bonus Challenges Attempted
The project includes JSON import features, multiple scoring algorithms, detection of circular dependencies, an API that suggests the top three tasks, frontend animations and task sorting, and backend validation built using Django REST Framework.
## Future Improvements
With more time the system can be expanded with full authentication, persistent storage of tasks, timeline or Gantt chart visualizations, drag-and-drop task editing, machine learning based prioritization, calendar integration, export options such as PDF or CSV, and display themes like light and dark mode.
