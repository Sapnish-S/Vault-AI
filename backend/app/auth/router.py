from fastapi import APIRouter, HTTPException, Depends
from app.auth.schemas import UserCreate, UserResponse, LoginRequest
from app.utils.security import get_password_hash, verify_password
from app.database import get_db
import aiosqlite

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: aiosqlite.Connection = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    
    try:
        cursor = await db.execute(
            "INSERT INTO users (username, hashed_password, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)",
            (user.username, hashed_password, user.first_name, user.last_name, user.email)
        )
        await db.commit()
        user_id = cursor.lastrowid
        
        return UserResponse(
            id=user_id,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email
        )
    except aiosqlite.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already registered")

@router.post("/login") # simplified response for now
async def login(user_data: LoginRequest, db: aiosqlite.Connection = Depends(get_db)):
    # Check if user exists
    async with db.execute("SELECT * FROM users WHERE username = ?", (user_data.username,)) as cursor:
        user = await cursor.fetchone()
    
    if not user:
         raise HTTPException(status_code=400, detail="Incorrect username or password")

    # verify password
    # user tuple structure: (id, username, hashed_password, first_name, last_name, email)
    # password hash is at index 2
    if not verify_password(user_data.password, user[2]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    return {"message": "Login successful", "user_id": user[0], "username": user[1]}
