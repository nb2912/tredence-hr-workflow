# HR Workflow Designer

## Overview
The HR Workflow Designer is a visual, drag-and-drop web application that allows HR administrators to create, configure, and simulate complex human resources processes. Users can design workflows such as employee onboarding, leave approvals, and document verification by connecting specialized node types. The application features a built-in simulation engine that validates the structural integrity of the workflow and provides an animated, step-by-step execution log of the process.

## Tech Stack
| Technology | Why Chosen |
| --- | --- |
| **React 18 & Vite** | React provides component-based UI, while Vite ensures blazing fast hot-module replacement and instant builds, perfect for a highly interactive application. |
| **React Flow (@xyflow/react)** | A powerful, highly-customizable node-based library specifically built for workflow editors. It handles zoom, pan, and edge rendering out of the box. |
| **TypeScript** | Strict typing eliminates entire classes of runtime errors, acting as living documentation for custom node data structures and state interfaces. |
| **Zustand** | Provides global state management without the boilerplate of Redux. It is lightweight, un-opinionated, and fast enough to handle frequent canvas updates. |
| **React Hook Form** | An efficient, performant form library that utilizes uncontrolled components where possible to prevent unnecessary re-renders in the node configuration side-panel. |
| **Tailwind CSS** | Utility-first CSS allows for rapid styling directly in the markup, significantly speeding up the implementation of the dark theme and smooth animations. |
| **Jest & Testing Library** | Industry standards for ensuring our core graph logic, cycle detection, and validation algorithms are thoroughly tested and robust. |

## Architecture
- **State Management (Zustand over Redux)**: Given the high frequency of updates (dragging nodes, adding edges), Redux's strict action dispatching and heavy boilerplate would slow development without adding proportional value. Zustand offers a simple, mutative-style API (with hooks) perfectly suited for binding to the React Flow canvas.
- **Form Handling (React Hook Form)**: With forms dynamically unmounting/remounting as different nodes are clicked, `react-hook-form` ensures minimal re-renders. It effortlessly handles complex dynamic arrays (like custom Key-Value pairs).
- **Mock API Layer**: The mock service uses `setTimeout` and Promise-based functions to emulate realistic network delays. The simulation engine uses a topological sort to traverse the graph logically from Start to End, rather than randomly, validating the logical flow.
- **Node Extensibility**: Nodes are abstracted into generic definitions. Adding a new node simply requires defining its TypeScript interface, creating a visual node component, and generating a corresponding form. The state and simulation logic dynamically adapt.

## Folder Structure
```text
src/
├── components/          # Visual React components
│   ├── forms/           # Form components for configuring each node type
│   ├── nodes/           # Custom React Flow visual nodes
│   ├── Sidebar.tsx      # Draggable node palette and templates
│   ├── NodeConfigPanel.tsx # Sliding panel housing the active node's form
│   ├── SimulationPanel.tsx # Drawer showing animated execution logs
│   └── Toolbar.tsx      # Top bar with undo/redo, validation, and export
├── hooks/               # Custom reusable logic
│   ├── useNodeForm.ts   # Form initialization and binding logic
│   ├── useSimulation.ts # Timing, animation, and state for the simulation
│   └── useWorkflowCanvas.ts # React Flow canvas orchestration and shortcuts
├── mocks/               # Fake API responses and delay simulation
│   ├── automations.ts   # Available third-party actions
│   └── simulate.ts      # Validates graph and calculates topological steps
├── store/
│   └── workflowStore.ts # Centralized Zustand state for nodes, edges, history
├── types/
│   └── workflow.ts      # Strict generic interfaces mapping nodes and edges
├── utils/
│   ├── graphUtils.ts    # Cycle detection, topological sort, serialization
│   └── validation.ts    # 8-step rule validation engine
├── __tests__/           # Unit test suite
│   ├── graphUtils.test.ts
│   └── validation.test.ts
└── App.tsx              # Main orchestrator layout
```

## Getting Started
```bash
# Install all dependencies
npm install

# Start the Vite development server
npm run dev

# Run unit tests
npm run test
```

## How to Use
1. **Add Nodes**: Drag any node from the "Node Types" section in the left sidebar onto the central canvas.
2. **Connect Nodes**: Click and hold a colored handle on the right side of a node and drag it to the left handle of another node.
3. **Configure Details**: Click on any node on the canvas. The Node Config Panel will slide in from the right. Edit the details and click "Save Changes".
4. **Use Templates**: Select an option like "Onboarding" from the top-left Templates dropdown to instantly load a pre-built workflow.
5. **Run Simulation**: Click the green "Run Simulation" button in the top right. If the workflow passes validation, the simulation drawer will rise and step-by-step logs will execute.

## Mock API Documentation
**1. Get Automations**
- **Action**: Fetch available third-party integrations for the Automated Step node.
- **Response**:
```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject", "body"] },
  { "id": "notify_slack", "label": "Notify Slack", "params": ["channel", "message"] }
]
```

**2. Simulate Workflow**
- **Action**: Submits the workflow JSON to be parsed and executed.
- **Request Body**: `{ nodes: [...], edges: [...] }`
- **Response**:
```json
[
  {
    "nodeId": "start-1",
    "nodeType": "start",
    "status": "completed",
    "message": "Workflow initiated: Start Onboarding",
    "timestamp": "2023-10-25T10:00:00.000Z"
  }
]
```

✅ **Auto-layout**: Added a "Auto Layout" button that uses the `dagre` engine to automatically tidy up and organize messy node connections.
✅ **Node version history**: Implemented a "History" tab for every node. Each time you save changes, the previous version is snapshotted, allowing you to view and restore any past state of a specific node.

## Design Decisions & Tradeoffs
1. **Mock Execution within the Client**: I simulated backend delay and execution steps directly in the client rather than using MSW (Mock Service Worker). This eliminated extra dependency bloat while still satisfying the mock delay requirement perfectly.
2. **Strict Mode Concurrency**: The simulation animation required careful handling of React 18's strict mode. The interval was engineered to use closure-safe state updates (`prev.length`) to prevent double-mounting issues.
3. **Node Types**: Disallowed `any` types by creating strongly typed `NodeProps<T>` specific to React Flow, ensuring form data always matches visual nodes.
4. **CSS Overrides**: Customized React Flow's default white control buttons to match the deep dark mode aesthetic natively.
5. **Dagre for Auto-layout**: Chose `dagre` for the auto-layout feature as it is the industry standard for Directed Acyclic Graphs (DAGs), ensuring logical Left-to-Right hierarchical alignment.
6. **Immutable Snapshots for Versioning**: Node versioning uses deep copies of the `data` object, ensuring that restoring a past version doesn't inadvertently carry over stale reference-based state.

## What I Would Add With More Time
1. **Branching Logic (Conditionals)**: A "Gateway" or "Decision" node to route paths based on 'If/Else' logic.
2. **Actual Backend DB**: Node/Express server paired with PostgreSQL (Prisma) to save workflow definitions persistently.
3. **Real API Integrations**: Hooking the "Automated Step" nodes into Zapier or Make.com webhooks.
4. **Collaborative Editing**: Yjs and WebSockets to show other users' cursors on the canvas simultaneously.
5. **Node Comments**: Ability to leave sticky notes or comments on specific nodes for team collaboration.

## Known Limitations
- The graph execution currently assumes straight logical topological sorts (Kahn's algorithm). Parallel execution paths will still log sequentially rather than simultaneously.
- Cycle detection will aggressively stop workflows. While this is correct for straightforward DAGs (Directed Acyclic Graphs), more complex state-machine style workflows that require loops/retry mechanisms are structurally prohibited.
