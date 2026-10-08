interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
    <div className="text-danger fs-1">
      <i className="bi bi-exclamation-triangle-fill"></i>
    </div>
    <h5 className="text-danger mb-1">Oops! Something went wrong</h5>
    <p className="text-muted text-center mb-0" style={{ maxWidth: 480 }}>{message}</p>
    {onRetry && (
      <button className="btn btn-outline-primary btn-sm mt-2" onClick={onRetry}>
        <i className="bi bi-arrow-clockwise me-2"></i>Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
