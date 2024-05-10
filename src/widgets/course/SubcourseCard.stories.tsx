// @ts-nocheck
import { SubcourseCard } from './SubcourseCard';

export default {
    title: 'Organisms/Courses/SubcourseCard',
    component: SubcourseCard,
};

export const SubcourseCardBasic = {
    render: () => (
        <SubcourseCard
            subcourse={{
                id: 10,

                course: {
                    name: 'Ein Beispielkurs',
                    image: 'https://uploads-ssl.webflow.com/63906379538296472e0ae3d2/6429d27f5fbce260dd6a53f5_marten-bjork-rH8O0FHFpfw-unsplash.jpg',

                    tags: [
                        {
                            name: 'Englisch',
                        },
                    ],
                },

                nextLecture: null,
            }}
        />
    ),

    name: 'SubcourseCard / basic',
};

export const SubcourseCardNextLecture = {
    render: () => (
        <SubcourseCard
            subcourse={{
                id: 10,

                course: {
                    name: 'Ein Beispielkurs',
                    image: 'https://uploads-ssl.webflow.com/63906379538296472e0ae3d2/6429d27f5fbce260dd6a53f5_marten-bjork-rH8O0FHFpfw-unsplash.jpg',

                    tags: [
                        {
                            name: 'Deutsch',
                        },
                    ],
                },

                nextLecture: {
                    start: new Date().toISOString(),
                    duration: 60,
                },
            }}
        />
    ),

    name: 'SubcourseCard / next-lecture',
};
