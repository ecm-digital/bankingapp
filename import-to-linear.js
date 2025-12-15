#!/usr/bin/env node

/**
 * Script to import tasks to Linear using GraphQL API
 * 
 * Usage:
 *   LINEAR_API_KEY=your_api_key node import-to-linear.js
 * 
 * To get your Linear API key:
 *   1. Go to Linear Settings → API
 *   2. Create a new Personal API Key
 *   3. Copy the key and set it as LINEAR_API_KEY environment variable
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
  console.log('   3. Run: LINEAR_API_KEY=your_key node import-to-linear.js\n');
  process.exit(1);
}

// GraphQL mutation to create an issue
const CREATE_ISSUE_MUTATION = `
  mutation CreateIssue($input: IssueCreateInput!) {
    issueCreate(input: $input) {
      success
      issue {
        id
        title
        url
      }
    }
  }
`;

// GraphQL query to get team ID and label IDs
const GET_TEAM_QUERY = `
  query GetTeam($teamKey: String!) {
    team(key: $teamKey) {
      id
      labels {
        nodes {
          id
          name
        }
      }
    }
  }
`;

// Alternative: Get team by ID
const GET_TEAM_BY_ID_QUERY = `
  query GetTeamById($teamId: String!) {
    team(id: $teamId) {
      id
      key
      name
      labels {
        nodes {
          id
          name
        }
      }
    }
  }
`;

// Priority mapping
const PRIORITY_MAP = {
  'P0': 1, // Urgent
  'P1': 2, // High
  'P2': 3, // Medium
  'P3': 4  // Low
};

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

async function getTeamAndLabels(teamKey = 'ECM') {
  // First, get list of teams to find the right one
  const LIST_TEAMS_QUERY = `
    query {
      teams {
        nodes {
          id
          key
          name
        }
      }
    }
  `;
  
  try {
    const teamsData = await makeGraphQLRequest(LIST_TEAMS_QUERY);
    const teams = teamsData.teams?.nodes || [];
    
    console.log('\n📋 Available teams:');
    teams.forEach(team => {
      console.log(`   - ${team.key} (${team.name}) - ID: ${team.id}`);
    });
    
    // Find team by key
    const targetTeam = teams.find(t => t.key === teamKey);
    
    if (!targetTeam) {
      console.log(`\n⚠️  Team "${teamKey}" not found. Using first available team.`);
      if (teams.length > 0) {
        const firstTeam = teams[0];
        console.log(`   Using: ${firstTeam.key} (${firstTeam.name})\n`);
        // Get labels for this team
        const teamData = await makeGraphQLRequest(GET_TEAM_BY_ID_QUERY, { teamId: firstTeam.id });
        return {
          teamId: firstTeam.id,
          labels: teamData.team?.labels?.nodes || []
        };
      }
      return { teamId: null, labels: [] };
    }
    
    // Get labels for the target team
    const teamData = await makeGraphQLRequest(GET_TEAM_BY_ID_QUERY, { teamId: targetTeam.id });
    return {
      teamId: targetTeam.id,
      labels: teamData.team?.labels?.nodes || []
    };
  } catch (error) {
    console.error('❌ Error fetching teams:', error.message);
    return { teamId: null, labels: [] };
  }
}

async function createLabelIfNotExists(teamId, labelName, labels) {
  const existingLabel = labels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
  if (existingLabel) {
    return existingLabel.id;
  }

  // Note: Creating labels requires different mutation, skipping for now
  // User should create labels manually in Linear
  console.log(`   ⚠️  Label "${labelName}" not found - create it manually in Linear`);
  return null;
}

async function createIssue(teamId, task, labelIds = []) {
  const description = [
    task.description,
    '',
    '**Acceptance Criteria:**',
    ...task.acceptanceCriteria.map(ac => `- ${ac}`),
    '',
    task.files ? `**Files:**\n${task.files.map(f => `- ${f}`).join('\n')}` : '',
    task.techStack ? `**Tech Stack:**\n${task.techStack.map(ts => `- ${ts}`).join('\n')}` : '',
    task.tools ? `**Tools:**\n${task.tools.map(t => `- ${t}`).join('\n')}` : '',
    task.libraries ? `**Libraries:**\n${task.libraries.map(l => `- ${l}`).join('\n')}` : '',
  ].filter(Boolean).join('\n');

  const input = {
    teamId,
    title: task.title,
    description,
    priority: PRIORITY_MAP[task.priority] || 3,
    labelIds: labelIds.filter(Boolean),
    stateId: null, // Will use default state (Backlog)
  };

  try {
    const data = await makeGraphQLRequest(CREATE_ISSUE_MUTATION, { input });
    
    if (data.issueCreate.success) {
      return data.issueCreate.issue;
    } else {
      throw new Error('Failed to create issue');
    }
  } catch (error) {
    console.error(`   ❌ Error creating issue "${task.title}":`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Linear import...\n');

  // Get team ID and labels
  console.log('📋 Fetching team information...');
  const { teamId, labels } = await getTeamAndLabels('BANK');
  
  if (!teamId) {
    console.error('❌ Could not find team. Please:');
    console.log('   1. Check if team key "BANK" exists in your Linear workspace');
    console.log('   2. Or update the teamKey in the script');
    console.log('   3. Or provide teamId directly\n');
    process.exit(1);
  }

  console.log(`✅ Found team ID: ${teamId}`);
  console.log(`✅ Found ${labels.length} labels\n`);

  // Process each task
  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < tasksData.tasks.length; i++) {
    const task = tasksData.tasks[i];
    console.log(`[${i + 1}/${tasksData.tasks.length}] Creating: ${task.title}`);

    // Get label IDs
    const labelIds = [];
    for (const labelName of task.labels || []) {
      const label = labels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
      if (label) {
        labelIds.push(label.id);
      } else {
        console.log(`   ⚠️  Label "${labelName}" not found - skipping`);
      }
    }

    const issue = await createIssue(teamId, task, labelIds);
    
    if (issue) {
      console.log(`   ✅ Created: ${issue.url}\n`);
      results.success.push(issue);
    } else {
      console.log(`   ❌ Failed to create\n`);
      results.failed.push(task);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully created: ${results.success.length} issues`);
  console.log(`❌ Failed: ${results.failed.length} issues`);
  
  if (results.success.length > 0) {
    console.log('\n✅ Created issues:');
    results.success.forEach(issue => {
      console.log(`   - ${issue.title}`);
      console.log(`     ${issue.url}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed issues:');
    results.failed.forEach(task => {
      console.log(`   - ${task.title}`);
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

