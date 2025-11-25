# schemas.py
from datetime import datetime, date
from pydantic import BaseModel, EmailStr
from typing import Optional, List


# ---- Termin ----
class TerminBase(BaseModel):
    beginn: datetime
    ende: datetime
    beschreibung: Optional[str] = None


class TerminCreate(TerminBase):
    pass


class TerminUpdate(BaseModel):
    beginn: Optional[datetime] = None
    ende: Optional[datetime] = None
    beschreibung: Optional[str] = None


class TerminOut(TerminBase):
    termin_id: int

    model_config = {
        "from_attributes": True
    }


# ---- Person ----
class PersonBase(BaseModel):
    name: str
    geburtstag: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[EmailStr] = None


class PersonCreate(PersonBase):
    pass


class PersonUpdate(BaseModel):
    name: Optional[str] = None
    geburtstag: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[EmailStr] = None


class PersonOut(PersonBase):
    person_id: int

    model_config = {
        "from_attributes": True
    }


# ---- Buchung ----
class BuchungBase(BaseModel):
    termin_id: int
    person_id: int
    buchungsnummer: str


class BuchungCreate(BuchungBase):
    pass


class BuchungUpdate(BaseModel):
    buchungsnummer: Optional[str] = None


class BuchungOut(BuchungBase):
    model_config = {
        "from_attributes": True
    }
