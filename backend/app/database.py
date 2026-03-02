import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "users.db")

async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        yield db

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                email TEXT
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS user_vaults (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                vault_name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                UNIQUE(user_id, vault_name)
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS vault_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                vault_name TEXT NOT NULL,
                filename TEXT NOT NULL,
                uploaded_at TEXT NOT NULL,
                UNIQUE(user_id, vault_name, filename)
            )
        """)
        await db.commit()
