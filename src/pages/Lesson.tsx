import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Checkbox } from '@/components/Checkbox';
import { cn } from '@/lib/Tailwind';

import { Box, VStack, HStack, Text, Select, TextArea, ScrollView } from 'native-base';
import WithNavigation from '@/components/WithNavigation';
import { Typography } from '@/components/Typography';

import { useTranslation } from 'react-i18next';
import INFOICON from '../assets/icons/lernfair/lesson/info_icon.svg';

import { gql } from './../gql';
import { useMutation } from '@apollo/client';

interface LessonPlanOutput {
    title: string;
    grade: string;
    subject: string;
    subtopic: string;
    duration: string;
    learningGoals: string[];
    agenda: {
        title: string;
        content: string[];
    }[];
}

const Lesson: React.FC = () => {
    const { t } = useTranslation();

    const [generatedPlan, setGeneratedPlan] = useState<LessonPlanOutput | null>(null);
    const copyOutputToClipboard = () => {
        if (generatedPlan) {
            const outputText = `
                Lesson Plan: ${generatedPlan.title}
                Grade: ${generatedPlan.grade}
                Subject: ${generatedPlan.subject}
                Subtopic: ${generatedPlan.subtopic}
                Duration: ${generatedPlan.duration}
    
                Learning Goal:
                By the end of the lesson, students will be able to:
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
            `;

            navigator.clipboard
                .writeText(outputText)
                .then(() => {
                    // Optional: Add a success notification
                    console.log('Content copied!');
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                });
        }
    };

    const exampleOutput: LessonPlanOutput = {
        title: 'Exploring the Solar System',
        grade: '6th Grade',
        subject: 'Science',
        subtopic: 'Solar System',
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
    };

    // Add this dummy mutation hook using exampleOutput
    const [generateLessonPlan] = useState(() => async () => {
        return {
            data: {
                generateLessonPlan: exampleOutput,
            },
        };
    });

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [prompt, setPrompt] = useState('');
    const [showError, setShowError] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // limit to 3
            const newFiles = [...uploadedFiles, ...files].slice(0, 3);
            setUploadedFiles(newFiles);
        }
    };

    const resetForm = () => {
        setSelectedSubject('');
        setPrompt('');
        setUploadedFiles([]);
    };

    const handleGenerate = async () => {
        if (!selectedSubject) {
            // Handle subject selection error
            return;
        }

        if (!termsAccepted) {
            setShowError(true);
            return;
        }

        try {
            const { data } = await generateLessonPlan();
            if (data?.generateLessonPlan) {
                setGeneratedPlan(data.generateLessonPlan);
            }
        } catch (error) {
            console.error('Error:', error);
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
                                        Select Subject<Text color="red.500">*</Text>
                                    </Text>
                                    <Select
                                        placeholder="Select a subject"
                                        borderColor="gray.300"
                                        selectedValue={selectedSubject}
                                        onValueChange={(value) => setSelectedSubject(value)}
                                    >
                                        <Select.Item label="Science" value="science" />
                                        <Select.Item label="Mathematics" value="mathematics" />
                                        <Select.Item label="English" value="english" />
                                    </Select>
                                </Box>

                                {/* Prompt */}
                                <Box>
                                    <Text fontSize="sm" color="#2a4a50" mb={1}>
                                        Prompt
                                    </Text>
                                    <TextArea
                                        h={32}
                                        placeholder="Describe your lesson by adding more context for the AI"
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
                                                    space={2}
                                                >
                                                    <Text fontSize="xs">{file.name}</Text>
                                                    <Text fontSize="xs" color="gray.500">
                                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </Text>
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
                                            className="mt-1 flex-shrink-0" // Added flex-shrink-0 to prevent checkbox from shrinking
                                        />
                                        <VStack space={1} flex={1}>
                                            {' '}
                                            {/* Added flex={1} to make it take remaining space */}
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
                                        disabled={!termsAccepted}
                                        className={cn('bg-[#F7DB4D] text-[#2A4A50]', !termsAccepted && 'opacity-50 bg-[#E5E7EB] cursor-not-allowed')}
                                    >
                                        Generate Lesson Plan
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>

                        {/* Divider */}
                        {/*Right Section */}
                        <Box w="573px" bg="white" p={6} borderRadius="sm" borderWidth={1} borderColor="gray.200">
                            {generatedPlan && (
                                <VStack space={4} alignItems="flex-start">
                                    {/* Title and Details */}
                                    <VStack space={2} alignItems="flex-start">
                                        <Typography variant="h4" className="text-[#0F172A] font-normal">
                                            Lesson Plan: {generatedPlan.title}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            Grade: {generatedPlan.grade}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            Subject: {generatedPlan.subject}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            Subtopic: {generatedPlan.subtopic}
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] font-normal">
                                            Duration: {generatedPlan.duration}
                                        </Typography>
                                    </VStack>

                                    {/* Divider */}
                                    <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />

                                    {/* Learning Goals */}
                                    <VStack space={2} alignItems="flex-start" width="100%">
                                        <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                            Learning Goal:
                                        </Typography>
                                        <Typography variant="h6" className="text-[#0F172A] text-base font-normal leading-[34px]">
                                            By the end of the lesson, students will be able to:
                                        </Typography>
                                        {generatedPlan.learningGoals.map((goal, index) => (
                                            <Typography key={index} variant="h6" className="text-[#0F172A] text-base font-normal leading-[26px]">
                                                {goal}
                                            </Typography>
                                        ))}
                                    </VStack>

                                    {/* Divider */}
                                    <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />

                                    {/* Agenda */}
                                    {generatedPlan.agenda.map((section, index) => (
                                        <VStack key={index} space={2} alignItems="flex-start" width="100%">
                                            <Typography variant="h4" className="text-[#0F172A] text-base font-bold leading-[34px]">
                                                {section.title}
                                            </Typography>
                                            {section.content.map((item, itemIndex) => (
                                                <Typography key={itemIndex} variant="h6" className="text-[#0F172A] text-base font-normal leading-[26px]">
                                                    {item}
                                                </Typography>
                                            ))}
                                            {index < generatedPlan.agenda.length - 1 && (
                                                <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" my={4} />
                                            )}
                                        </VStack>
                                    ))}

                                    {/* Divider */}
                                    <Box alignSelf="stretch" flex={1} borderWidth={1} borderColor="#ECF0F3" />

                                    {/* Copy Output Button */}
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
