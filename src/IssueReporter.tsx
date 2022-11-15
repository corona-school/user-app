import { gql, useMutation } from "@apollo/client";
import { AlertDialog, Button } from "native-base";
import React, { ErrorInfo, useRef, useState } from "react";
import useApollo from "./hooks/useApollo";
import AlertMessage from "./widgets/AlertMessage";

// c.f. https://reactjs.org/docs/error-boundaries.html
type ErrorBoundaryProps = React.PropsWithChildren<{ onError: (error: Error, errorInfo: ErrorInfo) => void }>;
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
    }
  
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ error, errorInfo });
    }

    render() {
      return this.props.children; 
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
    
    const closeRef = useRef(null);

    return <ErrorBoundary onError={reportIssue}>
        <AlertDialog isOpen={!!issue} onClose={() => setIssue(null)} leastDestructiveRef={closeRef}>
            <AlertDialog.Content>
                <AlertDialog.Header>

                </AlertDialog.Header>
                <AlertDialog.Body>

                </AlertDialog.Body>
                <AlertDialog.Footer>
                    <Button.Group space={2}>
                        <Button colorScheme="blue" onPress={contactSupport} ref={closeRef}>
                            Cancel
                        </Button>
                        <Button variant="unstyled" colorScheme="coolGray" onPress={() => setIssue(null)}>
                            Trotzdem fortfahren
                        </Button>
                    </Button.Group>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
        {children}
    </ErrorBoundary>;
}