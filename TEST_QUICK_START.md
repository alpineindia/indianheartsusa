# 🧪 Quick Start - Automated Testing

Get running in 5 minutes!

## ⚡ Step 1: Install Test Dependencies (1 minute)

```bash
npm install
```

## ⚡ Step 2: Generate Test Data (1 minute)

```bash
npm run test:generate-data
```

**Creates:**
- 10 test users
- Sample profiles
- Relationships & interactions
- Success stories

## ⚡ Step 3: Start Dev Server (1 minute)

```bash
npm run dev
```

## ⚡ Step 4: Run Tests (2 minutes)

### Option A: Automated (Headless)
```bash
npm test
```
Best for CI/CD

### Option B: Visual (Headed) - RECOMMENDED
```bash
npm run test:headed
```
See browser interact with your site

### Option C: Interactive Debug
```bash
npm run test:debug
```
Step through tests line-by-line

### Option D: Web UI
```bash
npm run test:ui
```
Fancy visual interface

## ✅ View Results

```bash
npm run test:report
```
Opens HTML report in browser

---

## 📚 Test Credentials

After running `npm run test:generate-data`:

```
testuser1@matrimonial.test / TestPassword123!
testuser2@matrimonial.test / TestPassword123!
testuser3@matrimonial.test / TestPassword123!
... and so on to testuser10
```

---

## 🎯 What Gets Tested

✅ User Registration & Login  
✅ Profile Completeness  
✅ Horoscope Upload  
✅ Last Active Tracking  
✅ Favorites/Shortlist  
✅ Profile Analytics  
✅ Smart Matching  
✅ Email Notifications  
✅ Block & Report  
✅ Success Stories  
✅ Family Management  
✅ Search, Messaging, Interests  
✅ Performance & Security  

---

## 📊 Sample Test Run

```
Running 12 tests...

✓ Phase 1: Registration & Login (8.5s)
✓ Phase 2: Profile Completeness (3.2s)
✓ Phase 3: Horoscope Upload (2.8s)
✓ Phase 4: Last Active Tracking (4.1s)
✓ Phase 5: Favorites (5.3s)
✓ Phase 6: Analytics (3.9s)
✓ Phase 7: Matching (2.6s)
✓ Phase 8: Notifications (2.1s)
✓ Phase 9: Block & Report (4.2s)
✓ Phase 10: Success Stories (3.4s)
✓ Phase 11: Family Management (2.8s)
✓ Additional Tests (5.7s)

12 passed (1m 48s) ✓
```

---

## 🎓 Full Documentation

See `TESTING_GUIDE.md` for:
- Advanced configuration
- Writing custom tests
- CI/CD integration
- Debugging tips
- Best practices

---

## 💡 Common Commands

```bash
# Run all tests
npm test

# Run tests visually
npm run test:headed

# Debug mode
npm run test:debug

# Web UI
npm run test:ui

# View report
npm run test:report

# Generate test data
npm run test:generate-data

# Specific test
npx playwright test --grep "Phase 1"

# List all tests
npx playwright test --list
```

---

## ✨ That's it! You're testing! 🚀

For detailed docs: See `TESTING_GUIDE.md`

---

*Platform: IndianHearts USA | Test Framework: Playwright*
