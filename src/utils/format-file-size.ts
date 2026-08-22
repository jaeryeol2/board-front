/**
 * 바이트 단위의 파일 크기를 가독성 높은 단위(B, KB, MB, GB)로 포맷팅합니다.
 * @param bytes 파일 크기 (바이트)
 * @returns 포맷팅된 파일 크기 문자열
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const digitGroups = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / Math.pow(1024, digitGroups)).toFixed(1)} ${units[digitGroups]}`;
};
