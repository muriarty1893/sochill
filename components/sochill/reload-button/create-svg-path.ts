export const buildSvgHalfPaths = ({
  strokeWidth,
  borderRadius,
  width,
  height,
}: {
  strokeWidth: number;
  borderRadius: number;
  width: number;
  height: number;
}): { rightPath: string; leftPath: string; pathLength: number } => {
  const p = strokeWidth / 2;
  const r = borderRadius;
  const midX = width / 2;

  const rightPath = [
    `M ${midX} ${height - p}`,
    `L ${width - p - r} ${height - p}`,
    `Q ${width - p} ${height - p} ${width - p} ${height - p - r}`,
    `L ${width - p} ${p + r}`,
    `Q ${width - p} ${p} ${width - p - r} ${p}`,
    `L ${midX} ${p}`,
  ].join(' ');

  const leftPath = [
    `M ${midX} ${height - p}`,
    `L ${p + r} ${height - p}`,
    `Q ${p} ${height - p} ${p} ${height - p - r}`,
    `L ${p} ${p + r}`,
    `Q ${p} ${p} ${p + r} ${p}`,
    `L ${midX} ${p}`,
  ].join(' ');

  const pathLength =
    (width / 2 - p - r) +
    (Math.PI * r) / 2 +
    (height - 2 * p - 2 * r) +
    (Math.PI * r) / 2 +
    (width / 2 - p - r);

  return { rightPath, leftPath, pathLength };
};
