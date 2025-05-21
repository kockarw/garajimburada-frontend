import React, { useState } from 'react';
import { MessageSquare, Mail, Search, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  type: 'contact' | 'bug_report' | 'suggestion';
  status: 'new' | 'read' | 'responded';
}

// Mock data for feedback
const mockFeedback: Feedback[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    subject: 'Garaj kayıt formu hakkında',
    message: 'Garaj kayıt formunda telefon numarası girdiğimde hata alıyorum. Lütfen yardım edin.',
    created_at: '2025-05-08T14:30:00',
    type: 'bug_report',
    status: 'new'
  },
  {
    id: '2',
    name: 'Ayşe Kaya',
    email: 'ayse@example.com',
    subject: 'İş birliği teklifi',
    message: 'Merhaba, şirketimiz ile iş birliği yapmak ister misiniz? Detayları konuşmak için iletişime geçebilir miyiz?',
    created_at: '2025-05-07T09:15:00',
    type: 'contact',
    status: 'read'
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    subject: 'Öneri: Garaj filtreleme özellikleri',
    message: 'Garaj filtreleme özelliklerine "açık saatler" eklemenizi öneriyorum. Böylece kullanıcılar belirli saatlerde açık olan garajları arayabilirler.',
    created_at: '2025-05-06T16:45:00',
    type: 'suggestion',
    status: 'responded'
  }
];

const FeedbackTab: React.FC = () => {
  const { showToast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'bug_report' | 'suggestion'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'responded'>('all');
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  
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

  const filteredFeedback = feedback.filter(item => {
    // Apply type filter
    if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }
    
    // Apply status filter
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false;
    }
    
    // Apply search
    if (!searchQuery) {
      return true;
    }
    
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) || 
      item.email.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query)
    );
  });

  const handleSelectFeedback = (item: Feedback) => {
    // If it's a new message, mark it as read
    if (item.status === 'new') {
      setLoading(true);
      
      // Simulating API call
      setTimeout(() => {
        const updatedFeedback = feedback.map(feedback => 
          feedback.id === item.id 
            ? { ...feedback, status: 'read' as const } 
            : feedback
        );
        
        setFeedback(updatedFeedback);
        setSelectedFeedback({ ...item, status: 'read' as const });
        setLoading(false);
      }, 300);
    } else {
      setSelectedFeedback(item);
    }
    
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!selectedFeedback || !replyText.trim()) return;
    
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedFeedback = feedback.map(feedback => 
        feedback.id === selectedFeedback.id 
          ? { ...feedback, status: 'responded' as const } 
          : feedback
      );
      
      setFeedback(updatedFeedback);
      setSelectedFeedback({ ...selectedFeedback, status: 'responded' as const });
      showToast('Reply sent successfully', 'success');
      setReplyText('');
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-primary-100 text-primary-800';
      case 'read':
        return 'bg-secondary-100 text-secondary-800';
      case 'responded':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <MessageSquare size={16} className="text-primary-600" />;
      case 'bug_report':
        return <AlertTriangle size={16} className="text-warning-600" />;
      case 'suggestion':
        return <ExternalLink size={16} className="text-accent-600" />;
      default:
        return <MessageSquare size={16} className="text-primary-600" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'contact':
        return 'İletişim';
      case 'bug_report':
        return 'Hata Bildirimi';
      case 'suggestion':
        return 'Öneri';
      default:
        return type;
    }
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">Feedback & Contact</h2>
      </div>
      
      <div className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          <div className="col-span-1 border-r border-secondary-200">
            <div className="p-4 border-b border-secondary-200">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="input pl-10 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="input py-1 text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                >
                  <option value="all">All Types</option>
                  <option value="contact">Contact</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="suggestion">Suggestion</option>
                </select>
                
                <select
                  className="input py-1 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(600px-111px)]">
              {loading && !selectedFeedback ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <>
                  {filteredFeedback.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <p className="text-secondary-500">No messages found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-secondary-100">
                      {filteredFeedback.map((item) => (
                        <button
                          key={item.id}
                          className={`block w-full text-left p-4 hover:bg-secondary-50 ${
                            selectedFeedback?.id === item.id ? 'bg-secondary-50' : ''
                          } ${item.status === 'new' ? 'font-medium' : ''}`}
                          onClick={() => handleSelectFeedback(item)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(item.type)}
                              <span className="truncate max-w-[150px]">{item.name}</span>
                            </div>
                            <span className="text-xs text-secondary-500">
                              {formatDate(item.created_at).split(' ')[0]}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium mb-1 truncate">{item.subject}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-secondary-500 truncate max-w-[180px]">
                              {item.message}
                            </p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                              {item.status === 'new' ? 'New' : 
                               item.status === 'read' ? 'Read' : 'Responded'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="col-span-2 flex flex-col h-full">
            {!selectedFeedback ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare size={48} className="text-secondary-300 mb-4" />
                <h3 className="text-lg font-medium text-secondary-700 mb-2">No Message Selected</h3>
                <p className="text-secondary-500 max-w-md">
                  Select a message from the list to view its contents and reply to the sender.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-secondary-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(selectedFeedback.type)}
                        <span className="text-sm text-secondary-600">
                          {getTypeName(selectedFeedback.type)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(selectedFeedback.status)}`}>
                          {selectedFeedback.status === 'new' ? 'New' : 
                           selectedFeedback.status === 'read' ? 'Read' : 'Responded'}
                        </span>
                      </div>
                      <h2 className="text-xl font-medium">{selectedFeedback.subject}</h2>
                    </div>
                    <div className="text-sm text-secondary-500">
                      {formatDate(selectedFeedback.created_at)}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                      {selectedFeedback.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{selectedFeedback.name}</div>
                      <div className="text-sm text-secondary-600">{selectedFeedback.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="bg-secondary-50 p-4 rounded-lg mb-4">
                    <p className="whitespace-pre-line">{selectedFeedback.message}</p>
                  </div>
                  
                  {selectedFeedback.status === 'responded' && (
                    <div className="bg-primary-50 p-4 rounded-lg border-l-4 border-primary-500 mt-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check size={16} className="text-success-600" />
                        <span className="text-secondary-700 font-medium">Response Sent</span>
                      </div>
                      <p className="text-secondary-600 text-sm">
                        A response has been sent to this message.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-secondary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-secondary-500" />
                    <span className="text-secondary-700 font-medium">Reply to {selectedFeedback.name}</span>
                  </div>
                  
                  <textarea
                    className="input w-full mb-3"
                    rows={3}
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  
                  <div className="flex justify-end">
                    <button
                      className="btn btn-primary flex items-center gap-2"
                      onClick={handleSendReply}
                      disabled={loading || !replyText.trim()}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Mail size={16} />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTab; 