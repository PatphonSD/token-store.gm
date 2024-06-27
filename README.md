# Token Management API

API นี้ใช้สำหรับจัดการข้อมูล token ของผู้ใช้ โดยใช้ Express.js และ Redis เป็นฐานข้อมูล

## การติดตั้ง

1. ติดตั้ง dependencies:

   ```
   npm install express ioredis zod
   ```
2. ตั้งค่า Redis server ของคุณ
3. รันแอปพลิเคชัน:

   ```
   node app.js
   ```

## API Endpoints

### GET /token/:userId

ดึงข้อมูล token ของผู้ใช้

### POST /token

สร้างหรืออัปเดตข้อมูล token ของผู้ใช้

### DELETE /token/:userId

ลบข้อมูล token ของผู้ใช้

## โครงสร้างข้อมูล

ข้อมูล token ประกอบด้วย:

- `user_id`: string
- `input_token`: number
- `output_token`: number

## การใช้งาน

1. ดึงข้อมูล token:

   ```
   GET http://localhost:4250/token/user123
   ```
2. สร้าง/อัปเดตข้อมูล token:

   ```
   POST http://localhost:4250/token
   Content-Type: application/json

   {
     "user_id": "user123",
     "input_token": 100,
     "output_token": 50
   }
   ```
3. ลบข้อมูล token:

   ```
   DELETE http://localhost:4250/token/user123
   ```

## หมายเหตุ

- API นี้ใช้ Zod สำหรับตรวจสอบความถูกต้องของข้อมูล
- ข้อมูลถูกเก็บใน Redis โดยใช้ key ในรูปแบบ `user_{userId}`
- เซิร์ฟเวอร์ทำงานบนพอร์ต 4250
