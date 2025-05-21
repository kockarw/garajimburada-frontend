import React, { useState } from 'react';
import { Edit, Trash, Search, AlertTriangle, ThumbsUp } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface Comment {
  id: string;
  user_name: string;
  user_id: string;
  garage_name: string;
  garage_id: string;
  content: string;
  rating: number;
  created_at: string;
  is_reported: boolean;
  is_helpful: boolean;
}

// Mock data for comments
const mockComments: Comment[] = [
  {
    id: '1',
    user_name: 'Ahmet Yılmaz',
    user_id: 'user123',
    garage_name: 'AutoFix Garage',
    garage_id: 'garage1',
    content: 'Excellent service! They fixed my car quickly and at a reasonable price.',
    rating: 5,
    created_at: '2025-05-08T14:30:00',
    is_reported: false,
    is_helpful: true
  },
  {
    id: '2',
    user_name: 'Mehmet Kaya',
    user_id: 'user456',
    garage_name: 'City Motors',
    garage_id: 'garage2',
    content: 'Good service but a bit expensive compared to other garages in the area.',
    rating: 3,
    created_at: '2025-05-07T09:15:00',
    is_reported: false,
    is_helpful: false
  },
  {
    id: '3',
    user_name: 'Zeynep Demir',
    user_id: 'user789',
    garage_name: 'AutoFix Garage',
    garage_id: 'garage1',
    content: 'Very rude staff! They damaged my car during repair and refused to fix it. I would never recommend this place to anyone!',
    rating: 1,
    created_at: '2025-05-06T16:45:00',
    is_reported: true,
    is_helpful: false
  }
];

const CommentModerationTab: React.FC = () => {
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'garage' | 'user'>('garage');
  const [showReportedOnly, setShowReportedOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as 'garage' | 'user');
  };

  const filteredComments = comments.filter(comment => {
    if (showReportedOnly && !comment.is_reported) {
      return false;
    }
    
    if (!searchQuery) {
      return true;
    }
    
    const query = searchQuery.toLowerCase();
    if (searchType === 'garage') {
      return comment.garage_name.toLowerCase().includes(query);
    } else {
      return comment.user_name.toLowerCase().includes(query);
    }
  });

  const handleDeleteComment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      setLoading(true);
      
      // Simulating API call
      setTimeout(() => {
        const updatedComments = comments.filter(comment => comment.id !== id);
        setComments(updatedComments);
        showToast('Comment deleted successfully', 'success');
        setLoading(false);
      }, 500);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditedContent(comment.content);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editedContent.trim()) return;
    
    setLoading(true);
    setShowEditModal(false);
    
    // Simulating API call
    setTimeout(() => {
      const updatedComments = comments.map(comment => 
        comment.id === editingComment.id 
          ? { ...comment, content: editedContent } 
          : comment
      );
      
      setComments(updatedComments);
      showToast('Comment updated successfully', 'success');
      setLoading(false);
      setEditingComment(null);
    }, 500);
  };

  const handleToggleHelpful = async (id: string) => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedComments = comments.map(comment => 
        comment.id === id 
          ? { ...comment, is_helpful: !comment.is_helpful } 
          : comment
      );
      
      setComments(updatedComments);
      const isHelpful = updatedComments.find(c => c.id === id)?.is_helpful;
      showToast(`Comment ${isHelpful ? 'marked as helpful' : 'unmarked as helpful'}`, 'success');
      setLoading(false);
    }, 500);
  };

  const handleClearReport = async (id: string) => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedComments = comments.map(comment => 
        comment.id === id 
          ? { ...comment, is_reported: false } 
          : comment
      );
      
      setComments(updatedComments);
      showToast('Report dismissed', 'success');
      setLoading(false);
    }, 500);
  };

  // Function to render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-sm ${i <= rating ? 'text-accent-500' : 'text-secondary-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">Comment Moderation</h2>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="flex">
              <select
                className="rounded-l-md border border-secondary-300 py-2 px-3 bg-white text-secondary-700"
                value={searchType}
                onChange={handleSearchTypeChange}
              >
                <option value="garage">Garage</option>
                <option value="user">User</option>
              </select>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search by ${searchType === 'garage' ? 'garage name' : 'username'}...`}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="input rounded-l-none w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show_reported"
              checked={showReportedOnly}
              onChange={() => setShowReportedOnly(!showReportedOnly)}
              className="mr-2"
            />
            <label htmlFor="show_reported" className="flex items-center text-secondary-700">
              <AlertTriangle size={16} className="text-warning-500 mr-2" />
              Show reported comments only
            </label>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredComments.length === 0 ? (
              <div className="text-center py-8 bg-secondary-50 rounded-lg">
                <p className="text-secondary-500">No comments found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`border rounded-lg p-4 ${
                      comment.is_reported 
                        ? 'border-warning-300 bg-warning-50' 
                        : 'border-secondary-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user_name}</span>
                          <span className="text-secondary-500">on</span>
                          <span className="font-medium text-primary-600">{comment.garage_name}</span>
                          {comment.is_helpful && (
                            <span className="bg-success-100 text-success-800 text-xs px-2 py-0.5 rounded-full font-medium">
                              Helpful
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="mr-2">
                            {renderStars(comment.rating)}
                          </div>
                          <span className="text-sm text-secondary-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          className={`text-primary-600 hover:text-primary-800 ${comment.is_helpful ? 'bg-primary-100' : ''} p-1 rounded`}
                          title={comment.is_helpful ? 'Remove helpful mark' : 'Mark as helpful'}
                          onClick={() => handleToggleHelpful(comment.id)}
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <button
                          className="text-primary-600 hover:text-primary-800 p-1 rounded"
                          title="Edit Comment"
                          onClick={() => handleEditComment(comment)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-error-600 hover:text-error-800 p-1 rounded"
                          title="Delete Comment"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-secondary-700 mb-2">{comment.content}</p>
                    
                    {comment.is_reported && (
                      <div className="mt-3 pt-2 border-t border-warning-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-warning-600">
                            <AlertTriangle size={16} className="mr-2" />
                            <span className="text-sm font-medium">This comment has been reported</span>
                          </div>
                          <button
                            className="text-sm text-primary-600 hover:text-primary-800"
                            onClick={() => handleClearReport(comment.id)}
                          >
                            Dismiss report
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Comment Modal */}
      {showEditModal && editingComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold">Edit Comment</h3>
            </div>
            <div className="p-4">
              <p className="mb-2 text-sm text-secondary-600">
                Author: <span className="font-medium">{editingComment.user_name}</span> on <span className="font-medium text-primary-600">{editingComment.garage_name}</span>
              </p>
              <textarea
                className="input w-full"
                rows={4}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Edit comment content..."
              ></textarea>
            </div>
            <div className="p-4 border-t border-secondary-200 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveEdit}
                disabled={!editedContent.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentModerationTab; 