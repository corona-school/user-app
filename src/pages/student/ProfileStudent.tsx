import WithNavigation from '../../components/WithNavigation';
import ProfileSettingRow from '../../widgets/ProfileSettingRow';
import UserProgress from '../../widgets/UserProgress';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '../../gql';
import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Gender, Gender_Enum, Language, StudentLanguage, Student_State_Enum } from '@/gql/graphql';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Label } from '@/components/Label';
import { TextArea } from '@/components/TextArea';
import { LanguageSelector } from '@/components/LanguageSelector';
import { IconEdit, IconInfoCircleFilled } from '@tabler/icons-react';
import { toast } from 'sonner';
import { GenderSelector } from '@/components/GenderSelector';
import { TooltipButton } from '@/components/Tooltip';

type Props = {};

const query = gql(`
    query StudentProfile {
        me {
            firstname
            lastname
            email
            student {
                state
                aboutMe
                languages
                zipCode
                subjectsFormatted {
                    name
                }
                gender
                participationCertificates {
                    state
                    subjectsFormatted
                    startDate
                    endDate
                    hoursTotal
                    medium
                    categories
                    uuid
                    hoursPerWeek
                    ongoingLessons
                    pupil { firstname lastname }
                }
            }
        }
    }
`);

const ProfileStudent: React.FC<Props> = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const [profile, setProfile] = useState({
        aboutMe: '',
        zipCode: '',
        languages: [] as Language[],
        gender: Gender_Enum.Other,
    });
    const { data, loading } = useQuery(query, {
        fetchPolicy: 'no-cache',
    });
    const [updateProfile, { loading: isUpdating }] = useMutation(
        gql(`
        mutation meUpdateStudentProfile($aboutMe: String!, $languages: [StudentLanguage!], $gender: Gender!, $zipCode: String) {
            meUpdate(update: { student: { aboutMe: $aboutMe, languages: $languages, gender: $gender, zipCode: $zipCode } })
        }
    `),
        { refetchQueries: [query] }
    );

    useEffect(() => {
        trackPageView({
            documentTitle: 'Profil - Helfer:in',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data) {
            setProfile({
                aboutMe: data.me.student?.aboutMe ?? '',
                zipCode: data.me.student?.zipCode ?? '',
                languages: (data.me.student?.languages as unknown as Language[]) ?? [],
                gender: data.me.student?.gender ?? Gender_Enum.Other,
            });
        }
    }, [data]);

    const profileCompleteness = useMemo(() => {
        const max = 4.0;
        let complete = 0.0;

        data?.me.firstname && data?.me.lastname && (complete += 1);
        (data?.me.student!.aboutMe?.length ?? 0) > 0 && (complete += 1);
        data?.me?.student?.languages?.length && (complete += 1);
        data?.me?.student?.gender && (complete += 1);
        return Math.floor((complete / max) * 100);
    }, [data?.me?.firstname, data?.me?.lastname, data?.me?.student]);

    const zipCodeLength = () => {
        switch (data?.me?.student?.state) {
            case Student_State_Enum.At:
            case Student_State_Enum.Ch:
                return 4;
            case Student_State_Enum.Other:
                return undefined;
            default:
                return 5;
        }
    };

    const showZipcodeError = () => {
        if (!profile.zipCode || !zipCodeLength()) return false;
        return profile.zipCode.length !== zipCodeLength();
    };

    const handleOnSave = async () => {
        await updateProfile({
            variables: {
                aboutMe: profile.aboutMe,
                languages: profile.languages as unknown as StudentLanguage[],
                gender: profile.gender as unknown as Gender,
                zipCode: profile.zipCode || null,
            },
        });
        toast.success(t('profile.successmessage'));
    };

    return (
        <>
            <WithNavigation
                isLoading={loading}
                previousFallbackRoute="/settings"
                headerTitle={t('profile.title')}
                headerLeft={
                    <div className="flex items-center">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                <div className="max-w-5xl px-5">
                    <Breadcrumb />
                    {profileCompleteness !== 100 && (
                        <ProfileSettingRow title={t('profile.ProfileCompletion.name')}>
                            <UserProgress percent={profileCompleteness} />
                        </ProfileSettingRow>
                    )}
                    <div className="flex flex-col gap-y-2">
                        {/* NAME */}
                        <div className="w-full">
                            <Label htmlFor="name" className="mb-2">
                                {t('profile.UserName.label.title')}
                            </Label>
                            <Input name="name" className="w-full" value={`${data?.me?.firstname ?? ''} ${data?.me?.lastname ?? ''}`} disabled />
                        </div>

                        {/* E-MAIL */}
                        <div className="w-full">
                            <div className="flex items-center mb-2 gap-x-2">
                                <Label htmlFor="email">{t('profile.UserName.label.email')}</Label>
                                <Button
                                    variant="none"
                                    className="size-auto p-0"
                                    onClick={() => {
                                        navigate('/new-email');
                                    }}
                                >
                                    <IconEdit size={18} className="text-primary inline-block" />
                                </Button>
                            </div>

                            <Input name="email" className="w-full" value={data?.me?.email ?? ''} disabled />
                        </div>

                        {/* ABOUT ME */}
                        <div className="mb-2">
                            <Label htmlFor="aboutMe" className="mt-2">
                                {t('profile.AboutMe.label')}
                            </Label>
                            <TextArea
                                className="resize-none h-20 w-full"
                                id="aboutMe"
                                value={profile.aboutMe}
                                onChangeText={(text) => {
                                    setProfile({ ...profile, aboutMe: text });
                                }}
                            />
                        </div>
                        {/* ZIP CODE */}
                        <div>
                            <Label>
                                {t('profile.ZipCode.zipCode')}{' '}
                                <TooltipButton className="max-w-80" tooltipContent={t('registration.steps.zipCode.descriptionStudent')}>
                                    <IconInfoCircleFilled size="16px" />
                                </TooltipButton>
                            </Label>
                            <Input
                                maxLength={zipCodeLength()}
                                type="number"
                                className="w-full max-w-[150px]"
                                value={profile.zipCode}
                                onChangeText={(e) => setProfile({ ...profile, zipCode: e.replace(/\D/g, '') })} // Ensures that only digits can pe typed in
                                onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                                errorMessage={showZipcodeError() ? t('profile.ZipCode.requiredLength', { length: zipCodeLength() }) : undefined}
                            />
                        </div>
                        {/* GENDER */}
                        <div className="flex flex-col gap-y-1 max-w-[500px] overflow-hidden w-full mb-3">
                            <div className="flex flex-col gap-y-2">
                                <Label>
                                    {t('registration.steps.userGender.title')}{' '}
                                    <TooltipButton className="max-w-80" tooltipContent={t('registration.steps.userGender.description')}>
                                        <IconInfoCircleFilled size="16px" />
                                    </TooltipButton>
                                </Label>
                                <GenderSelector
                                    className="flex flex-wrap justify-center p-1"
                                    toggleConfig={{
                                        variant: 'outline',
                                        size: 'lg',
                                        className: 'justify-start w-[48%] md:w-[49%] font-semibold h-[48px]',
                                    }}
                                    value={profile.gender as unknown as Gender}
                                    setValue={(gender) => setProfile({ ...profile, gender: gender as unknown as Gender_Enum })}
                                />
                            </div>
                        </div>
                        {/* LANGUAGES */}
                        <div className="flex flex-col gap-y-1 max-w-[500px] overflow-hidden w-full">
                            <div className="flex flex-col gap-y-2">
                                <Label>
                                    {t('profile.Languages.labelStudent')}{' '}
                                    <TooltipButton className="max-w-80" tooltipContent={t('registration.steps.languages.descriptionStudent')}>
                                        <IconInfoCircleFilled size="16px" />
                                    </TooltipButton>
                                </Label>
                                <LanguageSelector
                                    maxVisibleItems={8}
                                    className="flex flex-wrap justify-center p-1"
                                    searchConfig={{
                                        containerClassName: 'w-full',
                                        className: 'bg-white',
                                        placeholder: t('otherLanguages'),
                                    }}
                                    toggleConfig={{
                                        variant: 'outline',
                                        size: 'lg',
                                        className: 'justify-start w-[48%] md:w-[49%] font-semibold h-[48px]',
                                    }}
                                    multiple
                                    value={profile.languages as unknown as Language[]}
                                    setValue={(languages) => setProfile({ ...profile, languages })}
                                />
                            </div>
                        </div>
                        <Button className="mt-6 min-w-[400px]" onClick={handleOnSave} isLoading={isUpdating} disabled={showZipcodeError()}>
                            {t('save')}
                        </Button>
                    </div>
                </div>
            </WithNavigation>
        </>
    );
};
export default ProfileStudent;
