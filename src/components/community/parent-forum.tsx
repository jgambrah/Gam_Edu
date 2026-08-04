'use client';

import React, { useState, useEffect } from 'react';
import { ForumPost, ForumComment, CommunicationSettings } from '@/lib/types';
import { runGeminiAiContentCheck, checkLocalToxicityFilter } from '@/lib/moderation-service';
import { 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  AlertTriangle,
  Send,
  ThumbsUp,
  Filter,
  Lock,
  UserCheck
} from 'lucide-react';

interface ParentForumProps {
  schoolId: string;
  currentUser: {
    id: string;
    name: string;
    role: 'parent' | 'teacher' | 'admin';
  };
  initialPosts?: ForumPost[];
}

export default function ParentForum({ schoolId, currentUser, initialPosts = [] }: ParentForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<'feed' | 'my_posts' | 'moderation_queue'>('feed');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'idea' | 'general' | 'event' | 'academic'>('idea');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionWarning, setSubmissionWarning] = useState<string | null>(null);

  // Comment State
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentsMap, setCommentsMap] = useState<Record<string, ForumComment[]>>({});

  const isStaffOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // Filter posts based on tab and role
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const pendingPosts = posts.filter(p => p.status === 'pending_approval');
  const myPosts = posts.filter(p => p.authorId === currentUser.id);

  // Handle New Post Submission with AI & Local Toxicity Shield
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    setSubmissionWarning(null);

    try {
      // 1. Run AI & Local Toxicity Check
      const modCheck = await runGeminiAiContentCheck(newContent, newTitle);

      if (!modCheck.isPassed) {
        setSubmissionWarning(modCheck.reason || 'Content flagged by Community Safety Guard. Please rephrase your message.');
        setIsSubmitting(false);
        return;
      }

      // 2. Create Post Object with pending_approval status
      const newPost: ForumPost = {
        id: `POST-${Date.now()}`,
        schoolId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        status: isStaffOrAdmin ? 'approved' : 'pending_approval',
        aiShieldStatus: 'passed',
        commentsCount: 0,
        likesCount: 0,
        createdAt: new Date().toISOString()
      };

      setPosts(prev => [newPost, ...prev]);
      setShowNewPostModal(false);
      setNewTitle('');
      setNewContent('');

      if (!isStaffOrAdmin) {
        alert('⏳ Idea Submitted Successfully! Your post is in the Staff Pre-Moderation Queue and will be published once approved.');
      }
    } catch (err: any) {
      alert('Failed to submit post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Staff Moderation Actions: Approve or Reject Post
  const handleModeratePost = (postId: string, newStatus: 'approved' | 'rejected', rejectionReason?: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: newStatus,
          moderatedBy: currentUser.id,
          moderatedByName: currentUser.name,
          moderatedAt: new Date().toISOString(),
          rejectionReason
        };
      }
      return p;
    }));
  };

  // Add Comment with AI Shield
  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;

    setCommentSubmitting(true);
    try {
      // Run AI Toxicity check on comment
      const modCheck = await runGeminiAiContentCheck(commentText);

      if (!modCheck.isPassed) {
        alert(modCheck.reason || 'Comment contains terms flagged for review. Please rephrase.');
        setCommentSubmitting(false);
        return;
      }

      const newComment: ForumComment = {
        id: `CMT-${Date.now()}`,
        postId,
        schoolId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: commentText.trim(),
        status: 'approved',
        aiShieldStatus: 'passed',
        createdAt: new Date().toISOString()
      };

      setCommentsMap(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));

      // Increment comment count
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
      setCommentText('');
    } catch (err: any) {
      alert('Failed to post comment: ' + err.message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      
      {/* Top Banner: Mode 4 Pre-Moderated Forum Indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 rounded-3xl border border-teal-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">Parent Community & Idea Hub</h2>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              AI & Staff Pre-Moderated
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Share constructive suggestions and ideas. Posts & comments are protected by Google Gemini AI & Staff Moderation.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Submit New Idea</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('feed')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'feed'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Approved Community Feed ({approvedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_posts')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'my_posts'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>My Submissions ({myPosts.length})</span>
        </button>

        {isStaffOrAdmin && (
          <button
            onClick={() => setActiveTab('moderation_queue')}
            className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center space-x-2 ${
              activeTab === 'moderation_queue'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Staff Review Queue</span>
            {pendingPosts.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                {pendingPosts.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* TAB 1: Approved Community Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {approvedPosts.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-10 rounded-3xl text-center space-y-2">
              <Sparkles className="w-8 h-8 text-teal-600 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-800">No Approved Posts Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first parent or staff member to submit a constructive idea or discussion topic!
              </p>
            </div>
          ) : (
            approvedPosts.map(post => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="bg-teal-50 text-teal-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-teal-100 font-mono">
                      {post.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{post.title}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">{post.content}</p>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{post.authorName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono uppercase">
                      {post.authorRole}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="text-teal-700 font-bold hover:underline flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>

                {/* Comments Expandable Section */}
                {activeCommentPostId === post.id && (
                  <div className="pt-4 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <h5 className="text-xs font-extrabold text-slate-700">Discussion Comments</h5>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(commentsMap[post.id] || []).map(cmt => (
                        <div key={cmt.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <strong className="text-slate-800">{cmt.authorName}</strong>
                            <span className="text-slate-400 font-mono">{new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-slate-700 font-sans">{cmt.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add a constructive comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-teal-600 font-sans"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={commentSubmitting}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center space-x-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Staff Review Queue */}
      {activeTab === 'moderation_queue' && isStaffOrAdmin && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-medium">
            <span>🛡️ <strong>Staff Pre-Moderation Queue</strong>: Review parent ideas before they appear publicly to the school community.</span>
            <span className="font-mono font-bold bg-amber-200 px-2 py-0.5 rounded">{pendingPosts.length} Pending</span>
          </div>

          {pendingPosts.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-800">Queue is Clear!</h4>
              <p className="text-xs text-slate-400">All submitted parent posts have been reviewed.</p>
            </div>
          ) : (
            pendingPosts.map(post => (
              <div key={post.id} className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                      Category: {post.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{post.title}</h3>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-full font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Awaiting Review</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-sans leading-relaxed">
                  {post.content}
                </p>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Submitted by: <strong>{post.authorName}</strong> ({post.authorRole})
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleModeratePost(post.id, 'rejected', 'Does not align with community guidelines')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleModeratePost(post.id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: My Submissions */}
      {activeTab === 'my_posts' && (
        <div className="space-y-4">
          {myPosts.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl text-center">
              <p className="text-xs text-slate-500">You have not submitted any ideas or discussion topics yet.</p>
            </div>
          ) : (
            myPosts.map(post => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-extrabold text-slate-900">{post.title}</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                    post.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : post.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {post.status === 'approved' ? '✓ Approved & Public' : post.status === 'rejected' ? '✕ Rejected' : '⏳ Pending Staff Review'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans">{post.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* NEW POST MODAL */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span>Submit Idea or Discussion Topic</span>
              </h3>
              <button onClick={() => setShowNewPostModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
            </div>

            {submissionWarning && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{submissionWarning}</span>
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-teal-600 font-sans"
                >
                  <option value="idea">💡 School Improvement Idea</option>
                  <option value="event">🎉 Event & Activity Suggestion</option>
                  <option value="academic">📚 Academic & Curriculum Discussion</option>
                  <option value="general">❓ General Parent Inquiry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase">Topic Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Suggestion for Annual Career Fair Setup"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-teal-600 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase">Details & Proposal</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your idea or constructive question..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-teal-600 font-sans"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center space-x-1 font-bold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI & Staff Pre-Moderation Active</span>
                </div>
                <p>Your post will be scanned for toxicity and submitted to staff review before appearing to other parents.</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all shadow-md"
                >
                  {isSubmitting ? 'Checking AI Safety...' : 'Submit to Staff Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
