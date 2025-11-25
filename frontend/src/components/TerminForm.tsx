import { useState, type FormEvent } from "react";
import type { TerminCreate } from "../types";

type Props = {
    onCreate: (data: TerminCreate) => Promise<void>;
};

export function TerminForm({ onCreate }: Props) {
    const [beschreibung, setBeschreibung] = useState("");
    const [beginn, setBeginn] = useState("");
    const [ende, setEnde] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!beginn || !ende) {
                throw new Error("Bitte Beginn und Ende angeben.");
            }

            const beginnIso = new Date(beginn).toISOString();
            const endeIso = new Date(ende).toISOString();

            await onCreate({
                beschreibung: beschreibung || undefined,
                beginn: beginnIso,
                ende: endeIso,
            });

            setBeschreibung("");
            setBeginn("");
            setEnde("");
        } catch (err: any) {
            setError(err.message ?? "Fehler beim Anlegen");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3"
        >
            <h2 className="font-semibold text-lg mb-1">Neuen Termin anlegen</h2>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Beschreibung</label>
                <input
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={beschreibung}
                    onChange={(e) => setBeschreibung(e.target.value)}
                    placeholder="z.B. Beratung, Meeting ..."
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium">Beginn</label>
                    <input
                        type="datetime-local"
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={beginn}
                        onChange={(e) => setBeginn(e.target.value)}
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium">Ende</label>
                    <input
                        type="datetime-local"
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={ende}
                        onChange={(e) => setEnde(e.target.value)}
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-50"
            >
                {loading ? "Speichere..." : "Termin speichern"}
            </button>
        </form>
    );
}
