# Change history for stripes-authoriy-components

## [3.0.0] IN PROGRESS

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
- [UISAUTCOMP-67](https://issues.folio.org/browse/UISAUTCOMP-67) Add "Local" or "Shared" to flag MARC authorities.

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
