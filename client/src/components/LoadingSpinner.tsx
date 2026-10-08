interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) => {
  const spinnerSize = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? '' : '';
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div
        className={`spinner-border text-primary ${spinnerSize}`}
        style={size === 'lg' ? { width: '3rem', height: '3rem' } : {}}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="text-muted mb-0">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
