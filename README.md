# Datenbank-Projekt

Ein Full-Stack-Termin-Verwaltungssystem mit React Frontend, FastAPI Backend und PostgreSQL Datenbank.

## 📁 Projektstruktur

```
Datenbank-Projekt/
├── frontend/          # React + TypeScript + Vite Frontend
├── backend/           # Python FastAPI Backend
├── database/          # PostgreSQL Datenbank Setup
├── docker-compose.yml # Docker Compose Konfiguration
└── README.md          # Diese Datei
```

## 🚀 Technologie-Stack

### Frontend
- **React** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling
- **ESLint** für Code-Qualität

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** als ORM
- **Pydantic** für Datenvalidierung
- **psycopg2** für PostgreSQL-Verbindung

### Datenbank
- **PostgreSQL 16**
- **pgAdmin 4** für Datenbankverwaltung

## 🛠️ Installation und Setup

### Voraussetzungen
- **Node.js** (v18 oder höher)
- **Python** (v3.11 oder höher)
- **Docker** und **Docker Compose**
- **JetBrains IDE** (WebStorm, PyCharm, oder IntelliJ IDEA Ultimate empfohlen)

### 1. Repository klonen
```bash
git clone <repository-url>
cd Datenbank-Projekt
```

### 2. Mit Docker starten (empfohlen)
```bash
docker-compose up -d
```

Dies startet:
- PostgreSQL Datenbank auf Port `5432`
- pgAdmin auf Port `8080` (http://localhost:8080)
- FastAPI Backend auf Port `8000` (http://localhost:8000)
- React Frontend auf Port `3000` (http://localhost:3000)

#### Nur bestimmte Services starten
```bash
# Nur Datenbank und Backend
docker-compose up -d db api

# Nur Frontend neu bauen
docker-compose build frontend
docker-compose up -d frontend
```

### 3. Frontend separat im Dev-Modus starten (Alternative)
Wenn Sie das Frontend lokal entwickeln möchten (mit Hot-Reload):
```bash
cd frontend
npm install
npm run dev
```

Das Frontend läuft dann auf http://localhost:5173

## 📦 Manuelle Installation (ohne Docker)

### Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Datenbank
PostgreSQL manuell installieren und konfigurieren:
- User: `appuser`
- Password: `secretpassword`
- Database: `termine_db`
- Port: `5432`

## 🔧 Entwicklung

### Backend API Dokumentation
Nach dem Start des Backends ist die automatische API-Dokumentation verfügbar:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### pgAdmin Zugang
- **URL**: http://localhost:8080
- **Email**: admin@example.com
- **Password**: adminpw

### Frontend Development
```bash
cd frontend
npm run dev        # Development Server
npm run build      # Production Build
npm run preview    # Preview Production Build
npm run lint       # ESLint Check
```

#### Docker vs Lokaler Dev-Server
- **Docker (Port 3000)**: Production-Build mit nginx, optimiert und minimiert
- **Lokal (Port 5173)**: Development-Server mit Hot-Reload für schnelle Entwicklung

### Backend Development
```bash
cd backend
uvicorn main:app --reload        # Development Server mit Auto-Reload
uvicorn main:app --host 0.0.0.0  # Server auf allen Interfaces
```

## 🗄️ Datenbankstruktur

Die Initialisierungs-Skripte befinden sich im Ordner `database/db/`.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 Projektspezifische Hinweise

### Umgebungsvariablen
Die `.env`-Dateien sind bereits vorkonfiguriert:

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql+psycopg2://appuser:secretpassword@localhost:5432/termine_db
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

Die Frontend-API-URL kann beim Docker-Build über `docker-compose.yml` angepasst werden.

### JetBrains IDE Konfiguration
Das Projekt enthält `.idea` Ordner für JetBrains IDEs. Öffnen Sie einfach das Hauptverzeichnis in Ihrer IDE.

## 🤝 Beitragen

1. Fork des Projekts erstellen
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt wurde für Bildungszwecke erstellt.

## 👥 Kontakt

Projekt Link: [https://github.com/yourusername/Datenbank-Projekt](https://github.com/yourusername/Datenbank-Projekt)
