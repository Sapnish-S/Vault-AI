from fastapi import APIRouter, HTTPException, Depends
from app.auth.schemas import UserCreate, UserResponse
from app.utils.security import get_password_hash
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
