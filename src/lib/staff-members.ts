
export type StaffMember = {
  id: string;
  name: string;
  role: string;
  imageId: string;
};

export type StaffData = {
  staffMembers: StaffMember[];
};
