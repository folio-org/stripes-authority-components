# useAuthoritiesBrowse
This hook contains logic of Authority browsing functionality.

### Usage

`useAuthoritiesBrowse` returns an object with following properties:

Name | type | description
--- | --- | --- |
`authorities` | array | Array of found Authority records
`isLoading` | bool | Is a request pending
`isLoaded` | bool | Has a request finished
`hasNextPage` | bool | Can browse a next page
`hasPrevPage` | bool | Can browse a previous page
`handleLoadMore` | function | Function to fetch more data. Same API as `MCL`'s `onNeedMoreData`
`query` | string | Formatted query string that is used for fetching results for currently browsed page
`firstPageQuery` | string | Formatted query string that was used for fetching results for first browsed page (page with anchor)
`totalRecords` | number | Number of total records found


### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`searchQuery` | string | Seqrch query provided by user | `` | true
`searchIndex` | string | Search index provided by user | `` | true
`filters` | object | Selected search filters. Structure: `{ filterName: ['filterValue1', 'filterValue2'] }`| undefined | true
`pageSize` | number | Number of results per page | undefined | true
`precedingRecordsCount` | number | Number of records before anchor item in results list | undefined | true
`browsePageQuery` | string | Query that will be searched when viewing Next or Previous page | undefined | false
`setBrowsePageQuery` | function | Setter function for `browsePageQuery` | undefined | true
`browsePage` | number | Numerical order of the current viewed Browse page | undefined | false
`setBrowsePage` | function | Setter function for `browsePage` | undefined | true
`navigationSegmentValue` | string | Current segment of MARC authority search and browse view | undefined | false.
`tenantId` | string | Tenant id in a multi-tenant environment | undefined | false
