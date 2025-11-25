# main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db, Base, engine
from models import Termin, Person, Buchung
from schemas import (
    TerminCreate, TerminUpdate, TerminOut,
    PersonCreate, PersonUpdate, PersonOut,
    BuchungCreate, BuchungUpdate, BuchungOut,
)

app = FastAPI(title="Terminverwaltung API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # im Zweifel: ["*"] für alles im Dev
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, PUT, DELETE, ...
    allow_headers=["*"],
)

# Falls du die Tabellen von SQLAlchemy erzeugen lassen willst:
# Achtung: überschreibt NICHT existierende Tabellen, sondern erstellt nur,
# was noch nicht da ist.
Base.metadata.create_all(bind=engine)


# ------------------ Termin ------------------

@app.post("/termine", response_model=TerminOut)
def create_termin(termin: TerminCreate, db: Session = Depends(get_db)):
    db_termin = Termin(**termin.dict())
    db.add(db_termin)
    db.commit()
    db.refresh(db_termin)
    return db_termin


@app.get("/termine/{termin_id}", response_model=TerminOut)
def get_termin(termin_id: int, db: Session = Depends(get_db)):
    t = db.query(Termin).get(termin_id)
    if not t:
        raise HTTPException(status_code=404, detail="Termin nicht gefunden")
    return t


@app.put("/termine/{termin_id}", response_model=TerminOut)
def update_termin(termin_id: int, updates: TerminUpdate, db: Session = Depends(get_db)):
    t = db.query(Termin).get(termin_id)
    if not t:
        raise HTTPException(status_code=404, detail="Termin nicht gefunden")

    for field, value in updates.dict(exclude_unset=True).items():
        setattr(t, field, value)

    db.commit()
    db.refresh(t)
    return t


@app.delete("/termine/{termin_id}")
def delete_termin(termin_id: int, db: Session = Depends(get_db)):
    termin = (
        db.query(Termin)
        .filter(Termin.termin_id == termin_id)
        .first()
    )
    if not termin:
        raise HTTPException(status_code=404, detail="Termin nicht gefunden")

    db.query(Buchung).filter(
        Buchung.termin_id == termin_id
    ).delete(synchronize_session=False)

    # danach den Termin selbst löschen
    db.delete(termin)
    db.commit()
    return {"detail": "Termin gelöscht"}


@app.get("/termine", response_model=List[TerminOut])
def search_termine(
    von: Optional[datetime] = Query(None),
    bis: Optional[datetime] = Query(None),
    beschreibung: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Termin)
    if von:
        q = q.filter(Termin.beginn >= von)
    if bis:
        q = q.filter(Termin.ende <= bis)
    if beschreibung:
        q = q.filter(Termin.beschreibung.ilike(f"%{beschreibung}%"))
    return q.order_by(Termin.beginn).all()


# ------------------ Person ------------------

@app.post("/personen", response_model=PersonOut)
def create_person(person: PersonCreate, db: Session = Depends(get_db)):
    if person.telefonnummer:
        existing = db.query(Person).filter_by(telefonnummer=person.telefonnummer).first()
        if existing:
            raise HTTPException(status_code=400, detail="Telefonnummer bereits vergeben")

    p = Person(**person.dict())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@app.get("/personen/{person_id}", response_model=PersonOut)
def get_person(person_id: int, db: Session = Depends(get_db)):
    p = db.query(Person).get(person_id)
    if not p:
        raise HTTPException(status_code=404, detail="Person nicht gefunden")
    return p


@app.put("/personen/{person_id}", response_model=PersonOut)
def update_person(person_id: int, updates: PersonUpdate, db: Session = Depends(get_db)):
    p = db.query(Person).get(person_id)
    if not p:
        raise HTTPException(status_code=404, detail="Person nicht gefunden")

    data = updates.dict(exclude_unset=True)

    # Telefonnummer-Unique prüfen
    new_tel = data.get("telefonnummer")
    if new_tel:
        existing = db.query(Person).filter(
            Person.telefonnummer == new_tel,
            Person.person_id != person_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Telefonnummer bereits vergeben")

    for field, value in data.items():
        setattr(p, field, value)

    db.commit()
    db.refresh(p)
    return p


@app.delete("/personen/{person_id}")
def delete_person(person_id: int, db: Session = Depends(get_db)):
    p = db.query(Person).get(person_id)
    if not p:
        raise HTTPException(status_code=404, detail="Person nicht gefunden")
    db.delete(p)
    db.commit()
    return {"detail": "Person gelöscht"}


@app.get("/personen", response_model=List[PersonOut])
def search_personen(
    name: Optional[str] = Query(None),
    telefonnummer: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Person)
    if name:
        q = q.filter(Person.name.ilike(f"%{name}%"))
    if telefonnummer:
        q = q.filter(Person.telefonnummer == telefonnummer)
    return q.order_by(Person.name).all()


# ------------------ Buchung ------------------

@app.post("/buchungen", response_model=BuchungOut)
def create_buchung(buchung: BuchungCreate, db: Session = Depends(get_db)):
    # einfache Existenzprüfungen
    if not db.query(Termin).get(buchung.termin_id):
        raise HTTPException(status_code=400, detail="Termin existiert nicht")
    if not db.query(Person).get(buchung.person_id):
        raise HTTPException(status_code=400, detail="Person existiert nicht")

    existing = db.query(Buchung).filter_by(
        termin_id=buchung.termin_id, person_id=buchung.person_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Buchung existiert bereits")

    existing_nr = db.query(Buchung).filter_by(
        buchungsnummer=buchung.buchungsnummer
    ).first()
    if existing_nr:
        raise HTTPException(status_code=400, detail="Buchungsnummer bereits vergeben")

    b = Buchung(**buchung.dict())
    db.add(b)
    db.commit()
    db.refresh(b)
    return b


@app.get("/buchungen", response_model=List[BuchungOut])
def search_buchungen(
    termin_id: Optional[int] = Query(None),
    person_id: Optional[int] = Query(None),
    buchungsnummer: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Buchung)
    if termin_id is not None:
        q = q.filter(Buchung.termin_id == termin_id)
    if person_id is not None:
        q = q.filter(Buchung.person_id == person_id)
    if buchungsnummer:
        q = q.filter(Buchung.buchungsnummer == buchungsnummer)
    return q.all()


@app.put("/buchungen/{termin_id}/{person_id}", response_model=BuchungOut)
def update_buchung(
    termin_id: int,
    person_id: int,
    updates: BuchungUpdate,
    db: Session = Depends(get_db),
):
    b = db.query(Buchung).get((termin_id, person_id))
    if not b:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")

    data = updates.dict(exclude_unset=True)
    new_nr = data.get("buchungsnummer")
    if new_nr:
        existing_nr = db.query(Buchung).filter(
            Buchung.buchungsnummer == new_nr,
            Buchung.termin_id != termin_id,
            Buchung.person_id != person_id,
        ).first()
        if existing_nr:
            raise HTTPException(status_code=400, detail="Buchungsnummer bereits vergeben")

    for field, value in data.items():
        setattr(b, field, value)

    db.commit()
    db.refresh(b)
    return b


@app.delete("/buchungen/{termin_id}/{person_id}")
def delete_buchung(termin_id: int, person_id: int, db: Session = Depends(get_db)):
    b = db.query(Buchung).get((termin_id, person_id))
    if not b:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    db.delete(b)
    db.commit()
    return {"detail": "Buchung gelöscht"}
