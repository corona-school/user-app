import { Student_Jobstatus_Enum } from '@/gql/graphql';
import { EnumSelector } from '../../components/EnumSelector';

export const JobStatusSelector = EnumSelector(Student_Jobstatus_Enum, (k) => `job_status.${k}`);
