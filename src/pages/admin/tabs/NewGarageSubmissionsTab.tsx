import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Clock } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import garageService, { GarageResponse } from '../../../services/garage.service';
import { useNavigate } from 'react-router-dom';

const NewGarageSubmissionsTab: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<GarageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // Fetch pending submissions on component mount
  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      const garages = await garageService.getAllGarages({ status: 'pending' });
      setSubmissions(garages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pending submissions');
      showToast('Failed to fetch pending submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleApproveSubmission = async (id: string) => {
    try {
      setLoading(true);
      await garageService.updateGarageStatus(id, 'approved');
      await fetchPendingSubmissions(); // Refresh the list
      showToast('Garage submission approved successfully', 'success');
    } catch (err) {
      showToast('Failed to approve garage submission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (id: string) => {
    setActiveSubmissionId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmission = async () => {
    if (!activeSubmissionId || !rejectReason.trim()) return;
    
    try {
      setLoading(true);
      await garageService.updateGarageStatus(
        activeSubmissionId,
        'rejected',
        rejectReason
      );
      await fetchPendingSubmissions(); // Refresh the list
      showToast('Garage submission rejected', 'success');
    } catch (err) {
      showToast('Failed to reject garage submission', 'error');
    } finally {
      setLoading(false);
      setShowRejectModal(false);
      setActiveSubmissionId(null);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/garage/${id}`);
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">New Garage Submissions</h2>
      </div>
      
      <div className="p-4">
        {loading && submissions.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-error-50 rounded-lg">
            <p className="text-error-600">{error}</p>
            <button 
              className="btn btn-primary mt-4"
              onClick={fetchPendingSubmissions}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {submissions.length === 0 ? (
              <div className="text-center py-8 bg-secondary-50 rounded-lg">
                <p className="text-secondary-500">No pending garage submissions to review.</p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block lg:hidden">
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} 
                        className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        {/* Header Section */}
                        <div className="p-4 border-b border-secondary-100 bg-warning-50/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="shrink-0">
                                <Clock size={16} className="text-warning-600" />
                              </div>
                              <h3 className="font-semibold text-secondary-900 truncate">
                                {submission.name}
                              </h3>
                            </div>
                            <span className="ml-3 shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                              Pending Review
                            </span>
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-4 space-y-3 bg-white">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-secondary-500 font-medium">ID</p>
                              <p className="text-sm font-mono text-secondary-900">{submission.ad_id}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-secondary-500 font-medium">Owner</p>
                              <p className="text-sm text-secondary-900">{submission.owner.username}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-secondary-500 font-medium">Submission Date</p>
                            <p className="text-sm text-secondary-900">{formatDate(submission.create_time)}</p>
                          </div>
                        </div>

                        {/* Actions Section */}
                        <div className="px-4 py-3 bg-secondary-50/50 border-t border-secondary-100">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-success-600 hover:text-success-700 transition-colors duration-200"
                              onClick={() => handleApproveSubmission(submission.id)}
                              title="Approve"
                              disabled={loading}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-error-600 hover:text-error-700 transition-colors duration-200"
                              onClick={() => openRejectModal(submission.id)}
                              title="Reject"
                              disabled={loading}
                            >
                              <X size={18} />
                            </button>
                            <button
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-primary-600 hover:text-primary-700 transition-colors duration-200"
                              onClick={() => handleViewDetails(submission.ad_id)}
                              title="View Details"
                              disabled={loading}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary-50">
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Garage Name</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">ID</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Owner</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Submission Date</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="px-4 py-3 font-medium">{submission.name}</td>
                          <td className="px-4 py-3 text-secondary-700 font-mono">{submission.ad_id}</td>
                          <td className="px-4 py-3 text-secondary-700">{submission.owner.username}</td>
                          <td className="px-4 py-3 text-secondary-700">{formatDate(submission.create_time)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-success-600 hover:text-success-800"
                                title="Approve"
                                onClick={() => handleApproveSubmission(submission.id)}
                                disabled={loading}
                              >
                                <Check size={18} />
                              </button>
                              <button
                                className="text-error-600 hover:text-error-800"
                                title="Reject"
                                onClick={() => openRejectModal(submission.id)}
                                disabled={loading}
                              >
                                <X size={18} />
                              </button>
                              <button
                                className="text-primary-600 hover:text-primary-800"
                                title="View Details"
                                onClick={() => handleViewDetails(submission.ad_id)}
                                disabled={loading}
                              >
                                <Eye size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold">Reject Garage Submission</h3>
            </div>
            <div className="p-4">
              <label className="block mb-2">Reason for rejection:</label>
              <textarea
                className="w-full p-2 border border-secondary-200 rounded-md"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="p-4 border-t border-secondary-200 flex justify-end gap-2">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={handleRejectSubmission}
                disabled={loading || !rejectReason.trim()}
              >
                {loading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewGarageSubmissionsTab; 