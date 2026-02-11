import sqlite3
import os

DB_PATH = "users.db"

def check_database():
    print(f"Checking database at: {os.path.abspath(DB_PATH)}")
    
    if not os.path.exists(DB_PATH):
        print("❌ Database file not found!")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if tables:
            print("✅ Database connection successful!")
            print(f"Found tables: {', '.join([t[0] for t in tables])}")
            
            # Check users count if users table exists
            if ('users',) in tables:
                cursor.execute("SELECT COUNT(*) FROM users")
                count = cursor.fetchone()[0]
                print(f"Users count: {count}")
        else:
            print("✅ Database connection successful, but no tables found.")
            
        conn.close()
        
    except sqlite3.Error as e:
        print(f"❌ SQLite error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_database()
