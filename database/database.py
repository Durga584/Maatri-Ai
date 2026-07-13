import sqlite3
from datetime import datetime

DB_NAME = "maatri.db"


def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        age REAL,
        systolic_bp REAL,
        diastolic_bp REAL,
        bs REAL,
        body_temp REAL,
        heart_rate REAL,
        risk_level TEXT,
        confidence REAL
    )
    """)

    conn.commit()
    conn.close()


def save_assessment(
    age,
    systolic_bp,
    diastolic_bp,
    bs,
    body_temp,
    heart_rate,
    risk_level,
    confidence
):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO assessments
    (
        timestamp,
        age,
        systolic_bp,
        diastolic_bp,
        bs,
        body_temp,
        heart_rate,
        risk_level,
        confidence
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    (
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        age,
        systolic_bp,
        diastolic_bp,
        bs,
        body_temp,
        heart_rate,
        risk_level,
        confidence
    ))

    conn.commit()
    conn.close()


def get_assessments():
    conn = sqlite3.connect(DB_NAME)

    cursor = conn.cursor()

    cursor.execute("""
    SELECT *
    FROM assessments
    ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return rows