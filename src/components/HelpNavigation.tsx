import { Button } from 'native-base';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LFHelpIcon from '../assets/icons/lernfair/lf-question.svg';

const HelpNavigation: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Button onPress={() => navigate('/hilfebereich')} variant="ghost">
            <LFHelpIcon fill={'white'} />
        </Button>
    );
};

export default HelpNavigation;
