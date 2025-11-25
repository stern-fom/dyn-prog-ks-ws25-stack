-- Datenbank-Schema und Testdaten

-- Tabelle für Termine
CREATE TABLE termin (
    termin_id     SERIAL PRIMARY KEY,
    beginn        TIMESTAMP NOT NULL,
    ende          TIMESTAMP NOT NULL,
    beschreibung  VARCHAR(255)
);

-- Tabelle für Personen
CREATE TABLE person (
    person_id      SERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    geburtstag     DATE,
    telefonnummer  VARCHAR(30),
    email          VARCHAR(100)
);

-- Verknüpfungstabelle für Buchungen
CREATE TABLE buchung (
    termin_id        INT NOT NULL,
    person_id        INT NOT NULL,
    buchungsnummer   VARCHAR(50) NOT NULL,

    PRIMARY KEY (termin_id, person_id),
    UNIQUE (buchungsnummer),

    FOREIGN KEY (termin_id) REFERENCES termin(termin_id),
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

-- Beispiel-Personen
INSERT INTO person (name, geburtstag, telefonnummer, email) VALUES
('Max Mustermann', '1990-03-12', '+49 171 1111111', 'max@example.com'),
('Erika Muster',   '1988-07-25', '+49 171 2222222', 'erika@example.com'),
('Lisa Schüler',   '2005-09-04', '+49 171 3333333', 'lisa.schueler@example.com'),
('Tom Lehrer',     '1975-01-30', '+49 171 4444444', 'tom.lehrer@example.com');

-- Termine in der nächsten Woche (Beispieldaten)
INSERT INTO termin (beginn, ende, beschreibung) VALUES
('2025-11-17 09:00:00', '2025-11-17 10:00:00', 'Erstberatung'),
('2025-11-18 14:00:00', '2025-11-18 15:30:00', 'Projekt-Meeting'),
('2025-11-19 08:30:00', '2025-11-19 09:15:00', 'Telefonkonferenz'),
('2025-11-20 13:00:00', '2025-11-20 14:00:00', 'Coaching'),
('2025-11-21 10:00:00', '2025-11-21 12:00:00', 'Workshop');

-- Buchungen (Wer nimmt an welchem Termin teil?)
INSERT INTO buchung (termin_id, person_id, buchungsnummer) VALUES
(1, 1, 'B-2025-0001'),
(1, 2, 'B-2025-0002'),
(2, 3, 'B-2025-0003'),
(3, 1, 'B-2025-0004'),
(4, 4, 'B-2025-0005'),
(5, 2, 'B-2025-0006');
