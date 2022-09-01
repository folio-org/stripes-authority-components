jest.mock('@folio/stripes-components/lib/Icon', () => {
  return function ({ children }) {
    return (
      <span>
        Icon
        <span>
          {children}
        </span>
      </span>
    );
  };
});
