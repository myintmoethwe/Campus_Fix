function AdminStatCard({ title, count, icon, color }) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="text-muted mb-2">{title}</p>
          <h3 className="fw-bold mb-0">{count}</h3>
        </div>

        <div className={`bg-${color} bg-opacity-10 rounded-circle p-3`}>
          <i className={`${icon} fs-3 text-${color}`}></i>
        </div>
      </div>
    </div>
  );
}

export default AdminStatCard;
