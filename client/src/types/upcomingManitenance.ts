export type UpcomingMaintenance = {
  userId: string;
  lastScheduledLogId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleMileage: number;
  scheduledServiceTypeId: string;
  scheduledServiceTypeName: string;
  scheduledServiceInstanceId: string;
  scheduledServiceInstanceTimeInterval: number;
  scheduledServiceInstanceTimeUnits: string;
  scheduledServiceInstanceMileInterval: number;
  scheduledLogLastDatePerformed: Date;
  scheduledLogLastMileagePerformed: number;
  mileageDue: number;
  dateDue: Date;
  isOverdue: boolean;
  overdueReason?: 'MILEAGE_OVERDUE' | 'DATE_OVERDUE' | 'OVERDUE';
};
