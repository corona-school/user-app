import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { cn } from '../lib/Tailwind';

import { Box, VStack, HStack, Text, Select, TextArea, ScrollView, Pressable, Center } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import { Typography } from '../components/Typography';

import { useTranslation } from 'react-i18next';
import INFOICON from '../assets/icons/lernfair/lesson/info_icon.svg';

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

    const copyOutputToClipboard = () => {
        if (generatedPlan) {
            const outputText = `
Lesson Plan: ${generatedPlan.title}
Grade: ${generatedPlan.grade}
Subject: ${generatedPlan.subject}
Duration: ${generatedPlan.duration}

Learning Goal:
${generatedPlan.learningGoals.join('\n')}

Agenda:
${generatedPlan.agenda
    .map(
        (section) => `
${section.title}
${section.content.join('\n')}
`
    )
    .join('\n')}

Assessment:
${generatedPlan.assessment || 'N/A'}

Homework:
${generatedPlan.homework || 'N/A'}

Resources:
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
        title: 'Exploring the Solar System',
        grade: '6th Grade',
        subject: 'Science',
        duration: '30 Mins',
        learningGoals: [
            'Identify the planets in the solar system and their order from the Sun.',
            'Describe key features of each planet.',
            'Understand the concept of orbits and how planets revolve around the Sun.',
            'Differentiate between inner and outer planets.',
        ],
        agenda: [
            {
                title: 'Introduction (10 minutes)',
                content: [
                    'Ask the students: "When you look up at the sky at night, what do you see?" Write down answers (e.g., stars, planets, the moon).',
                    'Transition by saying: "Today, we\'re going to learn about our amazing solar system and all the planets in it."',
                ],
            },
            {
                title: 'Presentation (15 minutes)',
                content: ['Share a slide presentation or images of each planet, explaining key facts:'],
            },
        ],
        assessment: 'Students will complete a quiz identifying planets and their characteristics.',
        homework: 'Create a model of the solar system using household materials.',
        resources: 'Astronomy textbook, solar system poster, online planetary database',
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
                        grade: 10, // Default grade, could be made dynamic
                        duration: 60, // Default duration, could be made dynamic
                        state: 'he', // Default state
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
                    grade: data.generateLessonPlan.grade || '',
                    subject: data.generateLessonPlan.subject || '',
                    duration: data.generateLessonPlan.duration || '',
                    learningGoals: data.generateLessonPlan.learningGoal ? [data.generateLessonPlan.learningGoal] : [],
                    agenda: data.generateLessonPlan.agendaExercises
                        ? [
                              {
                                  title: 'Lesson Agenda',
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
            // Optionally, show an error message to the user
        }
    };

    return (
        <WithNavigation>
            <Box position="relative" minH="100vh">
                <ScrollView>
                    <HStack maxW="1200px" mx="auto" p={4} space={8} alignItems="flex-start">
                        {/* Left Section */}
                        <Box w="573px" bg="white" p={6} borderRadius="sm" borderWidth={1} borderColor="gray.200">
                            {/* Header */}
                            <Box mb={5}>
                                <Text fontSize="39px" fontWeight="bold" color="#2a4a50" fontFamily="Outfit">
                                    Lesson Plan Generator
                                </Text>
                                <Text fontSize="16px" color="gray.700" fontFamily="Outfit">
                                    Generate a lesson plan to teach your students
                                </Text>
                            </Box>

                            {/* Try Example Button */}
                            <Button variant="default" className="text-white font-medium mb-6" onClick={() => setGeneratedPlan(exampleOutput)}>
                                <INFOICON
                                    style={{
                                        width: 16,
                                        height: 16,
                                        marginRight: 8,
                                    }}
                                ></INFOICON>
                                Try Example
                            </Button>

                            {/* Form */}
                            <VStack space={4}>
                                {/* Subject Selection */}
                                <Box>
                                    <Text fontSize="sm" color="#2a4a50" mb={1}>
                                        Fach auswählen<Text color="red.500">*</Text>
                                    </Text>
                                    <Select
                                        placeholder="Wählen Sie ein Fach"
                                        borderColor="gray.300"
                                        selectedValue={selectedSubject}
                                        onValueChange={(value) => setSelectedSubject(value)}
                                    >
                                        {subjects.map((subject) => (
                                            <Select.Item key={subject} label={subjectMapping[subject]} value={subject} />
                                        ))}
                                    </Select>
                                </Box>

                                {/* Prompt */}
                                <Box>
                                    <Text fontSize="sm" color="#2a4a50" mb={1}>
                                        Prompt
                                    </Text>
                                    <TextArea
                                        h={32}
                                        placeholder="Beschreiben Sie Ihre Unterrichtsstunde mit mehr Kontext für die KI"
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
                                        <Text fontSize="sm" color="#2a4a50" mb={1}>
                                            Knowledge (optional)
                                        </Text>
                                        <VStack space={2} p={4} borderWidth={1} borderColor="gray.300" borderRadius="md" alignItems="center">
                                            <Text color="gray.400" fontSize="sm">
                                                Upload documents here
                                            </Text>

                                            <Button variant="default" onClick={() => document.getElementById('file-upload')?.click()}>
                                                Browse
                                            </Button>
                                            <input id="file-upload" type="file" hidden multiple onChange={handleFileChange} />
                                        </VStack>
                                    </Box>

                                    {/* Uploaded Files */}
                                    <Box flex={1} mt={4}>
                                        <Text fontSize="sm" color="#2a4a50" mb={1}>
                                            Uploaded Files (Max 3)
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
                                                Accept Terms and Conditions
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
                                                I have not entered any personal data in the text field and I am aware that Open AI may use it without European
                                                data protection standards. If someone asserts claims against Lern-Fair because I have no rights to the uploaded
                                                documents, I undertake to indemnify Lern-Fair.
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
                                        Reset
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
                                        <span className={loading ? 'invisible' : ''}>Generate Lesson Plan</span>
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
                                            Lesson Plan: {generatedPlan.title || ''}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            Grade: {generatedPlan.grade || ''}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            Subject: {generatedPlan.subject || ''}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            Duration: {generatedPlan.duration || ''}
                                        </Typography>
                                    </VStack>

                                    {/* Divider */}
                                    <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />

                                    {/* Learning Goals */}
                                    <VStack space={2} alignItems="flex-start" width="100%">
                                        <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                            Learning Goal:
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
                                                    Assessment:
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
                                                    Homework:
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
                                                    Resources:
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
                                                variant="default"
                                                size="default"
                                                className="bg-[#F7DB4D] hover:bg-[#F7DB4D] text-[#2A4A50]"
                                                onClick={copyOutputToClipboard}
                                            >
                                                Copy Output
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
