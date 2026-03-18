# TestRail MCP Server

A Model Context Protocol (MCP) server that exposes TestRail API operations as tools for GitHub Copilot.

## Features

This server provides 45+ tools for interacting with TestRail:

### Test Case Management
- Create, read, update, and delete test cases
- Organize cases in sections/folders
- Manage suites and templates

### Test Execution
- Create and manage test runs
- Record pass/fail/blocked results
- Bulk result submission

### Project Organization
- Manage projects, milestones, and test plans
- User management and assignment

## Installation

### 1. Global Installation

```bash
npm install -g testrail-mcp-server
```

### 2. Configure Environment

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
TESTRAIL_URL=https://your-instance.testrail.io
TESTRAIL_USER=your-email@example.com
TESTRAIL_API_KEY=your-api-key
```

**To get your API key:**
1. Log into TestRail
2. Go to My Settings (top right → your name)
3. Navigate to the API Keys section
4. Click "Add Key" or "Generate Key"

### 3. Build

```bash
npm run build
```

## VS Code Configuration

Add to your VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "testrail": {
        "command": "node",
        "args": ["<full-path-to>/testrail-mcp-server/dist/index.js"],
        "env": {
          "TESTRAIL_URL": "https://your-instance.testrail.io",
          "TESTRAIL_USER": "your-email@example.com",
          "TESTRAIL_API_KEY": "your-api-key"
        }
      }
    }
  }
}
```

Or configure using `.env` file by omitting the `env` section and ensuring the `.env` file is in the server directory.

## Available Tools

### Projects
| Tool | Description |
|------|-------------|
| `testrail_get_projects` | List all projects |
| `testrail_get_project` | Get project details |

### Suites
| Tool | Description |
|------|-------------|
| `testrail_get_suites` | List suites in a project |
| `testrail_add_suite` | Create a new suite |

### Sections
| Tool | Description |
|------|-------------|
| `testrail_get_sections` | List sections/folders |
| `testrail_add_section` | Create a section |
| `testrail_update_section` | Update a section |
| `testrail_delete_section` | Delete a section |

### Test Cases
| Tool | Description |
|------|-------------|
| `testrail_get_cases` | List test cases |
| `testrail_get_case` | Get case details |
| `testrail_add_case` | Create a test case |
| `testrail_update_case` | Update a test case |
| `testrail_delete_case` | Delete a test case |
| `testrail_get_case_types` | Get available case types |
| `testrail_get_case_fields` | Get custom fields |
| `testrail_get_priorities` | Get priority levels |
| `testrail_get_templates` | Get available templates |

### Test Runs
| Tool | Description |
|------|-------------|
| `testrail_get_runs` | List test runs |
| `testrail_get_run` | Get run details |
| `testrail_add_run` | Create a test run |
| `testrail_update_run` | Update a test run |
| `testrail_close_run` | Close/complete a run |
| `testrail_delete_run` | Delete a test run |

### Tests & Results
| Tool | Description |
|------|-------------|
| `testrail_get_tests` | Get tests in a run |
| `testrail_get_test` | Get test details |
| `testrail_get_results` | Get results for a test |
| `testrail_get_results_for_case` | Get results by case ID |
| `testrail_get_results_for_run` | Get all run results |
| `testrail_add_result` | Add a test result |
| `testrail_add_result_for_case` | Add result by case ID |
| `testrail_add_results` | Bulk add results |
| `testrail_add_results_for_cases` | Bulk add by case IDs |
| `testrail_get_statuses` | Get available statuses |

### Milestones
| Tool | Description |
|------|-------------|
| `testrail_get_milestones` | List milestones |
| `testrail_get_milestone` | Get milestone details |
| `testrail_add_milestone` | Create a milestone |
| `testrail_update_milestone` | Update a milestone |
| `testrail_delete_milestone` | Delete a milestone |

### Test Plans
| Tool | Description |
|------|-------------|
| `testrail_get_plans` | List test plans |
| `testrail_get_plan` | Get plan details |
| `testrail_add_plan` | Create a test plan |
| `testrail_close_plan` | Close a test plan |
| `testrail_delete_plan` | Delete a test plan |

### Users
| Tool | Description |
|------|-------------|
| `testrail_get_users` | List all users |
| `testrail_get_user` | Get user details |
| `testrail_get_user_by_email` | Find user by email |

## Status Codes

When adding results, use these status IDs:

| ID | Status |
|----|--------|
| 1 | Passed |
| 2 | Blocked |
| 3 | Untested |
| 4 | Retest |
| 5 | Failed |

## Example Usage in Copilot

Once configured, you can ask Copilot:

- "List all TestRail projects"
- "Create a new test case for login functionality"
- "Get all failed tests from the current run"
- "Mark test case 123 as passed with comment 'Verified in build 456'"
- "Create a test run for the regression suite"

## Troubleshooting

### Connection Issues
- Verify your TestRail URL doesn't have a trailing slash
- Ensure API access is enabled in TestRail (Administration → Site Settings → API)
- Check that your API key is valid and not expired

### Permission Errors
- Verify your user has appropriate permissions in TestRail
- Some operations require admin privileges

### Tool Not Found
- Restart VS Code after adding MCP configuration
- Check the Output panel (View → Output → MCP) for server logs

## License

MIT
