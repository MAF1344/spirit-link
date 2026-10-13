# Test Scripts - Fase 1

## 📁 Struktur Folder

```
test-scripts/
└── fase-1/
    ├── test-database.js       # Automated database tests
    ├── test-frontend.js       # Frontend checklist generator
    └── test-fase-1e.sql       # SQL-based automated test
```

## 🚀 Cara Menjalankan

### Option 1: Node.js Automated Test

**Test Database:**
```bash
npm run test:fase1:db
```

**Test Frontend Checklist:**
```bash
npm run test:fase1:frontend
```

**Test All (Database + Frontend):**
```bash
npm run test:fase1
```

### Option 2: SQL Test (via Supabase Dashboard)

1. Buka Supabase Dashboard
2. Pilih project Spirit Link
3. Klik "SQL Editor"
4. Copy-paste isi file `test-fase-1e.sql`
5. Klik "Run"

## 📋 Test Coverage

### test-database.js
- ✅ Table structure verification (5 tables)
- ✅ Function existence check (4 functions)
- ✅ Quest master seed data (10 templates)
- ✅ Available test data listing
- ✅ Test setup verification

### test-frontend.js
- ✅ 37-point manual testing checklist
- ✅ Access control verification
- ✅ Tab functionality checks
- ✅ Negative test scenarios
- ✅ Error checking guide

### test-fase-1e.sql
- ✅ Complete SQL-based verification
- ✅ Database structure tests
- ✅ RLS policy checks
- ✅ Seed data validation
- ✅ Interactive setup guide

## 📊 Expected Results

All tests should pass with:
- ✅ 0 failures
- ✅ All tables exist
- ✅ All functions created
- ✅ 10 quest templates seeded
- ✅ RLS policies active

## 📖 Documentation

For detailed test documentation, see:
- `dokumentasi-test-dan-verifikasi/fase-1/FASE_1E_TEST_DOCUMENTATION.md`
- `dokumentasi-test-dan-verifikasi/fase-1/AUTOMATED_TESTING_GUIDE.md`

---

**Last Updated:** 13 Oktober 2026  
**Spirit Link Development Team**
