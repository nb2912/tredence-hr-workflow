# HR Workflow Designer

## 1. Project Overview
The HR Workflow Designer is a production-quality, drag-and-drop web application that allows HR administrators to visually construct, configure, and simulate workflows (such as employee onboarding, leave approval, and document verification). It provides a smooth, dynamic, and intuitive interface to manage nodes and edges, offering a highly responsive "canvas" experience.

## 2. Tech Stack & Why Each Was Chosen
- **React 18 + TypeScript (Vite)**: For an exceptionally fast development server, strict type safety, and robust ecosystem.
- **React Flow (@xyflow/react)**: The industry standard library for building node-based graphical user interfaces, offering top-tier performance for canvas applications.
- **Tailwind CSS (v4)**: For rapid, utility-first styling without leaving the component code. Chosen for its design flexibility to implement the specific dark theme.
- **Zustand**: A lightweight, unopinionated state management solution ideal for managing the complex global state of nodes, edges, and undo/redo history.
- **React Hook Form**: Used inside the Node Configuration Panel to manage dynamic form states and validations efficiently without causing re-renders of the whole app.
- **Lucide React**: For clean, modern, and highly customizable SVG icons.

## 3. Architecture Decisions
- **Single Source of Truth**: React Flow's internal state is fully synchronized with Zustand. This enables the robust Undo/Redo feature, as well as easy JSON import/export.
- **Modular Nodes**: Each node type (Start, Task, Approval, Automated, End) is built as a self-contained component, making it extremely easy to add new node types in the future.
- **Dynamic Form Rendering**: The side panel reads the currently selected node's type and lazily mounts the appropriate configuration form.
- **Mock Execution Engine**: Simulation runs locally and utilizes an asynchronous loop with `setTimeout` to mimic realistic network requests and provide visual feedback as it steps through the nodes.

## 4. Folder Structure Explained
```
src/
├── components/
│   ├── nodes/           # Custom React Flow node visualizations
│   ├── forms/           # React Hook Form components for each node type
│   ├── Sidebar.tsx      # Draggable node palette and workflow actions
│   ├── NodeConfigPanel.tsx # Slide-in panel for node configuration
│   ├── SimulationPanel.tsx # Bottom drawer displaying simulation logs
│   └── Toolbar.tsx      # Top bar with undo/redo, validate, and simulate controls
├── hooks/
│   └── useWorkflowCanvas.ts # Logic for React Flow interactions (drop, connect)
├── mocks/
│   ├── automations.ts   # Mock GET response for Automated Step dropdown
│   └── simulate.ts      # Mock execution logic returning step-by-step results
├── store/
│   └── workflowStore.ts # Zustand global state (nodes, edges, history)
├── types/
│   └── workflow.ts      # TypeScript interfaces defining data contracts
├── utils/
│   ├── validation.ts    # Logic ensuring 1 start, 1 end, no orphans, no cycles
│   └── graphUtils.ts    # Topological sorting and cycle detection (DFS)
└── App.tsx              # Main layout assembling all components
```

## 5. How to Run Locally
Ensure you have Node.js installed, then run the following commands in the terminal:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## 6. How to Use the App
1. **Add Nodes**: Drag node cards from the left Sidebar onto the canvas.
2. **Connect Nodes**: Click and drag from the blue handle on the right of one node to the left handle of another.
3. **Configure Nodes**: Click on any node on the canvas. The right-hand panel will open. Fill out the specific form details (like Assignee, Due Date, or Metadata) and click "Save Changes".
4. **Undo/Redo**: Use the buttons in the Toolbar or standard keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`).
5. **Validate**: Click the "Validate" button to check for logic errors (e.g., missing Start node, cycles, disconnected nodes).
6. **Simulate**: Click the green "Run Simulation" button to see an animated execution of your workflow in the bottom panel.
7. **Export/Import**: Save your progress as a JSON file, or load previous workflows using the Sidebar buttons.

## 7. Mock API Documentation
- `getAutomations()`: Simulates a `GET /automations` endpoint. Returns an array of available system actions and their required parameters (e.g., Send Email requires "to", "subject", "body").
- `simulateWorkflow(json)`: Simulates a `POST /simulate` endpoint. Validates the workflow, performs a topological sort, and returns an array of `SimulationStep` objects representing the path of execution.

## 8. Design Decisions & Tradeoffs
- **Design Focus**: Prioritized a sleek dark theme (`#0f0f1a`) with distinct node colors for immediate visual recognition.
- **Tradeoff - Complex Validation vs Performance**: Full cycle detection runs on every validation check. For very large graphs (10,000+ nodes), DFS might block the main thread. However, for HR workflows (typically <100 nodes), this approach is instantly performant.
- **Tradeoff - Zustand vs Context**: Chose Zustand over standard React Context specifically to avoid unnecessary re-renders of the canvas when updating isolated form states.

## 9. What I Would Add With More Time
- **Conditional Branching**: Add "Approve" and "Reject" handles to Approval nodes that route the workflow differently.
- **Workflow Templates**: Allow users to start with pre-built flows (e.g., Standard Onboarding, Hardware Request).
- **Backend Integration**: Replace the mock API with a real Node.js/PostgreSQL backend for persisting workflows and executing real webhooks.

## 10. Known Limitations
- The simulation currently follows a linear/parallel path based on topological sorting and does not support true runtime "decision" logic (e.g., evaluating an approval threshold and branching based on the result).
- Edge connection styles are currently standard bezier curves; custom edges with animated flow lines could improve the visual indication of execution paths.
