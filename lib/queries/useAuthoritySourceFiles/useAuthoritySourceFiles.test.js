import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import useAuthoritySourceFiles from './useAuthoritySourceFiles';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useAuthoritySourceFiles', () => {
  const sourceFile = {
    id: 1,
    name: 'Test file',
    codes: ['a', 'b'],
    source: 'FOLIO',
    hridManagement: {
      startsWith: 1,
    },
    baseUrl: '/some-url',
    active: true,
  };
  const mockJson = jest.fn().mockResolvedValue({
    authoritySourceFiles: [sourceFile],
  });

  const mockGet = jest.fn(() => ({
    json: mockJson,
  }));
  const mockPatch = jest.fn(() => ({
    json: mockJson,
  }));
  const mockPost = jest.fn(() => ({
    json: mockJson,
  }));
  const mockDelete = jest.fn();
  const mockOnUpdateSuccess = jest.fn();
  const mockOnUpdateFail = jest.fn();
  const mockOnCreateSuccess = jest.fn();
  const mockOnCreateFail = jest.fn();
  const mockOnDeleteSuccess = jest.fn();
  const mockOnDeleteFail = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
      patch: mockPatch,
      post: mockPost,
      delete: mockDelete,
    });
    jest.clearAllMocks();
  });

  const initialProps = {
    onUpdateSuccess: mockOnUpdateSuccess,
    onUpdateFail: mockOnUpdateFail,
    onCreateSuccess: mockOnCreateSuccess,
    onCreateFail: mockOnCreateFail,
    onDeleteSuccess: mockOnDeleteSuccess,
    onDeleteFail: mockOnDeleteFail,
  };

  it('should fetch source files', async () => {
    const { result } = renderHook(() => useAuthoritySourceFiles(), { wrapper, initialProps });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalled();
  });

  describe('when using updateFile method', () => {
    beforeEach(() => {
      const { result } = renderHook(useAuthoritySourceFiles, { wrapper, initialProps });

      result.current.updateFile(sourceFile);
    });

    it('should call patch with correct data', async () => {
      await waitFor(() => expect(mockPatch).toHaveBeenCalledWith(`authority-source-files/${sourceFile.id}`, { json: sourceFile }));
    });

    it('should call onUpdateSuccess', async () => {
      await waitFor(() => expect(mockOnUpdateSuccess).toHaveBeenCalledWith(sourceFile));
    });
  });

  describe('when using createFile method', () => {
    beforeEach(() => {
      const { result } = renderHook(useAuthoritySourceFiles, { wrapper, initialProps });

      result.current.createFile(sourceFile);
    });

    it('should call patch with correct data', async () => {
      await waitFor(() => expect(mockPost).toHaveBeenCalledWith('authority-source-files', { json: sourceFile }));
    });

    it('should call onCreateSuccess', async () => {
      await waitFor(() => expect(mockOnCreateSuccess).toHaveBeenCalledWith(sourceFile));
    });
  });

  describe('when using deleteFile method', () => {
    beforeEach(() => {
      const { result } = renderHook(useAuthoritySourceFiles, { wrapper, initialProps });

      result.current.deleteFile(sourceFile.id);
    });

    it('should call patch with correct data', async () => {
      await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(`authority-source-files/${sourceFile.id}`));
    });

    it('should call onDeleteSuccess', async () => {
      await waitFor(() => expect(mockOnDeleteSuccess).toHaveBeenCalledWith(sourceFile));
    });
  });
});
