export enum ACTION {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  SHARED = 'shared',
}

export enum SUBJECT {
  VEHICLE = 'vehicle',
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

export type ChangelogPayload = CreatedLog | DeletedLog | SharedLog | UpdatedLog;
export type ChangelogPayloadWithUser = ChangelogPayload & { user: string };
