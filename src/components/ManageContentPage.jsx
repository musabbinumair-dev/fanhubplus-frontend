import { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../api/api";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
  User,
  ShoppingBag,
  Upload,
  Folder,
  X,
  ChevronsUpDown,
  Video,
  Headphones,
  Sparkles,
  Layers,
  PackageCheck,
  Clock,
  Users,
  CheckCircle2,
  FolderTree,
  Tag
} from "lucide-react";
import { AdminLoadingScreen } from "./admin/AdminLoadingScreen.jsx";


const getCategoryBadgeStyle = (cat) => {
  if (!cat) return "bg-[#F1F5F9] text-[#475569]";
  switch (cat.toUpperCase()) {
    case "ANIME":
      return "bg-[#F5EADF] text-[#B87033]";
    case "GAMING":
      return "bg-[#E2E8F0] text-[#475569]";
    case "MOVIES":
      return "bg-[#DCEEFE] text-[#0284C7]";
    case "TV SHOWS":
      return "bg-[#F3E8FF] text-[#9333EA]";
    case "K-POP":
      return "bg-[#FCE7F3] text-[#C026D3]";
    case "COMICS":
      return "bg-[#CCFBF1] text-[#0F766E]";
    case "MANGA":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "COSPLAY":
      return "bg-[#FFE4E6] text-[#E11D48]";
    default:
      return "bg-[#F1F5F9] text-[#475569]";
  }
};


const TAB_CONFIGS = {
  content: {
    label: "CONTENT",
    searchPlaceholder: "Search content by title, type, category or keyword...",
    columns: [
      { key: "thumbnail", header: "THUMBNAIL" },
      { key: "title", header: "TITLE" },
      { key: "contentType", header: "CONTENT TYPE" },
      { key: "category", header: "CATEGORY" },
      { key: "date", header: "DATE" },
      { key: "status", header: "STATUS" },
      { key: "actions", header: "ACTIONS", align: "right" }
    ]
  },
  characters: {
    label: "CHARACTERS",
    searchPlaceholder: "Search characters by name, fandom or role...",
    columns: [
      { key: "thumbnail", header: "THUMBNAIL" },
      { key: "title", header: "CHARACTER NAME" },
      { key: "fandom", header: "FANDOM" },
      { key: "bio", header: "BIO / ROLE" },
      { key: "category", header: "CATEGORY" },
      { key: "status", header: "STATUS" },
      { key: "actions", header: "ACTIONS", align: "right" }
    ]
  },
  merchandise: {
    label: "MERCHANDISE",
    searchPlaceholder: "Search merchandise by product name or tag...",
    columns: [
      { key: "thumbnail", header: "THUMBNAIL" },
      { key: "title", header: "PRODUCT NAME" },
      { key: "tag", header: "TAG" },
      { key: "releaseStatus", header: "RELEASE STATUS" },
      { key: "category", header: "CATEGORY" },
      { key: "status", header: "STATUS" },
      { key: "actions", header: "ACTIONS", align: "right" }
    ]
  },
  category: {
    label: "CATEGORY",
    searchPlaceholder: "Search categories by title or description...",
    columns: [
      { key: "thumbnail", header: "COVER" },
      { key: "title", header: "CATEGORY NAME" },
      { key: "itemCount", header: "TOTAL ITEMS" },
      { key: "description", header: "DESCRIPTION" },
      { key: "status", header: "STATUS" },
      { key: "actions", header: "ACTIONS", align: "right" }
    ]
  }
};

async function getAdminToken() {
  let token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  if (token) return token;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@fanhub.com",
        password: "AdminPassword123!"
      })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      return data.token;
    }
  } catch (err) {
    console.error("Failed to authenticate admin:", err);
  }
  return null;
}

const ManageContentPage = ({ onOpenArticle, pageTab = "content" }) => {
  const [activeTab, setActiveTab] = useState(pageTab);

  useEffect(() => {
    if (pageTab) {
      setActiveTab(pageTab);
      setSelectedCategory("All");
      setSelectedStatus("All");
      setSearchQuery("");
    }
  }, [pageTab]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const articleFileInputRef = useRef(null);

  // Store data per tab
  const [allData, setAllData] = useState({
    content: [],
    characters: [],
    merchandise: [],
    category: []
  });

  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load live categories and content from backend on mount
  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch(`${BASE_URL}/categories`);
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories) {
            setCategories(catData.categories);
            const mappedCats = catData.categories.map((c) => ({
              id: c._id,
              title: c.name,
              subtitle: c.description || "",
              description: c.description || "",
              itemCount: "Category",
              category: c.name.toUpperCase(),
              categoryBadge: getCategoryBadgeStyle(c.name),
              status: "PUBLISHED",
              statusBadge: "bg-[#DCFCE7] text-[#16A34A]",
              image: c.iconUrl || ""
            }));
            setAllData((prev) => ({ ...prev, category: mappedCats }));
          }
        }

        const contentRes = await fetch(`${BASE_URL}/content`);
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          if (contentData.contents) {
            const mapped = contentData.contents.map((item) => ({
              id: item._id,
              title: item.title,
              subtitle: item.body || "",
              contentType: item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : "Article",
              type: item.type,
              category: item.categoryId?.name ? item.categoryId.name.toUpperCase() : "ANIME",
              categoryBadge: getCategoryBadgeStyle(item.categoryId?.name || "ANIME"),
              date: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Recent",
              status: item.status ? item.status.toUpperCase() : "PUBLISHED",
              statusBadge: item.status === "published" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F5EADF] text-[#B87033]",
              image: item.thumbnailUrl || item.mediaUrl || ""
            }));
            setAllData((prev) => ({ ...prev, content: mapped }));
          }
        }

        const charRes = await fetch(`${BASE_URL}/characters`);
        if (charRes.ok) {
          const charData = await charRes.json();
          if (charData.characters) {
            const mappedChars = charData.characters.map((ch) => ({
              id: ch._id,
              title: ch.name,
              subtitle: ch.bio || "",
              bio: ch.bio || "",
              fandom: ch.tags?.[0] || ch.categoryId?.name || "General",
              category: ch.categoryId?.name ? ch.categoryId.name.toUpperCase() : "ANIME",
              categoryBadge: getCategoryBadgeStyle(ch.categoryId?.name || "ANIME"),
              tags: ch.tags || [],
              status: "PUBLISHED",
              statusBadge: "bg-[#DCFCE7] text-[#16A34A]",
              image: ch.imageUrl || ""
            }));
            setAllData((prev) => ({ ...prev, characters: mappedChars }));
          }
        }

        const merchRes = await fetch(`${BASE_URL}/merchandise`);
        if (merchRes.ok) {
          const merchData = await merchRes.json();
          if (merchData.merchandise) {
            const mappedMerch = merchData.merchandise.map((m) => ({
              id: m._id,
              title: m.name,
              subtitle: m.tag || "Merchandise",
              tag: m.tag || "Collectible",
              releaseStatus: m.isUpcoming ? "Pre-Order" : "In Stock",
              isUpcoming: Boolean(m.isUpcoming),
              category: m.categoryId?.name ? m.categoryId.name.toUpperCase() : "ANIME",
              categoryBadge: getCategoryBadgeStyle(m.categoryId?.name || "ANIME"),
              status: m.isUpcoming ? "PRE-ORDER" : "PUBLISHED",
              statusBadge: m.isUpcoming ? "bg-[#F5EADF] text-[#B87033]" : "bg-[#DCFCE7] text-[#16A34A]",
              image: m.imageUrl || ""
            }));
            setAllData((prev) => ({ ...prev, merchandise: mappedMerch }));
          }
        }
      } catch (err) {
        console.error("Failed to load backend data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Modal Form State
  const [modalType, setModalType] = useState("content");
  const [formData, setFormData] = useState({
    title: "",
    category: "Anime",
    contentType: "Article",
    mediaType: "Article",
    duration: "",
    fandom: "",
    roleTitle: "",
    tag: "Collectible",
    releaseStatus: "In Stock",
    tags: [],
    tagInput: "",
    releaseDate: "",
    popularityScore: "",
    description: "",
    status: "Published",
    image: ""
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const currentTabItems = allData[activeTab] || [];
  const filteredList = currentTabItems.filter((item) => {
    let matchesCategory = true;
    if (selectedCategory !== "All") {
      if (activeTab === "category") {
        matchesCategory = item.title?.toLowerCase() === selectedCategory.toLowerCase();
      } else {
        matchesCategory = item.category?.toLowerCase() === selectedCategory.toLowerCase();
      }
    }

    let matchesStatus = true;
    if (selectedStatus !== "All") {
      matchesStatus = item.status?.toLowerCase() === selectedStatus.toLowerCase();
    }

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = item.title && item.title.toLowerCase().includes(q);
      const subMatch = item.subtitle && item.subtitle.toLowerCase().includes(q);
      const bioMatch = item.bio && item.bio.toLowerCase().includes(q);
      const tagMatch = item.tag && item.tag.toLowerCase().includes(q);
      const descMatch = item.description && item.description.toLowerCase().includes(q);
      matchesSearch = Boolean(titleMatch || subMatch || bioMatch || tagMatch || descMatch);
    }

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setModalType(activeTab);
    setSelectedFile(null);
    setSelectedFiles([]);
    setSelectedThumbnailFile(null);
    setFormError("");

    if (activeTab === "characters") {
      setFormData({
        title: "",
        category: categories[0]?.name || "Anime",
        description: "",
        tags: ["Hero"],
        tagInput: "",
        image: "",
        imageUrl: "",
        imageSource: "upload",
        status: "Published"
      });
    } else if (activeTab === "merchandise") {
      setFormData({
        title: "",
        category: categories[0]?.name || "Anime",
        tag: "Collectible",
        tags: ["Collectible"],
        isUpcoming: false,
        image: "",
        imageUrl: "",
        imageSource: "upload",
        status: "Published"
      });
    } else if (activeTab === "category") {
      setFormData({
        title: "Anime",
        category: "Anime",
        description: "",
        iconUrl: "",
        imageUrl: "",
        imageSource: "url",
        status: "Published"
      });
    } else {
      setFormData({
        title: "",
        category: categories[0]?.name || "Anime",
        contentType: "Article",
        mediaType: "Article",
        tags: ["Adventure"],
        tagInput: "",
        description: "",
        status: "Published",
        image: "",
        thumbnailUrl: "",
        videoUrl: "",
        videoSource: "url",
        imageSource: "upload",
        imageUrl: "",
        audioUrl: ""
      });
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setModalType(activeTab);
    setSelectedFile(null);
    setSelectedFiles([]);
    setSelectedThumbnailFile(null);
    setFormError("");

    if (activeTab === "characters") {
      setFormData({
        title: item.title,
        category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase() : "Anime",
        description: item.bio || item.subtitle || "",
        tags: item.tags || ["Hero"],
        tagInput: "",
        image: item.image || "",
        imageUrl: item.image || "",
        imageSource: item.image ? "url" : "upload",
        status: "Published"
      });
    } else if (activeTab === "merchandise") {
      setFormData({
        title: item.title,
        category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase() : "Anime",
        tag: item.tag || "Collectible",
        isUpcoming: Boolean(item.isUpcoming),
        tags: [item.tag || "Collectible"],
        image: item.image || "",
        imageUrl: item.image || "",
        imageSource: item.image ? "url" : "upload",
        status: item.isUpcoming ? "Draft" : "Published"
      });
    } else if (activeTab === "category") {
      setFormData({
        title: item.title,
        category: item.category || item.title,
        description: item.description || item.subtitle || "",
        iconUrl: item.image || "",
        imageUrl: item.image || "",
        image: item.image || "",
        imageSource: "url",
        status: "Published"
      });
    } else {
      setFormData({
        title: item.title,
        category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase() : "Anime",
        contentType: item.contentType || item.type || "Article",
        mediaType: item.type || "Article",
        tags: item.tags || ["Adventure"],
        tagInput: "",
        description: item.subtitle || item.description || item.bio || "",
        status: item.status === "DRAFT" || item.status === "Draft" ? "Draft" : "Published",
        image: item.image || "",
        thumbnailUrl: item.thumbnailUrl || "",
        videoUrl: item.type === "video" ? (item.mediaUrl || "") : "",
        videoSource: "url",
        imageSource: "upload",
        imageUrl: item.type === "image" ? (item.mediaUrl || "") : "",
        audioUrl: item.type === "audio" ? (item.mediaUrl || "") : ""
      });
    }
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (modalType === "content") {
      setIsSubmitting(true);
      setFormError("");

      try {
        const token = await getAdminToken();

        let matchedCat = categories.find(
          (c) => c.name.toLowerCase() === formData.category.toLowerCase()
        );
        let categoryId = matchedCat ? matchedCat._id : (categories[0]?._id || "");

        let normalizedType = formData.contentType.toLowerCase();
        if (normalizedType === "trailer") normalizedType = "video";
        if (normalizedType === "media" || normalizedType === "wiki / review") normalizedType = "article";

        // Strict PDF validation for article
        if (normalizedType === "article") {
          if (!selectedFile) {
            setFormError("Please upload a PDF document for this article");
            setIsSubmitting(false);
            return;
          }
          if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
            setFormError("Only PDF documents (.pdf) are allowed for articles");
            setIsSubmitting(false);
            return;
          }
        }

        if (normalizedType === "video") {
          if (formData.videoSource === "url" && !formData.videoUrl.trim()) {
            setFormError("Please enter a video URL");
            setIsSubmitting(false);
            return;
          }
          if (formData.videoSource === "file" && !selectedFile) {
            setFormError("Please choose a video file to upload");
            setIsSubmitting(false);
            return;
          }
        }

        if (normalizedType === "image") {
          if (formData.imageSource === "url" && !formData.imageUrl?.trim()) {
            setFormError("Please enter an image URL");
            setIsSubmitting(false);
            return;
          }
          if (formData.imageSource !== "url" && selectedFiles.length === 0 && !selectedFile) {
            setFormError("Please select at least one image to upload");
            setIsSubmitting(false);
            return;
          }
        }

        const postData = new FormData();
        postData.append("categoryId", categoryId);
        postData.append("title", formData.title);
        postData.append("type", normalizedType);
        postData.append("body", formData.description || "");
        postData.append("tags", formData.tags.join(","));
        postData.append("status", formData.status === "Published" ? "published" : "pending");

        // 1. Thumbnail image / URL: Only for Article, Video, Audio (NEVER for Image)
        if (["article", "video", "audio"].includes(normalizedType)) {
          if (selectedThumbnailFile) {
            postData.append("thumbnailFile", selectedThumbnailFile);
          } else if (formData.thumbnailUrl && formData.thumbnailUrl.trim()) {
            postData.append("thumbnailUrl", formData.thumbnailUrl.trim());
          }
        }

        // 2. Article handling: ONLY file upload allowed, NO article URL
        if (normalizedType === "article") {
          if (selectedFile) {
            postData.append("mediaFile", selectedFile);
          }
        }
        // 3. Video handling: URL or File (mutually exclusive)
        else if (normalizedType === "video") {
          if (formData.videoSource === "url" && formData.videoUrl.trim()) {
            postData.append("mediaUrl", formData.videoUrl.trim());
          } else if (formData.videoSource === "file" && selectedFile) {
            postData.append("mediaFile", selectedFile);
          }
        }
        // 4. Image handling: Upload Multiple Images or Image URL
        else if (normalizedType === "image") {
          if (formData.imageSource === "url" && formData.imageUrl?.trim()) {
            postData.append("mediaUrl", formData.imageUrl.trim());
          } else if (selectedFiles.length > 0) {
            for (const img of selectedFiles) {
              postData.append("mediaFile", img);
            }
          } else if (selectedFile) {
            postData.append("mediaFile", selectedFile);
          }
        }
        // 5. Audio handling
        else if (normalizedType === "audio") {
          if (selectedFile) {
            postData.append("mediaFile", selectedFile);
          } else if (formData.audioUrl && formData.audioUrl.trim()) {
            postData.append("mediaUrl", formData.audioUrl.trim());
          }
        }
        // Fallback default
        else {
          if (selectedFile) {
            postData.append("mediaFile", selectedFile);
          }
        }

        const res = await fetch(`${BASE_URL}/content`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: postData
        });

        const data = await res.json();

        if (res.ok && data.content) {
          const created = data.content;
          const newItem = {
            id: created._id,
            title: created.title,
            subtitle: created.body || "",
            contentType: created.type ? (created.type.charAt(0).toUpperCase() + created.type.slice(1)) : "Article",
            type: created.type,
            category: created.categoryId?.name ? created.categoryId.name.toUpperCase() : formData.category.toUpperCase(),
            categoryBadge: getCategoryBadgeStyle(created.categoryId?.name || formData.category),
            date: "Today",
            status: created.status ? created.status.toUpperCase() : "PUBLISHED",
            statusBadge: created.status === "published" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F5EADF] text-[#B87033]",
            image: created.thumbnailUrl || created.mediaUrl || formData.image || ""
          };

          setAllData((prev) => ({
            ...prev,
            content: [newItem, ...prev.content]
          }));

          setIsAddModalOpen(false);
          setSelectedFile(null);
          setSelectedFiles([]);
          setSelectedThumbnailFile(null);
        } else {
          setFormError(data.message || "Failed to create content item");
        }
      } catch (err) {
        console.error("Error creating content:", err);
        setFormError("Could not connect to the server. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (modalType === "characters") {
      setIsSubmitting(true);
      setFormError("");

      try {
        const token = await getAdminToken();
        let matchedCat = categories.find(
          (c) => c.name?.toLowerCase() === (formData.category || "").toLowerCase() || c._id === formData.category
        );
        let categoryId = matchedCat ? matchedCat._id : (categories[0]?._id || "");

        if (!categoryId) {
          try {
            const catRes = await fetch(`${BASE_URL}/categories`);
            if (catRes.ok) {
              const catData = await catRes.json();
              if (catData.categories && catData.categories.length > 0) {
                setCategories(catData.categories);
                let matched = catData.categories.find(
                  (c) => c.name?.toLowerCase() === (formData.category || "").toLowerCase()
                );
                categoryId = matched ? matched._id : catData.categories[0]._id;
              }
            }
          } catch (e) {
            console.error(e);
          }
        }

        const postData = new FormData();
        if (categoryId) postData.append("categoryId", categoryId);
        postData.append("category", formData.category || "Anime");
        postData.append("name", formData.title || "");
        postData.append("title", formData.title || "");
        postData.append("bio", formData.description || "");
        postData.append("tags", formData.tags.join(","));

        if (selectedFile) {
          postData.append("image", selectedFile);
        } else if (formData.imageUrl && formData.imageUrl.trim()) {
          postData.append("imageUrl", formData.imageUrl.trim());
        }

        const res = await fetch(`${BASE_URL}/characters`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: postData
        });

        const data = await res.json();
        if (res.ok && data.character) {
          const ch = data.character;
          const newChar = {
            id: ch._id,
            title: ch.name,
            subtitle: ch.bio || "",
            bio: ch.bio || "",
            fandom: ch.tags?.[0] || formData.category,
            category: formData.category.toUpperCase(),
            categoryBadge: getCategoryBadgeStyle(formData.category),
            tags: ch.tags || formData.tags,
            status: "PUBLISHED",
            statusBadge: "bg-[#DCFCE7] text-[#16A34A]",
            image: ch.imageUrl || formData.imageUrl || ""
          };
          setAllData((prev) => ({
            ...prev,
            characters: [newChar, ...prev.characters]
          }));
          setIsAddModalOpen(false);
          setSelectedFile(null);
        } else {
          setFormError(data.message || "Failed to create character");
        }
      } catch (err) {
        console.error("Error creating character:", err);
        setFormError("Could not connect to the server.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (modalType === "merchandise") {
      setIsSubmitting(true);
      setFormError("");

      try {
        const token = await getAdminToken();
        let matchedCat = categories.find(
          (c) => c.name?.toLowerCase() === (formData.category || "").toLowerCase() || c._id === formData.category
        );
        let categoryId = matchedCat ? matchedCat._id : (categories[0]?._id || "");

        if (!categoryId) {
          try {
            const catRes = await fetch(`${BASE_URL}/categories`);
            if (catRes.ok) {
              const catData = await catRes.json();
              if (catData.categories && catData.categories.length > 0) {
                setCategories(catData.categories);
                let matched = catData.categories.find(
                  (c) => c.name?.toLowerCase() === (formData.category || "").toLowerCase()
                );
                categoryId = matched ? matched._id : catData.categories[0]._id;
              }
            }
          } catch (e) {
            console.error(e);
          }
        }

        const validTags = ["Limited Edition", "Pre-Order", "Collectible"];
        let chosenTag = formData.tag || "Collectible";
        if (!validTags.includes(chosenTag)) {
          chosenTag = "Collectible";
        }

        const postData = new FormData();
        if (categoryId) postData.append("categoryId", categoryId);
        postData.append("category", formData.category || "Anime");
        postData.append("name", formData.title || "");
        postData.append("title", formData.title || "");
        postData.append("tag", chosenTag);
        postData.append("isUpcoming", formData.isUpcoming ? "true" : "false");

        if (selectedFile) {
          postData.append("image", selectedFile);
        } else if (formData.imageUrl && formData.imageUrl.trim()) {
          postData.append("imageUrl", formData.imageUrl.trim());
        }

        const res = await fetch(`${BASE_URL}/merchandise`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: postData
        });

        const data = await res.json();
        if (res.ok && data.merchandise) {
          const m = data.merchandise;
          const newMerch = {
            id: m._id,
            title: m.name,
            subtitle: m.tag || "Merchandise",
            tag: m.tag || chosenTag,
            releaseStatus: m.isUpcoming ? "Pre-Order" : "In Stock",
            isUpcoming: Boolean(m.isUpcoming),
            category: formData.category.toUpperCase(),
            categoryBadge: getCategoryBadgeStyle(formData.category),
            status: m.isUpcoming ? "PRE-ORDER" : "PUBLISHED",
            statusBadge: m.isUpcoming ? "bg-[#F5EADF] text-[#B87033]" : "bg-[#DCFCE7] text-[#16A34A]",
            image: m.imageUrl || formData.imageUrl || ""
          };
          setAllData((prev) => ({
            ...prev,
            merchandise: [newMerch, ...prev.merchandise]
          }));
          setIsAddModalOpen(false);
          setSelectedFile(null);
        } else {
          setFormError(data.message || "Failed to create merchandise");
        }
      } catch (err) {
        console.error("Error creating merchandise:", err);
        setFormError("Could not connect to the server.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (modalType === "category") {
      setIsSubmitting(true);
      setFormError("");

      try {
        const token = await getAdminToken();
        const postData = new FormData();
        const catName = formData.title.trim();
        const slug = catName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        postData.append("name", catName);
        postData.append("slug", slug);
        postData.append("description", formData.description || "");

        if (selectedFile) {
          postData.append("icon", selectedFile);
        } else if (formData.iconUrl && formData.iconUrl.trim()) {
          postData.append("iconUrl", formData.iconUrl.trim());
        }

        const res = await fetch(`${BASE_URL}/categories`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: postData
        });

        const data = await res.json();
        if (res.ok && data.category) {
          const c = data.category;
          const newCat = {
            id: c._id,
            title: c.name,
            subtitle: c.description || "",
            description: c.description || "",
            itemCount: "Category",
            category: c.name.toUpperCase(),
            categoryBadge: getCategoryBadgeStyle(c.name),
            status: "PUBLISHED",
            statusBadge: "bg-[#DCFCE7] text-[#16A34A]",
            image: c.iconUrl || ""
          };
          setAllData((prev) => ({
            ...prev,
            category: [newCat, ...prev.category]
          }));
          setCategories((prev) => [...prev, c]);
          setIsAddModalOpen(false);
          setSelectedFile(null);
        } else {
          setFormError(data.message || "Failed to create category");
        }
      } catch (err) {
        console.error("Error creating category:", err);
        setFormError("Could not connect to the server.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem || !formData.title) return;

    if (modalType === "characters") {
      if (editingItem.id) {
        setIsSubmitting(true);
        setFormError("");

        try {
          const token = await getAdminToken();
          let matchedCat = categories.find(
            (c) => c.name?.toLowerCase() === (formData.category || "").toLowerCase() || c._id === formData.category
          );
          let categoryId = matchedCat ? matchedCat._id : (categories[0]?._id || "");

          const postData = new FormData();
          if (categoryId) postData.append("categoryId", categoryId);
          postData.append("category", formData.category || "Anime");
          postData.append("name", formData.title || "");
          postData.append("title", formData.title || "");
          postData.append("bio", formData.description || "");
          postData.append("tags", formData.tags.join(","));

          if (selectedFile) {
            postData.append("image", selectedFile);
          } else if (formData.imageUrl && formData.imageUrl.trim()) {
            postData.append("imageUrl", formData.imageUrl.trim());
          }

          const res = await fetch(`${BASE_URL}/characters/${editingItem.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: postData
          });

          const data = await res.json();
          if (!res.ok) {
            setFormError(data.message || "Failed to update character");
            setIsSubmitting(false);
            return;
          }

          if (data.character) {
            const ch = data.character;
            setAllData((prev) => ({
              ...prev,
              characters: prev.characters.map((item) => {
                if (item.id === editingItem.id) {
                  return {
                    ...item,
                    title: ch.name,
                    subtitle: ch.bio || "",
                    bio: ch.bio || "",
                    fandom: ch.tags?.[0] || formData.category,
                    category: formData.category.toUpperCase(),
                    categoryBadge: getCategoryBadgeStyle(formData.category),
                    tags: ch.tags || formData.tags,
                    image: ch.imageUrl || item.image
                  };
                }
                return item;
              })
            }));
            setEditingItem(null);
            setSelectedFile(null);
            setIsSubmitting(false);
            return;
          }
        } catch (err) {
          console.error("Error updating character:", err);
          setFormError("Could not connect to the server.");
          setIsSubmitting(false);
          return;
        } finally {
          setIsSubmitting(false);
        }
      }
      return;
    }

    if (modalType === "merchandise") {
      if (editingItem.id) {
        setIsSubmitting(true);
        setFormError("");

        try {
          const token = await getAdminToken();
          let matchedCat = categories.find(
            (c) => c.name?.toLowerCase() === (formData.category || "").toLowerCase() || c._id === formData.category
          );
          let categoryId = matchedCat ? matchedCat._id : (categories[0]?._id || "");

          const validTags = ["Limited Edition", "Pre-Order", "Collectible"];
          let chosenTag = formData.tag || "Collectible";
          if (!validTags.includes(chosenTag)) {
            chosenTag = "Collectible";
          }

          const postData = new FormData();
          if (categoryId) postData.append("categoryId", categoryId);
          postData.append("category", formData.category || "Anime");
          postData.append("name", formData.title || "");
          postData.append("title", formData.title || "");
          postData.append("tag", chosenTag);
          postData.append("isUpcoming", formData.isUpcoming ? "true" : "false");

          if (selectedFile) {
            postData.append("image", selectedFile);
          } else if (formData.imageUrl && formData.imageUrl.trim()) {
            postData.append("imageUrl", formData.imageUrl.trim());
          }

          const res = await fetch(`${BASE_URL}/merchandise/${editingItem.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: postData
          });

          const data = await res.json();
          if (!res.ok) {
            setFormError(data.message || "Failed to update merchandise");
            setIsSubmitting(false);
            return;
          }

          if (data.merchandise) {
            const m = data.merchandise;
            setAllData((prev) => ({
              ...prev,
              merchandise: prev.merchandise.map((item) => {
                if (item.id === editingItem.id) {
                  return {
                    ...item,
                    title: m.name,
                    subtitle: m.tag || "Merchandise",
                    tag: m.tag || chosenTag,
                    releaseStatus: m.isUpcoming ? "Pre-Order" : "In Stock",
                    isUpcoming: Boolean(m.isUpcoming),
                    category: formData.category.toUpperCase(),
                    categoryBadge: getCategoryBadgeStyle(formData.category),
                    status: m.isUpcoming ? "PRE-ORDER" : "PUBLISHED",
                    statusBadge: m.isUpcoming ? "bg-[#F5EADF] text-[#B87033]" : "bg-[#DCFCE7] text-[#16A34A]",
                    image: m.imageUrl || item.image
                  };
                }
                return item;
              })
            }));
            setEditingItem(null);
            setSelectedFile(null);
            setIsSubmitting(false);
            return;
          }
        } catch (err) {
          console.error("Error updating merchandise:", err);
          setFormError("Could not connect to the server.");
          setIsSubmitting(false);
          return;
        } finally {
          setIsSubmitting(false);
        }
      }
      return;
    }

    if (modalType === "category") {
      if (editingItem.id) {
        setIsSubmitting(true);
        setFormError("");

        try {
          const token = await getAdminToken();
          const postData = new FormData();
          const catName = formData.title.trim();
          const slug = catName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          postData.append("name", catName);
          postData.append("slug", slug);
          postData.append("description", formData.description || "");

          if (selectedFile) {
            postData.append("icon", selectedFile);
          } else if (formData.iconUrl && formData.iconUrl.trim()) {
            postData.append("iconUrl", formData.iconUrl.trim());
          }

          const res = await fetch(`${BASE_URL}/categories/${editingItem.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: postData
          });

          const data = await res.json();
          if (!res.ok) {
            setFormError(data.message || "Failed to update category");
            setIsSubmitting(false);
            return;
          }

          if (data.category) {
            const c = data.category;
            setAllData((prev) => ({
              ...prev,
              category: prev.category.map((item) => {
                if (item.id === editingItem.id) {
                  return {
                    ...item,
                    title: c.name,
                    subtitle: c.description || "",
                    description: c.description || "",
                    category: c.name.toUpperCase(),
                    categoryBadge: getCategoryBadgeStyle(c.name),
                    image: c.iconUrl || item.image
                  };
                }
                return item;
              })
            }));
            setCategories((prev) =>
              prev.map((cItem) => (cItem._id === editingItem.id ? data.category : cItem))
            );
            setEditingItem(null);
            setSelectedFile(null);
            setIsSubmitting(false);
            return;
          }
        } catch (err) {
          console.error("Error updating category:", err);
          setFormError("Could not connect to the server.");
          setIsSubmitting(false);
          return;
        } finally {
          setIsSubmitting(false);
        }
      }
      return;
    }

    if (modalType === "content") {
      setIsSubmitting(true);
      setFormError("");

      try {
        const token = await getAdminToken();

        let matchedCat = categories.find(
          (c) => c.name.toLowerCase() === formData.category.toLowerCase()
        );
        let categoryId = matchedCat ? matchedCat._id : (categories[0]?._id || "");

        let normalizedType = formData.contentType.toLowerCase();
        if (normalizedType === "trailer") normalizedType = "video";
        if (normalizedType === "media" || normalizedType === "wiki / review") normalizedType = "article";

        // Validate PDF if user selected a new file for article
        if (normalizedType === "article" && selectedFile) {
          if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
            setFormError("Only PDF documents (.pdf) are allowed for articles");
            setIsSubmitting(false);
            return;
          }
        }

        const postData = new FormData();
        postData.append("categoryId", categoryId);
        postData.append("title", formData.title);
        postData.append("type", normalizedType);
        postData.append("body", formData.description || "");
        postData.append("tags", formData.tags.join(","));
        postData.append("status", formData.status === "Published" ? "published" : "pending");

        // 1. Thumbnail image / URL (only for Article, Video, Audio)
        if (["article", "video", "audio"].includes(normalizedType)) {
          if (selectedThumbnailFile) {
            postData.append("thumbnailFile", selectedThumbnailFile);
          } else if (formData.thumbnailUrl && formData.thumbnailUrl.trim()) {
            postData.append("thumbnailUrl", formData.thumbnailUrl.trim());
          }
        }

        // 2. Article media file (PDF)
        if (normalizedType === "article") {
          if (selectedFile) {
            postData.append("mediaFile", selectedFile);
          }
        }
        // 3. Video handling (URL or File)
        else if (normalizedType === "video") {
          if (formData.videoSource === "url" && formData.videoUrl.trim()) {
            postData.append("mediaUrl", formData.videoUrl.trim());
          } else if (formData.videoSource === "file" && selectedFile) {
            postData.append("mediaFile", selectedFile);
          }
        }
        // 4. Image handling (URL or File)
        else if (normalizedType === "image") {
          if (formData.imageSource === "url" && formData.imageUrl?.trim()) {
            postData.append("mediaUrl", formData.imageUrl.trim());
          } else if (selectedFiles.length > 0) {
            for (const img of selectedFiles) {
              postData.append("mediaFile", img);
            }
          } else if (selectedFile) {
            postData.append("mediaFile", selectedFile);
          }
        }
        // 5. Audio handling
        else if (normalizedType === "audio") {
          if (selectedFile) {
            postData.append("mediaFile", selectedFile);
          } else if (formData.audioUrl && formData.audioUrl.trim()) {
            postData.append("mediaUrl", formData.audioUrl.trim());
          }
        }

        if (editingItem.id) {
          const res = await fetch(`${BASE_URL}/content/${editingItem.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: postData
          });

          const data = await res.json();
          if (!res.ok) {
            setFormError(data.message || "Failed to update content item");
            setIsSubmitting(false);
            return;
          }

          if (data.content) {
            const updated = data.content;
            setAllData((prev) => ({
              ...prev,
              content: prev.content.map((item) => {
                if (item.id === editingItem.id) {
                  return {
                    ...item,
                    title: updated.title,
                    subtitle: updated.body || "",
                    contentType: updated.type ? (updated.type.charAt(0).toUpperCase() + updated.type.slice(1)) : "Article",
                    type: updated.type,
                    category: updated.categoryId?.name ? updated.categoryId.name.toUpperCase() : formData.category.toUpperCase(),
                    categoryBadge: getCategoryBadgeStyle(updated.categoryId?.name || formData.category),
                    status: updated.status ? updated.status.toUpperCase() : "PUBLISHED",
                    statusBadge: updated.status === "published" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F5EADF] text-[#B87033]",
                    image: updated.thumbnailUrl || updated.mediaUrl || item.image
                  };
                }
                return item;
              })
            }));
            setEditingItem(null);
            setSelectedFile(null);
            setSelectedFiles([]);
            setSelectedThumbnailFile(null);
            return;
          }
        }
      } catch (err) {
        console.error("Error updating content:", err);
        setFormError("Could not connect to the server. Please try again.");
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    try {
      const token = await getAdminToken();
      let deleteUrl = "";

      if (activeTab === "content") {
        deleteUrl = `${BASE_URL}/content/${deletingItem.id}`;
      } else if (activeTab === "characters") {
        deleteUrl = `${BASE_URL}/characters/${deletingItem.id}`;
      } else if (activeTab === "merchandise") {
        deleteUrl = `${BASE_URL}/merchandise/${deletingItem.id}`;
      } else if (activeTab === "category") {
        deleteUrl = `${BASE_URL}/categories/${deletingItem.id}`;
      }

      if (deleteUrl) {
        const res = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const errData = await res.json();
          console.warn("Delete warning from server:", errData.message);
        }
      }
    } catch (err) {
      console.error("Error deleting item from server:", err);
    }

    setAllData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((item) => item.id !== deletingItem.id)
    }));
    if (activeTab === "category") {
      setCategories((prev) => prev.filter((c) => c._id !== deletingItem.id));
    }
    setDeletingItem(null);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && formData.tagInput.trim()) {
      e.preventDefault();
      const newTag = formData.tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
          tagInput: ""
        });
      } else {
        setFormData({
          ...formData,
          tagInput: ""
        });
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tagToRemove)
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: objectUrl
      }));
    }
  };

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      const firstPreview = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        image: firstPreview
      }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedThumbnailFile(file);
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: ""
      }));
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        videoUrl: ""
      }));
    }
  };

  const currentConfig = TAB_CONFIGS[activeTab] || TAB_CONFIGS.content;

  // Helper to render cell content dynamically based on column key
  const renderCellContent = (item, colKey) => {
    switch (colKey) {
      case "thumbnail":
        return (
          <div
            onClick={() => onOpenArticle && onOpenArticle(item)}
            className="w-16 h-10 rounded-none overflow-hidden border border-[#EBE6DD] bg-stone-900 cursor-pointer shrink-0 flex items-center justify-center text-white/40"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Folder size={16} />
            )}
          </div>
        );

      case "title":
        return (
          <div onClick={() => onOpenArticle && onOpenArticle(item)} className="cursor-pointer">
            <h3 className="font-extrabold text-xs text-[#171717] group-hover:text-[#FF5F1F] transition-colors line-clamp-1">
              {item.title}
            </h3>
            <p className="text-[11px] font-semibold text-[#7A6F64] line-clamp-1 mt-0.5">
              {item.subtitle || item.description || item.bio}
            </p>
          </div>
        );

      case "contentType":
        return (
          <span className="text-xs font-bold text-[#171717] bg-[#EAE6DE] px-2.5 py-1 rounded-none uppercase text-[10px] tracking-wider inline-block">
            {item.contentType || item.type || "Article"}
          </span>
        );

      case "category":
        return (
          <span className={`text-[10px] font-black px-3 py-1 rounded-none uppercase tracking-wider inline-block ${item.categoryBadge}`}>
            {item.category}
          </span>
        );

      case "date":
        return <span className="text-xs font-semibold text-[#7A6F64]">{item.date || "May 28, 2025"}</span>;

      case "fandom":
        return <span className="text-xs font-bold text-[#171717]">{item.fandom}</span>;

      case "bio":
        return <span className="text-xs font-semibold text-[#7A6F64] line-clamp-1">{item.bio}</span>;

      case "tag":
        return <span className="text-xs font-bold text-[#171717]">{item.tag}</span>;

      case "releaseStatus":
        return (
          <span className="text-xs font-bold text-[#FF5F1F] bg-[#FFF2ED] px-2.5 py-1 rounded-none inline-block">
            {item.releaseStatus}
          </span>
        );

      case "itemCount":
        return <span className="text-xs font-extrabold text-[#171717]">{item.itemCount || "100+ items"}</span>;

      case "description":
        return <span className="text-xs font-semibold text-[#7A6F64] line-clamp-1">{item.description || item.subtitle}</span>;

      case "status":
        return (
          <span className={`text-[10px] font-black px-3 py-1 rounded-none uppercase tracking-wider inline-block ${item.statusBadge}`}>
            {item.status}
          </span>
        );

      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleOpenEditModal(item)}
              className="p-1.5 rounded-none border border-[#EDE4D6] bg-white hover:bg-[#F7F2EA] text-[#171717] transition-colors cursor-pointer shadow-2xs"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => setDeletingItem(item)}
              className="p-1.5 rounded-none border border-[#EDE4D6] bg-white hover:bg-[#FFEBEB] text-[#E11D48] transition-colors cursor-pointer shadow-2xs"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const getPageHeaderInfo = () => {
    switch (activeTab) {
      case "characters":
        return {
          title: "MANAGE CHARACTERS",
          subtitle: "Add, edit and remove character profiles, roles, lore and artwork."
        };
      case "merchandise":
        return {
          title: "MANAGE MERCHANDISE",
          subtitle: "Add, edit and manage shop merchandise, collectibles, and pre-orders."
        };
      case "category":
        return {
          title: "MANAGE CATEGORIES",
          subtitle: "Add, edit and manage fandom categories, covers, and descriptions."
        };
      case "content":
      default:
        return {
          title: "MANAGE CONTENT",
          subtitle: "Add, edit and remove articles, videos, audios, trailers, and images."
        };
    }
  };

  const renderAnalyticsCards = () => {
    if (activeTab === "content") {
      const total = allData.content.length;
      const articles = allData.content.filter((i) => (i.type || i.contentType || "").toLowerCase() === "article").length;
      const videos = allData.content.filter((i) => (i.type || i.contentType || "").toLowerCase() === "video").length;
      const audios = allData.content.filter((i) => ["audio", "image", "multimedia"].includes((i.type || i.contentType || "").toLowerCase())).length;

      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FFF2ED] text-[#FF5F1F] flex items-center justify-center shrink-0">
              <FileText size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">TOTAL CONTENT</p>
              <p className="text-xl font-black text-[#171717]">{total}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <FileText size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">ARTICLES</p>
              <p className="text-xl font-black text-[#171717]">{articles}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Video size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">VIDEOS</p>
              <p className="text-xl font-black text-[#171717]">{videos}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
              <Headphones size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">AUDIO & MEDIA</p>
              <p className="text-xl font-black text-[#171717]">{audios}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "characters") {
      const total = allData.characters.length;
      const mainRoles = allData.characters.filter((c) => {
        const r = (c.role || "").toLowerCase();
        return r.includes("main") || r.includes("lead") || r.includes("hero") || r.includes("protagonist");
      }).length || Math.ceil(total * 0.4);
      const supportingRoles = Math.max(0, total - mainRoles);
      const fandomsCount = new Set(allData.characters.map((c) => c.category || c.fandom).filter(Boolean)).size || categories.length;

      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FFF2ED] text-[#FF5F1F] flex items-center justify-center shrink-0">
              <Users size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">TOTAL CHARACTERS</p>
              <p className="text-xl font-black text-[#171717]">{total}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Sparkles size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">MAIN PROTAGONISTS</p>
              <p className="text-xl font-black text-[#171717]">{mainRoles}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">SUPPORTING CAST</p>
              <p className="text-xl font-black text-[#171717]">{supportingRoles}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
              <Layers size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">ACTIVE FANDOMS</p>
              <p className="text-xl font-black text-[#171717]">{fandomsCount}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "merchandise") {
      const total = allData.merchandise.length;
      const inStock = allData.merchandise.filter((m) => {
        const s = (m.status || m.stockStatus || "").toLowerCase();
        return s.includes("stock") || s === "active" || s === "available";
      }).length || total;
      const preOrders = allData.merchandise.filter((m) => {
        const s = (m.status || m.releaseStatus || "").toLowerCase();
        return s.includes("pre-order") || s.includes("upcoming");
      }).length;
      const merchCategories = new Set(allData.merchandise.map((m) => m.category).filter(Boolean)).size || categories.length;

      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FFF2ED] text-[#FF5F1F] flex items-center justify-center shrink-0">
              <ShoppingBag size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">TOTAL MERCHANDISE</p>
              <p className="text-xl font-black text-[#171717]">{total}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <PackageCheck size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">IN STOCK & ACTIVE</p>
              <p className="text-xl font-black text-[#171717]">{inStock}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Clock size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">PRE-ORDERS</p>
              <p className="text-xl font-black text-[#171717]">{preOrders}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
              <Tag size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">CATEGORIES</p>
              <p className="text-xl font-black text-[#171717]">{merchCategories}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "category") {
      const total = categories.length;
      const totalContent = allData.content.length;
      const totalChars = allData.characters.length;
      const totalMerch = allData.merchandise.length;

      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FFF2ED] text-[#FF5F1F] flex items-center justify-center shrink-0">
              <FolderTree size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">TOTAL CATEGORIES</p>
              <p className="text-xl font-black text-[#171717]">{total}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <FileText size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">ARTICLES & MEDIA</p>
              <p className="text-xl font-black text-[#171717]">{totalContent}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Users size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">LINKED CHARACTERS</p>
              <p className="text-xl font-black text-[#171717]">{totalChars}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
              <ShoppingBag size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">MERCHANDISE ITEMS</p>
              <p className="text-xl font-black text-[#171717]">{totalMerch}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const headerInfo = getPageHeaderInfo();

  if (loading) {
    return <AdminLoadingScreen type="table" />;
  }

  return (
    <div className="w-full bg-[#FFFDF7] min-h-screen text-[#231C14] font-baloo pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* 1. HEADER ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
              {headerInfo.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
              {headerInfo.subtitle}
            </p>
          </div>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-xs uppercase tracking-wider px-5 py-3 rounded-none shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>ADD NEW</span>
          </button>
        </div>

        {/* 2. STAT CARDS ROW */}
        {renderAnalyticsCards()}

        {/* 3. FILTER CONTROLS ROW */}
        <div className="flex flex-wrap items-end gap-3.5 pt-1">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-1 w-full sm:w-[220px]">
            <label className="text-[11px] font-bold text-[#7A6F64] uppercase tracking-wider pl-0.5">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer shadow-2xs pr-8"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronsUpDown size={14} className="absolute right-3 top-3 text-[#A09485] pointer-events-none" />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[260px] relative">
            <Search size={14} className="absolute left-3.5 top-3.5 text-[#A09485] pointer-events-none" />
            <input
              type="text"
              placeholder={currentConfig.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] placeholder:text-[#A09485] focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1 w-full sm:w-[220px]">
            <label className="text-[11px] font-bold text-[#7A6F64] uppercase tracking-wider pl-0.5">
              Status
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer shadow-2xs pr-8"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronsUpDown size={14} className="absolute right-3 top-3 text-[#A09485] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. DATA-DRIVEN DYNAMIC CONTENT TABLE */}
        <div className="bg-white border border-[#EBE6DD] rounded-none overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F0E8DD] bg-[#FAF8F5]">
                  {currentConfig.columns.map((col) => (
                    <th
                      key={col.key}
                      className={`text-[10px] font-black text-[#A09485] uppercase tracking-wider py-3.5 px-4 ${col.align === "right" ? "text-right" : ""
                        }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0E8DD]">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={currentConfig.columns.length} className="py-8 text-center text-xs font-bold text-[#7A6F64]">
                      No items found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors group">
                      {currentConfig.columns.map((col) => (
                        <td
                          key={col.key}
                          className={`py-3.5 px-4 ${col.align === "right" ? "text-right" : ""}`}
                        >
                          {renderCellContent(item, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 5. TABLE FOOTER & PAGINATION */}
          <div className="px-4 sm:px-6 py-4 border-t border-[#F0E8DD] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#7A6F64]">
              Showing 1-{filteredList.length} of {filteredList.length} items
            </span>

            {/* Page Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-7 h-7 rounded-none border border-[#EBE6DD] bg-[#F3EFE6] text-[#7A6F64] hover:bg-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                &lt;
              </button>

              <button
                type="button"
                className="w-7 h-7 rounded-none bg-[#FFCC00] text-black font-black text-xs flex items-center justify-center shadow-2xs"
              >
                1
              </button>

              <button
                type="button"
                className="w-7 h-7 rounded-none border border-[#EBE6DD] bg-[#F3EFE6] text-[#7A6F64] hover:bg-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ADD / EDIT CONTENT MODAL POPUP */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-none border border-stone-200 max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-stone-900 font-sans">

            {/* 1. Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-start justify-between bg-white">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-stone-900 stroke-[2.2] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-titan uppercase tracking-tight text-stone-900 leading-none">
                    {editingItem ? "EDIT ITEM" : "ADD NEW ITEM"}
                  </h3>
                  <p className="text-xs font-medium text-stone-500 mt-1">
                    Manage content, category, characters or merchandise item for the platform.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-md text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>

            {/* 2. Form Body */}
            <form onSubmit={editingItem ? handleSaveEdit : handleSaveAdd} className="p-6 space-y-4">

              {/* Characters Form */}
              {modalType === "characters" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        Character Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter character name..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Bio / Role
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter character biography or role details..."
                      className="w-full text-xs font-medium p-3 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 leading-relaxed focus:outline-none focus:border-[#FF5F1F] shadow-2xs resize-y"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Character Image
                      </label>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Upload image or enter URL
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL..."
                        value={formData.imageUrl || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value });
                          setSelectedFile(null);
                        }}
                        className="flex-1 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                      />

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer shrink-0"
                      >
                        BROWSE IMAGE
                      </button>
                    </div>

                    {selectedFile && (
                      <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                        Selected Image: {selectedFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Tags
                    </label>
                    <div className="w-full min-h-[40px] px-2.5 py-1.5 rounded-xl border border-stone-200 bg-[#FAF9F5] flex flex-wrap items-center gap-1.5 focus-within:border-[#FF5F1F] shadow-2xs">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-[#EBE5D8] text-stone-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-600 cursor-pointer text-stone-500 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add tag and press Enter..."
                        value={formData.tagInput}
                        onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                        onKeyDown={handleAddTag}
                        className="flex-1 min-w-[80px] bg-transparent text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none py-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Merchandise Form */}
              {modalType === "merchandise" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter merchandise name..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        Tags / Collection Tag <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.tag || "Collectible"}
                          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                          className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-9 shadow-2xs"
                        >
                          <option value="Collectible">Collectible</option>
                          <option value="Limited Edition">Limited Edition</option>
                          <option value="Pre-Order">Pre-Order</option>
                        </select>
                        <ChevronsUpDown size={14} className="absolute right-3 top-3 text-stone-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="pt-5">
                      <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs text-stone-800 bg-[#FAF9F5] p-3 rounded-xl border border-stone-200">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.isUpcoming)}
                          onChange={(e) => setFormData({ ...formData, isUpcoming: e.target.checked })}
                          className="w-4 h-4 rounded text-[#FF5F1F] focus:ring-[#FF5F1F] cursor-pointer"
                        />
                        <span>Is Upcoming (Pre-order item)</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Product Image
                      </label>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Upload image or enter URL
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL..."
                        value={formData.imageUrl || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value });
                          setSelectedFile(null);
                        }}
                        className="flex-1 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                      />

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer shrink-0"
                      >
                        BROWSE IMAGE
                      </button>
                    </div>

                    {selectedFile && (
                      <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                        Selected Image: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Category Form */}
              {modalType === "category" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter category name..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Description (desc)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter category description..."
                      className="w-full text-xs font-medium p-3 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 leading-relaxed focus:outline-none focus:border-[#FF5F1F] shadow-2xs resize-y"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Category Image / Icon URL (iconurl)
                      </label>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Enter icon URL or browse image file
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Paste category icon URL..."
                        value={formData.iconUrl || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, iconUrl: e.target.value });
                          setSelectedFile(null);
                        }}
                        className="flex-1 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                      />

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer shrink-0"
                      >
                        BROWSE ICON
                      </button>
                    </div>

                    {selectedFile && (
                      <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                        Selected File: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Content Form */}
              {modalType === "content" && (
                <div className="space-y-4">
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
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-9 shadow-2xs font-bold"
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
                          value={formData.contentType}
                          onChange={(e) => {
                            setSelectedFile(null);
                            setSelectedFiles([]);
                            setSelectedThumbnailFile(null);
                            setFormError("");
                            setFormData({
                              ...formData,
                              contentType: e.target.value,
                              mediaType: e.target.value
                            });
                          }}
                          className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-9 shadow-2xs"
                        >
                          <option value="Article">Article</option>
                          <option value="Audio">Audio</option>
                          <option value="Video">Video</option>
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
                        {formData.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-[#EBE5D8] text-stone-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-red-600 cursor-pointer text-stone-500 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Add tags..."
                          value={formData.tagInput}
                          onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                          onKeyDown={handleAddTag}
                          className="flex-1 min-w-[80px] bg-transparent text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none py-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Description / Subtitle <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      maxLength={1000}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter content summary, lore details or description..."
                      className="w-full text-xs font-medium p-3 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 leading-relaxed focus:outline-none focus:border-[#FF5F1F] shadow-2xs resize-y"
                    />
                  </div>

                  {/* Row 4: Media Asset & Thumbnail Inputs based on Content Type */}
                  <div className="space-y-4">
                    {/* 1. Article Options: Shown only when type is Article or Wiki / Review */}
                    {(formData.contentType.toLowerCase() === "article" || formData.contentType.toLowerCase() === "wiki / review") && (
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

                        <div className="border border-dashed border-stone-300 bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                          <FileText size={18} className="text-stone-500" />
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
                            className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-xl cursor-pointer"
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

                    {/* 2. Video Options: Shown only when type is Video / Trailer */}
                    {(formData.contentType.toLowerCase() === "video" || formData.contentType.toLowerCase() === "trailer") && (
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
                              setFormData((prev) => ({ ...prev, videoSource: "url" }));
                              setSelectedFile(null);
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${formData.videoSource === "url"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-600 hover:text-stone-900"
                              }`}
                          >
                            Paste Video URL
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, videoSource: "file", videoUrl: "" }));
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${formData.videoSource === "file"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-600 hover:text-stone-900"
                              }`}
                          >
                            Upload Video File
                          </button>
                        </div>

                        {formData.videoSource === "url" ? (
                          <div>
                            <input
                              type="url"
                              placeholder="Enter video URL (e.g. YouTube, Vimeo or MP4 stream)..."
                              value={formData.videoUrl}
                              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                            />
                          </div>
                        ) : (
                          <div className="border border-dashed border-stone-300 bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleVideoFileChange}
                              accept="video/*"
                              className="hidden"
                            />
                            <Upload size={16} className="text-stone-500" />
                            <p className="text-xs font-bold text-stone-800">
                              Choose MP4, WebM or MKV video
                            </p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-xl cursor-pointer"
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

                    {/* 3. Image Options: Toggle between upload multiple images or paste image URL */}
                    {formData.contentType.toLowerCase() === "image" && (
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
                              setFormData((prev) => ({ ...prev, imageSource: "upload", imageUrl: "" }));
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${formData.imageSource !== "url"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-600 hover:text-stone-900"
                              }`}
                          >
                            Upload Images
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, imageSource: "url" }));
                              setSelectedFiles([]);
                              setSelectedFile(null);
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${formData.imageSource === "url"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-600 hover:text-stone-900"
                              }`}
                          >
                            Paste Image URL
                          </button>
                        </div>

                        {formData.imageSource === "url" ? (
                          <div>
                            <input
                              type="url"
                              placeholder="Enter image URL (e.g. https://...)..."
                              value={formData.imageUrl || ""}
                              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                            />
                          </div>
                        ) : (
                          <div className="border border-dashed border-stone-300 bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                            <input
                              type="file"
                              multiple
                              ref={fileInputRef}
                              onChange={handleMultipleImagesChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <Upload size={16} className="text-stone-500" />
                            <p className="text-xs font-bold text-stone-800">
                              Upload one or multiple images
                            </p>
                            <p className="text-[10px] font-medium text-stone-500">
                              (JPG, PNG, WebP — multiple files allowed)
                            </p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-xl cursor-pointer"
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

                    {/* 4. Audio Options: When type is Audio */}
                    {formData.contentType.toLowerCase() === "audio" && (
                      <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
                        <label className="text-xs font-bold text-stone-800 block">
                          Audio File or Stream Link <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Paste audio stream URL (or select file below)..."
                          value={formData.audioUrl || ""}
                          onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs mb-1"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSelectedFile(file);
                          }}
                          accept="audio/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          Browse Audio File (MP3, WAV)
                        </button>
                        {selectedFile && (
                          <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md mt-1">
                            Audio: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 5. Thumbnail Image / URL: ONLY shown when type is Article, Video, or Audio */}
                    {(formData.contentType.toLowerCase() === "article" ||
                      formData.contentType.toLowerCase() === "video" ||
                      formData.contentType.toLowerCase() === "trailer" ||
                      formData.contentType.toLowerCase() === "audio" ||
                      formData.contentType.toLowerCase() === "wiki / review") && (
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
                              value={formData.thumbnailUrl}
                              onChange={(e) => {
                                setFormData({ ...formData, thumbnailUrl: e.target.value });
                                setSelectedThumbnailFile(null);
                              }}
                              className="flex-1 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                            />

                            <input
                              type="file"
                              ref={thumbnailInputRef}
                              onChange={handleThumbnailChange}
                              accept="image/*"
                              className="hidden"
                            />

                            <button
                              type="button"
                              onClick={() => thumbnailInputRef.current?.click()}
                              className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer shrink-0"
                            >
                              BROWSE THUMBNAIL
                            </button>
                          </div>

                          {selectedThumbnailFile && (
                            <p className="text-xs font-bold text-[#0B6636] bg-[#DCFCE7] px-3 py-1 rounded-md">
                              Thumbnail: {selectedThumbnailFile.name}
                            </p>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Status <span className="text-red-500">*</span>
                    </label>

                    <div className="bg-[#EAE6DE] p-1 inline-flex items-center rounded-full border border-stone-200/60 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: "Published" })}
                        className={`px-5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${formData.status === "Published"
                          ? "bg-[#0B6636] text-white shadow-xs"
                          : "text-stone-700 hover:text-stone-900"
                          }`}
                      >
                        <span>Published</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: "Draft" })}
                        className={`px-5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${formData.status === "Draft"
                          ? "bg-[#0B6636] text-white shadow-xs"
                          : "text-stone-700 hover:text-stone-900"
                          }`}
                      >
                        <span>Draft</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-6 py-2.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-2xs"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#FFCC00] hover:bg-[#F2C200] disabled:opacity-60 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-2xs transition-transform active:scale-95"
                >
                  {isSubmitting ? "SAVING..." : "SAVE ITEM"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-[#EDE4D6] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[#171717] font-titan uppercase">
              Confirm Delete
            </h3>
            <p className="text-xs text-[#7A6F64] font-medium leading-relaxed">
              Are you sure you want to delete <strong className="text-[#171717]">"{deletingItem.title}"</strong>? This action cannot be undone.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-[#EDE4D6] text-xs font-bold text-[#7A6F64] hover:bg-stone-50 uppercase rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs tracking-wider uppercase rounded-lg cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export { ManageContentPage };
