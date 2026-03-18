#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

const TESTRAIL_URL = process.env.TESTRAIL_URL!;
const TESTRAIL_USER = process.env.TESTRAIL_USER!;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY!;

/**
 * TestRail API Client
 * Wraps all TestRail REST API operations
 */
class TestRailClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${TESTRAIL_URL}/index.php?/api/v2`,
      auth: { username: TESTRAIL_USER, password: TESTRAIL_API_KEY },
      headers: { "Content-Type": "application/json" },
    });
  }

  // ============== PROJECTS ==============

  async getProjects(): Promise<any> {
    const res = await this.client.get("/get_projects");
    return res.data;
  }

  async getProject(projectId: number): Promise<any> {
    const res = await this.client.get(`/get_project/${projectId}`);
    return res.data;
  }

  // ============== SUITES ==============

  async getSuites(projectId: number): Promise<any> {
    const res = await this.client.get(`/get_suites/${projectId}`);
    return res.data;
  }

  async getSuite(suiteId: number): Promise<any> {
    const res = await this.client.get(`/get_suite/${suiteId}`);
    return res.data;
  }

  async addSuite(projectId: number, name: string, description?: string): Promise<any> {
    const res = await this.client.post(`/add_suite/${projectId}`, {
      name,
      description,
    });
    return res.data;
  }

  // ============== SECTIONS ==============

  async getSections(projectId: number, suiteId?: number): Promise<any> {
    let url = `/get_sections/${projectId}`;
    if (suiteId) url += `&suite_id=${suiteId}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getSection(sectionId: number): Promise<any> {
    const res = await this.client.get(`/get_section/${sectionId}`);
    return res.data;
  }

  async addSection(
    projectId: number,
    name: string,
    suiteId?: number,
    parentId?: number,
    description?: string
  ): Promise<any> {
    const res = await this.client.post(`/add_section/${projectId}`, {
      name,
      suite_id: suiteId,
      parent_id: parentId,
      description,
    });
    return res.data;
  }

  async updateSection(sectionId: number, name?: string, description?: string): Promise<any> {
    const res = await this.client.post(`/update_section/${sectionId}`, {
      name,
      description,
    });
    return res.data;
  }

  async deleteSection(sectionId: number): Promise<any> {
    const res = await this.client.post(`/delete_section/${sectionId}`);
    return res.data;
  }

  // ============== TEST CASES ==============

  async getCases(projectId: number, suiteId?: number, sectionId?: number): Promise<any> {
    let url = `/get_cases/${projectId}`;
    const params: string[] = [];
    if (suiteId) params.push(`suite_id=${suiteId}`);
    if (sectionId) params.push(`section_id=${sectionId}`);
    if (params.length) url += `&${params.join("&")}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getCase(caseId: number): Promise<any> {
    const res = await this.client.get(`/get_case/${caseId}`);
    return res.data;
  }

  async addCase(
    sectionId: number,
    title: string,
    options: {
      template_id?: number;
      type_id?: number;
      priority_id?: number;
      estimate?: string;
      milestone_id?: number;
      refs?: string;
      custom_steps?: string;
      custom_expected?: string;
      custom_preconds?: string;
      custom_steps_separated?: Array<{ content: string; expected: string }>;
    } = {}
  ): Promise<any> {
    const res = await this.client.post(`/add_case/${sectionId}`, {
      title,
      ...options,
    });
    return res.data;
  }

  async updateCase(caseId: number, updates: Record<string, any>): Promise<any> {
    const res = await this.client.post(`/update_case/${caseId}`, updates);
    return res.data;
  }

  async deleteCase(caseId: number): Promise<any> {
    const res = await this.client.post(`/delete_case/${caseId}`);
    return res.data;
  }

  async getCaseTypes(): Promise<any> {
    const res = await this.client.get("/get_case_types");
    return res.data;
  }

  async getCaseFields(): Promise<any> {
    const res = await this.client.get("/get_case_fields");
    return res.data;
  }

  async getPriorities(): Promise<any> {
    const res = await this.client.get("/get_priorities");
    return res.data;
  }

  async getTemplates(projectId: number): Promise<any> {
    const res = await this.client.get(`/get_templates/${projectId}`);
    return res.data;
  }

  // ============== TEST RUNS ==============

  async getRuns(projectId: number, filters?: { is_completed?: boolean; milestone_id?: number }): Promise<any> {
    let url = `/get_runs/${projectId}`;
    const params: string[] = [];
    if (filters?.is_completed !== undefined) params.push(`is_completed=${filters.is_completed ? 1 : 0}`);
    if (filters?.milestone_id) params.push(`milestone_id=${filters.milestone_id}`);
    if (params.length) url += `&${params.join("&")}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getRun(runId: number): Promise<any> {
    const res = await this.client.get(`/get_run/${runId}`);
    return res.data;
  }

  async addRun(
    projectId: number,
    name: string,
    options: {
      suite_id?: number;
      description?: string;
      milestone_id?: number;
      assignedto_id?: number;
      include_all?: boolean;
      case_ids?: number[];
    } = {}
  ): Promise<any> {
    const res = await this.client.post(`/add_run/${projectId}`, {
      name,
      ...options,
    });
    return res.data;
  }

  async updateRun(
    runId: number,
    updates: {
      name?: string;
      description?: string;
      milestone_id?: number;
      include_all?: boolean;
      case_ids?: number[];
    }
  ): Promise<any> {
    const res = await this.client.post(`/update_run/${runId}`, updates);
    return res.data;
  }

  async closeRun(runId: number): Promise<any> {
    const res = await this.client.post(`/close_run/${runId}`);
    return res.data;
  }

  async deleteRun(runId: number): Promise<any> {
    const res = await this.client.post(`/delete_run/${runId}`);
    return res.data;
  }

  // ============== TESTS ==============

  async getTests(runId: number, statusId?: number[]): Promise<any> {
    let url = `/get_tests/${runId}`;
    if (statusId?.length) url += `&status_id=${statusId.join(",")}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getTest(testId: number): Promise<any> {
    const res = await this.client.get(`/get_test/${testId}`);
    return res.data;
  }

  // ============== RESULTS ==============

  async getResults(testId: number, limit?: number): Promise<any> {
    let url = `/get_results/${testId}`;
    if (limit) url += `&limit=${limit}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getResultsForCase(runId: number, caseId: number, limit?: number): Promise<any> {
    let url = `/get_results_for_case/${runId}/${caseId}`;
    if (limit) url += `&limit=${limit}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getResultsForRun(runId: number, statusId?: number[]): Promise<any> {
    let url = `/get_results_for_run/${runId}`;
    if (statusId?.length) url += `&status_id=${statusId.join(",")}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async addResult(
    testId: number,
    statusId: number,
    options: {
      comment?: string;
      version?: string;
      elapsed?: string;
      defects?: string;
      assignedto_id?: number;
    } = {}
  ): Promise<any> {
    const res = await this.client.post(`/add_result/${testId}`, {
      status_id: statusId,
      ...options,
    });
    return res.data;
  }

  async addResultForCase(
    runId: number,
    caseId: number,
    statusId: number,
    options: {
      comment?: string;
      version?: string;
      elapsed?: string;
      defects?: string;
      assignedto_id?: number;
    } = {}
  ): Promise<any> {
    const res = await this.client.post(`/add_result_for_case/${runId}/${caseId}`, {
      status_id: statusId,
      ...options,
    });
    return res.data;
  }

  async addResults(runId: number, results: Array<{ test_id: number; status_id: number; comment?: string; elapsed?: string; defects?: string }>): Promise<any> {
    const res = await this.client.post(`/add_results/${runId}`, { results });
    return res.data;
  }

  async addResultsForCases(runId: number, results: Array<{ case_id: number; status_id: number; comment?: string; elapsed?: string; defects?: string }>): Promise<any> {
    const res = await this.client.post(`/add_results_for_cases/${runId}`, { results });
    return res.data;
  }

  // ============== MILESTONES ==============

  async getMilestones(projectId: number, isCompleted?: boolean): Promise<any> {
    let url = `/get_milestones/${projectId}`;
    if (isCompleted !== undefined) url += `&is_completed=${isCompleted ? 1 : 0}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getMilestone(milestoneId: number): Promise<any> {
    const res = await this.client.get(`/get_milestone/${milestoneId}`);
    return res.data;
  }

  async addMilestone(projectId: number, name: string, options: { description?: string; due_on?: number; parent_id?: number } = {}): Promise<any> {
    const res = await this.client.post(`/add_milestone/${projectId}`, { name, ...options });
    return res.data;
  }

  async updateMilestone(milestoneId: number, updates: { name?: string; description?: string; due_on?: number; is_completed?: boolean }): Promise<any> {
    const res = await this.client.post(`/update_milestone/${milestoneId}`, updates);
    return res.data;
  }

  async deleteMilestone(milestoneId: number): Promise<any> {
    const res = await this.client.post(`/delete_milestone/${milestoneId}`);
    return res.data;
  }

  // ============== TEST PLANS ==============

  async getPlans(projectId: number, isCompleted?: boolean): Promise<any> {
    let url = `/get_plans/${projectId}`;
    if (isCompleted !== undefined) url += `&is_completed=${isCompleted ? 1 : 0}`;
    const res = await this.client.get(url);
    return res.data;
  }

  async getPlan(planId: number): Promise<any> {
    const res = await this.client.get(`/get_plan/${planId}`);
    return res.data;
  }

  async addPlan(projectId: number, name: string, options: { description?: string; milestone_id?: number; entries?: any[] } = {}): Promise<any> {
    const res = await this.client.post(`/add_plan/${projectId}`, { name, ...options });
    return res.data;
  }

  async closePlan(planId: number): Promise<any> {
    const res = await this.client.post(`/close_plan/${planId}`);
    return res.data;
  }

  async deletePlan(planId: number): Promise<any> {
    const res = await this.client.post(`/delete_plan/${planId}`);
    return res.data;
  }

  // ============== USERS ==============

  async getUsers(): Promise<any> {
    const res = await this.client.get("/get_users");
    return res.data;
  }

  async getUser(userId: number): Promise<any> {
    const res = await this.client.get(`/get_user/${userId}`);
    return res.data;
  }

  async getUserByEmail(email: string): Promise<any> {
    const res = await this.client.get(`/get_user_by_email&email=${encodeURIComponent(email)}`);
    return res.data;
  }

  // ============== STATUSES ==============

  async getStatuses(): Promise<any> {
    const res = await this.client.get("/get_statuses");
    return res.data;
  }
}

// Initialize TestRail client
const testrail = new TestRailClient();

// Create MCP Server
const server = new Server(
  { name: "testrail-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ============== PROJECT TOOLS ==============
    {
      name: "testrail_get_projects",
      description: "Get all TestRail projects accessible to the user",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "testrail_get_project",
      description: "Get details of a specific TestRail project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
        },
        required: ["project_id"],
      },
    },

    // ============== SUITE TOOLS ==============
    {
      name: "testrail_get_suites",
      description: "Get all test suites for a project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
        },
        required: ["project_id"],
      },
    },
    {
      name: "testrail_add_suite",
      description: "Create a new test suite in a project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          name: { type: "string", description: "The suite name" },
          description: { type: "string", description: "Optional description" },
        },
        required: ["project_id", "name"],
      },
    },

    // ============== SECTION TOOLS ==============
    {
      name: "testrail_get_sections",
      description: "Get sections (folders) for organizing test cases in a project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          suite_id: { type: "number", description: "Optional suite ID (for multi-suite projects)" },
        },
        required: ["project_id"],
      },
    },
    {
      name: "testrail_add_section",
      description: "Create a new section/folder for test cases",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          name: { type: "string", description: "The section name" },
          suite_id: { type: "number", description: "Optional suite ID" },
          parent_id: { type: "number", description: "Optional parent section ID for nesting" },
          description: { type: "string", description: "Optional description" },
        },
        required: ["project_id", "name"],
      },
    },
    {
      name: "testrail_update_section",
      description: "Update an existing section",
      inputSchema: {
        type: "object",
        properties: {
          section_id: { type: "number", description: "The section ID" },
          name: { type: "string", description: "New name" },
          description: { type: "string", description: "New description" },
        },
        required: ["section_id"],
      },
    },
    {
      name: "testrail_delete_section",
      description: "Delete a section and all its test cases",
      inputSchema: {
        type: "object",
        properties: {
          section_id: { type: "number", description: "The section ID to delete" },
        },
        required: ["section_id"],
      },
    },

    // ============== TEST CASE TOOLS ==============
    {
      name: "testrail_get_cases",
      description: "Get test cases from a project, optionally filtered by suite or section",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          suite_id: { type: "number", description: "Optional suite ID" },
          section_id: { type: "number", description: "Optional section ID" },
        },
        required: ["project_id"],
      },
    },
    {
      name: "testrail_get_case",
      description: "Get details of a specific test case",
      inputSchema: {
        type: "object",
        properties: {
          case_id: { type: "number", description: "The test case ID" },
        },
        required: ["case_id"],
      },
    },
    {
      name: "testrail_add_case",
      description: "Create a new test case in a section",
      inputSchema: {
        type: "object",
        properties: {
          section_id: { type: "number", description: "The section ID to add the case to" },
          title: { type: "string", description: "The test case title" },
          template_id: { type: "number", description: "Template ID (use testrail_get_templates)" },
          type_id: { type: "number", description: "Type ID (use testrail_get_case_types)" },
          priority_id: { type: "number", description: "Priority: 1=Low, 2=Medium, 3=High, 4=Critical" },
          estimate: { type: "string", description: "Time estimate, e.g., '30s', '1m 30s', '2h'" },
          milestone_id: { type: "number", description: "Associated milestone ID" },
          refs: { type: "string", description: "References/requirements (e.g., 'REQ-001, REQ-002')" },
          custom_steps: { type: "string", description: "Test steps (plain text format)" },
          custom_expected: { type: "string", description: "Expected result" },
          custom_preconds: { type: "string", description: "Preconditions" },
        },
        required: ["section_id", "title"],
      },
    },
    {
      name: "testrail_update_case",
      description: "Update an existing test case",
      inputSchema: {
        type: "object",
        properties: {
          case_id: { type: "number", description: "The test case ID" },
          title: { type: "string", description: "New title" },
          priority_id: { type: "number", description: "New priority" },
          type_id: { type: "number", description: "New type" },
          estimate: { type: "string", description: "New estimate" },
          refs: { type: "string", description: "New references" },
          custom_steps: { type: "string", description: "New test steps" },
          custom_expected: { type: "string", description: "New expected result" },
          custom_preconds: { type: "string", description: "New preconditions" },
        },
        required: ["case_id"],
      },
    },
    {
      name: "testrail_delete_case",
      description: "Delete a test case",
      inputSchema: {
        type: "object",
        properties: {
          case_id: { type: "number", description: "The test case ID to delete" },
        },
        required: ["case_id"],
      },
    },
    {
      name: "testrail_get_case_types",
      description: "Get available test case types",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "testrail_get_case_fields",
      description: "Get custom fields available for test cases",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "testrail_get_priorities",
      description: "Get available priority levels",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "testrail_get_templates",
      description: "Get available templates for a project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
        },
        required: ["project_id"],
      },
    },

    // ============== TEST RUN TOOLS ==============
    {
      name: "testrail_get_runs",
      description: "Get test runs for a project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          is_completed: { type: "boolean", description: "Filter by completion status" },
          milestone_id: { type: "number", description: "Filter by milestone" },
        },
        required: ["project_id"],
      },
    },
    {
      name: "testrail_get_run",
      description: "Get details of a specific test run",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
        },
        required: ["run_id"],
      },
    },
    {
      name: "testrail_add_run",
      description: "Create a new test run",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          name: { type: "string", description: "The test run name" },
          suite_id: { type: "number", description: "Suite ID (for multi-suite projects)" },
          description: { type: "string", description: "Run description" },
          milestone_id: { type: "number", description: "Associated milestone" },
          assignedto_id: { type: "number", description: "Assigned user ID" },
          include_all: { type: "boolean", description: "Include all test cases (default: true)" },
          case_ids: { type: "array", items: { type: "number" }, description: "Specific case IDs to include" },
        },
        required: ["project_id", "name"],
      },
    },
    {
      name: "testrail_update_run",
      description: "Update a test run",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
          name: { type: "string", description: "New name" },
          description: { type: "string", description: "New description" },
          milestone_id: { type: "number", description: "New milestone" },
          include_all: { type: "boolean", description: "Include all cases" },
          case_ids: { type: "array", items: { type: "number" }, description: "Specific case IDs" },
        },
        required: ["run_id"],
      },
    },
    {
      name: "testrail_close_run",
      description: "Close a test run (marks it as completed)",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID to close" },
        },
        required: ["run_id"],
      },
    },
    {
      name: "testrail_delete_run",
      description: "Delete a test run",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID to delete" },
        },
        required: ["run_id"],
      },
    },

    // ============== TEST TOOLS ==============
    {
      name: "testrail_get_tests",
      description: "Get tests (instances of test cases) in a run",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
          status_id: { type: "array", items: { type: "number" }, description: "Filter by status IDs" },
        },
        required: ["run_id"],
      },
    },
    {
      name: "testrail_get_test",
      description: "Get a specific test from a run",
      inputSchema: {
        type: "object",
        properties: {
          test_id: { type: "number", description: "The test ID" },
        },
        required: ["test_id"],
      },
    },

    // ============== RESULT TOOLS ==============
    {
      name: "testrail_get_results",
      description: "Get results for a specific test",
      inputSchema: {
        type: "object",
        properties: {
          test_id: { type: "number", description: "The test ID" },
          limit: { type: "number", description: "Maximum number of results" },
        },
        required: ["test_id"],
      },
    },
    {
      name: "testrail_get_results_for_case",
      description: "Get results for a test case across a run",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
          case_id: { type: "number", description: "The test case ID" },
          limit: { type: "number", description: "Maximum number of results" },
        },
        required: ["run_id", "case_id"],
      },
    },
    {
      name: "testrail_get_results_for_run",
      description: "Get all results for a test run",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
          status_id: { type: "array", items: { type: "number" }, description: "Filter by status IDs" },
        },
        required: ["run_id"],
      },
    },
    {
      name: "testrail_add_result",
      description: "Add a result to a test",
      inputSchema: {
        type: "object",
        properties: {
          test_id: { type: "number", description: "The test ID" },
          status_id: { type: "number", description: "Status: 1=Passed, 2=Blocked, 3=Untested, 4=Retest, 5=Failed" },
          comment: { type: "string", description: "Result comment/notes" },
          version: { type: "string", description: "Version tested" },
          elapsed: { type: "string", description: "Time spent, e.g., '30s', '1m', '2h'" },
          defects: { type: "string", description: "Comma-separated defect IDs" },
          assignedto_id: { type: "number", description: "Assigned user ID" },
        },
        required: ["test_id", "status_id"],
      },
    },
    {
      name: "testrail_add_result_for_case",
      description: "Add a result for a test case in a run (most common method)",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
          case_id: { type: "number", description: "The test case ID" },
          status_id: { type: "number", description: "Status: 1=Passed, 2=Blocked, 3=Untested, 4=Retest, 5=Failed" },
          comment: { type: "string", description: "Result comment/notes" },
          version: { type: "string", description: "Version tested" },
          elapsed: { type: "string", description: "Time spent" },
          defects: { type: "string", description: "Comma-separated defect IDs" },
          assignedto_id: { type: "number", description: "Assigned user ID" },
        },
        required: ["run_id", "case_id", "status_id"],
      },
    },
    {
      name: "testrail_add_results",
      description: "Add multiple results to tests in a run (bulk operation)",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
          results: {
            type: "array",
            description: "Array of results",
            items: {
              type: "object",
              properties: {
                test_id: { type: "number", description: "Test ID" },
                status_id: { type: "number", description: "Status ID" },
                comment: { type: "string" },
                elapsed: { type: "string" },
                defects: { type: "string" },
              },
              required: ["test_id", "status_id"],
            },
          },
        },
        required: ["run_id", "results"],
      },
    },
    {
      name: "testrail_add_results_for_cases",
      description: "Add multiple results for test cases in a run (bulk operation)",
      inputSchema: {
        type: "object",
        properties: {
          run_id: { type: "number", description: "The test run ID" },
          results: {
            type: "array",
            description: "Array of results by case ID",
            items: {
              type: "object",
              properties: {
                case_id: { type: "number", description: "Case ID" },
                status_id: { type: "number", description: "Status ID" },
                comment: { type: "string" },
                elapsed: { type: "string" },
                defects: { type: "string" },
              },
              required: ["case_id", "status_id"],
            },
          },
        },
        required: ["run_id", "results"],
      },
    },
    {
      name: "testrail_get_statuses",
      description: "Get all available result statuses",
      inputSchema: { type: "object", properties: {} },
    },

    // ============== MILESTONE TOOLS ==============
    {
      name: "testrail_get_milestones",
      description: "Get milestones for a project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          is_completed: { type: "boolean", description: "Filter by completion status" },
        },
        required: ["project_id"],
      },
    },
    {
      name: "testrail_get_milestone",
      description: "Get details of a specific milestone",
      inputSchema: {
        type: "object",
        properties: {
          milestone_id: { type: "number", description: "The milestone ID" },
        },
        required: ["milestone_id"],
      },
    },
    {
      name: "testrail_add_milestone",
      description: "Create a new milestone",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          name: { type: "string", description: "Milestone name" },
          description: { type: "string", description: "Description" },
          due_on: { type: "number", description: "Due date as Unix timestamp" },
          parent_id: { type: "number", description: "Parent milestone ID" },
        },
        required: ["project_id", "name"],
      },
    },
    {
      name: "testrail_update_milestone",
      description: "Update a milestone",
      inputSchema: {
        type: "object",
        properties: {
          milestone_id: { type: "number", description: "The milestone ID" },
          name: { type: "string", description: "New name" },
          description: { type: "string", description: "New description" },
          due_on: { type: "number", description: "New due date" },
          is_completed: { type: "boolean", description: "Mark as completed" },
        },
        required: ["milestone_id"],
      },
    },
    {
      name: "testrail_delete_milestone",
      description: "Delete a milestone",
      inputSchema: {
        type: "object",
        properties: {
          milestone_id: { type: "number", description: "The milestone ID to delete" },
        },
        required: ["milestone_id"],
      },
    },

    // ============== TEST PLAN TOOLS ==============
    {
      name: "testrail_get_plans",
      description: "Get test plans for a project",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          is_completed: { type: "boolean", description: "Filter by completion status" },
        },
        required: ["project_id"],
      },
    },
    {
      name: "testrail_get_plan",
      description: "Get details of a specific test plan",
      inputSchema: {
        type: "object",
        properties: {
          plan_id: { type: "number", description: "The test plan ID" },
        },
        required: ["plan_id"],
      },
    },
    {
      name: "testrail_add_plan",
      description: "Create a new test plan",
      inputSchema: {
        type: "object",
        properties: {
          project_id: { type: "number", description: "The project ID" },
          name: { type: "string", description: "Plan name" },
          description: { type: "string", description: "Description" },
          milestone_id: { type: "number", description: "Associated milestone" },
        },
        required: ["project_id", "name"],
      },
    },
    {
      name: "testrail_close_plan",
      description: "Close a test plan",
      inputSchema: {
        type: "object",
        properties: {
          plan_id: { type: "number", description: "The plan ID to close" },
        },
        required: ["plan_id"],
      },
    },
    {
      name: "testrail_delete_plan",
      description: "Delete a test plan",
      inputSchema: {
        type: "object",
        properties: {
          plan_id: { type: "number", description: "The plan ID to delete" },
        },
        required: ["plan_id"],
      },
    },

    // ============== USER TOOLS ==============
    {
      name: "testrail_get_users",
      description: "Get all users in the TestRail instance",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "testrail_get_user",
      description: "Get details of a specific user",
      inputSchema: {
        type: "object",
        properties: {
          user_id: { type: "number", description: "The user ID" },
        },
        required: ["user_id"],
      },
    },
    {
      name: "testrail_get_user_by_email",
      description: "Find a user by email address",
      inputSchema: {
        type: "object",
        properties: {
          email: { type: "string", description: "The email address" },
        },
        required: ["email"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    switch (name) {
      // Projects
      case "testrail_get_projects":
        result = await testrail.getProjects();
        break;
      case "testrail_get_project":
        result = await testrail.getProject(args!.project_id as number);
        break;

      // Suites
      case "testrail_get_suites":
        result = await testrail.getSuites(args!.project_id as number);
        break;
      case "testrail_add_suite":
        result = await testrail.addSuite(args!.project_id as number, args!.name as string, args!.description as string);
        break;

      // Sections
      case "testrail_get_sections":
        result = await testrail.getSections(args!.project_id as number, args!.suite_id as number);
        break;
      case "testrail_add_section":
        result = await testrail.addSection(
          args!.project_id as number,
          args!.name as string,
          args!.suite_id as number,
          args!.parent_id as number,
          args!.description as string
        );
        break;
      case "testrail_update_section":
        result = await testrail.updateSection(args!.section_id as number, args!.name as string, args!.description as string);
        break;
      case "testrail_delete_section":
        result = await testrail.deleteSection(args!.section_id as number);
        break;

      // Cases
      case "testrail_get_cases":
        result = await testrail.getCases(args!.project_id as number, args!.suite_id as number, args!.section_id as number);
        break;
      case "testrail_get_case":
        result = await testrail.getCase(args!.case_id as number);
        break;
      case "testrail_add_case":
        result = await testrail.addCase(args!.section_id as number, args!.title as string, {
          template_id: args!.template_id as number,
          type_id: args!.type_id as number,
          priority_id: args!.priority_id as number,
          estimate: args!.estimate as string,
          milestone_id: args!.milestone_id as number,
          refs: args!.refs as string,
          custom_steps: args!.custom_steps as string,
          custom_expected: args!.custom_expected as string,
          custom_preconds: args!.custom_preconds as string,
        });
        break;
      case "testrail_update_case":
        const { case_id: updateCaseId, ...caseUpdates } = args!;
        result = await testrail.updateCase(updateCaseId as number, caseUpdates);
        break;
      case "testrail_delete_case":
        result = await testrail.deleteCase(args!.case_id as number);
        break;
      case "testrail_get_case_types":
        result = await testrail.getCaseTypes();
        break;
      case "testrail_get_case_fields":
        result = await testrail.getCaseFields();
        break;
      case "testrail_get_priorities":
        result = await testrail.getPriorities();
        break;
      case "testrail_get_templates":
        result = await testrail.getTemplates(args!.project_id as number);
        break;

      // Runs
      case "testrail_get_runs":
        result = await testrail.getRuns(args!.project_id as number, {
          is_completed: args!.is_completed as boolean,
          milestone_id: args!.milestone_id as number,
        });
        break;
      case "testrail_get_run":
        result = await testrail.getRun(args!.run_id as number);
        break;
      case "testrail_add_run":
        result = await testrail.addRun(args!.project_id as number, args!.name as string, {
          suite_id: args!.suite_id as number,
          description: args!.description as string,
          milestone_id: args!.milestone_id as number,
          assignedto_id: args!.assignedto_id as number,
          include_all: args!.include_all as boolean,
          case_ids: args!.case_ids as number[],
        });
        break;
      case "testrail_update_run":
        const { run_id: updateRunId, ...runUpdates } = args!;
        result = await testrail.updateRun(updateRunId as number, runUpdates);
        break;
      case "testrail_close_run":
        result = await testrail.closeRun(args!.run_id as number);
        break;
      case "testrail_delete_run":
        result = await testrail.deleteRun(args!.run_id as number);
        break;

      // Tests
      case "testrail_get_tests":
        result = await testrail.getTests(args!.run_id as number, args!.status_id as number[]);
        break;
      case "testrail_get_test":
        result = await testrail.getTest(args!.test_id as number);
        break;

      // Results
      case "testrail_get_results":
        result = await testrail.getResults(args!.test_id as number, args!.limit as number);
        break;
      case "testrail_get_results_for_case":
        result = await testrail.getResultsForCase(args!.run_id as number, args!.case_id as number, args!.limit as number);
        break;
      case "testrail_get_results_for_run":
        result = await testrail.getResultsForRun(args!.run_id as number, args!.status_id as number[]);
        break;
      case "testrail_add_result":
        result = await testrail.addResult(args!.test_id as number, args!.status_id as number, {
          comment: args!.comment as string,
          version: args!.version as string,
          elapsed: args!.elapsed as string,
          defects: args!.defects as string,
          assignedto_id: args!.assignedto_id as number,
        });
        break;
      case "testrail_add_result_for_case":
        result = await testrail.addResultForCase(
          args!.run_id as number,
          args!.case_id as number,
          args!.status_id as number,
          {
            comment: args!.comment as string,
            version: args!.version as string,
            elapsed: args!.elapsed as string,
            defects: args!.defects as string,
            assignedto_id: args!.assignedto_id as number,
          }
        );
        break;
      case "testrail_add_results":
        result = await testrail.addResults(args!.run_id as number, args!.results as any[]);
        break;
      case "testrail_add_results_for_cases":
        result = await testrail.addResultsForCases(args!.run_id as number, args!.results as any[]);
        break;
      case "testrail_get_statuses":
        result = await testrail.getStatuses();
        break;

      // Milestones
      case "testrail_get_milestones":
        result = await testrail.getMilestones(args!.project_id as number, args!.is_completed as boolean);
        break;
      case "testrail_get_milestone":
        result = await testrail.getMilestone(args!.milestone_id as number);
        break;
      case "testrail_add_milestone":
        result = await testrail.addMilestone(args!.project_id as number, args!.name as string, {
          description: args!.description as string,
          due_on: args!.due_on as number,
          parent_id: args!.parent_id as number,
        });
        break;
      case "testrail_update_milestone":
        const { milestone_id: updateMilestoneId, ...milestoneUpdates } = args!;
        result = await testrail.updateMilestone(updateMilestoneId as number, milestoneUpdates);
        break;
      case "testrail_delete_milestone":
        result = await testrail.deleteMilestone(args!.milestone_id as number);
        break;

      // Plans
      case "testrail_get_plans":
        result = await testrail.getPlans(args!.project_id as number, args!.is_completed as boolean);
        break;
      case "testrail_get_plan":
        result = await testrail.getPlan(args!.plan_id as number);
        break;
      case "testrail_add_plan":
        result = await testrail.addPlan(args!.project_id as number, args!.name as string, {
          description: args!.description as string,
          milestone_id: args!.milestone_id as number,
        });
        break;
      case "testrail_close_plan":
        result = await testrail.closePlan(args!.plan_id as number);
        break;
      case "testrail_delete_plan":
        result = await testrail.deletePlan(args!.plan_id as number);
        break;

      // Users
      case "testrail_get_users":
        result = await testrail.getUsers();
        break;
      case "testrail_get_user":
        result = await testrail.getUser(args!.user_id as number);
        break;
      case "testrail_get_user_by_email":
        result = await testrail.getUserByEmail(args!.email as string);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || "Unknown error";
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TestRail MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
