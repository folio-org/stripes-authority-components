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

import { SOURCE_FILE_MUTATION_ERROR_REASON } from './constants';

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

  const getFileById = id => data?.authoritySourceFiles.find(file => file.id === id);

  const parseErrorResponse = (e, file) => {
    return {
      status: e.response.status,
      sourceFile: file,
    };
  };

  const handleError = (e, file, cb) => {
    const parsedError = parseErrorResponse(e, file);

    const errorReason = SOURCE_FILE_MUTATION_ERROR_REASON[parsedError.status] || SOURCE_FILE_MUTATION_ERROR_REASON.UNKNOWN;

    cb({ name: file.name, reason: errorReason });
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries(namespace);
  };

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
      onUpdateSuccess({ ...getFileById(updatedFile.id), ...updatedFile });
    },
    onError: (e, { id }) => handleError(e, getFileById(id), onUpdateFail),
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
    onError: (e, createdFile) => handleError(e, createdFile, onCreateFail),
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
      onDeleteSuccess(getFileById(deletedFileId));
    },
    onError: (e, deletedFileId) => handleError(e, getFileById(deletedFileId), onDeleteFail),
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
