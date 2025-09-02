# 📋 **COMPLETE API LIST FOR BACKEND DEVELOPMENT**

## **🎯 OVERVIEW:**
Complete API endpoints needed for the **Academic Calendar & Class Scheduling System**. All endpoints follow RESTful conventions.

---

## **📅 1. ACADEMIC YEARS MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/academics/years

GET    /api/v1/admin/academics/years          // Get all academic years
POST   /api/v1/admin/academics/years          // Create new academic year
GET    /api/v1/admin/academics/years/{id}     // Get specific year
PUT    /api/v1/admin/academics/years/{id}     // Update year
DELETE /api/v1/admin/academics/years/{id}     // Delete year
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/academics/years
{
  "name": "1st Year",
  "start_date": "2025-09-01",
  "end_date": "2026-06-30",
  "status": "ACTIVE"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "name": "1st Year",
    "start_date": "2025-09-01",
    "end_date": "2026-06-30",
    "status": "ACTIVE"
  }
}
```

---

## **📚 2. SEMESTER MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/academics/semesters

GET    /api/v1/admin/academics/semesters                    // Get all semesters
POST   /api/v1/admin/academics/semesters                    // Create new semester
GET    /api/v1/admin/academics/semesters/{id}               // Get specific semester
PUT    /api/v1/admin/academics/semesters/{id}               // Update semester
DELETE /api/v1/admin/academics/semesters/{id}               // Delete semester
GET    /api/v1/admin/academics/years/{yearId}/semesters     // Get semesters by year
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/academics/semesters
{
  "name": "1st Semester",
  "semester_number": 1,
  "year_id": "1",
  "start_date": "2025-09-01",
  "end_date": "2026-01-15",
  "status": "ACTIVE"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "name": "1st Semester",
    "semester_number": 1,
    "year_id": "1",
    "start_date": "2025-09-01",
    "end_date": "2026-01-15",
    "status": "ACTIVE"
  }
}
```

---

## **🎓 3. PROGRAM MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/academics/programs

GET    /api/v1/admin/academics/programs          // Get all programs
POST   /api/v1/admin/academics/programs          // Create new program
GET    /api/v1/admin/academics/programs/{id}     // Get specific program
PUT    /api/v1/admin/academics/programs/{id}     // Update program
DELETE /api/v1/admin/academics/programs/{id}     // Delete program
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/academics/programs
{
  "name": "Bachelor of Science in Computer Science",
  "degree_type": "B.S.",
  "stream_id": "1",
  "total_credits_required": 120,
  "status": "ACTIVE"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "name": "Bachelor of Science in Computer Science",
    "degree_type": "B.S.",
    "stream_id": "1",
    "total_credits_required": 120,
    "status": "ACTIVE"
  }
}
```

---

## **📖 4. COURSE MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/academics/courses

GET    /api/v1/admin/academics/courses           // Get all courses
POST   /api/v1/admin/academics/courses           // Create new course
GET    /api/v1/admin/academics/courses/{id}      // Get specific course
PUT    /api/v1/admin/academics/courses/{id}      // Update course
DELETE /api/v1/admin/academics/courses/{id}      // Delete course
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/academics/courses
{
  "course_code": "CS-101",
  "title": "Introduction to Programming",
  "description": "Basic programming concepts",
  "credit_hours": 3,
  "status": "ACTIVE"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "course_code": "CS-101",
    "title": "Introduction to Programming",
    "description": "Basic programming concepts",
    "credit_hours": 3,
    "status": "ACTIVE"
  }
}
```

---

## **🏢 5. CAMPUS MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/campuses

GET    /api/v1/admin/campuses          // Get all campuses
POST   /api/v1/admin/campuses          // Create new campus
GET    /api/v1/admin/campuses/{id}     // Get specific campus
PUT    /api/v1/admin/campuses/{id}     // Update campus
DELETE /api/v1/admin/campuses/{id}     // Delete campus
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/campuses
{
  "name": "Main Campus",
  "code": "MC",
  "address": "123 University Ave, City",
  "contact_number": "+1234567890",
  "email": "main@university.edu",
  "status": "ACTIVE"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "name": "Main Campus",
    "code": "MC",
    "address": "123 University Ave, City",
    "contact_number": "+1234567890",
    "email": "main@university.edu",
    "status": "ACTIVE"
  }
}
```

---

## **🏛️ 6. VENUE MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/venues

GET    /api/v1/admin/venues                     // Get all venues
POST   /api/v1/admin/venues                     // Create new venue
GET    /api/v1/admin/venues/{id}                // Get specific venue
PUT    /api/v1/admin/venues/{id}                // Update venue
DELETE /api/v1/admin/venues/{id}                // Delete venue
GET    /api/v1/admin/campuses/{campusId}/venues // Get venues by campus
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/venues
{
  "name": "Room 101",
  "code": "R101",
  "campus_id": "1",
  "building": "Science Building",
  "room_number": "101",
  "capacity": 30,
  "venue_type": "CLASSROOM",
  "status": "ACTIVE"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "name": "Room 101",
    "code": "R101",
    "campus_id": "1",
    "building": "Science Building",
    "room_number": "101",
    "capacity": 30,
    "venue_type": "CLASSROOM",
    "status": "ACTIVE"
  }
}
```

---

## **👨‍🏫 7. TEACHER MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/teachers

GET    /api/v1/admin/teachers          // Get all teachers
POST   /api/v1/admin/teachers          // Create new teacher
GET    /api/v1/admin/teachers/{id}     // Get specific teacher
PUT    /api/v1/admin/teachers/{id}     // Update teacher
DELETE /api/v1/admin/teachers/{id}     // Delete teacher
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/teachers
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@university.edu",
  "phone": "+1234567890",
  "department_id": "1",
  "status": "ACTIVE"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@university.edu",
    "phone": "+1234567890",
    "department_id": "1",
    "status": "ACTIVE"
  }
}
```

---

## **🎯 8. CLASS MANAGEMENT**

```typescript
// Base URL: /api/v1/admin/academics/classes

GET    /api/v1/admin/academics/classes          // Get all classes
POST   /api/v1/admin/academics/classes          // Create new class
GET    /api/v1/admin/academics/classes/{id}     // Get specific class
PUT    /api/v1/admin/academics/classes/{id}     // Update class
DELETE /api/v1/admin/academics/classes/{id}     // Delete class
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/academics/classes
{
  "course_id": "1",
  "year_id": "1",
  "semester_id": "1",
  "section_code": "01",
  "instructor_id": "1",
  "max_capacity": 30,
  "delivery_mode": "IN_PERSON",
  "status": "PLANNED"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "course_id": "1",
    "year_id": "1",
    "semester_id": "1",
    "section_code": "01",
    "instructor_id": "1",
    "max_capacity": 30,
    "current_enrollment": 0,
    "delivery_mode": "IN_PERSON",
    "status": "PLANNED"
  }
}
```

---

## **⏰ 9. CLASS MEETING TIMES**

```typescript
// Base URL: /api/v1/admin/academics/meeting-times

GET    /api/v1/admin/academics/meeting-times          // Get all meeting times
POST   /api/v1/admin/academics/meeting-times          // Create new meeting time
GET    /api/v1/admin/academics/meeting-times/{id}     // Get specific meeting time
PUT    /api/v1/admin/academics/meeting-times/{id}     // Update meeting time
DELETE /api/v1/admin/academics/meeting-times/{id}     // Delete meeting time
```

**Request/Response Data:**
```typescript
// POST /api/v1/admin/academics/meeting-times
{
  "class_id": "1",
  "day_of_week": "MONDAY",
  "start_time": "09:00",
  "end_time": "10:30",
  "venue_id": "1"
}

// GET Response
{
  "status": "success",
  "data": {
    "id": "1",
    "class_id": "1",
    "day_of_week": "MONDAY",
    "start_time": "09:00",
    "end_time": "10:30",
    "venue_id": "1"
  }
}
```

---

## **🔗 COMMON API ENDPOINTS (For Frontend Integration)**

```typescript
// These endpoints populate dropdowns in forms

GET /api/common/years                    // Get all years
GET /api/common/semesters                // Get all semesters  
GET /api/common/programs                 // Get all programs
GET /api/common/courses                  // Get all courses
GET /api/common/campuses                // Get all campuses
GET /api/common/venues                  // Get all venues
GET /api/common/teachers                // Get all teachers

// Dynamic loading based on selection
GET /api/common/years/semesters?year_id={yearId}           // Get semesters by year
GET /api/common/programs/courses?program_id={programId}    // Get courses by program
GET /api/common/campuses/venues?campus_id={campusId}      // Get venues by campus
```

---

## **📊 RESPONSE FORMATS**

### **Success Response:**
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Actual data here
  }
}
```

### **List Response with Pagination:**
```json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "data": {
    "items": [
      // Array of items
    ],
    "pagination": {
      "page": 1,
      "page_size": 10,
      "total": 100,
      "total_pages": 10
    }
  }
}
```

### **Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "error_code": "ERROR_CODE"
}
```

---

## **🔒 VALIDATION RULES**

1. **Unique Constraints:**
   - Course code must be unique
   - Section code must be unique within same course + semester + year
   - Venue code must be unique within campus

2. **Business Rules:**
   - Class capacity cannot be negative
   - Meeting times cannot overlap for same teacher/venue
   - Semester dates must be within year dates

3. **Conflict Detection:**
   - Return 409 Conflict if teacher/venue scheduling conflicts

---

## **📋 TOTAL API COUNT: 45 ENDPOINTS**

- **CRUD Operations:** 36 endpoints (9 modules × 4 operations)
- **Common Endpoints:** 9 endpoints (for frontend dropdowns)
- **Total:** 45 API endpoints

---

## **🎯 IMPLEMENTATION ORDER**

1. **Phase 1:** Academic Years, Semesters, Programs, Courses
2. **Phase 2:** Campus, Venue, Teachers  
3. **Phase 3:** Classes, Meeting Times
4. **Phase 4:** Common endpoints for frontend

---

## **🚀 FRONTEND STATUS**

✅ **Frontend is 100% Complete!**
- Dynamic form population
- Weekly/Monthly/Daily calendar views
- Class creation modal
- Real-time availability checking
- Calendar navigation
- Responsive design

---

**🎉 Backend team can start implementing these APIs! Frontend is ready and waiting!** 