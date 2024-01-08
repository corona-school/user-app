import { AlertDialog, Button } from 'native-base';
import React, { ErrorInfo, useRef, useState } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { useTranslation } from 'react-i18next';

// c.f. https://reactjs.org/docs/error-boundaries.html
type ErrorBoundaryProps = React.PropsWithChildren<{ onError: (error: Error, errorInfo: ErrorInfo) => void }>;
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state = { hasError: false };

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.onError(error, errorInfo);
        this.setState({ hasError: true });
    }

    render() {
        if (!this.state.hasError) return this.props.children;
        return null;
    }
}

export function IssueReporter({ children }: React.PropsWithChildren<{}>) {
    const { t } = useTranslation();

    const [hasIssue, setIssue] = useState(false);

    function contactSupport() {
        const sessionID = datadogRum.getInternalContext()?.session_id ?? '-';
        window.open(`mailto:support@lern-fair.de?subject=Tech-Issue&body=SessionID: ${sessionID}`, '_blank');
    }

    const closeRef = useRef(null);

    return (
        <>
            <AlertDialog isOpen={hasIssue} onClose={() => window.location.reload()} leastDestructiveRef={closeRef}>
                <AlertDialog.Content>
                    <AlertDialog.Header>{t('issueReporter.title')}</AlertDialog.Header>
                    <AlertDialog.Body>{t('issueReporter.subtitle')}</AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group direction="column" space={2}>
                            <Button colorScheme="blue" onPress={contactSupport} ref={closeRef}>
                                {t('issueReporter.contactSupport')}
                            </Button>
                            <Button variant="unstyled" colorScheme="coolGray" onPress={() => window.location.reload()}>
                                {t('issueReporter.continue')}
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
            <ErrorBoundary onError={() => setIssue(true)}>{children}</ErrorBoundary>
        </>
    );
}
