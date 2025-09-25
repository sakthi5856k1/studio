
'use client';

import { useTransition, useState } from 'react';
import { updateApplicationStatus as updateStatusAction, updateBookingStatus as updateBookingAction } from './server-actions';
import type { ApplicationStatus } from '@/lib/applications';
import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roleOptions = [
    'Managing Director', 'Marketing Executive', 'Human Resource Staff', 'Trainer',
    'Event Staff', 'Event Organizer', 'Media Staff', 'Media Editor',
    'Senior Driver', 'Driver', 'Trainee'
];

const statusConfig = {
    Accepted: { icon: <CheckCircle className="mr-2 h-4 w-4" />, label: 'Accept', className: 'text-green-500' },
    Rejected: { icon: <XCircle className="mr-2 h-4 w-4" />, label: 'Reject', className: 'text-red-500' },
    Interview: { icon: <AlertCircle className="mr-2 h-4 w-4" />, label: 'Mark for Interview', className: 'text-blue-500' },
    Pending: { icon: <div/>, label: 'Pending', className: ''}
};


export function UpdateApplicationStatus({
  applicationId,
  status,
  currentStatus,
}: {
  applicationId: string;
  status: ApplicationStatus;
  currentStatus: ApplicationStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState('Trainee');
  const { toast } = useToast();
  const config = statusConfig[status];

  const handleUpdate = (role?: string) => {
    startTransition(async () => {
      const result = await updateStatusAction(applicationId, status, role);
      if (result.success) {
        toast({ title: 'Success', description: 'Application status updated.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };
  
  const isDisabled = isPending || currentStatus === status;


  if (status === 'Accepted') {
    return (
       <DropdownMenuSub>
        <DropdownMenuSubTrigger
          disabled={isDisabled}
          className={config.className}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : config.icon}
          {config.label}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                    {roleOptions.map((role) => (
                        <DropdownMenuRadioItem key={role} value={role}>
                            {role}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuItem
                    onClick={() => handleUpdate(selectedRole)}
                    className="mt-2 justify-center bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground"
                >
                    Confirm Acceptance
                </DropdownMenuItem>
            </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }


  return (
    <DropdownMenuItem
      onClick={() => handleUpdate()}
      disabled={isDisabled}
      className={config.className}
      onSelect={(e) => e.preventDefault()}
    >
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : config.icon}
      {config.label}
    </DropdownMenuItem>
  );
}

export function UpdateBookingStatus({
    eventId,
    areaId,
    bookingId,
    newStatus,
}: {
    eventId: string;
    areaId: string;
    bookingId: string;
    newStatus: 'approved' | 'rejected';
}) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const isApproval = newStatus === 'approved';
    const icon = isApproval ? <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> : <XCircle className="mr-2 h-4 w-4 text-red-500" />;
    const label = isApproval ? 'Approve' : 'Reject';
    const className = isApproval ? 'text-green-500' : 'text-red-500';

    const handleUpdate = () => {
        startTransition(async () => {
            const result = await updateBookingAction(eventId, areaId, bookingId, newStatus);
            if (result.success) {
                toast({ title: 'Success', description: result.message });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.message });
            }
        });
    };

    return (
        <DropdownMenuItem
            onClick={handleUpdate}
            disabled={isPending}
            className={className}
            onSelect={(e) => e.preventDefault()}
        >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon}
            {label}
        </DropdownMenuItem>
    );
}
