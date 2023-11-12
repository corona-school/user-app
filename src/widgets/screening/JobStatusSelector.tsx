import { EnumSelector } from '../../components/EnumSelector';
import { Screening_Jobstatus_Enum } from '../../gql/graphql';

export const JobStatusSelector = EnumSelector(Screening_Jobstatus_Enum, (k) => `job_status.${k}`);
