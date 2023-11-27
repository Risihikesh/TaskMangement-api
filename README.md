﻿# TaskMangement-api



Register Admin
POST/admin/register

Login Admin
POST/admin/login

# User

Register User
POST/user/register

Login User
POST/user/login

# Tasks

In order to use these endpoints, one must login as admin to use them.

Creating Task
POST/task/create

Fetch all Tasks
GET/task/fetchAll

Fetch one Task
GET/task/fetch?task_id="enter_the_task_id_here"

Assign Task
POST/task/assign

Update Task
To update a task, the task id is necessary, but everything else is optional

PUT/task/update

Delete Task
DELETE/task/delete?task_id="task_id"


Analytics
Fetches all the finished tasks in the last N days (where N is number of days)

GET/task/analytics?days="no_of_days"
