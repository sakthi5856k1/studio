
export type StaffMember = {
  id: string;
  name: string;
  role: string;
  imageId: string;
  imageUrl?: string;
  steamUrl?: string;
  truckersmpUrl?: string;
};

export type StaffData = {
  staffMembers: StaffMember[];
};
