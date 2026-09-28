import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
  Upload,
  Send,
  FileText,
  Image as ImageIcon,
  Film,
  Headphones,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  Check,
  X,
  AlertCircle,
  ChevronsUpDown,
  ExternalLink
} from "lucide-react";
import { BASE_URL } from "../api/api";

const getCategoryBadgeStyle = (categoryName) => {
  const cat = (categoryName || "").toLowerCase();
  if (cat.includes("anime") || cat.includes("manga")) return "bg-[#FCE7F3] text-[#9D174D]";
  if (cat.includes("gaming")) return "bg-[#DCFCE7] text-[#15803D]";
  if (cat.includes("movie") || cat.includes("tv")) return "bg-[#DBEAFE] text-[#1E40AF]";
  if (cat.includes("k-pop") || cat.includes("music")) return "bg-[#F3E8FF] text-[#7E22CE]";
  if (cat.includes("comic")) return "bg-[#FEF3C7] text-[#B45309]";
  if (cat.includes("cosplay")) return "bg-[#DCFCE7] text-[#15803D]";
  return "bg-[#F1F5F9] text-[#475569]";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Just now";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const SubmitFanContentPage = ({
  onNavigateHome,
  onNavigateArticles,
  isLoggedIn = false,
  onOpenAuth,
  onRequireLogin
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [contentType, setContentType] = useState("Article");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(["Adventure"]);
  const [tagInput, setTagInput] = useState("");

  // Media state
  const [videoSource, setVideoSource] = useState("url"); // "url" | "file"
  const [videoUrl, setVideoUrl] = useState("");
  const [imageSource, setImageSource] = useState("upload"); // "upload" | "url"
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Selected files
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null);

  // Status & UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmissionModal, setActiveSubmissionModal] = useState(null);
  const [categories, setCategories] = useState([]);

  // File input refs
  const articleFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);
  const thumbnailFileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories`);
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
          if (data.categories.length > 0 && !category) {
            setCategory(data.categories[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Load user's own submissions from database
  const loadMySubmissions = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/content/my-submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
        }
      }
    } catch (err) {
      console.error("Failed to load user submissions:", err);
    }
  };

  useEffect(() => {
    loadMySubmissions();
  }, [isLoggedIn]);

  // Rich text formatting helpers
  const handleFormatText = (tag) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = description.substring(start, end);
    let replacement = "";
    if (tag === "b") replacement = `**${selected || "bold text"}**`;
    else if (tag === "i") replacement = `*${selected || "italic text"}*`;
    else if (tag === "u") replacement = `_${selected || "underlined text"}_`;
    else if (tag === "link") replacement = `[${selected || "link title"}](url)`;
    else if (tag === "ul") replacement = `\n- ${selected || "list item"}`;
    else if (tag === "ol") replacement = `\n1. ${selected || "list item"}`;

    const newText = description.substring(0, start) + replacement + description.substring(end);
    if (newText.length <= 5000) {
      setDescription(newText);
    }
  };

  // Tags management
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Type switch cleanup
  const handleContentTypeChange = (newType) => {
    setContentType(newType);
    setSelectedFile(null);
    setSelectedFiles([]);
    setSelectedThumbnailFile(null);
    setFormError("");
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) {
      if (onRequireLogin) {
        onRequireLogin("This feature requires login");
      } else {
        if (onOpenAuth) onOpenAuth("login");
        setToastMessage("Please sign in to submit fan content.");
        setTimeout(() => setToastMessage(null), 3000);
      }
      return;
    }

    if (!title.trim()) {
      setFormError("Please enter a title for your content.");
      return;
    }
    if (!category) {
      setFormError("Please select a category.");
      return;
    }
    if (!description.trim()) {
      setFormError("Please provide a description / subtitle for your content.");
      return;
    }

    const normalizedType = contentType.toLowerCase();

    // Validate type-specific requirements
    if (normalizedType === "article") {
      if (!selectedFile) {
        setFormError("Please browse and select a PDF document for your article.");
        return;
      }
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
        setFormError("Only PDF documents (*.pdf) are allowed for articles.");
        return;
      }
    }

    if (normalizedType === "video") {
      if (videoSource === "url" && !videoUrl.trim()) {
        setFormError("Please enter a video URL (e.g. YouTube or MP4 link).");
        return;
      }
      if (videoSource === "file" && !selectedFile) {
        setFormError("Please browse and upload a video file.");
        return;
      }
    }

    if (normalizedType === "image") {
      if (imageSource === "url" && !imageUrl.trim()) {
        setFormError("Please paste an image URL.");
        return;
      }
      if (imageSource === "upload" && selectedFiles.length === 0 && !selectedFile) {
        setFormError("Please browse and upload at least one image.");
        return;
      }
    }

    if (normalizedType === "audio") {
      if (!audioUrl.trim() && !selectedFile) {
        setFormError("Please paste an audio stream URL or browse an audio file.");
        return;
      }
    }

    // Prepare FormData
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === category.toLowerCase()
    );
    const categoryId = matchedCategory ? matchedCategory._id : (categories[0]?._id || category);

    const postData = new FormData();
    postData.append("categoryId", categoryId);
    postData.append("title", title.trim());
    postData.append("type", normalizedType);
    postData.append("body", description.trim());
    postData.append("tags", tags.join(","));

    // 1. Thumbnail
    if (["article", "video", "audio"].includes(normalizedType)) {
      if (selectedThumbnailFile) {
        postData.append("thumbnailFile", selectedThumbnailFile);
      } else if (thumbnailUrl.trim()) {
        postData.append("thumbnailUrl", thumbnailUrl.trim());
      }
    }

    // 2. Article
    if (normalizedType === "article" && selectedFile) {
      postData.append("mediaFile", selectedFile);
    }
    // 3. Video
    else if (normalizedType === "video") {
      if (videoSource === "url" && videoUrl.trim()) {
        postData.append("mediaUrl", videoUrl.trim());
      } else if (videoSource === "file" && selectedFile) {
        postData.append("mediaFile", selectedFile);
      }
    }
    // 4. Image
    else if (normalizedType === "image") {
      if (imageSource === "url" && imageUrl.trim()) {
        postData.append("mediaUrl", imageUrl.trim());
      } else if (selectedFiles.length > 0) {
        for (const f of selectedFiles) {
          postData.append("mediaFile", f);
        }
      } else if (selectedFile) {
        postData.append("mediaFile", selectedFile);
      }
    }
    // 5. Audio
    else if (normalizedType === "audio") {
      if (selectedFile) {
        postData.append("mediaFile", selectedFile);
      } else if (audioUrl.trim()) {
        postData.append("mediaUrl", audioUrl.trim());
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/content/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: postData
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to submit content. Please check the fields.");
        setIsSubmitting(false);
        return;
      }

      setToastMessage("Fan content submitted successfully for administrator review!");
      setTimeout(() => setToastMessage(null), 3500);

      // Reset Form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setImageUrl("");
      setAudioUrl("");
      setThumbnailUrl("");
      setSelectedFile(null);
      setSelectedFiles([]);
      setSelectedThumbnailFile(null);
      setTags(["Adventure"]);

      // Reload real submissions list
      loadMySubmissions();
    } catch (err) {
      console.error("Submission error:", err);
      setFormError("Could not connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full py-6 px-4 sm:px-6 font-sans select-none text-[#171717]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. PAGE HEADER */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
            SUBMIT FAN CONTENT
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
            Share your articles, artwork, videos, and music with the community. Submissions are reviewed by administrators before being published.
          </p>
        </div>

        {/* 2. MAIN TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start pt-2">

          {/* LEFT 7 COLUMNS: SUBMISSION FORM */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-4.5">

              {/* Form Error Alert */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter item title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-9 shadow-2xs"
                    >
                      {categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown size={14} className="absolute right-3 top-3 text-stone-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Content Type & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Content Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={contentType}
                      onChange={(e) => handleContentTypeChange(e.target.value)}
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-9 shadow-2xs"
                    >
                      <option value="Article">Article</option>
                      <option value="Video">Video</option>
                      <option value="Audio">Audio</option>
                      <option value="Image">Image</option>
                    </select>
                    <ChevronsUpDown size={14} className="absolute right-3 top-3 text-stone-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Genre / Tags
                  </label>
                  <div className="w-full min-h-[40px] px-2.5 py-1.5 rounded-xl border border-stone-200 bg-[#FAF9F5] flex flex-wrap items-center gap-1.5 focus-within:border-[#FF5F1F] shadow-2xs">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#EBE5D8] text-stone-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 cursor-pointer text-stone-500 font-bold text-xs"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tags..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 min-w-[80px] bg-transparent text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none py-1"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Description / Subtitle with formatting toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    Description / Subtitle <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {description.length}/5000
                  </span>
                </div>

                <div className="bg-[#FAF9F5] rounded-xl border border-stone-200 overflow-hidden shadow-2xs focus-within:border-[#FF5F1F] transition-all">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-stone-200 bg-white/70">
                    <button
                      type="button"
                      onClick={() => handleFormatText("b")}
                      className="p-1.5 rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                      title="Bold"
                    >
                      <Bold size={13} className="stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("i")}
                      className="p-1.5 rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                      title="Italic"
                    >
                      <Italic size={13} className="stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("u")}
                      className="p-1.5 rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                      title="Underline"
                    >
                      <Underline size={13} className="stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("link")}
                      className="p-1.5 rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                      title="Link"
                    >
                      <LinkIcon size={13} className="stroke-[2.5]" />
                    </button>
                    <div className="w-[1px] h-3.5 bg-stone-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleFormatText("ul")}
                      className="p-1.5 rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                      title="Bullet list"
                    >
                      <List size={13} className="stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("ol")}
                      className="p-1.5 rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                      title="Numbered list"
                    >
                      <ListOrdered size={13} className="stroke-[2.5]" />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    required
                    rows={3}
                    maxLength={5000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter content summary, lore details or description..."
                    className="w-full text-xs font-medium p-3 text-stone-900 placeholder:text-stone-400 bg-transparent outline-none resize-y min-h-[90px]"
                  />
                </div>
              </div>

              {/* Row 4: Dynamic Media Asset Inputs */}
              <div className="space-y-4">

                {/* 1. Article: PDF Document Upload */}
                {contentType.toLowerCase() === "article" && (
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Article Document (PDF) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-semibold text-stone-500">
                        PDF files only
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={articleFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
                            setSelectedFile(file);
                            setFormError("");
                          } else {
                            setSelectedFile(null);
                            setFormError("Only PDF documents (.pdf) are allowed for articles");
                          }
                        }
                      }}
                      accept="application/pdf,.pdf"
                      className="hidden"
                    />

                    <div className="border border-dashed border-stone-300 bg-white rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2">
                      <FileText size={20} className="text-stone-500" />
                      <div>
                        <p className="text-xs font-bold text-stone-800">
                          Upload article document
                        </p>
                        <p className="text-[10px] font-medium text-stone-500">
                          PDF format only (*.pdf)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => articleFileInputRef.current?.click()}
                        className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer shadow-2xs"
                      >
                        BROWSE PDF ARTICLE
                      </button>

                      {selectedFile && (
                        <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                          Selected PDF: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Video: URL or File */}
                {contentType.toLowerCase() === "video" && (
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Video Source <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Choose either URL or file (not both)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-[#EAE6DE] rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoSource("url");
                          setSelectedFile(null);
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          videoSource === "url"
                            ? "bg-white text-stone-900 shadow-2xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Paste Video URL
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVideoSource("file");
                          setVideoUrl("");
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          videoSource === "file"
                            ? "bg-white text-stone-900 shadow-2xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Upload Video File
                      </button>
                    </div>

                    {videoSource === "url" ? (
                      <div>
                        <input
                          type="url"
                          placeholder="Enter video URL (e.g. YouTube, Vimeo or MP4 stream)..."
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                        />
                      </div>
                    ) : (
                      <div className="border border-dashed border-stone-300 bg-white rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2">
                        <input
                          type="file"
                          ref={videoFileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSelectedFile(file);
                          }}
                          accept="video/*"
                          className="hidden"
                        />
                        <Upload size={18} className="text-stone-500" />
                        <p className="text-xs font-bold text-stone-800">
                          Choose MP4, WebM or MKV video
                        </p>
                        <button
                          type="button"
                          onClick={() => videoFileInputRef.current?.click()}
                          className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer shadow-2xs"
                        >
                          BROWSE VIDEO
                        </button>
                        {selectedFile && (
                          <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                            Selected Video: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Image: Upload Images or URL */}
                {contentType.toLowerCase() === "image" && (
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Image Asset <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Choose either upload or image URL
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-[#EAE6DE] rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setImageSource("upload");
                          setImageUrl("");
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          imageSource === "upload"
                            ? "bg-white text-stone-900 shadow-2xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Upload Images
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImageSource("url");
                          setSelectedFiles([]);
                          setSelectedFile(null);
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          imageSource === "url"
                            ? "bg-white text-stone-900 shadow-2xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Paste Image URL
                      </button>
                    </div>

                    {imageSource === "url" ? (
                      <div>
                        <input
                          type="url"
                          placeholder="Enter image URL (e.g. https://...)..."
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                        />
                      </div>
                    ) : (
                      <div className="border border-dashed border-stone-300 bg-white rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2">
                        <input
                          type="file"
                          multiple
                          ref={imageFileInputRef}
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              setSelectedFiles(files);
                              setSelectedFile(files[0]);
                            }
                          }}
                          accept="image/*"
                          className="hidden"
                        />
                        <Upload size={18} className="text-stone-500" />
                        <p className="text-xs font-bold text-stone-800">
                          Upload one or multiple images
                        </p>
                        <p className="text-[10px] font-medium text-stone-500">
                          (JPG, PNG, WebP — multiple files allowed)
                        </p>
                        <button
                          type="button"
                          onClick={() => imageFileInputRef.current?.click()}
                          className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer shadow-2xs"
                        >
                          BROWSE IMAGES
                        </button>

                        {selectedFiles.length > 0 && (
                          <div className="w-full mt-2 space-y-1.5">
                            <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md inline-block">
                              {selectedFiles.length} image{selectedFiles.length > 1 ? "s" : ""} selected
                            </p>
                            <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto">
                              {selectedFiles.map((file, i) => (
                                <span key={i} className="text-[10px] bg-stone-200 px-2 py-0.5 rounded text-stone-700 font-semibold">
                                  {file.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Audio: Stream Link or File */}
                {contentType.toLowerCase() === "audio" && (
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2.5">
                    <label className="text-xs font-bold text-stone-800 block">
                      Audio File or Stream Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Paste audio stream URL (or select file below)..."
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                    />
                    <input
                      type="file"
                      ref={audioFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFile(file);
                      }}
                      accept="audio/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => audioFileInputRef.current?.click()}
                      className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
                    >
                      Browse Audio File (MP3, WAV)
                    </button>
                    {selectedFile && (
                      <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                        Selected Audio: {selectedFile.name}
                      </p>
                    )}
                  </div>
                )}

                {/* 5. Thumbnail Image / URL: Required for Article, Video, Audio */}
                {["article", "video", "audio"].includes(contentType.toLowerCase()) && (
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Thumbnail Image / URL <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Upload file or paste link
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Paste thumbnail image URL..."
                        value={thumbnailUrl}
                        onChange={(e) => {
                          setThumbnailUrl(e.target.value);
                          setSelectedThumbnailFile(null);
                        }}
                        className="flex-1 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                      />

                      <input
                        type="file"
                        ref={thumbnailFileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSelectedThumbnailFile(file);
                        }}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => thumbnailFileInputRef.current?.click()}
                        className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer shrink-0 shadow-2xs"
                      >
                        BROWSE THUMBNAIL
                      </button>
                    </div>

                    {selectedThumbnailFile && (
                      <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                        Selected Thumbnail: {selectedThumbnailFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 bg-[#FFA800] hover:bg-[#FFB51A] disabled:opacity-50 text-black font-extrabold text-xs sm:text-[13px] py-2.5 px-6 rounded-xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Send size={14} className="stroke-[2.5]" />
                  <span>{isSubmitting ? "Submitting..." : "Submit for review"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setVideoUrl("");
                    setImageUrl("");
                    setAudioUrl("");
                    setThumbnailUrl("");
                    setSelectedFile(null);
                    setSelectedFiles([]);
                    setSelectedThumbnailFile(null);
                    onNavigateArticles?.();
                  }}
                  className="py-2.5 px-5 rounded-xl text-xs sm:text-[13px] font-semibold text-stone-600 hover:text-black border border-stone-200 bg-white hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT 5 COLUMNS: TWO STACKED CARDS */}
          <div className="lg:col-span-5 space-y-5">

            {/* CARD 1: HOW IT WORKS */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden opacity-90 sm:opacity-95">
                <img
                  src="/src/assets/images/anime_desk_study_1790284532931.jpg"
                  alt="Anime creator at desk"
                  className="w-full h-full object-cover object-left"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-transparent" />
              </div>

              <div className="relative z-10 max-w-[270px] space-y-4">
                <div className="flex items-start gap-2">
                  <Lightbulb size={20} className="text-[#171717] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
                      How it works
                    </h3>
                    <p className="text-[10.5px] text-[#737373] font-medium leading-tight">
                      Share your content with the community in 3 simple steps.
                    </p>
                  </div>
                </div>

                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-[9px] top-2.5 bottom-2.5 w-[1.5px] bg-[#E5E7EB]" />

                  {/* Step 1 */}
                  <div className="relative flex items-start gap-2.5">
                    <div className="absolute -left-6 top-0 w-[19px] h-[19px] rounded-full bg-[#FFA800] text-black font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                      1
                    </div>
                    <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center shrink-0 text-[#171717]">
                      <FileText size={13} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717] leading-tight">Submit</h4>
                      <p className="text-[10px] text-[#737373] leading-snug mt-0.5">
                        Fill out the form and upload your media or PDF.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-2.5">
                    <div className="absolute -left-6 top-0 w-[19px] h-[19px] rounded-full bg-[#FFA800] text-black font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                      2
                    </div>
                    <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center shrink-0 text-[#171717]">
                      <ShieldCheck size={13} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717] leading-tight">Admin review</h4>
                      <p className="text-[10px] text-[#737373] leading-snug mt-0.5">
                        Our moderation team reviews your content for quality and guidelines.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-2.5">
                    <div className="absolute -left-6 top-0 w-[19px] h-[19px] rounded-full bg-[#FFA800] text-black font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                      3
                    </div>
                    <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center shrink-0 text-[#171717]">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717] leading-tight">Published</h4>
                      <p className="text-[10px] text-[#737373] leading-snug mt-0.5">
                        Once approved, your item goes live across the fandom center!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: YOUR SUBMISSIONS */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm sm:text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
                    Your submissions ({submissions.length})
                  </h3>
                  <p className="text-[10.5px] text-[#737373] font-medium leading-tight">
                    Track the status of your fan submissions in real time.
                  </p>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-stone-200 rounded-xl">
                  <p className="text-xs font-semibold text-stone-500">You haven't submitted any content yet.</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Your submitted articles and media will show up here.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6] max-h-[380px] overflow-y-auto">
                  {submissions.map((item) => {
                    const catName = item.categoryId?.name || item.category || "General";
                    const itemImg = item.thumbnailUrl || item.mediaUrl || item.images?.[0] || "/src/assets/images/aetheria_wanderer_1790282784893.jpg";
                    const statusLabel = item.status === "published" ? "Approved" : item.status === "rejected" ? "Rejected" : "Pending";

                    return (
                      <div
                        key={item._id || item.id}
                        onClick={() => setActiveSubmissionModal(item)}
                        className="py-3 flex items-center gap-3 hover:bg-stone-50/80 -mx-1 px-1 rounded-lg transition-colors cursor-pointer group"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-11 rounded-[6px] overflow-hidden shrink-0 bg-stone-900 shadow-2xs">
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Meta */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-[#171717] truncate group-hover:text-[#FF5F1F] transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[8.5px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider ${getCategoryBadgeStyle(catName)}`}>
                              {catName}
                            </span>
                            <span className="text-[9px] font-bold text-stone-400 uppercase">
                              • {item.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#9CA3AF] block mt-0.5">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {/* Status Pill & Arrow */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                              statusLabel === "Approved"
                                ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                                : statusLabel === "Rejected"
                                ? "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]"
                                : "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                            }`}
                          >
                            {statusLabel}
                          </span>
                          <ChevronRight size={14} className="text-[#A3A3A3] group-hover:text-black transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1D24] border border-[#2B2F3D] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check size={14} className="text-[#FFA800]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUBMISSION STATUS DETAIL MODAL */}
      {activeSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#181A20] border border-[#2B2F3D] text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${getCategoryBadgeStyle(activeSubmissionModal.categoryId?.name || activeSubmissionModal.category)}`}>
                {activeSubmissionModal.categoryId?.name || activeSubmissionModal.category || "Content"}
              </span>
              <button
                type="button"
                onClick={() => setActiveSubmissionModal(null)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black">
              <img
                src={activeSubmissionModal.thumbnailUrl || activeSubmissionModal.mediaUrl || activeSubmissionModal.images?.[0] || "/src/assets/images/aetheria_wanderer_1790282784893.jpg"}
                alt={activeSubmissionModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white truncate mr-2">{activeSubmissionModal.title}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    activeSubmissionModal.status === "published"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : activeSubmissionModal.status === "rejected"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {activeSubmissionModal.status === "published" ? "Approved" : activeSubmissionModal.status === "rejected" ? "Rejected" : "Pending Review"}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">{formatDate(activeSubmissionModal.createdAt)}</p>
            </div>

            {activeSubmissionModal.body && (
              <div className="bg-[#121418] p-3 rounded-lg border border-[#262A36]">
                <h5 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Your Submission Summary</h5>
                <p className="text-xs text-stone-200 line-clamp-4 leading-relaxed">{activeSubmissionModal.body}</p>
              </div>
            )}

            {activeSubmissionModal.mediaUrl && (
              <div className="text-xs flex items-center justify-between bg-stone-900/60 px-3 py-2 rounded-lg border border-white/10">
                <span className="text-stone-400 truncate max-w-[240px]">Attached Media URL / File</span>
                <a
                  href={activeSubmissionModal.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFA800] hover:underline flex items-center gap-1 font-bold text-[11px]"
                >
                  <span>View</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSubmissionModal(null)}
                className="px-4 py-1.5 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-extrabold text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SubmitFanContentPage };
