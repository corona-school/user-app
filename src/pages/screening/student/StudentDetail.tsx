import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';
import { Typography } from '@/components/Typography';
import { StudentForScreening } from '@/types';
import { formatDate } from '@/Utility';
import { ScreeningSuggestionCard } from '@/widgets/screening/ScreeningSuggestionCard';
import { SuggestionsHistory } from '@/widgets/screening/SuggestionsHistory';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PersonalDetails from './PersonalDetails';
import { ScreenStudent } from './ScreenStudent';
import { StudentCourseHistory, StudentMatchingHistory } from './StudentHistory';
import { DateTime } from 'luxon';
interface StudentDetailProps {
    student: StudentForScreening;
    refresh: () => Promise<void>;
}

export const StudentDetail = ({ student, refresh }: StudentDetailProps) => {
    const { t } = useTranslation();
    return (
        <div className="mt-8">
            <div className="mb-6">
                <Typography variant="h3" className="mb-2">
                    {student.firstname} {student.lastname} (Helfer:in)
                </Typography>
                <Typography>
                    <span className="font-bold">E-Mail</span>: {student.email}
                </Typography>
                <Typography>
                    <span className="font-bold">Registiert</span>: {formatDate(student.createdAt, DateTime.DATE_MED)}
                </Typography>
                <Typography>
                    <span className="font-bold">Alter</span>: {student.isAdult ? '18 oder älter' : '14 bis 17'}
                </Typography>
                <Typography>
                    <span className="font-bold">Aktiv</span>:{' '}
                    {student.active ? <IconCheck className="inline text-green-500" /> : <IconX className="inline text-red-500" />}
                </Typography>
            </div>
            <Tabs defaultValue="main">
                <TabsList className="max-h-9 p-1">
                    <TabsTrigger className="max-h-7" value="main">
                        Profil + Screening
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="matching">
                        Matching
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="courses">
                        Kurse
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="certificateOfConduct">
                        Führungszeugnis
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="recommendation">
                        Empfehlungen
                    </TabsTrigger>
                </TabsList>
                <TabsContent inactiveMode="hide" value="main">
                    <div className="shadow-md px-6 py-8 rounded-md">
                        <PersonalDetails student={student} refresh={refresh} />
                    </div>
                    <div className="shadow-md px-6 py-8 rounded-md mt-10">
                        <Typography variant="h4" className="mb-5">
                            Screening
                        </Typography>
                        <ScreenStudent student={student} refresh={refresh} />
                    </div>
                </TabsContent>
                <TabsContent inactiveMode="hide" value="matching">
                    <div className="shadow-md px-6 py-8 rounded-md">
                        <Typography variant="h4" className="mb-5">
                            Matching
                        </Typography>
                        <StudentMatchingHistory matches={student.matches ?? []} />
                    </div>
                </TabsContent>
                <TabsContent inactiveMode="hide" value="courses">
                    <div className="shadow-md px-6 py-8 rounded-md">
                        <Typography variant="h4" className="mb-5">
                            Kurse
                        </Typography>
                        <StudentCourseHistory subcourses={student.subcoursesInstructing ?? []} />
                    </div>
                </TabsContent>
                <TabsContent inactiveMode="hide" value="certificateOfConduct">
                    <div className="shadow-md px-6 py-8 rounded-md">
                        <Typography variant="h4" className="mb-5">
                            {t('screening.certificateOfConduct')}
                        </Typography>
                        <div className="flex flex-col gap-y-2 mb-6">
                            <Typography>
                                {t(
                                    student.certificateOfConduct?.id
                                        ? 'screening.certificateOfConductWasProvided'
                                        : 'screening.certificateOfConductWasNotProvided'
                                )}
                            </Typography>
                            {student.certificateOfConductDeactivationDate && (
                                <Typography className={student.certificateOfConductDeactivationDate ? 'text-destructive' : 'text-primary'}>
                                    {t('screening.deactivationDate')}: {formatDate(student.certificateOfConductDeactivationDate)}
                                </Typography>
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent inactiveMode="hide" value="recommendation">
                    <div className="flex flex-col shadow-md px-6 py-8 rounded-md">
                        <Typography variant="h4" className="mb-5">
                            Empfehlungen
                        </Typography>
                        <ScreeningSuggestionCard userID={`student/${student.id}`} variant="student" refresh={refresh} />
                    </div>
                    <div className="flex flex-col shadow-md px-6 py-8 rounded-md">
                        <Typography variant="h4" className="mb-5">
                            Historie
                        </Typography>
                        <SuggestionsHistory suggestionsHistory={student?.user?.receivedScreeningSuggestions ?? []} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
