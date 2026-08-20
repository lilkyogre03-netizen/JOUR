import os
from flask import Flask
from dotenv import load_dotenv
from models import db
from models import User
from models import JournalEntry
from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from flask_cors import CORS
#venv\Scripts\activate
#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4NTY3NTU5MCwianRpIjoiNDhiZjc0ODMtZmNjYi00MDE5LThkYTktNTM0MDIwNjhkMDRlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYiLCJuYmYiOjE3ODU2NzU1OTAsImNzcmYiOiJjZmJjZDAwNC1hMjBkLTQxOTItYTdjNC03MGY5ZjVkZmQzYWQiLCJleHAiOjE3ODYyODAzOTB9.4fyrtYdyUiKWEYaStiTYRnQZu7TYDB89PknQyI0VRbw
from datetime import date
import calendar
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
jwt = JWTManager(app)

db.init_app(app)

@app.route('/hello', methods=['GET'])
def hello():
    return {'message': 'Hello Jour!'}



@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    result = []
    for user in users:
        result.append({
            'id': user.id,
            'nama': user.nama,
            'email': user.email
        })
    return {'users': result} 


@app.route('/register',methods=['POST'])
def register():
    data=request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user=User(
        nama=data['nama'],
        email=data['email'],
        password= hashed_password,
        tanggal_lahir=data['tanggal_lahir']
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User berhasil dibuat', 'id': new_user.id}
    except Exception as e:
        db.session.rollback()
        return {'error': 'Email sudah terdaftar'}, 400

@app.route('/login',methods=['POST'])
def login():
    data=request.get_json()
    users=User.query.filter_by(email=data['email']).first()
    if users:
        pw=check_password_hash(users.password,data['password'])

        if pw == True:
            access_token = create_access_token(identity=str(users.id))
            return {'message': 'Login berhasil', 'token': access_token}
        else :
            return {'error':"Email atau password salah"}
    else :
        return {'error':"Email atau password salah"}

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return {'id': user.id, 'nama': user.nama, 'email': user.email}

@app.route('/entries', methods=['POST'])
@jwt_required()
def entries():
    data=request.get_json()
    userid = get_jwt_identity()
    journalentries=JournalEntry(
        tanggal=data['tanggal'],
        judul=data['judul'],
        pesan=data['pesan'],
        mood=data['mood'],
        gambar=data['gambar'],
        user_id=userid,
        waktu_entry=data['waktu_entry']
    )
    try:
        db.session.add(journalentries)
        db.session.commit()
        return {'message': 'Journal baru User berhasil dibuat', 'id': journalentries.id}
    except Exception as e:
        db.session.rollback()
        return {'error': 'kesalahan terjadi'}, 400

@app.route('/entries/<tanggal>/<waktu_entry>',methods=['GET'])
@jwt_required()
def get_entries(tanggal,waktu_entry):
    user=get_jwt_identity()
    entry=JournalEntry.query.filter_by(tanggal=tanggal, user_id=user,waktu_entry=waktu_entry).first()
    if entry :
        return {'judul':entry.judul, 'pesan': entry.pesan, 'mood': entry.mood,'user_id':user,'waktu_entry': waktu_entry}
    else :
        return{'error':"maaf user tidak di temukan"}, 400

@app.route('/entries/<tanggal>/<waktu_entry>',methods=['PATCH'])
@jwt_required()
def update(tanggal,waktu_entry):
    user=get_jwt_identity()
    entry=JournalEntry.query.filter_by(tanggal=tanggal, user_id=user,waktu_entry=waktu_entry).first()
    data=request.get_json()
    if entry :
            entry.tanggal=data['tanggal']
            entry.judul=data['judul']
            entry.pesan=data['pesan']
            entry.mood=data['mood']
            entry.gambar=data['gambar']
    else :
         return{'error':"maaf entry tidak di temukan"}, 400
    try:
            db.session.commit()
            return {'message': 'Journal  User berhasil diperbarui', 'id': entry.id}
    except Exception as e:
            db.session.rollback()
            return {'error': 'kesalahan terjadi'}, 400


@app.route('/entries', methods=['GET'])
@jwt_required()
def get_entries_by_month():
    user_id = get_jwt_identity()
    bulan = int(request.args.get('bulan'))
    tahun = int(request.args.get('tahun'))
    
    tanggal_awal = date(tahun, bulan, 1)
    hari_terakhir = calendar.monthrange(tahun, bulan)[1]
    tanggal_akhir = date(tahun, bulan, hari_terakhir)
    
    entries = JournalEntry.query.filter(
        JournalEntry.user_id == user_id,
        JournalEntry.tanggal >= tanggal_awal,
        JournalEntry.tanggal <= tanggal_akhir
    ).all()
    
    result = []
    for entry in entries:
        result.append({
            'id': entry.id,
            'tanggal': str(entry.tanggal),
            'judul': entry.judul,
            'mood': entry.mood,
            'waktu_entry':entry.waktu_entry
        })
    
    return {'entries': result}



@app.route('/stats/mood', methods=['GET'])
@jwt_required()
def get_stat_by_month():
    user_id = get_jwt_identity()
    bulan = int(request.args.get('bulan'))
    tahun = int(request.args.get('tahun'))
    
    tanggal_awal = date(tahun, bulan, 1)
    hari_terakhir = calendar.monthrange(tahun, bulan)[1]
    tanggal_akhir = date(tahun, bulan, hari_terakhir)
    
    entries = JournalEntry.query.filter(
        JournalEntry.user_id == user_id,
        JournalEntry.tanggal >= tanggal_awal,
        JournalEntry.tanggal <= tanggal_akhir
    ).all()
    
    result = []
    for entry in entries:
        result.append({
            'tanggal': str(entry.tanggal),
            'mood': entry.mood
        })
    
    return {'entries': result}

if __name__ == '__main__':
    app.run(debug=True)