
'use client';

import { useTransition, useState } from 'react';
import { updateApplicationStatus as updateStatusAction } from './server-actions';
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
