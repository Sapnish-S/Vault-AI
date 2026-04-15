from fastapi import APIRouter, HTTPException, Depends
from app.auth.schemas import UserCreate, UserResponse, LoginRequest, RoleUpdate
from app.utils.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
from app.database import get_db
import aiosqlite
from datetime import timedelta

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate, db: aiosqlite.Connection = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    
    try:
        cursor = await db.execute(
            "INSERT INTO users (username, hashed_password, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?, ?)",
            (user.username, hashed_password, user.first_name, user.last_name, user.email, "Software Engineer")
        )
        await db.commit()
        user_id = cursor.lastrowid
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user_id)}, expires_delta=access_token_expires
        )
        
        # We temporarily return dict if we don't want to change UserResponse schema just yet,
        # but to keep it simple we can return standard dict or modify schema later.
        return {
            "id": user_id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": "Software Engineer",
            "access_token": access_token
        }
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
    # user tuple structure: (id, username, hashed_password, first_name, last_name, email, role)
    # password hash is at index 2
    if not verify_password(user_data.password, user[2]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user[0])}, expires_delta=access_token_expires
    )

    # We return the whole user object for convenience in the frontend
    return {
        "message": "Login successful", 
        "user_id": user[0], 
        "username": user[1],
        "first_name": user[3],
        "last_name": user[4],
        "email": user[5],
        "role": user[6],
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/profile/{user_id}")
async def get_profile(user_id: int, current_user_id: int = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this profile")
    
    async with db.execute("SELECT id, username, first_name, last_name, email, role FROM users WHERE id = ?", (current_user_id,)) as cursor:
        user = await cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user[0],
            "username": user[1],
            "first_name": user[2],
            "last_name": user[3],
            "email": user[4],
            "role": user[5]
        }

@router.put("/profile/{user_id}/role")
async def update_role(user_id: int, role_update: RoleUpdate, current_user_id: int = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
    await db.execute(
        "UPDATE users SET role = ? WHERE id = ?",
        (role_update.role, current_user_id)
    )
    await db.commit()
    return {"message": "Role updated successfully", "role": role_update.role}
