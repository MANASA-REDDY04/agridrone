from backend.app import app
from backend.app import db
from backend.utils.db_init import init_db

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        init_db()
    app.run(debug=True, port=8000)
