import { pool } from "../../db";
import type { Issue } from "./issue.interface";

const createIssueIntoDB = async (payload: Issue) => {
  const { title, description, type, status, reporter_id } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues(title, description,type, status,reporter_id)
    VALUES($1, $2, $3, COALESCE($4, 'open'),$5)
    RETURNING *
    `,
    [title, description, type, status, reporter_id],
  );
  return result.rows[0];
};

const getAllIssueFromDB = async () => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
   `,
  );

  const userResult = await pool.query(`
   SELECT id,name,role FROM users
    `);

  const issues = issueResult.rows;
  const users = userResult.rows;

  const allIssues = issues.map((issue) => {
    const reporter = users.find((user) => user.id === issue.reporter_id);

    const { reporter_id, created_at, updated_at, ...getIssue } = issue;

    return {
      ...getIssue,
      reporter,
      created_at,
      updated_at,
    };
  });
  return allIssues;
};

const getIssueByIdFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
   `,
    [id],
  );

  const userResult = await pool.query(`
   SELECT id,name,role FROM users
    `);

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  const users = userResult.rows;

  const reporter = users.find((user) => user.id === issue.reporter_id);

  // console.log(issue);

  const { reporter_id, created_at, updated_at, ...getIssue } = issue;

  return {
    ...getIssue,
    reporter,
    created_at,
    updated_at,
  };
};

export const issueService = {
  createIssueIntoDB,
  getAllIssueFromDB,
  getIssueByIdFromDB,
};
