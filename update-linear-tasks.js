#!/usr/bin/env node

/**
 * Script to update task statuses in Linear using GraphQL API
 * 
 * Usage:
 *   LINEAR_API_KEY=your_api_key node update-linear-tasks.js
 * 
 * This script updates the status of completed tasks from "Backlog" to "Done"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load tasks from JSON file
const tasksFile = path.join(__dirname, 'linear-tasks.json');
const tasksData = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_API_URL = 'https://api.linear.app/graphql';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable is not set');
  console.log('\n📝 To get your Linear API key:');
  console.log('   1. Go to https://linear.app/settings/api');
  console.log('   2. Create a new Personal API Key');
  console.log('   3. Run: LINEAR_API_KEY=your_key node update-linear-tasks.js\n');
  process.exit(1);
}

// GraphQL query to search for issues by title
const SEARCH_ISSUES_QUERY = `
  query SearchIssues($filter: IssueFilter) {
    issues(filter: $filter) {
      nodes {
        id
        title
        state {
          id
          name
          type
        }
        team {
          id
          key
        }
        url
      }
    }
  }
`;

// GraphQL mutation to update issue state
const UPDATE_ISSUE_MUTATION = `
  mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
    issueUpdate(id: $id, input: $input) {
      success
      issue {
        id
        title
        state {
          name
        }
        url
      }
    }
  }
`;

// GraphQL query to get workflow states
const GET_WORKFLOW_STATES_QUERY = `
  query GetWorkflowStates($filter: WorkflowStateFilter) {
    workflowStates(filter: $filter) {
      nodes {
        id
        name
        type
        team {
          id
          key
        }
      }
    }
  }
`;

async function makeGraphQLRequest(query, variables = {}) {
  const response = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
  }

  return result.data;
}

async function findIssueByTitle(title) {
  try {
    const data = await makeGraphQLRequest(SEARCH_ISSUES_QUERY, {
      filter: {
        title: { eq: title }
      }
    });
    
    const issues = data.issues?.nodes || [];
    return issues.length > 0 ? issues[0] : null;
  } catch (error) {
    console.error(`   ❌ Error searching for issue "${title}":`, error.message);
    return null;
  }
}

async function getDoneStateId(teamId) {
  try {
    const data = await makeGraphQLRequest(GET_WORKFLOW_STATES_QUERY, {
      filter: {
        team: { id: { eq: teamId } },
        type: { eq: "completed" }
      }
    });
    
    const states = data.workflowStates?.nodes || [];
    // Prefer "Done" state, fallback to first completed state
    const doneState = states.find(s => s.name.toLowerCase() === 'done') || states[0];
    return doneState?.id || null;
  } catch (error) {
    console.error('   ❌ Error fetching workflow states:', error.message);
    return null;
  }
}

async function updateIssueStatus(issueId, stateId) {
  try {
    const data = await makeGraphQLRequest(UPDATE_ISSUE_MUTATION, {
      id: issueId,
      input: {
        stateId: stateId
      }
    });
    
    if (data.issueUpdate.success) {
      return data.issueUpdate.issue;
    } else {
      throw new Error('Failed to update issue');
    }
  } catch (error) {
    console.error(`   ❌ Error updating issue:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Linear task status update...\n');

  // Filter tasks that are marked as "Done" in JSON
  const completedTasks = tasksData.tasks.filter(task => task.status === 'Done');
  
  if (completedTasks.length === 0) {
    console.log('ℹ️  No tasks marked as "Done" in linear-tasks.json');
    console.log('   Update the status in linear-tasks.json first, then run this script.\n');
    process.exit(0);
  }

  console.log(`📋 Found ${completedTasks.length} completed task(s) to update:\n`);
  completedTasks.forEach((task, i) => {
    console.log(`   ${i + 1}. ${task.title}`);
  });
  console.log('');

  // Get team ID from first issue (we'll need it for workflow states)
  console.log('🔍 Finding issues in Linear...\n');
  
  const results = {
    updated: [],
    notFound: [],
    alreadyDone: [],
    failed: []
  };

  // Get team ID by finding first issue
  let teamId = null;
  let doneStateId = null;

  for (let i = 0; i < completedTasks.length; i++) {
    const task = completedTasks[i];
    console.log(`[${i + 1}/${completedTasks.length}] Processing: ${task.title}`);

    // Find issue in Linear
    const issue = await findIssueByTitle(task.title);
    
    if (!issue) {
      console.log(`   ⚠️  Issue not found in Linear - may need to be created first\n`);
      results.notFound.push(task);
      continue;
    }

    // Get team ID from issue (if not already set)
    if (!teamId && issue.team) {
      teamId = issue.team.id;
      doneStateId = await getDoneStateId(teamId);
      if (!doneStateId) {
        console.log(`   ⚠️  Could not find "Done" state - using current state\n`);
      }
    }

    // Check if already done
    if (issue.state?.type === 'completed' || issue.state?.name?.toLowerCase() === 'done') {
      console.log(`   ✅ Already marked as done: ${issue.url}\n`);
      results.alreadyDone.push({ task, issue });
      continue;
    }

    // Update to Done state
    if (!doneStateId) {
      console.log(`   ⚠️  Cannot update - no "Done" state found\n`);
      results.failed.push({ task, issue, reason: 'No Done state found' });
      continue;
    }

    const updatedIssue = await updateIssueStatus(issue.id, doneStateId);
    
    if (updatedIssue) {
      console.log(`   ✅ Updated to Done: ${updatedIssue.url}\n`);
      results.updated.push(updatedIssue);
    } else {
      console.log(`   ❌ Failed to update\n`);
      results.failed.push({ task, issue, reason: 'Update failed' });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Update Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully updated: ${results.updated.length} issue(s)`);
  console.log(`✅ Already done: ${results.alreadyDone.length} issue(s)`);
  console.log(`⚠️  Not found: ${results.notFound.length} issue(s)`);
  console.log(`❌ Failed: ${results.failed.length} issue(s)`);
  
  if (results.updated.length > 0) {
    console.log('\n✅ Updated issues:');
    results.updated.forEach(issue => {
      console.log(`   - ${issue.title}`);
      console.log(`     ${issue.url}`);
    });
  }

  if (results.alreadyDone.length > 0) {
    console.log('\n✅ Already done:');
    results.alreadyDone.forEach(({ issue }) => {
      console.log(`   - ${issue.title}`);
      console.log(`     ${issue.url}`);
    });
  }

  if (results.notFound.length > 0) {
    console.log('\n⚠️  Not found (may need to be created):');
    results.notFound.forEach(task => {
      console.log(`   - ${task.title}`);
    });
    console.log('\n   💡 Tip: Run import-to-linear.js first to create these issues');
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed:');
    results.failed.forEach(({ task, reason }) => {
      console.log(`   - ${task.title} (${reason})`);
    });
  }

  console.log('\n🎉 Done!\n');
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Error: This script requires Node.js 18+ (for native fetch)');
  console.log('   Or install node-fetch: npm install node-fetch\n');
  process.exit(1);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
