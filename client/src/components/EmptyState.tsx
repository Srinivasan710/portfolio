interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

const EmptyState = ({
  title = 'Nothing here yet',
  message = 'No items to display at the moment.',
  icon = 'bi-inbox',
}: EmptyStateProps) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
    <div className="text-muted" style={{ fontSize: '4rem' }}>
      <i className={`bi ${icon}`}></i>
    </div>
    <h5 className="text-muted mb-1">{title}</h5>
    <p className="text-muted text-center mb-0" style={{ maxWidth: 400 }}>{message}</p>
  </div>
);

export default EmptyState;
