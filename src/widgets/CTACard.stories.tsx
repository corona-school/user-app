import { Text, Button } from 'native-base';
import CTACard from './CTACard';
import BooksIcon from '../assets/icons/lernfair/lf-books.svg';

export default {
    title: 'Molecules/CTACard',
    component: CTACard,
};

export const CtaCard = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: 10,
            }}
        >
            <CTACard
                title={'Empfiehl Lern-Fair deinen Freunden'}
                content={
                    <Text>
                        Du stehst hinter der Mission von Lern-Fair für mehr Bildungsgerechtigkeit in Deutschland? Dann erzähle deinen Freunden von Lern-Fair und
                        lass uns gemeinsam noch mehr benachteiligten Kindern und Jugendlichen helfen.
                    </Text>
                }
                button={<Button>Jetzt empfehlen</Button>}
                icon={<BooksIcon />}
            />
            <CTACard
                title={'Empfiehl Lern-Fair deinen Freunden'}
                content={
                    <Text>
                        Du stehst hinter der Mission von Lern-Fair für mehr Bildungsgerechtigkeit in Deutschland? Dann erzähle deinen Freunden von Lern-Fair und
                        lass uns gemeinsam noch mehr benachteiligten Kindern und Jugendlichen helfen.
                    </Text>
                }
                button={<Button>Jetzt empfehlen</Button>}
                variant="dark"
            />
            <CTACard
                title={'Empfiehl Lern-Fair deinen Freunden'}
                content={
                    <Text>
                        Du stehst hinter der Mission von Lern-Fair für mehr Bildungsgerechtigkeit in Deutschland? Dann erzähle deinen Freunden von Lern-Fair und
                        lass uns gemeinsam noch mehr benachteiligten Kindern und Jugendlichen helfen.
                    </Text>
                }
                button={<Button>Jetzt empfehlen</Button>}
                variant="outline"
            />
        </div>
    ),

    name: 'CTACard',
};
