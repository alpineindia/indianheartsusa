# IndianHearts USA - Automated Testing Guide

## Overview

This document explains how to run automated tests on the IndianHearts USA matrimonial platform. The test suite uses **Playwright** for end-to-end testing and covers all 10 feature phases plus additional functionality.

## 📋 What Gets Tested

### ✅ Covered Test Scenarios (12 Major Tests)

1. **Phase 1: Registration & Login** - User signup and authentication
2. **Phase 2: Profile Completeness** - Profile strength tracking
3. **Phase 3: Horoscope Upload** - Document upload functionality
4. **Phase 4: Last Active Tracking** - Activity status display
5. **Phase 5: Favorites/Shortlist** - Save profile feature
6. **Phase 6: Profile Analytics** - View tracking and statistics
7. **Phase 7: Smart Matching** - Compatibility scoring
8. **Phase 8: Email Notifications** - Notification infrastructure
9. **Phase 9: Block & Report** - Safety features
10. **Phase 10: Success Stories** - Testimonials and carousel
11. **Phase 11: Family Management** - Family member management
12. **Additional: Search, Messaging, Interests, Performance, Security**

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Playwright and dependencies
npm install --save-dev @playwright/test

# Or with yarn
yarn add --dev @playwright/test
```

### 2. Generate Test Data

```bash
# Create sample users and test data
npx ts-node scripts/generate-test-data.ts

# Or with tsx (faster)
npx tsx scripts/generate-test-data.ts
```

**This creates:**
- 10 test users (testuser1@matrimonial.test to testuser10@matrimonial.test)
- Sample profiles with various characteristics
- Interests, messages, and relationships
- Success stories
- All ready for immediate testing

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

### 4. Run Tests

```bash
# Run all tests
npx playwright test

# Run with UI (recommended for first time)
npx playwright test --headed

# Run with interactive debugger
npx playwright test --debug

# Run specific test file
npx playwright test user-flow.test.ts

# Run tests matching pattern
npx playwright test --grep "Phase 1"
```

---

## 📊 Test Execution Modes

### Mode 1: Headless (Automated)
```bash
npx playwright test
```
- Runs silently in the background
- Generates HTML report
- Best for CI/CD pipelines
- **Output:** `test-results/html/index.html`

### Mode 2: Headed (Visual)
```bash
npx playwright test --headed
```
- Opens browser window(s)
- See exactly what's being tested
- Can pause and interact
- Best for debugging

### Mode 3: Debug Mode (Interactive)
```bash
npx playwright test --debug
```
- Launches Playwright Inspector
- Step through tests line-by-line
- Inspect DOM and console
- Best for understanding failures

### Mode 4: UI Mode (Experimental)
```bash
npx playwright test --ui
```
- Web-based test interface
- Visual timeline of actions
- Best for exploring results

---

## 🔑 Test Credentials

After running `generate-test-data.ts`, use these credentials:

```
Email:    testuser1@matrimonial.test
Password: TestPassword123!

Email:    testuser2@matrimonial.test
Password: TestPassword123!

(And so on for testuser3 through testuser10)
```

---

## 📈 Test Reports

### HTML Report
```bash
npx playwright test
# Then open:
npx playwright show-report
```

### JSON Report
- Location: `test-results/results.json`
- Machine-readable format for CI/CD integration

### JUnit Report
- Location: `test-results/junit.xml`
- Compatible with Jenkins, GitLab CI, etc.

---

## 🛠️ Configuration

### Playwright Config File
Located at: `playwright.config.ts`

**Key Settings:**
- Test timeout: 60 seconds per test
- Parallel: Disabled (tests run sequentially for user flow)
- Browsers tested: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Auto-start dev server on test run

### Custom Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 60000, // Change test timeout
  workers: 1, // Control parallelization
  retries: 2, // Retry failed tests
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
});
```

---

## 📝 Test Structure

### Test File Location
`tests/e2e/user-flow.test.ts`

### Test Organization
```typescript
test.describe('IndianHearts USA - Complete User Journey', () => {
  test('Phase 1: User Registration & Login', async ({ page }) => {
    // Test code
  });

  test('Phase 2: Profile Completeness Score', async ({ page }) => {
    // Test code
  });

  // ... more tests
});
```

### Key Test Methods
```typescript
// Navigation
await page.goto('http://localhost:3000/register');

// User interactions
await page.fill('input[type="email"]', 'test@example.com');
await page.click('button:has-text("Submit")');

// Assertions
await expect(page.locator('h1')).toContainText('Welcome');

// Wait for elements
await page.waitForNavigation();
await page.waitForTimeout(500);
```

---

## 🔍 Debugging Tests

### Option 1: Use Debugger
```bash
npx playwright test user-flow.test.ts --debug
```
- Launches Playwright Inspector
- Step through code
- Inspect page state

### Option 2: Add Debug Output
```typescript
// In test file
console.log('Current URL:', page.url());
await page.screenshot({ path: 'debug.png' });
```

### Option 3: Check Videos & Screenshots
```bash
# After test run, videos are in:
test-results/chromium/user-flow.test.ts-User-Registration-Login/video.webm

# Screenshots on failure:
test-results/chromium/user-flow.test.ts-...screenshot.png
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Target page, context or browser has been closed"
**Solution:** Ensure dev server is running (`npm run dev`)

### Issue 2: "Timeout while waiting for navigation"
**Solution:** Increase timeout in playwright.config.ts
```typescript
timeout: 120000 // 120 seconds
```

### Issue 3: "Element not found"
**Solution:** Check selectors are correct
```typescript
// Use more specific selectors
await page.click('button[type="submit"]:has-text("Login")');
```

### Issue 4: "Port 3000 already in use"
**Solution:** Kill process or use different port
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
BASE_URL=http://localhost:3001 npx playwright test
```

---

## 📊 Sample Output

### After Running Tests
```
Running 12 tests using 1 worker

✓ Phase 1: User Registration & Login (8.5s)
✓ Phase 2: Profile Completeness Score (3.2s)
✓ Phase 3: Horoscope Upload & Display (2.8s)
✓ Phase 4: Last Active Tracking (4.1s)
✓ Phase 5: Favorites/Shortlist (5.3s)
✓ Phase 6: Profile Analytics & View Tracking (3.9s)
✓ Phase 7: Smart Matching Algorithm (2.6s)
✓ Phase 8: Email Notifications (2.1s)
✓ Phase 9: Block & Report System (4.2s)
✓ Phase 10: Success Stories (3.4s)
✓ Phase 11: Family Member Management (2.8s)
✓ Additional: Search & Filtering (5.7s)

12 passed (1m 48s)
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Generate test data
        run: npx tsx scripts/generate-test-data.ts

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: test-results/html/
          retention-days: 30
```

### GitLab CI Example
```yaml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx tsx scripts/generate-test-data.ts
    - npx playwright test
  artifacts:
    reports:
      junit: test-results/junit.xml
    paths:
      - test-results/html/
    expire_in: 30 days
```

---

## 🎯 Writing Custom Tests

### Template for New Test
```typescript
test('Custom Feature Test', async ({ page }) => {
  console.log('🧪 Testing Custom Feature');

  // 1. Setup
  await loginAsTestUser(page);
  await page.goto(`${BASE_URL}/path/to/page`);

  // 2. Action
  await page.click('button:has-text("Action")');

  // 3. Assertion
  const result = await page.locator('text=Expected').textContent();
  expect(result).toBeTruthy();

  console.log('✅ Custom feature working');
});
```

### Test Best Practices
```typescript
// ✅ DO: Use specific, reliable selectors
await page.click('button[data-testid="submit"]');

// ❌ DON'T: Use fragile selectors
await page.click('button'); // Too vague

// ✅ DO: Wait for elements explicitly
await page.waitForSelector('h1');

// ❌ DON'T: Use arbitrary timeouts
await page.waitForTimeout(5000);

// ✅ DO: Test user workflows end-to-end
// ❌ DON'T: Test implementation details
```

---

## 📚 Resources

### Official Documentation
- [Playwright Testing Docs](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-test)

### Useful Commands
```bash
# List all tests
npx playwright test --list

# Run tests with verbose output
npx playwright test --verbose

# Update snapshots (for visual regression)
npx playwright test --update-snapshots

# Show test report in browser
npx playwright show-report

# Kill all test processes
pkill -f playwright
```

---

## ✨ Next Steps

1. **Generate Test Data**: `npx tsx scripts/generate-test-data.ts`
2. **Start Dev Server**: `npm run dev`
3. **Run Tests**: `npx playwright test --headed`
4. **Review Report**: `npx playwright show-report`
5. **Integrate with CI/CD**: Add GitHub Actions workflow

---

## 🆘 Support

For issues or questions:
1. Check playwright.dev documentation
2. Review test file comments
3. Run tests in debug mode: `--debug`
4. Check test-results folder for videos/screenshots

---

**Happy Testing! 🚀**

---

*Last Updated: June 9, 2026*  
*Platform: IndianHearts USA - Matrimonial Platform*  
*Test Framework: Playwright v1.40+*
