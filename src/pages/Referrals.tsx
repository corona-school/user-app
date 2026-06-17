import { useEffect, useRef, useState } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { WhatsappShareButton } from 'react-share';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { useTranslation } from 'react-i18next';
import { IconDownload, IconBrandWhatsapp, IconMail, IconLink, IconPhoto, IconCopy, IconCopyCheck, IconShieldCheck } from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';

// Importing Assets
import WhatsAppIcon from '../assets/icons/lernfair/referral/Whatsapp.svg';

import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useUserType } from '@/hooks/useApollo';
import { Button } from '@/components/Button';
import { useScrollToTop } from '@/hooks/useScrollRestoration';
import { Modal } from '@/components/Modal';

// ── Sharing modes ──────────────────────────────────────────────────────────

type SharingMode = 'pupils' | 'volunteers';
type SharepicItem = { word: string; label: string; subline: string };

// ── Volunteer content ──────────────────────────────────────────────────────

const VOLUNTEER_SHAREPICS: SharepicItem[] = [
    { word: 'FOLGER', label: 'Fairfolger', subline: 'Begleite Schüler:innen auf ihrem Weg zu mehr Bildungschancen.' },
    { word: 'BOTE', label: 'Fairbote', subline: 'Vermittle Wissen und schenke neue Perspektiven.' },
    { word: 'TIEFER', label: 'Fairtiefer', subline: 'Hilf dort, wo Unterstützung langfristig wirken kann.' },
    { word: 'DENKER', label: 'Fairdenker', subline: 'Setze deine Ideen für mehr Bildungsgerechtigkeit ein.' },
];

const VOLUNTEER_WHATSAPP =
    'Du willst etwas Sinnvolles tun? Bei Lern-Fair hilfst du Schüler:innen kostenlos mit Nachhilfe – digital, flexibel, von überall. Jetzt als Nachhilfegeber:in mitmachen!';

const VOLUNTEER_EMAIL_SUBJECT = 'Werde Nachhilfegeber:in bei Lern-Fair';

const VOLUNTEER_EMAIL_BODY = (link: string) =>
    `Hallo,\n\nIch bin bei Lern-Fair dabei und möchte dich einladen, auch mitzumachen!\n\nLern-Fair ist vollständig digital – du hilfst Schüler:innen bequem von zu Hause aus, per Zoom oder einem anderen Videocall-Tool. Kein Pendeln, kein fester Ort, volle Flexibilität: Du entscheidest selbst, wann und wie oft du Nachhilfe gibst.\n\nAlles läuft online: Vermittlung, Kommunikation, Unterricht – per Zoom, von überall aus. Ob einmal die Woche oder öfter – du bestimmst deinen Einsatz, flexibel und vollständig digital in deinen Alltag integrierbar.\n\nWenn du 1–2 Stunden pro Woche investieren möchtest, um wirklich etwas zu bewegen – hier kannst du dich als Helfer:in anmelden:\n${link}`;

// ── Pupil / parent content ─────────────────────────────────────────────────

const PUPIL_SHAREPICS: SharepicItem[] = [
    { word: 'STARK', label: 'Fairstark', subline: 'Kostenlose Nachhilfe für mehr Schulerfolg.' },
    { word: 'WISSEN', label: 'Fairwissen', subline: 'Qualifizierte Unterstützung – digital und kostenlos.' },
    { word: 'CHANCE', label: 'Fairchance', subline: 'Gleiche Bildungschancen für alle Schüler:innen.' },
    { word: 'START', label: 'Fairstart', subline: 'Jetzt anmelden und kostenlose Nachhilfe erhalten.' },
];

const PUPIL_WHATSAPP =
    'Lern-Fair bietet kostenlose Nachhilfe für Schüler:innen – von geprüften Studierenden, komplett digital. Kein Abo, keine Kosten. Einfach anmelden und Unterstützung erhalten!';

const PUPIL_EMAIL_SUBJECT = 'Kostenlose Nachhilfe für Schüler:innen – Lern-Fair';

const PUPIL_EMAIL_BODY = (link: string) =>
    `Hallo,\n\nIch möchte dir Lern-Fair vorstellen – kostenlose Nachhilfe für Schüler:innen, direkt nach Hause.\n\nWie funktioniert es? Lern-Fair vermittelt geprüfte Studierende als Nachhilfegeber:innen. Der Unterricht findet online statt – du brauchst nur einen Computer oder ein Tablet.\n\nWas kostet es? Nichts. Lern-Fair ist eine gemeinnützige Initiative und wird durch Stiftungen und Spenden finanziert. Für Schüler:innen und Familien entstehen keinerlei Kosten – jetzt nicht, und auch nicht später.\n\nKein Abo, kein Vertrag, keine versteckten Gebühren. Einfach kostenlos anmelden, eine kostenlose Nachhilfeperson zugeteilt bekommen und kostenlos lernen.\n\nWirklich kostenlos – wir betonen es gerne mehrmals, weil es so oft nicht geglaubt wird 😊\n\nHier zur kostenlosen Anmeldung:\n${link}`;

function generateSharepicSVG(word: string, subline: string, responsive = false, qrDataUri = ''): string {
    const dims = responsive ? 'width="100%" height="100%"' : 'width="690" height="690"';
    const qrElement = qrDataUri ? `<image x="543" y="505" width="112" height="112" href="${qrDataUri}"/>` : '';
    return `<svg ${dims} viewBox="0 0 690 690" xmlns="http://www.w3.org/2000/svg">
  <rect width="680" height="680" fill="#3C3489"/>
  <rect x="0" y="0" width="680" height="5" fill="#F0997B"/>
  <text x="37.51" y="245" font-size="158" fill="white" letter-spacing="-4" font-family="Outfit, sans-serif" font-weight="900">FAIR</text>
  <text x="37.51" y="390" font-size="158" fill="#F0997B" letter-spacing="-4" font-family="Outfit, sans-serif" font-weight="900">${word}</text>
  <rect x="37.51" y="432" width="605" height="1.5" fill="white" opacity="0.2"/>
  <text x="37.51" y="468" font-size="18" fill="white" opacity="0.85" font-family="Outfit, sans-serif">${subline}</text>
  <rect x="37.51" y="500" width="605" height="1" fill="white" opacity="0.1"/>
  <text x="37.51" y="528" font-size="15" fill="white" opacity="0.7" font-family="Outfit, sans-serif">Das Ehrenamt 2.0 für Bildungsgerechtigkeit –</text>
  <text x="37.51" y="549" font-size="15" fill="white" opacity="0.7" font-family="Outfit, sans-serif">digital, flexibel, von überall aus.</text>
  ${qrElement}
  <text x="37.51" y="590" font-size="16" fill="#F0997B" font-family="Outfit, sans-serif" font-weight="700">lern-fair.de</text>
  <rect x="0" y="675" width="680" height="5" fill="#F0997B"/>
</svg>`;
}

function downloadSharepic(word: string, subline: string, label: string, qrDataUri = '') {
    const svg = generateSharepicSVG(word, subline, false, qrDataUri);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lernfair-sharepic-${label.toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function ShieldNote() {
    return (
        <div className="flex items-start gap-2 text-gray-400 pt-1">
            <IconShieldCheck size={14} className="flex-shrink-0 mt-0.5" />
            <Typography className="text-xs">Dein Link ist einzigartig und verschlüsselt. Andere können keinen ähnlichen Code erraten.</Typography>
        </div>
    );
}

// ── Tab trigger style ──────────────────────────────────────────────────────

const triggerCls = [
    'flex items-center gap-2 px-4 py-4 text-base font-medium whitespace-nowrap rounded-t-md',
    'text-gray-500',
    'hover:text-primary hover:bg-accent',
    'active:bg-accent-medium',
    'data-[state=active]:text-primary data-[state=active]:bg-accent',
    'data-[state=active]:shadow-[inset_0_-2px_0_hsl(var(--primary))]',
    'outline-none focus-visible:outline-none',
].join(' ');

// ── Main component ─────────────────────────────────────────────────────────

const Referrals: React.FC<{}> = () => {
    const { t } = useTranslation();
    const [hasCopied, setHasCopied] = useState(false);
    const [selectedSharepic, setSelectedSharepic] = useState<SharepicItem | null>(null);
    const [qrDataUri, setQrDataUri] = useState('');
    const qrContainerRef = useRef<HTMLDivElement>(null);
    const { trackPageView, trackEvent } = useMatomo();
    const userType = useUserType();

    const sharingMode: SharingMode = userType === 'pupil' ? 'pupils' : 'volunteers';

    useScrollToTop();

    useEffect(() => {
        trackPageView({ documentTitle: 'Referrals' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const userID = sessionStorage.getItem('userID');

    // ── Mode-specific derived values ───────────────────────────────────────
    const isVolunteer = sharingMode === 'volunteers';
    const modeLabel = isVolunteer ? 'HuH' : 'SuS';

    const referralLink = isVolunteer
        ? `https://www.lern-fair.de/helfer/nachhilfe?referredById=${userID ?? ''}`
        : `https://app.lern-fair.de/registration?referredById=${userID ?? ''}`;

    const qrUrl = isVolunteer
        ? `https://www.lern-fair.de/helfer/nachhilfe?referredById=${
              userID ?? ''
          }&mtm_campaign=referral&mtm_source=sharepic&mtm_content=freiwillige&mtm_medium=social`
        : `https://www.lern-fair.de/schueler/lernunterstuetzung?referredById=${
              userID ?? ''
          }&mtm_campaign=referral&mtm_source=sharepic&mtm_content=schueler&mtm_medium=social`;

    const whatsappMessage = isVolunteer ? VOLUNTEER_WHATSAPP : PUPIL_WHATSAPP;
    const emailSubject = isVolunteer ? VOLUNTEER_EMAIL_SUBJECT : PUPIL_EMAIL_SUBJECT;
    const emailBody = isVolunteer ? VOLUNTEER_EMAIL_BODY(referralLink) : PUPIL_EMAIL_BODY(referralLink);
    const emailPreview = (() => {
        const parts = emailBody.split('\n\n').slice(0, 2).join(' ');
        return parts.length > 160 ? parts.slice(0, 160) + '…' : parts + '…';
    })();
    const sharepics = isVolunteer ? VOLUNTEER_SHAREPICS : PUPIL_SHAREPICS;

    useEffect(() => {
        if (!qrContainerRef.current) return;
        const svg = qrContainerRef.current.querySelector('svg');
        if (!svg) return;
        const str = new XMLSerializer().serializeToString(svg);
        setQrDataUri(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(str)}`);
    }, [qrUrl]); // re-runs when mode or userID changes

    const onCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        } catch {
            // clipboard not available
        }
    };

    const eventCategory = `${userType === 'pupil' ? 'SuS' : 'HuH'} Referral`;

    const handleOnShare = () => {
        trackEvent({ category: eventCategory, action: 'Click CTA', name: `${modeLabel} – Flyer & Poster auslegen` });
        window.open('https://forms.gle/qmk4CUMdGYbEqGhx5', '_blank');
    };

    const handleShare = () => {
        trackEvent({ category: eventCategory, action: 'Share on Mobile', name: `${modeLabel} – Mobile teilen` });
        navigator.share({ url: referralLink });
    };

    const TAB_LABELS: Record<string, string> = {
        nachricht: 'WhatsApp',
        email: 'E-Mail',
        link: 'Link',
        bilder: 'Sharepics',
    };

    return (
        <WithNavigation
            headerLeft={
                <div className="flex items-center space-x-4">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </div>
            }
        >
            <div className="max-w-full overflow-hidden">
                <Breadcrumb className="md:mx-2" />

                {/* Page title */}
                <Typography variant="h2" className="font-bold mt-4 mb-5 text-left">
                    {t('referral.title')}
                </Typography>

                {/* ── Tabbed sharing section ── */}
                <div className="mb-8">
                    <Typography variant="h3" className="font-bold mb-4">
                        Empfiehl uns in deinem Netzwerk
                    </Typography>

                    <TabsPrimitive.Root
                        defaultValue="nachricht"
                        onValueChange={(value) =>
                            trackEvent({ category: eventCategory, action: 'Click Tab', name: `${modeLabel} – ${TAB_LABELS[value] ?? value}` })
                        }
                    >
                        {/* Tab bar */}
                        <div className="border-b border-gray-200">
                            <TabsPrimitive.List className="flex">
                                <TabsPrimitive.Trigger value="nachricht" className={triggerCls}>
                                    <IconBrandWhatsapp size={16} />
                                    WhatsApp
                                </TabsPrimitive.Trigger>
                                <TabsPrimitive.Trigger value="email" className={triggerCls}>
                                    <IconMail size={16} />
                                    E-Mail
                                </TabsPrimitive.Trigger>
                                <TabsPrimitive.Trigger value="link" className={triggerCls}>
                                    <IconLink size={16} />
                                    Link
                                </TabsPrimitive.Trigger>
                                <TabsPrimitive.Trigger value="bilder" className={triggerCls}>
                                    <IconPhoto size={16} />
                                    Sharepics für Status
                                </TabsPrimitive.Trigger>
                            </TabsPrimitive.List>
                        </div>

                        {/* Tab: Nachricht */}
                        <TabsPrimitive.Content value="nachricht" className="mt-5 space-y-4">
                            <Typography className="text-base font-semibold text-gray-700">Nachricht-Vorschau</Typography>
                            <div className="border-l-4 border-primary pl-4 space-y-2">
                                <Typography className="text-sm text-gray-700">{whatsappMessage}</Typography>
                                <Typography className="text-sm text-primary font-bold break-all">{referralLink}</Typography>
                            </div>
                            <WhatsappShareButton url={referralLink} title={whatsappMessage} className="w-full">
                                <button
                                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da855] text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                                    onClick={() => trackEvent({ category: eventCategory, action: 'Click CTA', name: `${modeLabel} – WhatsApp öffnen` })}
                                >
                                    <WhatsAppIcon className="w-5 h-5" />
                                    WhatsApp öffnen
                                </button>
                            </WhatsappShareButton>
                            <div className="md:hidden">
                                <Button className="w-full" onClick={handleShare}>
                                    {t('referral.share.share')}
                                </Button>
                            </div>
                        </TabsPrimitive.Content>

                        {/* Tab: E-Mail */}
                        <TabsPrimitive.Content value="email" className="mt-5 space-y-4">
                            <Typography className="text-base font-semibold text-gray-700">E-Mail-Vorschau</Typography>
                            <div className="border-l-4 border-primary pl-4 space-y-2">
                                <div>
                                    <Typography className="text-xs text-gray-400">Betreff:</Typography>
                                    <Typography className="text-sm font-semibold text-gray-800">{emailSubject}</Typography>
                                </div>
                                <Typography className="text-sm text-gray-700 italic">{emailPreview}</Typography>
                                <Typography className="text-sm text-primary font-bold break-all">{referralLink}</Typography>
                            </div>
                            <a
                                href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark active:opacity-90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-colors"
                                onClick={() => trackEvent({ category: eventCategory, action: 'Click CTA', name: `${modeLabel} – Email übernehmen` })}
                            >
                                <IconMail size={18} />
                                Email übernehmen
                            </a>
                            <ShieldNote />
                        </TabsPrimitive.Content>

                        {/* Tab: Link */}
                        <TabsPrimitive.Content value="link" className="mt-5 space-y-3">
                            <Typography className="text-base font-semibold text-gray-700">Dein persönlicher Link</Typography>
                            <div className="bg-accent border border-primary/20 rounded-lg p-3">
                                <Typography className="text-primary font-bold break-all text-sm">{referralLink}</Typography>
                            </div>
                            <Button
                                className="w-full"
                                variant="outline"
                                leftIcon={hasCopied ? <IconCopyCheck size={16} /> : <IconCopy size={16} />}
                                onClick={() => {
                                    onCopy(referralLink);
                                    trackEvent({ category: eventCategory, action: 'Click CTA', name: `${modeLabel} – Link kopieren` });
                                }}
                            >
                                {hasCopied ? 'Kopiert!' : 'Link kopieren'}
                            </Button>
                            <ShieldNote />
                        </TabsPrimitive.Content>

                        {/* Tab: Bilder/Status */}
                        <TabsPrimitive.Content value="bilder" className="mt-5 space-y-3">
                            <Typography className="text-base font-semibold text-gray-700">Bilder zum Teilen</Typography>
                            <Typography className="text-sm text-gray-500">Klicke auf ein Bild zum Vergrößern und Herunterladen.</Typography>
                            <div className="grid grid-cols-4 gap-2">
                                {sharepics.map((pic) => (
                                    <button
                                        key={pic.word}
                                        onClick={() => {
                                            setSelectedSharepic(pic);
                                            trackEvent({ category: eventCategory, action: 'Click Sharepic Preview', name: `${modeLabel} – ${pic.label}` });
                                        }}
                                        className="flex flex-col items-center group cursor-pointer"
                                    >
                                        <div
                                            className="rounded-md overflow-hidden w-full aspect-square bg-[#3C3489] ring-2 ring-transparent group-hover:ring-primary transition-all [&>svg]:w-full [&>svg]:h-full"
                                            dangerouslySetInnerHTML={{ __html: generateSharepicSVG(pic.word, pic.subline, true, qrDataUri) }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </TabsPrimitive.Content>
                    </TabsPrimitive.Root>
                </div>

                {/* ── Materials section ── */}
                <div className="mb-8">
                    <Typography variant="h3" className="mb-1.5 font-bold">
                        Flyer & Poster auslegen
                    </Typography>
                    <Typography>{t('referral.share.materials.description')}</Typography>
                    <Button className="mt-4" variant="outline" onClick={handleOnShare}>
                        {t('referral.share.materials.button')}
                    </Button>
                </div>
            </div>

            {/* Hidden QR code renderer — used to generate data URI for sharepics */}
            <div
                ref={qrContainerRef}
                style={{ position: 'absolute', visibility: 'hidden', width: 112, height: 112, top: -9999, left: -9999, overflow: 'hidden' }}
            >
                <QRCodeSVG value={qrUrl} size={112} bgColor="white" fgColor="#3C3489" level="M" />
            </div>

            {/* Sharepic modal */}
            <Modal
                isOpen={!!selectedSharepic}
                onOpenChange={(open) => {
                    if (!open) setSelectedSharepic(null);
                }}
                className="w-full sm:max-w-xl"
            >
                {selectedSharepic && (
                    <div className="flex flex-col gap-4">
                        <img
                            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                                generateSharepicSVG(selectedSharepic.word, selectedSharepic.subline, false, qrDataUri)
                            )}`}
                            alt={selectedSharepic.label}
                            className="w-full rounded-lg"
                        />
                        <Button
                            className="w-full"
                            onClick={() => {
                                downloadSharepic(selectedSharepic.word, selectedSharepic.subline, selectedSharepic.label, qrDataUri);
                                trackEvent({ category: eventCategory, action: 'Click Sharepic Download', name: `${modeLabel} – ${selectedSharepic.label}` });
                            }}
                            leftIcon={<IconDownload size={16} />}
                        >
                            Herunterladen
                        </Button>
                    </div>
                )}
            </Modal>
        </WithNavigation>
    );
};

export default Referrals;
