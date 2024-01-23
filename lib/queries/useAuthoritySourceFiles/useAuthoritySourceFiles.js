import { useCallback } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  useNamespace,
  useStripes,
  useOkapiKy,
} from '@folio/stripes/core';

const SOURCE_FILES_API = 'authority-source-files';

const useAuthoritySourceFiles = ({
  tenantId,
  onUpdateSuccess,
  onUpdateFail,
  onCreateSuccess,
  onCreateFail,
  onDeleteSuccess,
  onDeleteFail,
} = {}) => {
  const stripes = useStripes();
  const queryClient = useQueryClient();
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const ky = useOkapiKy({ tenant: tenantId });
  const centralKy = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'authority-source-files' });

  const { isFetching, data } = useQuery(
    [namespace],
    async () => {
      return ky.get(`${SOURCE_FILES_API}?limit=50`).json();
    },
  );

  const handleSuccess = useCallback(() => {
    queryClient.invalidateQueries(namespace);
  }, [namespace, queryClient]);

  const {
    mutateAsync: updateFile,
    isLoading: isUpdating,
  } = useMutation({
    mutationFn: authoritySourceFile => {
      return centralKy.patch(
        `${SOURCE_FILES_API}/${authoritySourceFile.id}`,
        { json: authoritySourceFile },
      );
    },
    onSuccess: (_res, updatedFile) => {
      handleSuccess();
      onUpdateSuccess(updatedFile);
    },
    onError: onUpdateFail,
  });

  const {
    mutateAsync: createFile,
    isLoading: isCreating,
  } = useMutation({
    mutationFn: authoritySourceFile => {
      return centralKy.post(
        `${SOURCE_FILES_API}`,
        { json: authoritySourceFile },
      );
    },
    onSuccess: (_res, createdFile) => {
      handleSuccess();
      onCreateSuccess(createdFile);
    },
    onError: onCreateFail,
  });

  const {
    mutateAsync: deleteFile,
    isLoading: isDeleting,
  } = useMutation({
    mutationFn: id => {
      return centralKy.delete(
        `${SOURCE_FILES_API}/${id}`,
      );
    },
    onSuccess: (_res, deletedFileId) => {
      handleSuccess();
      onDeleteSuccess(data?.authoritySourceFiles.find(file => file.id === deletedFileId));
    },
    onError: onDeleteFail,
  });

  return ({
    sourceFiles: data?.authoritySourceFiles || [],
    updateFile,
    createFile,
    deleteFile,
    isUpdating,
    isCreating,
    isDeleting,
    isLoading: isFetching,
  });
};

export default useAuthoritySourceFiles;
