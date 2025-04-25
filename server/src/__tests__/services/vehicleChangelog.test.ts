import { formatChangelog } from '../../services/vehicleChangelogService';
import { ACTION, ChangelogPayloadWithUser, SUBJECT } from '../../types/changelog';

describe('vehicleChangelogService tests', () => {
  describe('formatChangelog', () => {
    test('can format changelog for SHARED action', () => {
      const mockChangelogPayload: ChangelogPayloadWithUser = {
        user: 'Mechanic 1',
        action: ACTION.SHARED,
        subject: SUBJECT.VEHICLE,
        subjectName: '1990 Nissan Pathfinder',
        targetName: 'Mechanic 2',
      };

      const actual = formatChangelog(mockChangelogPayload);
      const expected = 'Mechanic 1 shared vehicle 1990 Nissan Pathfinder with Mechanic 2';

      expect(actual).toEqual(expected);
    });

    test('can format changelog for UPDATED action', () => {
      const mockChangelogPayload: ChangelogPayloadWithUser = {
        user: 'Mechanic 1',
        action: ACTION.UPDATED,
        subject: SUBJECT.VEHICLE,
        subjectName: '1990 Nissan Pathfinder',
        updatedProperties: [
          { property: 'name', value: '1990 Nissan Pathfinder (Red)' },
          { property: 'mileage', value: '300000' },
        ],
      };

      const actual = formatChangelog(mockChangelogPayload);
      const expected =
        'Mechanic 1 updated vehicle 1990 Nissan Pathfinder. Updated values = name: 1990 Nissan Pathfinder (Red), mileage: 300000';

      expect(actual).toEqual(expected);
    });

    test('can format changelog for UPDATED action with 1 property updated', () => {
      const mockChangelogPayload: ChangelogPayloadWithUser = {
        user: 'Mechanic 1',
        action: ACTION.UPDATED,
        subject: SUBJECT.VEHICLE,
        subjectName: '1990 Nissan Pathfinder',
        updatedProperties: [{ property: 'name', value: '1990 Nissan Pathfinder (Red)' }],
      };

      const actual = formatChangelog(mockChangelogPayload);
      const expected =
        'Mechanic 1 updated vehicle 1990 Nissan Pathfinder. Updated values = name: 1990 Nissan Pathfinder (Red)';

      expect(actual).toEqual(expected);
    });

    test('can format changelog for UPDATED action with no properties updated', () => {
      const mockChangelogPayload: ChangelogPayloadWithUser = {
        user: 'Mechanic 1',
        action: ACTION.UPDATED,
        subject: SUBJECT.VEHICLE,
        subjectName: '1990 Nissan Pathfinder',
        updatedProperties: [],
      };

      const actual = formatChangelog(mockChangelogPayload);
      const expected = 'Mechanic 1 updated vehicle 1990 Nissan Pathfinder';

      expect(actual).toEqual(expected);
    });

    test('can format changelog for UPDATED action with undefined properties', () => {
      const mockChangelogPayload: ChangelogPayloadWithUser = {
        user: 'Mechanic 1',
        action: ACTION.UPDATED,
        subject: SUBJECT.VEHICLE,
        subjectName: '1990 Nissan Pathfinder',
        // @ts-ignore
        updatedProperties: undefined,
      };

      const actual = formatChangelog(mockChangelogPayload);
      const expected = 'Mechanic 1 updated vehicle 1990 Nissan Pathfinder';

      expect(actual).toEqual(expected);
    });

    test('can format changelog for DELETED action with undefined properties', () => {
      const mockChangelogPayload: ChangelogPayloadWithUser = {
        user: 'Mechanic 1',
        action: ACTION.DELETED,
        subject: SUBJECT.VEHICLE,
        subjectName: '1990 Nissan Pathfinder',
      };

      const actual = formatChangelog(mockChangelogPayload);
      const expected = 'Mechanic 1 deleted vehicle 1990 Nissan Pathfinder';

      expect(actual).toEqual(expected);
    });

    test('can format changelog for CREATED action with undefined properties', () => {
      const mockChangelogPayload: ChangelogPayloadWithUser = {
        user: 'Mechanic 1',
        action: ACTION.CREATED,
        subject: SUBJECT.VEHICLE,
        subjectName: '1990 Nissan Pathfinder',
      };

      const actual = formatChangelog(mockChangelogPayload);
      const expected = 'Mechanic 1 created vehicle 1990 Nissan Pathfinder';

      expect(actual).toEqual(expected);
    });
  });
});
