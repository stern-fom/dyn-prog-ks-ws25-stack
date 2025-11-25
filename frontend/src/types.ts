export interface Termin {
    termin_id: number;
    beginn: string;
    ende: string;
    beschreibung?: string | null;
}

export interface TerminCreate {
    beginn: string;       // ISO-String
    ende: string;         // ISO-String
    beschreibung?: string;
}
