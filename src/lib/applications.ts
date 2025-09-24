
export type ApplicationStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Interview';

export type Application = {
  id: string;
  name: string;
  discordTag: string;
  email: string;
  steamUrl: string;
  truckersmpUrl?: string;
  experience: 'fresher' | 'experienced';
  howYouFound: 'truckersmp' | 'friends' | 'others';
  friendsMention?: string;
  othersMention?: string;
  status: ApplicationStatus;
  submittedAt: string;
};

export type ApplicationsData = {
  applications: Application[];
};
