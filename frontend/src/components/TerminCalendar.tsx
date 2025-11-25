import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Termin } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../calendar.css';

const locales = {
    'de': de,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type Props = {
    termine: Termin[];
    onDelete: (id: number) => void;
};

export function TerminCalendar({ termine, onDelete }: Props) {
    const events = termine.map((termin) => ({
        id: termin.termin_id,
        title: termin.beschreibung || 'Ohne Beschreibung',
        start: new Date(termin.beginn),
        end: new Date(termin.ende),
        resource: termin,
    }));

    const handleSelectEvent = (event: any) => {
        const confirmed = window.confirm(
            `Termin "${event.title}" löschen?\n\n${format(event.start, 'PPpp', { locale: de })} - ${format(event.end, 'PPpp', { locale: de })}`
        );
        if (confirmed) {
            onDelete(event.id);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm" style={{ height: '600px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture="de"
                onSelectEvent={handleSelectEvent}
                messages={{
                    next: 'Weiter',
                    previous: 'Zurück',
                    today: 'Heute',
                    month: 'Monat',
                    week: 'Woche',
                    day: 'Tag',
                    agenda: 'Agenda',
                    date: 'Datum',
                    time: 'Zeit',
                    event: 'Termin',
                    noEventsInRange: 'Keine Termine in diesem Zeitraum.',
                    showMore: (total) => `+ ${total} weitere`,
                }}
            />
        </div>
    );
}
