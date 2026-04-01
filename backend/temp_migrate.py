import sqlite3
import os

DB_PATH = "c:/Users/Sapnish/Vault_AI/backend/users.db"
if os.path.exists(DB_PATH):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for col in ["sender_name", "receiver_name", "label", "time_frame"]:
        try:
            cursor.execute(f"ALTER TABLE chats ADD COLUMN {col} TEXT")
            print(f"Added {col}")
        except Exception as e:
            print(f"Did not add {col}: {e}")
    conn.commit()
    conn.close()
    print("Database altered.")
else:
    print("DB not found.")
