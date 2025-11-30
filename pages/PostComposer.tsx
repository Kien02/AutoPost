import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { generateCaption } from '../services/geminiService';
import { Post, PostStatus } from '../types';
import { Wand2, ImagePlus, X, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PostComposer: React.FC = () => {
  const { addPost } = useStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gemini AI Handler
  const handleAIGenerate = async () => {
    if (!title) return alert("Please enter a title or topic first.");
    setIsGenerating(true);
    const caption = await generateCaption(title, 'exciting and engaging');
    setContent(caption);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const scheduledAt = scheduleDate && scheduleTime 
        ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString() 
        : null;

      const newPost: Post = {
        id: Date.now().toString(),
        userId: 'current-user', // In real app, from auth
        title,
        content,
        status: scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
        scheduledAt,
        tags: [],
        mediaUrls: media,
        createdAt: new Date().toISOString()
      };

      addPost(newPost);
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Simplified: in real app, upload to S3 here.
    // For now, we mock it by generating a local blob URL if possible or just a placeholder
    const files = Array.from(e.dataTransfer.files);
    if(files.length > 0) {
        // Cast to File (which extends Blob) to fix TS error: Argument of type 'unknown' is not assignable to parameter of type 'Blob | MediaSource'.
        const file = files[0] as File;
        const url = URL.createObjectURL(file);
        setMedia(prev => [...prev, url]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Post</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Post Title / Topic
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Sale Announcement"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>

            {/* Content with AI Button */}
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Caption & Content
                  </label>
                  <button 
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="flex items-center space-x-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14} />}
                    <span>Generate with Gemini</span>
                  </button>
              </div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
              />
              <div className="text-right text-xs text-slate-400 mt-1">{content.length} chars</div>
            </div>

            {/* Media Upload Area */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Media</label>
              <div 
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                <div className="flex flex-col items-center space-y-2 text-slate-500 dark:text-slate-400">
                  <ImagePlus size={32} />
                  <span className="text-sm">Drag and drop images/videos here</span>
                </div>
              </div>
              
              {media.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {media.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100">
                      <img src={url} alt="upload" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setMedia(media.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <CalendarIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Time</label>
                <input 
                  type="time" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                type="button"
                className="px-6 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm shadow-primary-500/30 transition-all flex items-center space-x-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                <span>{scheduleDate ? 'Schedule Post' : 'Save Draft'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Preview</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-w-sm mx-auto">
            <div className="p-4 flex items-center space-x-3 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-200"></div>
              <div>
                <div className="h-3 w-24 bg-slate-200 rounded mb-1"></div>
                <div className="h-2 w-16 bg-slate-100 rounded"></div>
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-900 aspect-square flex items-center justify-center">
               {media.length > 0 ? (
                 <img src={media[0]} className="w-full h-full object-cover" alt="preview" />
               ) : (
                 <span className="text-slate-400 text-sm">No media selected</span>
               )}
            </div>

            <div className="p-4 space-y-3">
              <div className="flex space-x-4">
                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                <span className="font-semibold mr-2">username</span>
                {content || "Your caption will appear here..."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};