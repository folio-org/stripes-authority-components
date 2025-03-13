import { headingTypesValues } from './headingTypesValues';
import { searchableIndexesValues } from './searchableIndexesValues';

export const browseHeadingTypesMap = {
  [searchableIndexesValues.PERSONAL_NAME]: [
    headingTypesValues.PERSONAL_NAME,
  ],
  [searchableIndexesValues.CORPORATE_CONFERENCE_NAME]: [
    headingTypesValues.CONFERENCE_NAME,
    headingTypesValues.CORPORATE_NAME,
  ],
  [searchableIndexesValues.GEOGRAPHIC_NAME]: [
    headingTypesValues.GEOGRAPHIC_NAME,
  ],
  [searchableIndexesValues.NAME_TITLE]: [
    headingTypesValues.CONFERENCE_NAME,
    headingTypesValues.CORPORATE_NAME,
    headingTypesValues.PERSONAL_NAME,
  ],
  [searchableIndexesValues.UNIFORM_TITLE]: [
    headingTypesValues.UNIFORM_TITLE,
  ],
  [searchableIndexesValues.SUBJECT]: [
    headingTypesValues.TOPICAL,
    headingTypesValues.NAMED_EVENT,
    headingTypesValues.GENERAL_SUBDIVISION,
    headingTypesValues.CHRON_TERM,
    headingTypesValues.MEDIUM_PERF_TERM,
    headingTypesValues.GEOGRAPHIC_SUBDIVISION,
    headingTypesValues.CHRON_SUBDIVISION,
    headingTypesValues.FORM_SUBDIVISION,
  ],
  [searchableIndexesValues.GENRE]: [
    headingTypesValues.GENRE,
  ],
};
