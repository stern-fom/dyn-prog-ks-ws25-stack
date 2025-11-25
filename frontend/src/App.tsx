import { useEffect, useState } from "react";
import type {Termin} from "./types";
import { fetchTermine, createTermin, deleteTermin } from "./api";
import { TerminList } from "./components/TerminList";
import { TerminForm } from "./components/TerminForm";
import { TerminCalendar } from "./components/TerminCalendar";

type Tab = "termine" | "personen" | "buchungen";
type TermineView = "list" | "calendar";

function App() {
    const [tab, setTab] = useState<Tab>("termine");
    const [termineView, setTermineView] = useState<TermineView>("list");
    const [termine, setTermine] = useState<Termin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadTermine() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTermine();
            setTermine(data);
        } catch (err: any) {
            setError(err.message ?? "Fehler beim Laden der Termine");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (tab === "termine") {
            loadTermine();
        }
    }, [tab]);

    async function handleCreateTermin(data: Parameters<typeof createTermin>[0]) {
        await createTermin(data);
        await loadTermine();
    }

    async function handleDeleteTermin(id: number) {
        await deleteTermin(id);
        setTermine((prev) => prev.filter((t) => t.termin_id !== id));
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-sky-700 text-white py-3 px-4 shadow-md">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h1 className="text-xl font-semibold">Terminverwaltung</h1>
                    <nav className="flex gap-2 text-sm">
                        <button
                            onClick={() => setTab("termine")}
                            className={
                                "px-3 py-1.5 rounded-full " +
                                (tab === "termine" ? "bg-white text-sky-700" : "bg-sky-600")
                            }
                        >
                            Termine
                        </button>
                        <button
                            onClick={() => setTab("personen")}
                            className={
                                "px-3 py-1.5 rounded-full " +
                                (tab === "personen" ? "bg-white text-sky-700" : "bg-sky-600")
                            }
                        >
                            Personen
                        </button>
                        <button
                            onClick={() => setTab("buchungen")}
                            className={
                                "px-3 py-1.5 rounded-full " +
                                (tab === "buchungen" ? "bg-white text-sky-700" : "bg-sky-600")
                            }
                        >
                            Buchungen
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 px-4 py-6">
                <div className="max-w-5xl mx-auto">
                    {tab === "termine" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-lg">Termine</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTermineView("list")}
                                        className={
                                            "px-3 py-1.5 rounded-lg text-sm font-medium " +
                                            (termineView === "list"
                                                ? "bg-sky-600 text-white"
                                                : "bg-slate-200 text-slate-700 hover:bg-slate-300")
                                        }
                                    >
                                        Liste
                                    </button>
                                    <button
                                        onClick={() => setTermineView("calendar")}
                                        className={
                                            "px-3 py-1.5 rounded-lg text-sm font-medium " +
                                            (termineView === "calendar"
                                                ? "bg-sky-600 text-white"
                                                : "bg-slate-200 text-slate-700 hover:bg-slate-300")
                                        }
                                    >
                                        Kalender
                                    </button>
                                </div>
                            </div>

                            {termineView === "list" && (
                                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                                    <section className="space-y-3">
                                        {loading && (
                                            <p className="text-sm text-slate-500">Lade Termine...</p>
                                        )}
                                        {error && (
                                            <p className="text-sm text-red-600">{error}</p>
                                        )}
                                        {!loading && !error && (
                                            <TerminList termine={termine} onDelete={handleDeleteTermin} />
                                        )}
                                    </section>

                                    <aside>
                                        <TerminForm onCreate={handleCreateTermin} />
                                    </aside>
                                </div>
                            )}

                            {termineView === "calendar" && (
                                <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
                                    <section>
                                        {loading && (
                                            <p className="text-sm text-slate-500">Lade Termine...</p>
                                        )}
                                        {error && (
                                            <p className="text-sm text-red-600">{error}</p>
                                        )}
                                        {!loading && !error && (
                                            <TerminCalendar termine={termine} onDelete={handleDeleteTermin} />
                                        )}
                                    </section>

                                    <aside>
                                        <TerminForm onCreate={handleCreateTermin} />
                                    </aside>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "personen" && (
                        <p className="text-sm text-slate-600">
                            Personen-Verwaltung kommt später hierhin.
                        </p>
                    )}

                    {tab === "buchungen" && (
                        <p className="text-sm text-slate-600">
                            Buchungs-Verwaltung kommt später hierhin.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
