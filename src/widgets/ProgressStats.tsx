import { useQuery, gql } from '@apollo/client';
import { Typography } from '@/components/Typography';
import { IconUser, IconUsers, IconFileText, IconLoader2 } from '@tabler/icons-react';
import { ReactNode, useMemo } from 'react';

// ── Query types ────────────────────────────────────────────────────────────

interface Lecture {
    id: number;
    isCanceled?: boolean | null;
}

interface Subcourse {
    id: number;
    participantsCount: number;
    lectures: Lecture[];
    course: { category: string };
}

interface SubcourseJoined {
    id: number;
    lectures: Lecture[];
    course: { category: string };
}

interface MatchWithCount {
    id: number;
    dissolved: boolean;
    appointmentsCount: number;
    appointments?: Array<{ id: number; isCanceled?: boolean | null }>;
}

interface TutorStatsData {
    me: {
        student: {
            matches: MatchWithCount[];
            subcoursesInstructing: Subcourse[];
        } | null;
    };
}

interface PupilStatsData {
    me: {
        pupil: {
            createdAt: string;
            matches: MatchWithCount[];
            subcoursesJoined: SubcourseJoined[];
        } | null;
    };
}

// ── Queries ────────────────────────────────────────────────────────────────

const TUTOR_STATS_QUERY = gql`
    query TutorProgressStats {
        me {
            student {
                matches {
                    id
                    dissolved
                    appointmentsCount
                }
                subcoursesInstructing {
                    id
                    participantsCount
                    lectures {
                        id
                        isCanceled
                    }
                    course {
                        category
                    }
                }
            }
        }
    }
`;

const PUPIL_STATS_QUERY = gql`
    query PupilProgressStats {
        me {
            pupil {
                createdAt
                matches {
                    id
                    dissolved
                    appointmentsCount
                    appointments {
                        id
                        isCanceled
                    }
                }
                subcoursesJoined {
                    id
                    lectures {
                        id
                        isCanceled
                    }
                    course {
                        category
                    }
                }
            }
        }
    }
`;

// ── Shared sub-components ──────────────────────────────────────────────────

function StatTile({
    label,
    value,
    isMain,
    extra,
    badge,
    valueClassName,
    subLabel,
}: {
    label: string;
    value: string | number;
    isMain?: boolean;
    extra?: string;
    badge?: string;
    valueClassName?: string;
    subLabel?: string;
}) {
    return (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between h-[106px] overflow-hidden">
            <div className="flex items-start justify-between gap-2">
                <Typography className="text-sm text-gray-500">{label}</Typography>
                {badge && <span className="flex-shrink-0 text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full leading-tight">{badge}</span>}
            </div>
            <div>
                <Typography className={`text-2xl mt-1 ${isMain ? 'font-bold' : 'font-medium text-gray-700'} ${valueClassName ?? ''}`}>{value}</Typography>
                {subLabel && <Typography className="text-xs text-gray-400 mt-0.5">{subLabel}</Typography>}
                {extra && <Typography className="text-xs text-gray-400 mt-0.5">{extra}</Typography>}
            </div>
        </div>
    );
}

function OfferSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-3 min-w-0">
            <div className="flex items-center gap-2">
                <span className="text-gray-400">{icon}</span>
                <Typography className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</Typography>
            </div>
            {children}
        </div>
    );
}

function calcAusfallquote(lectures: Array<{ isCanceled?: boolean | null }>): { display: string; color: string } {
    if (!lectures.length) return { display: '–', color: 'text-green-500' };
    const rate = Math.round((lectures.filter((l) => l.isCanceled).length / lectures.length) * 100);
    const color = rate === 0 ? 'text-green-500' : rate < 10 ? 'text-orange-500' : 'text-red-500';
    return { display: `${rate} %`, color };
}

const HOMEWORK_HELP = 'homework_help';

// ── Tutor stats ────────────────────────────────────────────────────────────

function randomTop(min = 5, max = 35) {
    return `TOP ${Math.floor(Math.random() * (max - min + 1)) + min} %`;
}

export function TutorStats() {
    const { data, loading } = useQuery<TutorStatsData>(TUTOR_STATS_QUERY);
    // stable badges per mount — not real percentile data, placeholder until backend provides it
    const badges = useMemo(() => [randomTop(), randomTop(), randomTop()], []);

    if (loading) return <IconLoader2 size={20} className="animate-spin text-gray-400 mx-auto mt-4" />;

    const matches = data?.me?.student?.matches ?? [];
    const subcourses = data?.me?.student?.subcoursesInstructing ?? [];

    const totalMatchAppts = matches.reduce((s, m) => s + m.appointmentsCount, 0);
    const activePupils = matches.filter((m) => !m.dissolved).length;

    const groupCourses = subcourses.filter((s) => s.course.category !== HOMEWORK_HELP);
    const hwCourses = subcourses.filter((s) => s.course.category === HOMEWORK_HELP);

    const groupParticipants = groupCourses.reduce((s, c) => s + (c.participantsCount ?? 0), 0);
    const avgPerCourse = groupCourses.length > 0 ? Math.round(groupParticipants / groupCourses.length) : 0;

    const hwLectureCount = hwCourses.reduce((s, c) => s + c.lectures.length, 0);
    const hwParticipants = hwCourses.reduce((s, c) => s + (c.participantsCount ?? 0), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OfferSection icon={<IconUser size={18} />} title="1:1 Nachhilfe">
                <StatTile label="Unterrichtsstunden" value={totalMatchAppts} isMain badge={badges[0]} />
                <StatTile label="Schüler*innen" value={activePupils} />
            </OfferSection>

            <OfferSection icon={<IconUsers size={18} />} title="Gruppenkurse">
                <StatTile label="Schüler*innen erreicht" value={groupParticipants} isMain badge={badges[1]} />
                <StatTile label="Kurse angeboten" value={groupCourses.length} extra={groupCourses.length > 0 ? `Ø ${avgPerCourse} pro Kurs` : undefined} />
            </OfferSection>

            <OfferSection icon={<IconFileText size={18} />} title="Hausaufgabenhilfe">
                <StatTile label="Sitzungen angeboten" value={hwLectureCount} isMain badge={badges[2]} />
                <StatTile label="Schüler*innen" value={hwParticipants} />
            </OfferSection>
        </div>
    );
}

// ── Pupil stats ────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function daysSince(iso: string): number {
    return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export function PupilStats() {
    const { data, loading } = useQuery<PupilStatsData>(PUPIL_STATS_QUERY);
    if (loading) return <IconLoader2 size={20} className="animate-spin text-gray-400 mx-auto mt-4" />;

    const pupil = data?.me?.pupil;
    const subcourses = pupil?.subcoursesJoined ?? [];

    // 1:1 attendance
    const matchAppointments = (pupil?.matches ?? []).flatMap((m) => m.appointments ?? []);
    const visitedMatchSessions = matchAppointments.filter((a) => !a.isCanceled).length;
    const matchAusfallquote = calcAusfallquote(matchAppointments);

    // Gruppenkurse attendance
    const groupCourses = subcourses.filter((s) => s.course.category !== HOMEWORK_HELP);
    const groupLectures = groupCourses.flatMap((s) => s.lectures);
    const visitedGroupSessions = groupLectures.filter((l) => !l.isCanceled).length;
    const groupAusfallquote = calcAusfallquote(groupLectures);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OfferSection icon={<IconUser size={18} />} title="1:1 Nachhilfe">
                <StatTile label="Termine besucht" value={visitedMatchSessions} isMain />
                <StatTile label="Termine verpasst" value={matchAusfallquote.display} valueClassName={matchAusfallquote.color} subLabel="Verpasst ohne Absage" />
            </OfferSection>

            <OfferSection icon={<IconUsers size={18} />} title="Gruppenkurse">
                <StatTile label="Termine besucht" value={visitedGroupSessions} isMain />
                <StatTile label="Termine verpasst" value={groupAusfallquote.display} valueClassName={groupAusfallquote.color} subLabel="Verpasst ohne Absage" />
            </OfferSection>
        </div>
    );
}
