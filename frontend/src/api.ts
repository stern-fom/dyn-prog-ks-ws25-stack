import type { Termin, TerminCreate } from "./types";

const BASE_URL = "http://localhost:8000";

export async function fetchTermine(): Promise<Termin[]> {
    const res = await fetch(`${BASE_URL}/termine`);
    if (!res.ok) throw new Error("Fehler beim Laden der Termine");
    return res.json();
}

export async function createTermin(data: TerminCreate): Promise<Termin> {
    const res = await fetch(`${BASE_URL}/termine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error("Fehler beim Anlegen des Termins: " + text);
    }
    return res.json();
}

export async function deleteTermin(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/termine/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error("Fehler beim Löschen des Termins: " + text);
    }
}
