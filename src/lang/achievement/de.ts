const achievement = {
    card: {
        newAchievement: 'neuer Erfolg',
        finishedStepsInformation: '{{currentStep}} von {{maxSteps}} Schritten abgeschlossen',
        finishedStepsInformationMobile: '{{currentStep}}/{{maxSteps}}',
    },
    nextStepCard: {
        finishedSteps: '{{currentStep}} von {{maxSteps}} Schritten abgeschlossen.',
    },
    modal: {
        close: 'Schließen',
        achievements: 'Zu den Erfolgen',
        step: 'schritt {{step}}',
        streak: 'Noch {{leftSteps}} mal pünktlich erscheinen, um den Rekord erneut zu brechen.',
        record: 'Du warst bei {{record}} Terminen in Folge anwesend! Verpasse weiterhin keinen Termin, um den Rekord zu erhöhen.',
    },
    streak: {
        count: '{{streak}}x',
        card: {
            info: 'Du warst bei <strong>{{streak}} Terminen</strong> in Folge pünktlich!',
        },
    },
    progress: {
        state: {
            completed: 'Erhaltene Erfolge',
            active: 'Angefangene Erfolge',
            inactive: 'Weitere Erfolge',
        },
    },
};

export default achievement;
