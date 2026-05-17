const LoadingSpinner = ({ size = "lg", fullHeight = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${fullHeight ? "min-h-screen" : "min-h-[40vh]"}`}
    >
      <span className={`loading loading-spinner loading-${size} text-[var(--primary)]`}></span>
    </div>
  );
};

export default LoadingSpinner;
