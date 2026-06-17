import { useSearchParams } from 'react-router-dom';
import {
    IconCheck,
    IconShieldCheck,
    IconHeart,
    IconHeartHandshake,
    IconGift,
    IconMessageCircle,
    IconListCheck,
    IconBulb,
    IconUserPlus,
    IconTools,
    IconRosetteDiscountCheck,
    IconDeviceLaptop,
    IconClock,
    IconSchool,
    IconCalendarEvent,
} from '@tabler/icons-react';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import LFLogo from '../assets/icons/lernfair/lf-logo.svg';

// ── Top nav (mirrors registration) ────────────────────────────────────────

function TopNav() {
    return (
        <nav className="bg-primary-dark py-3 px-5 flex items-center justify-between flex-shrink-0">
            <LFLogo className="h-8 w-auto brightness-0 invert" />
            <SwitchLanguageButton variant="dropdown" />
        </nav>
    );
}

// ── Shared sub-components ──────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${className}`}>{children}</div>;
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="text-primary">{icon}</span>
            <Typography className="font-semibold">{title}</Typography>
        </div>
    );
}

function NumberedStep({ n, title, desc }: { n: number; title: string; desc?: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 size-7 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">{n}</div>
            <div>
                <Typography className="font-semibold">{title}</Typography>
                {desc && <Typography className="text-gray-500 text-sm">{desc}</Typography>}
            </div>
        </div>
    );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <Typography className="text-sm italic">{quote}</Typography>
            <Typography className="text-xs text-gray-500 mt-1">– {author}</Typography>
        </div>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2">
            <IconCheck size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <Typography className="text-sm">{text}</Typography>
        </div>
    );
}

function CooperationCard() {
    return (
        <Card className="border-primary/30 bg-accent/40">
            <SectionHeading icon={<IconSchool size={20} />} title="Im Rahmen deiner Hochschulkooperation" />
            <Typography className="text-sm text-gray-600">
                Deine Hochschule ist Kooperationspartner von Lern-Fair. Als Studierende:r hast du direkten Zugang zu unserem Netzwerk und kannst sofort loslegen
                – mit der vollen Unterstützung deiner Universität im Rücken.
            </Typography>
        </Card>
    );
}

function CooperationCardPupil() {
    return (
        <Card className="border-primary/30 bg-accent/40">
            <SectionHeading icon={<IconSchool size={20} />} title="Im Rahmen einer Kooperation" />
            <Typography className="text-sm text-gray-600">
                Lern-Fair arbeitet mit Schulen, Hochschulen und gemeinnützigen Organisationen zusammen, um möglichst vielen Schüler:innen kostenlosen Zugang zu
                qualifizierter Nachhilfe zu ermöglichen.
            </Typography>
        </Card>
    );
}

// ── Pupil landing page ─────────────────────────────────────────────────────

function PupilLP({ name, registrationUrl, cooperation }: { name: string; registrationUrl: string; cooperation: boolean }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopNav />

            {/* Header */}
            <div className="bg-primary-dark text-center py-12 px-6">
                <div className="text-4xl mb-3">👋</div>
                <Typography className="text-primary-foreground/70 text-sm mb-1">Einladung von</Typography>
                <Typography variant="h2" className="font-bold text-primary-foreground">
                    {name || 'Lern-Fair'}
                </Typography>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-4">
                {cooperation && <CooperationCardPupil />}

                {/* Hero claim */}
                <Card className="text-center">
                    <div className="flex justify-center mb-2">
                        <IconRosetteDiscountCheck size={28} className="text-primary" />
                    </div>
                    <Typography variant="h5" className="font-extrabold text-gray-900 mb-1">
                        100% kostenlos
                    </Typography>
                    <Typography className="text-gray-500 text-sm">
                        Professionelle Nachhilfe von Uni-Studierenden. Keine versteckten Kosten. Vollständig kostenlos.
                    </Typography>
                </Card>

                {/* Why free */}
                <Card>
                    <SectionHeading icon={<IconHeartHandshake size={20} />} title="Warum ist Lern-Fair kostenlos?" />
                    <Typography className="text-sm text-gray-600">
                        Lern-Fair ist ein gemeinnütziges Projekt und wird durch Spenden und Stiftungsgelder finanziert. Alle Tutoren sind Freiwillige –
                        Studierende, die andere Schüler unterstützen möchten. So können wir hochwertiger Nachhilfe anbieten, ohne Geld zu verdienen.
                    </Typography>
                </Card>

                {/* Benefits */}
                <Card>
                    <SectionHeading icon={<IconGift size={20} />} title="Das bekommst du" />
                    <div className="space-y-4">
                        <NumberedStep n={1} title="Perfekt passender Tutor" desc="Wir finden jemanden, der dein Fach beherrscht und dein Tempo versteht." />
                        <NumberedStep n={2} title="Flexibles Lernen" desc="Online-Termine – du bestimmst Wann und Wo. Anpassbar an deinen Stundenplan." />
                        <NumberedStep n={3} title="Echte Verbesserung" desc="Nicht nur für Tests – Tutoren helfen dir, das Fach wirklich zu verstehen." />
                    </div>
                </Card>

                {/* Testimonials */}
                <Card>
                    <SectionHeading icon={<IconMessageCircle size={20} />} title="Das sagen andere Schüler" />
                    <div className="space-y-3">
                        <Testimonial quote="»Mathe war immer mein Problem, aber Jana erklärt es so, dass ich es verstehe.«" author="Tim, 14, Mathematik" />
                        <Testimonial quote="»Super flexibel, mein Tutor passt sich meinem Zeitplan an. Und kostenlos!«" author="Lea, 16, Englisch" />
                    </div>
                </Card>

                {/* Safety */}
                <Card>
                    <SectionHeading icon={<IconShieldCheck size={20} />} title="Deine Sicherheit ist uns wichtig" />
                    <Typography className="text-sm text-gray-600 mb-1">
                        Alle Tutoren müssen ein erweitertes Führungszeugnis (Polizei) vorlegen und werden persönlich überprüft. Das ist unser Standard – für
                        deine Sicherheit.
                    </Typography>
                    <Typography className="text-xs text-gray-400 italic">Erweitertes Führungszeugnis gemäß § 30a BZRG</Typography>
                </Card>

                {/* How it works */}
                <Card>
                    <SectionHeading icon={<IconListCheck size={20} />} title="So funktioniert's" />
                    <div className="space-y-4">
                        <NumberedStep n={1} title="Profil anlegen (5 Minuten)" />
                        <NumberedStep n={2} title="Dein Fach und Ziele angeben" />
                        <NumberedStep n={3} title="Kennenlerngespräch" desc="Wir lernen euch kennen und stellen dir den passenden Tutor vor." />
                        <NumberedStep n={4} title="Loslegen!" />
                    </div>
                </Card>

                {/* Kennenlerngespräch info */}
                <Card className="border-primary/20 bg-accent/30">
                    <SectionHeading icon={<IconCalendarEvent size={20} />} title="Das Kennenlerngespräch" />
                    <Typography className="text-sm text-gray-600">
                        Nach der Anmeldung führen wir ein kurzes Kennenlerngespräch mit dir oder deinen Eltern. So können wir sicherstellen, dass wir den
                        richtigen Tutor für dich finden – und du weißt, wer auf dich zukommt.
                    </Typography>
                </Card>
            </div>

            {/* Sticky CTA */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 text-center">
                <Button className="w-full max-w-lg" onClick={() => (window.location.href = registrationUrl)}>
                    Kostenlos anmelden
                </Button>
                <Typography className="text-xs text-gray-400 mt-2">Dauert etwa 5 Minuten.</Typography>
            </div>
        </div>
    );
}

// ── Tutor landing page ─────────────────────────────────────────────────────

function TutorLP({ name, registrationUrl, cooperation }: { name: string; registrationUrl: string; cooperation: boolean }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopNav />

            {/* Header */}
            <div className="bg-primary-dark text-center py-12 px-6">
                <div className="text-4xl mb-3">🌟</div>
                {name && <Typography className="text-primary-foreground/70 text-sm mb-1">Empfohlen von {name}</Typography>}
                <Typography variant="h2" className="font-bold text-primary-foreground mb-1">
                    Werde Tutor
                </Typography>
                <Typography className="text-primary-foreground/80 text-sm">Mach einen echten Unterschied. Flexibel. Digital. Kostenlos.</Typography>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-4">
                {cooperation && <CooperationCard />}

                {/* Feature highlights */}
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconDeviceLaptop size={20} className="text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <Typography className="font-semibold text-sm">Nur digital</Typography>
                                <Typography className="text-sm text-gray-500">Von zuhause aus unterrichten. Keine Fahrten, keine festen Orte.</Typography>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <IconClock size={20} className="text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <Typography className="font-semibold text-sm">Vollkommen flexibel</Typography>
                                <Typography className="text-sm text-gray-500">
                                    Du bestimmst deine Stunden. 1 Stunde pro Woche oder 10 – wie es dir passt.
                                </Typography>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <IconHeart size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <Typography className="font-semibold text-sm">Macht einen Unterschied</Typography>
                                <Typography className="text-sm text-gray-500">
                                    Deine Hilfe ändert echte Karrieren. Schüler sagen dir persönlich Danke.
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Why become a tutor */}
                <Card>
                    <SectionHeading icon={<IconBulb size={20} />} title="Warum du Tutor werden solltest" />
                    <div className="space-y-2">
                        <CheckItem text="Hilf anderen Schülern, ihr Potenzial zu erreichen" />
                        <CheckItem text="Sammle Erfahrung im Unterrichten (wichtig für dein Studium/Karriere)" />
                        <CheckItem text="Lerne dein Fach noch besser (beste Weg zu lernen: anderen erklären)" />
                        <CheckItem text="Sei Teil einer Gemeinschaft von engagierten Studierenden" />
                    </div>
                </Card>

                {/* Registration steps */}
                <Card>
                    <SectionHeading icon={<IconUserPlus size={20} />} title="Anmeldung in 5 Minuten" />
                    <div className="space-y-4">
                        <NumberedStep n={1} title="Profil erstellen" desc="Name, E-Mail, Passwort. Das war's – 5 Minuten." />
                        <NumberedStep n={2} title="Deine Fächer & Verfügbarkeit" desc="Was unterrichtest du gerne? Wann hast du Zeit? (Änderbar jederzeit)" />
                        <NumberedStep n={3} title="Führungszeugnis hochladen" desc="Erweitertes Führungszeugnis von der Polizei. (Das schützt die Schüler.)" />
                        <NumberedStep
                            n={4}
                            title="Kennenlerngespräch"
                            desc="Wir begrüßen dich persönlich, beantworten deine Fragen und erklären den nächsten Schritt."
                        />
                        <NumberedStep
                            n={5}
                            title="Fertig – Schüler können dich buchen"
                            desc="Du bekommst eine Benachrichtigung, wenn jemand dich buchen möchte."
                        />
                    </div>
                </Card>

                {/* Kennenlerngespräch info */}
                <Card className="border-primary/20 bg-accent/30">
                    <SectionHeading icon={<IconCalendarEvent size={20} />} title="Das Kennenlerngespräch" />
                    <Typography className="text-sm text-gray-600">
                        Nach deiner Anmeldung laden wir dich zu einem kurzen Kennenlerngespräch ein. Wir stellen uns vor, erklären wie Lern-Fair funktioniert
                        und beantworten all deine Fragen – bevor du deinen ersten Schüler betreust.
                    </Typography>
                </Card>

                {/* Testimonials */}
                <Card>
                    <SectionHeading icon={<IconMessageCircle size={20} />} title="Das sagen aktuelle Tutoren" />
                    <div className="space-y-3">
                        <Testimonial
                            quote="»Super flexibel – ich tutor zwischen Vorlesungen. Meine Schüler sind motiviert und dankbar.«"
                            author="Jan, 21, Informatik-Student"
                        />
                        <Testimonial
                            quote="»Ich helfe Schülern, aber gleichzeitig lerne ich auch viel. Und es macht Spaß!«"
                            author="Lisa, 19, Englisch-Studentin"
                        />
                        <Testimonial
                            quote="»Keine versteckte Agenda – echte gemeinnützige Arbeit. Für mich ein großes Plus.«"
                            author="Marco, 23, Mathematik-Student"
                        />
                    </div>
                </Card>

                {/* What we provide */}
                <Card>
                    <SectionHeading icon={<IconTools size={20} />} title="Was wir dir bereitstellen" />
                    <div className="space-y-2">
                        <CheckItem text="Video-Plattform mit Whiteboard & Chat (kostenlos)" />
                        <CheckItem text="Automatische Planung & Benachrichtigungen" />
                        <CheckItem text="Zugang zu einer Gemeinschaft von Tutoren" />
                        <CheckItem text="Unterstützung & Tipps vom Lern-Fair Team" />
                    </div>
                </Card>

                {/* Safety */}
                <Card>
                    <SectionHeading icon={<IconShieldCheck size={20} />} title="Sicherheit für Schüler:innen" />
                    <Typography className="text-sm text-gray-600 mb-1">
                        Alle Tutoren müssen ein erweitertes Führungszeugnis (Polizei) vorlegen. Das ist unser Standard – zum Schutz aller Schülerinnen und
                        Schüler.
                    </Typography>
                    <Typography className="text-xs text-gray-400 italic">Erweitertes Führungszeugnis gemäß § 30a BZRG</Typography>
                </Card>
            </div>

            {/* Sticky CTA */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 text-center">
                <Button className="w-full max-w-lg" onClick={() => (window.location.href = registrationUrl)}>
                    Jetzt als Tutor anmelden
                </Button>
                <Typography className="text-xs text-gray-400 mt-2">Dauert 5 Minuten. Kostenlos. Für alle Studierenden offen.</Typography>
            </div>
        </div>
    );
}

// ── Named page exports (one route per audience) ────────────────────────────

function useReferralParams() {
    const [searchParams] = useSearchParams();
    const refId = searchParams.get('ref') ?? '';
    const name = searchParams.get('name') ?? '';
    const cooperation = searchParams.get('cooperation') === '1';
    const registrationUrl = `/registration?referredById=${encodeURIComponent(refId)}`;
    return { name, registrationUrl, cooperation };
}

export function PupilReferralLandingPage() {
    const { name, registrationUrl, cooperation } = useReferralParams();
    return <PupilLP name={name} registrationUrl={registrationUrl} cooperation={cooperation} />;
}

export function TutorReferralLandingPage() {
    const { name, registrationUrl, cooperation } = useReferralParams();
    return <TutorLP name={name} registrationUrl={registrationUrl} cooperation={cooperation} />;
}

export default PupilReferralLandingPage;
