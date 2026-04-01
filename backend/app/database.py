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
        await db.execute("""
            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                vault_name TEXT,
                title TEXT NOT NULL,
                created_at TEXT NOT NULL,
                sender_name TEXT,
                receiver_name TEXT,
                label TEXT,
                time_frame TEXT
            )
        """)
        
        # Add new columns to existing table if they don't exist
        try:
            await db.execute("ALTER TABLE chats ADD COLUMN sender_name TEXT")
        except:
            pass
        try:
            await db.execute("ALTER TABLE chats ADD COLUMN receiver_name TEXT")
        except:
            pass
        try:
            await db.execute("ALTER TABLE chats ADD COLUMN label TEXT")
        except:
            pass
        try:
            await db.execute("ALTER TABLE chats ADD COLUMN time_frame TEXT")
        except:
            pass
        await db.execute("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY(chat_id) REFERENCES chats(id)
            )
        """)
        await db.commit()
