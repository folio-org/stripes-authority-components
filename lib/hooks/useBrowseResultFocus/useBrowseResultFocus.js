import {
  useEffect,
  useRef,
} from 'react';

const useBrowseResultFocus = isLoading => {
  const isPaginationClicked = useRef(false);
  const resultsContainerRef = useRef(null);

  useEffect(() => {
    // focus the first result after clicking previous/next button.
    if (!isLoading && isPaginationClicked.current) {
      isPaginationClicked.current = false;
      resultsContainerRef.current?.querySelector('[data-row-inner]')?.focus();
    }
  }, [isLoading]);

  return {
    resultsContainerRef,
    isPaginationClicked,
  };
};

export default useBrowseResultFocus;
