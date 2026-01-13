# Change history for stripes-authority-components

## [7.0.0] (IN PROGRESS)

- [UISAUTCOMP-151](https://folio-org.atlassian.net/browse/UISAUTCOMP-151) `useUsers` hook - accept a `tenantId` argument.
- [UISAUTCOMP-155](https://folio-org.atlassian.net/browse/UISAUTCOMP-155) *BREAKING* Update for Split Search & Browse APIs.
- [UISAUTCOMP-157](https://folio-org.atlassian.net/browse/UISAUTCOMP-157) Update Keyword and LCCN search options to search Cancelled LCCN index.
- [UISAUTCOMP-164](https://folio-org.atlassian.net/browse/UISAUTCOMP-164) Apply Heading/Ref sort by default.
- [UISAUTCOMP-167](https://folio-org.atlassian.net/browse/UISAUTCOMP-167) MARC authority filters typeahead uses "starts with" instead of "contains"

## [6.0.3] (https://github.com/folio-org/stripes-authority-components/tree/v6.0.3) (2025-09-17)

- [UISAUTCOMP-159](https://folio-org.atlassian.net/browse/UISAUTCOMP-159) Update Keyword and LCCN search options to search Cancelled LCCN index.

## [6.0.2] (https://github.com/folio-org/stripes-authority-components/tree/v6.0.2) (2025-06-02)

- [UISAUTCOMP-152](https://folio-org.atlassian.net/browse/UISAUTCOMP-152) `useAuthority` hook - use `expandAll=true` parameter to fetch authority metadata.

## [6.0.1] (https://github.com/folio-org/stripes-authority-components/tree/v6.0.1) (2025-04-09)

- [UISAUTCOMP-148](https://folio-org.atlassian.net/browse/UISAUTCOMP-148) Extend Subject search and browse to include all 1XX/4XX/5XX fields Subjects.

## [6.0.0] (https://github.com/folio-org/stripes-authority-components/tree/v6.0.0) (2025-03-13)

- [UISAUTCOMP-136](https://folio-org.atlassian.net/browse/UISAUTCOMP-136) Spitfire - migrate to shared CI workflows.
- [UISAUTCOMP-118](https://folio-org.atlassian.net/browse/UISAUTCOMP-118) React v19: refactor away from default props for functional components.
- [UISAUTCOMP-140](https://folio-org.atlassian.net/browse/UISAUTCOMP-140) Change query building process for Browse filters.
- [UISAUTCOMP-143](https://folio-org.atlassian.net/browse/UISAUTCOMP-143) Correct keyword search.
- [UISAUTCOMP-141](https://folio-org.atlassian.net/browse/UISAUTCOMP-141) *BREAKING* migrate stripes dependencies to their Sunflower versions.
- [UISAUTCOMP-142](https://folio-org.atlassian.net/browse/UISAUTCOMP-142) *BREAKING* migrate react-intl to v7.
- [UISAUTCOMP-144](https://folio-org.atlassian.net/browse/UISAUTCOMP-144) *BREAKING* Remove deprecated useUserTenantPermissions.
- [UISAUTCOMP-147](https://folio-org.atlassian.net/browse/UISAUTCOMP-147) Upgrade `browse` to `2.0`.

## [5.0.3] (https://github.com/folio-org/stripes-authority-components/tree/v5.0.3) (2024-12-27)

- [UISAUTCOMP-135](https://issues.folio.org/browse/UISAUTCOMP-135) `useAutoOpenDetailView` - block auto-open on mount if record id exists in URL.

## [5.0.2] (https://github.com/folio-org/stripes-authority-components/tree/v5.0.2) (2024-12-10)

- [UISAUTCOMP-133](https://issues.folio.org/browse/UISAUTCOMP-133) Handle uncaught error when a search request fails.

## [5.0.1] (https://github.com/folio-org/stripes-authority-components/tree/v5.0.1) (2024-11-14)

- [UISAUTCOMP-130](https://issues.folio.org/browse/UISAUTCOMP-130) Provide a prop to `<AcqDateRangeFilter>` to subscribe to search form resets.

## [5.0.0] (https://github.com/folio-org/stripes-authority-components/tree/v5.0.0) (2024-10-30)

- [UISAUTCOMP-117](https://issues.folio.org/browse/UISAUTCOMP-117) Provide deprecation notice to `useUserTenantPermissions.js`.
- [UISAUTCOMP-119](https://issues.folio.org/browse/UISAUTCOMP-119) Pass `source` with `failure` and `failureMessage` to the `SearchAndSortNoResultsMessage` component to display the correct message in the results if there is no permission to search records.
- [UISAUTCOMP-123](https://issues.folio.org/browse/UISAUTCOMP-123) Pass the `isCursorAtEnd` prop to the `TextArea` component.
- [UISAUTCOMP-124](https://issues.folio.org/browse/UISAUTCOMP-124) `SearchResultsList` - pass `sortDirection` and `showSortIndicator` props.
- [UISAUTCOMP-126](https://issues.folio.org/browse/UISAUTCOMP-126) Handle cases when `authRefType` is not defined in records.
- [UISAUTCOMP-127](https://issues.folio.org/browse/UISAUTCOMP-127) Change MARC authority search to "all" for full-text fields.
- *BREAKING* Upgrade `stripes-acq-components` to `6.0.0`.

## [4.0.1] (https://github.com/folio-org/stripes-authority-components/tree/v4.0.1) (2024-04-02)

- [UISAUTCOMP-111](https://issues.folio.org/browse/UISAUTCOMP-111) `useUsers` hook - add user ids to cache keys to fetch users when user ids change.
- [UISAUTCOMP-112](https://issues.folio.org/browse/UISAUTCOMP-112) Extend auto-open a record functionality.
- [UISAUTCOMP-113](https://issues.folio.org/browse/UISAUTCOMP-113) Re-position advanced search button when there is too little space in the search pane.

## [4.0.0] (https://github.com/folio-org/stripes-authority-components/tree/v4.0.0) (2024-03-21)

- [UISAUTCOMP-65](https://issues.folio.org/browse/UISAUTCOMP-65) Remove eslint deps that are already listed in eslint-config-stripes.
- [UISAUTCOMP-91](https://issues.folio.org/browse/UISAUTCOMP-91) Add LCCN search option.
- [UISAUTCOMP-92](https://issues.folio.org/browse/UISAUTCOMP-92) Search box/Browse box- Reset all should shift focus back to search box.
- [UISAUTCOMP-93](https://issues.folio.org/browse/UISAUTCOMP-93) Add new column called Authority source for browse and search results.
- [UISAUTCOMP-94](https://issues.folio.org/browse/UISAUTCOMP-94) MARC authority - Keyword search should search natural id.
- [UISAUTCOMP-97](https://issues.folio.org/browse/UISAUTCOMP-97) Add Search type dropdown to Advanced search modal.
- [UISAUTCOMP-98](https://issues.folio.org/browse/UISAUTCOMP-98) *BREAKING* Add authority-source-files interface.
- [UISAUTCOMP-101](https://issues.folio.org/browse/UISAUTCOMP-101) Counter values and options for "Authority source", "Thesaurus" facet options do not change when changing search parameters
- [UISAUTCOMP-106](https://issues.folio.org/browse/UISAUTCOMP-106) *BREAKING* Updated `useAuthoritySourceFiles` to provide mutation methods. Deleted `useTenantKy`.

## [3.0.2] (https://github.com/folio-org/stripes-authority-components/tree/v3.0.2) (2023-11-29)

- [UISAUTCOMP-95](https://issues.folio.org/browse/UISAUTCOMP-95) Use first page Browse query for facet requests.

## [3.0.1] (https://github.com/folio-org/stripes-authority-components/tree/v3.0.1) (2023-10-27)

- [UISAUTCOMP-87](https://issues.folio.org/browse/UISAUTCOMP-87) Highlight the Browse search list row after editing the 1xx field.
- [UISAUTCOMP-85](https://issues.folio.org/browse/UISAUTCOMP-85) MARC authority app: Remove Advanced search match dropdown.

## [3.0.0] (https://github.com/folio-org/stripes-authority-components/tree/v3.0.0) (2023-10-13)

- [UISAUTCOMP-38](https://issues.folio.org/browse/UISAUTCOMP-38) Unpin `@rehooks/local-storage` now that it's no longer broken
- [UISAUTCOMP-43](https://issues.folio.org/browse/UISAUTCOMP-43) Unpin `@vue/compiler-sfc` which no longer causes node conflicts
- [UISAUTCOMP-48](https://issues.folio.org/browse/UISAUTCOMP-48) Fix imports to stripes-core
- [UISAUTCOMP-50](https://issues.folio.org/browse/UISAUTCOMP-50) Pre-populate search/browse box with bib subfield values.
- [UISAUTCOMP-53](https://issues.folio.org/browse/UISAUTCOMP-53) Remove redundant `records-editor.records` interface.
- [UISAUTCOMP-56](https://issues.folio.org/browse/UISAUTCOMP-56) Use formatted advanced search rows for initial search.
- [UISAUTCOMP-57](https://issues.folio.org/browse/UISAUTCOMP-57) Retain `Search` and `Browse` search terms.
- [UISAUTCOMP-52](https://issues.folio.org/browse/UISAUTCOMP-52) Add optional chaining operator to avoid NPE if data lacks parsedRecord field.
- [UISAUTCOMP-58](https://issues.folio.org/browse/UISAUTCOMP-58) Fix the message in the result list after resetting.
- [UISAUTCOMP-59](https://issues.folio.org/browse/UISAUTCOMP-59) Adding authority mapping rule to mark Highlighted Fields
- [UISAUTCOMP-62](https://issues.folio.org/browse/UISAUTCOMP-62) *BREAKING* Bump `react` to `v18`.
- [UISAUTCOMP-63](https://issues.folio.org/browse/UISAUTCOMP-63) Add MARC authority facet for shared vs Local authority records.
- [UISAUTCOMP-64](https://issues.folio.org/browse/UISAUTCOMP-64) Update Node.js to v18 in GitHub Actions.
- [UISAUTCOMP-67](https://issues.folio.org/browse/UISAUTCOMP-67) Add "Local" or "Shared" to flag MARC authorities.
- [UISAUTCOMP-68](https://issues.folio.org/browse/UISAUTCOMP-68) Add Shared icon to MARC authority search results.
- [UISAUTCOMP-70](https://issues.folio.org/browse/UISAUTCOMP-70) Change tenant id to central when opening details of Shared Authority.
- [UISAUTCOMP-72](https://issues.folio.org/browse/UISAUTCOMP-72) Link Shared/Local MARC bib record to Shared/Local Authority record.
- [UISAUTCOMP-73](https://issues.folio.org/browse/UISAUTCOMP-73) Delete Shared MARC authority record.
- [UISAUTCOMP-74](https://issues.folio.org/browse/UISAUTCOMP-74) Shared "MARC authority" doesn't open automatically on "Member" tenant when search returns one record.
- [UISAUTCOMP-76](https://issues.folio.org/browse/UISAUTCOMP-76) *BREAKING* bump `react-intl` to `v6.4.4`.
- [UISAUTCOMP-77](https://issues.folio.org/browse/UISAUTCOMP-77) Use "see from also" options for Name-Title search.
- [UISAUTCOMP-78](https://issues.folio.org/browse/UISAUTCOMP-78) Don't clear previous Search/Browse results to highlight the edited record.
- [UISAUTCOMP-79](https://issues.folio.org/browse/UISAUTCOMP-79) Fix the Next button being disabled when moving from the second page to the first and focusing the first row of the list only after loading the data.
- [UISAUTCOMP-84](https://issues.folio.org/browse/UISAUTCOMP-84) Fix "Reset all" button doesn't reset result pane in "MARC authority" app.

## [2.0.2] (https://github.com/folio-org/stripes-authority-components/tree/v2.0.2) (2023-03-30)

- [UISAUTCOMP-47](https://issues.folio.org/browse/UISAUTCOMP-47) Fix filtering in the `Thesaurus` facet.

## [2.0.1] (https://github.com/folio-org/stripes-authority-components/tree/v2.0.1) (2023-03-14)

- [UISAUTCOMP-45](https://issues.folio.org/browse/UISAUTCOMP-45) Extend Identifier (all) search option with naturalId query

## [2.0.0] (https://github.com/folio-org/stripes-authority-components/tree/v2.0.0) (2023-02-13)

- [UISAUTCOMP-22](https://issues.folio.org/browse/UISAUTCOMP-22) Long browse queries don't display properly in a not-exact match placeholder
- [UISAUTCOMP-32](https://issues.folio.org/browse/UISAUTCOMP-32) MARC authority app: Results List: Number of titles column > Link each number to return all bib records linked to the authority record
- [UISAUTCOMP-33](https://issues.folio.org/browse/UISAUTCOMP-33) Default search/browse option and Authority source file selections based on MARC bib field to be linked
- [UISAUTCOMP-35](https://issues.folio.org/browse/UISAUTCOMP-35) MARC authority: Delete MARC authority record handling
- [UISAUTCOMP-34](https://issues.folio.org/browse/UISAUTCOMP-34) "Reset all" button doesn't return values to default
- [UISAUTCOMP-36](https://issues.folio.org/browse/UISAUTCOMP-36) Fix "Reference" record opens when user clicks on the "View" icon next to the linked "MARC Bib" field
- [UISAUTCOMP-37](https://issues.folio.org/browse/UISAUTCOMP-37) Bump stripes to 8.0.0 for Orchid/2023-R1
- [UISAUTCOMP-40](https://issues.folio.org/browse/UISAUTCOMP-40) Align the module with API breaking change
- [UISAUTCOMP-39](https://issues.folio.org/browse/UISAUTCOMP-39) Bump quick-marc to 6.0.0

## [1.0.2] (https://github.com/folio-org/stripes-authority-components/tree/v1.0.2) (2022-11-28)

- [UISAUTCOMP-30](https://issues.folio.org/browse/UISAUTCOMP-30) Error appears when the user executes search in "MARC Authority" app

## [1.0.1] (https://github.com/folio-org/stripes-authority-components/tree/v1.0.1) (2022-11-11)

- [UISAUTCOMP-25](https://issues.folio.org/browse/UISAUTCOMP-25) Fix error when switching from "Browse" to "Search", when no records were found in the browse result list

## [1.0.0] (https://github.com/folio-org/stripes-authority-components/tree/v1.0.0) (2022-10-25)

- [UISAUTCOMP-1](https://issues.folio.org/browse/UISAUTCOMP-1) stripes-authority-components: Create a repository
- [UISAUTCOMP-2](https://issues.folio.org/browse/UISAUTCOMP-2) Select a MARC authority record modal > Search MARC authority records
- [UISAUTCOMP-4](https://issues.folio.org/browse/UISAUTCOMP-4) Browse authority | Remove checkbox "Exclude see from also" from "Reference" accordion.
- [UISAUTCOMP-5](https://issues.folio.org/browse/UISAUTCOMP-5) Select a MARC authority record modal >  Browse MARC authority records
- [UISAUTCOMP-6](https://issues.folio.org/browse/UISAUTCOMP-6) Fix pagination, height, and width of the result list
- [UISAUTCOMP-10](https://issues.folio.org/browse/UISAUTCOMP-10) Scroll bars display at the second pane when they don't need
- [UISAUTCOMP-8](https://issues.folio.org/browse/UISAUTCOMP-8) Change marc authorities search by "identifiers.value"
- [UISAUTCOMP-7](https://issues.folio.org/browse/UISAUTCOMP-7) Fix prop types warnings in tests
- [UISAUTCOMP-9](https://issues.folio.org/browse/UISAUTCOMP-9) Add the marc view component, hide it after a filter change, add the ability to close it without redirection
- [UISAUTCOMP-12](https://issues.folio.org/browse/UISAUTCOMP-12) CLONE - Default search query change to return - authRefType=Authorized
- [UISAUTCOMP-14](https://issues.folio.org/browse/UISAUTCOMP-14) Add the Expand the Search & filter pane option
- [UISAUTCOMP-15](https://issues.folio.org/browse/UISAUTCOMP-15) Results List : Click Link icon/button to select a MARC authority record
- [UISAUTCOMP-13](https://issues.folio.org/browse/UISAUTCOMP-13) Browse | The pagination doesn't reset when the user changes the search option and uses the same search query.
- [UISAUTCOMP-17](https://issues.folio.org/browse/UISAUTCOMP-17) FE: MARC authority: Create an Authority source facet
- [UISAUTCOMP-21](https://issues.folio.org/browse/UISAUTCOMP-21) Make MCL row unclickable when a placeholder row is displayed
- [UISAUTCOMP-23](https://issues.folio.org/browse/UISAUTCOMP-23) Search Results List: add non interactive headers
- [UISAUTCOMP-19](https://issues.folio.org/browse/UISAUTCOMP-19) Add a11y tests
- [UISAUTCOMP-24](https://issues.folio.org/browse/UISAUTCOMP-24) MARC authority app: Authority source/Thesaurus Facet option does not display value when zero results are returned
