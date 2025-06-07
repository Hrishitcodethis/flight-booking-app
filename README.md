# Flight Booking API

A RESTful API for flight booking built with Node.js, Express, and Supabase.

## Features

- Search available flights
- Get flight details
- Create bookings
- View booking details
- Input validation
- Error logging
- CORS enabled
- Environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- npm
- Supabase account and project

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=development
   ```

4. Set up Supabase tables:

   Create the following tables in your Supabase project:

   ```sql
   -- Flights table
   create table flights (
     id uuid default uuid_generate_v4() primary key,
     origin text not null,
     destination text not null,
     date date not null,
     departure_time time not null,
     arrival_time time not null,
     price decimal(10,2) not null,
     available_seats integer not null,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Bookings table
   create table bookings (
     id uuid default uuid_generate_v4() primary key,
     flight_id uuid references flights(id),
     booking_ref text not null unique,
     passenger_info jsonb not null,
     status text not null,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Reference
✈️ Flights
GET /api/flights
Search for available flights.

Query Params: origin, destination, date

Example:
/api/flights?origin=JFK&destination=LAX&date=2024-04-01

GET /api/flights/:id
Get details for a specific flight.

Example:
/api/flights/123e4567-e89b-12d3-a456-426614174000

### Bookings

- `POST /api/bookings` - Create a new booking
  - Body:
    ```json
    {
      "flight_id": "123e4567-e89b-12d3-a456-426614174000",
      "passenger_info": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    }
    ```

- `GET /api/bookings/:id` - Get booking details
  - Example: `/api/bookings/123e4567-e89b-12d3-a456-426614174000`

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Logging

Logs are stored in:
- `error.log`: Error logs
- `combined.log`: All logs

## Testing

You can test the API using tools like Postman or curl. Example curl commands:

```bash
# Search flights
curl "http://localhost:3000/api/flights?origin=JFK&destination=LAX&date=2024-04-01"

# Get flight details
curl http://localhost:3000/api/flights/123e4567-e89b-12d3-a456-426614174000

# Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"flight_id":"123e4567-e89b-12d3-a456-426614174000","passenger_info":{"first_name":"John","last_name":"Doe","email":"john@example.com","phone":"1234567890"}}'

# Get booking details
curl http://localhost:3000/api/bookings/123e4567-e89b-12d3-a456-426614174000
```
