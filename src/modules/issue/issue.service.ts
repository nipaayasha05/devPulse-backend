import type { Request } from "express";
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

const getAllIssueFromDB = async (
  sort: string = "newest",
  type?: string,
  status?: string,
) => {
  let query = `SELECT * FROM issues`;
  const values: any[] = [];
  const conditions: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type=$${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status=$${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  if (sort === "newest") {
    query += ` ORDER BY created_at DESC `;
  } else if (sort === "oldest") {
    query += ` ORDER BY created_at ASC `;
  }

  const issueResult = await pool.query(query, values);

  const userResult = await pool.query(`
  SELECT id,name,role FROM users
  `);

  const users = userResult.rows;

  const allIssues = issueResult.rows.map((issue) => {
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

const updateIssueIntoDB = async (id: string, payload: Issue, user: any) => {
  // console.log(user);
  const { title, description, type, status } = payload;

  const existingIssue = await pool.query(
    `
  SELECT * FROM issues WHERE id=$1
  `,
    [id],
  );

  const issue = existingIssue.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (user.role === "contributor") {
    if ((issue.reporter_id as string) !== (user.id as string)) {
      throw new Error("Only owner can update this issue");
    }

    if (issue.status !== "open") {
      throw new Error("Issue status must be open");
    }
  }

  const result = await pool.query(
    `
    UPDATE issues 
    SET title=COALESCE($1,title),
    description=COALESCE($2,description),
    type=COALESCE($3,type),
    status=COALESCE($4,status) 
    WHERE id=$5 
    RETURNING *
    `,
    [title, description, type, status, id],
  );

  return result.rows[0];
};

const deleteUserFromDB = async (id: string, payload: Issue, user: any) => {
  const existingIssue = await pool.query(
    `
  SELECT *FROM issues WHERE id=$1
  `,
    [id],
  );

  const issue = existingIssue.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (user.role === "contributor") {
    throw new Error("Only maintainer can delete all issue");
  }
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id=$1
    `,
    [id],
  );
  return result.command;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssueFromDB,
  getIssueByIdFromDB,
  updateIssueIntoDB,
  deleteUserFromDB,
};
