export type ChangelogRaw = {
  id: string;
  dateCreated: string;
  userId: string;
  description: string;
};

export type VehicleChangelogRaw = ChangelogRaw & {
  vehicleId: string;
};

export type Changelog = {
  id: string;
  dateCreated: Date;
  userId: string;
  description: string;
};

export type VehicleChangelog = Changelog & {
  vehicleId: string;
};

export type ChangelogResponseRaw = {
  changelog: ChangelogRaw[];
  vehicleChangelog: VehicleChangelogRaw[];
};
