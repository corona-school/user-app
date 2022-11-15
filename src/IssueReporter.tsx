import { gql, useMutation } from "@apollo/client";
import { AlertDialog, Button } from "native-base";
import React, { ErrorInfo, useEffect, useRef, useState } from "react";
import useApollo from "./hooks/useApollo";
import AlertMessage from "./widgets/AlertMessage";

// c.f. https://reactjs.org/docs/error-boundaries.html
type ErrorBoundaryProps = React.PropsWithChildren<{ onError: (error: Error, errorInfo: ErrorInfo) => void }>;
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state = { hasError: false };

    constructor(props: ErrorBoundaryProps) {
      super(props);
    }
  
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.onError(error, errorInfo);
        this.setState({ hasError: true });
    }

    render() {
      if (!this.state.hasError)
        return this.props.children;
      return null;
    }
}

export function IssueReporter({ children }: React.PropsWithChildren<{}>) {
    const { client } = useApollo();
    const [issue, setIssue] = useState<string | null>(null);

    const [reportToBackend] = useMutation(gql`
        mutation ReportIssue($userAgent: String!, $logs: [String!]!, $stack: String!, $message: String!, $issueTag: String!) { 
	        userReportIssue(userAgent: $userAgent logs: $logs errorStack: $stack, errorMessage: $message issueTag: $issueTag)
        }
    `);

    function reportIssue(error: Error, errorInfo: ErrorInfo) {
        if (issue) return; // Only return the first error occuring

        const issueTag = Date.now().toString(36);

        reportToBackend({
            variables: {
                issueTag,
                userAgent: window.navigator.userAgent,
                logs: [],
                stack: `Error Stack:\n${error.stack}\n\nReact Stack:\n${errorInfo.componentStack}`,
                message: error.message,
            }
        });

        setIssue(issueTag);
    }

    function contactSupport() {
        window.open(`mailto:support@lern-fair.de?subject=Tech-Issue ${issue}`, '_blank');
    }
    
    useEffect(() => {
        const errorHandler = (event: ErrorEvent) => { reportIssue(event.error, { componentStack: "unknown error" }); return true };
        const unhandledHandler = (event: PromiseRejectionEvent) => { reportIssue(event.reason, { componentStack: "unhandled rejection"}); return true };

        window.addEventListener('error', errorHandler);
        window.addEventListener('unhandledrejection', unhandledHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
            window.removeEventListener('unhandledrejection', unhandledHandler);
        };
    }, []);

    const closeRef = useRef(null);

    return <>
        <AlertDialog isOpen={!!issue} onClose={() => setIssue(null)} leastDestructiveRef={closeRef}>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        Ein Fehler ist aufgetreten
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                        Sorry, das sollte nicht passieren. Das Tech-Team wurde informiert und kümmert sich um den Fehler.
                        Solltest du Fragen haben, kontaktiere den Support
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button colorScheme="blue" onPress={contactSupport} ref={closeRef}>
                                Support kontaktieren
                            </Button>
                            <Button variant="unstyled" colorScheme="coolGray" onPress={() => setIssue(null)}>
                                Trotzdem fortfahren
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
            <ErrorBoundary onError={reportIssue}>
                {children}
            </ErrorBoundary>
    </>;
}