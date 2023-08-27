// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql } from '../../src/gql';
import { ZoomMtg } from '@zoomus/websdk';
import { useParams } from 'react-router-dom';
import CenterLoadingSpinner from './CenterLoadingSpinner';
import { useEffect } from 'react';
import { ZOOM_MEETING_SDK_KEY } from '../config';
import { useQuery } from '@apollo/client';
import { log } from '../log';

enum ZoomMeetingRole {
    Host = 1,
    Participant = 0,
}

const getappointmentMeetingData = gql(`
query appointmentMeetingData($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        zoomMeetingId
        isOrganizer
        isParticipant
    }
}`);

const getZoomCredentialsOrganizer = gql(`
query zoomCredentialsOrganizer($meetingId: String!, $role: Float!) {
    me {
        firstname
        lastname
        email
        zoomZAK
        zoomSDKJWT (meetingId: $meetingId, role: $role)
    }
}`);

const getZoomCredentialsParticipant = gql(`
query zoomCredentialsParticipant($meetingId: String!, $role: Float!) {
    me {
        firstname
        lastname
        email
        zoomSDKJWT (meetingId: $meetingId, role: $role)
    }
}`);

export function removeZoomStyles() {
    document.getElementById('zmmtg-root')!.style.display = 'none';
}

const ZoomMeeting: React.FC = () => {
    const { id, type } = useParams();

    if (!id) {
        throw new Error('No appointment id provided');
    }

    const appointmentId = parseInt(id);

    const leaveUrl = type === 'match' ? `/left-chat/${appointmentId}/match` : `/left-chat/${appointmentId}/course`;

    const { data: appointmentMeetingData, loading: isLoadingAppointmentData } = useQuery(getappointmentMeetingData, {
        variables: { appointmentId: appointmentId },
    });

    const meetingId = appointmentMeetingData?.appointment.zoomMeetingId;

    if (!isLoadingAppointmentData && !meetingId) throw new Error('No meeting id provided in ZoomMeeting component');

    const { data: zoomDataOrganizer, loading: isLoadingOrganizerData } = useQuery(getZoomCredentialsOrganizer, {
        variables: { meetingId: meetingId!, role: ZoomMeetingRole.Host },
        skip: !meetingId || isLoadingAppointmentData || !appointmentMeetingData.appointment.isOrganizer,
    });

    const { data: zoomDataParticipant, loading: isLoadingParticipantData } = useQuery(getZoomCredentialsParticipant, {
        variables: { meetingId: meetingId!, role: ZoomMeetingRole.Participant },
        skip: !meetingId || isLoadingAppointmentData || !appointmentMeetingData.appointment.isParticipant,
    });

    useEffect(() => {
        const handlePopState = () => {
            window.location.reload();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            removeZoomStyles();
        };
    }, []);

    useEffect(() => {
        if (!zoomDataOrganizer && !zoomDataParticipant) return;

        if (!meetingId) throw new Error('No meeting id provided');

        document.getElementById('zmmtg-root')!.style.display = 'block';

        ZoomMtg.setZoomJSLib('https://source.zoom.us/2.14.0/lib', '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        ZoomMtg.i18n.load('de-DE');
        ZoomMtg.i18n.reload('de-DE');

        if (
            (appointmentMeetingData.appointment.isOrganizer && !zoomDataOrganizer?.me.zoomSDKJWT) ||
            (appointmentMeetingData.appointment.isParticipant && !zoomDataParticipant?.me.zoomSDKJWT)
        ) {
            throw new Error('No JWT provided');
        }

        const me = (zoomDataOrganizer ?? zoomDataParticipant)?.me;

        const credentials = {
            authEndpoint: '',
            sdkKey: ZOOM_MEETING_SDK_KEY,
            password: '',
            meetingNumber: meetingId,
            signature: me?.zoomSDKJWT,
            userEmail: me?.email,
            userName: me?.firstname,
            leaveUrl: leaveUrl,
            role: appointmentMeetingData?.appointment.isOrganizer ? ZoomMeetingRole.Host : ZoomMeetingRole.Participant,
            ...(appointmentMeetingData.appointment.isOrganizer ? { zak: zoomDataOrganizer?.me.zoomZAK } : {}),
        };

        ZoomMtg.init({
            leaveUrl: credentials.leaveUrl,
            success: () => {
                ZoomMtg.join({
                    signature: credentials.signature!,
                    sdkKey: credentials.sdkKey,
                    meetingNumber: credentials.meetingNumber,
                    passWord: '',
                    userName: credentials.userName || '',
                    userEmail: credentials.userEmail,
                    zak: credentials.zak,
                    success: () => log('Zoom', 'User joined Zoom meeting successfully'),
                    error: (error: Error) => undefined,
                });
            },
        });
    }, [zoomDataParticipant, zoomDataOrganizer, meetingId, appointmentMeetingData, leaveUrl, isLoadingOrganizerData, isLoadingParticipantData]);

    if (!zoomDataParticipant || !zoomDataOrganizer) return <CenterLoadingSpinner />;

    return null;
};

export default ZoomMeeting;
