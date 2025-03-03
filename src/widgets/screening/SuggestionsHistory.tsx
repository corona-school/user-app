import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import { ReceivedScreeningSuggestions } from '@/types';
import { formatDate } from '@/Utility';

interface ScreeningSuggestionCardProps {
    suggestionsHistory: ReceivedScreeningSuggestions[];
}

export const SuggestionsHistory = ({ suggestionsHistory }: ScreeningSuggestionCardProps) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Empfehlung</TableHead>
                        <TableHead>Gesendet an</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {suggestionsHistory.map((e) => (
                        <TableRow>
                            <TableCell>{e.notification.description.replace(/SuS Empfehlung|HuH Empfehlung/, '')}</TableCell>
                            <TableCell>{formatDate(e.sentAt)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
