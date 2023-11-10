import { Achievement, AchievementState, AchievementType, ActionTypes } from './types';

const achievements: Achievement[] = [
    {
        name: '5 erreichte Meilensteine',
        subtitle: 'Projektfortschritt',
        description: 'Ein Beispieltext für diesen Meilenstein...',
        achievedAt: '2023-09-15T12:30:00Z',
        achievedText: 'Hervorragende Leistung! Ziel erreicht.',
        actionType: ActionTypes.ACTION,
        achievementType: AchievementType.SEQUENTIAL,
        maxSteps: 5,
        currentStep: 3,
        achievementState: AchievementState.ACTIVE,
    },
    {
        name: '10 abgeschlossene Schulungseinheiten',
        subtitle: 'Weiterbildung',
        description: 'Ein Beispieltext für diese Schulungseinheit...',
        achievedAt: '2023-11-05T15:45:00Z',
        achievedText: 'Herzlichen Glückwunsch! Schulung erfolgreich abgeschlossen.',
        actionType: ActionTypes.WAIT,
        achievementType: AchievementType.TIERED,
        maxSteps: 10,
        currentStep: 7,
        achievementState: AchievementState.ACTIVE,
    },
    {
        name: '20 Stunden Teamzusammenarbeit',
        subtitle: 'Kollaboration',
        description: 'Ein Beispieltext für diese Teamzusammenarbeit...',
        achievedAt: '2023-10-02T09:20:00Z',
        achievedText: 'Teamwork macht den Traum wahr! Tolle Zusammenarbeit.',
        actionType: ActionTypes.APPOINTMENT,
        achievementType: AchievementType.STREAK,
        maxSteps: 20,
        currentStep: 15,
        achievementState: AchievementState.ACTIVE,
    },
    {
        name: '15 erfolgreiche Kundenpräsentationen',
        subtitle: 'Vertrieb',
        description: 'Ein Beispieltext für diese Kundenpräsentation...',
        achievedAt: '2023-10-18T14:00:00Z',
        achievedText: 'Kunden begeistert! Erfolgreiche Präsentation.',
        actionType: ActionTypes.INFO,
        achievementType: AchievementType.TIERED,
        maxSteps: 15,
        currentStep: 15,
        achievementState: AchievementState.COMPLETED,
        newAchievement: true,
    },
    {
        name: '30 Tage kontinuierliche Code-Optimierung',
        subtitle: 'Softwareentwicklung',
        description: 'Ein Beispieltext für diese Code-Optimierung...',
        achievedAt: '2023-11-02T11:10:00Z',
        achievedText: 'Optimaler Code! Herausragende Leistung im Entwicklerteam.',
        actionType: ActionTypes.WAIT,
        achievementType: AchievementType.STREAK,
        maxSteps: 30,
        currentStep: 0,
        achievementState: AchievementState.INACTIVE,
    },
    {
        name: '25 behandelte Support-Anfragen',
        subtitle: 'Kundenbetreuung',
        description: 'Ein Beispieltext für diese Support-Anfragen...',
        achievedAt: '2023-10-12T17:30:00Z',
        achievedText: 'Exzellenter Kundenservice! Alle Anfragen erfolgreich bearbeitet.',
        actionType: ActionTypes.APPOINTMENT,
        achievementType: AchievementType.SEQUENTIAL,
        maxSteps: 25,
        currentStep: 0,
        achievementState: AchievementState.INACTIVE,
    },
    {
        name: '40 veröffentlichte Artikel',
        subtitle: 'Content-Erstellung',
        description: 'Ein Beispieltext für diese Artikelveröffentlichungen...',
        achievedAt: '2023-09-28T08:45:00Z',
        achievedText: 'Kreativität am Werk! 40 Artikel erfolgreich veröffentlicht.',
        actionType: ActionTypes.ACTION,
        achievementType: AchievementType.TIERED,
        maxSteps: 40,
        currentStep: 40,
        achievementState: AchievementState.COMPLETED,
    },
    {
        name: '50 Stunden interne Schulungen geleitet',
        subtitle: 'Weiterbildung',
        description: 'Ein Beispieltext für diese internen Schulungen...',
        achievedAt: '2023-11-08T13:15:00Z',
        achievedText: 'Wissensvermittlung pur! Erfolgreiche Leitung von Schulungen.',
        actionType: ActionTypes.INFO,
        achievementType: AchievementType.SEQUENTIAL,
        maxSteps: 50,
        currentStep: 45,
        achievementState: AchievementState.ACTIVE,
    },
];

export { achievements };
