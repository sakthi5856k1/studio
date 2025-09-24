
'use client';

import { useTransition } from 'react';
import { updateApplicationStatus as updateStatusAction } from './server-actions';
import type { ApplicationStatus } from '@/lib/applications';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
    Accepted: { icon: <CheckCircle className="mr-2 h-4 w-4" />, label: 'Accept', className: 'text-green-500' },
    Rejected: { icon: <XCircle className="mr-2 h-4 w-4" />, label: 'Reject', className: 'text-red-500' },
    Interview: { icon: <AlertCircle className="mr-2 h-4 w-4" />, label: 'Mark for Interview', className: 'text-blue-500' },
    Pending: { icon: <div/>, label: 'Pending', className: ''}
};


export function UpdateApplicationStatus({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const config = statusConfig[status];

  const handleUpdate = () => {
    startTransition(async () => {
      const result = await updateStatusAction(applicationId, status);
      if (result.success) {
        toast({ title: 'Success', description: 'Application status updated.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleUpdate}
      disabled={isPending}
      className={config.className}
      onSelect={(e) => e.preventDefault()}
    >
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : config.icon}
      {config.label}
    </DropdownMenuItem>
  );
}
