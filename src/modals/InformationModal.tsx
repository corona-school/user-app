import { Box, Heading, Modal } from 'native-base';

type InformationModalProps = {
    title: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

const InformationModal = ({ title, children, isOpen, onClose }: InformationModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content width="307px" marginX="auto" backgroundColor="transparent">
                <Modal.Header borderBottomWidth={0} backgroundColor="white">
                    <Modal.CloseButton />
                    <Heading maxWidth="330px" marginX="auto" fontSize="md" textAlign="center" color="primary.900">
                        {title}
                    </Heading>
                </Modal.Header>
                <Modal.Body background="white">
                    <Box>{children}</Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default InformationModal;
