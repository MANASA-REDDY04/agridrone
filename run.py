import os
from backend.app import app
from backend.app import db
from backend.utils.db_init import init_db

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        init_db()
    
    port = int(os.environ.get("PORT", 8000))  # Get PORT from Render, default to 8000
    app.run(debug=True, host="0.0.0.0", port=port)
