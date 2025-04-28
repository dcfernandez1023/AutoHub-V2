export enum ACTION {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  SHARED = 'shared',
  APPLIED = 'applied',
}

export enum SUBJECT {
  VEHICLE = 'vehicle',
  SCHEDULED_SERVICE_TYPE = 'scheduled service type(s)',
  SCHEDULED_SERVICE_INSTANCE = 'scheduled service instance(s)',
  SCHEDULED_LOG = 'scheduled log',
  REPAIR_LOG = 'repair log',
}

export type UpdatedProperty = {
  property: string;
  value: string;
};

// Base fields common to all actions
type BaseChangelog = {
  action: ACTION;
  subject: SUBJECT;
  subjectName: string;
};

type CreatedLog = BaseChangelog & {
  action: ACTION.CREATED;
};

type DeletedLog = BaseChangelog & {
  action: ACTION.DELETED;
};

type SharedLog = BaseChangelog & {
  action: ACTION.SHARED;
  targetName: string; // required only for SHARED
};

type UpdatedLog = BaseChangelog & {
  action: ACTION.UPDATED;
  updatedProperties: UpdatedProperty[]; // required only for UPDATED
};

type AppliedLog = BaseChangelog & {
  action: ACTION.APPLIED;
  targetName: string; // required only for APPLIED
};

export type ChangelogPayload = CreatedLog | DeletedLog | SharedLog | UpdatedLog | AppliedLog;
export type ChangelogPayloadWithUser = ChangelogPayload & { user: string };
