const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Task & Team Management Platform - Comprehensive API Test Suite', () => {
  let authToken;
  let testUserObj;
  let assignedUserObj;
  let createdTaskId;

  const testUser = {
    name: 'Lead Developer',
    email: `lead_${Date.now()}@example.com`,
    password: 'password123',
    confirmPassword: 'password123',
  };

  const colleagueUser = {
    name: 'Frontend Intern',
    email: `intern_${Date.now()}@example.com`,
    password: 'password123',
    confirmPassword: 'password123',
  };

  after(async () => {
    // Clean up created test data if connected
    if (mongoose.connection.readyState === 1) {
      if (testUserObj) await User.findByIdAndDelete(testUserObj._id);
      if (assignedUserObj) await User.findByIdAndDelete(assignedUserObj._id);
      if (createdTaskId) await Task.findByIdAndDelete(createdTaskId);
    }
  });

  it('1. GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.status, 'healthy');
  });

  it('2. GET / non-existent route should return 404', async () => {
    const res = await request(app).get('/api/invalid-route-xyz');
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('3. POST /api/auth/register with invalid data should fail (400)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'bad-email',
      password: '123',
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('4. POST /api/auth/register should register lead user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token, 'Token must be returned');
    assert.strictEqual(res.body.user.email, testUser.email.toLowerCase());
    assert.strictEqual(res.body.user.password, undefined, 'Password hash must never be returned');
    authToken = res.body.token;
    testUserObj = res.body.user;
  });

  it('5. POST /api/auth/register with duplicate email should be rejected (400)', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('already exists'));
  });

  it('6. POST /api/auth/register should register colleague user for assignment', async () => {
    const res = await request(app).post('/api/auth/register').send(colleagueUser);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assignedUserObj = res.body.user;
  });

  it('7. POST /api/auth/login with wrong password should fail (401)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('8. POST /api/auth/login with valid credentials should return token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
      rememberMe: true,
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, testUser.email.toLowerCase());
    authToken = res.body.token;
  });

  it('9. GET /api/auth/me with valid Bearer token should return profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.email, testUser.email.toLowerCase());
  });

  it('10. GET /api/users with auth should return list of team users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.users));
    assert.ok(res.body.users.length >= 2);
  });

  it('11. POST /api/tasks without token should return 401 Unauthorized', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Unauthenticated task',
      description: 'Desc',
      dueDate: new Date().toISOString(),
      assignedUser: assignedUserObj._id,
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('12. POST /api/tasks with invalid inputs should return 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '',
        description: '',
      });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('13. POST /api/tasks with valid data should create task successfully (201)', async () => {
    const taskData = {
      title: 'Implement Dark Mode and Dashboard Charts',
      description: 'Integrate Tailwind dark mode and Recharts into the dashboard',
      priority: 'High',
      status: 'In Progress',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      assignedUser: assignedUserObj._id,
    };

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.task.title, taskData.title);
    assert.strictEqual(res.body.task.priority, 'High');
    assert.strictEqual(res.body.task.status, 'In Progress');
    assert.ok(res.body.task.assignedUser);
    assert.strictEqual(res.body.task.assignedUser._id.toString(), assignedUserObj._id.toString());
    createdTaskId = res.body.task._id;
  });

  it('14. GET /api/tasks should return list of tasks with pagination and populated users', async () => {
    const res = await request(app)
      .get('/api/tasks?page=1&limit=10')
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.tasks));
    assert.ok(res.body.totalTasks >= 1);
    assert.strictEqual(res.body.currentPage, 1);
  });

  it('15. GET /api/tasks with search and filter parameters should filter correctly', async () => {
    const res = await request(app)
      .get('/api/tasks?search=Dark+Mode&priority=High&status=In+Progress')
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.tasks.length >= 1);
    assert.ok(res.body.tasks.every(t => t.priority === 'High'));
  });

  it('16. GET /api/tasks/stats should calculate real statistics from database', async () => {
    const res = await request(app)
      .get('/api/tasks/stats')
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.stats);
    assert.ok(res.body.stats.totalTasks >= 1);
    assert.ok(res.body.stats.statusBreakdown);
    assert.ok(res.body.stats.priorityBreakdown);
  });

  it('17. GET /api/tasks/:id should return single task details', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.task._id, createdTaskId);
  });

  it('18. PUT /api/tasks/:id should update task status and title', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'Completed',
        title: 'Implement Dark Mode and Dashboard Charts (Completed)',
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.task.status, 'Completed');
    assert.strictEqual(res.body.task.title, 'Implement Dark Mode and Dashboard Charts (Completed)');
  });

  it('19. DELETE /api/tasks/:id should delete task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.id, createdTaskId);
    createdTaskId = null;
  });
});
