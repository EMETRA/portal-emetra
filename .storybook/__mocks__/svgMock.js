module.exports = function SvgMock(props) {
  return (
    // Puedes personalizar el SVG aquí si quieres
    <svg {...props}>
      <rect width="100%" height="100%" fill="gray" />
    </svg>
  );
};
