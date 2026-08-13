import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Footer } from "../components/layout/Footer";
import { SEO } from "../components/seo/SEO";

export default function AdminDashboard() {
  // 1. Set up state variables to hold our form inputs
  const [id, setId] = useState(""); // e.g., 'maison-asrar-vanilla-voyage'
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<"men" | "women" | "unisex">(
    "unisex",
  );
  const [type, setType] = useState("EDP"); // e.g., EDP, EDT
  const [price, setPrice] = useState<number>(0);
  const [size, setSize] = useState("100ml");
  const [images, setImages] = useState<string[]>([""]); // Array of image path strings
  const [description, setDescription] = useState("");

  // Scent notes
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");

  // Status flags
  const [isNew, setIsNew] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Image Renamer State
  const [subfolder, setSubfolder] = useState("/images"); // Folder inside 'public'
  const [rawFiles, setRawFiles] = useState<
    {
      id: string;
      file: File;
      previewUrl: string;
      role: "display" | "pack" | "extra";
    }[]
  >([]);

  // Automatically calculate path names when ID, subfolder, or raw files change
  useEffect(() => {
    if (!id) {
      // If there's no product ID, we can't rename files yet
      return;
    }

    let extraCount = 2; // track index for extra images (e.g. 3, 4, 5...)
    const calculatedPaths = rawFiles.map((item) => {
      const fileExt = item.file.name.split(".").pop() || "jpg";
      const cleanSubfolder = subfolder.endsWith("/")
        ? subfolder.slice(0, -1)
        : subfolder;

      let finalName = "";
      if (item.role === "display") {
        finalName = `${id}-display.${fileExt}`;
      } else if (item.role === "pack") {
        finalName = `${id}-pack.${fileExt}`;
      } else {
        extraCount += 1;
        finalName = `${id}-${extraCount}.${fileExt}`;
      }

      return `${cleanSubfolder}/${finalName}`;
    });

    if (calculatedPaths.length > 0) {
      setImages(calculatedPaths);
    }
  }, [id, subfolder, rawFiles]);

  // 2. The function that uploads the product to Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name || !price) {
      alert("Please fill in at least the ID, Name, and Price!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Prepare the product object matching your database structure
      const productData = {
        name,
        brand,
        category,
        type,
        price: Number(price),
        size,
        image: images.filter((img) => img.trim() !== "")[0] || "", // First image is the main cover
        images: images.filter((img) => img.trim() !== ""), // All filled image paths
        description,
        details: {
          topNotes: topNotes.split(",").map((note) => note.trim()),
          heartNotes: heartNotes.split(",").map((note) => note.trim()),
          baseNotes: baseNotes.split(",").map((note) => note.trim()),
        },
        isNew,
        inStock,
        featured,
        collection: null,
        createdAt: serverTimestamp(),
      };

      // Upload to Firestore: collection 'products', document key is 'id'
      await setDoc(doc(db, "products", id), productData);

      setMessage(`🎉 Product "${name}" successfully added to Firebase!`);

      // Clear form inputs
      setId("");
      setName("");
      setBrand("");
      setPrice(0);
      setImages([""]); // Reset back to a single empty image slot
      setDescription("");
      setTopNotes("");
      setHeartNotes("");
      setBaseNotes("");
    } catch (error: any) {
      console.error("Error adding product: ", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Downloads all selected images renamed to match their paths
  const handleDownloadRenamed = () => {
    if (!id) {
      alert("Please fill in the Product ID first!");
      return;
    }

    let extraCount = 2;
    rawFiles.forEach((item) => {
      const fileExt = item.file.name.split(".").pop() || "jpg";
      let finalName = "";

      if (item.role === "display") {
        finalName = `${id}-display.${fileExt}`;
      } else if (item.role === "pack") {
        finalName = `${id}-pack.${fileExt}`;
      } else {
        extraCount += 1;
        finalName = `${id}-${extraCount}.${fileExt}`;
      }

      // Create a temporary link and trigger browser download
      const link = document.createElement("a");
      link.href = item.previewUrl;
      link.download = finalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <>
      <SEO title="Admin" description="Internal tool." path="/admin" noindex />
      <div
        style={{
          maxWidth: "800px",
          margin: "120px auto 60px",
          padding: "40px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--gold-line)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--gold)",
            marginBottom: "24px",
            fontSize: "32px",
          }}
        >
          Admin Dashboard: Add New Product
        </h1>

        {message && (
          <div
            style={{
              padding: "16px",
              marginBottom: "24px",
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              color: "var(--text-primary)",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          {/* 1. Product ID / Slug (Unique key for URL) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", color: "var(--gold-muted)" }}>
              PRODUCT ID (lowercase, hyphens instead of spaces, e.g.
              "chanel-bleu-de-chanel")
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. dior-sauvage-edp"
              required
              style={{
                padding: "10px",
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          {/* 2. Product Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", color: "var(--gold-muted)" }}>
              PRODUCT NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const newName = e.target.value;
                setName(newName);

                // Automatically convert "Bleu de Chanel" -> "bleu-de-chanel"
                const autoId = newName
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, "") // Remove special characters (like apostrophes)
                  .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
                  .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen

                setId(autoId);
              }}
              placeholder="e.g. Sauvage EDP"
              required
              style={{
                padding: "10px",
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          {/* 3. Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", color: "var(--gold-muted)" }}>
              BRAND
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Dior"
              required
              style={{
                padding: "10px",
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          {/* 4. Price & Size */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "12px", color: "var(--gold-muted)" }}>
                PRICE (in your currency, number only)
              </label>
              <input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="e.g. 75000"
                required
                style={{
                  padding: "10px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "12px", color: "var(--gold-muted)" }}>
                SIZE
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 100ml, 50ml"
                required
                style={{
                  padding: "10px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* 5. Category & Type */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "12px", color: "var(--gold-muted)" }}>
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "men" | "women" | "unisex")
                }
                style={{
                  padding: "10px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              >
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "12px", color: "var(--gold-muted)" }}>
                TYPE
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. EDP, EDT, Parfum"
                required
                style={{
                  padding: "10px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* 6. Image Path/URL */}

          {/* 6. Smart Scent Image Renamer & Auto-Path Loader */}
          <div
            style={{
              border: "1px solid var(--gold-line)",
              padding: "24px",
              background: "var(--bg-surface)",
              display: "grid",
              gap: "16px",
            }}
          >
            <h3 style={{ color: "var(--gold)", fontSize: "16px", margin: 0 }}>
              📸 Smart Image Renamer & Path Auto-Loader
            </h3>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              1. Type your <strong>Product ID</strong> above.
              <br />
              2. Drag or select your raw image files below.
              <br />
              3. Assign roles and click{" "}
              <strong>"Download Renamed Images"</strong> to save them straight
              to your computer. The database paths will populate automatically!
            </p>

            {/* Subfolder Config */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                PROJECT IMAGES SUBFOLDER (relative to public/)
              </label>
              <input
                type="text"
                value={subfolder}
                onChange={(e) => setSubfolder(e.target.value)}
                placeholder="e.g. /images"
                style={{
                  padding: "8px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--bg-border)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            {/* Drag & Drop File Selector */}
            <div
              style={{
                border: "2px dashed var(--gold-muted)",
                padding: "30px",
                textAlign: "center",
                background: "var(--bg-elevated)",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                type="file"
                id="file-input"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    const filesArray = Array.from(e.target.files).map(
                      (file, idx) => {
                        // Default role assignment: first display, second pack, rest extra
                        let role: "display" | "pack" | "extra" = "extra";
                        if (rawFiles.length + idx === 0) role = "display";
                        else if (rawFiles.length + idx === 1) role = "pack";

                        return {
                          id: Math.random().toString(36).substring(2, 9),
                          file,
                          previewUrl: URL.createObjectURL(file),
                          role,
                        };
                      },
                    );
                    setRawFiles([...rawFiles, ...filesArray]);
                  }
                }}
                style={{ display: "none" }}
              />
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                📁 Drag & Drop Images Here or{" "}
                <span
                  style={{ color: "var(--gold)", textDecoration: "underline" }}
                >
                  Browse
                </span>
              </p>
            </div>

            {/* Uploaded Files Preview & Role Mapping */}
            {rawFiles.length > 0 && (
              <div style={{ display: "grid", gap: "16px", marginTop: "10px" }}>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--gold-muted)",
                    margin: 0,
                  }}
                >
                  MATCH & RENAME YOUR IMAGES:
                </p>
                {rawFiles.map((item, index) => {
                  const fileExt = item.file.name.split(".").pop() || "jpg";
                  const cleanSubfolder = subfolder.endsWith("/")
                    ? subfolder.slice(0, -1)
                    : subfolder;

                  // Preview calculation of the renamed output
                  let displayNewName = "";
                  if (item.role === "display")
                    displayNewName = `${id || "[id]"}-display.${fileExt}`;
                  else if (item.role === "pack")
                    displayNewName = `${id || "[id]"}-pack.${fileExt}`;
                  else
                    displayNewName = `${id || "[id]"}-${index + 2}.${fileExt}`; // index offset for extras

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                        padding: "12px",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--bg-border)",
                      }}
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={item.previewUrl}
                        alt="preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          border: "1px solid var(--bg-border)",
                        }}
                      />

                      {/* Info & Renaming Result */}
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: "13px",
                            margin: "0 0 4px 0",
                            color: "var(--text-primary)",
                            wordBreak: "break-all",
                          }}
                        >
                          Original:{" "}
                          <span style={{ color: "var(--text-muted)" }}>
                            {item.file.name}
                          </span>
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            margin: 0,
                            color: "var(--gold)",
                            fontWeight: 500,
                          }}
                        >
                          Renames to: <span>{displayNewName}</span>
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            margin: "4px 0 0 0",
                            color: "var(--text-muted)",
                          }}
                        >
                          DB Path: {cleanSubfolder}/{displayNewName}
                        </p>
                      </div>

                      {/* Role Selector & Delete */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <select
                          value={item.role}
                          onChange={(e) => {
                            const updated = [...rawFiles];
                            updated[index].role = e.target.value as
                              | "display"
                              | "pack"
                              | "extra";
                            setRawFiles(updated);
                          }}
                          style={{
                            padding: "6px",
                            background: "var(--bg-surface)",
                            border: "1px solid var(--bg-border)",
                            color: "var(--text-primary)",
                            fontSize: "11px",
                          }}
                        >
                          <option value="display">Cover Display</option>
                          <option value="pack">Packaging Box</option>
                          <option value="extra">Extra Detail</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            // Revoke URL to prevent memory leaks, then remove from list
                            URL.revokeObjectURL(item.previewUrl);
                            setRawFiles(
                              rawFiles.filter((rf) => rf.id !== item.id),
                            );
                          }}
                          style={{
                            padding: "6px 12px",
                            background: "#5a0000",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "11px",
                          }}
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Download Actions */}
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={handleDownloadRenamed}
                    disabled={!id}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      background: id ? "var(--gold)" : "var(--bg-elevated)",
                      color: id ? "var(--bg-primary)" : "var(--text-muted)",
                      border: "none",
                      cursor: id ? "pointer" : "not-allowed",
                      fontFamily: "var(--font-label)",
                      fontSize: "11px",
                      letterSpacing: "0.05em",
                      fontWeight: 600,
                    }}
                  >
                    📥 DOWNLOAD ALL RENAMED IMAGES
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      rawFiles.forEach((f) =>
                        URL.revokeObjectURL(f.previewUrl),
                      );
                      setRawFiles([]);
                    }}
                    style={{
                      padding: "10px 16px",
                      background: "transparent",
                      border: "1px solid var(--bg-border)",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: "11px",
                    }}
                  >
                    CLEAR ALL
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* 8. Scent Notes (Top, Heart, Base) */}
          <div
            style={{
              border: "1px solid var(--bg-border)",
              padding: "16px",
              background: "var(--bg-surface)",
            }}
          >
            <p
              style={{
                color: "var(--gold)",
                fontSize: "14px",
                marginBottom: "12px",
              }}
            >
              Scent Notes (separate with commas)
            </p>
            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                >
                  TOP NOTES
                </label>
                <input
                  type="text"
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  placeholder="e.g. Bergamot, Pepper, Mandarin"
                  style={{
                    padding: "8px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--bg-border)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                >
                  HEART NOTES
                </label>
                <input
                  type="text"
                  value={heartNotes}
                  onChange={(e) => setHeartNotes(e.target.value)}
                  placeholder="e.g. Lavender, Patchouli, Geranium"
                  style={{
                    padding: "8px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--bg-border)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                >
                  BASE NOTES
                </label>
                <input
                  type="text"
                  value={baseNotes}
                  onChange={(e) => setBaseNotes(e.target.value)}
                  placeholder="e.g. Cedar, Labdanum, Ambroxan"
                  style={{
                    padding: "8px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--bg-border)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* 9. Options Checks (isNew, inStock, featured) */}
          <div style={{ display: "flex", gap: "24px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
              />
              Is New Product?
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              In Stock?
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Featured Product?
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: "12px", fontSize: "16px", marginTop: "12px" }}
          >
            {loading ? "UPLOADING..." : "ADD PRODUCT TO FIREBASE"}
          </button>
        </form>
      </div>
      <Footer variant="full" />
    </>
  );
}
