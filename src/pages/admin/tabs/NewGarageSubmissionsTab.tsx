import React, { useState } from 'react';
import { Check, X, FileText, Eye } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface GarageSubmission {
  id: string;
  name: string;
  description: string;
  owner_name: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

// Mock data for garage submissions
const mockSubmissions: GarageSubmission[] = [
  {
    id: '1',
    name: 'Turbo Performance',
    description: 'Expert auto shop specializing in performance tuning and modifications.',
    owner_name: 'Ahmet Yılmaz',
    created_at: '2025-05-10T14:30:00',
    status: 'pending',
    documents: []
  },
  {
    id: '2',
    name: 'Istanbul Auto Care',
    description: 'Full-service garage offering repair, maintenance, and body work services.',
    owner_name: 'Mehmet Kaya',
    created_at: '2025-05-09T09:15:00',
    status: 'pending',
    documents: ['business_license.pdf']
  },
  {
    id: '3',
    name: 'AutoExpert Garage',
    description: 'Professional mechanics specializing in European vehicle repairs.',
    owner_name: 'Elif Demir',
    created_at: '2025-05-08T16:45:00',
    status: 'pending',
    documents: ['business_license.pdf', 'certificate.pdf']
  }
];

const NewGarageSubmissionsTab: React.FC = () => {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<GarageSubmission[]>(mockSubmissions);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestDocsModal, setShowRequestDocsModal] = useState(false);
  const [requestedDocuments, setRequestedDocuments] = useState({
    business_license: false,
    tax_certificate: false,
    id_proof: false,
    other: false,
    other_description: ''
  });
  
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
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedSubmissions = submissions.map(submission => 
        submission.id === id 
          ? { ...submission, status: 'approved' as const } 
          : submission
      );
      
      setSubmissions(updatedSubmissions);
      showToast('Garage submission approved successfully', 'success');
      setLoading(false);
    }, 500);
  };

  const openRejectModal = (id: string) => {
    setActiveSubmissionId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmission = async () => {
    if (!activeSubmissionId || !rejectReason.trim()) return;
    
    setLoading(true);
    setShowRejectModal(false);
    
    // Simulating API call
    setTimeout(() => {
      const updatedSubmissions = submissions.map(submission => 
        submission.id === activeSubmissionId 
          ? { ...submission, status: 'rejected' as const } 
          : submission
      );
      
      setSubmissions(updatedSubmissions);
      showToast('Garage submission rejected', 'success');
      setLoading(false);
      setActiveSubmissionId(null);
    }, 500);
  };

  const openRequestDocsModal = (id: string) => {
    setActiveSubmissionId(id);
    setRequestedDocuments({
      business_license: false,
      tax_certificate: false,
      id_proof: false,
      other: false,
      other_description: ''
    });
    setShowRequestDocsModal(true);
  };

  const handleRequestDocuments = async () => {
    if (!activeSubmissionId) return;
    
    // Check if at least one document is selected
    if (!Object.values(requestedDocuments).some(value => 
      typeof value === 'boolean' ? value : value.trim().length > 0
    )) {
      showToast('Please select at least one document type to request', 'error');
      return;
    }
    
    setLoading(true);
    setShowRequestDocsModal(false);
    
    // Simulating API call
    setTimeout(() => {
      // In a real app, this would send an email or notification to the garage owner
      showToast('Document request sent to garage owner', 'success');
      setLoading(false);
      setActiveSubmissionId(null);
    }, 500);
  };

  const pendingSubmissions = submissions.filter(submission => submission.status === 'pending');

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">New Garage Submissions</h2>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-8 bg-secondary-50 rounded-lg">
                <p className="text-secondary-500">No pending garage submissions to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary-50">
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Garage Name</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Owner</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Submission Date</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Documents</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="px-4 py-3 font-medium">{submission.name}</td>
                        <td className="px-4 py-3 text-secondary-700">{submission.owner_name}</td>
                        <td className="px-4 py-3 text-secondary-700">{formatDate(submission.created_at)}</td>
                        <td className="px-4 py-3">
                          {submission.documents.length > 0 ? (
                            <div className="flex items-center">
                              <FileText size={16} className="text-primary-600 mr-1" />
                              <span>{submission.documents.length} document(s)</span>
                            </div>
                          ) : (
                            <span className="text-secondary-500">No documents</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-primary-600 hover:text-primary-800"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="text-success-600 hover:text-success-800"
                              title="Approve Submission"
                              onClick={() => handleApproveSubmission(submission.id)}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              className="text-error-600 hover:text-error-800"
                              title="Reject Submission"
                              onClick={() => openRejectModal(submission.id)}
                            >
                              <X size={16} />
                            </button>
                            <button
                              className="text-secondary-600 hover:text-secondary-800 px-2 py-1 text-xs rounded border border-secondary-300"
                              onClick={() => openRequestDocsModal(submission.id)}
                            >
                              Request Docs
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold">Reject Garage Submission</h3>
            </div>
            <div className="p-4">
              <p className="mb-4 text-secondary-700">Please provide a reason for rejecting this submission:</p>
              <textarea
                className="input w-full"
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason (required)"
              ></textarea>
            </div>
            <div className="p-4 border-t border-secondary-200 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleRejectSubmission}
                disabled={!rejectReason.trim()}
              >
                Reject Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Documents Modal */}
      {showRequestDocsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold">Request Documents</h3>
            </div>
            <div className="p-4">
              <p className="mb-4 text-secondary-700">Select documents to request from the garage owner:</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="business_license"
                    checked={requestedDocuments.business_license}
                    onChange={(e) => setRequestedDocuments({
                      ...requestedDocuments,
                      business_license: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="business_license">Business License</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tax_certificate"
                    checked={requestedDocuments.tax_certificate}
                    onChange={(e) => setRequestedDocuments({
                      ...requestedDocuments,
                      tax_certificate: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="tax_certificate">Tax Certificate</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="id_proof"
                    checked={requestedDocuments.id_proof}
                    onChange={(e) => setRequestedDocuments({
                      ...requestedDocuments,
                      id_proof: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="id_proof">Proof of Identity</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="other"
                    checked={requestedDocuments.other}
                    onChange={(e) => setRequestedDocuments({
                      ...requestedDocuments,
                      other: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="other">Other (Specify)</label>
                </div>
                
                {requestedDocuments.other && (
                  <div className="ml-6">
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Specify document type"
                      value={requestedDocuments.other_description}
                      onChange={(e) => setRequestedDocuments({
                        ...requestedDocuments,
                        other_description: e.target.value
                      })}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-secondary-200 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRequestDocsModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRequestDocuments}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewGarageSubmissionsTab; 