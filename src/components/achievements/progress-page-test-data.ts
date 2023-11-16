import { Achievement, AchievementState, AchievementType, ActionTypes } from '../../types/achievement';
import KanufahrtDschungel from '../../assets/images/achievements/KanufahrtDschungel.png';
import ExampleStreakImage from '../../assets/images/achievements/example_streak_image.png';
import ExampleStreakImageRecord from '../../assets/images/achievements/example_streak_image_record.png';
import SequenceExample00 from '../../assets/images/achievements/Sequence_Example_00.png';
import SequenceExample01 from '../../assets/images/achievements/Sequence_Example_01.png';
import SequenceExample04 from '../../assets/images/achievements/Sequence_Example_04.png';

const achievements: Achievement[] = [
    {
        name: '5 erreichte Meilensteine',
        subtitle: 'Projektfortschritt',
        actionDescription: 'Ein Beispieltext für diesen Meilenstein...',
        description: 'Achievement related to Projektfortschritt - 5 erreichte Meilensteine.',
        image: SequenceExample01,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-09-15T12:30:00Z',
        achievedText: 'Hervorragende Leistung! Ziel erreicht.',
        actionType: ActionTypes.ACTION,
        achievementType: AchievementType.SEQUENTIAL,
        maxSteps: 4,
        currentStep: 1,
        achievementState: AchievementState.ACTIVE,
        steps: [
            { description: 'Step 1', isActive: true },
            { description: 'Step 2', isActive: false },
            { description: 'Step 3', isActive: false },
            { description: 'Step 4', isActive: false },
        ],
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '10 abgeschlossene Schulungseinheiten',
        subtitle: 'Weiterbildung',
        actionDescription: 'Ein Beispieltext für diese Schulungseinheit...',
        description: 'Achievement related to Weiterbildung - 10 abgeschlossene Schulungseinheiten.',
        image: KanufahrtDschungel,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-11-05T15:45:00Z',
        achievedText: 'Herzlichen Glückwunsch! Schulung erfolgreich abgeschlossen.',
        actionType: ActionTypes.WAIT,
        achievementType: AchievementType.TIERED,
        maxSteps: 10,
        currentStep: 7,
        achievementState: AchievementState.ACTIVE,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '20 Stunden Teamzusammenarbeit',
        subtitle: 'Kollaboration',
        actionDescription: 'Ein Beispieltext für diese Teamzusammenarbeit...',
        description: 'Achievement related to Kollaboration - 20 Stunden Teamzusammenarbeit.',
        image: ExampleStreakImage,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-10-02T09:20:00Z',
        achievedText: 'Teamwork macht den Traum wahr! Tolle Zusammenarbeit.',
        actionType: ActionTypes.APPOINTMENT,
        achievementType: AchievementType.STREAK,
        maxSteps: 20,
        currentStep: 15,
        achievementState: AchievementState.ACTIVE,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '15 erfolgreiche Kundenpräsentationen',
        subtitle: 'Vertrieb',
        actionDescription: 'Ein Beispieltext für diese Kundenpräsentation...',
        description: 'Achievement related to Vertrieb - 15 erfolgreiche Kundenpräsentationen.',
        image: KanufahrtDschungel,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-10-18T14:00:00Z',
        achievedText: 'Kunden begeistert! Erfolgreiche Präsentation.',
        actionType: ActionTypes.INFO,
        achievementType: AchievementType.TIERED,
        maxSteps: 15,
        currentStep: 15,
        achievementState: AchievementState.COMPLETED,
        newAchievement: true,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '30 Tage kontinuierliche Code-Optimierung',
        subtitle: 'Softwareentwicklung',
        actionDescription: 'Ein Beispieltext für diese Code-Optimierung...',
        description: 'Achievement related to Softwareentwicklung - 30 Tage kontinuierliche Code-Optimierung.',
        image: ExampleStreakImageRecord,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-11-02T11:10:00Z',
        achievedText: 'Optimaler Code! Herausragende Leistung im Entwicklerteam.',
        actionType: ActionTypes.WAIT,
        achievementType: AchievementType.STREAK,
        maxSteps: 30,
        currentStep: 30,
        achievementState: AchievementState.COMPLETED,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '25 behandelte Support-Anfragen',
        subtitle: 'Kundenbetreuung',
        actionDescription: 'Ein Beispieltext für diese Support-Anfragen...',
        description: 'Achievement related to Kundenbetreuung - 25 behandelte Support-Anfragen.',
        image: SequenceExample04,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-10-12T17:30:00Z',
        achievedText: 'Exzellenter Kundenservice! Alle Anfragen erfolgreich bearbeitet.',
        actionType: ActionTypes.APPOINTMENT,
        achievementType: AchievementType.SEQUENTIAL,
        maxSteps: 4,
        currentStep: 4,
        steps: [
            { description: 'Step 1', isActive: false },
            { description: 'Step 2', isActive: false },
            { description: 'Step 3', isActive: false },
            { description: 'Step 4', isActive: false },
        ],
        achievementState: AchievementState.COMPLETED,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '40 veröffentlichte Artikel',
        subtitle: 'Content-Erstellung',
        actionDescription: 'Ein Beispieltext für diese Artikelveröffentlichungen...',
        description: 'Achievement related to Content-Erstellung - 40 veröffentlichte Artikel.',
        image: KanufahrtDschungel,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-09-28T08:45:00Z',
        achievedText: 'Kreativität am Werk! 40 Artikel erfolgreich veröffentlicht.',
        actionType: ActionTypes.ACTION,
        achievementType: AchievementType.TIERED,
        maxSteps: 40,
        currentStep: 40,
        achievementState: AchievementState.COMPLETED,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '5 Stunden interne Schulungen geleitet',
        subtitle: 'Weiterbildung',
        actionDescription: 'Ein Beispieltext für diese internen Schulungen...',
        description: 'Achievement related to Weiterbildung - 5 Stunden interne Schulungen geleitet.',
        image: SequenceExample00,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-11-08T13:15:00Z',
        achievedText: 'Wissensvermittlung pur! Erfolgreiche Leitung von Schulungen.',
        actionType: ActionTypes.INFO,
        achievementType: AchievementType.SEQUENTIAL,
        maxSteps: 4,
        currentStep: 0,
        achievementState: AchievementState.INACTIVE,
        steps: [
            { description: 'Step 1', isActive: false },
            { description: 'Step 2', isActive: false },
            { description: 'Step 3', isActive: false },
            { description: 'Step 4', isActive: false },
        ],
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '12 abgeschlossene Schulungseinheiten',
        subtitle: 'Weiterbildung',
        actionDescription: 'Ein Beispieltext für diese Schulungseinheit...',
        description: 'Achievement related to Weiterbildung - 12 abgeschlossene Schulungseinheiten.',
        image: KanufahrtDschungel,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-11-05T15:45:00Z',
        achievedText: 'Herzlichen Glückwunsch! Schulung erfolgreich abgeschlossen.',
        actionType: ActionTypes.WAIT,
        achievementType: AchievementType.TIERED,
        maxSteps: 12,
        currentStep: 0,
        achievementState: AchievementState.INACTIVE,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '25 Stunden Teamzusammenarbeit',
        subtitle: 'Kollaboration',
        actionDescription: 'Ein Beispieltext für diese Teamzusammenarbeit...',
        description: 'Achievement related to Kollaboration - 25 Stunden Teamzusammenarbeit.',
        image: ExampleStreakImage,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-10-02T09:20:00Z',
        achievedText: 'Teamwork macht den Traum wahr! Tolle Zusammenarbeit.',
        actionType: ActionTypes.APPOINTMENT,
        achievementType: AchievementType.STREAK,
        maxSteps: 25,
        currentStep: 20,
        achievementState: AchievementState.ACTIVE,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '20 erfolgreiche Kundenpräsentationen',
        subtitle: 'Vertrieb',
        actionDescription: 'Ein Beispieltext für diese Kundenpräsentation...',
        description: 'Achievement related to Vertrieb - 20 erfolgreiche Kundenpräsentationen.',
        image: KanufahrtDschungel,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-10-18T14:00:00Z',
        achievedText: 'Kunden begeistert! Erfolgreiche Präsentation.',
        actionType: ActionTypes.INFO,
        achievementType: AchievementType.TIERED,
        maxSteps: 20,
        currentStep: 20,
        achievementState: AchievementState.COMPLETED,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '35 Tage kontinuierliche Code-Optimierung',
        subtitle: 'Softwareentwicklung',
        actionDescription: 'Ein Beispieltext für diese Code-Optimierung...',
        description: 'Achievement related to Softwareentwicklung - 35 Tage kontinuierliche Code-Optimierung.',
        image: ExampleStreakImage,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-11-02T11:10:00Z',
        achievedText: 'Optimaler Code! Herausragende Leistung im Entwicklerteam.',
        actionType: ActionTypes.WAIT,
        achievementType: AchievementType.STREAK,
        maxSteps: 35,
        currentStep: 0,
        achievementState: AchievementState.INACTIVE,
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '30 behandelte Support-Anfragen',
        subtitle: 'Kundenbetreuung',
        actionDescription: 'Ein Beispieltext für diese Support-Anfragen...',
        description: 'Achievement related to Kundenbetreuung - 30 behandelte Support-Anfragen.',
        image: SequenceExample01,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-10-12T17:30:00Z',
        achievedText: 'Exzellenter Kundenservice! Alle Anfragen erfolgreich bearbeitet.',
        actionType: ActionTypes.APPOINTMENT,
        achievementType: AchievementType.SEQUENTIAL,
        maxSteps: 4,
        currentStep: 1,
        achievementState: AchievementState.ACTIVE,
        steps: [
            { description: 'Step 1', isActive: true },
            { description: 'Step 2', isActive: false },
            { description: 'Step 3', isActive: false },
            { description: 'Step 4', isActive: false },
        ],
        buttonLabel: 'Kontakt aufnehmen',
    },
    {
        name: '45 veröffentlichte Artikel',
        subtitle: 'Content-Erstellung',
        actionDescription: 'Ein Beispieltext für diese Artikelveröffentlichungen...',
        description: 'Achievement related to Content-Erstellung - 45 veröffentlichte Artikel.',
        image: KanufahrtDschungel,
        alternativeText: 'Ein Beispielbild',
        achievedAt: '2023-09-28T08:45:00Z',
        achievedText: 'Kreativität am Werk! 45 Artikel erfolgreich veröffentlicht.',
        actionType: ActionTypes.ACTION,
        achievementType: AchievementType.TIERED,
        maxSteps: 45,
        currentStep: 45,
        achievementState: AchievementState.COMPLETED,
        buttonLabel: 'Kontakt aufnehmen',
    },
];

export { achievements };
