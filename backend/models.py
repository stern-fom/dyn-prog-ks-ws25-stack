# models.py
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Termin(Base):
    __tablename__ = "termin"

    termin_id = Column(Integer, primary_key=True, index=True)
    beginn = Column(DateTime, nullable=False)
    ende = Column(DateTime, nullable=False)
    beschreibung = Column(String(255))

    buchungen = relationship("Buchung", back_populates="termin")


class Person(Base):
    __tablename__ = "person"

    person_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    geburtstag = Column(Date)
    telefonnummer = Column(String(30), unique=True, index=True)
    email = Column(String(100))

    buchungen = relationship("Buchung", back_populates="person")


class Buchung(Base):
    __tablename__ = "buchung"
    __table_args__ = (
        UniqueConstraint("buchungsnummer", name="uq_buchung_buchungsnummer"),
    )

    termin_id = Column(Integer, ForeignKey("termin.termin_id"), primary_key=True)
    person_id = Column(Integer, ForeignKey("person.person_id"), primary_key=True)
    buchungsnummer = Column(String(50), nullable=False)

    termin = relationship("Termin", back_populates="buchungen")
    person = relationship("Person", back_populates="buchungen")
