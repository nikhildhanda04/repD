import { test, expect } from '@playwright/test';

test.describe('Dashboard Page (Mocked)', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Mock the Authentication Session
    await page.route('**/api/auth/get-session', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          session: { id: 'mock-session' },
          user: { id: 'mock-user', name: 'Nikhil', email: 'test@example.com' } 
        })
      });
    });

    // 2. Mock the Telegram Config (assuming they have one connected)
    await page.route('**/api/telegram/config', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { botUsername: 'repDBot' } })
      });
    });

    // 3. Mock the Workouts Data
    await page.route('**/api/workouts', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          data: { 
            workouts: [
              { id: '1', exercise: 'bench press', sets: 3, reps: 10, weight: 80, unit: 'kg', loggedAt: new Date().toISOString() },
              { id: '2', exercise: 'squat', sets: 4, reps: 8, weight: 100, unit: 'kg', loggedAt: new Date().toISOString() }
            ] 
          } 
        })
      });
    });

    // 4. Mock the Stats Data
    await page.route('**/api/workouts/stats', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          data: { 
            totalWorkouts: 25, 
            activeDays: 12,
            exercises: {
              'bench press': { sessions: 10, exercise: 'bench press' },
              'squat': { sessions: 8, exercise: 'squat' }
            },
            personalRecords: [
              { exercise: 'bench press', maxWeight: 100, unit: 'kg' },
              { exercise: 'squat', maxWeight: 140, unit: 'kg' }
            ]
          } 
        })
      });
    });

    // 5. Mock the Bodyweight Data
    await page.route('**/api/workouts/bodyweight', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          data: { 
            latest: { weight: 75, unit: 'kg' },
            history: [{ weight: 75, unit: 'kg', loggedAt: new Date().toISOString() }]
          } 
        })
      });
    });

    // 6. Mock the AI Insights Data (Gemini)
    await page.route('**/api/workouts/insights', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          data: { 
            insights: "Great job this week! You crushed your bench press." 
          } 
        })
      });
    });
  });

  test('Renders all dashboard widgets with mocked data', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check if the user's name is rendered in the welcome message
    await expect(page.locator('h1')).toContainText('Welcome back, Nikhil');

    // Check if StatsCards are populated
    await expect(page.getByText('25', { exact: true })).toBeVisible(); // Total Workouts
    await expect(page.getByText('12', { exact: true })).toBeVisible(); // Active Days
    await expect(page.getByText('75 kg')).toBeVisible(); // Body weight

    // Check if AI Coach is rendered
    await expect(page.getByText('Great job this week! You crushed your bench press.')).toBeVisible();

    // Check if Recent Activity list is populated
    await expect(page.getByText('bench press', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('squat', { exact: true }).first()).toBeVisible();

    // Check if PR Board is populated
    await expect(page.locator('text=100 kg').first()).toBeVisible();
    await expect(page.locator('text=140 kg').first()).toBeVisible();
  });

});
