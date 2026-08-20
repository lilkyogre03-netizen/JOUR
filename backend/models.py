from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    tanggal_lahir = db.Column(db.Date, nullable=False)


class JournalEntry(db.Model):
    __tablename__ = 'journal_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    tanggal = db.Column(db.Date, nullable=False)
    judul = db.Column(db.String(255), nullable=False)
    pesan = db.Column(db.Text)
    mood = db.Column(db.Integer, nullable=False)
    gambar = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    waktu_entry=db.Column(db.String(10),nullable=False)
    __table_args__ = (
        db.UniqueConstraint('user_id', 'tanggal','waktu_entry'),
    )