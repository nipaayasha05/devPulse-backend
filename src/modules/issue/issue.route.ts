import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth(), issueController.createIssue);

router.get("/", issueController.getAllIssue);

router.get("/:id", issueController.getIssueById);

export const issueRoute = router;
// {
//     "success": true,
//     "data": [
//         {
//             "id": 9,
//             "title": "Database connection timeout under load",
//             "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
//             "type": "bug",
//             "status": "open",
//             "reporter": {
//                 "id": 8,
//                 "name": "John Doe",
//                 "role": "contributor"
//             },
//             "created_at": "2026-05-21T04:29:37.319Z",
//             "updated_at": "2026-05-21T04:29:37.319Z"
//         }
//     ]
// }
