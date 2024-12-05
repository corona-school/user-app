import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { cn } from '../lib/Tailwind';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';

import { Box, VStack, HStack, Text, Select, TextArea, ScrollView, Pressable, Center } from 'native-base';
import { useParams } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';

import { Typography } from '../components/Typography';
import { TooltipButton } from '../components/Tooltip';

import { useTranslation } from 'react-i18next';
import INFOICON from '../assets/icons/lernfair/lesson/info_icon.svg';
import InfoGreen from '../assets/icons/icon_info_dk_green.svg';
import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';

interface GeneratedLessonPlan {
    title: string;
    subject: string;
    grade: string;
    duration: string;
    learningGoal: string;
    agendaExercises: string;
    assessment: string;
    homework: string;
    resources: string;
}

interface LessonPlanOutput {
    title: string;
    grade: string;
    subject: string;
    duration: string;
    learningGoals: string[];
    agenda: {
        title: string;
        content: string[];
    }[];
    assessment?: string;
    homework?: string;
    resources?: string;
}

const GENERATE_LESSON_PLAN_MUTATION = gql(`
mutation GenerateLessonPlan(
    $data: GenerateLessonPlanInput!
) {
    generateLessonPlan(data: $data) {
        title
        subject
        grade
        duration
        learningGoal
        agendaExercises
        assessment
        homework
        resources
    }
}
`) as DocumentNode;

interface SubjectMapping {
    [key: string]: string;
}

const subjectMapping: SubjectMapping = {
    Altgriechisch: 'Altgriechisch',
    Arbeitslehre: 'Arbeitslehre',
    Biologie: 'Biologie',
    Chemie: 'Chemie',
    Deutsch: 'Deutsch',
    Deutsch_als_Zweitsprache: 'Deutsch als Zweitsprache',
    Englisch: 'Englisch',
    Erdkunde: 'Erdkunde',
    Ethik: 'Ethik',
    Franz_sisch: 'Französisch',
    Geschichte: 'Geschichte',
    Gesundheit: 'Gesundheit',
    Informatik: 'Informatik',
    Italienisch: 'Italienisch',
    Kunst: 'Kunst',
    Latein: 'Latein',
    Mathematik: 'Mathematik',
    Musik: 'Musik',
    Niederl_ndisch: 'Niederländisch',
    P_dagogik: 'Pädagogik',
    Philosophie: 'Philosophie',
    Physik: 'Physik',
    Politik: 'Politik',
    Religion: 'Religion',
    Russisch: 'Russisch',
    Sachkunde: 'Sachkunde',
    Spanisch: 'Spanisch',
    Technik: 'Technik',
    Wirtschaft: 'Wirtschaft',
    Lernen_lernen: 'Lernen lernen',
};

const subjects = Object.keys(subjectMapping);

const Lesson: React.FC = () => {
    const { t } = useTranslation();

    const [selectedGrade, setSelectedGrade] = useState('13');
    const [selectedDuration, setSelectedDuration] = useState('60');

    // Grade options
    const gradeOptions = Array.from({ length: 13 }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1}. Klasse`,
    }));

    // Duration options in minutes
    const durationOptions = [
        { value: '30', label: '30 Minuten' },
        { value: '45', label: '45 Minuten' },
        { value: '60', label: '60 Minuten' },
        { value: '90', label: '90 Minuten' },
    ];

    const removeFile = (indexToRemove: number) => {
        setUploadedFiles((files) => files.filter((_, index) => index !== indexToRemove));
    };

    const [generatedPlan, setGeneratedPlan] = useState<LessonPlanOutput | null>(null);
    const [generateLessonPlan, { loading, error }] = useMutation<{ generateLessonPlan: GeneratedLessonPlan }>(GENERATE_LESSON_PLAN_MUTATION);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [prompt, setPrompt] = useState('');
    const [showError, setShowError] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [fileUploadStatus, setFileUploadStatus] = useState<string | null>(null);

    // New method for file upload
    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFileUploadStatus('File uploaded successfully');
            return response.data;
        } catch (error) {
            console.error('File upload error:', error);
            setFileUploadStatus('File upload failed');
            return null;
        }
    };

    const examplePrompt =
        'Erstelle einen kreativen Unterrichtsplan auf Deutsch zum Thema Sonnensystem und Planeten. Nutze eine ansprechende und kreative Sprache, die die Schüler motiviert.';

    const handleTryExample = () => {
        setPrompt(examplePrompt);
        setSelectedSubject('Physik');
        setGeneratedPlan(exampleOutput);
    };

    const copyOutputToClipboard = () => {
        if (generatedPlan) {
            const outputText = `
${t('lesson.lessonPlan')} ${generatedPlan.title}
${t('lesson.lessonGrade')} ${generatedPlan.grade}
${t('lesson.subject')} ${generatedPlan.subject}
${t('lesson.duration')} ${generatedPlan.duration}

${t('lesson.learningGoals')}:
${generatedPlan.learningGoals.join('\n')}


${generatedPlan.agenda
    .map(
        (section) => `
${section.title}:
${section.content.join('\n')}
`
    )
    .join('\n')}

${t('lesson.assessment')}: 
${generatedPlan.assessment || 'N/A'}

${t('lesson.homework')}: 
${generatedPlan.homework || 'N/A'}

${t('lesson.resources')}:
${generatedPlan.resources || 'N/A'}
            `.trim();

            navigator.clipboard
                .writeText(outputText)
                .then(() => {
                    console.log('Content copied!');
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                });
        }
    };

    // Utility function to render text with preserved line breaks and whitespaces
    const renderTextWithLineBreaks = (text: string) => {
        return text.split('\n').map((line, index) => (
            <Typography key={index} variant="h6" className="text-[#0F172A] text-base font-normal leading-[26px] whitespace-pre-wrap">
                {line}
            </Typography>
        ));
    };

    const exampleOutput: LessonPlanOutput = {
        title: 'Reise durch das Sonnensystem',
        grade: '10. Klasse',
        subject: 'Physik',
        duration: '60 Minuten',
        learningGoals: [
            'Die Schüler können die Struktur und die Hauptmerkmale des Sonnensystems beschreiben.',
            'Sie erkennen die Unterschiede zwischen inneren und äußeren Planeten.',
            'Sie verstehen die Bedeutung von Umlaufbahnen und deren Einfluss auf die Planetenbewegung.',
        ],
        agenda: [
            {
                title: 'Mission-Start: Einführung (10 Minuten)',
                content: [
                    'Begrüßung der Klasse mit der Frage: "Wenn ihr Astronauten wärt, welches Ziel würdet ihr im Sonnensystem zuerst ansteuern?"',
                    'Kurze Diskussion darüber, was die Schüler bereits über das Sonnensystem wissen.',
                    'Einführung in das Thema mit einem kurzen Video oder einer Animation des Sonnensystems.',
                ],
            },
            {
                title: 'Forschungsteam: Gruppenarbeit (20 Minuten)',
                content: [
                    'Die Klasse wird in kleine Teams aufgeteilt, jedes Team erhält einen Planeten (inkl. Sonne und Zwergplaneten).',
                    'Aufgabe: Recherchiert in euren Teams die wichtigsten Eigenschaften eures Planeten (z. B. Größe, Entfernung zur Sonne, Atmosphäre, besondere Merkmale).',
                    'Die Teams erstellen eine kurze Präsentation (z. B. ein Poster oder eine digitale Folie).',
                ],
            },
            {
                title: 'Wissenschaftskongress: Präsentation (15 Minuten)',
                content: [
                    'Jedes Team präsentiert ihren Planeten als Teil einer gemeinsamen "Reise durch das Sonnensystem".',
                    'Die Schüler sollen besonders darauf achten, wie sich ihr Planet von den anderen unterscheidet.',
                ],
            },
            {
                title: 'Kosmische Diskussion (10 Minuten)',
                content: [
                    'Offene Diskussion über die größten Unterschiede und Gemeinsamkeiten der Planeten.',
                    'Fragen wie: "Warum gibt es Leben auf der Erde, aber nicht auf anderen Planeten?"',
                ],
            },
            {
                title: 'Landung: Zusammenfassung (5 Minuten)',
                content: [
                    'Gemeinsame Reflexion: Was hat euch überrascht oder am meisten interessiert?',
                    'Zusammenfassung der wichtigsten Punkte und Verabschiedung mit einem kurzen Ausblick auf das nächste Thema.',
                ],
            },
        ],
        assessment: 'Die Schüler werden anhand ihrer Teampräsentationen und ihrer aktiven Teilnahme an der Diskussion bewertet.',
        homework:
            'Schreibt einen kreativen Reisebericht: Stellt euch vor, ihr besucht den Planeten, den ihr erforscht habt. Beschreibt, was ihr dort seht und erlebt.',
        resources: 'Digitale Animation des Sonnensystems, Arbeitsblätter für Planetenrecherche, Zugang zu Tablets oder Büchern zur Recherche',
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newFiles = [...uploadedFiles, ...files].slice(0, 3);
            setUploadedFiles(newFiles);

            // Optional: Automatically upload files
            const uploadPromises = newFiles.map(uploadFile);
            await Promise.all(uploadPromises);
        }
    };

    const resetForm = () => {
        setSelectedSubject('');
        setPrompt('');
        setUploadedFiles([]);
        setGeneratedPlan(null);
    };

    const handleGenerate = async () => {
        if (!selectedSubject) {
            return;
        }

        if (!termsAccepted) {
            setShowError(true);
            return;
        }

        try {
            // Upload files first and get their UUIDs
            const fileUuids: string[] = [];
            for (const file of uploadedFiles) {
                const uuid = await uploadFile(file);
                if (uuid) fileUuids.push(uuid);
            }
            console.log('Uploaded file UUIDs:', fileUuids);
            const { data } = await generateLessonPlan({
                variables: {
                    data: {
                        fileUuids: fileUuids,
                        grade: parseInt(selectedGrade), // Use selected grade
                        duration: parseInt(selectedDuration), // Use selected duration
                        state: 'he',
                        prompt: prompt || `Erstelle einen Unterrichtsplan für das Thema ${selectedSubject}`,
                        expectedOutputs: ['AGENDA_EXERCISES', 'ASSESSMENT', 'HOMEWORK', 'LEARNING_GOAL', 'RESOURCES', 'TITLE'],
                        schoolType: 'gymnasium',
                        language: 'German',
                        subject: selectedSubject,
                    },
                },
            });

            if (data?.generateLessonPlan) {
                const transformedPlan: LessonPlanOutput = {
                    title: data.generateLessonPlan.title || '',
                    grade: `${selectedGrade}. Klasse`,
                    subject: data.generateLessonPlan.subject || '',
                    duration: `${selectedDuration} Minuten`,
                    learningGoals: data.generateLessonPlan.learningGoal ? [data.generateLessonPlan.learningGoal] : [],
                    agenda: data.generateLessonPlan.agendaExercises
                        ? [
                              {
                                  title: t('lesson.lessonAgenda') as string,
                                  content: [data.generateLessonPlan.agendaExercises],
                              },
                          ]
                        : [],
                    assessment: data.generateLessonPlan.assessment,
                    homework: data.generateLessonPlan.homework,
                    resources: data.generateLessonPlan.resources,
                };

                setGeneratedPlan(transformedPlan);
            }
        } catch (error) {
            console.error('Error generating lesson plan:', error);
        }
    };

    return (
        <WithNavigation
            headerLeft={
                <div className="flex">
                    <NotificationAlert />
                    <SwitchLanguageButton />
                </div>
            }
        >
            <Box position="relative" minH="100vh">
                <ScrollView>
                    <HStack maxW="1200px" mx="auto" p={4} space={8} alignItems="flex-start">
                        {/* Left Section */}
                        <Box w="573px" bg="white" p={6} borderRadius="sm" borderWidth={1} borderColor="gray.200">
                            {/* Header */}
                            <Box mb={5}>
                                <Text fontSize="39px" fontWeight="bold" color="#2a4a50" fontFamily="Outfit">
                                    {t('lesson.pageTitle')}
                                </Text>
                                <Text fontSize="16px" color="gray.700" fontFamily="Outfit">
                                    {t('lesson.generatePlanText')}
                                </Text>
                            </Box>

                            {/* Try Example Button */}
                            <Button variant="default" className="text-white font-medium mb-6" onClick={handleTryExample}>
                                <INFOICON
                                    style={{
                                        width: 16,
                                        height: 16,
                                        marginRight: 8,
                                    }}
                                ></INFOICON>
                                {t('lesson.tryExample')}
                            </Button>

                            {/* Form */}
                            <VStack space={4}>
                                {/* Subject Selection */}
                                <Box>
                                    <Text fontSize="sm" color="#2a4a50" mb={1}>
                                        {t('lesson.chooseSubject')}
                                        <Text color="red.500">*</Text>
                                    </Text>
                                    <Select
                                        placeholder={t('lesson.chooseSubject')}
                                        borderColor="gray.300"
                                        selectedValue={selectedSubject}
                                        onValueChange={(value) => setSelectedSubject(value)}
                                    >
                                        {subjects.map((subject) => (
                                            <Select.Item key={subject} label={subjectMapping[subject]} value={subject} />
                                        ))}
                                    </Select>
                                </Box>

                                {/* Grade and Duration Selection side by side */}
                                <HStack space={4} w="100%">
                                    {/* Grade Selection */}
                                    <Box flex={1}>
                                        <Text fontSize="sm" color="#2a4a50" mb={1}>
                                            {t('lesson.lessonGrade')}
                                            <Text color="red.500">*</Text>
                                        </Text>
                                        <Select
                                            placeholder={t('lesson.chooseGrade')}
                                            borderColor="gray.300"
                                            selectedValue={selectedGrade}
                                            onValueChange={(value) => setSelectedGrade(value)}
                                        >
                                            {gradeOptions.map((grade) => (
                                                <Select.Item key={grade.value} label={grade.label} value={grade.value} />
                                            ))}
                                        </Select>
                                    </Box>

                                    {/* Duration Selection */}
                                    <Box flex={1}>
                                        <Text fontSize="sm" color="#2a4a50" mb={1}>
                                            {t('lesson.duration')}
                                            <Text color="red.500">*</Text>
                                        </Text>
                                        <Select
                                            placeholder={t('lesson.chooseDuration')}
                                            borderColor="gray.300"
                                            selectedValue={selectedDuration}
                                            onValueChange={(value) => setSelectedDuration(value)}
                                        >
                                            {durationOptions.map((duration) => (
                                                <Select.Item key={duration.value} label={duration.label} value={duration.value} />
                                            ))}
                                        </Select>
                                    </Box>
                                </HStack>

                                <Box>
                                    <Text fontSize="sm" color="#2a4a50" mb={1}>
                                        {t('lesson.prompt') as string}
                                    </Text>
                                    <TextArea
                                        h={32}
                                        placeholder={t('lesson.placeholderDescription') as string}
                                        borderColor="gray.300"
                                        autoCompleteType={undefined}
                                        value={prompt}
                                        onChangeText={(text: string) => setPrompt(text)}
                                    />
                                </Box>

                                {/* File Upload Section */}
                                <HStack space={4} alignItems="flex-start">
                                    {/* Upload Area */}
                                    <Box flex={1}>
                                        <HStack alignItems="center" space={2} mb={1}>
                                            <Text fontSize="sm" color="#2a4a50">
                                                {t('lesson.knowdlegeButton') as string}
                                            </Text>
                                            <TooltipButton tooltipContent={t('lesson.fileUploadTooltip')}>
                                                <InfoGreen
                                                    style={{
                                                        width: 12,
                                                        height: 12,
                                                        position: 'relative',

                                                        color: '#D41212',
                                                    }}
                                                />
                                            </TooltipButton>
                                        </HStack>
                                        <VStack space={2} p={4} borderWidth={1} borderColor="gray.300" borderRadius="md" alignItems="center">
                                            <Text color="gray.400" fontSize="sm">
                                                {t('lesson.uploadHere') as string}
                                            </Text>

                                            <Button variant="default" onClick={() => document.getElementById('file-upload')?.click()}>
                                                {t('lesson.browseButton') as string}
                                            </Button>
                                            <input id="file-upload" type="file" hidden multiple onChange={handleFileChange} />
                                        </VStack>
                                    </Box>

                                    {/* Uploaded Files */}
                                    <Box flex={1} mt={4}>
                                        <Text fontSize="sm" color="#2a4a50" mb={1}>
                                            {t('lesson.uploadedFiles') as string}
                                        </Text>
                                        <VStack space={2}>
                                            {uploadedFiles.map((file, index) => (
                                                <HStack
                                                    key={index}
                                                    p={2}
                                                    borderWidth={2}
                                                    borderColor="gray.300"
                                                    borderRadius="lg"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    space={2}
                                                >
                                                    <HStack flex={1} space={2} alignItems="center" minW={0} maxW="80%">
                                                        <Box flexShrink={0}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                                                    stroke="#2A4A50"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M14 2V8H20"
                                                                    stroke="#2A4A50"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </Box>
                                                        <VStack flex={1} space={0.5} minW={0}>
                                                            <Text fontSize="xs" color="#2A4A50" noOfLines={1} maxW="100%" flexShrink={1}>
                                                                {file.name}
                                                            </Text>
                                                            <Text fontSize="xs" color="gray.500">
                                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                    <Pressable p={1} minW={0} onPress={() => removeFile(index)} _hover={{ opacity: 0.8 }}>
                                                        <Center w={8} h={8} bg="#2A4A50" borderRadius="md">
                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1 1L13 13M1 13L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>
                                                        </Center>
                                                    </Pressable>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </Box>
                                </HStack>

                                {/* Terms and Conditions Checkbox */}
                                <Box mb={4} maxWidth="100%">
                                    <HStack space={2} alignItems="flex-start" width="100%">
                                        <Checkbox
                                            id="terms"
                                            checked={termsAccepted}
                                            onCheckedChange={(checked: boolean) => {
                                                setTermsAccepted(checked);
                                                if (checked) setShowError(false);
                                            }}
                                            className="mt-1 flex-shrink-0"
                                        />
                                        <VStack space={1} flex={1}>
                                            <label
                                                htmlFor="terms"
                                                className="flex text-[14px] font-medium font-outfit text-[#2A4A50] leading-[14px] cursor-pointer"
                                            >
                                                {t('lesson.acceptTermsCheckbox') as string}
                                                <span className="text-[#D41212]">*</span>
                                            </label>
                                            <Text
                                                fontSize="10px"
                                                fontFamily="Outfit"
                                                fontWeight="400"
                                                color="#64748B"
                                                lineHeight="14px"
                                                pr={4}
                                                style={{
                                                    flexWrap: 'wrap',
                                                    maxWidth: '100%',
                                                }}
                                            >
                                                {t('lesson.acceptTCText') as string}
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {showError && (
                                        <Text fontSize="12px" color="#D41212" mt={1} ml={8}>
                                            Please accept the terms and conditions
                                        </Text>
                                    )}
                                </Box>

                                {/* Generate Button */}
                                <HStack space="4" justifyContent="flex-end">
                                    <Button variant="outline" onClick={resetForm}>
                                        {t('lesson.resetLesson') as string}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleGenerate}
                                        disabled={!termsAccepted || loading}
                                        className={cn(
                                            'bg-[#F7DB4D] text-[#2A4A50] relative',
                                            (!termsAccepted || loading) && 'opacity-50 bg-[#E5E7EB] cursor-not-allowed'
                                        )}
                                    >
                                        {loading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                            </div>
                                        )}
                                        <span className={loading ? 'invisible' : ''}>{t('lesson.generatePlanButton') as string}</span>
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>

                        {/* Right Section */}
                        <Box w="573px" bg="white" p={6} borderRadius="sm" borderWidth={1} borderColor="gray.200">
                            {generatedPlan && (
                                <VStack space={4} alignItems="flex-start">
                                    {/* Title and Details */}
                                    <VStack space={2} alignItems="flex-start">
                                        <Typography variant="h4" className="text-[#0F172A] font-normal">
                                            {t('lesson.lessonPlan') as string} {generatedPlan.title || ''}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            {t('lesson.lessonGrade') as string} {generatedPlan.grade || ''}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            {t('lesson.subject') as string} {subjectMapping[generatedPlan.subject] || generatedPlan.subject}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            {t('lesson.duration') as string} {generatedPlan.duration || ''}
                                        </Typography>
                                    </VStack>

                                    {/* Divider */}
                                    <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />

                                    {/* Learning Goals */}
                                    <VStack space={2} alignItems="flex-start" width="100%">
                                        <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                            {t('lesson.learningGoals') as string}
                                        </Typography>
                                        {generatedPlan.learningGoals.map((goal, index) => renderTextWithLineBreaks(goal))}
                                    </VStack>

                                    {/* Divider */}
                                    <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />

                                    {/* Agenda */}
                                    {generatedPlan.agenda.map((section, index) => (
                                        <VStack key={index} space={2} alignItems="flex-start" width="100%">
                                            <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                                {section.title}
                                            </Typography>
                                            {section.content.map((item, itemIndex) => renderTextWithLineBreaks(item))}
                                            {index < generatedPlan.agenda.length - 1 && (
                                                <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" my={4} />
                                            )}
                                        </VStack>
                                    ))}

                                    {/* Assessment */}
                                    {generatedPlan.assessment && (
                                        <>
                                            <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />
                                            <VStack space={2} alignItems="flex-start" width="100%">
                                                <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                                    {t('lesson.assessment') as string}
                                                </Typography>
                                                {renderTextWithLineBreaks(generatedPlan.assessment)}
                                            </VStack>
                                        </>
                                    )}

                                    {/* Homework */}
                                    {generatedPlan.homework && (
                                        <>
                                            <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />
                                            <VStack space={2} alignItems="flex-start" width="100%">
                                                <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                                    {t('lesson.homework') as string}
                                                </Typography>
                                                {renderTextWithLineBreaks(generatedPlan.homework)}
                                            </VStack>
                                        </>
                                    )}

                                    {/* Resources */}
                                    {generatedPlan.resources && (
                                        <>
                                            <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />
                                            <VStack space={2} alignItems="flex-start" width="100%">
                                                <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                                    {t('lesson.resources') as string}{' '}
                                                </Typography>
                                                {renderTextWithLineBreaks(generatedPlan.resources)}
                                            </VStack>
                                        </>
                                    )}

                                    {/* Copy Output Button */}
                                    <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />
                                    <VStack alignItems="stretch" style={{ width: '100%', alignItems: 'flex-end' }}>
                                        {generatedPlan && (
                                            <Button
                                                variant="secondary"
                                                size="default"
                                                className={cn('bg-[#F7DB4D] text-[#2A4A50] relative')}
                                                onClick={copyOutputToClipboard}
                                            >
                                                {t('lesson.copyButton') as string}
                                            </Button>
                                        )}
                                    </VStack>
                                </VStack>
                            )}
                        </Box>
                    </HStack>
                </ScrollView>
            </Box>
        </WithNavigation>
    );
};

export default Lesson;
