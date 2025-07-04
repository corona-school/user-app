import { Badge } from '@/components/Badge';
import { Skeleton } from '@/components/Skeleton';
import { Typography } from '@/components/Typography';
import { IconBook2, IconTargetArrow } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pupil, Pupil_Schooltype_Enum, Student, Student_State_Enum } from '../../gql/graphql';
import { getGradeLabel } from '../../Utility';

type MatchPartnerProps = {
    partner?: Pupil | Student;
    isLoading?: boolean;
    isPupil?: boolean;
};
const MatchPartner = ({ partner, isLoading, isPupil }: MatchPartnerProps) => {
    const { t } = useTranslation();

    const state = useMemo(() => {
        if (partner?.state && partner?.state !== Student_State_Enum.Other) return t(`lernfair.states.${partner.state}`);
        return undefined;
    }, [partner?.state, t]);

    const school = useMemo(() => {
        if (partner && 'schooltype' in partner && partner.schooltype !== Pupil_Schooltype_Enum.Other) return t(`lernfair.schooltypes.${partner.schooltype}`);
        return undefined;
    }, [partner, t]);

    const matchPartnerInfos = useMemo(() => {
        let infos = '';
        if (partner && 'gradeAsInt' in partner && partner.gradeAsInt) infos += `${getGradeLabel(partner.gradeAsInt)} `;
        if (school) infos += `${school}, `;
        if (state) infos += state;
        return infos;
    }, [partner, school, state]);

    const partnerName = `${partner?.firstname} ${partner?.lastname}`;

    return (
        <div>
            <div className="flex flex-col gap-y-4 md:gap-y-6">
                <Skeleton isLoading={isLoading} className="max-w-[500px]">
                    <Typography variant="h3">{partnerName}</Typography>
                </Skeleton>

                <Skeleton isLoading={isLoading} variant="body">
                    <Typography>{partner?.aboutMe}</Typography>
                </Skeleton>
                <div className="flex flex-col gap-y-3">
                    {isPupil && (
                        <div className="flex gap-x-2 items-center">
                            <Skeleton isLoading={isLoading}>
                                <IconTargetArrow />
                            </Skeleton>
                            <Skeleton isLoading={isLoading} variant="body">
                                <Typography>{matchPartnerInfos}</Typography>
                            </Skeleton>
                        </div>
                    )}
                    <div className="flex gap-x-2 items-center">
                        <Skeleton isLoading={isLoading}>
                            <IconBook2 />
                        </Skeleton>
                        <div className="flex gap-2 flex-wrap w-full">
                            <Skeleton isLoading={isLoading} variant="body">
                                {partner?.subjectsFormatted.map((subject) => (
                                    <Badge key={subject.name} className="max-h-5 text-sm font-normal">
                                        {subject.name}
                                    </Badge>
                                ))}
                            </Skeleton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchPartner;
