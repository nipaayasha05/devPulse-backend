export interface Issue {
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id: string;
}
// {
//     "success": true,
//     "message": "Issue created successfully",
//     "data": {
//         "id": 9,
//         "title": "Database connection timeout under load",
//         "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
//         "type": "bug",
//         "status": "open",
//         "reporter_id": 8,
//         "created_at": "2026-05-21T04:29:37.319Z",
//         "updated_at": "2026-05-21T04:29:37.319Z"
//     }
// }
