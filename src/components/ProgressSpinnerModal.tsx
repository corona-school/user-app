import { Modal, Spinner, Text } from 'native-base';

// Shows an overlay spinner to block the page while something is loading
export function ProgressSpinnerModal({ title, description }: { title: string; description: string }) {
    return (
        <Modal isOpen>
            <Modal.Content>
                <Modal.Header>
                    <Text bold>{title}</Text>
                </Modal.Header>
                <Modal.Body display="flex" flexDirection="row">
                    <Text flexGrow="1">{description}</Text>

                    <Spinner />
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
