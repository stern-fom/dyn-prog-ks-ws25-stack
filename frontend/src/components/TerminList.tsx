import type {Termin} from "../types";

type Props = {
    termine: Termin[];
    onDelete: (id: number) => void;
};

export function TerminList({ termine, onDelete }: Props) {
    if (termine.length === 0) {
        return <p className="text-sm text-slate-500">Noch keine Termine vorhanden.</p>;
    }

    return (
        <ul className="space-y-3">
            {termine.map((t) => (
                <li
                    key={t.termin_id}
                    className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                    <div>
                        <div className="font-semibold">
                            {t.beschreibung || "Ohne Beschreibung"}
                        </div>
                        <div className="text-sm text-slate-600">
                            {new Date(t.beginn).toLocaleString()} –{" "}
                            {new Date(t.ende).toLocaleString()}
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(t.termin_id)}
                        className="self-start sm:self-auto text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
                    >
                        Löschen
                    </button>
                </li>
            ))}
        </ul>
    );
}
