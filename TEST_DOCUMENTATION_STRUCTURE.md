# Spirit Link - Test Scripts & Documentation

## 📂 Struktur Folder

```
spirit-link/
├── test-scripts/                          # Automated test scripts
│   └── fase-1/                           # Fase 1E: GM Dashboard
│       ├── test-database.js              # Database verification
│       ├── test-frontend.js              # Frontend checklist
│       ├── test-fase-1e.sql              # SQL automated test
│       └── README.md                     # Fase 1 test guide
│
├── dokumentasi-test-dan-verifikasi/       # Test documentation
│   └── fase-1/                           # Fase 1E documentation
│       ├── FASE_1E_TEST_DOCUMENTATION.md # Comprehensive test docs
│       ├── AUTOMATED_TESTING_GUIDE.md    # Quick start guide
│       └── README.md                     # Fase 1 docs overview
│
└── package.json                          # Updated with test scripts
```

## 🚀 Quick Start

### Run Fase 1 Tests

```bash
# Run all Fase 1 tests
npm run test:fase1

# Or run individually:
npm run test:fase1:db        # Database tests
npm run test:fase1:frontend  # Frontend checklist
```

### For Future Phases

```bash
# Fase 2 (when created)
npm run test:fase2
npm run test:fase2:db
npm run test:fase2:frontend

# Fase 3 (when created)
npm run test:fase3
# ... and so on
```

## 📋 Test Scripts per Fase

### Fase 1E: GM Dashboard
**Location:** `test-scripts/fase-1/`

**Scripts:**
- `test-database.js` - Verifies tables, functions, RLS policies
- `test-frontend.js` - Generates 37-point checklist
- `test-fase-1e.sql` - SQL-based verification

**Documentation:**
- `FASE_1E_TEST_DOCUMENTATION.md` - 65 test cases
- `AUTOMATED_TESTING_GUIDE.md` - Quick start

**Coverage:** 65 test cases, ~50 min execution

---

### Fase 2: [Future]
**Location:** `test-scripts/fase-2/` (to be created)

**Scripts:** TBD
- `test-database.js`
- `test-frontend.js`
- `test-fase-2.sql`

**Documentation:** TBD
- `FASE_2_TEST_DOCUMENTATION.md`
- `AUTOMATED_TESTING_GUIDE.md`

---

## 📊 Testing Workflow

### For Each New Fase

1. **Development Phase**
   - Implement features
   - Create automated test scripts
   - Write comprehensive test documentation

2. **Testing Phase** (can be done at end of project)
   - Run automated tests
   - Execute manual checklists
   - Document results

3. **Review Phase**
   - Review test documentation as summary
   - Check coverage metrics
   - Verify success criteria

## 🎯 Naming Conventions

### Test Scripts
- `test-database.js` - Database verification
- `test-frontend.js` - Frontend testing
- `test-fase-N.sql` - SQL-based tests

### Documentation
- `FASE_N_TEST_DOCUMENTATION.md` - Comprehensive test docs
- `AUTOMATED_TESTING_GUIDE.md` - Quick start guide
- `README.md` - Overview

### NPM Scripts
- `test:faseN` - Run all tests for fase N
- `test:faseN:db` - Database tests only
- `test:faseN:frontend` - Frontend tests only

## ✅ Standards

Each fase should have:
- ✅ Automated test scripts (Node.js + SQL)
- ✅ Comprehensive documentation (markdown)
- ✅ Test cases with expected results
- ✅ Success criteria defined
- ✅ Execution time estimated
- ✅ README.md for quick reference

## 📈 Metrics Tracking

| Fase | Test Cases | Automated | Manual | Coverage | Time |
|------|-----------|-----------|--------|----------|------|
| Fase 1E | 65 | 45 | 37 | ~95% | ~50 min |
| Fase 2 | TBD | TBD | TBD | TBD | TBD |
| Fase 3 | TBD | TBD | TBD | TBD | TBD |

## 🔄 Regression Testing

When adding new fase, always run regression tests for previous phases:

```bash
# Test all phases (when multiple exist)
npm run test:fase1 && npm run test:fase2 && npm run test:fase3
```

## 📝 How to Add New Fase Tests

1. **Create folder structure:**
   ```bash
   mkdir test-scripts/fase-N
   mkdir dokumentasi-test-dan-verifikasi/fase-N
   ```

2. **Copy template files from fase-1:**
   ```bash
   cp test-scripts/fase-1/*.js test-scripts/fase-N/
   cp test-scripts/fase-1/*.sql test-scripts/fase-N/
   cp dokumentasi-test-dan-verifikasi/fase-1/*.md dokumentasi-test-dan-verifikasi/fase-N/
   ```

3. **Update package.json:**
   ```json
   "scripts": {
     "test:faseN": "npm run test:faseN:db && npm run test:faseN:frontend",
     "test:faseN:db": "node test-scripts/fase-N/test-database.js",
     "test:faseN:frontend": "node test-scripts/fase-N/test-frontend.js"
   }
   ```

4. **Customize for new fase:**
   - Update test cases
   - Update documentation
   - Update expected results

## 🎓 Benefits

### For Development
- **Organized:** Clear separation per fase
- **Scalable:** Easy to add new test suites
- **Reusable:** Template approach for consistency

### For Testing
- **Automated:** Run tests with single command
- **Documented:** Comprehensive test documentation
- **Trackable:** Clear metrics and coverage

### For Review
- **Summary:** Each fase has complete documentation
- **Audit Trail:** All test cases documented
- **Regression:** Easy to re-test previous phases

## 📞 Support

**Questions about testing?**
- Check fase-specific README.md
- Review AUTOMATED_TESTING_GUIDE.md
- Consult FASE_N_TEST_DOCUMENTATION.md

---

**Last Updated:** 13 Oktober 2026  
**Spirit Link Development Team**
